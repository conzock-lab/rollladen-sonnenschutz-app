import React, { useMemo, useState } from "react";
import { BriefcaseBusiness, Search, X } from "lucide-react";

const normalize = (value) => String(value || "").toLocaleLowerCase("de-DE");

export default function GlobalSearch({ items, onNavigate, onOpenOrder, orders }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const term = normalize(query).trim();
    if (term.length < 2) return [];
    const pageResults = items.filter((item) => normalize([item.label, ...(item.keywords || [])].join(" ")).includes(term)).slice(0, 6).map((item) => ({ type: "page", id: item.id, label: item.label, icon: item.icon, meta: "Bereich" }));
    const orderResults = orders.filter((order) => normalize([order.id, order.customer, order.contact, order.address, order.product, order.notes].join(" ")).includes(term)).slice(0, 4).map((order) => ({ type: "order", id: order.id, label: `${order.id} · ${order.customer}`, icon: BriefcaseBusiness, meta: order.address || "Auftrag" }));
    return [...pageResults, ...orderResults].slice(0, 8);
  }, [items, orders, query]);

  const choose = (result) => {
    if (result.type === "order") onOpenOrder(result.id);
    else onNavigate(result.id);
    setQuery("");
  };

  return <div className="relative min-w-0 flex-1">
    <div className="flex min-h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 shadow-sm"><Search size={18} className="shrink-0 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Bereiche, Aufträge, Somfy, WDVS …" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Suche leeren" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><X size={16} /></button>}</div>
    {query.trim().length >= 2 && <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">{results.length ? results.map((result) => { const Icon = result.icon; return <button key={`${result.type}-${result.id}`} type="button" onClick={() => choose(result)} className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-slate-50"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100"><Icon size={17} /></span><span className="min-w-0"><strong className="block truncate text-sm">{result.label}</strong><span className="block truncate text-xs text-slate-500">{result.meta}</span></span></button>; }) : <p className="p-4 text-sm font-bold text-slate-500">Keine passenden Bereiche oder Aufträge gefunden.</p>}</div>}
  </div>;
}

