import React, { useEffect, useState } from "react";
import { MessageSquareText, Plus, Users } from "lucide-react";
import { Badge } from "../CheckItem";

export default function LearningMasterPanel({ azubis = [], modules, onAssign, onComment, onSelectLearner, selectedLearnerId, summaries = {} }) {
  const [assignment, setAssignment] = useState({ title: "", learnerId: selectedLearnerId, moduleId: "", practiceTask: "", dueDate: "", comment: "" });
  const [comment, setComment] = useState({ learnerId: selectedLearnerId, targetType: "Lernmodul", targetId: "", text: "" });
  useEffect(() => {
    setAssignment((current) => ({ ...current, learnerId: selectedLearnerId }));
    setComment((current) => ({ ...current, learnerId: selectedLearnerId }));
  }, [selectedLearnerId]);

  const saveAssignment = () => {
    const learnerId = assignment.learnerId || selectedLearnerId;
    if (!learnerId || !assignment.title.trim()) return;
    onAssign({ ...assignment, learnerId, id: `LA-${Date.now()}`, status: "offen", createdAt: new Date().toISOString() });
    setAssignment((current) => ({ ...current, title: "", practiceTask: "", comment: "" }));
  };
  const saveComment = () => {
    const learnerId = comment.learnerId || selectedLearnerId;
    if (!learnerId || !comment.text.trim()) return;
    onComment({ ...comment, learnerId, id: `LC-${Date.now()}`, status: "offen", createdAt: new Date().toISOString() });
    setComment((current) => ({ ...current, text: "" }));
  };

  return <div className="space-y-5">
    <section><div className="flex items-center gap-2"><Users size={19} /><h3 className="font-black">Azubi-Übersicht</h3></div><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{azubis.map((person) => { const summary = summaries[person.id] || {}; return <button key={person.id} type="button" onClick={() => onSelectLearner(person.id)} className={`rounded-3xl p-4 text-left ${person.id === selectedLearnerId ? "bg-slate-950 text-white" : "bg-slate-50"}`}><div className="flex flex-wrap gap-2"><Badge>{person.trainingYear || 1}. Jahr</Badge><Badge>{summary.openReports || 0} Berichte offen</Badge></div><h4 className="mt-3 font-black">{person.name}</h4><p className="mt-2 text-2xl font-black">{summary.overall || 0}%</p><p className={`text-xs font-bold ${person.id === selectedLearnerId ? "text-white/60" : "text-slate-500"}`}>{summary.completedModules || 0}/{summary.totalModules || 0} Module · {summary.quizAnswers || 0} Quiz · {summary.practiceCases || 0} Praxisfälle</p><p className={`mt-2 text-xs font-bold ${person.id === selectedLearnerId ? "text-amber-200" : "text-amber-700"}`}>Schwerpunkt: {summary.weakTopic || "noch keine Daten"}</p></button>; })}{!azubis.length && <p className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-500">Noch kein Azubi im Teamverzeichnis.</p>}</div></section>

    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-3xl bg-slate-50 p-5"><div className="flex items-center gap-2"><Plus size={18} /><h3 className="font-black">Lernaufgabe zuweisen</h3></div><div className="mt-4 grid gap-3"><input value={assignment.title} onChange={(event) => setAssignment({ ...assignment, title: event.target.value })} placeholder="Titel, z. B. Funkmotor-Grundlagen" className="min-h-12 rounded-2xl border border-slate-200 bg-white px-3 text-sm" /><select value={assignment.learnerId || selectedLearnerId} onChange={(event) => setAssignment({ ...assignment, learnerId: event.target.value })} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold">{azubis.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select><select value={assignment.moduleId} onChange={(event) => setAssignment({ ...assignment, moduleId: event.target.value })} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-3 text-sm"><option value="">Optionales Modul</option>{modules.map((module) => <option key={module.id} value={module.id}>{module.title}</option>)}</select><textarea value={assignment.practiceTask} onChange={(event) => setAssignment({ ...assignment, practiceTask: event.target.value })} placeholder="Optionale Praxisaufgabe" className="min-h-20 rounded-2xl border border-slate-200 bg-white p-3 text-sm" /><input type="date" value={assignment.dueDate} onChange={(event) => setAssignment({ ...assignment, dueDate: event.target.value })} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-3" /><textarea value={assignment.comment} onChange={(event) => setAssignment({ ...assignment, comment: event.target.value })} placeholder="Kurzer Kommentar" className="min-h-20 rounded-2xl border border-slate-200 bg-white p-3 text-sm" /><button type="button" onClick={saveAssignment} className="min-h-12 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white">Zuweisen</button></div></div>
      <div className="rounded-3xl bg-slate-50 p-5"><div className="flex items-center gap-2"><MessageSquareText size={18} /><h3 className="font-black">Kommentar hinterlassen</h3></div><div className="mt-4 grid gap-3"><select value={comment.learnerId || selectedLearnerId} onChange={(event) => setComment({ ...comment, learnerId: event.target.value })} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold">{azubis.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select><select value={comment.targetType} onChange={(event) => setComment({ ...comment, targetType: event.target.value })} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-3"><option>Lernmodul</option><option>Praxisfall</option><option>Berichtsheft</option><option>Lernziel</option></select><input value={comment.targetId} onChange={(event) => setComment({ ...comment, targetId: event.target.value })} placeholder="Optional: Modul-/Praxis-/Bericht-ID" className="min-h-12 rounded-2xl border border-slate-200 bg-white px-3 text-sm" /><textarea value={comment.text} onChange={(event) => setComment({ ...comment, text: event.target.value })} placeholder="Konkrete Rückmeldung" className="min-h-24 rounded-2xl border border-slate-200 bg-white p-3 text-sm" /><button type="button" onClick={saveComment} className="min-h-12 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white">Kommentar speichern</button></div></div>
    </section>
  </div>;
}
