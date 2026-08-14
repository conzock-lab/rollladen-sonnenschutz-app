import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, Filter, GraduationCap, Route, Search, ShieldAlert, Users } from "lucide-react";
import Card from "../components/Card";
import SectionTitle from "../components/SectionHeader";
import LearningMasterPanel from "../components/learning/LearningMasterPanel";
import LearningModuleCard from "../components/learning/LearningModuleCard";
import LearningOverview from "../components/learning/LearningOverview";
import LearningPracticeCases from "../components/learning/LearningPracticeCases";
import LearningProgress from "../components/learning/LearningProgress";
import LearningQuiz from "../components/learning/LearningQuiz";
import LearningReports from "../components/learning/LearningReports";
import LearningTabs from "../components/learning/LearningTabs";
import {
  learningCategories,
  learningGlossary,
  learningModules,
  learningPaths,
} from "../data/learningModules";
import {
  calculateCategoryProgress,
  calculateLearnerProgress,
  calculateModuleProgress,
  clampLearningYear,
  getLearningWeekStats,
  getVisibleLearningTabs,
  recommendLearningModules,
} from "../lib/learningSystem";

const initialTabForView = (view) => (["overview", "path", "modules", "practice", "quiz", "exam", "reports", "progress"].includes(view) ? view : view === "reportBook" ? "reports" : "overview");

