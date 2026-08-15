import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  applyCustomerActionToOrder,
  createCustomerAction,
  getCustomerStatus,
  getVisibleCustomerDocuments,
  isOwnCustomerOrder,
  mergeCustomerPortalOrders,
  prepareCustomerAppointmentProposal,
  sanitizeCustomerOrder,
} from "../src/lib/customerPortal.js";
import { getAllowedPages } from "../src/config/navigation.js";
import { inferSyncMetadata } from "../src/lib/syncQueue.js";

const baseOrder = {
  id: "A-KUNDE-1",
  customerPersonId: "P-KUNDE-1",
  customer: "Nicht als Sicherheitsfilter verwenden",
  product: "markise",
  orderType: "Montage",
  date: "2026-09-12",
  time: "09:00",
  status: "Wartet auf Material",
  address: "Kundenweg 1",
  internalNotes: "Interne Kalkulation und Einkaufspreis",
  diagnoses: [{ result: "interne Diagnose" }],
  assignedTo: "Internes Montageteam",
};

const customerPages = getAllowedPages("kunde").map((page) => page.id).sort();
assert.deepEqual(customerPages, ["customerCare", "customerContact", "customerDocuments", "dashboard", "portal"].sort());
assert.ok(!customerPages.some((id) => ["orders", "planning", "company", "rights", "diagnose", "parts"].includes(id)));

assert.equal(isOwnCustomerOrder(baseOrder, "P-KUNDE-1", "Fremder Name"), true);
assert.equal(isOwnCustomerOrder(baseOrder, "P-FREMD", baseOrder.customer), false, "Bei vorhandener ID darf der Name kein Sicherheitsfallback sein");
const safeOrder = sanitizeCustomerOrder(baseOrder);
assert.doesNotMatch(JSON.stringify(safeOrder), /internalNotes|Diagnose|Montageteam|Einkaufspreis/i);
assert.equal(getCustomerStatus(baseOrder).label, "Material wird noch vorbereitet oder bestellt");

const docs = getVisibleCustomerDocuments([
  { id: "D-1", orderId: baseOrder.id, customerVisible: false, text: "intern" },
  { id: "D-2", orderId: baseOrder.id, customerVisible: true, fileName: "Protokoll.pdf", customerPreview: ["Sichere Vorschau"], text: "Interne Notiz" },
  { id: "D-3", orderId: "A-FREMD", customerVisible: true },
], [baseOrder.id]);
assert.deepEqual(docs.map((document) => document.id), ["D-2"]);
assert.doesNotMatch(JSON.stringify(docs), /Interne Notiz|text/);

const request = createCustomerAction("appointment_change", baseOrder.id, { preferredDate: "2026-09-15", timeWindow: "vormittags", message: "Bitte später." }, new Date("2026-08-15T08:00:00Z"));
const requestedOrder = applyCustomerActionToOrder(baseOrder, request);
assert.equal(requestedOrder.customerPortal.appointmentRequests[0].status, "Anfrage gesendet");
assert.equal(applyCustomerActionToOrder(requestedOrder, request).customerPortal.appointmentRequests.length, 1, "Offline-Retry muss idempotent bleiben");
const proposal = prepareCustomerAppointmentProposal(requestedOrder, "2026-09-16", "10:00", new Date("2026-08-15T09:00:00Z"));
assert.equal(proposal.customerPortal.appointmentRequests[0].status, "neuer Termin vorgeschlagen");
const confirmation = createCustomerAction("appointment_confirmation", baseOrder.id, { requestId: request.id }, new Date("2026-08-15T10:00:00Z"));
const confirmed = applyCustomerActionToOrder(proposal, confirmation);
assert.equal(confirmed.customerConfirmed, true);
assert.equal(confirmed.customerPortal.appointmentRequests[0].status, "bestätigt");

const pendingMessage = createCustomerAction("customer_message", baseOrder.id, { topic: "Termin", message: "Rückfrage" }, new Date("2026-08-15T11:00:00Z"));
const merged = mergeCustomerPortalOrders([applyCustomerActionToOrder(baseOrder, pendingMessage)], [safeOrder], [{ type: "customerMessage", status: "pending", recordId: baseOrder.id, data: { orderId: baseOrder.id, portalAction: pendingMessage } }]);
assert.equal(merged[0].customerPortal.messages.length, 1);

assert.equal(inferSyncMetadata("Terminänderung angefragt", { orderId: baseOrder.id }).type, "customerAppointment");
assert.equal(inferSyncMetadata("Kundenrückfrage gespeichert", { orderId: baseOrder.id }).type, "customerMessage");
assert.equal(inferSyncMetadata("Kundenmeldung gespeichert", { orderId: baseOrder.id }).type, "customerIssue");

const pageSource = await readFile(new URL("../src/pages/CustomerPortalPage.jsx", import.meta.url), "utf8");
const detailsSource = await readFile(new URL("../src/components/customer/CustomerOrderDetails.jsx", import.meta.url), "utf8");
for (const forbidden of ["internalNotes", "technicianNote", "diagnoses", "purchasePrice", "partRequests", "assignedMemberIds"]) {
  assert.ok(!`${pageSource}\n${detailsSource}`.includes(forbidden), `Kundenportal darf ${forbidden} nicht rendern`);
}

const migration = await readFile(new URL("../supabase/20260815_customer_portal.sql", import.meta.url), "utf8");
assert.match(migration, /add column if not exists customer_id text/i);
assert.match(migration, /save_customer_portal_action/i);
assert.match(migration, /document\.value ->> 'customerVisible'\) = 'true'/i);
assert.doesNotMatch(migration, /using\s*\(\s*true\s*\)/i);
assert.doesNotMatch(migration, /o\.data\s*->>\s*'customer'\)\s*=\s*v_person\.name/i);

console.log("Kundenportal-Prüfung erfolgreich: Rollen, Whitelist, Freigaben, Aktionen, Offline-Merge und Migration sind konsistent.");
