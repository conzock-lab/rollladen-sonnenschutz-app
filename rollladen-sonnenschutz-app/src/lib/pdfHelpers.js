import { DOCUMENT_STATUSES, getDocumentTemplate } from "../data/documentTemplates.js";

const isoNow = (now = new Date()) => now.toISOString();

export function sanitizePdfFilePart(value, fallback = "Dokument") {
  const clean = String(value || fallback)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
  return clean || fallback;
}

export function createPdfFileName(templateId, order, now = new Date()) {
  const type = sanitizePdfFilePart(String(templateId || "Dokument").replace("Aufmaßblatt", "Aufmass"));
  const orderId = sanitizePdfFilePart(order?.id || "Auftrag");
  const customer = sanitizePdfFilePart(order?.customer || "Kunde");
  const date = now.toISOString().slice(0, 10);
  return `${type}_${orderId}_${customer}_${date}.pdf`;
}

export function buildPdfPreview(lines) {
  return (Array.isArray(lines) ? lines : [lines]).filter((line) => line !== undefined && line !== null).join("\n");
}

export function normalizeDocumentStatus(status = "Entwurf") {
  const normalized = String(status || "Entwurf").trim().toLocaleLowerCase("de-DE");
  return DOCUMENT_STATUSES.find((item) => item.toLocaleLowerCase("de-DE") === normalized) || "Entwurf";
}

export function createDocumentNumber(type, documents = [], now = new Date()) {
  const template = getDocumentTemplate(type);
  const year = now.getFullYear();
  const used = documents
    .map((document) => String(document.documentNumber || document.document_number || ""))
    .filter((number) => number.includes(`-${year}-`))
    .map((number) => Number(number.split("-").at(-1)))
    .filter(Number.isFinite);
  const sequence = Math.max(0, ...used) + 1;
  return `${template.code || "DOC"}-${year}-${String(sequence).padStart(4, "0")}`;
}

