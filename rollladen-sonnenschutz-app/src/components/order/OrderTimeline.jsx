import React from "react";
import { History } from "lucide-react";
import Card from "../Card";
import SectionTitle from "../SectionHeader";

export default function OrderTimeline({ events = [] }) {
  const ordered = [...events].reverse();
  return <Card><SectionTitle icon={History} title="Auftragsverlauf" subtitle="Wichtige Ereignisse der Baustelle – ohne jeden Tastendruck zu protokollieren." />
    <div className="relative ml-2 border-l-2 border-slate-200 pl-5">
      {ordered.map((event, index) => <article key={`${event.at}-${event.note}-${index}`} className="relative pb-5 last:pb-0"><span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-slate-950 ring-4 ring-white" /><p className="text-xs font-bold text-slate-400">{event.at || "Zeitpunkt offen"} · {event.by || "System"}</p><p className="mt-1 text-sm font-black text-slate-800">{event.note || event.status}</p>{event.status && <p className="mt-1 text-xs font-semibold text-slate-500">Status: {event.status}</p>}</article>)}
      {!ordered.length && <p className="text-sm font-bold text-slate-500">Noch keine Ereignisse gespeichert.</p>}
    </div>
  </Card>;
}
