import { normalizeOrderStatus } from "../data/orders.js";
import { allProductTypes } from "../data/products.js";

export const CUSTOMER_SYNC_TYPES = new Set([
  "customerAppointment",
  "customerMessage",
  "customerIssue",
  "customerApproval",
  "maintenanceRequest",
  "customerFeedback",
]);

export const CUSTOMER_TIME_WINDOWS = ["vormittags", "mittags", "nachmittags", "egal"];
export const CUSTOMER_MESSAGE_TOPICS = ["Termin", "Bedienung", "Dokument", "Pflege", "Rechnung", "Problem", "Sonstiges"];
export const CUSTOMER_ISSUE_CATEGORIES = ["funktioniert nicht", "ungewöhnliches Geräusch", "sichtbarer Schaden", "Bedienung unklar", "Nacharbeit", "sonstiges"];

const statusText = {
  Neu: { label: "Ihre Anfrage ist eingegangen", progress: 10 },
  Geplant: { label: "Ihr Termin ist geplant", progress: 30 },
  "In Vorbereitung": { label: "Ihr Auftrag wird vorbereitet", progress: 45 },
  "In Arbeit": { label: "Die Arbeiten laufen", progress: 65 },
  "Wartet auf Kunde": { label: "Wir warten auf Ihre Rückmeldung", progress: 55 },
  "Wartet auf Material": { label: "Material wird noch vorbereitet oder bestellt", progress: 45 },
  Nacharbeit: { label: "Eine Nacharbeit wird vorbereitet", progress: 75 },
  "Abschluss offen": { label: "Die Dokumentation wird abgeschlossen", progress: 90 },
  Erledigt: { label: "Auftrag abgeschlossen", progress: 100 },
  Archiviert: { label: "Auftrag abgeschlossen", progress: 100 },
};

export const careTipsByProduct = {
  vorbaurollladen: ["Führungsschienen sauber halten.", "Hindernisse im Laufweg vermeiden.", "Bei Frost nicht mit Gewalt bedienen."],
  aufsatzrollladen: ["Führungsschienen sauber halten.", "Hindernisse im Laufweg vermeiden.", "Bei Frost nicht mit Gewalt bedienen."],
  markise: ["Nasses Tuch nicht dauerhaft eingefahren lassen.", "Wind und Wetter beachten.", "Gelenke und Tuch regelmäßig sichtbar kontrollieren."],
  pergola: ["Führungen und Wasserabläufe sauber halten.", "Wind- und Wetterhinweise beachten.", "Tuch und Befestigungen sichtbar kontrollieren."],
  raffstore: ["Lamellen vorsichtig sauber halten.", "Bei starker Vereisung nicht bedienen.", "Führungen regelmäßig sichtbar kontrollieren."],
  zipscreen: ["Seitliche Führungen sauber halten.", "Tuchlauf nicht blockieren.", "Bei Vereisung nicht bedienen."],
  screen_offen: ["Tuch und Führungen sauber halten.", "Bei starkem Wind nicht unnötig betreiben.", "Hindernisse aus dem Laufweg entfernen."],
  insektenschutz: ["Gewebe mit milden Mitteln reinigen.", "Profile und Laufwege vorsichtig säubern.", "Nicht mit scharfkantigen Werkzeugen am Gewebe arbeiten."],
  rolltor: ["Führungen und Bewegungsbereich frei halten.", "Sicherheitseinrichtungen nicht überbrücken.", "Bei ungewöhnlichem Lauf den Fachbetrieb kontaktieren."],
  garagentor_antrieb: ["Bewegungsbereich frei halten.", "Notentriegelung nach Herstellerangabe kennen.", "Bei ungewöhnlichem Lauf nicht weiter belasten."],
};

