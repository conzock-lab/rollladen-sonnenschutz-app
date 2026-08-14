import React from "react";
import { ClipboardList } from "lucide-react";
import Card from "../Card";
import { Field, TextArea } from "../Field";
import SectionTitle from "../SectionHeader";
import { ORDER_STATUSES, normalizeOrderStatus } from "../../data/orders";
import { productTypes } from "../../data/products";

function SelectField({ disabled, label, onChange, options, value }) {
  return <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">{label}<select disabled={disabled} value={value || ""} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-medium disabled:bg-slate-100">{options.map((option) => { const entry = typeof option === "string" ? { value: option, label: option } : option; return <option key={entry.value} value={entry.value}>{entry.label}</option>; })}</select></label>;
}

export default function OrderDetailsTab({ canEditCore, canEditWork, onChange, onProductChange, onStatusChange, order }) {
  return <Card><SectionTitle icon={ClipboardList} title="Auftragsdetails" subtitle="Stammdaten, Montageangaben und getrennte Notizbereiche. Lokale Änderungen werden automatisch vorgemerkt." />
    <fieldset disabled={!canEditCore}>
      <h3 className="mb-3 font-black">Allgemein</h3><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Auftragsart" value={order.orderType || "Montage"} onChange={(value) => onChange({ orderType: value })} />
        <SelectField label="Produkt" value={order.product} onChange={onProductChange} options={productTypes.map((product) => ({ value: product.id, label: product.name }))} />
        <SelectField label="Status" value={normalizeOrderStatus(order.status)} onChange={onStatusChange} options={ORDER_STATUSES} />
        <SelectField label="Priorität" value={order.priority || "normal"} onChange={(value) => onChange({ priority: value })} options={["niedrig", "normal", "dringend"]} />
        <Field label="Datum" type="date" value={order.date || ""} onChange={(value) => onChange({ date: value })} />
        <Field label="Uhrzeit" type="time" value={order.time || ""} onChange={(value) => onChange({ time: value })} />
      </div>
      <h3 className="mb-3 mt-6 font-black">Kunde</h3><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"><Field label="Kunde" value={order.customer || ""} onChange={(value) => onChange({ customer: value })} /><Field label="Ansprechpartner" value={order.contact || ""} onChange={(value) => onChange({ contact: value })} /><Field label="Telefon" value={order.phone || ""} onChange={(value) => onChange({ phone: value })} /><Field label="E-Mail" value={order.email || ""} onChange={(value) => onChange({ email: value })} /><div className="md:col-span-2"><Field label="Adresse" value={order.address || ""} onChange={(value) => onChange({ address: value })} /></div></div>
      <h3 className="mb-3 mt-6 font-black">Montage</h3><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"><Field label="Hersteller" value={order.manufacturer || ""} onChange={(value) => onChange({ manufacturer: value })} placeholder="Hersteller, falls bekannt" /><SelectField label="Untergrund" value={order.substrate || "Beton"} onChange={(value) => onChange({ substrate: value })} options={["Beton", "Lochstein", "WDVS", "Holz", "Stahl", "Klinker", "Altbau-Mischmauerwerk"]} /><Field label="Antrieb" value={order.drive || ""} onChange={(value) => onChange({ drive: value })} /><SelectField label="Einbauart" value={order.installType || "Renovierung"} onChange={(value) => onChange({ installType: value })} options={["Renovierung", "Neubau", "Austausch", "Reparatur", "Wartung"]} /><SelectField label="Wind kritisch" value={order.windCritical ? "ja" : "nein"} onChange={(value) => onChange({ windCritical: value === "ja" })} options={[{ value: "nein", label: "nein" }, { value: "ja", label: "ja" }]} /><Field label="Besonderheiten" value={order.specialNotes || ""} onChange={(value) => onChange({ specialNotes: value })} /></div>
    </fieldset>
    <h3 className="mb-3 mt-6 font-black">Notizen</h3><div className="grid gap-3 lg:grid-cols-3"><fieldset disabled={!canEditCore}><TextArea label="Interne Notiz" value={order.internalNotes ?? order.notes ?? ""} onChange={(value) => onChange({ internalNotes: value, notes: value })} placeholder="Nur für interne Rollen sichtbar" /></fieldset><fieldset disabled={!canEditWork}><TextArea label="Monteur-Notiz" value={order.technicianNote || ""} onChange={(value) => onChange({ technicianNote: value })} placeholder="Hinweise von der Baustelle" /><TextArea label="Kundenhinweis" value={order.customerNote || ""} onChange={(value) => onChange({ customerNote: value })} placeholder="Freigegebener Hinweis für den Kunden" /></fieldset></div>
  </Card>;
}
