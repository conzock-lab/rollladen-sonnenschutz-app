import React, { useMemo } from "react";
import { AlertTriangle, HardHat } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import ModuleProgress, { InlineProgress, OrderContext } from "../components/ModuleProgress";
import SectionTitle from "../components/SectionHeader";
import { allSubstrates } from "../data/substrates";

function matchesOrder(substrate, selectedOrder) {
  const orderSubstrate = String(selectedOrder?.substrate || "").toLowerCase();
  if (!orderSubstrate) return false;
  return substrate.aliases.some((alias) => orderSubstrate.includes(alias.toLowerCase()) || alias.toLowerCase().includes(orderSubstrate));
}

export default function SubstratesPage({ checkButton, moduleChecks, selectedOrder, selectedProduct }) {
  const groups = allSubstrates.flatMap((substrate) => [
    { scope: `untergrund-check-${substrate.name}`, items: substrate.checks },
    { scope: `untergrund-tool-${substrate.name}`, items: substrate.tools },
    { scope: `untergrund-fix-${substrate.name}`, items: substrate.fasteners },
  ]);
  const sortedSubstrates = useMemo(() => [...allSubstrates].sort((a, b) => Number(matchesOrder(b, selectedOrder)) - Number(matchesOrder(a, selectedOrder))), [selectedOrder?.substrate]);

  return (
    <Card>
      <SectionTitle icon={HardHat} title="Untergrund-Assistent" subtitle="Tragenden Untergrund erkennen, Lastweg planen und Befestigung nachvollziehbar dokumentieren." />
      <ModuleProgress moduleChecks={moduleChecks} groups={groups} title="Untergrund-Prüfpunkte" />
      <OrderContext selectedOrder={selectedOrder} selectedProduct={selectedProduct} text={`Untergrund im Auftrag: ${selectedOrder?.substrate || "nicht angegeben"}`} />
      <div className="mb-4 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900"><AlertTriangle size={17} className="mt-0.5 shrink-0" />Befestigungen immer nach tatsächlichem Untergrund, Last, Systemfreigabe und Herstellerangaben wählen. Bei Unklarheit nicht pauschal freigeben.</div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sortedSubstrates.map((substrate) => {
          const relevant = matchesOrder(substrate, selectedOrder);
          const cardGroups = [
            { scope: `untergrund-check-${substrate.name}`, items: substrate.checks },
            { scope: `untergrund-tool-${substrate.name}`, items: substrate.tools },
            { scope: `untergrund-fix-${substrate.name}`, items: substrate.fasteners },
          ];
          return (
            <article key={substrate.id} className={`rounded-3xl border p-5 ${relevant ? "border-sky-200 bg-sky-50/60" : "border-transparent bg-slate-50"}`}>
              <div className="flex flex-wrap gap-2">{relevant && <Badge>Untergrund des Auftrags</Badge>}</div>
              <h3 className="mt-2 text-lg font-black">{substrate.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{substrate.practice}</p>
              <InlineProgress moduleChecks={moduleChecks} groups={cardGroups} />
              <div className="mt-3 space-y-2">{substrate.checks.map((item) => checkButton(`untergrund-check-${substrate.name}`, item))}</div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <details className="rounded-2xl bg-white p-3"><summary className="cursor-pointer text-xs font-black uppercase text-slate-500">Werkzeug</summary><div className="mt-2 space-y-2">{substrate.tools.map((item) => checkButton(`untergrund-tool-${substrate.name}`, item))}</div></details>
                <details className="rounded-2xl bg-white p-3"><summary className="cursor-pointer text-xs font-black uppercase text-slate-500">Befestigung</summary><div className="mt-2 space-y-2">{substrate.fasteners.map((item) => checkButton(`untergrund-fix-${substrate.name}`, item))}</div></details>
              </div>
              <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">{substrate.warning}</p>
            </article>
          );
        })}
      </div>
    </Card>
  );
}
