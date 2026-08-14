import React from "react";
import { CalendarDays, ClipboardList, Contact, UsersRound } from "lucide-react";
import Card from "../Card";
import { Badge } from "../CheckItem";
import SectionTitle from "../SectionHeader";
import OrderOpenItems from "./OrderOpenItems";
import OrderProgress from "./OrderProgress";
import OrderQuickActions from "./OrderQuickActions";
import { normalizeOrderStatus } from "../../data/orders";

function DataCard({ icon: Icon, title, rows }) {
  return <div className="rounded-3xl bg-slate-50 p-4"><div className="flex items-center gap-2"><Icon size={18} /><h3 className="font-black">{title}</h3></div><div className="mt-3 space-y-2">{rows.map((row) => <div key={row.label} className="flex items-start justify-between gap-3 text-sm"><span className="text-slate-500">{row.label}</span><strong className="max-w-[65%] text-right">{row.value || "–"}</strong></div>)}</div></div>;
}

export default function OrderOverview({ canOpen, onOpen, openItems, order, progressItems, teamMembers = [] }) {
  return <div className="space-y-5"><Card><SectionTitle icon={ClipboardList} title="Baustellenübersicht" subtitle="Die wichtigsten Informationen und nächsten Schritte auf einen Blick." />
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><DataCard icon={ClipboardList} title="Auftrag" rows={[{ label: "Status", value: normalizeOrderStatus(order.status) }, { label: "Priorität", value: order.priority }, { label: "Art", value: order.orderType }]} /><DataCard icon={Contact} title="Kunde" rows={[{ label: "Ansprechpartner", value: order.contact }, { label: "Telefon", value: order.phone }, { label: "E-Mail", value: order.email }, { label: "Adresse", value: order.address }]} /><DataCard icon={UsersRound} title="Team" rows={teamMembers.length ? teamMembers.slice(0, 4).map((person) => ({ label: person.roleLabel, value: person.name })) : [{ label: "Zuweisung", value: order.assignedTo || "noch offen" }]} /><DataCard icon={CalendarDays} title="Termin" rows={[{ label: "Datum", value: order.date }, { label: "Uhrzeit", value: order.time }, { label: "Einbauart", value: order.installType }]} /></div>
    <div className="mt-5"><OrderProgress items={progressItems} /></div>
  </Card>
  <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]"><Card><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-black">Offene Punkte</h2><Badge>{openItems.length}</Badge></div><OrderOpenItems items={openItems} onOpen={onOpen} /></Card><Card><h2 className="mb-3 text-lg font-black">Schnellaktionen</h2><OrderQuickActions address={order.address} canOpen={canOpen} onOpen={onOpen} phone={order.phone} /></Card></div>
  </div>;
}
