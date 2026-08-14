import React, { useState } from "react";
import { Menu } from "lucide-react";
import MobileMoreMenu from "./MobileMoreMenu";

export default function MobileBottomNav({ active, favorites, groups, items, onLogout, onNavigate, onToggleFavorite, status }) {
  const [openMore, setOpenMore] = useState(false);
  const primaryIds = items.map((item) => item.id);

  return <>
    {openMore && <MobileMoreMenu active={active} favorites={favorites} groups={groups} onClose={() => setOpenMore(false)} onLogout={onLogout} onNavigate={onNavigate} onToggleFavorite={onToggleFavorite} primaryIds={primaryIds} status={status} />}
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-2xl backdrop-blur">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {items.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => onNavigate(item.id)} className={`flex min-h-[58px] flex-col items-center justify-center rounded-2xl px-1 py-2 text-[10px] font-black ${active === item.id ? "bg-slate-950 text-white" : "text-slate-600"}`}><Icon size={20} /><span className="mt-1 max-w-full truncate">{item.shortLabel || item.label}</span></button>; })}
        <button type="button" onClick={() => setOpenMore(true)} className="flex min-h-[58px] flex-col items-center justify-center rounded-2xl px-1 py-2 text-[10px] font-black text-slate-600"><Menu size={20} /><span className="mt-1">Mehr</span></button>
      </div>
    </nav>
  </>;
}

