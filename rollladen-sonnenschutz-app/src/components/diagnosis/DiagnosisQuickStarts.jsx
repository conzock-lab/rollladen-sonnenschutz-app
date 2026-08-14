import React from "react";
import { Clock3, Play, Star } from "lucide-react";
import { Badge } from "../CheckItem";

export default function DiagnosisQuickStarts({ cases = [], favorites = [], onStart, onToggleFavorite, recentCases = [] }) {
  return <section className="space-y-4">
    {recentCases.length > 0 && <div><div className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-slate-500"><Clock3 size={15} />Zuletzt verwendet</div><div className="flex snap-x gap-2 overflow-x-auto pb-2">{recentCases.slice(0, 5).map((tree) => <button key={tree.id} type="button" onClick={() => onStart(tree)} className="min-h-11 shrink-0 snap-start rounded-2xl bg-slate-100 px-4 text-xs font-black">{tree.title}</button>)}</div></div>}
    <div><h3 className="font-black">Schnellstarts</h3><p className="mt-1 text-xs font-semibold text-slate-500">Häufige Fälle direkt im Schrittmodus öffnen.</p></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cases.map((tree) => { const favorite = favorites.includes(tree.id); return <article key={tree.id} className="rounded-3xl bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><Badge>{tree.category}</Badge><h4 className="mt-2 font-black">{tree.title}</h4></div><button type="button" onClick={() => onToggleFavorite(tree.id)} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${favorite ? "bg-amber-100 text-amber-700" : "bg-white text-slate-300"}`} aria-label={`${tree.title} favorisieren`}><Star size={18} fill={favorite ? "currentColor" : "none"} /></button></div><button type="button" onClick={() => onStart(tree)} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-xs font-black shadow-sm"><Play size={15} />Starten</button></article>; })}</div>
  </section>;
}
