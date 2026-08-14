import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getAllowedPages, getNavigationGroups } from "../src/config/navigation.js";
import { getOrderStageIndex, matchesOrderFilter, normalizeOrderStatus, ORDER_STATUSES } from "../src/data/orders.js";
import { buildOrderOpenItems, getOrderSyncStatus } from "../src/lib/orderWorkspace.js";
import { enqueueSyncItem, markQueueFailed, markQueueSynced, markQueueSyncing } from "../src/lib/syncQueue.js";

assert.equal(normalizeOrderStatus("offen"), "Neu");
assert.equal(normalizeOrderStatus("Montage läuft"), "In Arbeit");
assert.equal(normalizeOrderStatus("wartet auf Teile"), "Wartet auf Material");
assert.equal(normalizeOrderStatus("abgerechnet"), "Erledigt");
assert.equal(new Set(ORDER_STATUSES).size, ORDER_STATUSES.length);
assert.equal(getOrderStageIndex("Neu"), 0);
assert.equal(getOrderStageIndex("Geplant"), 1);
assert.equal(getOrderStageIndex("In Vorbereitung"), 2);
assert.equal(getOrderStageIndex("In Arbeit"), 3);
assert.equal(getOrderStageIndex("Nacharbeit"), 4);
assert.equal(getOrderStageIndex("Erledigt"), 6);

const order = { id: "A-TEST", product: "rollladen", status: "Wartet auf Material", orderType: "Montage" };
assert.equal(matchesOrderFilter(order, "material", "2026-08-14"), true);
assert.equal(matchesOrderFilter(order, "open", "2026-08-14"), true);
assert.equal(matchesOrderFilter({ ...order, status: "Erledigt" }, "open", "2026-08-14"), false);

const checklistItems = ["Baustelle vorbereitet", "Funktion geprüft"];
const context = {
  buildChecklistItems: () => checklistItems,
  checks: { [order.id]: { "Baustelle vorbereitet": true } },
  measurementRequiredFields: { rollladen: ["Breite", "Höhe"] },
  measurementValues: { [order.id]: { Breite: "1200" } },
  photos: { [order.id]: { Vorher: { id: "PHOTO-1" } } },
  requiredPhotos: ["Vorher", "Nachher", "Typenschild"],
  partRequests: [{ id: "PART-1", orderId: order.id, status: "Angefragt" }],
  manualQuality: { [order.id]: { customer: false, "rework-status": "needed" } },
  pdfDocuments: [],
};

const openItems = buildOrderOpenItems(order, context);
assert.deepEqual(openItems.map((item) => item.id), ["checklist", "measurement", "photos", "parts", "rework", "pdf", "customer"]);
assert.ok(openItems.every((item) => item.tab));

const completeContext = {
  ...context,
  checks: { [order.id]: Object.fromEntries(checklistItems.map((item) => [item, true])) },
  measurementValues: { [order.id]: { Breite: "1200", Höhe: "1500" } },
  photos: { [order.id]: Object.fromEntries(context.requiredPhotos.map((category) => [category, { id: `PHOTO-${category}` }])) },
  partRequests: [{ id: "PART-1", orderId: order.id, status: "Verbaut" }],
  manualQuality: { [order.id]: { customer: true, "rework-status": "none" } },
  pdfDocuments: [{ id: "PDF-1", orderId: order.id, status: "Erstellt" }],
};
assert.deepEqual(buildOrderOpenItems(order, completeContext), []);

let queue = enqueueSyncItem([], "Auftrag geändert", { orderId: order.id }, true);
assert.equal(getOrderSyncStatus(queue, order.id), "pending");
queue = markQueueSyncing(queue, [queue[0].id]);
assert.equal(getOrderSyncStatus(queue, order.id), "syncing");
queue = markQueueFailed(queue, [queue[0].id], "offline", { maxRetries: 1 });
assert.equal(getOrderSyncStatus(queue, order.id), "failed");
queue = markQueueSynced(queue, [queue[0].id]);
assert.equal(getOrderSyncStatus(queue, order.id), "synced");

const internalRoles = ["dev", "meister", "buero", "vorarbeiter", "monteur", "azubi"];
for (const role of internalRoles) {
  const visibleIds = getNavigationGroups(role).flatMap((group) => group.items.map((item) => item.id));
  assert.ok(visibleIds.includes("orders"), `${role} muss Aufträge sehen`);
  assert.ok(!visibleIds.includes("portal"), `${role} darf das Kundenportal nicht in der Navigation sehen`);
}

const customerIds = getAllowedPages("kunde").map((item) => item.id);
assert.deepEqual(customerIds.sort(), ["customerCare", "customerContact", "customerDocuments", "dashboard", "portal"].sort());
assert.ok(!customerIds.some((id) => ["orders", "company", "rights", "diagnose", "workflow"].includes(id)));

const customerPortalSource = await readFile(new URL("../src/pages/CustomerPortalPage.jsx", import.meta.url), "utf8");
for (const forbiddenReference of ["internalNotes", "technicianNote", "diagnoses", "companyPeople"]) {
  assert.ok(!customerPortalSource.includes(forbiddenReference), `Kundenportal darf ${forbiddenReference} nicht rendern`);
}

console.log("Auftragsakten-Prüfung erfolgreich: Status, Filter, offene Punkte, Sync-Zuordnung und Rollen.");
