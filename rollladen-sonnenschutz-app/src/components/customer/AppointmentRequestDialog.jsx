import React, { useEffect, useState } from "react";
import { CalendarClock, X } from "lucide-react";
import { CUSTOMER_TIME_WINDOWS } from "../../lib/customerPortal";

export default function AppointmentRequestDialog({ onClose, onSubmit, open, order }) {
  const [form, setForm] = useState({ preferredDate: "", timeWindow: "egal", message: "" });
  useEffect(() => {
    if (open) setForm({ preferredDate: "", timeWindow: "egal", message: "" });
  }, [open, order?.id]);
  if (!open || !order) return null;

  const submit = () => {
    if (!form.preferredDate && !form.message.trim()) return;
    onSubmit(order, form);
    onClose();
  };

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-2 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label="Terminänderung anfragen">
    <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl">
      <div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-black">Terminänderung anfragen</h2><p className="mt-1 text-sm text-slate-600">Dies ist nur ein Wunsch. Die tatsächliche Planung ändert sich erst nach Bestätigung durch den Betrieb.</p></div><button type="button" onClick={onClose} className="rounded-xl bg-slate-100 p-3" aria-label="Schließen"><X size={18} /></button></div>
      <div className="mt-5 space-y-3">
        <label className="block text-sm font-bold">Gewünschter Tag – optional<input type="date" value={form.preferredDate} onChange={(event) => setForm({ ...form, preferredDate: event.target.value })} className="mt-1 min-h-12 w-full rounded-xl border border-slate-200 px-3" /></label>
        <label className="block text-sm font-bold">Bevorzugter Zeitraum<select value={form.timeWindow} onChange={(event) => setForm({ ...form, timeWindow: event.target.value })} className="mt-1 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3">{CUSTOMER_TIME_WINDOWS.map((window) => <option key={window}>{window}</option>)}</select></label>
        <label className="block text-sm font-bold">Nachricht<textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Was sollen wir bei der Terminplanung berücksichtigen?" className="mt-1 h-28 w-full resize-none rounded-xl border border-slate-200 p-3" /></label>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={onClose} className="min-h-12 rounded-xl bg-slate-100 px-4 text-sm font-black">Abbrechen</button><button type="button" onClick={submit} disabled={!form.preferredDate && !form.message.trim()} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-black text-white disabled:opacity-40"><CalendarClock size={18} />Anfrage senden</button></div>
    </div>
  </div>;
}
