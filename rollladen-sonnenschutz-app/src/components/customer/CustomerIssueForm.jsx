import React, { useState } from "react";
import { Camera, CircleAlert } from "lucide-react";
import { CUSTOMER_ISSUE_CATEGORIES } from "../../lib/customerPortal";

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

export default function CustomerIssueForm({ defaultOrderId = "", onSubmit, orders = [], showNotice }) {
  const [form, setForm] = useState({ orderId: defaultOrderId || orders[0]?.id || "", category: CUSTOMER_ISSUE_CATEGORIES[0], description: "", problemSince: "", usable: "ja", photo: null });
  const choosePhoto = (file) => {
    if (!file) return;
    if (file.size > MAX_PHOTO_BYTES) { showNotice?.("Bitte ein Foto unter 2 MB auswählen."); return; }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, photo: { name: file.name, type: file.type, dataUrl: String(reader.result || "") } }));
    reader.readAsDataURL(file);
  };
  const submit = () => {
    if (!form.orderId || !form.description.trim()) return;
    onSubmit(form);
    setForm({ ...form, description: "", problemSince: "", photo: null });
  };
  return <section className="rounded-3xl bg-amber-50 p-4"><div className="flex items-center gap-2"><CircleAlert size={18} /><h3 className="font-black">Problem melden</h3></div><p className="mt-1 text-xs text-amber-900">Beschreiben Sie nur, was Sie beobachten. Eine technische Diagnose ist nicht nötig.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold">Auftrag<select value={form.orderId} onChange={(event) => setForm({ ...form, orderId: event.target.value })} className="mt-1 min-h-12 w-full rounded-xl border border-amber-200 bg-white px-3">{orders.map((order) => <option key={order.id} value={order.id}>{order.id}</option>)}</select></label><label className="text-sm font-bold">Kategorie<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-1 min-h-12 w-full rounded-xl border border-amber-200 bg-white px-3">{CUSTOMER_ISSUE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label><label className="text-sm font-bold">Problem seit<input type="date" value={form.problemSince} onChange={(event) => setForm({ ...form, problemSince: event.target.value })} className="mt-1 min-h-12 w-full rounded-xl border border-amber-200 px-3" /></label><label className="text-sm font-bold">Anlage noch nutzbar?<select value={form.usable} onChange={(event) => setForm({ ...form, usable: event.target.value })} className="mt-1 min-h-12 w-full rounded-xl border border-amber-200 bg-white px-3"><option value="ja">ja</option><option value="eingeschränkt">eingeschränkt</option><option value="nein">nein</option></select></label></div><label className="mt-3 block text-sm font-bold">Beschreibung<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 h-28 w-full resize-none rounded-xl border border-amber-200 p-3" placeholder="Was ist passiert oder auffällig?" /></label><label className="mt-3 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-black"><Camera size={18} />{form.photo ? form.photo.name : "Foto optional hinzufügen"}<input type="file" accept="image/*" className="sr-only" onChange={(event) => choosePhoto(event.target.files?.[0])} /></label><button type="button" onClick={submit} disabled={!form.orderId || !form.description.trim()} className="mt-3 min-h-12 w-full rounded-xl bg-amber-950 px-4 text-sm font-black text-white disabled:opacity-40">Meldung speichern</button></section>;
}