function makeId(prefix) {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function productLabel(productId) {
  return allProductTypes.find((product) => product.id === productId)?.name || "Produkt";
}

export function getCustomerStatus(orderOrStatus) {
  const rawStatus = typeof orderOrStatus === "object" ? orderOrStatus?.status : orderOrStatus;
  const normalized = normalizeOrderStatus(rawStatus);
  return statusText[normalized] || { label: "Ihr Auftrag wird bearbeitet", progress: 20 };
}

export function getCustomerPortalState(order = {}) {
  const portal = order.customerPortal && typeof order.customerPortal === "object" ? order.customerPortal : {};
  const pickRows = (rows, fields) => (Array.isArray(rows) ? rows : []).map((row) => Object.fromEntries(fields.filter((field) => row?.[field] !== undefined).map((field) => [field, row[field]])));
  return {
    appointmentRequests: pickRows(portal.appointmentRequests, ["id", "createdAt", "updatedAt", "status", "preferredDate", "timeWindow", "message", "proposedDate", "proposedTime", "proposedAt", "confirmedAt"]),
    messages: pickRows(portal.messages, ["id", "createdAt", "updatedAt", "status", "topic", "message", "reply"]),
    issues: pickRows(portal.issues, ["id", "createdAt", "updatedAt", "status", "category", "description", "problemSince", "usable", "photo", "reworkOrderId"]),
    maintenanceRequests: pickRows(portal.maintenanceRequests, ["id", "createdAt", "updatedAt", "status", "product", "preferredPeriod", "message"]),
    approvals: pickRows(portal.approvals, ["id", "createdAt", "updatedAt", "status", "approvalType", "documentId"]),
    feedback: pickRows(portal.feedback, ["id", "createdAt", "updatedAt", "status", "rating", "comment"]),
    activities: pickRows(portal.activities, ["id", "type", "label", "createdAt"]),
  };
}

export function sanitizeCustomerOrder(order = {}) {
  const safe = {
    id: order.id,
    customerPersonId: order.customerPersonId || order.customer_id || "",
    product: order.product || "",
    orderType: order.orderType || "Auftrag",
    date: order.date || "",
    time: order.time || "",
    status: normalizeOrderStatus(order.status),
    address: order.address || "",
    customerNote: order.customerNote || "",
    customerContactName: order.customerContactName || "Ihr Kundenservice",
    customerConfirmed: Boolean(order.customerConfirmed),
    customerConfirmedAt: order.customerConfirmedAt || "",
    nextMaintenanceDate: order.nextMaintenanceDate || "",
    customerPortal: getCustomerPortalState(order),
  };
  return safe;
}

export function isOwnCustomerOrder(order, customerId, customerName = "") {
  if (!order) return false;
  if (customerId) return order.customerPersonId === customerId || order.customer_id === customerId;
  return Boolean(customerName) && order.customer === customerName;
}

export function isCustomerDocumentVisible(document = {}) {
  return document.customerVisible === true || document.customer_visible === true;
}

export function sanitizeCustomerDocument(document = {}) {
  return {
    id: document.id,
    orderId: document.orderId,
    fileName: document.fileName || document.template || "Dokument",
    template: document.template || "Kundendokument",
    status: document.customerStatus || document.status || "verfügbar",
    createdAt: document.createdAt || "",
    customerVisible: true,
    customerVisibleAt: document.customerVisibleAt || "",
    previewLines: Array.isArray(document.customerPreview) ? document.customerPreview : [],
  };
}

export function getVisibleCustomerDocuments(documents = [], orderIds = []) {
  const allowed = new Set(orderIds);
  return documents
    .filter((document) => allowed.has(document.orderId) && isCustomerDocumentVisible(document))
    .map(sanitizeCustomerDocument);
}

function appendUnique(items, entry) {
  const rows = Array.isArray(items) ? items : [];
  return rows.some((item) => item.id === entry.id) ? rows : [entry, ...rows];
}

function activity(action, at) {
  const labels = {
    appointment_confirmation: "Termin bestätigt",
    appointment_change: "Terminänderung angefragt",
    customer_message: "Rückfrage eingegangen",
    customer_issue: "Problem gemeldet",
    maintenance_request: "Wartung angefragt",
    customer_approval: "Freigabe bestätigt",
    customer_feedback: "Feedback abgegeben",
  };
  return { id: action.id, type: action.type, label: labels[action.type] || "Kundenaktivität", createdAt: at };
}

export function createCustomerAction(type, orderId, payload = {}, now = new Date()) {
  return {
    id: payload.id || makeId("KPA"),
    type,
    orderId,
    payload: { ...payload, id: undefined },
    createdAt: now.toISOString(),
  };
}

export function applyCustomerActionToOrder(order, action) {
  if (!order || !action || order.id !== action.orderId) return order;
  const at = action.createdAt || new Date().toISOString();
  const portal = getCustomerPortalState(order);
  if (portal.activities.some((entry) => entry.id === action.id)) return order;
  const entryBase = { id: action.id, createdAt: at, status: "neu" };
  const nextPortal = { ...portal, activities: appendUnique(portal.activities, activity(action, at)) };
  let changes = {};

  if (action.type === "appointment_confirmation") {
    const requestId = action.payload?.requestId || "";
    nextPortal.appointmentRequests = portal.appointmentRequests.map((request) => request.id === requestId ? { ...request, status: "bestätigt", confirmedAt: at } : request);
    changes = { customerConfirmed: true, customerConfirmedAt: at };
  } else if (action.type === "appointment_change") {
    nextPortal.appointmentRequests = appendUnique(portal.appointmentRequests, {
      ...entryBase,
      preferredDate: action.payload?.preferredDate || "",
      timeWindow: action.payload?.timeWindow || "egal",
      message: action.payload?.message || "",
      status: "Anfrage gesendet",
    });
    changes = { customerConfirmed: false, customerConfirmedAt: "" };
  } else if (action.type === "customer_message") {
    nextPortal.messages = appendUnique(portal.messages, { ...entryBase, topic: action.payload?.topic || "Sonstiges", message: action.payload?.message || "", reply: "" });
  } else if (action.type === "customer_issue") {
    nextPortal.issues = appendUnique(portal.issues, {
      ...entryBase,
      category: action.payload?.category || "sonstiges",
      description: action.payload?.description || "",
      problemSince: action.payload?.problemSince || "",
      usable: action.payload?.usable || "ja",
      photo: action.payload?.photo || null,
      status: "gemeldet",
      reworkOrderId: "",
    });
  } else if (action.type === "maintenance_request") {
    nextPortal.maintenanceRequests = appendUnique(portal.maintenanceRequests, { ...entryBase, product: action.payload?.product || order.product || "", preferredPeriod: action.payload?.preferredPeriod || "", message: action.payload?.message || "" });
  } else if (action.type === "customer_approval") {
    nextPortal.approvals = appendUnique(portal.approvals, { ...entryBase, approvalType: action.payload?.approvalType || "Kenntnisnahme", documentId: action.payload?.documentId || "", status: "bestätigt" });
  } else if (action.type === "customer_feedback") {
    nextPortal.feedback = appendUnique(portal.feedback, { ...entryBase, rating: Math.max(1, Math.min(5, Number(action.payload?.rating) || 0)), comment: action.payload?.comment || "", status: "intern" });
  }

  return {
    ...order,
    ...changes,
    customerPortal: nextPortal,
    updatedAt: at,
  };
}

export function prepareCustomerAppointmentProposal(order, date, time, now = new Date()) {
  const portal = getCustomerPortalState(order);
  const pending = portal.appointmentRequests.find((request) => ["Anfrage gesendet", "wird geprüft"].includes(request.status));
  if (!pending || !date) return order;
  const proposedAt = now.toISOString();
  return {
    ...order,
    customerConfirmed: false,
    customerConfirmedAt: "",
    customerPortal: {
      ...portal,
      appointmentRequests: portal.appointmentRequests.map((request) => request.id === pending.id ? {
        ...request,
        status: "neuer Termin vorgeschlagen",
        proposedDate: date,
        proposedTime: time || "",
        proposedAt,
      } : request),
    },
  };
}

export function updateCustomerPortalEntry(order, collection, entryId, changes = {}) {
  const portal = getCustomerPortalState(order);
  if (!Object.prototype.hasOwnProperty.call(portal, collection) || collection === "activities") return order;
  return {
    ...order,
    customerPortal: {
      ...portal,
      [collection]: portal[collection].map((entry) => entry.id === entryId ? { ...entry, ...changes, updatedAt: new Date().toISOString() } : entry),
    },
    updatedAt: new Date().toISOString(),
  };
}

export function mergeCustomerPortalOrders(localOrders = [], remoteOrders = [], pendingActions = []) {
  const localMap = new Map(localOrders.map((order) => [order.id, order]));
  const pendingByOrder = pendingActions.reduce((map, action) => {
    const orderId = action?.data?.orderId || action?.recordId;
    if (!orderId) return map;
    if (!map.has(orderId)) map.set(orderId, []);
    map.get(orderId).push(action.data?.portalAction || action.data);
    return map;
  }, new Map());
  return remoteOrders.map((remoteOrder) => {
    let merged = sanitizeCustomerOrder(remoteOrder);
    const local = localMap.get(remoteOrder.id);
    if (local && pendingByOrder.has(remoteOrder.id)) merged = { ...merged, customerPortal: getCustomerPortalState(local), customerConfirmed: local.customerConfirmed, customerConfirmedAt: local.customerConfirmedAt };
    for (const action of pendingByOrder.get(remoteOrder.id) || []) merged = applyCustomerActionToOrder(merged, action);
    return merged;
  });
}

export function customerPortalActivityCount(order = {}) {
  const portal = getCustomerPortalState(order);
  return portal.appointmentRequests.filter((item) => item.status !== "bestätigt").length
    + portal.messages.filter((item) => !["beantwortet", "erledigt"].includes(item.status)).length
    + portal.issues.filter((item) => item.status !== "erledigt").length
    + portal.maintenanceRequests.filter((item) => item.status !== "erledigt").length;
}
