import React from "react";
import { Check, Minus } from "lucide-react";
import { formatFieldValue, groupDocumentFields } from "../../lib/pdfHelpers";

const dateLabel = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("de-DE") : value || "–";
};

function FieldValue({ field, value }) {
  if (field.type === "checkbox") return <div className="flex items-start gap-2"><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${value ? "border-emerald-700 bg-emerald-50 text-emerald-800" : "border-slate-300 text-slate-400"}`}>{value ? <Check size={14} /> : <Minus size={12} />}</span><span>{field.label}</span></div>;
  return <div><dt className="text-[10px] font-black uppercase tracking-wide text-slate-500">{field.label}</dt><dd className="mt-1 whitespace-pre-wrap text-sm font-semibold leading-6 text-slate-900">{formatFieldValue(value, field.type)}</dd></div>;
}
export default function DocumentPreview({ company, customerVersion = false, document, fields = {}, order, productName, signatures = {}, template }) {
  const groups = groupDocumentFields(template, customerVersion);
  const companyLine = [company?.street, [company?.postalCode, company?.city].filter(Boolean).join(" ")].filter(Boolean).join(" · ");
  const contactLine = [company?.phone || company?.contactPhone, company?.email || company?.contactEmail, company?.website].filter(Boolean).join(" · ");
  return <article className="print-document mx-auto min-h-[277mm] w-full max-w-[210mm] bg-white p-6 text-slate-950 shadow-sm sm:p-9">
    <header className="document-block flex items-start justify-between gap-5 border-b-2 border-slate-950 pb-5">
      <div className="min-w-0 flex-1">{company?.logoDataUrl ? <img src={company.logoDataUrl} alt="Firmenlogo" className="mb-3 max-h-16 max-w-[220px] object-contain object-left" /> : <div className="mb-3 flex h-12 w-40 items-center justify-center rounded-xl border border-dashed border-slate-300 text-[10px] font-black uppercase text-slate-400">Logo</div>}<h1 className="text-xl font-black">{company?.name || "Muster Sonnenschutz GmbH"}</h1>{companyLine && <p className="mt-1 text-xs font-semibold text-slate-600">{companyLine}</p>}{contactLine && <p className="mt-1 break-words text-xs font-semibold text-slate-600">{contactLine}</p>}</div>
      <div className="shrink-0 text-right text-xs"><p className="font-black">{document?.documentNumber || "Entwurf"}</p><p className="mt-1">Version {document?.version || 1}</p><p className="mt-1">{dateLabel(document?.updatedAt || document?.createdAt || new Date().toISOString())}</p></div>
    </header>

    <section className="document-block mt-6"><p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{customerVersion ? "Kundenversion" : "Dokument"}</p><h2 className="mt-1 text-3xl font-black">{document?.title || template.title}</h2><div className="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2"><p><strong>Auftrag:</strong> {order?.id || document?.orderId || "–"}</p><p><strong>Kunde:</strong> {order?.customer || document?.customer || "–"}</p><p><strong>Adresse:</strong> {order?.address || "–"}</p><p><strong>Ansprechpartner:</strong> {order?.contact || "–"}</p><p><strong>Produkt:</strong> {productName || order?.product || "–"}</p><p><strong>Auftragsart:</strong> {order?.orderType || "–"}</p><p><strong>Termin:</strong> {order?.date || "–"} {order?.time || ""}</p><p><strong>Team:</strong> {order?.assignedTo || "–"}</p></div></section>

    {groups.map((group) => <section key={group.title} className="document-block mt-6"><h3 className="border-b border-slate-300 pb-2 text-sm font-black uppercase tracking-wide">{group.title}</h3><dl className="mt-3 grid gap-4 sm:grid-cols-2">{group.fields.map((field) => <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}><FieldValue field={field} value={fields[field.key]} /></div>)}</dl></section>)}

    {template.signatures?.length > 0 && <section className="signature-block document-block mt-8"><h3 className="border-b border-slate-300 pb-2 text-sm font-black uppercase tracking-wide">Unterschriften</h3><div className="mt-4 grid gap-5 sm:grid-cols-2">{template.signatures.map((label) => { const signature = signatures[label] || {}; return <div key={label} className="min-h-28 rounded-xl border border-slate-300 p-3">{signature.dataUrl ? <img src={signature.dataUrl} alt={`Unterschrift ${label}`} className="h-16 w-full object-contain object-left" /> : <div className="h-16 border-b border-slate-300" />}<p className="mt-2 text-xs font-black">{label}{signature.name ? ` · ${signature.name}` : ""}</p>{signature.signedAt && <p className="mt-1 text-[10px] text-slate-500">Erfasst: {new Date(signature.signedAt).toLocaleString("de-DE")}</p>}</div>; })}</div><p className="mt-3 text-[10px] font-semibold text-slate-500">Digitale Erfassung zur Dokumentation – keine qualifizierte elektronische Signatur.</p></section>}

    <footer className="document-footer document-block mt-8 border-t border-slate-300 pt-3 text-[10px] font-semibold text-slate-500"><div className="flex flex-wrap justify-between gap-2"><span>{company?.documentFooter || company?.name || "Muster Sonnenschutz GmbH"}</span><span>{document?.documentNumber || "ohne Dokumentnummer"} · Version {document?.version || 1}</span></div></footer>
  </article>;
}
