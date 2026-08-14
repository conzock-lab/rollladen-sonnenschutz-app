import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, HelpCircle, Radio, Search, Star, Zap } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import { InlineProgress, OrderContext } from "../components/ModuleProgress";
import SectionTitle from "../components/SectionHeader";
import NameplateAssistant from "../components/technical/NameplateAssistant";
import { allDiagnosisTrees } from "../data/diagnosis";
import { allMotorTypes, controlGroups, getMotorDiagnosisIds, motorAssistantQuestions, motorCategories, motorInspectionSteps, radioCheckSteps } from "../data/motors";

function isMotorRelevant(motor, selectedOrder, selectedProduct) {
  if (motor.productIds.includes(selectedProduct?.id)) return true;
  const drive = String(selectedOrder?.drive || "").toLocaleLowerCase("de-DE");
  return (drive.includes("funk") && ["funkmotor", "bidirektional"].includes(motor.id)) || (drive.includes("solar") && motor.id === "solarmotor") || (drive.includes("taster") && motor.id === "mechanisch") || (drive.includes("smart") && motor.id === "gateway");
}

function InfoList({ items = [] }) {
  return <div className="grid gap-2 sm:grid-cols-2">{items.map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{item}</div>)}</div>;
}

export default function MotorsPage({
  checkButton,
  favorites = [],
  moduleChecks,
  motorQuery = "",
  notes = {},
  onAnalyzeNameplate,
  onNoteChange,
  onOpenDiagnosis,
  onOpenParts,
  onToggleFavorite,
  onUse,
  selectedOrder,
  selectedProduct,
  setMotorQuery,
}) {
  const [category, setCategory] = useState("Alle");
  const [selectedId, setSelectedId] = useState("");
  const [answers, setAnswers] = useState({});
  const [orderSpecific, setOrderSpecific] = useState(Boolean(selectedOrder));
  const diagnosisIds = getMotorDiagnosisIds(answers);
  const diagnosisSuggestions = diagnosisIds.map((id) => allDiagnosisTrees.find((tree) => tree.id === id)).filter(Boolean);
  const query = motorQuery.trim().toLocaleLowerCase("de-DE");
  const motors = useMemo(() => allMotorTypes
    .filter((item) => category === "Alle" || item.category === category)
    .filter((item) => !query || [item.name, item.category, item.details, ...(item.useCases || []), ...(item.failureSymptoms || []), ...(item.partCategories || [])].join(" ").toLocaleLowerCase("de-DE").includes(query))
    .sort((left, right) => Number(favorites.includes(right.id)) - Number(favorites.includes(left.id)) || Number(isMotorRelevant(right, selectedOrder, selectedProduct)) - Number(isMotorRelevant(left, selectedOrder, selectedProduct)) || left.name.localeCompare(right.name, "de")), [category, favorites, query, selectedOrder, selectedProduct]);
  const selected = allMotorTypes.find((item) => item.id === selectedId) || motors[0] || null;
  const scope = selected ? `motor-check-${orderSpecific && selectedOrder ? `auftrag-${selectedOrder.id}` : "allgemein"}-${selected.id}` : "motor-check-none";
  const radioScope = `funk-pruefung-${orderSpecific && selectedOrder ? selectedOrder.id : "allgemein"}`;

  useEffect(() => {
    const exact = allMotorTypes.find((item) => item.name.toLocaleLowerCase("de-DE").includes(query) || item.id === query);
    if (exact) setSelectedId(exact.id);
  }, [query]);

  const openMotor = (motor) => {
    setSelectedId(motor.id);
    onUse?.({ type: "Motoren", id: motor.id, label: motor.name, route: "motors" });
  };

  return <div className="space-y-5">
    <Card><SectionTitle icon={Zap} title="Motoren & Steuerungen" subtitle="Antriebe, Bedienelemente, Funk, Sensorik und Smart Home praxisnah prüfen – ohne universelle Resetfolgen." />
      <OrderContext selectedOrder={selectedOrder} selectedProduct={selectedProduct} text={`Antrieb im Auftrag: ${selectedOrder?.drive || "nicht angegeben"}`} />
      <div className="grid gap-3 md:grid-cols-[1fr_auto]"><div className="flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4"><Search size={19} className="text-slate-400" /><input value={motorQuery} onChange={(event) => setMotorQuery?.(event.target.value)} placeholder="Funkmotor, Raffstore, Sensor, Gateway ..." className="min-w-0 flex-1 text-sm font-bold outline-none" aria-label="Motoren durchsuchen" /></div>{selectedOrder && <button type="button" onClick={() => setOrderSpecific((value) => !value)} className={`min-h-14 rounded-2xl px-4 text-xs font-black ${orderSpecific ? "bg-sky-100 text-sky-900" : "bg-slate-100 text-slate-700"}`}>{orderSpecific ? `Checkliste für ${selectedOrder.id}` : "Allgemeine Checkliste"}</button>}</div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{motorCategories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`min-h-11 shrink-0 rounded-2xl px-4 text-xs font-black ${category === item ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}>{item}</button>)}</div>
      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900"><AlertTriangle size={17} className="mt-0.5 shrink-0" />Arbeiten an elektrischen Anlagen nur entsprechend Qualifikation und geltenden Vorschriften durchführen. Bei Markisen und Toren bewegte, federgespannte oder schwere Bauteile sichern.</div>
    </Card>

    <Card><SectionTitle icon={HelpCircle} title="Motor-Prüfassistent" subtitle="Antworten priorisieren vorhandene Diagnosefälle. Das Ergebnis ist keine technische Freigabe." />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{motorAssistantQuestions.map((question) => <div key={question.id} className="rounded-3xl bg-slate-50 p-4"><p className="text-sm font-black">{question.label}</p><div className="mt-3 flex flex-wrap gap-2">{question.options.map((option) => <button key={option} type="button" onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))} className={`min-h-10 rounded-xl px-3 text-xs font-black ${answers[question.id] === option ? "bg-slate-950 text-white" : "bg-white text-slate-700"}`}>{option}</button>)}</div></div>)}</div>
      <div className="mt-4 rounded-3xl bg-sky-50 p-4"><p className="font-black text-sky-950">Priorisierte Prüfrichtung</p>{diagnosisSuggestions.length ? <div className="mt-3 grid gap-2 md:grid-cols-2">{diagnosisSuggestions.map((tree) => <button key={tree.id} type="button" onClick={() => onOpenDiagnosis?.(tree)} className="rounded-2xl bg-white p-3 text-left text-sm font-black text-sky-900">{tree.title}<span className="mt-1 block text-xs font-semibold text-sky-700">Diagnose öffnen</span></button>)}</div> : <p className="mt-2 text-sm font-semibold text-sky-800">Antworten ergänzen. Zuerst Anlage sichern, Motortyp bestimmen und mechanische Freigängigkeit beurteilen.</p>}</div>
    </Card>

    <div className="grid items-start gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">{motors.map((motor) => { const relevant = isMotorRelevant(motor, selectedOrder, selectedProduct); const favorite = favorites.includes(motor.id); return <article key={motor.id} className={`rounded-3xl border p-4 ${selected?.id === motor.id ? "border-slate-950 bg-white shadow-md" : relevant ? "border-sky-200 bg-sky-50" : "border-transparent bg-slate-50"}`}><div className="flex items-start justify-between gap-3"><button type="button" onClick={() => openMotor(motor)} className="min-w-0 flex-1 text-left"><span className="block font-black">{motor.name}</span><span className="mt-1 block text-xs font-semibold text-slate-500">{motor.category}</span></button><button type="button" onClick={() => onToggleFavorite?.(motor.id)} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${favorite ? "bg-amber-100 text-amber-700" : "bg-white text-slate-300"}`} aria-label={`${motor.name} favorisieren`}><Star size={18} fill={favorite ? "currentColor" : "none"} /></button></div><div className="mt-3 flex flex-wrap gap-2">{relevant && <Badge>Zum Auftrag</Badge>}{motor.safety && <Badge>Sicherheit</Badge>}</div></article>; })}{!motors.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">Kein Motortyp gefunden.</p>}</div></Card>

      {selected && <Card><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap gap-2"><Badge>{selected.category}</Badge>{selected.safety && <Badge>Sicherheit</Badge>}</div><h2 className="mt-3 text-2xl font-black">{selected.name}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{selected.details}</p></div><button type="button" onClick={() => onToggleFavorite?.(selected.id)} className={`inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 text-xs font-black ${favorites.includes(selected.id) ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-700"}`}><Star size={17} fill={favorites.includes(selected.id) ? "currentColor" : "none"} />{favorites.includes(selected.id) ? "Favorit" : "Favorisieren"}</button></div>
        <div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase text-slate-400">Einsatzgebiet</p><p className="mt-2 text-sm font-bold">{selected.useCases.join(" · ")}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase text-slate-400">Endlagen</p><p className="mt-2 text-sm font-bold">{selected.endLimit}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase text-slate-400">Bedienung</p><p className="mt-2 text-sm font-bold">{selected.operation}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase text-slate-400">Anschluss allgemein</p><p className="mt-2 text-sm font-bold">{selected.connections}</p></div></div>
        <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-900">Programmierung/Reset: {selected.programming}</div>
        <InlineProgress moduleChecks={moduleChecks} groups={[{ scope, items: motorInspectionSteps }]} label={orderSpecific && selectedOrder ? `Fortschritt ${selectedOrder.id}` : "Allgemeiner Fortschritt"} />
        <details className="mt-4 rounded-2xl bg-slate-50 p-4" open><summary className="cursor-pointer text-xs font-black uppercase text-slate-500">Arbeitsprüfung</summary><div className="mt-3 space-y-2">{motorInspectionSteps.map((item) => checkButton(scope, item))}</div></details>
        <details className="mt-3 rounded-2xl bg-slate-50 p-4"><summary className="cursor-pointer text-xs font-black uppercase text-slate-500">Typische Prüfreihenfolge</summary><div className="mt-3 space-y-2">{selected.checks.map((item) => checkButton(`${scope}-praxis`, item))}</div></details>
        <details className="mt-3 rounded-2xl bg-slate-50 p-4"><summary className="cursor-pointer text-xs font-black uppercase text-slate-500">Fehlerbilder, Werkzeug und Ersatzteilgruppen</summary><div className="mt-3"><p className="text-xs font-black uppercase text-slate-400">Fehlerbilder</p><InfoList items={selected.failureSymptoms} /><p className="mt-4 text-xs font-black uppercase text-slate-400">Werkzeug</p><InfoList items={selected.tools} /><p className="mt-4 text-xs font-black uppercase text-slate-400">Mögliche Ersatzteilgruppen</p><InfoList items={selected.partCategories} /></div></details>
        <div className="mt-4 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => onOpenDiagnosis?.(selected)} className="min-h-12 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white">Passende Diagnose öffnen</button><button type="button" onClick={() => onOpenParts?.(selected)} className="min-h-12 rounded-2xl bg-sky-100 px-4 text-sm font-black text-sky-900">Ersatzteilgruppen öffnen</button></div>
        <div className="mt-4"><NameplateAssistant onAnalyze={onAnalyzeNameplate} /></div>
        <label className="mt-4 block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Interne Praxisnotiz<textarea value={notes[`motor:${selected.id}`] || ""} onChange={(event) => onNoteChange?.(`motor:${selected.id}`, event.target.value)} placeholder="Hinweis zur Identifikation oder Prüfung – keine Kundenzugangsdaten" className="mt-2 h-28 w-full resize-none rounded-2xl border border-slate-200 bg-white p-3 text-sm font-medium outline-none" /></label>
      </Card>}
    </div>

    <Card><SectionTitle icon={Radio} title="Kompakte Funkdiagnose" subtitle="Vom Sender über Kanal und Reichweite bis zur Versorgung – ohne pauschalen Reset." /><InlineProgress moduleChecks={moduleChecks} groups={[{ scope: radioScope, items: radioCheckSteps }]} /><div className="mt-3 grid gap-2 md:grid-cols-2">{radioCheckSteps.map((item) => checkButton(radioScope, item))}</div><button type="button" onClick={() => onOpenDiagnosis?.(allDiagnosisTrees.find((tree) => tree.id === "funk-reagiert-nicht"))} className="mt-4 min-h-12 w-full rounded-2xl bg-slate-950 px-4 text-sm font-black text-white">Funk-Diagnosevorschlag öffnen</button></Card>

    <Card><SectionTitle icon={Zap} title="Bedienung, Steuerung, Sensorik & Smart Home" subtitle="Längere Details bleiben in kompakten, aufklappbaren Bereichen." /><div className="grid gap-3 md:grid-cols-2">{controlGroups.map((group) => <details key={group.id} className="rounded-3xl bg-slate-50 p-4"><summary className="cursor-pointer font-black">{group.title}</summary><p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{group.note}</p><div className="mt-3 space-y-2">{group.items.map((item) => checkButton(`steuerung-${group.id}`, item))}</div></details>)}</div></Card>
  </div>;
}
