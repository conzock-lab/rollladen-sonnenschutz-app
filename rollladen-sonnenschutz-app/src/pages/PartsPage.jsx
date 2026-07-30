import React from "react";
import { AlertTriangle, FileText, PackageSearch, Plus, Save } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import CopyBox from "../components/CopyBox";
import { Field, TextArea } from "../components/Field";
import { InlineProgress } from "../components/ModuleProgress";
import SectionTitle from "../components/SectionHeader";
import { allPartCatalog } from "../data/diagnosis";
import { PART_PHOTO_REQUIREMENTS, PART_PRODUCT_OPTIONS, PART_REQUEST_STATUSES } from "../lib/partsHelpers";

const statusStyles = {
  offen: "bg-slate-100 text-slate-700",
  angefragt: "bg-sky-100 text-sky-800",
  bestellt: "bg-violet-100 text-violet-800",
  geliefert: "bg-amber-100 text-amber-900",
  erledigt: "bg-emerald-100 text-emerald-800",
};

const orderProductLabels = {
  vorbaurollladen: "Rollladen",
  aufsatzrollladen: "Rollladen",
  markise: "Markise",
  raffstore: "Raffstore",
  zipscreen: "ZIP-Screen",
  insektenschutz: "Insektenschutz",
  rolltor: "Rolltor",
};

function SelectField({ label, value, onChange, children }) {
  return (
    <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-800">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium outline-none focus:border-slate-950">
        {children}
      </select>
    </label>
  );
}

