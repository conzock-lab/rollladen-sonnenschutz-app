import React from "react";
import { CalendarDays, ChevronRight, FileText, MapPin } from "lucide-react";
import { Badge } from "../CheckItem";
import { getCustomerStatus, productLabel } from "../../lib/customerPortal";

export default function CustomerOrderCard({ documentCount = 0, onOpen, order }) {
  const status = getCustomerStatus(order);
  return <button type="button" onClick={() => onOpen(order)} className="w-full rounded-3xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wide text-slate-400">Auftrag {order.id}</p><h2 className="mt-1 text-lg font-black">{productLabel(order.product)}</h2><p className="mt-1 text-sm font-bold text-slate-600">{order.orderType || "Auftrag"}</p></div><ChevronRight className="shrink-0 text-slate-400" /></div>
    <div className="mt-3"><Badge>{status.label}</Badge></div>
    <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2"><p className="flex gap-2"><CalendarDays size={17} className="shrink-0" />{order.date || "Termin offen"} {order.time || ""}</p><p className="flex gap-2"><FileText size={17} className="shrink-0" />{documentCount ? `${documentCount} Dokument${documentCount === 1 ? "" : "e"}` : "Keine Dokumente"}</p><p className="flex gap-2 sm:col-span-2"><MapPin size={17} className="shrink-0" />{order.address || "Adresse noch nicht hinterlegt"}</p></div>
  </button>;
}
