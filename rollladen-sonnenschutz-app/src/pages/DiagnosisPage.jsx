import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, HelpCircle, PackageSearch, Search } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import ModuleProgress, { InlineProgress, OrderContext } from "../components/ModuleProgress";
import SectionTitle from "../components/SectionHeader";
import { allDiagnosisTrees } from "../data/diagnosis";

function DiagnosisStepMode({ trees }) {
  const [treeId, setTreeId] = useState(trees[0]?.id || "");
  const [answer, setAnswer] = useState(null);
  const tree = trees.find((item) => item.id === treeId) || trees[0];

  useEffect(() => {
    if (trees.length && !trees.some((item) => item.id === treeId)) {
      setTreeId(trees[0].id);
      setAnswer(null);
    }
  }, [treeId, trees]);

  if (!tree) return null;

  return (
    <div className="mb-5 rounded-3xl bg-slate-950 p-5 text-white">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div><p className="text-xs font-bold uppercase text-white/50">Interaktiver Schrittmodus</p><h3 className="mt-1 text-xl font-black">{tree.title}</h3></div>
        <select value={tree.id} onChange={(event) => { setTreeId(event.target.value); setAnswer(null); }} className="rounded-2xl bg-white px-3 py-2 text-sm font-bold text-slate-950">{trees.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select>
      </div>
      <div className="rounded-2xl bg-white/10 p-4 text-sm font-bold leading-6">{tree.start.q}</div>
      <div className="mt-4 grid gap-3 md:grid-cols-2"><button onClick={() => setAnswer("yes")} className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-black text-emerald-900">Ja</button><button onClick={() => setAnswer("no")} className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-black text-rose-900">Nein</button></div>
      {answer && <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold leading-6 text-slate-900"><strong>Nächster Prüfschritt:</strong> {answer === "yes" ? tree.start.yes : tree.start.no}</div>}
    </div>
  );
}

export default function DiagnosisPage({ checkButton, diagnosisCategories, diagnosisCategory, diagnosisQuery, filteredDiagnosisTrees, moduleChecks, onCreatePartRequest, onOpenParts, onUse, selectedOrder, selectedProduct, setDiagnosisCategory, setDiagnosisQuery }) {
  const groups = allDiagnosisTrees.flatMap((tree) => [
    { scope: `diagnose-step-${tree.id}`, items: tree.firstSteps || [] },
    { scope: `diagnose-finish-${tree.id}`, items: tree.finishSteps || [] },
  ]);
  const sortedTrees = useMemo(() => [...filteredDiagnosisTrees].sort((a, b) => Number(b.productIds.includes(selectedProduct?.id)) - Number(a.productIds.includes(selectedProduct?.id))), [filteredDiagnosisTrees, selectedProduct?.id]);
  const stepTrees = sortedTrees.length ? sortedTrees : allDiagnosisTrees;

  return (
    <Card>
      <SectionTitle icon={HelpCircle} title="Erweiterte Fehlerdiagnose" subtitle="Fehler eingrenzen, sichere Erstprüfung durchführen und Ergebnis nachvollziehbar zum Auftrag dokumentieren." />
      <ModuleProgress moduleChecks={moduleChecks} groups={groups} title="Diagnose- und Dokumentationspunkte" />
      <OrderContext selectedOrder={selectedOrder} selectedProduct={selectedProduct} text="Passende Fehlerbilder werden in der Trefferliste zuerst angezeigt." />
      <div className="mb-4 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900"><AlertTriangle size={17} className="mt-0.5 shrink-0" />Bei Blockade, Tor-Sicherheit oder elektrischen Fehlern Anlage nicht weiter belasten. Herstellerangaben, Elektrofachkraft und geltende Vorschriften beachten.</div>

      <DiagnosisStepMode trees={stepTrees} />
      <div className="mb-5 grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
        <select value={diagnosisCategory} onChange={(event) => setDiagnosisCategory(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold"><option value="all">Alle Kategorien</option>{diagnosisCategories.filter((category) => category !== "all").map((category) => <option key={category}>{category}</option>)}</select>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"><Search size={18} className="text-slate-400" /><input value={diagnosisQuery} onChange={(event) => setDiagnosisQuery(event.target.value)} placeholder="Frost, Funk, Gateway, Rolltor ..." className="w-full outline-none" aria-label="Fehlerdiagnose durchsuchen" /></div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sortedTrees.map((tree) => {
          const relevant = tree.productIds.includes(selectedProduct?.id);
          const cardGroups = [
            { scope: `diagnose-step-${tree.id}`, items: tree.firstSteps || [] },
            { scope: `diagnose-finish-${tree.id}`, items: tree.finishSteps || [] },
          ];
          return (
            <article key={tree.id} className={`rounded-3xl border p-5 ${relevant ? "border-sky-200 bg-sky-50/60" : "border-transparent bg-slate-50"}`}>
              <div className="flex flex-wrap items-center gap-2"><Badge>{tree.category}</Badge>{relevant && <Badge>Zum Auftrag</Badge>}{tree.safety && <Badge>Sicherheit</Badge>}</div>
              <h3 className="mt-3 text-lg font-black">{tree.title}</h3>
              <InlineProgress moduleChecks={moduleChecks} groups={cardGroups} />
              <div className="mt-3 space-y-2">{(tree.firstSteps || []).map((step) => checkButton(`diagnose-step-${tree.id}`, step))}</div>
              <p className="mt-3 rounded-2xl bg-white p-4 text-sm font-bold">{tree.start.q}</p>
              <div className="mt-2 grid gap-2 md:grid-cols-2"><div className="rounded-2xl bg-emerald-50 p-3 text-xs font-semibold leading-5 text-emerald-900"><strong>Ja:</strong> {tree.start.yes}</div><div className="rounded-2xl bg-rose-50 p-3 text-xs font-semibold leading-5 text-rose-900"><strong>Nein:</strong> {tree.start.no}</div></div>
              <details className="mt-3 rounded-2xl bg-white p-3"><summary className="cursor-pointer text-xs font-black uppercase text-slate-500">Abschluss dokumentieren</summary><div className="mt-2 space-y-2">{tree.finishSteps.map((step) => checkButton(`diagnose-finish-${tree.id}`, step))}</div><div className="mt-3 flex flex-wrap gap-2">{tree.tools.map((tool) => <Badge key={tool}>{tool}</Badge>)}</div></details>
              {tree.partCategories?.length > 0 && <div className="mt-3 rounded-2xl bg-white p-3"><p className="text-xs font-black uppercase text-slate-500">Mögliche Ersatzteilgruppen</p><div className="mt-2 flex flex-wrap gap-2">{tree.partCategories.map((item) => <Badge key={item}>{item}</Badge>)}</div><div className="mt-3 grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => { onUse?.({ type: "Diagnose", id: tree.id, label: tree.title, route: "diagnose" }); onOpenParts?.(tree); }} className="min-h-11 rounded-xl bg-slate-100 px-3 text-xs font-black text-slate-800"><PackageSearch size={15} className="mr-1 inline" />Ersatzteilgruppe öffnen</button><button type="button" onClick={() => { onUse?.({ type: "Diagnose", id: tree.id, label: tree.title, route: "diagnose" }); onCreatePartRequest?.(tree); }} className="min-h-11 rounded-xl bg-slate-950 px-3 text-xs font-black text-white">Anfrage erstellen</button></div></div>}
            </article>
          );
        })}
        {sortedTrees.length === 0 && <div className="rounded-3xl bg-slate-50 p-6 text-sm font-bold text-slate-500">Keine Diagnose zur Suche gefunden. Filter zurücksetzen oder allgemeiner suchen.</div>}
      </div>
    </Card>
  );
}
