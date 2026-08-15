import React, { useState } from "react";
import { FileText, Printer, X } from "lucide-react";
import { Badge } from "../CheckItem";

const statusLabel = (status = "") => {
  const value = String(status).toLocaleLowerCase("de-DE");
  if (value.includes("untersch")) return "unterschrieben";
  if (value.includes("archiv")) return "archiviert";
  if (value.includes("freig") || value.includes("erstellt") || value.includes("gesendet")) return "verfügbar";
  return status || "verfügbar";
};

export default function CustomerDocuments({ documents = [], onAcknowledge }) {
  const [preview, setPreview] = useState(null);
  return <div className="space-y-3">
    <div className="grid gap-3 sm:grid-cols-2">{documents.map((document) => <article key={document.id} className="rounded-3xl bg-slate-50 p-4"><div className="flex items-start justify-between gap-2"><FileText className="shrink-0" /><Badge>{statusLabel(document.status)}</Badge></div><h3 className="mt-3 font-black">{document.title || document.fileName}</h3><p className="mt-1 text-xs font-bold text-slate-500">{document.documentNumber || document.template} · Auftrag {document.orderId}</p><p className="mt-1 text-xs font-semibold text-slate-400">Version {document.version || 1} · Unterschrift: {document.signedStatus || "nicht erforderlich"}</p><button type="button" onClick={() => setPreview(document)} className="mt-4 min-h-11 w-full rounded-xl bg-slate-950 px-4 text-sm font-black text-white">Dokument ansehen</button></article>)}</div>
    {!documents.length && <div className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-600">Noch keine freigegebenen Dokumente verfügbar.</div>}
    {preview && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-2 sm:items-center sm:p-5" role="dialog" aria-modal="true"><div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-5"><div className="no-print flex items-start justify-between gap-3"><div><h2 className="text-xl font-black">{preview.title || preview.fileName}</h2><p className="text-sm text-slate-500">Kundenfreigegebene Vorschau · Version {preview.version || 1}</p></div><button type="button" onClick={() => setPreview(null)} className="rounded-xl bg-slate-100 p-3"><X size={18} /></button></div><section className="print-area mt-5 rounded-3xl border border-slate-200 bg-white p-5"><h1 className="text-xl font-black">{preview.template}</h1><p className="mt-1 text-sm text-slate-500">{preview.documentNumber || `Auftrag ${preview.orderId}`}</p><div className="mt-5 whitespace-pre-wrap text-sm leading-7">{preview.previewLines.length ? preview.previewLines.join("\n") : "Für dieses Dokument ist eine sichere Vorschau hinterlegt. Die Originaldatei wird über den Fachbetrieb bereitgestellt."}</div></section><div className="no-print mt-4 grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => window.print()} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-black text-white"><Printer size={18} />Nur Vorschau drucken</button>{onAcknowledge && <button type="button" onClick={() => onAcknowledge(preview)} className="min-h-12 rounded-xl bg-emerald-100 px-4 text-sm font-black text-emerald-950">Kenntnisnahme bestätigen</button>}</div></div></div>}
  </div>;
}
