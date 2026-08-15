import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarClock, X } from "lucide-react";
import { ABSENCE_TYPES, MATERIAL_STATUSES, PLANNING_PRIORITIES } from "../../data/planning";
import { isPersonAbsent } from "../../lib/planning";
import { getCustomerPortalState } from "../../lib/customerPortal";

const emptyForm = { date: "", time: "08:00", assignedMemberIds: [], crew: "", estimatedDuration: "", priority: "normal", planningNote: "", materialStatus: "nicht geprüft" };

export default function AssignmentDialog({ absences = [], onClose, onSave, open, order, people = [] }) {
  const [form, setForm] = useState(emptyForm);
  useEffect(() => {
    if (!order) return;
    setForm({
      date: order.date || "",
      time: order.time || "08:00",
      assignedMemberIds: order.assignedMemberIds || [],
      crew: order.crew || "",
      estimatedDuration: order.estimatedDuration || "",
      priority: order.priority || "normal",
      planningNote: order.planningNote || "",
      materialStatus: order.materialStatus || "nicht geprüft",
    });
  }, [order]);
  const crews = useMemo(() => [...new Set(people.map((person) => person.team).filter(Boolean))], [people]);
  const selectedPeople = people.filter((person) => form.assignedMemberIds.includes(person.id));
  const absenceWarnings = selectedPeople.map((person) => ({ person, absence: isPersonAbsent(person.id, form.date, absences) })).filter((entry) => entry.absence);
  const appointmentRequest = order ? getCustomerPortalState(order).appointmentRequests.find((request) => ["Anfrage gesendet", "wird geprüft"].includes(request.status)) : null;
  if (!open || !order) return null;

  const togglePerson = (personId) => setForm((current) => ({ ...current, assignedMemberIds: current.assignedMemberIds.includes(personId) ? current.assignedMemberIds.filter((id) => id !== personId) : [...current.assignedMemberIds, personId] }));
  const useCrew = () => setForm((current) => ({ ...current, assignedMemberIds: people.filter((person) => person.team === current.crew && person.status === "aktiv").map((person) => person.id) }));
  const save = () => onSave(order.id, { ...form, estimatedDuration: form.estimatedDuration ? Number(form.estimatedDuration) : "" });

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-2 sm:items-center sm:p-5" role="dialog" aria-modal="true">
    <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-4 shadow-2xl md:p-6">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase text-slate-400">{order.id}</p><h2 className="text-xl font-black">Auftrag einplanen</h2><p className="mt-1 text-sm text-slate-600">{order.customer} · vorhandene Auftragsdaten werden nur ergänzt.</p></div><button type="button" onClick={onClose} className="rounded-xl bg-slate-100 p-3"><X size={18} /></button></div>
      {appointmentRequest && <div className="mt-4 rounded-2xl bg-sky-50 p-4 text-sm text-sky-950"><p className="font-black">Terminänderung angefragt</p><p className="mt-1">Wunsch: {appointmentRequest.preferredDate || "ohne konkretes Datum"} · {appointmentRequest.timeWindow || "egal"}</p>{appointmentRequest.message && <p className="mt-2 rounded-xl bg-white p-3">{appointmentRequest.message}</p>}<p className="mt-2 text-xs font-bold">Wenn Sie eine neue Planung speichern, sieht der Kunde diesen Termin als Vorschlag.</p></div>}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm font-bold">Datum<input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3" /></label>
        <label className="text-sm font-bold">Uhrzeit<input type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3" /></label>
        <label className="text-sm font-bold">Dauer optional<input type="number" min="0.5" step="0.5" value={form.estimatedDuration} onChange={(event) => setForm({ ...form, estimatedDuration: event.target.value })} placeholder="Stunden" className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3" /></label>
        <label className="text-sm font-bold">Priorität<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3">{PLANNING_PRIORITIES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="text-sm font-bold">Materialstatus<select value={form.materialStatus} onChange={(event) => setForm({ ...form, materialStatus: event.target.value })} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3">{MATERIAL_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="text-sm font-bold">Kolonne<select value={form.crew} onChange={(event) => setForm({ ...form, crew: event.target.value })} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3"><option value="">Temporäres Team</option>{crews.map((crew) => <option key={crew}>{crew}</option>)}</select></label>
      </div>
      {form.crew && <button type="button" onClick={useCrew} className="mt-3 min-h-11 rounded-xl bg-sky-100 px-4 text-xs font-black text-sky-900">Aktive Mitglieder von {form.crew} übernehmen</button>}

      <div className="mt-5 grid gap-4 md:grid-cols-3">{["vorarbeiter", "monteur", "azubi"].map((role) => <section key={role}><h3 className="mb-2 text-xs font-black uppercase text-slate-400">{role === "azubi" ? "Azubi" : role === "monteur" ? "Monteure" : "Vorarbeiter"}</h3><div className="space-y-2">{people.filter((person) => person.role === role && person.status === "aktiv").map((person) => { const absence = isPersonAbsent(person.id, form.date, absences); return <label key={person.id} className={`flex min-h-12 items-center justify-between gap-2 rounded-xl p-3 text-sm font-bold ${absence ? "bg-amber-50 text-amber-900" : "bg-slate-50"}`}><span>{person.name}<span className="block text-xs font-semibold opacity-60">{absence ? `${absence.type} · ${absence.startDate} bis ${absence.endDate}` : person.team || "flexibel"}</span></span><input type="checkbox" checked={form.assignedMemberIds.includes(person.id)} onChange={() => togglePerson(person.id)} className="h-5 w-5 accent-slate-950" /></label>; })}</div></section>)}</div>
      {absenceWarnings.length > 0 && <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-900">{absenceWarnings.map(({ person, absence }) => <p key={person.id} className="flex gap-2"><AlertTriangle size={17} />{person.name} ist an diesem Tag {ABSENCE_TYPES.includes(absence.type) ? absence.type.toLocaleLowerCase("de-DE") : "abwesend"}.</p>)}</div>}
      <label className="mt-4 block text-sm font-bold">Interne Planungsnotiz<textarea value={form.planningNote} onChange={(event) => setForm({ ...form, planningNote: event.target.value })} className="mt-1 h-24 w-full resize-none rounded-xl border border-slate-200 p-3" placeholder="Zufahrt, Gerüst, Schlüssel, Rückfrage …" /></label>
      <div className="mt-5 grid gap-2 sm:grid-cols-3"><button type="button" onClick={() => { setForm({ ...form, date: "", time: "" }); }} className="min-h-12 rounded-xl bg-slate-100 px-4 text-sm font-black">In Ungeplant verschieben</button><button type="button" onClick={onClose} className="min-h-12 rounded-xl bg-slate-100 px-4 text-sm font-black">Abbrechen</button><button type="button" onClick={save} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-black text-white"><CalendarClock size={18} />Planung speichern</button></div>
    </div>
  </div>;
}
