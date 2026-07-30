import React, { useMemo } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import ModuleProgress, { InlineProgress, OrderContext } from "../components/ModuleProgress";
import SectionTitle from "../components/SectionHeader";
import { allNorms } from "../data/norms";

export default function NormsPage({ checkButton, moduleChecks, selectedOrder, selectedProduct }) {
  const groups = allNorms.map((item) => ({ scope: `norm-${item.id}`, items: item.checks }));
  const sortedNorms = useMemo(() => [...allNorms].sort((a, b) => Number(b.products.includes(selectedProduct?.id)) - Number(a.products.includes(selectedProduct?.id))), [selectedProduct?.id]);
  const relevantCount = allNorms.filter((item) => item.products.includes(selectedProduct?.id)).length;

  return (
    <Card>
      <SectionTitle icon={ShieldCheck} title="Normen & Praxisorientierung" subtitle="Konkrete Prüfpunkte für Montage, Wartung und Übergabe – ohne automatische Freigabe oder erfundene Grenzwerte." />
      <ModuleProgress moduleChecks={moduleChecks} groups={groups} title="Normen- und Sicherheitspunkte" />
      <OrderContext selectedOrder={selectedOrder} selectedProduct={selectedProduct} text={`${relevantCount} Hinweise passen besonders zu diesem Produkt.`} />

      <div className="mb-4 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <span>Herstellerangaben, Elektrofachkraft und geltende Vorschriften beachten. Ein Checkmark dokumentiert die Bearbeitung, ersetzt aber keine technische oder rechtliche Freigabe.</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sortedNorms.map((item) => {
          const relevant = item.products.includes(selectedProduct?.id);
          const scope = `norm-${item.id}`;
          return (
            <article key={item.id} className={`rounded-3xl border p-5 ${relevant ? "border-sky-200 bg-sky-50/60" : "border-transparent bg-slate-50"}`}>
              <div className="flex flex-wrap items-center gap-2"><Badge>{item.category}</Badge>{relevant && <Badge>Zum Auftrag</Badge>}{item.safety && <Badge>Sicherheit</Badge>}</div>
              <h3 className="mt-3 font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              <InlineProgress moduleChecks={moduleChecks} groups={[{ scope, items: item.checks }]} />
              <div className="mt-3 space-y-2">{item.checks.map((step) => checkButton(scope, step))}</div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}
