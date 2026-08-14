import React from "react";
import { AlertTriangle, Camera, ChevronLeft, Pause, Wrench } from "lucide-react";
import { Badge } from "../CheckItem";

export default function DiagnosisStep({ answer, current, onAnswer, onBack, onPause, onPhoto, step, total }) {
  const percent = Math.round(((current + 1) / total) * 100);
  return <section className="rounded-3xl bg-slate-950 p-4 text-white md:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase text-white/50">Schritt {current + 1} von {total}</p><div className="mt-2 flex flex-wrap gap-2"><Badge>{step.stage}</Badge>{step.stopOn && <Badge>Sicherheitsstopp möglich</Badge>}</div></div><div className="flex gap-2"><button type="button" onClick={onBack} disabled={current === 0} className="flex min-h-11 items-center gap-1 rounded-xl bg-white/10 px-3 text-xs font-black disabled:opacity-30"><ChevronLeft size={16} />Zurück</button><button type="button" onClick={onPause} className="flex min-h-11 items-center gap-1 rounded-xl bg-white/10 px-3 text-xs font-black"><Pause size={16} />Pausieren</button></div></div>
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${percent}%` }} /></div>
    <h2 className="mt-6 text-xl font-black leading-8 md:text-2xl">{step.question}</h2><p className="mt-3 text-sm font-semibold leading-6 text-white/70">{step.explanation}</p>
    {step.toolHint && <div className="mt-4 flex items-start gap-2 rounded-2xl bg-white/10 p-3 text-xs font-bold leading-5"><Wrench size={16} className="mt-0.5 shrink-0" />{step.toolHint}</div>}
    {step.stopOn && <div className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-400/15 p-3 text-xs font-bold leading-5 text-amber-100"><AlertTriangle size={16} className="mt-0.5 shrink-0" />Bei unsicherem Zustand Prüfung abbrechen und Anlage sichern.</div>}
    <div className="mt-5 grid gap-3 sm:grid-cols-2">{step.answerOptions.map((option) => <button key={option} type="button" onClick={() => onAnswer(option)} className={`min-h-12 rounded-2xl px-4 text-sm font-black ${answer === option ? "bg-emerald-300 text-emerald-950" : "bg-white text-slate-950"}`}>{option}</button>)}</div>
    <button type="button" onClick={onPhoto} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/20 text-xs font-black"><Camera size={16} />Foto zu diesem Prüfschritt ergänzen</button>
  </section>;
}
