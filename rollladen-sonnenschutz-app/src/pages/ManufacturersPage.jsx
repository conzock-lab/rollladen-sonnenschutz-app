import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Database, FileText, Search, Star } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import { InlineProgress, OrderContext } from "../components/ModuleProgress";
import SectionTitle from "../components/SectionHeader";
import NameplateAssistant from "../components/technical/NameplateAssistant";
import { allDiagnosisTrees } from "../data/diagnosis";
import { allManufacturers, manufacturerCaptureSteps, manufacturerCategories } from "../data/manufacturers";

const DETAIL_TABS = [
  { id: "overview", label: "Übersicht" },
  { id: "products", label: "Produkte" },
  { id: "motors", label: "Motoren" },
  { id: "controls", label: "Steuerungen" },
  { id: "parts", label: "Ersatzteile" },
  { id: "diagnosis", label: "Diagnose" },
  { id: "notes", label: "Notizen" },
];

function List({ empty = "Noch keine Detaildaten hinterlegt.", items = [] }) {
  return <div className="grid gap-2 sm:grid-cols-2">{items.map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{item}</div>)}{!items.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-400">{empty}</p>}</div>;
}

export default function ManufacturersPage({
  checkButton,
  favorites = [],
  filteredMakers,
  manufacturerQuery,
  moduleChecks,
  notes = {},
  onAnalyzeNameplate,
  onNoteChange,
  onOpenDiagnosis,
  onOpenMotors,
  onOpenParts,
  onToggleFavorite,
  onUse,
  selectedOrder,
  selectedProduct,
  setManufacturerQuery,
}) {
  const initialManufacturer = allManufacturers.find((item) => item.name.toLocaleLowerCase("de-DE") === String(selectedOrder?.manufacturer || "").toLocaleLowerCase("de-DE"));
  const [category, setCategory] = useState("Alle");
  const [selectedId, setSelectedId] = useState(initialManufacturer?.id || "");
  const [detailTab, setDetailTab] = useState("overview");

  const makers = useMemo(() => filteredMakers
    .filter((maker) => category === "Alle" || maker.categories.includes(category))
    .sort((left, right) => Number(favorites.includes(right.id)) - Number(favorites.includes(left.id)) || Number(right.productIds.includes(selectedProduct?.id)) - Number(left.productIds.includes(selectedProduct?.id)) || left.name.localeCompare(right.name, "de")), [category, favorites, filteredMakers, selectedProduct?.id]);
  const selected = allManufacturers.find((item) => item.id === selectedId) || makers[0] || null;

  useEffect(() => {
    const exact = allManufacturers.find((item) => item.name.toLocaleLowerCase("de-DE") === manufacturerQuery.trim().toLocaleLowerCase("de-DE"));
    if (exact) setSelectedId(exact.id);
  }, [manufacturerQuery]);

  const openManufacturer = (maker) => {
    setSelectedId(maker.id);
    setDetailTab("overview");
    onUse?.({ type: "Hersteller", id: maker.id, label: maker.name, route: "manufacturers" });
  };

  return <div className="space-y-5">
    <Card><SectionTitle icon={Database} title="Herstellerdatenbank" subtitle="Kompakte Suche nach Produkten, Antrieben, Funk, Ersatzteilgruppen und Diagnosebereichen." />
      <OrderContext selectedOrder={selectedOrder} selectedProduct={selectedProduct} text="Hersteller und Produkt des aktiven Auftrags werden priorisiert." />
      <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4"><Search size={19} className="text-slate-400" /><input value={manufacturerQuery} onChange={(event) => setManufacturerQuery(event.target.value)} placeholder="Somfy, Funkmotor, Raffstore, Handsender, Sensor ..." className="min-w-0 flex-1 text-sm font-bold outline-none" aria-label="Hersteller durchsuchen" /></div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{manufacturerCategories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`min-h-11 shrink-0 rounded-2xl px-4 text-xs font-black ${category === item ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}>{item}</button>)}</div>
      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900"><AlertTriangle size={17} className="mt-0.5 shrink-0" />Keine Tastfolge, Kompatibilität oder Einstellung allein aus dem Markennamen ableiten. Modell, Serie und Herstellerunterlage prüfen; elektrische Arbeiten nur entsprechend Qualifikation und Vorschriften.</div>
    </Card>

    {favorites.length > 0 && <Card><div className="mb-3 flex items-center gap-2"><Star size={18} className="text-amber-500" /><h2 className="font-black">Häufig verwendet</h2></div><div className="flex flex-wrap gap-2">{favorites.slice(0, 8).map((id) => { const maker = allManufacturers.find((item) => item.id === id); return maker ? <button key={id} type="button" onClick={() => openManufacturer(maker)} className="min-h-11 rounded-2xl bg-amber-50 px-4 text-xs font-black text-amber-900">★ {maker.name}</button> : null; })}</div></Card>}

    <div className="grid items-start gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">{makers.map((maker) => { const favorite = favorites.includes(maker.id); const relevant = maker.productIds.includes(selectedProduct?.id); return <article key={maker.id} className={`rounded-3xl border p-4 ${selected?.id === maker.id ? "border-slate-950 bg-white shadow-md" : relevant ? "border-sky-200 bg-sky-50" : "border-transparent bg-slate-50"}`}><div className="flex items-start justify-between gap-3"><button type="button" onClick={() => openManufacturer(maker)} className="min-w-0 flex-1 text-left"><span className="block font-black">{maker.name}</span><span className="mt-1 block text-xs font-semibold text-slate-500">{maker.categories.slice(0, 3).join(" · ")}</span></button><button type="button" onClick={() => onToggleFavorite?.(maker.id)} aria-label={`${maker.name} ${favorite ? "aus Favoriten entfernen" : "favorisieren"}`} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${favorite ? "bg-amber-100 text-amber-700" : "bg-white text-slate-300"}`}><Star size={18} fill={favorite ? "currentColor" : "none"} /></button></div><div className="mt-3 flex flex-wrap gap-2">{relevant && <Badge>Zum Auftrag</Badge>}{maker.protocols.slice(0, 2).map((item) => <Badge key={item}>{item}</Badge>)}</div></article>; })}{!makers.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">Kein Hersteller gefunden.</p>}</div></Card>

      {selected && <Card><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap gap-2">{selected.categories.map((item) => <Badge key={item}>{item}</Badge>)}</div><h2 className="mt-3 text-2xl font-black">{selected.name}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{selected.note}</p></div><button type="button" onClick={() => onToggleFavorite?.(selected.id)} className={`inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 text-xs font-black ${favorites.includes(selected.id) ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-700"}`}><Star size={17} fill={favorites.includes(selected.id) ? "currentColor" : "none"} />{favorites.includes(selected.id) ? "Favorit" : "Favorisieren"}</button></div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{DETAIL_TABS.map((tab) => <button key={tab.id} type="button" onClick={() => setDetailTab(tab.id)} className={`min-h-11 shrink-0 rounded-2xl px-4 text-xs font-black ${detailTab === tab.id ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}>{tab.label}</button>)}</div>
        <div className="mt-4">
          {detailTab === "overview" && <div className="space-y-4"><List items={selected.topics} /><div className="rounded-2xl bg-slate-50 p-4"><p className="flex items-center gap-2 font-black"><FileText size={17} />Dokumentation</p><p className="mt-2 text-sm leading-6 text-slate-600">{selected.documentHint}</p></div><InlineProgress moduleChecks={moduleChecks} groups={[{ scope: `hersteller-erfassung-${selected.id}`, items: manufacturerCaptureSteps }]} /><div className="space-y-2">{manufacturerCaptureSteps.map((item) => checkButton(`hersteller-erfassung-${selected.id}`, item))}</div><NameplateAssistant onAnalyze={onAnalyzeNameplate} /></div>}
          {detailTab === "products" && <List items={selected.typicalProducts} />}
          {detailTab === "motors" && <div><List items={selected.motors} /><button type="button" onClick={() => onOpenMotors?.(selected)} className="mt-4 min-h-12 w-full rounded-2xl bg-slate-950 px-4 text-sm font-black text-white">Passende Motorbereiche öffnen</button></div>}
          {detailTab === "controls" && <div className="space-y-4"><List items={[...selected.controls, ...selected.protocols.map((item) => `Funk/System: ${item}`), ...selected.sensors, ...selected.smartHome]} /></div>}
          {detailTab === "parts" && <div><List items={selected.partCategories} /><button type="button" onClick={() => onOpenParts?.(selected)} className="mt-4 min-h-12 w-full rounded-2xl bg-slate-950 px-4 text-sm font-black text-white">Mögliche Ersatzteilgruppen öffnen</button></div>}
          {detailTab === "diagnosis" && <div><List items={selected.diagnosisIds.map((id) => allDiagnosisTrees.find((tree) => tree.id === id)?.title || id)} /><button type="button" onClick={() => onOpenDiagnosis?.(selected)} className="mt-4 min-h-12 w-full rounded-2xl bg-slate-950 px-4 text-sm font-black text-white">Diagnosebereiche öffnen</button></div>}
          {detailTab === "notes" && <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Interne Praxisnotiz<textarea value={notes[`manufacturer:${selected.id}`] || ""} onChange={(event) => onNoteChange?.(`manufacturer:${selected.id}`, event.target.value)} placeholder="z. B. Adapter und Typenschild vor Bestellung gemeinsam prüfen" className="mt-2 h-32 w-full resize-none rounded-2xl border border-slate-200 bg-white p-3 text-sm font-medium outline-none" /></label>}
        </div>
      </Card>}
    </div>
  </div>;
}
