import React from "react";
import { LogOut, Star, X } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function MobileMoreMenu({ active, favorites, groups, onClose, onLogout, onNavigate, onToggleFavorite, primaryIds, status }) {
  const remainingGroups = groups
    .map((group) => ({ ...group, items: group.items.filter((item) => !primaryIds.includes(item.id)) }))
    .filter((group) => group.items.length > 0);

  return <div className="fixed inset-0 z-[60] bg-slate-950/35 backdrop-blur-sm" onClick={onClose}>
    <section role="dialog" aria-modal="true" aria-label="Weitere Bereiche" onClick={(event) => event.stopPropagation()} className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-[2rem] bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl">
      <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
      <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-wide text-slate-400">Navigation</p><h2 className="text-xl font-black">Mehr</h2></div><button type="button" onClick={onClose} aria-label="Menü schließen" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"><X size={20} /></button></div>
      <div className="mb-4"><StatusBadge offline={status.offline} pendingCount={status.pendingCount} lastSyncedAt={status.lastSyncedAt} error={status.error} /></div>
      <div className="space-y-5">
        {remainingGroups.map((group) => <div key={group.id}><p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">{group.label}</p><div className="grid grid-cols-2 gap-2">{group.items.map((item) => {
          const Icon = item.icon;
          const pinned = favorites.includes(item.id);
          return <div key={item.id} className={`relative rounded-2xl ${active === item.id ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700"}`}><button type="button" onClick={() => { onNavigate(item.id); onClose(); }} className="flex min-h-[68px] w-full flex-col items-start justify-center gap-1 px-3 pr-11 text-left text-xs font-black"><Icon size={19} /><span>{item.label}</span></button>{item.id !== "dashboard" && <button type="button" aria-label={pinned ? "Favorit entfernen" : "Als Favorit anheften"} onClick={() => onToggleFavorite(item.id)} className={`absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-xl ${pinned ? "text-amber-400" : "text-slate-400"}`}><Star size={16} fill={pinned ? "currentColor" : "none"} /></button>}</div>;
        })}</div></div>)}
      </div>
      <button type="button" onClick={onLogout} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-rose-100 px-4 text-sm font-black text-rose-800"><LogOut size={18} />Abmelden</button>
    </section>
  </div>;
}

