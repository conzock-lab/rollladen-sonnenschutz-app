import React, { useMemo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import ModuleProgress, { InlineProgress, OrderContext } from "../components/ModuleProgress";
import SectionTitle from "../components/SectionHeader";
import { allMaintenanceTips } from "../data/maintenance";

export default function MaintenancePage({ checkButton, moduleChecks, selectedOrder, selectedProduct }) {
  const groups = allMaintenanceTips.map((item) => ({ scope: `wartung-${item.product}-${item.title}`, items: item.steps }));
  const sortedTips = useMemo(() => [...allMaintenanceTips].sort((a, b) => Number(b.productIds.includes(selectedProduct?.id)) - Number(a.productIds.includes(selectedProduct?.id))), [selectedProduct?.id]);
  const relevantCount = allMaintenanceTips.filter((item) => item.productIds.includes(selectedProduct?.id)).length;

  return (
    <Card>
      <SectionTitle icon={RefreshCw} title="Wartung & Pflege" subtitle="Sichtprüfung, Funktion, Kundenhinweis und Dokumentation als kompakter Wartungsablauf." />
      <ModuleProgress moduleChecks={moduleChecks} groups={groups} title="Wartungspunkte" />
      <OrderContext selectedOrder={selectedOrder} selectedProduct={selectedProduct} text={`${relevantCount} Wartungsblöcke zum aktiven Auftrag hervorgehoben.`} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedTips.map((item) => {
          const scope = `wartung-${item.product}-${item.title}`;
          const relevant = item.productIds.includes(selectedProduct?.id);
          return (
            <article key={item.id} className={`rounded-3xl border p-5 ${relevant ? "border-sky-200 bg-sky-50/60" : "border-transparent bg-slate-50"}`}>
              <div className="flex flex-wrap gap-2"><Badge>{item.product}</Badge>{relevant && <Badge>Zum Auftrag</Badge>}{item.safety && <Badge>Sicherheit</Badge>}</div>
              <h3 className="mt-3 font-black">{item.title}</h3>
              <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{item.note}</p>
              <InlineProgress moduleChecks={moduleChecks} groups={[{ scope, items: item.steps }]} />
              <div className="mt-3 space-y-2">{item.steps.map((step) => checkButton(scope, step))}</div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900"><AlertTriangle size={17} className="mt-0.5 shrink-0" />Sicherheitsrelevante Mängel nicht durch Weiterbetrieb oder erhöhte Kraft kompensieren. Herstellerangaben, Elektrofachkraft und geltende Vorschriften beachten.</div>
    </Card>
  );
}