export default function PartsPage({
  checkButton,
  filteredParts,
  loadPartRequestDraft,
  moduleChecks,
  newPartRequestDraft,
  orders,
  partGroup,
  partPhotoScope,
  partQuery,
  partRequest,
  partRequests,
  partRequestText,
  savePartRequestDraft,
  selectedOrder,
  setPartGroup,
  setPartQuery,
  setPartRequest,
  updatePartRequestStatus,
}) {
  const linkedOrder = orders.find((order) => order.id === partRequest.orderId) || selectedOrder;
  const photoProgressGroup = [{ scope: partPhotoScope, items: PART_PHOTO_REQUIREMENTS }];
  const photoDone = PART_PHOTO_REQUIREMENTS.filter((item) => moduleChecks?.[partPhotoScope]?.[item]).length;

  const selectOrder = (orderId) => {
    const order = orders.find((item) => item.id === orderId);
    setPartRequest({
      ...partRequest,
      orderId,
      customer: order?.customer || partRequest.customer,
      product: orderProductLabels[order?.product] || partRequest.product,
    });
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <SectionTitle icon={PackageSearch} title="Ersatzteil-Anfrage" subtitle="Anlagendaten erfassen, Pflichtfotos prüfen und einen professionellen Lieferantentext als Entwurf vorbereiten." />
          <div className="flex shrink-0 flex-wrap gap-2">
            <button onClick={newPartRequestDraft} className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black"><Plus size={17} />Neu</button>
            <button onClick={savePartRequestDraft} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"><Save size={17} />Entwurf speichern</button>
          </div>
        </div>

        <div className="mb-4 flex items-start gap-2 rounded-2xl bg-sky-50 p-4 text-xs font-bold leading-5 text-sky-900">
          <FileText size={17} className="mt-0.5 shrink-0" />Die App erzeugt nur einen kopierbaren Textentwurf. Es wird keine E-Mail oder Anfrage automatisch versendet.
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <SelectField label="Auftrag" value={partRequest.orderId || linkedOrder?.id || ""} onChange={selectOrder}>
            <option value="">Aktiven Auftrag verwenden</option>
            {orders.map((order) => <option key={order.id} value={order.id}>{order.id} · {order.customer}</option>)}
          </SelectField>
          <Field label="Kunde / Objekt" value={partRequest.customer || linkedOrder?.customer || ""} onChange={(customer) => setPartRequest({ ...partRequest, customer })} placeholder="Kunde oder Objekt" />
          <SelectField label="Produktart" value={partRequest.product} onChange={(product) => setPartRequest({ ...partRequest, product })}>{PART_PRODUCT_OPTIONS.map((product) => <option key={product}>{product}</option>)}</SelectField>
          <Field label="Hersteller" value={partRequest.manufacturer} onChange={(manufacturer) => setPartRequest({ ...partRequest, manufacturer })} placeholder="z. B. ROMA, Somfy, unbekannt" />
          <Field label="Bauteil" value={partRequest.part} onChange={(part) => setPartRequest({ ...partRequest, part })} placeholder="z. B. Endstab, Motoradapter, Sender" />
          <Field label="Baujahr, falls bekannt" value={partRequest.year} onChange={(year) => setPartRequest({ ...partRequest, year })} placeholder="z. B. 2018" />
          <Field label="Seriennummer" value={partRequest.serial} onChange={(serial) => setPartRequest({ ...partRequest, serial })} placeholder="Serien-/Auftragsnummer des Herstellers" />
          <Field label="Maße" value={partRequest.dimensions} onChange={(dimensions) => setPartRequest({ ...partRequest, dimensions })} placeholder="Länge × Breite × Höhe, Lochabstände ..." />
          <Field label="Farbe / Oberfläche" value={partRequest.color} onChange={(color) => setPartRequest({ ...partRequest, color })} placeholder="Farbton, RAL, Struktur" />
          <SelectField label="Seite links/rechts" value={partRequest.side} onChange={(side) => setPartRequest({ ...partRequest, side })}><option value="unbekannt">unbekannt</option><option value="links">links</option><option value="rechts">rechts</option><option value="beidseitig">beidseitig</option></SelectField>
          <Field label="Welle / Profil / Führung" value={partRequest.shaftProfileGuide} onChange={(shaftProfileGuide) => setPartRequest({ ...partRequest, shaftProfileGuide })} placeholder="z. B. SW60, Profilhöhe, Schienenmaß" />
          <Field label="Motor / Steuerung" value={partRequest.motorControl} onChange={(motorControl) => setPartRequest({ ...partRequest, motorControl })} placeholder="Typ, Nm, Funkfamilie, Sender" />
          <SelectField label="Dringlichkeit" value={partRequest.urgency} onChange={(urgency) => setPartRequest({ ...partRequest, urgency })}><option value="normal">normal</option><option value="dringend">dringend</option><option value="Anlage stillgelegt">Anlage stillgelegt</option></SelectField>
          <SelectField label="Status" value={partRequest.status || "offen"} onChange={(status) => setPartRequest({ ...partRequest, status })}>{PART_REQUEST_STATUSES.map((status) => <option key={status}>{status}</option>)}</SelectField>
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <TextArea label="Typenschilddaten" value={partRequest.nameplate} onChange={(nameplate) => setPartRequest({ ...partRequest, nameplate })} placeholder="Alle lesbaren Angaben zeilenweise übernehmen" />
          <TextArea label="Fehlerbeschreibung" value={partRequest.errorDescription} onChange={(errorDescription) => setPartRequest({ ...partRequest, errorDescription })} placeholder="Was passiert, seit wann, in welcher Fahrtrichtung, bereits geprüft ..." />
        </div>

        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h3 className="font-black">Pflichtfoto-Checkliste</h3><p className="mt-1 text-xs font-semibold text-slate-500">Entwürfe dürfen unvollständig bleiben; vor der Anfrage sollten alle fünf Nachweise geprüft sein.</p></div>
            <Badge>{photoDone}/5 vorhanden</Badge>
          </div>
          <InlineProgress moduleChecks={moduleChecks} groups={photoProgressGroup} label="Foto-Vollständigkeit" />
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-5">{PART_PHOTO_REQUIREMENTS.map((item) => checkButton(partPhotoScope, item))}</div>
          {photoDone < PART_PHOTO_REQUIREMENTS.length && <div className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-50 p-3 text-xs font-bold text-amber-900"><AlertTriangle size={16} className="shrink-0" />Noch {PART_PHOTO_REQUIREMENTS.length - photoDone} Pflichtfoto-Nachweis(e) offen.</div>}
        </div>

        <div className="mt-4"><CopyBox title="Lieferanten-/Herstelleranfrage kopieren" text={partRequestText} /></div>
      </Card>

      <Card>
        <SectionTitle icon={Save} title="Gespeicherte Entwürfe" subtitle="Lokal gespeicherte und einem Auftrag zugeordnete Ersatzteilanfragen." />
        <div className="overflow-x-auto rounded-3xl border border-slate-200">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Anfrage</th><th className="p-3">Auftrag/Kunde</th><th className="p-3">Bauteil</th><th className="p-3">Fotos</th><th className="p-3">Status</th><th className="p-3">Aktion</th></tr></thead>
            <tbody>
              {partRequests.map((request) => (
                <tr key={request.id} className="border-t border-slate-100 align-top">
                  <td className="p-3"><p className="font-black">{request.id}</p><p className="mt-1 text-xs text-slate-500">{request.updatedAt || request.createdAt}</p></td>
                  <td className="p-3"><p className="font-bold">{request.orderId || "ohne Auftrag"}</p><p className="text-xs text-slate-500">{request.customer || "ohne Kunde"}</p></td>
                  <td className="p-3"><p className="font-bold">{request.part || "noch offen"}</p><p className="text-xs text-slate-500">{request.manufacturer || "Hersteller offen"} · {request.product}</p></td>
                  <td className="p-3"><Badge>{request.photoComplete ? "5/5 vollständig" : `${Object.values(request.photoChecklist || {}).filter(Boolean).length}/5`}</Badge></td>
                  <td className="p-3"><select value={request.status || "offen"} onChange={(event) => updatePartRequestStatus(request.id, event.target.value)} className={`rounded-xl px-3 py-2 text-xs font-black ${statusStyles[request.status] || statusStyles.offen}`}>{PART_REQUEST_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></td>
                  <td className="p-3"><button onClick={() => loadPartRequestDraft(request)} className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white">Öffnen</button></td>
                </tr>
              ))}
              {partRequests.length === 0 && <tr><td colSpan="6" className="p-8 text-center font-bold text-slate-500">Noch keine Ersatzteil-Anfrage gespeichert.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={PackageSearch} title="Bauteil-Katalog" subtitle="Typische Rückfragen prüfen und ein gefundenes Bauteil direkt in die Anfrage übernehmen." />
        <div className="mb-4 grid gap-3 md:grid-cols-[0.5fr_1fr]">
          <select value={partGroup} onChange={(event) => setPartGroup(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold"><option value="all">Alle Gruppen</option>{[...new Set(allPartCatalog.map((part) => part.group))].map((group) => <option key={group}>{group}</option>)}</select>
          <input value={partQuery} onChange={(event) => setPartQuery(event.target.value)} placeholder="SW60, Sender, Keder, Hochschiebesicherung ..." className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none" aria-label="Ersatzteil suchen" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredParts.map((part) => (
            <article key={`${part.group}-${part.name}`} className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-black">{part.name}</h3>
              <div className="mt-2 flex flex-wrap gap-2"><Badge>{part.group}</Badge><Badge>{part.product}</Badge></div>
              <p className="mt-4 text-xs font-bold uppercase text-slate-500">Vor Bestellung klären</p>
              <div className="mt-2 space-y-2">{part.asks.map((item) => checkButton(`ersatzteil-${part.name}`, item))}</div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{part.tip}</p>
              <button onClick={() => setPartRequest({ ...partRequest, part: part.name, product: part.product })} className="mt-3 w-full rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white">In Anfrage übernehmen</button>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
