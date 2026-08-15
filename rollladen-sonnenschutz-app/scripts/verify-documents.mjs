import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DOCUMENT_STATUSES, DOCUMENT_TYPES, getDocumentTemplate } from "../src/data/documentTemplates.js";
import {
  createDocumentRecord,
  duplicateDocumentRecord,
  getDocumentCompleteness,
  normalizePdfDocument,
  sanitizePdfFilePart,
  updateDocumentRecord,
} from "../src/lib/pdfHelpers.js";
import { getAllowedPages } from "../src/config/navigation.js";
import { inferSyncMetadata } from "../src/lib/syncQueue.js";

assert.equal(DOCUMENT_TYPES.length, 10);
for (const type of [
  "Montageprotokoll",
  "Aufmaßblatt",
  "Wartungsprotokoll",
  "Kundenübergabe",
  "Angebotsentwurf",
  "Berichtsheft-Eintrag",
  "Nacharbeitsprotokoll",
  "Reklamationsprotokoll",
  "Prüf-/Funktionsprotokoll",
  "Sonstiges Dokument",
]) assert.ok(DOCUMENT_TYPES.includes(type), `${type} fehlt`);
assert.deepEqual(DOCUMENT_STATUSES, ["Entwurf", "Erstellt", "Zur Freigabe", "Freigegeben", "Gesendet", "Unterschrieben", "Archiviert"]);

const order = {
  id: "A-2026/42",
  customer: "Kundin Müller & Söhne",
  customerPersonId: "P-KUNDE-1",
  product: "vorbaurollladen",
  address: "Prüfweg 4",
  date: "2026-08-20",
  time: "08:00",
};
const company = { name: "Prüfbetrieb", street: "Werkweg 1", postalCode: "12345", city: "Prüfstadt" };
const template = getDocumentTemplate("Montageprotokoll", order.product);
const fields = Object.fromEntries(template.fields.map((field) => [field.key, field.type === "checkbox" ? true : `Wert ${field.key}`]));
const created = createDocumentRecord({
  company,
  createdBy: "Prüfperson",
  customerId: order.customerPersonId,
  documents: [],
  fields,
  order,
  productName: "Vorbaurollladen",
  status: "Erstellt",
  type: "Montageprotokoll",
  now: new Date("2026-08-15T12:00:00.000Z"),
});
assert.equal(created.orderId, order.id, "Dokument braucht eine stabile Auftragsverknüpfung");
assert.equal(created.customerId, order.customerPersonId);
assert.equal(created.documentNumber, "MP-2026-0001");
assert.match(created.fileName, /^Montageprotokoll_A-2026_42_Kundin_Muller_Sohne_2026-08-15\.pdf$/);
assert.doesNotMatch(created.fileName, /[\\/:*?"<>|&äöüß]/i);
assert.equal(getDocumentCompleteness(template, fields).level, "green");
assert.equal(getDocumentCompleteness(template, {}).level, "red");

const complaintTemplate = getDocumentTemplate("Reklamationsprotokoll", order.product);
const complaintFields = { complaintDate: "2026-08-15", customerReport: "Kundenangabe", diagnosis: "Nur intern", problem: "Laufgeräusch", measure: "Geprüft", result: "Hinweis" };
const complaint = createDocumentRecord({ company, createdBy: "Prüfperson", customerId: order.customerPersonId, documents: [created], fields: complaintFields, order, productName: "Vorbaurollladen", type: "Reklamationsprotokoll", now: new Date("2026-08-15T13:00:00.000Z") });
assert.doesNotMatch(complaint.customerPreview.join("\n"), /Nur intern|Interne Diagnose/i);
assert.ok(complaintTemplate.fields.some((field) => field.internal));

const updated = updateDocumentRecord(created, { company, fields: { ...fields, workDone: "Aktualisiert" }, order, productName: "Vorbaurollladen", signatures: {}, status: "Zur Freigabe", updatedBy: "Büro", now: new Date("2026-08-15T14:00:00.000Z") });
assert.equal(updated.version, 2);
assert.equal(updated.status, "Zur Freigabe");
assert.equal(updated.history[0].version, 2);
const duplicate = duplicateDocumentRecord(updated, { documents: [created, complaint, updated], order, createdBy: "Büro", now: new Date("2026-08-15T15:00:00.000Z") });
assert.notEqual(duplicate.id, updated.id);
assert.equal(duplicate.version, 1);
assert.equal(duplicate.status, "Entwurf");
assert.equal(duplicate.customerVisible, false);

const legacy = normalizePdfDocument({ id: "ALT-1", orderId: order.id, template: "Montageprotokoll", text: "Altbestand" });
assert.equal(legacy.type, "Montageprotokoll");
assert.equal(legacy.version, 1);
assert.equal(sanitizePdfFilePart("Müller / Prüfung"), "Muller_Prufung");
assert.equal(inferSyncMetadata("PDF-Dokument erstellt", { recordId: created.id }).type, "pdfMetadata");

for (const role of ["dev", "meister", "buero", "vorarbeiter", "monteur", "azubi"]) {
  assert.ok(getAllowedPages(role).some((page) => page.id === "documents"), `${role} muss Dokumente sehen`);
}
assert.ok(!getAllowedPages("kunde").some((page) => ["documents", "pdf"].includes(page.id)), "Kunden nutzen nur die sichere Portalansicht");

const [appSource, pageSource, editorSource, signatureSource, cssSource, navigationSource, migration] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/pages/PdfExportPage.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/components/documents/DocumentEditor.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/components/documents/SignaturePad.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/index.css", import.meta.url), "utf8"),
  readFile(new URL("../src/config/navigation.js", import.meta.url), "utf8"),
  readFile(new URL("../supabase/20260815_order_documents.sql", import.meta.url), "utf8"),
]);
assert.doesNotMatch(pageSource, /Ohne Auftrag/);
assert.match(pageSource, /window\.print\(\)/);
assert.match(appSource, /pdfDocuments=\{visiblePdfDocuments\}/, "Lokale Dokumente müssen nach sichtbaren Aufträgen gefiltert werden");
assert.doesNotMatch(appSource, /__codex_test_role/, "Temporäre UI-Testanmeldung darf nicht im Produktivcode bleiben");
assert.match(editorSource, /readOnly/);
assert.match(signatureSource, /touchAction:\s*"none"/);
assert.match(signatureSource, /keine qualifizierte elektronische Signatur/i);
assert.match(cssSource, /@page[\s\S]*size:\s*A4/i);
assert.match(cssSource, /body\s*\*\s*\{[^}]*visibility:\s*hidden/i);
assert.match(cssSource, /\.print-area,\s*\.print-area\s*\*\s*\{[^}]*visibility:\s*visible/i);
assert.match(cssSource, /break-inside:\s*avoid/i);
assert.equal((navigationSource.match(/id:\s*"documents"/g) || []).length, 1, "Nur ein sichtbarer zentraler Dokumentbereich");
assert.match(migration, /create table if not exists public\.order_documents/i);
assert.match(migration, /customer_visible boolean not null default false/i);
assert.match(migration, /enable row level security/i);
assert.match(migration, /public\.get_customer_portal_data/i);
assert.match(migration, /customer_visible\s*=\s*false\s+and\s+status\s+not\s+in\s*\('Freigegeben','Archiviert'\)/i);
assert.doesNotMatch(migration, /using\s*\(\s*true\s*\)/i);

console.log("Dokumentenprüfung erfolgreich: Vorlagen, Metadaten, Versionen, Kundenschutz, PDF-Druck, Rollen, Queue-Typ und Migration sind konsistent.");
