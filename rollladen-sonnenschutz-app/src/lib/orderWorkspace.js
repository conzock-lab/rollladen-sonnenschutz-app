export function buildOrderOpenItems(order, context) {
  if (!order) return [];
  const orderChecklistItems = context.buildChecklistItems(order.product, order);
  const orderChecklist = context.checks[order.id] || {};
  const missingChecks = orderChecklistItems.filter((item) => !orderChecklist[item]);
  const fields = context.measurementRequiredFields[order.product] || ["Breite", "Höhe", "Untergrund", "Bedienseite", "Foto"];
  const values = context.measurementValues[order.id] || {};
  const missingMeasureFields = fields.filter((field) => !values[field]);
  const storedPhotos = context.photos[order.id] || {};
  const missingPhotos = context.requiredPhotos.filter((category) => !storedPhotos[category]);
  const requests = context.partRequests.filter((request) => request.orderId === order.id && !["erledigt", "verbaut"].includes(String(request.status || "").toLocaleLowerCase("de-DE")));
  const quality = context.manualQuality[order.id] || {};
  return [
    ...(missingChecks.length ? [{ id: "checklist", label: `${missingChecks.length} Checklistenpunkt${missingChecks.length === 1 ? " fehlt" : "e fehlen"}`, tab: "checklist" }] : []),
    ...(missingMeasureFields.length ? [{ id: "measurement", label: `Aufmaß ${fields.length - missingMeasureFields.length}/${fields.length} vollständig`, tab: "measurement" }] : []),
    ...(missingPhotos.length ? [{ id: "photos", label: `Pflichtfoto fehlt: ${missingPhotos.join(", ")}`, tab: "photos" }] : []),
    ...(requests.length ? [{ id: "parts", label: `${requests.length} Ersatzteil${requests.length === 1 ? " ist" : "e sind"} noch offen`, tab: "parts" }] : []),
    ...(quality["rework-status"] === "needed" && !order.reworkOrderId ? [{ id: "rework", label: "Nacharbeitsauftrag muss erstellt werden", tab: "completion" }] : []),
    ...(!context.pdfDocuments.some((document) => document.orderId === order.id) ? [{ id: "pdf", label: "PDF-Protokoll fehlt", tab: "documents" }] : []),
    ...(!quality.customer ? [{ id: "customer", label: "Kundeneinweisung ist noch offen", tab: "completion" }] : []),
  ];
}

export function getOrderSyncStatus(queue, orderId, hasSuccessfulSync = false) {
  if (!orderId) return "local";
  const related = queue.filter((item) => item.recordId === orderId || item.data?.orderId === orderId || item.data?.orderIds?.includes(orderId) || item.data?.from === orderId || item.data?.to === orderId);
  if (related.some((item) => item.status === "failed")) return "failed";
  if (related.some((item) => item.status === "syncing")) return "syncing";
  if (related.some((item) => item.status === "pending")) return "pending";
  if (related.some((item) => item.status === "synced") || hasSuccessfulSync) return "synced";
  return "local";
}
