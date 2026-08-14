import React from "react";
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, Clock3, Star } from "lucide-react";
import { Badge } from "../CheckItem";
import { calculateModuleProgress } from "../../lib/learningSystem";

const checkpointLabels = {
  read: "gelesen",
  understood: "verstanden",
  practiceSeen: "in Praxis gesehen",
  selfPerformed: "selbst durchgeführt",
  masterAsked: "mit Meister besprochen",
  secure: "sicher beherrscht",
};

export default function LearningModuleCard({ expanded, favorite, later, module, moduleById, onOpenQuiz, onPrepareReport, onToggleCheckpoint, onToggleExpanded, onToggleList, progress = {}, readOnly }) {
  const summary = calculateModuleProgress(module, progress);
  const prerequisites = (module.prerequisites || []).map((id) => moduleById[id]).filter(Boolean);
  const relatedModules = Object.values(moduleById).filter((item) => item.id !== module.id && (item.category === module.category || item.prerequisites?.includes(module.id))).slice(0, 4);
  const checkpoints = [...new Set([...(module.requiredCheckpoints || []), "secure"])];

  return <article className={`rounded-3xl border p-4 ${summary.status === "Sicher" ? "border-emerald-200 bg-emerald-50" : "border-slate-100 bg-slate-50"}`}>
    <div className="flex items-start justify-between gap-3">
      <div><div className="flex flex-wrap gap-2"><Badge>{module.year}. Jahr</Badge><Badge>{module.category}</Badge><Badge>{summary.status}</Badge></div><h3 className="mt-3 font-black leading-6">{module.title}</h3><div className="mt-2 flex items-center gap-3 text-xs font-bold text-slate-500"><span>{module.difficulty}</span><span className="flex items-center gap-1"><Clock3 size={14} />{module.estimatedMinutes} Min.</span></div></div>
      <button type="button" disabled={readOnly} onClick={() => onToggleList("favorites", module.id)} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl disabled:cursor-default ${favorite ? "bg-amber-100 text-amber-700" : "bg-white text-slate-300"}`} aria-label={`${module.title} favorisieren`}><Star size={18} fill={favorite ? "currentColor" : "none"} /></button>
    </div>
    <p className="mt-3 text-sm leading-6 text-slate-600">{module.summary}</p>
    <div className="mt-3 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${summary.percent}%` }} /></div><span className="text-xs font-black">{summary.percent}%</span></div>
    <div className="mt-4 grid grid-cols-2 gap-2">{checkpoints.map((id) => { const checked = Boolean(progress[id]); return <button key={id} type="button" disabled={readOnly} onClick={() => onToggleCheckpoint(module.id, id, !checked)} className={`flex min-h-11 items-center gap-2 rounded-2xl px-3 text-left text-xs font-bold disabled:cursor-default ${checked ? "bg-emerald-100 text-emerald-900" : "bg-white text-slate-600"}`}><CheckCircle2 size={16} className={checked ? "text-emerald-600" : "text-slate-300"} />{checkpointLabels[id] || id}</button>; })}</div>
    {prerequisites.length > 0 && <div className="mt-3 rounded-2xl bg-amber-50 p-3 text-xs font-bold text-amber-900">Empfohlen vorher: {prerequisites.map((item) => item.title).join(" · ")}. Das Modul bleibt trotzdem zugänglich.</div>}
    <div className="mt-3 grid grid-cols-2 gap-2"><button type="button" disabled={readOnly} onClick={() => onToggleList("later", module.id)} className={`min-h-11 rounded-xl px-3 text-xs font-black disabled:cursor-default ${later ? "bg-sky-100 text-sky-900" : "bg-white text-slate-700"}`}>{later ? "Später lernen ✓" : "Später lernen"}</button><button type="button" onClick={onToggleExpanded} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white text-xs font-black">Modul öffnen{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button></div>

    {expanded && <div className="mt-4 space-y-3">
      <div className="rounded-2xl bg-white p-4"><p className="text-xs font-black uppercase text-slate-500">Was lernst du?</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">{module.learningGoals.map((goal) => <li key={goal}>{goal}</li>)}</ul></div>
      <div className="rounded-2xl bg-white p-4"><p className="text-xs font-black uppercase text-slate-500">Kurz erklärt</p><p className="mt-2 text-sm leading-6 text-slate-600">{module.theory}</p></div>
      <div className="rounded-2xl bg-rose-50 p-4"><p className="text-xs font-black uppercase text-rose-700">Darauf achten</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-rose-950">{module.typicalMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul></div>
      {module.safetyNotes.length > 0 && <div className="rounded-2xl bg-amber-50 p-4"><p className="text-xs font-black uppercase text-amber-700">Sicherheit</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-950">{module.safetyNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>}
      <div className="rounded-2xl bg-sky-50 p-4"><p className="text-xs font-black uppercase text-sky-700">Praxisaufgabe</p><p className="mt-2 text-sm font-bold leading-6 text-sky-950">{module.practicalTask}</p></div>
      <div className="rounded-2xl bg-white p-4"><p className="text-xs font-black uppercase text-slate-500">Verwandte Themen</p><div className="mt-2 flex flex-wrap gap-2">{relatedModules.map((item) => <Badge key={item.id}>{item.title}</Badge>)}{module.relatedProducts.map((item) => <Badge key={`product-${item}`}>{item}</Badge>)}{module.relatedTools.map((item) => <Badge key={`tool-${item}`}>{item}</Badge>)}</div></div>
      <div className="grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => onOpenQuiz(module.id)} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white"><BookOpen size={17} />Wissen testen</button><button type="button" disabled={readOnly} onClick={() => onPrepareReport(module)} className="min-h-12 rounded-2xl bg-white px-4 text-sm font-black disabled:opacity-40">Für Berichtsheft vormerken</button></div>
    </div>}
  </article>;
}
