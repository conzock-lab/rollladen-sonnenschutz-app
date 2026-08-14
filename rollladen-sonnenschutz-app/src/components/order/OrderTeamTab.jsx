import React from "react";
import { UsersRound } from "lucide-react";
import Card from "../Card";
import { Badge } from "../CheckItem";
import SectionTitle from "../SectionHeader";

const ROLE_ORDER = ["vorarbeiter", "monteur", "azubi"];

export default function OrderTeamTab({ canManage, onAssignCustomer, onTogglePerson, order, people = [], roleLabel }) {
  const activeTeam = people.filter((person) => person.status === "aktiv" && ROLE_ORDER.includes(person.role));
  const customers = people.filter((person) => person.status === "aktiv" && person.role === "kunde");
  const assignedIds = order.assignedMemberIds || [];
  return <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
    <Card><SectionTitle icon={UsersRound} title="Eingeteiltes Team" subtitle={canManage ? "Aktive Personen der eigenen Firma zuweisen." : "Die Teamzuweisung ist für diese Rolle schreibgeschützt."} />
      <div className="space-y-5">{ROLE_ORDER.map((role) => { const rolePeople = activeTeam.filter((person) => person.role === role); return <section key={role}><div className="mb-2 flex items-center justify-between"><h3 className="font-black">{roleLabel(role)}</h3><Badge>{rolePeople.filter((person) => assignedIds.includes(person.id)).length} eingeteilt</Badge></div><div className="space-y-2">{rolePeople.map((person) => <label key={person.id} className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl p-3 text-sm font-bold ${assignedIds.includes(person.id) ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700"}`}><span><span className="block">{person.name}</span><span className="text-xs opacity-60">{person.team || "ohne Kolonne"}</span></span><input type="checkbox" disabled={!canManage} checked={assignedIds.includes(person.id)} onChange={() => onTogglePerson(person.id)} className="h-5 w-5 accent-emerald-400" /></label>)}{!rolePeople.length && <p className="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-400">Keine aktive Person vorhanden.</p>}</div></section>; })}</div>
    </Card>
    <Card><SectionTitle icon={UsersRound} title="Kundenverknüpfung" subtitle="Der verknüpfte Kunde sieht ausschließlich freigegebene Portal-Daten." /><div className="space-y-2">{customers.map((person) => <button key={person.id} type="button" disabled={!canManage} onClick={() => onAssignCustomer(person.id)} className={`w-full rounded-2xl p-3 text-left text-sm font-bold ${order.customerPersonId === person.id ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700"}`}><span className="block">{person.name}</span><span className="mt-1 block text-xs opacity-60">{person.address || "Adresse offen"}</span></button>)}{!customers.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">Keine aktiven Kunden im Verzeichnis.</p>}</div></Card>
  </div>;
}
