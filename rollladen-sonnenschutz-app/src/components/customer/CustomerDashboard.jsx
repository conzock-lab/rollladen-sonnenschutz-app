import React from "react";
import { BriefcaseBusiness, CalendarDays, ChevronRight, FileText, MessageSquareText, RefreshCw } from "lucide-react";
import { Badge } from "../CheckItem";
import AppointmentCard from "./AppointmentCard";
import { getCustomerPortalState, getCustomerStatus, productLabel } from "../../lib/customerPortal";

export default function CustomerDashboard({ customerName, documents = [], onNavigate, orders = [] }) {
  const sorted = [...orders].sort((left, right) => `${left.date || "9999"} ${left.time || ""}`.localeCompare(`${right.date || "9999"} ${right.time || ""}`));
  const nextOrder = sorted.find((order) => new Date(`${order.date || "1970-01-01"}T${order.time || "00:00"}`).getTime() >= Date.now());
  const counts = orders.reduce((result, order) => {
    const status = String(order.status || "");
    if (["Erledigt", "Archiviert"].includes(status)) result.done += 1;
    else if (status === "In Arbeit") result.working += 1;
    else if (order.date) result.planned += 1;
    else result.open += 1;
    return result;
  }, { open: 0, planned: 0, working: 0, done: 0 });
  const openMessages = orders.flatMap((order) => getCustomerPortalState(order).messages).filter((message) => !["beantwortet", "erledigt"].includes(message.status)).length;
  const newDocuments = documents.filter((document) => !document.customerSeenAt).length;

  return <div className="space-y-4">
    <section className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-lg"><p className="text-sm font-bold text-white/60">Kundenportal</p><h1 className="mt-1 text-2xl font-black">Guten Tag, {customerName || "willkommen"}</h1><p className="mt-2 text-sm leading-6 text-white/70">Termine, freigegebene Dokumente und Ihre Rückfragen an einem sicheren Ort.</p></section>
    {nextOrder ? <AppointmentCard compact order={nextOrder} /> : <section className="rounded-3xl bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><CalendarDays size={20} /><h2 className="font-black">Nächster Termin</h2></div><p className="mt-3 text-sm font-bold text-slate-600">Aktuell ist kein zukünftiger Termin eingetragen.</p></section>}
    {nextOrder && <button type="button" onClick={() => onNavigate("portal")} className="w-full rounded-3xl bg-white p-4 text-left shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase text-slate-400">Nächster Termin</p><p className="mt-1 text-lg font-black">{nextOrder.date} {nextOrder.time || ""}</p><p className="mt-1 text-sm font-bold text-slate-600">{productLabel(nextOrder.product)} · {nextOrder.address || "Adresse offen"}</p></div><Badge>{getCustomerStatus(nextOrder).label}</Badge></div></button>}
    <button type="button" onClick={() => onNavigate("portal")} className="flex w-full items-center justify-between gap-4 rounded-3xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5"><span className="flex items-start gap-3"><span className="rounded-2xl bg-slate-950 p-3 text-white"><BriefcaseBusiness size={21} /></span><span><strong className="block text-lg">Meine Termine & Aufträge</strong><span className="mt-1 block text-sm text-slate-600">Alle eigenen Aufträge und Termine öffnen</span></span></span><ChevronRight className="shrink-0" /></button>
    <div className="grid grid-cols-2 gap-3"><div className="rounded-3xl bg-white p-4 shadow-sm"><p className="text-2xl font-black">{counts.open}</p><p className="text-xs font-bold text-slate-500">offen</p></div><div className="rounded-3xl bg-white p-4 shadow-sm"><p className="text-2xl font-black">{counts.planned}</p><p className="text-xs font-bold text-slate-500">geplant</p></div><div className="rounded-3xl bg-white p-4 shadow-sm"><p className="text-2xl font-black">{counts.working}</p><p className="text-xs font-bold text-slate-500">in Arbeit</p></div><div className="rounded-3xl bg-emerald-50 p-4"><p className="text-2xl font-black text-emerald-950">{counts.done}</p><p className="text-xs font-bold text-emerald-800">erledigt</p></div></div>
    <div className="grid gap-3 sm:grid-cols-3"><button type="button" onClick={() => onNavigate("customerDocuments")} className="rounded-3xl bg-sky-50 p-4 text-left"><FileText size={20} /><p className="mt-3 text-2xl font-black">{newDocuments}</p><p className="text-xs font-bold text-sky-900">neue Dokumente</p></button><button type="button" onClick={() => onNavigate("customerCare")} className="rounded-3xl bg-emerald-50 p-4 text-left"><RefreshCw size={20} /><p className="mt-3 font-black">Pflege & Hinweise</p><p className="text-xs text-emerald-900">Passend zu Ihren Produkten</p></button><button type="button" onClick={() => onNavigate("customerContact")} className="rounded-3xl bg-amber-50 p-4 text-left"><MessageSquareText size={20} /><p className="mt-3 text-2xl font-black">{openMessages}</p><p className="text-xs font-bold text-amber-900">offene Rückfragen</p></button></div>
  </div>;
}
