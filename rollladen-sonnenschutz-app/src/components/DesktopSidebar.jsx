import React from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";

export default function DesktopSidebar({
  active,
  collapsed,
  groups,
  onLogout,
  onNavigate,
  onToggleCollapsed,
}) {
  return <aside className={`sticky top-4 h-[calc(100vh-2rem)] rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-sm transition-all ${collapsed ? "w-[78px]" : "w-full"}`}>
    <div className="flex h-full flex-col">
      <div className={`mb-4 flex items-center ${collapsed ? "justify-center" : "justify-between px-2"}`}>
        {!collapsed && <div><p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Navigation</p><p className="text-sm font-black text-slate-900">Rollladen & Sonnenschutz</p></div>}
        <button type="button" onClick={onToggleCollapsed} aria-label={collapsed ? "Sidebar ausklappen" : "Sidebar einklappen"} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">{collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}</button>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Hauptnavigation">
        {groups.map((group) => {
          const GroupIcon = group.icon;
          const groupActive = group.items.some((item) => item.id === active);
          const target = group.items.some((item) => item.id === active)
            ? active
            : group.items.find((item) => item.id === group.defaultId)?.id || group.items[0]?.id;

          return <button
            key={group.id}
            type="button"
            title={collapsed ? group.label : ""}
            onClick={() => target && onNavigate(target)}
            aria-current={groupActive ? "page" : undefined}
            className={`flex min-h-12 w-full items-center rounded-xl text-sm font-black transition ${collapsed ? "justify-center px-2" : "gap-3 px-3 text-left"} ${groupActive ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}
          >
            <GroupIcon size={20} className="shrink-0" />
            {!collapsed && <span className="truncate">{group.label}</span>}
          </button>;
        })}
      </nav>

      <div className="mt-3 border-t border-slate-100 pt-3">
        <button type="button" onClick={onLogout} title={collapsed ? "Abmelden" : ""} className={`flex min-h-11 w-full items-center rounded-xl bg-rose-50 text-sm font-black text-rose-800 hover:bg-rose-100 ${collapsed ? "justify-center" : "gap-3 px-3"}`}><LogOut size={18} />{!collapsed && "Abmelden"}</button>
      </div>
    </div>
  </aside>;
}
