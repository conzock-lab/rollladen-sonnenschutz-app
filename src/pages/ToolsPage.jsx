import React, { useMemo } from "react";
import { AlertTriangle, Hammer } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import ModuleProgress, { InlineProgress, OrderContext } from "../components/ModuleProgress";
import SectionTitle from "../components/SectionHeader";
import { allToolKits } from "../data/tools";

function isKitRelevant(kit, selectedOrder, selectedProduct) {
  const productMatch = kit.productIds.includes(selectedProduct?.id);
  const substrateMatch = kit.substrates?.some((item) => String(selectedOrder?.substrate || "").toLowerCase().includes(item.toLowerCase()));
  const driveMatch = kit.drives?.some((item) => String(selectedOrder?.drive || "").toLowerCase().includes(item.toLowerCase()));
  return Boolean(productMatch || substrateMatch || driveMatch);
}

export default function ToolsPage({ checkButton, markScopeDone, moduleChecks, selectedOrder, selectedProduct }) {
  const groups = allToolKits.map((kit) => ({ scope: `werkzeug-${kit.group}`, items: kit.items }));
  const sortedKits = useMemo(() => [...allToolKits].sort((a, b) => Number(isKitRelevant(b, selectedOrder, selectedProduct)) - Number(isKitRelevant(a, selectedOrder, selectedProduct))), [selectedOrder?.drive, selectedOrder?.substrate, selectedProduct?.id]);

  return (
    <Card>
      <SectionTitle icon={Hammer} title="Werkzeug & Material" subtitle="Kompakte Verladelisten für Aufmaß, Montage, Befestigung, Antrieb, Wartung und Übergabe." />
      <ModuleProgress moduleChecks={moduleChecks} groups={groups} title="Werkzeug- und Materialpunkte" />
      <OrderContext selectedOrder={selectedOrder} selectedProduct={selectedProduct} text={`${selectedOrder?.substrate || "Untergrund offen"} · ${selectedOrder?.drive || "Antrieb offen"}`} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedKits.map((kit) => {
          const scope = `werkzeug-${kit.group}`;
          const relevant = isKitRelevant(kit, selectedOrder, selectedProduct);
          return (
            <article key={kit.id} className={`rounded-3xl border p-5 ${relevant ? "border-sky-200 bg-sky-50/60" : "border-transparent bg-slate-50"}`}>
              <div className="flex items-start justify-between gap-3">
                <div><div className="flex flex-wrap gap-2">{relevant && <Badge>Zum Auftrag</Badge>}{kit.safety && <Badge>Sicherheit</Badge>}</div><h3 className="mt-2 font-black">{kit.group}</h3></div>
                <button onClick={() => markScopeDone(scope, kit.items)} className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-bold">Alle da</button>
              </div>
              <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{kit.purpose}</p>
              <InlineProgress moduleChecks={moduleChecks} groups={[{ scope, items: kit.items }]} />
              <div className="mt-3 space-y-2">{kit.items.map((item) => checkButton(scope, item))}</div>
            </article>
          );
        })}
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900"><AlertTriangle size={17} className="mt-0.5 shrink-0" />Elektroprüfmittel, Befestigungssysteme und Hebehilfen nur passend zur Aufgabe verwenden. Herstellerangaben, Elektrofachkraft und geltende Vorschriften beachten.</div>
    </Card>
  );
}
