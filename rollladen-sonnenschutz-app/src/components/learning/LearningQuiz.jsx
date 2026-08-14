import React, { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, RotateCcw, Target, XCircle } from "lucide-react";
import { Badge } from "../CheckItem";
import { quizModes, selectQuizCards, summarizeQuizAnswers } from "../../lib/learningSystem";

export default function LearningQuiz({ initialMode = "quick", learnerId, moduleId: initialModuleId = "", modules, onAnswer, onOpenModule, quizProgress }) {
  const [mode, setMode] = useState(initialMode);
  const [moduleId, setModuleId] = useState(initialModuleId);
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const card = cards[index];
  const examMode = mode === "exam";
  const summary = useMemo(() => summarizeQuizAnswers(answers), [answers]);

  const start = (nextMode = mode) => {
    const selectedCards = selectQuizCards({ learnerId, mode: nextMode, moduleId, quizProgress });
    setMode(nextMode); setCards(selectedCards); setIndex(0); setSelected(null); setAnswers([]); setFinished(false);
  };
  const choose = (answerIndex) => {
    if (selected !== null) return;
    const correct = answerIndex === card.correctIndex;
    const answer = { questionId: card.id, category: card.category || card.t, correct, selectedIndex: answerIndex, correctIndex: card.correctIndex, moduleIds: card.moduleIds || [] };
    setSelected(answerIndex); setAnswers((current) => [...current, answer]); onAnswer?.(card, correct);
    if (examMode) window.setTimeout(() => nextQuestion(), 220);
  };
  const nextQuestion = () => {
    if (index + 1 >= cards.length) { setFinished(true); setSelected(null); return; }
    setIndex((current) => current + 1); setSelected(null);
  };

  if (!cards.length && !finished) return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{quizModes.map((item) => <button key={item.id} type="button" onClick={() => setMode(item.id)} className={`rounded-3xl p-4 text-left ${mode === item.id ? "bg-slate-950 text-white" : "bg-slate-50"}`}><Target size={18}/><span className="mt-3 block font-black">{item.label}</span><span className={`mt-1 block text-xs font-semibold ${mode === item.id ? "text-white/60" : "text-slate-500"}`}>{item.count} Fragen</span></button>)}</div>{mode === "module" && <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-black">Lernmodul<select value={moduleId} onChange={(event) => setModuleId(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3"><option value="">Modul wählen</option>{modules.map((module) => <option key={module.id} value={module.id}>{module.title}</option>)}</select></label>}<div className="rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900">{examMode ? "Interne Lern- und Übungsfunktion – keine offizielle Prüfungsunterlage. Lösungen erscheinen erst am Ende." : "Nach jeder Antwort erhältst du eine kurze Erklärung. Falsche Fragen werden lokal für Wiederholungen gespeichert."}</div><button type="button" onClick={() => start(mode)} disabled={mode === "module" && !moduleId} className="min-h-12 w-full rounded-2xl bg-slate-950 px-4 text-sm font-black text-white disabled:opacity-40">{mode === "repeat" ? "Fehler wiederholen" : "Quiz starten"}</button>{mode === "repeat" && selectQuizCards({learnerId,mode:"repeat",quizProgress}).length === 0 && <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-900">Noch keine falschen Antworten gespeichert.</p>}</div>;

  if (finished) {
    const weakModuleIds = answers.filter((answer) => !answer.correct).flatMap((answer) => answer.moduleIds);
    const recommended = [...new Set(weakModuleIds)].map((id) => modules.find((module) => module.id === id)).filter(Boolean).slice(0,3);
    return <div className="space-y-4"><section className="rounded-3xl bg-slate-950 p-5 text-white"><Badge>Auswertung</Badge><p className="mt-3 text-4xl font-black">{summary.correct}/{summary.total}</p><p className="mt-1 text-sm font-bold text-white/60">{summary.percent}% richtig beantwortet</p></section><div className="grid gap-3 md:grid-cols-2"><div className="rounded-3xl bg-emerald-50 p-4"><h3 className="font-black text-emerald-900">Stärkste Themen</h3><div className="mt-3 space-y-2">{summary.strongest.map((item) => <p key={item.category} className="text-sm font-bold">{item.category}: {item.correct}/{item.total}</p>)}</div></div><div className="rounded-3xl bg-amber-50 p-4"><h3 className="font-black text-amber-900">Schwache Themen</h3><div className="mt-3 space-y-2">{summary.weakest.map((item) => <p key={item.category} className="text-sm font-bold">{item.category}: {item.correct}/{item.total}</p>)}</div></div></div>{recommended.length > 0 && <section className="rounded-3xl bg-slate-50 p-4"><h3 className="font-black">Empfohlene Module</h3><div className="mt-3 grid gap-2 md:grid-cols-3">{recommended.map((module) => <button key={module.id} type="button" onClick={() => onOpenModule(module.id)} className="min-h-12 rounded-2xl bg-white p-3 text-left text-xs font-black">{module.title}</button>)}</div></section>}<button type="button" onClick={() => { setCards([]); setFinished(false); }} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white"><RotateCcw size={17}/>Neues Quiz</button></div>;
  }

  if (!card) return <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold">Für diesen Modus sind noch keine passenden Fragen vorhanden.<button type="button" onClick={() => setCards([])} className="mt-3 block min-h-11 rounded-xl bg-white px-4">Zurück</button></div>;
  return <section className="rounded-3xl bg-slate-950 p-4 text-white md:p-6"><div className="flex items-center justify-between gap-3"><div className="flex flex-wrap gap-2"><Badge>{quizModes.find((item) => item.id === mode)?.label}</Badge><Badge>{card.category || card.t}</Badge></div><span className="text-xs font-black text-white/60">{index + 1}/{cards.length}</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-violet-400" style={{width:`${((index+1)/cards.length)*100}%`}} /></div><h2 className="mt-6 text-xl font-black leading-8">{card.q}</h2><div className="mt-5 grid gap-3">{card.options.map((option, answerIndex) => { const correct = selected !== null && answerIndex === card.correctIndex; const wrong = selected === answerIndex && !correct; return <button key={option} type="button" onClick={() => choose(answerIndex)} className={`min-h-14 rounded-2xl border p-4 text-left text-sm font-black ${correct && !examMode ? "border-emerald-300 bg-emerald-100 text-emerald-950" : wrong && !examMode ? "border-rose-300 bg-rose-100 text-rose-950" : "border-white/10 bg-white text-slate-950"}`}>{String.fromCharCode(65+answerIndex)}. {option}</button>; })}</div>{selected !== null && !examMode && <div className="mt-4 rounded-2xl bg-white/10 p-4"><div className="flex items-center gap-2 font-black">{selected === card.correctIndex ? <CheckCircle2 className="text-emerald-300"/> : <XCircle className="text-rose-300"/>}{selected === card.correctIndex ? "Richtig" : "Noch nicht richtig"}</div><p className="mt-2 text-sm font-semibold leading-6 text-white/70">{card.explanation}</p><button type="button" onClick={nextQuestion} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-xs font-black text-slate-950">Weiter<ArrowRight size={16}/></button></div>}</section>;
}
