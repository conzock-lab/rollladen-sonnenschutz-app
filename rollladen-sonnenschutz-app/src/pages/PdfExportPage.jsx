import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, FilePlus2, Files, History } from "lucide-react";
import Card from "../components/Card";
import SectionTitle from "../components/SectionHeader";
import DocumentEditor from "../components/documents/DocumentEditor";
import DocumentLibrary from "../components/documents/DocumentLibrary";
import { DOCUMENT_TYPES } from "../data/documentTemplates";

export default function PdfExportPage({
  canArchiveDocuments,
  canCreateDocuments,
  canManageCustomerDocuments,
  company,
  currentPdfSignatures,
  currentPdfTemplate,
  currentPdfValues,
  documentCompleteness,
  documentEditorRequest,
  duplicatePdfDocument,
  openPdfDocument,
  orderPhotos,
  orders,
  lastSyncedAt,
  pdfDocuments,
  pdfFileName,
  pdfPreviewLines,
  pdfTarget,
  resetPdfTemplate,
  savePdfDocument,
  savedSketches,
  selectedPdfDocument,
  selectedOrder,
  selectedProduct,
  setPdfField,
  setPdfSignature,
  startPdfDocument,
  updateCustomerDocumentVisibility,
  updatePdfDocumentStatus,
  archivePdfDocument,
  syncQueue,
}) {
  const [view, setView] = useState(selectedPdfDocument ? "editor" : "library");
  const [customerVersion, setCustomerVersion] = useState(false);
  const [newType, setNewType] = useState("Montageprotokoll");
  const [newOrderId, setNewOrderId] = useState(selectedOrder?.id || "");

  useEffect(() => { if (documentEditorRequest) setView("editor"); }, [documentEditorRequest]);
  useEffect(() => { if (selectedPdfDocument) setView("editor"); }, [selectedPdfDocument?.id]);
  useEffect(() => { if (selectedOrder?.id) setNewOrderId(selectedOrder.id); }, [selectedOrder?.id]);

  const previewDocument = useMemo(() => selectedPdfDocument || {
    id: "new",
    orderId: selectedOrder?.id || "",
    title: currentPdfTemplate.title,
    type: pdfTarget,
    status: "Entwurf",
    version: 1,
    documentNumber: "",
    fileName: pdfFileName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, [currentPdfTemplate.title, pdfFileName, pdfTarget, selectedOrder?.id, selectedPdfDocument]);

  const createNew = (type = newType, orderId = newOrderId || selectedOrder?.id) => {
    if (!startPdfDocument(type, orderId)) return;
    setCustomerVersion(false);
    setView("editor");
  };

  const copyText = async () => {
    try { await navigator.clipboard?.writeText(pdfPreviewLines); } catch { /* Browser kann Clipboard verweigern; Vorschau bleibt nutzbar. */ }
  };

  if (view === "editor") return <div className="space-y-4">
    <div className="no-print flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={() => setView("library")} className="flex min-h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-black shadow-sm"><ArrowLeft size={17} />Dokumentenübersicht</button><div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black">{selectedPdfDocument ? `Bearbeiten · Version ${selectedPdfDocument.version}` : "Neue Vorlage"}</div></div>
    <DocumentEditor company={company} completeness={documentCompleteness} customerVersion={customerVersion} document={previewDocument} fields={currentPdfValues} fileName={pdfFileName} onCopy={copyText} onCustomerVersionChange={setCustomerVersion} onFieldChange={setPdfField} onPrint={() => window.print()} onReset={() => { if (window.confirm("Vorlage zurücksetzen? Auftragsdaten werden anschließend erneut automatisch eingesetzt.")) resetPdfTemplate(); }} onSave={savePdfDocument} onSignatureChange={setPdfSignature} order={selectedOrder} orderPhotos={orderPhotos} productName={selectedProduct?.name} readOnly={!canCreateDocuments || (!canManageCustomerDocuments && (selectedPdfDocument?.customerVisible || ["Freigegeben", "Archiviert"].includes(selectedPdfDocument?.status)))} savedSketches={savedSketches} signatures={currentPdfSignatures} template={currentPdfTemplate} />
    {selectedPdfDocument?.history?.length > 0 && <Card className="no-print"><SectionTitle icon={History} title="Dokumenthistorie" subtitle="Relevante Änderungen, Status- und Freigabeereignisse." /><div className="space-y-2">{selectedPdfDocument.history.map((entry) => <div key={entry.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 p-3 text-sm"><strong>{entry.action}</strong><span className="text-xs font-semibold text-slate-500">{entry.by} · {new Date(entry.at).toLocaleString("de-DE")}{entry.version ? ` · Version ${entry.version}` : ""}</span></div>)}</div></Card>}
  </div>;

  return <div className="space-y-5">
    <Card className="no-print"><SectionTitle icon={Files} title="Dokumente" subtitle="Auftragsbezogene Vorlagen, Status, Versionen und Kundenfreigaben zentral verwalten." />{canCreateDocuments && <div className="grid gap-3 rounded-3xl bg-slate-50 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end"><label className="text-sm font-bold">Dokumenttyp<select value={newType} onChange={(event) => setNewType(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3">{DOCUMENT_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label><label className="text-sm font-bold">Auftrag<select required value={newOrderId} onChange={(event) => setNewOrderId(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3"><option value="" disabled>Auftrag auswählen</option>{orders.map((order) => <option key={order.id} value={order.id}>{order.id} · {order.customer}</option>)}</select></label><button type="button" disabled={!newOrderId && !selectedOrder?.id} onClick={() => createNew()} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"><FilePlus2 size={18} />Dokument erstellen</button></div>}</Card>
    <DocumentLibrary canArchive={canArchiveDocuments} canCreate={canCreateDocuments} canRelease={canManageCustomerDocuments} documents={pdfDocuments} lastSyncedAt={lastSyncedAt} onArchive={archivePdfDocument} onDuplicate={(document) => { const copy = duplicatePdfDocument(document); if (copy) openPdfDocument(copy); setView("editor"); }} onNew={createNew} onOpen={(document) => { openPdfDocument(document); setView("editor"); }} onStatusChange={updatePdfDocumentStatus} onVisibilityChange={updateCustomerDocumentVisibility} orders={orders} syncQueue={syncQueue} />
  </div>;
}
