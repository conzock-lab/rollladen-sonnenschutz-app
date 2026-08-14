import React from "react";
import { Star, X } from "lucide-react";

export default function QuickAccessBar({ favorites, items, onNavigate, onToggleFavorite }) {
  const pinnedItems = favorites.map((id) => items.find((item) => item.id === id)).filter(Boolean).slice(0, 5);
  if (!pinnedItems.length) return null;
  return <div className="mb-4 flex items-center gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"><span className="flex shrink-0 items-center gap-1 px-2 text-xs font-black uppercase tracking-wide text-slate-400"><Star size={14} fill="currentColor" />Schnellzugriff</span>{pinnedItems.map((item) => { const Icon = item.icon; return <div key={item.id} className="flex shrink-0 items-center rounded-xl bg-slate-100"><button type="button" onClick={() => onNavigate(item.id)} className="flex min-h-10 items-center gap-2 px-3 text-xs font-black text-slate-700"><Icon size={16} />{item.label}</button><button type="button" onClick={() => onToggleFavorite(item.id)} aria-label={`${item.label} aus Favoriten entfernen`} className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white"><X size={14} /></button></div>; })}</div>;
}
