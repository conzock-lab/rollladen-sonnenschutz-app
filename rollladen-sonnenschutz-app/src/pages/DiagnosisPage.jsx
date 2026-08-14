import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, HelpCircle, Play, Search, Star } from "lucide-react";
import Card from "../components/Card";
import { Badge } from "../components/CheckItem";
import ModuleProgress, { InlineProgress, OrderContext } from "../components/ModuleProgress";
import SectionTitle from "../components/SectionHeader";
import DiagnosisAssistant from "../components/diagnosis/DiagnosisAssistant";
import DiagnosisHistory from "../components/diagnosis/DiagnosisHistory";
import DiagnosisQuickStarts from "../components/diagnosis/DiagnosisQuickStarts";
import DiagnosisResult from "../components/diagnosis/DiagnosisResult";
import DiagnosisStart from "../components/diagnosis/DiagnosisStart";
import DiagnosisWizard from "../components/diagnosis/DiagnosisWizard";
import { allDiagnosisTrees, diagnosisSymptomGroups } from "../data/diagnosis";
import {
  answerDiagnosisStep,
  buildAssistantResponse,
  buildDiagnosisResult,
  createDiagnosisSession,
  pauseDiagnosisSession,
  rankDiagnosisCases,
  recognizeDiagnosisSymptoms,
  resumeDiagnosisSession,
  setDiagnosisStep,
} from "../lib/diagnosisAssistant";

const quickStartIds = ["motor-faehrt-nicht", "motor-brummt", "rollladen-schief", "funk-reagiert-nicht", "markise-stoppt", "zipscreen-klemmt", "raffstore-wendet-falsch", "sensorik-falsch"];

