import React, { useMemo } from "react";
import { AlertTriangle, Sun } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import ModuleProgress, { InlineProgress, OrderContext } from "../components/ModuleProgress";
import SectionTitle from "../components/SectionHeader";
import { allProductTypes, productPracticeDetails } from "../data/products";

export default function ProductLexiconPage({ checkButton, moduleChecks, selectedOrder, selectedProduct }) {
  const groups = allProductTypes.flatMap((product) => {
    const practice = productPracticeDetails[product.id]?.practiceChecks || [];
    return [
      { scope: `produkt-${product.id}`, items: product.steps },
      { scope: `produkt-risiko-${product.id}`, items: product.risks },
      { scope: `produkt-praxis-${product.id}`, items: practice },
    ];
  });
  const sortedProducts = useMemo(() => [...allProductTypes].sort((a, b) => Number(b.id === selectedProduct?.id) - Number(a.id === selectedProduct?.id)), [selectedProduct?.id]);

  return (
    <Card>
      <SectionTitle icon={Sun} title="Produkt-Lexikon" subtitle="Aufbau, Montageablauf, typische Risiken und Übergabepunkte für Sonnenschutzprodukte." />
      <ModuleProgress moduleChecks={moduleChecks} groups={groups} title="Produktwissen und Praxispunkte" />
      <OrderContext selectedOrder={selectedOrder} selectedProduct={selectedProduct} text="Das Produkt des aktiven Auftrags steht an erster Stelle." />

      <div className="grid gap-4 lg:grid-cols-2">
        {sortedProducts.map((product) => {
          const practice = productPracticeDetails[product.id] || { identify: "Produkt, Ausführung und Einbausituation vollständig aufnehmen.", practiceChecks: [] };
          const relevant = product.id === selectedProduct?.id;
          const cardGroups = [
            { scope: `produkt-${product.id}`, items: product.steps },
            { scope: `produkt-risiko-${product.id}`, items: product.risks },
            { scope: `produkt-praxis-${product.id}`, items: practice.practiceChecks },
          ];
          return (
            <article key={product.id} className={`rounded-3xl border p-5 ${relevant ? "border-sky-200 bg-sky-50/60" : "border-transparent bg-slate-50"}`}>
              <div className="flex flex-wrap items-center gap-2"><Badge>{product.category}</Badge>{relevant && <Badge>Aktiver Auftrag</Badge>}</div>
              <h3 className="mt-3 text-lg font-black">{product.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
              <p className="mt-2 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">Erkennen: {practice.identify}</p>
              <InlineProgress moduleChecks={moduleChecks} groups={cardGroups} />
              <details className="mt-3 rounded-2xl bg-white p-3" open={relevant}><summary className="cursor-pointer text-xs font-black uppercase text-slate-500">Praxisablauf</summary><div className="mt-2 space-y-2">{product.steps.map((item) => checkButton(`produkt-${product.id}`, item))}</div></details>
              <details className="mt-2 rounded-2xl bg-white p-3"><summary className="cursor-pointer text-xs font-black uppercase text-slate-500">Montage & Übergabe</summary><div className="mt-2 space-y-2">{practice.practiceChecks.map((item) => checkButton(`produkt-praxis-${product.id}`, item))}</div></details>
              <details className="mt-2 rounded-2xl bg-amber-50 p-3"><summary className="cursor-pointer text-xs font-black uppercase text-amber-900">Risiken prüfen</summary><div className="mt-2 space-y-2">{product.risks.map((item) => checkButton(`produkt-risiko-${product.id}`, item))}</div></details>
              <div className="mt-3 flex flex-wrap gap-2">{product.tools.map((tool) => <Badge key={tool}>{tool}</Badge>)}</div>
            </article>
          );
        })}
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900"><AlertTriangle size={17} className="mt-0.5 shrink-0" />Produktdaten sind Praxisorientierung. Für Montage, elektrische Arbeiten und Sicherheitsfunktionen Herstellerangaben, Elektrofachkraft und geltende Vorschriften beachten.</div>
    </Card>
  );
}
