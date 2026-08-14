import React from "react";

export default function OrderTabs({ active, onChange, tabs }) {
  return <nav aria-label="Bereiche der Auftragsakte" className="sticky top-[88px] z-20 rounded-[1.5rem] border border-slate-200 bg-white/95 p-2 shadow-sm backdrop-blur">
    <div className="flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return <button key={tab.id} type="button" onClick={() => onChange(tab.id)} aria-current={active === tab.id ? "page" : undefined} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-black sm:text-sm ${active === tab.id ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700"}`}><Icon size={17} />{tab.label}{Number.isFinite(tab.count) && tab.count > 0 && <span className={`rounded-full px-2 py-0.5 text-[10px] ${active === tab.id ? "bg-white/15" : "bg-amber-100 text-amber-900"}`}>{tab.count}</span>}</button>;
      })}
    </div>
  </nav>;
}
