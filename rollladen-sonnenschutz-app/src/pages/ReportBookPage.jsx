import React from "react";
import { FileText, Printer, Save } from "lucide-react";
import Card from "../components/Card";
import { Badge } from "../components/CheckItem";
import CopyBox from "../components/CopyBox";
import { Field, TextArea } from "../components/Field";
import SectionTitle from "../components/SectionHeader";
import { reportActivityTemplates, reportLearningFields } from "../data/learningModules";

export default function ReportBookPage({
  canReview,
  onAddPhotoNote,
  onApplyTemplate,
  onApproveLatest,
  onDelete,
  onExport,
  onGenerateWeekly,
  onImportChecklist,
  onSave,
  onSelectPdf,
  reportExportText,
  reportLearningField,
  reportMode,
  reportProposal,
  reportReminder,
  reportStatus,
  reportTechnicalTerms = [],
  reportTemplateId,
  reportText,
  reportYear,
  reports = [],
  setReportLearningField,
  setReportMasterComment,
  setReportMode,
  setReportReminder,
  setReportStatus,
  setReportTemplateId,
  setReportText,
  setReportYear,
  reportMasterComment,
  setReportExportText,
  showNotice,
}) {
  return <div className="space-y-5">
    <Card>
      <SectionTitle icon={FileText} title="Berichtsheft-Funktionen" subtitle="Bestehendes Berichtsheft mit Lernfall-, Checklisten- und Ausbildungsbezug." />
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Berichtsart<select value={reportMode} onChange={(event) => setReportMode(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3"><option>Tagesbericht</option><option>Wochenbericht</option></select></label>
            <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Ausbildungsjahr<select value={reportYear} onChange={(event) => setReportYear(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3">{[1, 2, 3, 4].map((year) => <option key={year} value={year}>{year}. Ausbildungsjahr</option>)}</select></label>
            <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Lernfeld<select value={reportLearningField} onChange={(event) => setReportLearningField(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3">{reportLearningFields.map((field) => <option key={field}>{field}</option>)}</select></label>
            <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Tätigkeits-Vorlage<select value={reportTemplateId} onChange={(event) => setReportTemplateId(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3">{reportActivityTemplates.map((template) => <option key={template.id} value={template.id}>{template.label}</option>)}</select></label>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"><button type="button" onClick={onApplyTemplate} className="min-h-12 rounded-2xl bg-slate-950 px-4 text-sm font-bold text-white">Vorlage übernehmen</button><button type="button" onClick={onImportChecklist} className="min-h-12 rounded-2xl bg-emerald-100 px-4 text-sm font-bold text-emerald-800">Aus Auftrag / Checkliste</button><button type="button" onClick={onAddPhotoNote} className="min-h-12 rounded-2xl bg-sky-100 px-4 text-sm font-bold text-sky-800">Foto-Notiz einfügen</button><button type="button" onClick={onGenerateWeekly} className="min-h-12 rounded-2xl bg-violet-100 px-4 text-sm font-bold text-violet-800">Wochenbericht erzeugen</button>{canReview && <button type="button" onClick={onApproveLatest} className="min-h-12 rounded-2xl bg-emerald-100 px-4 text-sm font-bold text-emerald-800">Letzten Bericht freigeben</button>}<button type="button" onClick={onExport} className="min-h-12 rounded-2xl bg-slate-100 px-4 text-sm font-bold text-slate-800">Bericht exportieren</button></div>
          <TextArea label="Stichpunkte / eigener Text" value={reportText} onChange={setReportText} />
          <div className="rounded-3xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-500">Fachbegriffe</p><div className="mt-3 flex flex-wrap gap-2">{reportTechnicalTerms.map((term) => <Badge key={term}>{term}</Badge>)}</div></div>
          <div className="grid gap-3 md:grid-cols-2"><label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Status<select value={reportStatus} onChange={(event) => setReportStatus(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3"><option>Entwurf</option><option>Fertig</option><option>Zur Prüfung</option>{canReview && <option>Änderung erforderlich</option>}{canReview && <option>Freigegeben</option>}</select></label><Field label="Erinnerung" value={reportReminder} onChange={setReportReminder} /></div>
          {canReview && <TextArea label="Meister-Kommentar" value={reportMasterComment} onChange={setReportMasterComment} />}
        </div>
        <div className="space-y-4"><CopyBox title="Bericht-Vorschlag kopieren" text={reportProposal} /><div className="grid gap-3 md:grid-cols-3"><button type="button" onClick={onSave} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-bold text-white"><Save size={17} />Speichern</button><button type="button" onClick={onSelectPdf} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-bold"><FileText size={17} />Für PDF</button><button type="button" onClick={() => window.print()} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-bold"><Printer size={17} />Drucken</button></div>{reportExportText && <CopyBox title="Berichtsheft-Export kopieren" text={reportExportText} />}</div>
      </div>
    </Card>
    <Card>
      <SectionTitle icon={Save} title="Gespeicherte Berichte" subtitle={canReview ? "Berichte der ausgewählten Ausbildungskontexte." : "Nur eigene Berichte werden angezeigt."} />
      <div className="grid gap-4 md:grid-cols-2">{reports.length === 0 && <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">Noch keine Berichte gespeichert.</div>}{reports.map((entry) => <article key={entry.id} className="rounded-3xl bg-slate-50 p-5"><div className="flex flex-wrap items-center gap-2"><Badge>{entry.mode}</Badge><Badge>{entry.status}</Badge><Badge>{entry.orderId || "ohne Auftrag"}</Badge></div><p className="mt-3 text-xs font-bold text-slate-500">{entry.createdAt}</p><textarea readOnly value={entry.text} className="mt-3 h-32 w-full resize-none rounded-2xl border border-slate-200 bg-white p-3 text-sm leading-6" />{entry.masterComment && <p className="mt-3 rounded-2xl bg-white p-3 text-sm"><strong>Meister-Kommentar:</strong> {entry.masterComment}</p>}<div className="mt-3 grid gap-2 md:grid-cols-2"><button type="button" onClick={() => { setReportExportText(entry.text); showNotice("Bericht für Export ausgewählt."); }} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">Export auswählen</button><button type="button" onClick={() => onDelete(entry.id)} className="rounded-2xl bg-rose-100 px-4 py-2 text-sm font-bold text-rose-800">Bericht löschen</button></div></article>)}</div>
    </Card>
  </div>;
}
