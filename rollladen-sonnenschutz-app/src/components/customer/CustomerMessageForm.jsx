import React, { useState } from "react";
import { MessageSquareText } from "lucide-react";
import { CUSTOMER_MESSAGE_TOPICS } from "../../lib/customerPortal";

export default function CustomerMessageForm({ defaultOrderId = "", onSubmit, orders = [] }) {
  const [form, setForm] = useState({ orderId: defaultOrderId || orders[0]?.id || "", topic: "Termin", message: "" });
  const submit = () => {
    if (!form.orderId || !form.message.trim()) return;
    onSubmit(form);
    setForm({ ...form, message: "" });
  };
  return <section className="rounded-3xl bg-sky-50 p-4"><div className="flex items-center gap-2"><MessageSquareText size={18} /><h3 className="font-black">Frage zum Auftrag</h3></div><p className="mt-1 text-xs text-sky-900">Ihre Frage wird gespeichert und dem ausgewählten Auftrag zugeordnet.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold">Auftrag<select value={form.orderId} onChange={(event) => setForm({ ...form, orderId: event.target.value })} className="mt-1 min-h-12 w-full rounded-xl border border-sky-200 bg-white px-3">{orders.map((order) => <option key={order.id} value={order.id}>{order.id}</option>)}</select></label><label className="text-sm font-bold">Thema<select value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })} className="mt-1 min-h-12 w-full rounded-xl border border-sky-200 bg-white px-3">{CUSTOMER_MESSAGE_TOPICS.map((topic) => <option key={topic}>{topic}</option>)}</select></label></div><label className="mt-3 block text-sm font-bold">Nachricht<textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="mt-1 h-28 w-full resize-none rounded-xl border border-sky-200 p-3" placeholder="Ihre Frage" /></label><button type="button" onClick={submit} disabled={!form.orderId || !form.message.trim()} className="mt-3 min-h-12 w-full rounded-xl bg-sky-950 px-4 text-sm font-black text-white disabled:opacity-40">Rückfrage speichern</button></section>;
}
