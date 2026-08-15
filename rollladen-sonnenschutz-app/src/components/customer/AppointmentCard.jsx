import React, { useState } from "react";
import { CalendarDays, CheckCircle2, Clock3 } from "lucide-react";
import { Badge } from "../CheckItem";
import { getCustomerPortalState } from "../../lib/customerPortal";
import AppointmentRequestDialog from "./AppointmentRequestDialog";

const appointmentRequestLabel = (request) => ({
  "Anfrage gesendet": "Änderungswunsch gesendet",
  "wird geprüft": "Ihr Wunsch wird geprüft",
  "neuer Termin vorgeschlagen": "Neuer Termin vorgeschlagen",
  bestätigt: "Neuer Termin bestätigt",
}[request?.status] || request?.status || "");

const formatTimestamp = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" }) : value;
};

export default function AppointmentCard({ compact = false, onConfirm, onRequestChange, order }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const portal = getCustomerPortalState(order);
  const latestRequest = portal.appointmentRequests[0];
  const proposalReady = latestRequest?.status === "neuer Termin vorgeschlagen";
  const confirmed = Boolean(order.customerConfirmed) && !proposalReady;
  const confirmable = Boolean(proposalReady ? latestRequest.proposedDate : order.date);

  return <section className="rounded-3xl bg-slate-50 p-4">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="flex items-center gap-2 text-xs font-black uppercase text-slate-500"><CalendarDays size={15} />Termin</p><p className="mt-2 text-lg font-black">{proposalReady ? latestRequest.proposedDate : order.date || "Termin noch offen"} {proposalReady ? latestRequest.proposedTime : order.time || ""}</p></div><Badge>{confirmed ? "bestätigt" : proposalReady ? "Vorschlag" : "Bestätigung offen"}</Badge></div>
    {latestRequest && <div className={`mt-3 rounded-2xl p-3 text-sm font-bold ${proposalReady ? "bg-sky-100 text-sky-950" : "bg-white text-slate-700"}`}><p>{appointmentRequestLabel(latestRequest)}</p>{latestRequest.preferredDate && !proposalReady && <p className="mt-1 text-xs font-semibold opacity-70">Wunsch: {latestRequest.preferredDate} · {latestRequest.timeWindow}</p>}</div>}
    {confirmed && <div role="status" className="mt-3 flex gap-2 rounded-2xl bg-emerald-100 p-3 text-sm text-emerald-950"><CheckCircle2 className="shrink-0" size={18} /><span><strong>Termin bestätigt</strong>{order.customerConfirmedAt && <span className="block text-xs font-semibold">{formatTimestamp(order.customerConfirmedAt)}</span>}</span></div>}
    {!compact && <div className="mt-4 grid gap-2 sm:grid-cols-2"><button type="button" disabled={confirmed || !confirmable} onClick={() => setConfirmOpen(true)} className="min-h-12 rounded-xl bg-slate-950 px-4 text-sm font-black text-white disabled:bg-emerald-100 disabled:text-emerald-900">{confirmed ? "Termin bestätigt" : !confirmable ? "Termin noch offen" : proposalReady ? "Neuen Termin bestätigen" : "Termin bestätigen"}</button><button type="button" onClick={() => setRequestOpen(true)} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-black text-slate-800"><Clock3 size={17} />Terminänderung anfragen</button></div>}
    {confirmOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-2 sm:items-center" role="dialog" aria-modal="true"><div className="w-full max-w-md rounded-[2rem] bg-white p-5"><h2 className="text-xl font-black">Termin bestätigen?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Sie bestätigen den angezeigten Termin für Auftrag {order.id}. Eine erneute Bestätigung ist danach nicht nötig.</p><div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => setConfirmOpen(false)} className="min-h-12 rounded-xl bg-slate-100 font-black">Abbrechen</button><button type="button" onClick={() => { onConfirm(order, latestRequest); setConfirmOpen(false); }} className="min-h-12 rounded-xl bg-slate-950 font-black text-white">Jetzt bestätigen</button></div></div></div>}
    <AppointmentRequestDialog onClose={() => setRequestOpen(false)} onSubmit={onRequestChange} open={requestOpen} order={order} />
  </section>;
}
