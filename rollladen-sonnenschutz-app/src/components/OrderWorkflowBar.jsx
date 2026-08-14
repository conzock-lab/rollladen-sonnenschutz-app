import React from "react";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";

function currentStageIndex(status = "") {
  const normalized = String(status).toLowerCase();
  if (normalized.includes("erledigt") || normalized.includes("archiv")) return 5;
  if (normalized.includes("abgerechnet") || normalized.includes("dokument")) return 4;
  if (normalized.includes("nacharbeit") || normalized.includes("abschluss")) return 3;
  if (normalized.includes("arbeit") || normalized.includes("teil")) return 2;
  if (normalized.includes("geplant")) return 1;
  return 0;
}

export default function OrderWorkflowBar({ canOpenModule, onArchive, onCreateRework, onNavigate, onStartParts, order, stages }) {
  const activeStage = currentStageIndex(order?.status);
  const actions = [
    { id: "planning", label: "Team zuweisen", module: "planning" },
    { id: "checklists", label: "Checkliste öffnen", module: "checklists" },
    { id: "photos", label: "Fotos öffnen", module: "photos" },
    { id: "parts", label: "Ersatzteile", module: "parts", run: onStartParts },
    { id: "closeOrder", label: "Auftrag abschließen", module: "closeOrder" },
    { id: "pdf", label: "PDF erstellen", module: "pdf" },
    { id: "rework", label: "Nacharbeit anlegen", run: onCreateRework },
  ];

  const runAction = (action) => {
    if (action.run) action.run();
    else onNavigate(action.module);
  };

  return <section className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-black uppercase tracking-wide text-slate-400">Auftragsablauf</p><h3 className="mt-1 font-black">Aktuell: {stages[activeStage]?.title}</h3></div>{activeStage === 5 && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">Erledigt</span>}</div>
    <div className="mt-4 overflow-x-auto pb-2"><div className="grid min-w-[690px] grid-cols-6 gap-2">{stages.map((stage, index) => { const complete = index < activeStage; const current = index === activeStage; return <div key={stage.id} className="relative"><div className={`min-h-[76px] rounded-2xl border p-3 ${current ? "border-slate-950 bg-slate-950 text-white" : complete ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-white text-slate-500"}`}><div className="flex items-center gap-2">{complete ? <CheckCircle2 size={16} /> : <Circle size={16} />}<span className="text-[11px] font-black">{index + 1}</span></div><p className="mt-2 text-xs font-black">{stage.title}</p></div>{index < stages.length - 1 && <ArrowRight size={14} className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white text-slate-400" />}</div>; })}</div></div>
    <p className="mt-2 text-sm leading-6 text-slate-600">{stages[activeStage]?.text}</p>
    <div className="mt-3 flex flex-wrap gap-2">{actions.map((action) => { const allowed = !action.module || canOpenModule(action.module); return <button key={action.id} type="button" disabled={!allowed} onClick={() => runAction(action)} className={`min-h-11 rounded-xl px-3 text-xs font-black ${allowed ? "bg-white text-slate-800 shadow-sm hover:bg-slate-950 hover:text-white" : "cursor-not-allowed bg-slate-100 text-slate-400"}`}>{action.label}</button>; })}{activeStage >= 4 && canOpenModule("workflow") && <button type="button" onClick={onArchive} className="min-h-11 rounded-xl bg-rose-100 px-3 text-xs font-black text-rose-800">Archivieren</button>}</div>
  </section>;
}

