export function createSyncQueueItem(action, payload = {}, offline = false) {
  return {
    id: Date.now(),
    action,
    payload,
    status: offline ? "wartet offline" : "wartet auf Sync",
    createdAt: new Date().toLocaleString("de-DE"),
  };
}

export function enqueueSyncItem(queue, action, payload, offline) {
  return [createSyncQueueItem(action, payload, offline), ...queue].slice(0, 50);
}

export function queueLocalChange(queue, offline) {
  const pendingAction = createSyncQueueItem("Lokale Änderungen", {}, offline);
  const withoutOlderLocalChanges = queue.filter((item) => item.action !== "Lokale Änderungen" || item.status === "synchronisiert");
  return [pendingAction, ...withoutOlderLocalChanges].slice(0, 50);
}

export function ensureRetryQueued(queue, message, offline) {
  if (queue.some((item) => item.status !== "synchronisiert")) return queue;
  return enqueueSyncItem(queue, "Lokale Änderungen synchronisieren", { error: message }, offline);
}

export function markQueueSynced(queue, throughId) {
  const syncedAt = new Date().toLocaleString("de-DE");
  return queue.map((item) => item.id <= throughId ? { ...item, status: "synchronisiert", syncedAt } : item).slice(0, 50);
}
