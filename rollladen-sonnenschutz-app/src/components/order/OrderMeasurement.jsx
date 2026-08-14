import React from "react";
import { AlertTriangle, CheckCircle2, Ruler } from "lucide-react";
import Card from "../Card";
import { Field } from "../Field";
import SectionTitle from "../SectionHeader";

export default function OrderMeasurement({ canEdit = true, fields = [], missing = [], onChange, order, product, values = {} }) {
  const completed = fields.length - missing.length;
  const percent = fields.length ? Math.round((completed / fields.length) * 100) : 0;
  return <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
    <Card><SectionTitle icon={Ruler} title="Aufmaß" subtitle="Die Pflichtfelder passen sich dem Produkt des aktiven Auftrags an." /><div className="mb-4 rounded-3xl bg-slate-50 p-4"><h3 className="font-black">{product?.name}</h3><p className="mt-1 text-sm text-slate-600">Auftrag {order?.id} · {order?.customer}</p></div><fieldset disabled={!canEdit} className="grid gap-3 md:grid-cols-2">{fields.map((field) => <Field key={field} label={field} value={values[field] || ""} onChange={(value) => onChange(field, value)} placeholder={`${field} eintragen`} />)}</fieldset></Card>
    <Card><SectionTitle icon={missing.length ? AlertTriangle : CheckCircle2} title="Vollständigkeit" subtitle="Fehlende Angaben bleiben direkt sichtbar." /><div className="rounded-3xl bg-slate-950 p-5 text-white"><p className="text-4xl font-black">{completed}/{fields.length}</p><p className="mt-1 text-sm text-white/70">Angaben vollständig · {percent}%</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${percent}%` }} /></div></div><div className="mt-4 space-y-2">{missing.map((field) => <div key={field} className="rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-900">Fehlt: {field}</div>)}{!missing.length && <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-900">Aufmaß vollständig.</div>}</div></Card>
  </div>;
}
