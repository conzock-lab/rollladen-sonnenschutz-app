import React, { useState } from "react";
import { ArrowLeft, CalendarDays, FileText, LayoutDashboard, MessageSquareText, RefreshCw } from "lucide-react";
import { Badge } from "../CheckItem";
import AppointmentCard from "./AppointmentCard";
import CustomerCareTips from "./CustomerCareTips";
import CustomerDocuments from "./CustomerDocuments";
import CustomerIssueForm from "./CustomerIssueForm";
import CustomerMessageForm from "./CustomerMessageForm";
import { getCustomerPortalState, getCustomerStatus, productLabel } from "../../lib/customerPortal";

const tabs = [
  { id: "overview", label: "Übersicht", icon: LayoutDashboard },
  { id: "appointment", label: "Termin", icon: CalendarDays },
  { id: "documents", label: "Dokumente", icon: FileText },
  { id: "care", label: "Pflege", icon: RefreshCw },
  { id: "contact", label: "Kontakt", icon: MessageSquareText },
];

export default function CustomerOrderDetails({ company, documents, onAcknowledgeDocument, onApproval, onBack, onConfirmAppointment, onIssue, onMessage, onRequestAppointment, order, showNotice }) {
  const [active, setActive] = useState("overview");
  const status = getCustomerStatus(order);
  const portal = getCustomerPortalState(order);
  const customerMessages = portal.messages;
  const openIssues = portal.issues.filter((issue) => issue.status !== "erledigt");
  const handoverConfirmed = portal.approvals.some((approval) => approval.approvalType === "Kundenübergabe bestätigt");

  return <div className="space-y-4">
    <button type="button" onClick={onBack} className="flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-black shadow-sm"><ArrowLeft size={18} />Meine Aufträge</button>
    <section className="rounded-[2rem] bg-slate-950 p-5 text-white"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase text-white/50">Auftrag {order.id}</p><h1 className="mt-1 text-2xl font-black">{productLabel(order.product)}</h1><p className="mt-1 text-sm text-white/70">{order.orderType || "Auftrag"} · {order.address || "Adresse offen"}</p></div><Badge>{status.label}</Badge></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${status.progress}%` }} /></div></section>
    <nav className="flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm" aria-label="Kunden-Auftragsbereiche">{tabs.map((tab) => { const Icon = tab.icon; return <button key={tab.id} type="button" onClick={() => setActive(tab.id)} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-black ${active === tab.id ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700"}`}><Icon size={16} />{tab.label}</button>; })}</nav>
    {active === "overview" && <div className="space-y-3"><section className="grid gap-3 sm:grid-cols-2"><div className="rounded-3xl bg-white p-4 shadow-sm"><p className="text-xs font-black uppercase text-slate-400">Auftrag</p><p className="mt-2 font-black">{productLabel(order.product)}</p><p className="mt-1 text-sm text-slate-600">{order.orderType || "Auftrag"} · {order.id}</p></div><div className="rounded-3xl bg-white p-4 shadow-sm"><p className="text-xs font-black uppercase text-slate-400">Ansprechpartner</p><p className="mt-2 font-black">{order.customerContactName || "Ihr Kundenservice"}</p><p className="mt-1 text-sm text-slate-600">{company?.name || "Ihr Fachbetrieb"}</p></div></section><AppointmentCard onConfirm={onConfirmAppointment} onRequestChange={onRequestAppointment} order={order} />{order.customerNote && <section className="rounded-3xl bg-sky-50 p-4"><p className="text-xs font-black uppercase text-sky-800">Hinweis für Sie</p><p className="mt-2 text-sm leading-6 text-sky-950">{order.customerNote}</p></section>}{["Erledigt", "Archiviert"].includes(order.status) && <section className="rounded-3xl bg-emerald-50 p-4"><h2 className="font-black">Auftrag abgeschlossen</h2><p className="mt-1 text-sm text-emerald-950">Abschlussdokumente, Pflegehinweise und Kontaktmöglichkeiten finden Sie in den Bereichen oben.</p><button type="button" disabled={handoverConfirmed} onClick={() => onApproval(order, "Kundenübergabe bestätigt")} className="mt-3 min-h-11 w-full rounded-xl bg-emerald-950 px-4 text-sm font-black text-white disabled:bg-emerald-200 disabled:text-emerald-900">{handoverConfirmed ? "Übergabe bestätigt" : "Übergabe bestätigen"}</button><p className="mt-2 text-xs font-semibold text-emerald-900">Interne Dokumentationsbestätigung – keine elektronische Signatur.</p></section>}</div>}
    {active === "appointment" && <AppointmentCard onConfirm={onConfirmAppointment} onRequestChange={onRequestAppointment} order={order} />}
    {active === "documents" && <CustomerDocuments documents={documents} onAcknowledge={onAcknowledgeDocument} />}
    {active === "care" && <CustomerCareTips orders={[order]} />}
    {active === "contact" && <div className="space-y-3"><CustomerMessageForm defaultOrderId={order.id} onSubmit={onMessage} orders={[order]} /><CustomerIssueForm defaultOrderId={order.id} onSubmit={onIssue} orders={[order]} showNotice={showNotice} />{customerMessages.map((message) => <article key={message.id} className={`rounded-3xl p-4 ${message.reply ? "bg-emerald-50" : "bg-slate-50"}`}><div className="flex justify-between gap-2"><p className="text-xs font-black uppercase">Rückfrage · {message.topic}</p><Badge>{message.status}</Badge></div><p className="mt-2 text-sm">{message.message}</p>{message.reply && <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-bold text-emerald-950">Antwort: {message.reply}</p>}</article>)}{openIssues.map((issue) => <article key={issue.id} className="rounded-3xl bg-amber-50 p-4"><div className="flex justify-between gap-2"><strong>{issue.category}</strong><Badge>{issue.status}</Badge></div>{issue.reworkOrderId && <p className="mt-2 text-sm font-bold">Nacharbeit {issue.reworkOrderId} wurde vorbereitet.</p>}</article>)}</div>}
  </div>;
}
