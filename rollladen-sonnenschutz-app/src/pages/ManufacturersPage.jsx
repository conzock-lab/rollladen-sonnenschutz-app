import React, { useMemo } from "react";
import { AlertTriangle, Database, Search } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import ModuleProgress, { InlineProgress, OrderContext } from "../components/ModuleProgress";
import SectionTitle from "../components/SectionHeader";
import { allManufacturers, manufacturerCaptureSteps } from "../data/manufacturers";

export default function ManufacturersPage({ checkButton, filteredMakers, manufacturerQuery, moduleChecks, selectedOrder, selectedProduct, setManufacturerQuery }) {
  const groups = allManufacturers.flatMap((maker) => [
    { scope: `hersteller-${maker.name}`, items: maker.topics },
    { scope: `hersteller-erfassung-${maker.name}`, items: manufacturerCaptureSteps },
  ]);
  const sortedMakers = useMemo(() => [...filteredMakers].sort((a, b) => Number(b.productIds.includes(selectedProduct?.id)) - Number(a.productIds.includes(selectedProduct?.id))), [filteredMakers, selectedProduct?.id]);

  return (
    <Card>
      <SectionTitle icon={Database} title="Herstellerdatenbank" subtitle="Systemfamilie erkennen, Bestandsdaten aufnehmen und passende Originalunterlagen finden." />
      <ModuleProgress moduleChecks={moduleChecks} groups={groups} title="Hersteller- und Erfassungspunkte" />
      <OrderContext selectedOrder={selectedOrder} selectedProduct={selectedProduct} text="Passende Herstellerbereiche werden zuerst angezeigt." />

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <Search size={18} className="text-slate-400" />
        <input value={manufacturerQuery} onChange={(event) => setManufacturerQuery(event.target.value)} placeholder="Hersteller, Systemfamilie oder Thema suchen" className="w-full outline-none" aria-label="Hersteller durchsuchen" />
      </div>
      <div className="mb-4 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900"><AlertTriangle size={17} className="mt-0.5 shrink-0" />Keine Tastfolge oder Kompatibilität allein aus dem Markennamen ableiten. Immer Modell, Serie und Herstellerunterlage prüfen; elektrische Arbeiten durch eine Elektrofachkraft.</div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedMakers.map((maker) => {
          const relevant = maker.productIds.includes(selectedProduct?.id);
          const cardGroups = [
            { scope: `hersteller-${maker.name}`, items: maker.topics },
            { scope: `hersteller-erfassung-${maker.name}`, items: manufacturerCaptureSteps },
          ];
          return (
            <article key={maker.name} className={`rounded-3xl border p-5 ${relevant ? "border-sky-200 bg-sky-50/60" : "border-transparent bg-slate-50"}`}>
              <div className="flex flex-wrap gap-2">{relevant && <Badge>Zum Auftrag</Badge>}</div>
              <h3 className="mt-2 font-black">{maker.name}</h3>
              <div className="mt-2 flex flex-wrap gap-2">{maker.protocols.map((protocol) => <Badge key={protocol}>{protocol}</Badge>)}</div>
              <p className="mt-3 text-xs font-semibold leading-5 text-slate-600">{maker.note}</p>
              <InlineProgress moduleChecks={moduleChecks} groups={cardGroups} />
              <details className="mt-3 rounded-2xl bg-white p-3" open={relevant}><summary className="cursor-pointer text-xs font-black uppercase text-slate-500">System prüfen</summary><div className="mt-2 space-y-2">{maker.topics.map((item) => checkButton(`hersteller-${maker.name}`, item))}</div></details>
              <details className="mt-2 rounded-2xl bg-white p-3"><summary className="cursor-pointer text-xs font-black uppercase text-slate-500">Bestand erfassen</summary><div className="mt-2 space-y-2">{manufacturerCaptureSteps.map((item) => checkButton(`hersteller-erfassung-${maker.name}`, item))}</div></details>
            </article>
          );
        })}
        {sortedMakers.length === 0 && <div className="rounded-3xl bg-slate-50 p-6 text-sm font-bold text-slate-500">Kein Hersteller zur Suche gefunden.</div>}
      </div>
    </Card>
  );
}
