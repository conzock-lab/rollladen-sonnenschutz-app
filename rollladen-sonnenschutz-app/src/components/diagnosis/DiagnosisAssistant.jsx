import React from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Badge } from "../CheckItem";

export default function DiagnosisAssistant({ onStart, suggestions = [] }) {
  if (!suggestions.length) return <div className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-500">Noch kein passender Prüffall erkannt. Beschreibung ergänzen oder ein Fehlerbild manuell auswählen.</div>;
  return <section className="rounded-3xl bg-sky-50 p-4 md:p-5"><div className="flex items-center gap-2"><AlertTriangle size={18} className="text-sky-800" /><h3 className="font-black">Passende Prüffälle</h3></div><p className="mt-1 text-xs font-semibold text-sky-800">Regelbasierte Vorschläge aus Beschreibung und Auftragskontext – keine automatische Fehlerfeststellung.</p><div className="mt-4 grid gap-3 lg:grid-cols-3">{suggestions.slice(0, 3).map((tree, index) => <article key={tree.id} className="rounded-2xl bg-white p-4"><div className="flex flex-wrap gap-2"><Badge>Vorschlag {index + 1}</Badge><Badge>{tree.category}</Badge></div><h4 className="mt-3 font-black">{tree.title}</h4><p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{tree.symptoms.slice(0, 3).join(" · ")}</p><button type="button" onClick={() => onStart(tree)} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-xs font-black text-white">Prüfung starten<ArrowRight size={16} /></button></article>)}</div></section>;
}
