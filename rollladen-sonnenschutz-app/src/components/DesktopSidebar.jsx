import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, LogOut, Star } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function DesktopSidebar({
  active,
  collapsed,
  favorites,
  groups,
  onLogout,
  onNavigate,
  onToggleCollapsed,
  onToggleFavorite,
  status,
}) {
  const activeGroupId = useMemo(() => groups.find((group) => group.items.some((item) => item.id === active))?.id || groups[0]?.id, [active, groups]);
  const [openGroup, setOpenGroup] = useState(activeGroupId);

  useEffect(() => {
    if (collapsed) setOpenGroup("");
    else if (activeGroupId) setOpenGroup(activeGroupId);
  }, [activeGroupId, collapsed]);

  return <aside className={`sticky top-4 h-[calc(100vh-2rem)] rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-sm transition-all ${collapsed ? "w-[78px]" : "w-full"}`}>
    <div className="flex h-full flex-col">
      <div className={`mb-3 flex items-center ${collapsed ? "justify-center" : "justify-between px-2"}`}>
        {!collapsed && <div><p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Navigation</p><p className="text-sm font-black text-slate-900">Rollladen & Sonnenschutz</p></div>}
        <button type="button" onClick={onToggleCollapsed} aria-label={collapsed ? "Sidebar ausklappen" : "Sidebar einklappen"} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">{collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}</button>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {groups.map((group) => {
          const GroupIcon = group.icon;
          const isOpen = openGroup === group.id;
          const groupActive = group.items.some((item) => item.id === active);
          return <div key={group.id} className="relative">
            <button type="button" title={collapsed ? group.label : ""} onClick={() => setOpenGroup((current) => current === group.id ? "" : group.id)} className={`flex min-h-11 w-full items-center rounded-xl text-sm font-black transition ${collapsed ? "justify-center px-2" : "justify-between px-3"} ${groupActive ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50"}`}>
              <span className="flex items-center gap-3"><GroupIcon size={19} />{!collapsed && group.label}</span>
              {!collapsed && <ChevronDown size={16} className={`transition ${isOpen ? "rotate-180" : ""}`} />}
            </button>
            {!collapsed && isOpen && <div className="my-1 ml-3 space-y-1 border-l border-slate-200 pl-3">
              {group.items.map((item) => {
                const Icon = item.icon;
                const pinned = favorites.includes(item.id);
                return <div key={item.id} className={`group/item flex items-center rounded-xl ${active === item.id ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
                  <button type="button" onClick={() => onNavigate(item.id)} className="flex min-h-11 min-w-0 flex-1 items-center gap-3 px-3 text-left text-sm font-bold"><Icon size={17} className="shrink-0" /><span className="truncate">{item.label}</span></button>
                  {item.id !== "dashboard" && <button type="button" onClick={() => onToggleFavorite(item.id)} aria-label={pinned ? `${item.label} aus Favoriten entfernen` : `${item.label} anheften`} className={`mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${pinned ? "text-amber-400" : active === item.id ? "text-white/50 hover:text-white" : "text-slate-300 hover:text-amber-500"}`}><Star size={15} fill={pinned ? "currentColor" : "none"} /></button>}
                </div>;
              })}
            </div>}
            {collapsed && isOpen && <div className="absolute left-[calc(100%+0.6rem)] top-0 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"><p className="px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-400">{group.label}</p>{group.items.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => { onNavigate(item.id); setOpenGroup(""); }} className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-bold ${active === item.id ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-50"}`}><Icon size={17} />{item.label}</button>; })}</div>}
          </div>;
        })}
      </nav>

      <div className="mt-3 border-t border-slate-100 pt-3">
        {!collapsed && <StatusBadge offline={status.offline} pendingCount={status.pendingCount} lastSyncedAt={status.lastSyncedAt} error={status.error} />}
        <button type="button" onClick={onLogout} title={collapsed ? "Abmelden" : ""} className={`mt-2 flex min-h-11 w-full items-center rounded-xl bg-rose-50 text-sm font-black text-rose-800 hover:bg-rose-100 ${collapsed ? "justify-center" : "gap-3 px-3"}`}><LogOut size={18} />{!collapsed && "Abmelden"}</button>
      </div>
    </div>
  </aside>;
}