export function createDocumentId(now = new Date()) {
  if (globalThis.crypto?.randomUUID) return `DOC-${globalThis.crypto.randomUUID()}`;
  return `DOC-${now.getTime()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function normalizePdfDocument(document = {}, index = 0) {
  const createdIso = document.created_at || document.createdAtIso || (String(document.createdAt || "").includes("T") ? document.createdAt : "") || isoNow();
  const type = document.type || document.template || "Sonstiges Dokument";
  const orderId = document.order_id || document.orderId || "";
  const id = String(document.id || `DOC-legacy-${index}-${Date.now()}`);
  const data = document.data && typeof document.data === "object" ? document.data : {};
  const fields = data.fields && typeof data.fields === "object" ? data.fields : (document.fields || {});
  const history = Array.isArray(document.history) ? document.history : Array.isArray(data.history) ? data.history : [{ id: `${id}-created`, action: "Dokument übernommen", at: createdIso, by: document.createdBy || "System" }];
  return {
    ...document,
    id,
    orderId,
    customerId: document.customer_id || document.customerId || "",
    type,
    template: type,
    title: document.title || type,
    status: normalizeDocumentStatus(document.status),
    createdAt: document.createdAt || createdIso,
    createdAtIso: createdIso,
    updatedAt: document.updated_at || document.updatedAt || createdIso,
    createdBy: document.created_by || document.createdBy || "System",
    updatedBy: document.updated_by || document.updatedBy || document.created_by || document.createdBy || "System",
    customerVisible: document.customer_visible ?? document.customerVisible ?? false,
    customerVisibleAt: document.customerVisibleAt || data.customerVisibleAt || "",
    documentNumber: document.document_number || document.documentNumber || "",
    version: Math.max(1, Number(document.version) || 1),
    signedStatus: document.signed_status || document.signedStatus || "nicht erforderlich",
    fileName: document.file_name || document.fileName || createPdfFileName(type, { id: orderId, customer: document.customer }, new Date(createdIso)),
    customerStatus: document.customerStatus || (document.customer_visible || document.customerVisible ? "verfügbar" : "wartet auf Freigabe"),
    data: { ...data, fields },
    fields,
    signatures: document.signatures || data.signatures || {},
    history,
    customerPreview: Array.isArray(document.customerPreview) ? document.customerPreview : Array.isArray(data.customerPreview) ? data.customerPreview : [],
  };
}

export function getDocumentCompleteness(template, fields = {}) {
  const requiredMissing = template.fields.filter((field) => field.required && !isFilled(fields[field.key], field.type));
  const recommendedMissing = template.fields.filter((field) => field.recommended && !isFilled(fields[field.key], field.type));
  const level = requiredMissing.length ? "red" : recommendedMissing.length ? "yellow" : "green";
  return { level, requiredMissing, recommendedMissing, missingCount: requiredMissing.length + recommendedMissing.length };
}

function isFilled(value, type) {
  if (type === "checkbox") return value === true;
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export function groupDocumentFields(template, customerVersion = false) {
  return template.fields.reduce((groups, field) => {
    if (customerVersion && field.internal) return groups;
    const section = field.section || "Dokument";
    const existing = groups.find((group) => group.title === section);
    if (existing) existing.fields.push(field);
    else groups.push({ title: section, fields: [field] });
    return groups;
  }, []);
}

export function createCustomerDocumentPreview({ company, document, fields, order, productName, template }) {
  const lines = [
    company?.name || "Muster Sonnenschutz GmbH",
    document.title || template.title,
    document.documentNumber ? `Dokumentnummer: ${document.documentNumber}` : "",
    `Auftrag: ${order?.id || document.orderId || "-"}`,
    `Produkt: ${productName || order?.product || "-"}`,
    `Termin: ${order?.date || "-"} ${order?.time || ""}`.trim(),
    `Adresse: ${order?.address || "-"}`,
    "",
    ...groupDocumentFields(template, true).flatMap((group) => [
      group.title.toLocaleUpperCase("de-DE"),
      ...group.fields.map((field) => `${field.label}: ${formatFieldValue(fields[field.key], field.type)}`),
      "",
    ]),
    "Digitale Erfassung zur Dokumentation – keine qualifizierte elektronische Signatur.",
  ];
  return lines.filter((line) => line !== "");
}

export function formatFieldValue(value, type) {
  if (type === "checkbox") return value ? "✓" : "–";
  return value === undefined || value === null || String(value).trim() === "" ? "–" : String(value);
}

export function createDocumentRecord({ company, createdBy, customerId, documents, fields, order, productName, signatures = {}, status = "Erstellt", type, now = new Date() }) {
  const template = getDocumentTemplate(type, order?.product);
  const id = createDocumentId(now);
  const documentNumber = createDocumentNumber(type, documents, now);
  const at = isoNow(now);
  const signed = Object.values(signatures).some((signature) => signature?.dataUrl);
  const document = {
    id,
    orderId: order?.id || "",
    customerId: customerId || order?.customerPersonId || order?.customer_id || "",
    customer: order?.customer || "",
    type,
    template: type,
    title: template.title,
    status: normalizeDocumentStatus(status),
    createdAt: at,
    createdAtIso: at,
    updatedAt: at,
    createdBy: createdBy || "Nutzer",
    updatedBy: createdBy || "Nutzer",
    customerVisible: false,
    customerVisibleAt: "",
    customerStatus: "wartet auf Freigabe",
    documentNumber,
    version: 1,
    signedStatus: template.signatures?.length ? (signed ? "unterschrieben" : "offen") : "nicht erforderlich",
    fileName: createPdfFileName(type, order, now),
    fields: { ...fields },
    signatures,
    data: { fields: { ...fields }, signatures },
    history: [{ id: `${id}-v1`, action: status === "Entwurf" ? "Entwurf erstellt" : "Dokument erstellt", at, by: createdBy || "Nutzer", version: 1 }],
  };
  document.customerPreview = createCustomerDocumentPreview({ company, document, fields, order, productName, template });
  document.data.customerPreview = document.customerPreview;
  return document;
}

export function updateDocumentRecord(document, { company, fields, order, productName, signatures, status, updatedBy, now = new Date() }) {
  const current = normalizePdfDocument(document);
  const template = getDocumentTemplate(current.type, order?.product);
  const at = isoNow(now);
  const nextVersion = current.version + 1;
  const nextSignatures = signatures || current.signatures || {};
  const signed = Object.values(nextSignatures).some((signature) => signature?.dataUrl);
  const next = {
    ...current,
    status: normalizeDocumentStatus(status || current.status),
    version: nextVersion,
    updatedAt: at,
    updatedBy: updatedBy || "Nutzer",
    fields: { ...fields },
    signatures: nextSignatures,
    signedStatus: template.signatures?.length ? (signed ? "unterschrieben" : "offen") : "nicht erforderlich",
    fileName: createPdfFileName(current.type, order, now),
    data: { ...current.data, fields: { ...fields }, signatures: nextSignatures },
    history: [{ id: `${current.id}-v${nextVersion}-${now.getTime()}`, action: "Dokument bearbeitet", at, by: updatedBy || "Nutzer", version: nextVersion }, ...current.history],
  };
  next.customerPreview = createCustomerDocumentPreview({ company, document: next, fields, order, productName, template });
  next.data.customerPreview = next.customerPreview;
  return next;
}

export function duplicateDocumentRecord(document, { documents = [], order, createdBy, now = new Date() }) {
  const current = normalizePdfDocument(document);
  const id = createDocumentId(now);
  const at = isoNow(now);
  return {
    ...current,
    id,
    documentNumber: createDocumentNumber(current.type, documents, now),
    status: "Entwurf",
    version: 1,
    customerVisible: false,
    customerVisibleAt: "",
    customerStatus: "wartet auf Freigabe",
    createdAt: at,
    createdAtIso: at,
    updatedAt: at,
    createdBy: createdBy || "Nutzer",
    updatedBy: createdBy || "Nutzer",
    fileName: createPdfFileName(current.type, order, now),
    history: [{ id: `${id}-duplicated`, action: `Aus ${current.documentNumber || current.id} dupliziert`, at, by: createdBy || "Nutzer", version: 1 }],
  };
}

export function addDocumentHistory(document, action, by, changes = {}, now = new Date()) {
  const current = normalizePdfDocument(document);
  const at = isoNow(now);
  return {
    ...current,
    ...changes,
    updatedAt: at,
    updatedBy: by || "Nutzer",
    history: [{ id: `${current.id}-${now.getTime()}`, action, at, by: by || "Nutzer", version: current.version }, ...current.history],
  };
}

export function documentToRow(document, companyId) {
  const item = normalizePdfDocument(document);
  return {
    id: item.id,
    company_id: companyId,
    order_id: item.orderId,
    customer_id: item.customerId || null,
    type: item.type,
    title: item.title,
    status: item.status,
    version: item.version,
    data: {
      ...item.data,
      fields: item.fields,
      signatures: item.signatures,
      history: item.history,
      customerPreview: item.customerPreview,
      customerStatus: item.customerStatus,
      customerVisibleAt: item.customerVisibleAt,
    },
    customer_visible: Boolean(item.customerVisible),
    signed_status: item.signedStatus,
    file_name: item.fileName,
    document_number: item.documentNumber || null,
    created_by: item.createdBy || null,
    created_at: item.createdAtIso || item.createdAt || isoNow(),
    updated_at: item.updatedAt || isoNow(),
  };
}

export function rowToDocument(row) {
  return normalizePdfDocument({
    ...row.data,
    id: row.id,
    order_id: row.order_id,
    customer_id: row.customer_id,
    type: row.type,
    title: row.title,
    status: row.status,
    version: row.version,
    customer_visible: row.customer_visible,
    signed_status: row.signed_status,
    file_name: row.file_name,
    document_number: row.document_number,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
    data: row.data,
  });
}
