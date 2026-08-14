import React from "react";
import { AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";

export default function OrderOpenItems({ items, onOpen }) {
  if (!items.length) return <div className="flex items-start gap-3 rounded-3xl bg-emerald-50 p-5 text-emerald-900"><CheckCircle2 className="shrink-0" /><div><p className="font-black">Keine offenen Punkte</p><p className="mt-1 text-sm">Die Auftragsakte ist vollständig vorbereitet.</p></div></div>;

  return <div className="space-y-2">
    <div className="flex items-center gap-2 rounded-2xl bg-amber-50 p-3 text-sm font-black text-amber-900"><AlertTriangle size={18} />{items.length} {items.length === 1 ? "Punkt" : "Punkte"} vor Abschluss offen</div>
    {items.map((item) => <button key={item.id} type="button" onClick={() => onOpen(item.tab)} className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 text-left text-sm font-bold text-slate-700 hover:bg-white hover:shadow-sm"><span>{item.label}</span><ChevronRight size={18} className="shrink-0 text-slate-400" /></button>)}
  </div>;
}