export default function LearningPage({
  appRole,
  canViewTeam,
  companyPeople = [],
  currentLearnerId,
  currentPerson,
  learningAssignments = [],
  learningComments = [],
  learningLists = {},
  learningProgress = {},
  myReports = [],
  onOpenRelated,
  onOpenReportBook,
  onPrepareLearningReport,
  onQuizAnswer,
  onReviewLearningReport,
  onSaveLearningAssignment,
  onSaveLearningComment,
  onSavePracticeCase,
  onCreatePracticeCaseFromOrder,
  onToggleLearningList,
  onUpdateLearningAssignment,
  onUpdateLearningComment,
  orders = [],
  practiceCases = [],
  quizProgress = {},
  updateLearningProgress,
  initialView = "learning",
}) {
  const azubis = useMemo(() => companyPeople.filter((person) => person.role === "azubi" && person.status !== "archiviert"), [companyPeople]);
  const initialLearnerId = canViewTeam && azubis[0]?.id ? azubis[0].id : currentLearnerId;
  const tabs = useMemo(() => getVisibleLearningTabs(appRole, canViewTeam), [appRole, canViewTeam]);
  const [selectedLearnerId, setSelectedLearnerId] = useState(initialLearnerId);
  const [activeTab, setActiveTab] = useState(initialTabForView(initialView));
  const [expandedModuleId, setExpandedModuleId] = useState("");
  const [quizModuleId, setQuizModuleId] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [listFilter, setListFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const requested = initialTabForView(initialView);
    if (tabs.some((tab) => tab.id === requested)) setActiveTab(requested);
  }, [initialView, tabs]);

  useEffect(() => {
    if (!canViewTeam && currentLearnerId && selectedLearnerId !== currentLearnerId) setSelectedLearnerId(currentLearnerId);
    if (canViewTeam && azubis.length && !azubis.some((person) => person.id === selectedLearnerId)) setSelectedLearnerId(azubis[0].id);
  }, [azubis, canViewTeam, currentLearnerId, selectedLearnerId]);

  const selectedLearner = azubis.find((person) => person.id === selectedLearnerId)
    || (currentPerson?.id === selectedLearnerId ? currentPerson : null)
    || { id: selectedLearnerId, name: "Lernender", trainingYear: 1 };
  const selectedYear = clampLearningYear(selectedLearner?.trainingYear || 1);
  const selectedProgress = learningProgress?.[selectedLearnerId] || {};
  const selectedQuizProgress = quizProgress?.[selectedLearnerId] || {};
  const selectedCases = practiceCases.filter((item) => item.learnerId === selectedLearnerId);
  const selectedAssignments = learningAssignments.filter((item) => item.learnerId === selectedLearnerId);
  const selectedComments = learningComments.filter((item) => item.learnerId === selectedLearnerId);
  const selectedReports = myReports.filter((report) => !report.createdBy || report.createdBy === selectedLearnerId || report.userName === selectedLearner?.name);
  const selectedLists = learningLists?.[selectedLearnerId] || { favorites: [], later: [] };
  const curriculum = learningModules.filter((module) => module.year <= selectedYear);
  const summary = calculateLearnerProgress({ learnerId: selectedLearnerId, year: selectedYear, progress: learningProgress, quizProgress, practiceCases });
  summary.openReports = selectedReports.filter((report) => !["Freigegeben", "freigegeben"].includes(report.status)).length;
  const categories = calculateCategoryProgress(curriculum, selectedProgress);
  const recommendations = recommendLearningModules({ learnerId: selectedLearnerId, year: selectedYear, progress: learningProgress, quizProgress, practiceCases, reports: selectedReports, orders });
  const week = getLearningWeekStats({ learnerId: selectedLearnerId, progress: learningProgress, quizProgress, practiceCases, reports: selectedReports });
  const readOnly = Boolean(canViewTeam && selectedLearnerId !== currentLearnerId);
  const moduleById = Object.fromEntries(learningModules.map((module) => [module.id, module]));
  const weakQuizTopics = Object.values(selectedQuizProgress.questions || {}).reduce((topics, record) => {
    const category = record.category || "Allgemein";
    topics[category] = (topics[category] || 0) + Number(record.wrongCount || 0);
    return topics;
  }, {});
  const sortedWeakTopics = Object.entries(weakQuizTopics).filter(([, count]) => count > 0).sort((left, right) => right[1] - left[1]).slice(0, 4);

  const filteredModules = learningModules.filter((module) => {
    const moduleSummary = calculateModuleProgress(module, selectedProgress[module.id]);
    const matchesYear = yearFilter === "all" || String(module.year) === yearFilter;
    const matchesCategory = categoryFilter === "all" || module.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || moduleSummary.status === statusFilter;
    const matchesList = listFilter === "all"
      || (listFilter === "favorites" && selectedLists.favorites?.includes(module.id))
      || (listFilter === "later" && selectedLists.later?.includes(module.id));
    const text = [module.title, module.category, module.summary, module.theory, ...(module.learningGoals || []), ...(module.typicalMistakes || []), ...(module.relatedProducts || []), ...(module.relatedTools || [])].join(" ").toLocaleLowerCase("de-DE");
    const query = searchQuery.trim().toLocaleLowerCase("de-DE");
    const glossaryMatch = learningGlossary.some((item) => (item.relatedModules || []).includes(module.id) && [item.name, item.explanation, item.category].join(" ").toLocaleLowerCase("de-DE").includes(query));
    return matchesYear && matchesCategory && matchesStatus && matchesList && (text.includes(query) || glossaryMatch);
  });

  const teamSummaries = useMemo(() => Object.fromEntries(azubis.map((person) => {
    const personSummary = calculateLearnerProgress({ learnerId: person.id, year: person.trainingYear, progress: learningProgress, quizProgress, practiceCases });
    const questionRecords = Object.values(quizProgress?.[person.id]?.questions || {});
    const weak = questionRecords.sort((left, right) => Number(right.wrongCount || 0) - Number(left.wrongCount || 0))[0];
    return [person.id, { ...personSummary, openReports: myReports.filter((report) => report.createdBy === person.id && report.status !== "Freigegeben").length, weakTopic: weak?.category || "noch keine Daten" }];
  })), [azubis, learningProgress, myReports, practiceCases, quizProgress]);

  const navigate = (tab, moduleId = "") => {
    const safeTab = tabs.some((item) => item.id === tab) ? tab : "modules";
    setActiveTab(safeTab);
    if (moduleId) {
      setExpandedModuleId(moduleId);
      if (safeTab === "quiz") setQuizModuleId(moduleId);
    }
  };

  const openModuleQuiz = (moduleId) => {
    setQuizModuleId(moduleId);
    setActiveTab("quiz");
  };

  const openModule = (moduleId) => {
    setExpandedModuleId(moduleId);
    setSearchQuery("");
    setYearFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
    setListFilter("all");
    setActiveTab("modules");
  };

  return <div className="space-y-5">
    <Card>
      <SectionTitle icon={GraduationCap} title="Lernsystem" subtitle={`${learningModules.length} praxisnahe Module für vier Ausbildungsjahre – mit Quiz, Praxisfällen und Berichtsheft.`} />
      {canViewTeam && <label className="mb-4 block rounded-2xl bg-slate-50 p-3 text-sm font-black">Lernstand auswählen<select value={selectedLearnerId || ""} onChange={(event) => setSelectedLearnerId(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3"><option value="" disabled>Azubi wählen</option>{azubis.map((person) => <option key={person.id} value={person.id}>{person.name} · {clampLearningYear(person.trainingYear)}. Jahr</option>)}</select></label>}
      <LearningTabs active={activeTab} onChange={setActiveTab} tabs={tabs} />
    </Card>

    {activeTab === "overview" && <Card><LearningOverview assignments={selectedAssignments} comments={selectedComments} learner={{ ...selectedLearner, trainingYear: selectedYear }} onNavigate={navigate} recommendations={recommendations} reports={selectedReports} summary={summary} week={week} /><section className="mt-5 rounded-3xl bg-slate-50 p-4"><h3 className="font-black">Wochenziel</h3><div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">{[["2 Lernmodule", week.completedModules, 2], ["1 Praxisfall", week.practiceCases, 1], ["Berichtsheft abschließen", summary.openReports ? 0 : 1, 1], ["15 Quizfragen", week.quizAnswers, 15]].map(([label, value, target]) => <div key={label} className="rounded-2xl bg-white p-3"><div className="flex items-center justify-between gap-2 text-xs font-black"><span>{label}</span><span>{Math.min(value, target)}/{target}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.min(100, Math.round((value / target) * 100))}%` }} /></div></div>)}</div></section></Card>}

      {activeTab === "path" && <Card><SectionTitle icon={Route} title={`Lernpfad · ${selectedYear}. Ausbildungsjahr`} subtitle="Orientierung statt Sperre: Voraussetzungen werden empfohlen, Inhalte bleiben zugänglich." /><div className="space-y-5">{learningPaths.filter((path) => path.year <= selectedYear).map((path) => <section key={path.year} className="rounded-3xl bg-slate-50 p-4"><h3 className="font-black">{path.title}</h3><div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">{path.moduleIds.map((id, index) => { const module = moduleById[id]; if (!module) return null; const progress = calculateModuleProgress(module, selectedProgress[id]); const current = recommendations[0]?.module.id === id; return <button key={id} type="button" onClick={() => openModule(id)} className={`min-h-16 rounded-2xl p-3 text-left text-sm font-black ${progress.status === "Sicher" ? "bg-emerald-100 text-emerald-950" : current ? "bg-sky-100 text-sky-950 ring-2 ring-sky-300" : "bg-white"}`}><span className="mr-2 text-slate-400">{index + 1}.</span>{module.title}{current && <span className="ml-2 rounded-full bg-white px-2 py-1 text-[10px] uppercase">Nächster Schritt</span>}<span className="mt-1 block text-xs font-semibold text-slate-500">{progress.status} · {progress.percent}%</span></button>; })}</div></section>)}</div></Card>}

    {activeTab === "modules" && <Card>
      <SectionTitle icon={BookOpen} title="Lernmodule" subtitle="Kompakt filtern, öffnen und den eigenen Lernstand markieren." />
      <div className="mb-4 grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.7fr_0.7fr]"><label className="flex min-h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3"><Search size={18} /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Thema, Werkzeug oder Produkt suchen" className="min-w-0 flex-1 text-sm outline-none" /></label><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold"><option value="all">Alle Kategorien</option>{learningCategories.map((category) => <option key={category}>{category}</option>)}</select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold"><option value="all">Alle Lernstände</option><option>Neu</option><option>In Arbeit</option><option>Sicher</option></select><select value={listFilter} onChange={(event) => setListFilter(event.target.value)} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold"><option value="all">Alle Listen</option><option value="favorites">Favoriten</option><option value="later">Später lernen</option></select></div>
      <div className="mb-5 grid grid-cols-5 gap-2">{["all", "1", "2", "3", "4"].map((year) => <button key={year} type="button" onClick={() => setYearFilter(year)} className={`min-h-11 rounded-xl px-2 text-xs font-black ${yearFilter === year ? "bg-slate-950 text-white" : "bg-slate-100"}`}>{year === "all" ? "Alle" : `${year}. Jahr`}</button>)}</div>
      {readOnly && <div className="mb-4 rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-900">Fortschritt anderer Personen wird schreibgeschützt angezeigt.</div>}
      <div className="grid gap-4 lg:grid-cols-2">{filteredModules.map((module) => <LearningModuleCard key={module.id} expanded={expandedModuleId === module.id} favorite={selectedLists.favorites?.includes(module.id)} later={selectedLists.later?.includes(module.id)} module={module} moduleById={moduleById} onOpenQuiz={openModuleQuiz} onPrepareReport={(item) => onPrepareLearningReport?.(`Bearbeitetes Lernmodul: ${item.title}.\nLernziele: ${item.learningGoals.join(", ")}.\nPraxisaufgabe: ${item.practicalTask}.\nDiesen Entwurf habe ich geprüft und in eigenen Worten ergänzt.`)} onToggleCheckpoint={(moduleId, checkpointId, checked) => updateLearningProgress?.(selectedLearnerId, moduleId, checkpointId, checked)} onToggleExpanded={() => setExpandedModuleId(expandedModuleId === module.id ? "" : module.id)} onToggleList={(list, moduleId) => onToggleLearningList?.(selectedLearnerId, list, moduleId)} progress={selectedProgress[module.id]} readOnly={readOnly} />)}</div>
      {!filteredModules.length && <p className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-500">Keine Module passen zu diesem Filter.</p>}
      <details className="mt-5 rounded-3xl bg-slate-50 p-4"><summary className="cursor-pointer font-black">Begriffe kurz erklärt</summary><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{learningGlossary.map((item) => <div key={item.name} className="rounded-2xl bg-white p-3"><strong className="text-sm">{item.name}</strong><p className="mt-1 text-xs leading-5 text-slate-600">{item.explanation}</p></div>)}</div></details>
      <div className="mt-5 rounded-3xl bg-sky-50 p-4"><div className="flex items-center gap-2"><Filter size={17} /><h3 className="font-black">Passendes Wissen öffnen</h3></div><div className="mt-3 flex flex-wrap gap-2">{[["diagnosis", "Fehlerdiagnose"], ["motors", "Motoren & Steuerungen"], ["substrates", "Untergrund-Assistent"], ["tools", "Werkzeug & Material"], ["norms", "Normen"], ["products", "Produkt-Lexikon"]].map(([id, label]) => <button key={id} type="button" onClick={() => onOpenRelated?.(id)} className="min-h-11 rounded-xl bg-white px-3 text-xs font-black">{label}</button>)}</div></div>
    </Card>}

    {activeTab === "practice" && <Card><LearningPracticeCases learnerId={selectedLearnerId} modules={learningModules} onCreateFromOrder={(order) => onCreatePracticeCaseFromOrder?.(order, selectedLearnerId)} onPrepareReport={onPrepareLearningReport} onSave={onSavePracticeCase} orders={orders} practiceCases={practiceCases} readOnly={readOnly} /></Card>}
    {activeTab === "quiz" && <Card><LearningQuiz learnerId={selectedLearnerId} moduleId={quizModuleId} modules={learningModules} onAnswer={readOnly ? undefined : (card, correct) => onQuizAnswer?.(selectedLearnerId, card, correct)} onOpenModule={openModule} quizProgress={quizProgress} /></Card>}
    {activeTab === "exam" && <Card><div className="mb-4 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-950"><ShieldAlert size={18} className="mr-2 inline" />Interne Lern- und Übungsfunktion – keine offizielle Prüfungsunterlage. Herstellerangaben, Elektrofachkraft und geltende Vorschriften beachten.</div><div className="mb-4 grid gap-3 lg:grid-cols-2"><section className="rounded-3xl bg-slate-50 p-4"><h3 className="font-black">Schwache Themen</h3><div className="mt-3 flex flex-wrap gap-2">{sortedWeakTopics.map(([category, count]) => <span key={category} className="rounded-full bg-white px-3 py-2 text-xs font-black">{category} · {count} Fehler</span>)}{!sortedWeakTopics.length && <span className="text-sm font-bold text-slate-500">Noch keine Fehlerdaten vorhanden.</span>}</div></section><section className="rounded-3xl bg-slate-50 p-4"><h3 className="font-black">Empfohlener Lernplan</h3><div className="mt-3 grid gap-2">{recommendations.slice(0, 3).map((item) => <button key={item.module.id} type="button" onClick={() => openModule(item.module.id)} className="min-h-11 rounded-xl bg-white px-3 text-left text-xs font-black">{item.module.title} · {item.reason}</button>)}</div></section></div><LearningQuiz initialMode="exam" learnerId={selectedLearnerId} modules={learningModules} onAnswer={readOnly ? undefined : (card, correct) => onQuizAnswer?.(selectedLearnerId, card, correct)} onOpenModule={openModule} quizProgress={quizProgress} /></Card>}
    {activeTab === "reports" && <Card><LearningReports canReview={canViewTeam} learnerId={selectedLearnerId} onOpenReportBook={onOpenReportBook} onReview={onReviewLearningReport} reports={myReports} /></Card>}
    {activeTab === "progress" && <Card><LearningProgress assignments={selectedAssignments} categories={categories} comments={selectedComments} onAssignmentStatus={onUpdateLearningAssignment} onCommentStatus={onUpdateLearningComment} summary={summary} /></Card>}

    {canViewTeam && ["overview", "progress"].includes(activeTab) && <Card><SectionTitle icon={Users} title="Ausbildungsbegleitung" subtitle="Fortschritt ansehen, Lernaufgaben zuweisen und sachlich kommentieren." /><LearningMasterPanel azubis={azubis} comments={learningComments} modules={learningModules} onAssign={onSaveLearningAssignment} onComment={onSaveLearningComment} onSelectLearner={setSelectedLearnerId} selectedLearnerId={selectedLearnerId} summaries={teamSummaries} /></Card>}
  </div>;
}
