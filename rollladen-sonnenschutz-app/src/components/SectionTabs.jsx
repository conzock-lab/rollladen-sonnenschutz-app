import React from "react";
import { Star } from "lucide-react";

export default function SectionTabs({ active, favorites, group, onNavigate, onToggleFavorite }) {
  if (!group || group.items.length < 2) return null;
  const GroupIcon = group.icon;

  return <section className="mb-4 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm" aria-label={`${group.label} Unterbereiche`}>
    <div className="mb-2 flex items-center gap-2 px-1">
      <GroupIcon size={18} className="text-slate-500" />
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{group.label}</p>
    </div>
    <div className="flex gap-2 overflow-x-auto pb-1">
      {group.items.map((item) => {
        const Icon = item.icon;
        const selected = item.id === active;
        const pinned = favorites.includes(item.id);
        return <div key={item.id} className={`flex shrink-0 items-center rounded-xl border ${selected ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
          <button type="button" onClick={() => onNavigate(item.id)} className="flex min-h-11 items-center gap-2 px-3 text-xs font-black sm:text-sm" aria-current={selected ? "page" : undefined}>
            <Icon size={17} className="shrink-0" />
            <span>{item.label}</span>
          </button>
          {item.id !== "dashboard" && <button type="button" onClick={() => onToggleFavorite(item.id)} aria-label={pinned ? `${item.label} aus Favoriten entfernen` : `${item.label} als Favorit speichern`} className={`mr-1 flex h-9 w-9 items-center justify-center rounded-lg ${pinned ? "text-amber-400" : selected ? "text-white/45 hover:text-white" : "text-slate-300 hover:bg-white hover:text-amber-500"}`}><Star size={15} fill={pinned ? "currentColor" : "none"} /></button>}
        </div>;
      })}
    </div>
  </section>;
}
