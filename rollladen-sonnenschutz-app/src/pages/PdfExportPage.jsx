import React from "react";
import { Copy, Download, Eye, EyeOff, FileText, Printer, RefreshCw, Save } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import { Field, TextArea } from "../components/Field";
import SectionTitle from "../components/SectionHeader";

const PDF_STATUSES = ["Entwurf", "Erstellt", "Gesendet", "Unterschrieben", "Archiviert"];

function normalizePdfStatus(status = "Entwurf") {
  const normalized = String(status).toLocaleLowerCase("de-DE");
  return PDF_STATUSES.find((item) => item.toLocaleLowerCase("de-DE") === normalized) || "Entwurf";
}

export default function PdfExportPage({
  canManageCustomerDocuments,
  currentPdfTemplate,
  getPdfValue,
  pdfDocuments,
  pdfFileName,
  pdfPreviewLines,
  pdfTarget,
  pdfTemplateDefinitions,
  resetPdfTemplate,
  savePdfDocument,
  selectedOrder,
  selectedProduct,
  setPdfField,
  setPdfTarget,
  updatePdfDocumentStatus,
  updateCustomerDocumentVisibility,
}) {
  return <div className="space-y-5">
    <Card className="no-print">
      <SectionTitle icon={Download} title="PDF-Vorlagen ausfüllen" subtitle="Wähle eine Vorlage und fülle die passenden Felder aus. Beim Drucken/PDF-Export wird nur die Vorschau gedruckt – nicht die App-Oberfläche." />
      <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-3xl bg-slate-50 p-4">
          <label className="text-sm font-bold text-slate-800">PDF-Vorlage
            <select value={pdfTarget} onChange={(event) => setPdfTarget(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold">
              {Object.keys(pdfTemplateDefinitions).map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
          <p className="mt-3 text-sm leading-6 text-slate-600">{currentPdfTemplate.description}</p>
          <div className="mt-4 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-500">Aktiver Auftrag: {selectedOrder?.id || "-"} · {selectedOrder?.customer || "-"} · {selectedProduct?.name || "Produkt offen"}</div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {currentPdfTemplate.fields.map((field) => field.type === "textarea"
            ? <TextArea key={field.key} label={field.label} value={getPdfValue(field)} onChange={(value) => setPdfField(field.key, value)} placeholder={field.placeholder || ""} />
            : field.type === "select"
              ? <label key={field.key} className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-800">{field.label}
                <select value={getPdfValue(field)} onChange={(event) => setPdfField(field.key, event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium outline-none focus:border-slate-950">
                  <option value="">Bitte auswählen</option>
                  {field.options.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              : <Field key={field.key} label={field.label} type={field.type || "text"} value={getPdfValue(field)} onChange={(value) => setPdfField(field.key, value)} placeholder={field.placeholder || ""} />)}
        </div>
      </div>
      <div className="mt-5 rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-600">Automatischer Dateiname: {pdfFileName}</div>
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <button type="button" onClick={() => navigator.clipboard?.writeText(pdfPreviewLines)} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800"><Copy size={18} />PDF-Text kopieren</button>
        <button type="button" onClick={savePdfDocument} className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800"><Save size={18} />Dokument speichern</button>
        <button type="button" onClick={resetPdfTemplate} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800"><RefreshCw size={18} />Vorlage zurücksetzen</button>
        <button type="button" onClick={() => window.print()} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white"><Printer size={18} />Nur Vorschau als PDF</button>
      </div>
    </Card>

    <Card className="print-area">
      <SectionTitle icon={FileText} title="PDF-Vorschau" subtitle="Nur dieser Bereich erscheint später in der PDF." />
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-950 shadow-sm md:p-8"><pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7">{pdfPreviewLines}</pre></div>
    </Card>

    <Card className="no-print">
      <SectionTitle icon={FileText} title="Gespeicherte PDF-Dokumente" subtitle="Dokumente werden dem Auftrag zugeordnet und können einen Status bekommen." />
      <div className="grid gap-3 md:grid-cols-2">
        {pdfDocuments.length === 0 && <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">Noch keine PDF-Dokumente gespeichert.</div>}
        {pdfDocuments.map((document) => <article key={document.id} className="rounded-3xl bg-slate-50 p-4">
          <div className="flex flex-wrap items-center gap-2"><Badge>{document.template}</Badge><Badge>{normalizePdfStatus(document.status)}</Badge></div>
          <h3 className="mt-2 font-black">{document.fileName}</h3>
          <p className="mt-1 text-xs text-slate-500">{document.createdAt} · Auftrag {document.orderId}</p>
          <select value={normalizePdfStatus(document.status)} onChange={(event) => updatePdfDocumentStatus(document.id, event.target.value)} className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold">
            {PDF_STATUSES.map((status) => <option key={status}>{status}</option>)}
          </select>
          <div className={`mt-3 rounded-2xl p-3 text-xs font-bold ${document.customerVisible ? "bg-emerald-100 text-emerald-950" : "bg-white text-slate-600"}`}>{document.customerVisible ? "Für den Kunden freigegeben" : "Interner Entwurf – nicht im Kundenportal sichtbar"}</div>
          {canManageCustomerDocuments && <button type="button" onClick={() => updateCustomerDocumentVisibility(document.id, !document.customerVisible)} className={`mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 text-xs font-black ${document.customerVisible ? "bg-slate-200 text-slate-800" : "bg-emerald-900 text-white"}`}>{document.customerVisible ? <EyeOff size={17} /> : <Eye size={17} />}{document.customerVisible ? "Freigabe zurücknehmen" : "Für Kunden freigeben"}</button>}
        </article>)}
      </div>
    </Card>
  </div>;
}
