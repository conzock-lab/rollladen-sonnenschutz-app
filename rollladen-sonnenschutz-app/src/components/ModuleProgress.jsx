import React from "react";
import { BriefcaseBusiness, CheckCircle2 } from "lucide-react";

export function calculateModuleProgress(moduleChecks = {}, groups = []) {
  const entries = groups.flatMap((group) => (group.items || []).map((item) => ({ scope: group.scope, item })));
  const uniqueEntries = [...new Map(entries.map((entry) => [`${entry.scope}::${entry.item}`, entry])).values()];
  const done = uniqueEntries.filter(({ scope, item }) => Boolean(moduleChecks?.[scope]?.[item])).length;
  const total = uniqueEntries.length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

export function InlineProgress({ moduleChecks, groups, label = "Fortschritt" }) {
  const progress = calculateModuleProgress(moduleChecks, groups);

  return (
    <div className="mt-3" title={`${progress.done} von ${progress.total} erledigt`}>
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
        <span>{label}</span>
        <span>{progress.done}/{progress.total}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress.percent}%` }} />
      </div>
    </div>
  );
}

export default function ModuleProgress({ moduleChecks, groups, title = "Lokaler Fortschritt" }) {
  const progress = calculateModuleProgress(moduleChecks, groups);

  return (
    <div className="mb-4 grid gap-3 rounded-3xl bg-slate-950 p-4 text-white md:grid-cols-[auto_1fr] md:items-center">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10"><CheckCircle2 size={20} /></span>
        <div>
          <p className="text-2xl font-black">{progress.percent}%</p>
          <p className="text-xs font-bold text-white/60">{progress.done} von {progress.total} Punkten</p>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs font-bold"><span>{title}</span><span>{progress.percent}%</span></div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${progress.percent}%` }} />
        </div>
        <p className="mt-2 text-[11px] font-semibold text-white/55">Checkmarks werden automatisch auf diesem Gerät gespeichert.</p>
      </div>
    </div>
  );
}

export function OrderContext({ selectedOrder, selectedProduct, text }) {
  if (!selectedOrder || !selectedProduct) return null;

  return (
    <div className="mb-4 flex flex-col gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950 md:flex-row md:items-center md:justify-between">
      <span className="flex items-center gap-2 font-black"><BriefcaseBusiness size={17} />{selectedOrder.id} · {selectedProduct.name}</span>
      <span className="text-xs font-bold text-sky-800">{text}</span>
    </div>
  );
}
