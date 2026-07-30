import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, CircleCheckBig, GraduationCap, Search, Users } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import SectionTitle from "../components/SectionHeader";
import {
  allQuizCards,
  getLearningModuleProgress,
  isLearningModuleComplete,
  learningCategories,
  learningCheckpoints,
  learningModules,
} from "../data/learningModules";

function QuizTrainer({ cards }) {
  const [year, setYear] = useState("all");
  const [topic, setTopic] = useState("all");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const years = [...new Set(cards.map((card) => String(card.y)))].sort();
  const topics = [...new Set(cards.map((card) => card.t))];
  const filtered = cards.filter((card) => (year === "all" || String(card.y) === year) && (topic === "all" || card.t === topic));
  const card = filtered[index];

  useEffect(() => {
    setIndex(0);
    setSelected(null);
  }, [year, topic]);

  if (!filtered.length) return <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">Für diesen Filter gibt es noch keine Quizfrage.</div>;
  if (!card) return <div className="rounded-3xl bg-slate-950 p-5 text-white"><h3 className="text-xl font-black">Quiz abgeschlossen</h3><button type="button" onClick={() => { setIndex(0); setSelected(null); }} className="mt-4 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-slate-950">Neu starten</button></div>;

  const choose = (answerIndex) => {
    if (selected !== null) return;
    setSelected(answerIndex);
    if (answerIndex === card.correctIndex) {
      window.setTimeout(() => {
        setIndex((current) => current + 1);
        setSelected(null);
      }, 850);
    }
  };

  return (
    <div className="rounded-3xl bg-slate-50 p-4">
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <select value={year} onChange={(event) => setYear(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold">
          <option value="all">Alle Ausbildungsjahre</option>
          {years.map((item) => <option key={item} value={item}>{item}. Jahr</option>)}
        </select>
        <select value={topic} onChange={(event) => setTopic(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold">
          <option value="all">Alle Quizthemen</option>
          {topics.map((item) => <option key={item}>{item}</option>)}
        </select>
        <div className="rounded-2xl bg-white px-3 py-3 text-sm font-bold">Frage {index + 1} von {filtered.length}</div>
      </div>
      <article className="rounded-3xl bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black leading-7">{card.q}</h3>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {card.options.map((option, answerIndex) => {
            const correct = selected !== null && answerIndex === card.correctIndex;
            const wrong = selected === answerIndex && answerIndex !== card.correctIndex;
            const answerClass = correct ? "border-emerald-200 bg-emerald-50 text-emerald-900" : wrong ? "border-rose-200 bg-rose-50 text-rose-900" : "border-slate-100 bg-slate-50";
            return <button type="button" key={option} onClick={() => choose(answerIndex)} className={"rounded-2xl border p-3 text-left text-sm font-bold " + answerClass}><span className="mr-2">{String.fromCharCode(65 + answerIndex)}.</span>{option}</button>;
          })}
        </div>
        {selected !== null && <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6"><strong>Erklärung:</strong> {card.explanation}</div>}
        {selected !== null && selected !== card.correctIndex && <button type="button" onClick={() => setSelected(null)} className="mt-3 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">Nochmal versuchen</button>}
      </article>
    </div>
  );
}

function clampTrainingYear(value) {
  return Math.max(1, Math.min(4, Number(value) || 1));
}

export default function LearningPage({
  appRole,
  canViewTeam,
  companyPeople = [],
  currentLearnerId,
  currentPerson,
  learningProgress = {},
  myReports = [],
  updateLearningProgress,
}) {
  const azubis = useMemo(() => companyPeople.filter((person) => person.role === "azubi"), [companyPeople]);
  const initialLearnerId = canViewTeam && azubis[0]?.id ? azubis[0].id : currentLearnerId;
  const [selectedLearnerId, setSelectedLearnerId] = useState(initialLearnerId);
  const [yearFilter, setYearFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedModuleId, setExpandedModuleId] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    if (!canViewTeam && currentLearnerId && selectedLearnerId !== currentLearnerId) {
      setSelectedLearnerId(currentLearnerId);
      return;
    }
    if (canViewTeam && azubis.length && !azubis.some((person) => person.id === selectedLearnerId)) {
      setSelectedLearnerId(azubis[0].id);
    }
  }, [azubis, canViewTeam, currentLearnerId, selectedLearnerId]);

  const safeProgress = learningProgress && typeof learningProgress === "object" ? learningProgress : {};
  const selectedLearner = azubis.find((person) => person.id === selectedLearnerId) || (currentPerson?.id === selectedLearnerId ? currentPerson : null);
  const selectedYear = clampTrainingYear(selectedLearner?.trainingYear || currentPerson?.trainingYear || 1);
  const selectedProgress = safeProgress[selectedLearnerId] || {};
  const curriculumModules = learningModules.filter((module) => module.year <= selectedYear);
  const completedModules = curriculumModules.filter((module) => isLearningModuleComplete(selectedProgress[module.id]));
  const openModules = curriculumModules.filter((module) => !isLearningModuleComplete(selectedProgress[module.id]));
  const futureRecommendations = learningModules.filter((module) => module.year > selectedYear && !isLearningModuleComplete(selectedProgress[module.id]));
  const recommendedModules = [...openModules, ...futureRecommendations].slice(0, 3);
  const percent = curriculumModules.length ? Math.round((completedModules.length / curriculumModules.length) * 100) : 0;
  const selectedReports = canViewTeam && selectedLearner
    ? myReports.filter((report) => report.createdBy === selectedLearner.id || report.userName === selectedLearner.name)
    : myReports;
  const openReportCount = selectedReports.filter((report) => report.status !== "Freigegeben").length;
  const isReadOnly = canViewTeam || appRole !== "azubi" || selectedLearnerId !== currentLearnerId;

  const filteredModules = learningModules.filter((module) => {
    const progress = selectedProgress[module.id] || {};
    const completed = isLearningModuleComplete(progress);
    const matchesYear = yearFilter === "all" || String(module.year) === yearFilter;
    const matchesCategory = categoryFilter === "all" || module.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || (statusFilter === "completed" ? completed : !completed);
    const searchable = [module.title, module.category, module.explanation, module.practiceTask, ...module.typicalErrors].join(" ").toLowerCase();
    return matchesYear && matchesCategory && matchesStatus && searchable.includes(searchQuery.toLowerCase());
  });

  const showRecommendedModule = (module) => {
    setYearFilter(String(module.year));
    setCategoryFilter(module.category);
    setStatusFilter("all");
    setSearchQuery("");
    setExpandedModuleId(module.id);
  };

  const getPersonSummary = (person) => {
    const year = clampTrainingYear(person.trainingYear);
    const modules = learningModules.filter((module) => module.year <= year);
    const records = safeProgress[person.id] || {};
    const completed = modules.filter((module) => isLearningModuleComplete(records[module.id])).length;
    return {
      completed,
      total: modules.length,
      percent: modules.length ? Math.round((completed / modules.length) * 100) : 0,
    };
  };

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle icon={GraduationCap} title="Lernmodus" subtitle="24 kompakte Lernmodule für vier Ausbildungsjahre mit Praxisaufgaben, Fehlerbildern und gespeichertem Fortschritt." />

        {canViewTeam && (
          <div className="mb-5 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
            <label className="rounded-3xl bg-slate-50 p-4 text-sm font-bold text-slate-800">
              Lernstand auswählen
              <select value={selectedLearnerId || ""} onChange={(event) => setSelectedLearnerId(event.target.value)} className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold">
                {azubis.length === 0 && <option value={currentLearnerId}>Noch kein Azubi angelegt</option>}
                {azubis.map((person) => <option key={person.id} value={person.id}>{person.name} · {clampTrainingYear(person.trainingYear)}. Jahr</option>)}
              </select>
            </label>
            <div className="rounded-3xl bg-slate-950 p-4 text-sm font-bold leading-6 text-white">
              <div className="flex items-center gap-2"><Users size={18} />Fortschrittsansicht für Meister, Büro und Dev</div>
              <p className="mt-2 text-white/70">Lernstände anderer Personen werden schreibgeschützt angezeigt.</p>
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{openModules.length}</p><p className="text-sm text-slate-600">offene Module</p></div>
          <div className="rounded-3xl bg-emerald-50 p-4"><p className="text-3xl font-black text-emerald-900">{completedModules.length}</p><p className="text-sm text-emerald-800">erledigte Module</p></div>
          <div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{percent}%</p><p className="text-sm text-slate-600">Fortschritt bis Jahr {selectedYear}</p></div>
          <div className="rounded-3xl bg-amber-50 p-4"><p className="text-3xl font-black text-amber-900">{openReportCount}</p><p className="text-sm text-amber-800">offene Berichtsheft-Einträge</p></div>
        </div>

        <div className="mt-5 rounded-3xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Empfohlene nächste Themen</p>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {recommendedModules.map((module) => <button type="button" key={module.id} onClick={() => showRecommendedModule(module)} className="rounded-2xl bg-white p-3 text-left text-sm font-bold hover:shadow"><span className="text-xs text-slate-500">{module.year}. Jahr · {module.category}</span><span className="mt-1 block">{module.title}</span></button>)}
            {recommendedModules.length === 0 && <div className="rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-900">Aktueller Lernplan vollständig.</div>}
          </div>
        </div>
      </Card>

      {canViewTeam && azubis.length > 0 && (
        <Card>
          <SectionTitle icon={Users} title="Azubi-Fortschritt" subtitle="Kompakte Übersicht für Meister, Büro und Dev." />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {azubis.map((person) => {
              const summary = getPersonSummary(person);
              return (
                <button type="button" key={person.id} onClick={() => setSelectedLearnerId(person.id)} className={"rounded-3xl p-4 text-left " + (selectedLearnerId === person.id ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900")}>
                  <div className="flex items-center justify-between gap-2"><strong>{person.name}</strong><Badge>{clampTrainingYear(person.trainingYear)}. Jahr</Badge></div>
                  <p className="mt-3 text-2xl font-black">{summary.percent}%</p>
                  <p className={"text-xs font-bold " + (selectedLearnerId === person.id ? "text-white/60" : "text-slate-500")}>{summary.completed}/{summary.total} Module erledigt</p>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      <Card>
        <SectionTitle icon={BookOpen} title="Lernmodule" subtitle="Nach Jahr, Kategorie und Status filtern. Erklärungen und Praxisdetails bleiben bis zum Öffnen kompakt." />

        <div className="mb-4 grid gap-3 xl:grid-cols-[1fr_0.8fr_0.7fr]">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"><Search size={18} /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Thema oder Fehler suchen ..." className="w-full text-sm outline-none" /></div>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold">
            <option value="all">Alle Kategorien</option>
            {learningCategories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold">
            <option value="all">Offen & erledigt</option>
            <option value="open">Nur offen</option>
            <option value="completed">Nur erledigt</option>
          </select>
        </div>

        <div className="mb-5 grid grid-cols-5 gap-2">
          {["all", "1", "2", "3", "4"].map((year) => <button type="button" key={year} onClick={() => setYearFilter(year)} className={"rounded-2xl px-2 py-3 text-xs font-black " + (yearFilter === year ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700")}>{year === "all" ? "Alle" : year + ". Jahr"}</button>)}
        </div>

        {isReadOnly && <div className="mb-4 rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-900">Schreibgeschützte Fortschrittsansicht.</div>}

        <div className="grid gap-4 lg:grid-cols-2">
          {filteredModules.map((module) => {
            const progress = selectedProgress[module.id] || {};
            const progressCount = getLearningModuleProgress(progress);
            const completed = isLearningModuleComplete(progress);
            const expanded = expandedModuleId === module.id;
            return (
              <article key={module.id} className={"rounded-3xl border p-4 " + (completed ? "border-emerald-200 bg-emerald-50" : "border-slate-100 bg-slate-50")}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap gap-2"><Badge>{module.year}. Jahr</Badge><Badge>{module.category}</Badge></div>
                    <h3 className="mt-3 font-black leading-6">{module.title}</h3>
                  </div>
                  <div className={"rounded-2xl px-3 py-2 text-xs font-black " + (completed ? "bg-emerald-600 text-white" : "bg-white text-slate-700")}>{progressCount}/4</div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: (progressCount * 25) + "%" }} /></div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {learningCheckpoints.map((checkpoint) => {
                    const checked = Boolean(progress[checkpoint.id]);
                    return <button type="button" key={checkpoint.id} disabled={isReadOnly} onClick={() => updateLearningProgress?.(selectedLearnerId, module.id, checkpoint.id, !checked)} className={"flex items-center gap-2 rounded-2xl px-3 py-2 text-left text-xs font-bold disabled:cursor-default " + (checked ? "bg-emerald-100 text-emerald-900" : "bg-white text-slate-600")}><CircleCheckBig size={16} className={checked ? "text-emerald-600" : "text-slate-300"} />{checkpoint.label}</button>;
                  })}
                </div>

                <button type="button" onClick={() => setExpandedModuleId(expanded ? "" : module.id)} className="mt-4 flex w-full items-center justify-between rounded-2xl bg-white px-3 py-2 text-sm font-black">
                  Details & Praxis {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                </button>

                {expanded && (
                  <div className="mt-3 space-y-3 text-sm leading-6">
                    <div className="rounded-2xl bg-white p-4"><strong>Kurze Erklärung</strong><p className="mt-1 text-slate-600">{module.explanation}</p></div>
                    <div className="rounded-2xl bg-sky-50 p-4 text-sky-950"><strong>Praxisaufgabe</strong><p className="mt-1">{module.practiceTask}</p></div>
                    <div className="rounded-2xl bg-rose-50 p-4 text-rose-950"><strong>Typische Fehler</strong><ul className="mt-2 list-disc space-y-1 pl-5">{module.typicalErrors.map((error) => <li key={error}>{error}</li>)}</ul></div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {filteredModules.length === 0 && <div className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-600">Keine Lernmodule passen zu diesem Filter.</div>}
      </Card>

      <Card>
        <button type="button" onClick={() => setShowQuiz((current) => !current)} className="flex w-full items-center justify-between text-left">
          <div><h2 className="text-xl font-black">Quiz-Trainer</h2><p className="mt-1 text-sm text-slate-600">{allQuizCards.length} kurze Wissensfragen als Ergänzung.</p></div>
          {showQuiz ? <ChevronUp /> : <ChevronDown />}
        </button>
        {showQuiz && <div className="mt-5"><QuizTrainer cards={allQuizCards} /></div>}
      </Card>
    </div>
  );
}
