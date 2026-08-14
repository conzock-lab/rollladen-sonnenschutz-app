import React, { useMemo, useState } from "react";
import { Clock3, Search, Star, Wrench } from "lucide-react";
import Card from "../components/Card";
import { Badge } from "../components/CheckItem";
import SectionTitle from "../components/SectionHeader";
import { allDiagnosisTrees } from "../data/diagnosis";
import { allManufacturers } from "../data/manufacturers";
import { allMotorTypes } from "../data/motors";
import { allPartCatalog } from "../data/parts";
import { allProductTypes } from "../data/products";
import { buildTechnicalSearchResults, TECHNICAL_FILTERS } from "../lib/technicalSearch";

export default function TechnicalSearchPage({ manufacturerFavorites = [], onOpenResult, query, recents = [], setQuery }) {
  const [filter, setFilter] = useState("Alle");
  const results = useMemo(() => buildTechnicalSearchResults({ query, filter, manufacturers: allManufacturers, motors: allMotorTypes, parts: allPartCatalog, diagnoses: allDiagnosisTrees, products: allProductTypes }), [filter, query]);
  const groups = ["Diagnose", "Hersteller", "Motoren", "Ersatzteile", "Produkte"];
  const favoriteManufacturers = manufacturerFavorites.map((id) => allManufacturers.find((item) => item.id === id)).filter(Boolean).slice(0, 8);

  return <div className="space-y-5">
    <Card><SectionTitle icon={Wrench} title="Technische Suche" subtitle="Hersteller, Antriebe, Diagnosefälle, Ersatzteilgruppen und Produkte gemeinsam durchsuchen." />
      <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4"><Search size={20} className="text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="z. B. Somfy Motor fährt nur hoch, SW60 Mitnehmer, ZIP Führung" className="min-w-0 flex-1 text-sm font-bold outline-none" aria-label="Technik durchsuchen" /></div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{TECHNICAL_FILTERS.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`min-h-11 shrink-0 rounded-2xl px-4 text-xs font-black ${filter === item ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}>{item}</button>)}</div>
    </Card>

    {(favoriteManufacturers.length > 0 || recents.length > 0) && <div className="grid gap-5 lg:grid-cols-2">
      <Card><div className="mb-3 flex items-center gap-2"><Star size={18} className="text-amber-500" /><h2 className="font-black">Favoriten</h2></div><div className="flex flex-wrap gap-2">{favoriteManufacturers.map((item) => <button key={item.id} type="button" onClick={() => onOpenResult({ type: "Hersteller", route: "manufacturers", sourceId: item.id, label: item.name })} className="min-h-11 rounded-2xl bg-amber-50 px-4 text-xs font-black text-amber-900">★ {item.name}</button>)}{!favoriteManufacturers.length && <p className="text-sm font-bold text-slate-400">Noch keine Hersteller-Favoriten.</p>}</div></Card>
      <Card><div className="mb-3 flex items-center gap-2"><Clock3 size={18} /><h2 className="font-black">Zuletzt verwendet</h2></div><div className="flex flex-wrap gap-2">{recents.slice(0, 8).map((item) => <button key={`${item.type}-${item.id}`} type="button" onClick={() => onOpenResult({ type: item.type, route: item.route, sourceId: item.id, label: item.label })} className="min-h-11 rounded-2xl bg-slate-100 px-4 text-xs font-black text-slate-700">{item.label}</button>)}{!recents.length && <p className="text-sm font-bold text-slate-400">Noch keine technischen Bereiche geöffnet.</p>}</div></Card>
    </div>}

    {groups.map((group) => { const entries = results.filter((item) => item.type === group).slice(0, 12); if (!entries.length) return null; return <Card key={group}><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-black">{group}</h2><Badge>{entries.length}</Badge></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{entries.map((item) => <button key={item.id} type="button" onClick={() => onOpenResult(item)} className="min-h-20 rounded-2xl bg-slate-50 p-4 text-left hover:bg-slate-950 hover:text-white"><span className="block text-[11px] font-black uppercase opacity-50">{item.type}</span><strong className="mt-1 block">{item.label}</strong></button>)}</div></Card>; })}
    {!results.length && <Card><p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-500">Keine technischen Treffer. Suchbegriff verkürzen oder Filter zurücksetzen.</p></Card>}
  </div>;
}
