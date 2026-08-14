import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, dateKey, getPlanningWeek, startOfPlanningWeek } from "../../lib/planning";
import PlanningOrderCard from "./PlanningOrderCard";

const dayLabel = (day) => new Date(`${day}T12:00:00`).toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });

export default function PlanningWeek({ canPlan, cardPropsForOrder, onDateChange, onDropOrder, orders, selectedDate }) {
  const week = getPlanningWeek(selectedDate);
  const moveWeek = (amount) => onDateChange(addDays(startOfPlanningWeek(selectedDate), amount * 7));
  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-3 shadow-sm"><div className="flex gap-2"><button type="button" onClick={() => moveWeek(-1)} className="rounded-xl bg-slate-100 p-3"><ChevronLeft size={18} /></button><button type="button" onClick={() => onDateChange(dateKey())} className="min-h-11 rounded-xl bg-slate-950 px-4 text-xs font-black text-white">Heute</button><button type="button" onClick={() => moveWeek(1)} className="rounded-xl bg-slate-100 p-3"><ChevronRight size={18} /></button></div><p className="text-sm font-black">Woche ab {new Date(`${week[0]}T12:00:00`).toLocaleDateString("de-DE")}</p></div>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{week.map((day) => { const dayOrders = orders.filter((order) => order.date === day); return <section key={day} onDragOver={(event) => canPlan && event.preventDefault()} onDrop={(event) => canPlan && onDropOrder?.(event, day)} className={`min-h-48 rounded-[2rem] border-2 border-dashed p-3 ${day === dateKey() ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white"}`}><div className="mb-3 flex items-center justify-between"><h2 className="font-black capitalize">{dayLabel(day)}</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black">{dayOrders.length}</span></div><div className="space-y-3">{dayOrders.map((order) => <PlanningOrderCard key={order.id} {...cardPropsForOrder(order)} order={order} />)}{!dayOrders.length && <p className="rounded-2xl bg-slate-50 p-4 text-xs font-bold text-slate-400">Keine Baustelle{canPlan ? " · Auftrag hier ablegen" : ""}</p>}</div></section>; })}</div>
    {canPlan && <section onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDropOrder?.(event, "")} className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-100 p-5 text-center text-sm font-black text-slate-500">Auftrag hier ablegen, um ihn in „Ungeplant“ zu verschieben. Auf Touch-Geräten „Verschieben“ verwenden.</section>}
  </div>;
}
