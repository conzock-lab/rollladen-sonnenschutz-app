import React from "react";

export default function LearningTabs({ active, onChange, tabs }) {
  return <nav className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2" aria-label="Lernbereiche">{tabs.map((tab) => <button key={tab.id} type="button" onClick={() => onChange(tab.id)} className={`min-h-11 shrink-0 snap-start rounded-2xl px-4 text-xs font-black ${active === tab.id ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}>{tab.label}</button>)}</nav>;
}