export default function DiagnosisPage({
  checkButton,
  diagnosisCategories,
  diagnosisCategory,
  diagnosisFavorites = [],
  diagnosisQuery,
  diagnosisRecents = [],
  diagnosisSessions = [],
  moduleChecks,
  onCreatePartRequest,
  onOpenKnowledge,
  onOpenLearning,
  onOpenManufacturer,
  onOpenMotors,
  onOpenParts,
  onOpenPhoto,
  onPersistSession,
  onRecordRecent,
  onSaveLearningCase,
  onSaveSessionToOrder,
  onToggleFavorite,
  onUse,
  selectedOrder,
  selectedProduct,
  setDiagnosisCategory,
  setDiagnosisQuery,
}) {
  const [mode, setMode] = useState("assistant");
  const [problemText, setProblemText] = useState(diagnosisQuery || "");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(Boolean(diagnosisQuery));
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    if (!diagnosisQuery) return;
    setProblemText(diagnosisQuery);
    setShowSuggestions(true);
    setMode("assistant");
  }, [diagnosisQuery]);

  const context = useMemo(() => ({
    orderId: selectedOrder?.id || "",
    customer: selectedOrder?.customer || "",
    productId: selectedOrder?.product || selectedProduct?.id || "",
    productName: selectedProduct?.name || "",
    manufacturer: selectedOrder?.manufacturer || "",
    drive: selectedOrder?.drive || "",
    previousDiagnoses: (selectedOrder?.diagnoses || []).map((entry) => entry.issue || entry.result || "").filter(Boolean).slice(0, 5),
  }), [selectedOrder, selectedProduct]);

  const recognized = useMemo(() => recognizeDiagnosisSymptoms(problemText, context, selectedSymptoms), [context, problemText, selectedSymptoms]);
  const suggestions = useMemo(() => rankDiagnosisCases({ cases: allDiagnosisTrees, context, query: problemText, symptoms: recognized.symptoms, category: diagnosisCategory }), [context, diagnosisCategory, problemText, recognized.symptoms]);
  const libraryCases = useMemo(() => rankDiagnosisCases({ cases: allDiagnosisTrees, context, query: diagnosisQuery, category: diagnosisCategory }), [context, diagnosisCategory, diagnosisQuery]);
  const quickCases = quickStartIds.map((id) => allDiagnosisTrees.find((tree) => tree.id === id)).filter(Boolean).sort((left, right) => Number(diagnosisFavorites.includes(right.id)) - Number(diagnosisFavorites.includes(left.id)));
  const recentCases = diagnosisRecents.map((id) => allDiagnosisTrees.find((tree) => tree.id === id)).filter(Boolean);
  const visibleSessions = [...diagnosisSessions].filter((session) => !selectedOrder || !session.context?.orderId || session.context.orderId === selectedOrder.id).sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
  const activeTree = currentSession ? allDiagnosisTrees.find((tree) => tree.id === currentSession.treeId) : null;
  const result = activeTree && currentSession ? currentSession.result || (currentSession.status === "completed" ? buildDiagnosisResult(currentSession, activeTree) : null) : null;
  const assistantResponse = activeTree && currentSession ? buildAssistantResponse(activeTree, currentSession) : null;
  const groups = allDiagnosisTrees.flatMap((tree) => [{ scope: `diagnose-step-${tree.id}`, items: tree.firstSteps || [] }, { scope: `diagnose-finish-${tree.id}`, items: tree.finishSteps || [] }]);

  const toggleSymptom = (symptom) => setSelectedSymptoms((current) => current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom]);
  const startDiagnosis = (tree) => {
    const session = createDiagnosisSession(tree, context, { query: problemText, symptoms: recognized.symptoms });
    setCurrentSession(session);
    onPersistSession?.(session, { queue: false });
    onRecordRecent?.(tree.id);
    onUse?.({ type: "Diagnose", id: tree.id, label: tree.title, route: "diagnose" });
  };
  const answerStep = (answer) => {
    const next = answerDiagnosisStep(currentSession, activeTree, answer);
    if (next.result) next.orderStatus = next.result.orderStatus;
    setCurrentSession(next);
    onPersistSession?.(next, { queue: false });
  };
  const pause = () => {
    const paused = pauseDiagnosisSession(currentSession);
    setCurrentSession(null);
    onPersistSession?.(paused, { queue: true });
  };
  const resume = (session) => {
    const resumed = resumeDiagnosisSession(session);
    setCurrentSession(resumed);
    onPersistSession?.(resumed, { queue: false });
  };
  const updateStatus = (orderStatus) => {
    const next = { ...currentSession, orderStatus, result: { ...(result || {}), orderStatus }, updatedAt: new Date().toISOString() };
    setCurrentSession(next);
    onPersistSession?.(next, { queue: false });
  };
  const saveLocal = () => onPersistSession?.({ ...currentSession, result: result || buildDiagnosisResult(currentSession, activeTree) }, { queue: true, notify: true });
  const saveOrder = () => onSaveSessionToOrder?.({ ...currentSession, result: result || buildDiagnosisResult(currentSession, activeTree) }, activeTree);
  const selectMode = (nextMode) => {
    setMode(nextMode);
    if (nextMode === "order") {
      setProblemText([selectedProduct?.name, selectedOrder?.drive, selectedOrder?.notes].filter(Boolean).join(" "));
      setShowSuggestions(true);
    }
  };

  return <div className="space-y-5">
    <Card>
      <SectionTitle icon={HelpCircle} title="Geführter Diagnose-Assistent" subtitle="Fehler sicher und nachvollziehbar eingrenzen – lokal, offline-fähig und ohne automatische Reparaturfreigabe." />
      <OrderContext selectedOrder={selectedOrder} selectedProduct={selectedProduct} text="Produkt, Hersteller, Antrieb und bisherige Auftragsdaten werden als Kontext berücksichtigt." />
      <div className="mb-5 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900"><AlertTriangle size={17} className="mt-0.5 shrink-0" />Bei Blockade, Tor-Sicherheit oder elektrischen Fehlern Anlage nicht weiter belasten. Herstellerangaben, Elektrofachkraft und geltende Vorschriften beachten.</div>

      {!currentSession && <div className="space-y-5">
        <DiagnosisStart mode={mode} onAnalyze={() => setShowSuggestions(true)} onModeChange={selectMode} order={selectedOrder} problemText={problemText} selectedSymptoms={selectedSymptoms} setProblemText={setProblemText} symptomGroups={diagnosisSymptomGroups} toggleSymptom={toggleSymptom} />
        {mode !== "select" && showSuggestions && <DiagnosisAssistant onStart={startDiagnosis} suggestions={suggestions} />}
        {mode === "select" && <div className="grid gap-3 md:grid-cols-[0.75fr_1.25fr]"><select value={diagnosisCategory} onChange={(event) => setDiagnosisCategory(event.target.value)} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold"><option value="all">Alle Kategorien</option>{diagnosisCategories.filter((category) => category !== "all").map((category) => <option key={category}>{category}</option>)}</select><div className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4"><Search size={18} className="text-slate-400" /><input value={diagnosisQuery} onChange={(event) => setDiagnosisQuery(event.target.value)} placeholder="Fehlerbild durchsuchen" className="w-full outline-none" /></div></div>}
      </div>}

      {currentSession && activeTree && !result && <div className="space-y-4"><div className="rounded-2xl bg-sky-50 p-4"><div className="flex flex-wrap gap-2"><Badge>Regelbasierter Assistent</Badge><Badge>{activeTree.safetyLevel}</Badge></div><p className="mt-2 font-black">{assistantResponse.summary}</p><p className="mt-1 text-xs font-bold text-sky-900">{assistantResponse.warning}</p></div><DiagnosisWizard onAnswer={answerStep} onBack={() => setCurrentSession(setDiagnosisStep(currentSession, currentSession.currentStep - 1))} onPause={pause} onPhoto={(step) => onOpenPhoto?.(step.stage, currentSession)} session={currentSession} tree={activeTree} /></div>}
      {currentSession && activeTree && result && <DiagnosisResult onCreatePartRequest={onCreatePartRequest} onOpenKnowledge={onOpenKnowledge} onOpenLearning={onOpenLearning} onOpenManufacturer={onOpenManufacturer} onOpenMotors={onOpenMotors} onOpenParts={onOpenParts} onPhoto={() => onOpenPhoto?.("Schaden", currentSession)} onSaveLearningCase={() => onSaveLearningCase?.({ ...currentSession, result: result || buildDiagnosisResult(currentSession, activeTree) }, activeTree)} onSaveLocal={saveLocal} onSaveOrder={saveOrder} onStatusChange={updateStatus} result={result} session={currentSession} tree={activeTree} />}
      {currentSession && <button type="button" onClick={() => setCurrentSession(null)} className="mt-4 min-h-11 w-full rounded-2xl bg-slate-100 px-4 text-xs font-black">Zur Diagnose-Startseite</button>}
    </Card>

    {!currentSession && <Card><DiagnosisQuickStarts cases={quickCases} favorites={diagnosisFavorites} onStart={startDiagnosis} onToggleFavorite={onToggleFavorite} recentCases={recentCases} /></Card>}
    {!currentSession && <Card><DiagnosisHistory onResume={resume} sessions={visibleSessions} /></Card>}

    {!currentSession && <Card><SectionTitle icon={Search} title="Alle vorhandenen Fehlerbilder" subtitle={`${allDiagnosisTrees.length} bestehende Prüffälle mit Suche, Sicherheitsstufe und lokalen Checkmarks.`} />
      <div className="mb-4 grid gap-3 md:grid-cols-[0.75fr_1.25fr]"><select value={diagnosisCategory} onChange={(event) => setDiagnosisCategory(event.target.value)} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold"><option value="all">Alle Kategorien</option>{diagnosisCategories.filter((category) => category !== "all").map((category) => <option key={category}>{category}</option>)}</select><div className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4"><Search size={18} className="text-slate-400" /><input value={diagnosisQuery} onChange={(event) => setDiagnosisQuery(event.target.value)} placeholder="Frost, Funk, Gateway, Rolltor ..." className="w-full outline-none" /></div></div>
      <details className="mb-5 rounded-2xl bg-slate-50 p-4"><summary className="cursor-pointer text-xs font-black uppercase text-slate-500">Fortschritt bestehender Praxis-Checkmarks</summary><div className="mt-4"><ModuleProgress moduleChecks={moduleChecks} groups={groups} title="Diagnose- und Dokumentationspunkte" /></div></details>
      <div className="grid gap-4 lg:grid-cols-2">{libraryCases.map((tree) => { const cardGroups = [{ scope: `diagnose-step-${tree.id}`, items: tree.firstSteps || [] }, { scope: `diagnose-finish-${tree.id}`, items: tree.finishSteps || [] }]; const favorite = diagnosisFavorites.includes(tree.id); return <article key={tree.id} className="rounded-3xl bg-slate-50 p-5"><div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap gap-2"><Badge>{tree.category}</Badge><Badge>{tree.safetyLevel}</Badge></div><h3 className="mt-3 text-lg font-black">{tree.title}</h3></div><button type="button" onClick={() => onToggleFavorite?.(tree.id)} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${favorite ? "bg-amber-100 text-amber-700" : "bg-white text-slate-300"}`}><Star size={18} fill={favorite ? "currentColor" : "none"} /></button></div><InlineProgress moduleChecks={moduleChecks} groups={cardGroups} /><div className="mt-3 flex flex-wrap gap-2">{tree.symptoms.map((symptom) => <Badge key={symptom}>{symptom}</Badge>)}</div><button type="button" onClick={() => startDiagnosis(tree)} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white"><Play size={17} />Geführte Prüfung starten</button><details className="mt-3 rounded-2xl bg-white p-3"><summary className="cursor-pointer text-xs font-black uppercase text-slate-500">Bestehende Kurzprüfung und Checkmarks</summary><div className="mt-3 space-y-2">{tree.firstSteps.map((step) => checkButton?.(`diagnose-step-${tree.id}`, step))}</div><p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs font-bold">{tree.start.q}</p><div className="mt-3 space-y-2">{tree.finishSteps.map((step) => checkButton?.(`diagnose-finish-${tree.id}`, step))}</div></details></article>; })}{!libraryCases.length && <p className="rounded-3xl bg-slate-50 p-6 text-sm font-bold text-slate-500">Keine Diagnose gefunden. Suche allgemeiner formulieren.</p>}</div>
    </Card>}
  </div>;
}
