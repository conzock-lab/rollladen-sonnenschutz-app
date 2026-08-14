import React, { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, UsersRound } from "lucide-react";
import { addDays, dateKey } from "../../lib/planning";
import PlanningOrderCard from "./PlanningOrderCard";

const dateLabel = (day) => new Date(`${day}T12:00:00`).toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "2-digit" });

export default function PlanningToday({ cardPropsForOrder, nextOrder, onDateChange, orders, people, selectedDate }) {
  const [groupMode, setGroupMode] = useState("time");
  const grouped = useMemo(() => {
    if (groupMode === "time") return [{ id: "time", label: "Chronologisch", orders }];
    const map = new Map();
    for (const order of orders) {
      const assigned = people.filter((person) => (order.assignedMemberIds || []).includes(person.id));
      const crew = order.crew || assigned.find((person) => person.team)?.team || "Ohne Kolonne";
      map.set(crew, [...(map.get(crew) || []), order]);
    }
    return [...map.entries()].map(([id, rows]) => ({ id, label: id, orders: rows }));
  }, [groupMode, orders, people]);

  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2"><button type="button" onClick={() => onDateChange(addDays(selectedDate, -1))} className="rounded-xl bg-slate-100 p-3"><ChevronLeft size={18} /></button><button type="button" onClick={() => onDateChange(dateKey())} className="min-h-11 rounded-xl bg-slate-950 px-4 text-xs font-black text-white">Heute</button><button type="button" onClick={() => onDateChange(addDays(selectedDate, 1))} className="rounded-xl bg-slate-100 p-3"><ChevronRight size={18} /></button></div>
      <p className="flex items-center gap-2 font-black capitalize"><CalendarDays size={18} />{dateLabel(selectedDate)}</p>
      <div className="flex rounded-xl bg-slate-100 p-1"><button type="button" onClick={() => setGroupMode("time")} className={`flex min-h-9 items-center gap-1 rounded-lg px-3 text-xs font-black ${groupMode === "time" ? "bg-white shadow" : ""}`}><Clock3 size={14} />Uhrzeit</button><button type="button" onClick={() => setGroupMode("team")} className={`flex min-h-9 items-center gap-1 rounded-lg px-3 text-xs font-black ${groupMode === "team" ? "bg-white shadow" : ""}`}><UsersRound size={14} />Team</button></div>
    </div>

    {selectedDate === dateKey() && nextOrder && <section className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-lg"><p className="text-xs font-black uppercase tracking-wide text-white/50">Nächster Auftrag</p><h2 className="mt-1 text-xl font-black">{nextOrder.time || "Zeit offen"} · {nextOrder.orderType || "Auftrag"}</h2><p className="mt-1 text-sm text-white/70">{nextOrder.address || "Adresse fehlt"}</p><button type="button" onClick={() => cardPropsForOrder(nextOrder).onOpen(nextOrder)} className="mt-4 min-h-11 rounded-xl bg-white px-4 text-xs font-black text-slate-950">Auftrag öffnen</button></section>}

    {grouped.map((group) => <section key={group.id} className="space-y-3"><h2 className="px-1 text-sm font-black uppercase tracking-wide text-slate-400">{group.label} · {group.orders.length}</h2><div className="grid gap-3 xl:grid-cols-2">{group.orders.map((order) => <PlanningOrderCard key={order.id} {...cardPropsForOrder(order)} order={order} />)}</div></section>)}
    {!orders.length && <div className="rounded-[2rem] bg-white p-8 text-center text-sm font-bold text-slate-500 shadow-sm">Für diesen Tag sind keine passenden Baustellen geplant.</div>}
  </div>;
}
