export function sanitizePdfFilePart(value) {
  return String(value || "Dokument").trim().replaceAll(" ", "_");
}

export function createPdfFileName(templateId, order) {
  return `${sanitizePdfFilePart(templateId)}_${sanitizePdfFilePart(order?.id || "Auftrag")}_${sanitizePdfFilePart(order?.customer || "Kunde")}.pdf`;
}

export function buildPdfPreview(lines) {
  return lines.join("\n");
}
