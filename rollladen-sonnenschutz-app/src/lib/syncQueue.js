export const SYNC_STATUS = Object.freeze({
  PENDING: "pending",
  SYNCING: "syncing",
  FAILED: "failed",
  SYNCED: "synced",
});

export const MAX_AUTO_RETRIES = 3;

const MAX_SYNCED_HISTORY = 50;
const IMMEDIATE_ACTION = /(status geändert|abgeschlossen|abschließen|angelegt|erstellt|bestätigt|archiviert|gelöscht|person.*created)/i;

function nowIso(now = Date.now()) {
  return new Date(now).toISOString();
}

function createQueueId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `sync-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeStatus(status) {
  if ([SYNC_STATUS.SYNCED, "synchronisiert"].includes(status)) return SYNC_STATUS.SYNCED;
  if ([SYNC_STATUS.FAILED, "fehlgeschlagen", "fehler"].includes(status)) return SYNC_STATUS.FAILED;
  if (status === SYNC_STATUS.SYNCING) return SYNC_STATUS.SYNCING;
  return SYNC_STATUS.PENDING;
}

export function inferSyncMetadata(action = "Lokale Änderung", data = {}) {
  const label = String(action || "Lokale Änderung");
  const normalized = label.toLocaleLowerCase("de-DE");
  let type = "snapshot";
  if (normalized.includes("checkliste")) type = "checklist";
  else if (normalized.includes("foto")) type = "photoMetadata";
  else if (normalized.includes("aufmaß") || normalized.includes("mess")) type = "measurement";
  else if (normalized.includes("berichtsheft") || normalized.includes("bericht")) type = "reportBook";
  else if (normalized.includes("lern")) type = "learningProgress";
  else if (normalized.includes("skizze")) type = "sketch";
  else if (normalized.includes("pdf") || normalized.includes("dokument")) type = "pdfMetadata";
  else if (normalized.includes("ersatzteil")) type = "partRequest";
  else if (normalized.includes("person") || normalized.includes("team.")) type = "person";
  else if (normalized.includes("firma") || normalized.includes("company")) type = "company";
  else if (normalized.includes("auftrag") || normalized.includes("termin")) type = "order";

  const recordId = data.recordId
    || data.orderId
    || data.personId
    || data.sketchId
    || data.reportId
    || data.requestId
    || data.learnerId
    || data.id
    || data.to
    || data.from
    || "app";

  return { type, recordId: String(recordId), immediate: IMMEDIATE_ACTION.test(label) };
}

export function createSyncQueueItem(action, data = {}, offline = false, options = {}) {
  const metadata = inferSyncMetadata(action, data);
  const createdAt = nowIso(options.now);
  return {
    id: options.id || createQueueId(),
    type: options.type || metadata.type,
    recordId: String(options.recordId || metadata.recordId),
    action: String(action || "Lokale Änderung"),
    data: data && typeof data === "object" ? data : { value: data },
    createdAt,
    updatedAt: createdAt,
    retryCount: 0,
    status: SYNC_STATUS.PENDING,
    priority: (options.immediate ?? metadata.immediate) ? "immediate" : "debounced",
    queuedOffline: Boolean(offline),
    nextRetryAt: null,
    lastError: null,
  };
}

export function normalizeSyncQueueItem(item = {}, index = 0) {
  const data = item.data ?? item.payload ?? {};
  const metadata = inferSyncMetadata(item.action, data);
  const createdAt = typeof item.createdAt === "string" && item.createdAt.includes("T") ? item.createdAt : nowIso();
  return {
    id: String(item.id || `${createQueueId()}-${index}`),
    type: item.type || metadata.type,
    recordId: String(item.recordId || metadata.recordId),
    action: String(item.action || "Lokale Änderung"),
    data: data && typeof data === "object" ? data : { value: data },
    createdAt,
    updatedAt: item.updatedAt || createdAt,
    retryCount: Math.max(0, Number(item.retryCount) || 0),
    status: normalizeStatus(item.status),
    priority: item.priority === "immediate" || metadata.immediate ? "immediate" : "debounced",
    queuedOffline: Boolean(item.queuedOffline || String(item.status || "").includes("offline")),
    nextRetryAt: item.nextRetryAt || null,
    lastError: item.lastError || item.data?.error || item.payload?.error || null,
    syncedAt: item.syncedAt || null,
  };
}

export function normalizeSyncQueue(queue) {
  if (!Array.isArray(queue)) return [];
  const seen = new Set();
  return queue.map(normalizeSyncQueueItem).map((item) => {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      return item;
    }
    const id = createQueueId();
    seen.add(id);
    return { ...item, id };
  });
}

export function restoreSyncQueue(queue) {
  return normalizeSyncQueue(queue).map((item) => item.status === SYNC_STATUS.SYNCING ? {
    ...item,
    status: SYNC_STATUS.PENDING,
    nextRetryAt: null,
  } : item);
}

function keepUsefulHistory(queue) {
  const unsynced = queue.filter((item) => item.status !== SYNC_STATUS.SYNCED);
  const synced = queue.filter((item) => item.status === SYNC_STATUS.SYNCED).slice(0, MAX_SYNCED_HISTORY);
  return [...unsynced, ...synced];
}

export function enqueueSyncItem(queue, action, data = {}, offline = false, options = {}) {
  const normalized = normalizeSyncQueue(queue);
  const item = createSyncQueueItem(action, data, offline, options);
  return keepUsefulHistory([item, ...normalized]);
}

export function queueLocalChange(queue, offline = false, data = {}) {
  const normalized = normalizeSyncQueue(queue);
  const existingIndex = normalized.findIndex((item) => item.type === "snapshot" && item.status === SYNC_STATUS.PENDING && item.action === "Lokale Änderungen");
  if (existingIndex < 0) return enqueueSyncItem(normalized, "Lokale Änderungen", data, offline, { type: "snapshot", recordId: "app" });

  const updatedAt = nowIso();
  return normalized.map((item, index) => index === existingIndex ? {
    ...item,
    data: {
      ...item.data,
      ...data,
      orderIds: [...new Set([...(item.data.orderIds || []), item.data.orderId, data.orderId].filter(Boolean))],
    },
    updatedAt,
    queuedOffline: item.queuedOffline || offline,
    nextRetryAt: null,
  } : item);
}

export function ensureRetryQueued(queue, message, offline = false) {
  const normalized = normalizeSyncQueue(queue);
  if (normalized.some((item) => item.status !== SYNC_STATUS.SYNCED)) return normalized;
  return enqueueSyncItem(normalized, "Lokale Änderungen", { error: message }, offline, { type: "snapshot", recordId: "app" });
}

function identifierSet(queue, identifiers) {
  if (Array.isArray(identifiers)) return new Set(identifiers.map(String));
  // Kompatibilität mit dem früheren numerischen throughId-Format.
  const throughId = Number(identifiers);
  return new Set(queue.filter((item) => Number(item.id) <= throughId).map((item) => String(item.id)));
}

export function markQueueSyncing(queue, identifiers) {
  const normalized = normalizeSyncQueue(queue);
  const ids = identifierSet(normalized, identifiers);
  const updatedAt = nowIso();
  return normalized.map((item) => ids.has(item.id) ? { ...item, status: SYNC_STATUS.SYNCING, updatedAt, lastError: null } : item);
}

export function markQueueSynced(queue, identifiers) {
  const normalized = normalizeSyncQueue(queue);
  const ids = identifierSet(normalized, identifiers);
  const syncedAt = nowIso();
  return keepUsefulHistory(normalized.map((item) => ids.has(item.id) ? {
    ...item,
    status: SYNC_STATUS.SYNCED,
    updatedAt: syncedAt,
    syncedAt,
    nextRetryAt: null,
    lastError: null,
  } : item));
}

export function markQueueFailed(queue, identifiers, error, options = {}) {
  const normalized = normalizeSyncQueue(queue);
  const ids = identifierSet(normalized, identifiers);
  const now = Number(options.now) || Date.now();
  return normalized.map((item) => {
    if (!ids.has(item.id)) return item;
    const retryCount = item.retryCount + 1;
    const terminal = retryCount >= (options.maxRetries || MAX_AUTO_RETRIES);
    const retryDelay = Math.min(30000, 2000 * (4 ** Math.max(0, retryCount - 1)));
    return {
      ...item,
      retryCount,
      status: terminal ? SYNC_STATUS.FAILED : SYNC_STATUS.PENDING,
      updatedAt: nowIso(now),
      nextRetryAt: terminal ? null : nowIso(now + retryDelay),
      lastError: String(error || "Synchronisierung fehlgeschlagen"),
    };
  });
}

export function retryFailedQueue(queue) {
  const updatedAt = nowIso();
  return normalizeSyncQueue(queue).map((item) => item.status !== SYNC_STATUS.SYNCED ? {
    ...item,
    status: SYNC_STATUS.PENDING,
    retryCount: 0,
    updatedAt,
    nextRetryAt: null,
    lastError: null,
  } : item);
}

export function getSyncableQueueItems(queue, options = {}) {
  const now = Number(options.now) || Date.now();
  return normalizeSyncQueue(queue).filter((item) => {
    if (item.status === SYNC_STATUS.FAILED) return Boolean(options.includeFailed);
    if (item.status !== SYNC_STATUS.PENDING) return false;
    return !item.nextRetryAt || new Date(item.nextRetryAt).getTime() <= now;
  });
}

export function getQueueSummary(queue) {
  const normalized = normalizeSyncQueue(queue);
  return normalized.reduce((summary, item) => {
    summary[item.status] += 1;
    if (item.status !== SYNC_STATUS.SYNCED) summary.unsynced += 1;
    return summary;
  }, { pending: 0, syncing: 0, failed: 0, synced: 0, unsynced: 0 });
}

export function getAutoSyncState(queue, now = Date.now()) {
  const normalized = normalizeSyncQueue(queue);
  const pending = normalized.filter((item) => item.status === SYNC_STATUS.PENDING);
  const due = pending.filter((item) => !item.nextRetryAt || new Date(item.nextRetryAt).getTime() <= now);
  const nextRetryTime = pending
    .map((item) => item.nextRetryAt ? new Date(item.nextRetryAt).getTime() : now)
    .filter(Number.isFinite)
    .sort((left, right) => left - right)[0];
  const immediate = due.some((item) => item.priority === "immediate");
  const delay = due.length ? (immediate ? 50 : 1200) : Math.max(0, (nextRetryTime || now) - now);
  const version = pending.map((item) => `${item.id}:${item.retryCount}:${item.updatedAt}`).join("|");
  return { delay, hasPending: pending.length > 0, version };
}
