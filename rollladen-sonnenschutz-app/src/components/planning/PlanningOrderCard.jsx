import React from "react";
import { AlertTriangle, BookOpen, Camera, CheckCircle2, Clock3, ExternalLink, MapPin, Move, Phone, Play, UsersRound } from "lucide-react";
import { Badge } from "../CheckItem";
import { normalizeOrderStatus } from "../../data/orders";

const priorityClass = {
  dringend: "border-rose-300 bg-rose-50",
  hoch: "border-amber-200 bg-amber-50/60",
  normal: "border-slate-100 bg-white",
};

const materialClass = {
  vollständig: "bg-emerald-100 text-emerald-900",
  "nicht erforderlich": "bg-slate-100 text-slate-700",
  fehlt: "bg-rose-100 text-rose-900",
  "wartet auf Lieferung": "bg-amber-100 text-amber-900",
  bestellt: "bg-sky-100 text-sky-900",
  "teilweise vorhanden": "bg-amber-100 text-amber-900",
};

export default function PlanningOrderCard({
  canPlan,
  conflicts = [],
  currentRole,
  details = {},
  onCreateLearningCase,
  onDragStart,
  onMove,
  onOpen,
  onOpenArea,
  onStart,
  order,
  people = [],
  productName,
  syncPending = false,
}) {
  const team = people.filter((person) => (order.assignedMemberIds || []).includes(person.id));
  const addressQuery = order.address ? encodeURIComponent(order.address) : "";
  const canWork = ["dev", "meister", "buero", "vorarbeiter", "monteur"].includes(currentRole);

  return <article
    draggable={canPlan}
    onDragStart={(event) => onDragStart?.(event, order)}
    className={`rounded-3xl border p-4 shadow-sm ${priorityClass[order.priority] || priorityClass.normal}`}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-wide text-slate-400">{order.time || "Uhrzeit offen"} · {order.id}</p>
        <h3 className="mt-1 truncate font-black">{order.customer || "Kunde offen"}</h3>
        <p className="mt-1 text-sm font-bold text-slate-600">{productName || order.product || "Produkt offen"} · {order.orderType || "Auftrag"}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1"><Badge>{normalizeOrderStatus(order.status)}</Badge>{order.priority === "dringend" && <Badge>dringend</Badge>}</div>
    </div>

    <div className="mt-3 grid gap-2 text-xs font-bold text-slate-600 sm:grid-cols-2">
      <p className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" />{order.address || "Adresse fehlt"}</p>
      <p className="flex items-start gap-2"><UsersRound size={15} className="mt-0.5 shrink-0" />{team.map((person) => person.name).join(", ") || order.assignedTo || "Team offen"}</p>
      <p className="flex items-start gap-2"><Clock3 size={15} className="mt-0.5 shrink-0" />{order.estimatedDuration ? `ca. ${order.estimatedDuration} Std.` : "Dauer nicht geschätzt"}</p>
      <p><span className={`inline-flex rounded-full px-2 py-1 ${materialClass[order.materialStatus] || "bg-slate-100 text-slate-700"}`}>Material: {order.materialStatus || "nicht geprüft"}</span></p>
    </div>

    {details.materialHint && <p className="mt-2 rounded-xl bg-sky-50 px-3 py-2 text-xs font-bold text-sky-900">{details.materialHint}</p>}
    {(details.openPoints || []).length > 0 && <button type="button" onClick={() => onOpen?.(order)} className="mt-2 flex w-full items-center justify-between rounded-xl bg-amber-50 px-3 py-2 text-left text-xs font-bold text-amber-900"><span>{details.openPoints.length} offene Punkte</span><ExternalLink size={14} /></button>}
    {conflicts.length > 0 && <div className="mt-2 space-y-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-900">{conflicts.slice(0, 3).map((conflict, index) => <p key={`${conflict.type}-${index}`} className="flex gap-2"><AlertTriangle size={14} className="shrink-0" />{conflict.label}</p>)}</div>}
    {order.customerChangeRequested && <p className="mt-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-bold text-violet-900">Terminänderung vom Kunden angefragt</p>}
    {order.customerConfirmed && <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900">Termin vom Kunden bestätigt</p>}
    {syncPending && <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900">Änderung wartet auf Synchronisierung.</p>}

    <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      <button type="button" onClick={() => onOpen?.(order)} className="min-h-11 rounded-xl bg-slate-950 px-3 text-xs font-black text-white">Auftrag öffnen</button>
      {addressQuery ? <a href={`https://www.google.com/maps/search/?api=1&query=${addressQuery}`} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-center gap-1 rounded-xl bg-slate-100 px-3 text-xs font-black"><MapPin size={15} />Navigation</a> : <button type="button" disabled className="min-h-11 rounded-xl bg-slate-100 px-3 text-xs font-black text-slate-400">Navigation</button>}
      {order.phone ? <a href={`tel:${order.phone}`} className="flex min-h-11 items-center justify-center gap-1 rounded-xl bg-slate-100 px-3 text-xs font-black"><Phone size={15} />Anrufen</a> : null}
      {canWork && normalizeOrderStatus(order.status) !== "In Arbeit" && <button type="button" onClick={() => onStart?.(order)} className="flex min-h-11 items-center justify-center gap-1 rounded-xl bg-emerald-100 px-3 text-xs font-black text-emerald-900"><Play size={15} />Start</button>}
      {canWork && <button type="button" onClick={() => onOpenArea?.(order, "photos")} className="flex min-h-11 items-center justify-center gap-1 rounded-xl bg-slate-100 px-3 text-xs font-black"><Camera size={15} />Foto</button>}
      {canWork && <button type="button" onClick={() => onOpenArea?.(order, "closeOrder")} className="flex min-h-11 items-center justify-center gap-1 rounded-xl bg-slate-100 px-3 text-xs font-black"><CheckCircle2 size={15} />Abschluss</button>}
      {canPlan && <button type="button" onClick={() => onMove?.(order)} className="flex min-h-11 items-center justify-center gap-1 rounded-xl bg-sky-100 px-3 text-xs font-black text-sky-900"><Move size={15} />Verschieben</button>}
      {currentRole === "azubi" && <button type="button" onClick={() => onCreateLearningCase?.(order)} className="col-span-2 flex min-h-11 items-center justify-center gap-1 rounded-xl bg-violet-100 px-3 text-xs font-black text-violet-900"><BookOpen size={15} />Als Lernfall verwenden</button>}
    </div>
  </article>;
}
