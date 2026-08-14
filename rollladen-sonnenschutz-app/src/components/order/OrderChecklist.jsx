import React from "react";
import { ClipboardCheck } from "lucide-react";
import Card from "../Card";
import { Badge } from "../CheckItem";
import SectionTitle from "../SectionHeader";
import { productTypes } from "../../data/products";

const GROUPS = [
  { id: "preparation", label: "Vorbereitung", match: /(auftrag|maß|untergrund|kabelauslass|windlage|altanlage|entsorgung|bestand|dämm|konsolenposition|paketraum|öffnung|lichte)/i },
  { id: "electrics", label: "Elektrik / Steuerung", match: /(motor|antrieb|funk|sender|taster|drehrichtung|endlage|sensor|steuerung|windwächter|strom)/i },
  { id: "handover", label: "Kundenübergabe", match: /(kunde|erklärt|pflege|bedien|hinweis|notbedienung)/i },
  { id: "documentation", label: "Dokumentation", match: /(foto|dokument|protokoll|abdichtung)/i },
  { id: "inspection", label: "Prüfung", match: /(geprüft|getestet|lauf|rechtwinklig|revision|luftdicht|schließung)/i },
];

function groupItems(items) {
  const grouped = Object.fromEntries([...GROUPS.map((group) => [group.id, []]), ["installation", []]]);
  items.forEach((item) => {
    const group = GROUPS.find((candidate) => candidate.match.test(item));
    grouped[group?.id || "installation"].push(item);
  });
  return [
    { id: "preparation", label: "Vorbereitung", items: grouped.preparation },
    { id: "installation", label: "Montage", items: grouped.installation },
    { id: "electrics", label: "Elektrik / Steuerung", items: grouped.electrics },
    { id: "inspection", label: "Prüfung", items: grouped.inspection },
    { id: "handover", label: "Kundenübergabe", items: grouped.handover },
    { id: "documentation", label: "Dokumentation", items: grouped.documentation },
  ].filter((group) => group.items.length);
}

export default function OrderChecklist({ canEdit = true, checks = {}, items = [], onProductChange, onToggle, order, product }) {
  const done = items.filter((item) => checks[item]).length;
  const percent = items.length ? Math.round((done / items.length) * 100) : 0;
  const groups = groupItems(items);
  return <Card>
    <SectionTitle icon={ClipboardCheck} title="Auftrags-Checkliste" subtitle="Die Punkte werden aus Produkt, Untergrund, Antrieb, Einbauart und Windlage zusammengestellt." />
    <div className="mb-5 grid gap-4 rounded-3xl bg-slate-50 p-4 lg:grid-cols-[1fr_0.7fr]">
      <div><strong>{order?.id} · {product?.name}</strong><p className="mt-1 text-sm text-slate-600">{order?.customer}</p>{canEdit && <label className="mt-3 block text-sm font-bold">Produkt<select value={order?.product || ""} onChange={(event) => onProductChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3">{productTypes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}</div>
      <div className="rounded-2xl bg-white p-4"><div className="flex items-center justify-between text-sm font-black"><span>Fortschritt</span><span>{done}/{items.length}</span></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-950" style={{ width: `${percent}%` }} /></div><p className="mt-2 text-xs font-bold text-slate-500">{percent}% erledigt · Pflichtpunkte gekennzeichnet</p></div>
    </div>
    <div className="space-y-5">{groups.map((group) => <section key={group.id}><div className="mb-2 flex items-center justify-between"><h3 className="font-black">{group.label}</h3><Badge>{group.items.filter((item) => checks[item]).length}/{group.items.length}</Badge></div><div className="grid gap-2 md:grid-cols-2">{group.items.map((item) => <label key={item} className={`flex min-h-14 items-start gap-3 rounded-2xl p-3 text-sm font-bold ${checks[item] ? "bg-emerald-50 text-emerald-900" : "bg-slate-50 text-slate-700"}`}><input type="checkbox" disabled={!canEdit} checked={Boolean(checks[item])} onChange={() => onToggle(order?.id, item)} className="mt-0.5 h-5 w-5 shrink-0 accent-slate-950" /><span className="min-w-0 flex-1">{item}</span><span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-slate-500">Pflicht</span></label>)}</div></section>)}</div>
  </Card>;
}
