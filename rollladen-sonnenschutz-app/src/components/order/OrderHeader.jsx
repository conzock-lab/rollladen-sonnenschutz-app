import React from "react";
import { CalendarDays, Clock3, MapPin, UsersRound } from "lucide-react";
import { Badge } from "../CheckItem";
import OrderWorkflowBar from "../OrderWorkflowBar";
import { normalizeOrderStatus } from "../../data/orders";

const syncLabels = {
  pending: "wartet auf Sync",
  syncing: "wird synchronisiert",
  failed: "lokal gespeichert",
  synced: "synchronisiert",
  local: "lokal gespeichert",
};

export default function OrderHeader({ canOpenModule, onArchive, onCreateRework, onNavigate, onStartParts, order, product, stages, syncStatus = "local", teamLabel }) {
  return <section className="rounded-[2rem] bg-white p-4 shadow-sm md:p-6">
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2"><Badge>{order.id}</Badge><Badge>{normalizeOrderStatus(order.status)}</Badge><Badge>{order.priority || "normal"}</Badge><Badge>{syncLabels[syncStatus] || syncStatus}</Badge></div>
        <h1 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">{order.id} · {order.customer || "Kunde offen"} · {product?.name || "Produkt offen"}</h1>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-slate-600">
          <span className="inline-flex items-center gap-2"><CalendarDays size={17} />{order.date || "Termin offen"}</span>
          <span className="inline-flex items-center gap-2"><Clock3 size={17} />{order.time || "Uhrzeit offen"}</span>
          <span className="inline-flex items-center gap-2"><UsersRound size={17} />{teamLabel || order.assignedTo || "Team offen"}</span>
          <span className="inline-flex items-center gap-2"><MapPin size={17} />{order.address || "Adresse offen"}</span>
        </div>
      </div>
      <div className="grid shrink-0 grid-cols-2 gap-2 text-xs sm:grid-cols-3 xl:w-[380px]">
        <Info label="Auftragsart" value={order.orderType || "Montage"} />
        <Info label="Produkt" value={product?.category || product?.name || "offen"} />
        <Info label="Priorität" value={order.priority || "normal"} />
      </div>
    </div>
    <OrderWorkflowBar canOpenModule={canOpenModule} onArchive={onArchive} onCreateRework={onCreateRework} onNavigate={onNavigate} onStartParts={onStartParts} order={order} stages={stages} />
  </section>;
}

function Info({ label, value }) {
  return <div className="rounded-2xl bg-slate-50 p-3"><p className="font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 truncate font-black text-slate-800">{value}</p></div>;
}
