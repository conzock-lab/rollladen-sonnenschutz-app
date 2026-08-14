import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function OrderProgress({ items }) {
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {items.map((item) => <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-2"><p className="text-sm font-black">{item.label}</p>{item.percent === 100 && <CheckCircle2 size={18} className="text-emerald-600" />}</div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className={`h-full rounded-full ${item.percent === 100 ? "bg-emerald-500" : "bg-slate-950"}`} style={{ width: `${Math.max(0, Math.min(100, item.percent))}%` }} /></div>
      <p className="mt-2 text-xs font-bold text-slate-500">{item.text || `${item.percent}% erledigt`}</p>
    </div>)}
  </div>;
}
