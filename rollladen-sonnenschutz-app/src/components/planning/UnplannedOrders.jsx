import React, { useState } from "react";
import { ClipboardList } from "lucide-react";
import { PLANNING_ORDER_TYPES } from "../../data/planning";
import { normalizeOrderStatus } from "../../data/orders";
import PlanningOrderCard from "./PlanningOrderCard";

export default function UnplannedOrders({ cardPropsForOrder, orders }) {
  const [type, setType] = useState("Alle");
  const filtered = orders.filter((order) => type === "Alle" || order.orderType === type || (type === "dringend" && order.priority === "dringend") || (type === "neu" && normalizeOrderStatus(order.status) === "Neu"));
  return <div className="space-y-4"><div className="rounded-[2rem] bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="rounded-2xl bg-slate-950 p-3 text-white"><ClipboardList size={20} /></span><div><h2 className="text-xl font-black">Ungeplante Aufträge</h2><p className="text-sm text-slate-600">Ohne Termin oder ohne Teamzuweisung. Die bestehende Auftragsakte bleibt die einzige Datenquelle.</p></div></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{["Alle", "neu", "dringend", ...PLANNING_ORDER_TYPES].map((item) => <button key={item} type="button" onClick={() => setType(item)} className={`min-h-10 shrink-0 rounded-xl px-3 text-xs font-black ${type === item ? "bg-slate-950 text-white" : "bg-slate-100"}`}>{item}</button>)}</div></div><div className="grid gap-3 xl:grid-cols-2">{filtered.map((order) => <PlanningOrderCard key={order.id} {...cardPropsForOrder(order)} order={order} />)}</div>{!filtered.length && <div className="rounded-[2rem] bg-white p-8 text-center text-sm font-bold text-slate-500">Keine ungeplanten Aufträge für diesen Filter.</div>}</div>;
}
