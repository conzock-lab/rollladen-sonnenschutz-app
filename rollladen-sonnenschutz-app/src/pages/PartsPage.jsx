import React, { useMemo, useState } from "react";
import { AlertTriangle, FileText, PackageSearch, Plus, Save, Search } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import CopyBox from "../components/CopyBox";
import { Field, TextArea } from "../components/Field";
import { InlineProgress } from "../components/ModuleProgress";
import SectionTitle from "../components/SectionHeader";
import NameplateAssistant from "../components/technical/NameplateAssistant";
import { allPartCatalog, getMissingPartDetails, partProductCategories, searchPartCandidates } from "../data/parts";
import { normalizePartRequestStatus, PART_PRODUCT_OPTIONS, PART_REQUEST_STATUSES } from "../lib/partsHelpers";

const PART_WORKFLOW_CHECKS = ["Teilgruppe identifiziert", "Hersteller geprüft", "Maße vorhanden", "Fotos vollständig", "Anfrage vorbereitet"];

const statusStyles = {
  entwurf: "bg-slate-100 text-slate-700",
  "anfrage vorbereitet": "bg-sky-100 text-sky-800",
  angefragt: "bg-blue-100 text-blue-800",
  rückfrage: "bg-amber-100 text-amber-900",
  bestellt: "bg-violet-100 text-violet-800",
  "liefertermin bekannt": "bg-indigo-100 text-indigo-800",
  geliefert: "bg-teal-100 text-teal-900",
  verbaut: "bg-emerald-100 text-emerald-800",
  erledigt: "bg-emerald-100 text-emerald-800",
};

function SelectField({ children, label, onChange, value }) {
  return <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-800">{label}<select value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium outline-none focus:border-slate-950">{children}</select></label>;
}

const productLabelById = { vorbaurollladen: "Rollladen", aufsatzrollladen: "Rollladen", markise: "Markise", raffstore: "Raffstore", zipscreen: "ZIP-Screen", screen_offen: "ZIP-Screen", insektenschutz: "Insektenschutz", rolltor: "Rolltor", garagentor_antrieb: "Rolltor" };

export default function PartsPage({
  checkButton,
  loadPartRequestDraft,
  mode = "search",
  moduleChecks,
  newPartRequestDraft,
  notes = {},
  onAnalyzeNameplate,
  onNoteChange,
  onSetOrderWaitingMaterial,
  onUse,
  orders,
  partPhotoRequirements,
  partPhotoScope,
  partQuery,
  partRequest,
  partRequests,
  partRequestText,
  savePartRequestDraft,
  selectedOrder,
  setMode,
  setPartQuery,
  setPartRequest,
  updatePartRequestStatus,
}) {
  const [searchOrderId, setSearchOrderId] = useState(selectedOrder?.id || "");
  const [productCategory, setProductCategory] = useState(selectedOrder ? productLabelById[selectedOrder.product] || "Alle" : "Alle");
  const [partCategory, setPartCategory] = useState("Alle");
  const [searchDetails, setSearchDetails] = useState({ manufacturer: selectedOrder?.manufacturer || "", motor: selectedOrder?.drive || "", control: "", profile: "", shaft: "", guide: "", color: "", side: "", dimensions: "", serial: selectedOrder?.serial || "" });
  const linkedOrder = orders.find((order) => order.id === partRequest.orderId) || selectedOrder;
  const selectedSearchOrder = orders.find((order) => order.id === searchOrderId) || selectedOrder;
  const queryWithDetails = [partQuery, ...Object.values(searchDetails)].filter(Boolean).join(" ");
  const candidates = useMemo(() => searchPartCandidates({ query: queryWithDetails, productCategory, partCategory, manufacturer: searchDetails.manufacturer, orderProductId: selectedSearchOrder?.product || "" }), [partCategory, productCategory, queryWithDetails, searchDetails.manufacturer, selectedSearchOrder?.product]);
  const photoProgressGroup = [{ scope: partPhotoScope, items: partPhotoRequirements }];
  const photoDone = partPhotoRequirements.filter((item) => moduleChecks?.[partPhotoScope]?.[item]).length;
  const workflowScope = `ersatzteil-workflow-${partRequest.draftKey || partRequest.id || linkedOrder?.id || "neu"}`;
  const activeRequestStatus = normalizePartRequestStatus(partRequest.status);
  const materialWaitingSuggested = ["Bestellt", "Liefertermin bekannt"].includes(activeRequestStatus) && linkedOrder && linkedOrder.status !== "Wartet auf Material";

  const selectOrderForRequest = (orderId) => {
    const order = orders.find((item) => item.id === orderId);
    setPartRequest({ ...partRequest, orderId, customer: order?.customer || partRequest.customer, product: productLabelById[order?.product] || partRequest.product, manufacturer: order?.manufacturer || partRequest.manufacturer, motor: order?.drive || partRequest.motor, motorControl: order?.drive || partRequest.motorControl, serial: order?.serial || partRequest.serial, nameplate: order?.nameplate || partRequest.nameplate });
  };

  const useCandidate = (candidate) => {
    setPartRequest({ ...partRequest, orderId: selectedSearchOrder?.id || partRequest.orderId, customer: selectedSearchOrder?.customer || partRequest.customer, product: candidate.productCategory, manufacturer: searchDetails.manufacturer || selectedSearchOrder?.manufacturer || partRequest.manufacturer, part: candidate.partCategory, requestedPart: candidate.partCategory, dimensions: searchDetails.dimensions || partRequest.dimensions, color: searchDetails.color || partRequest.color, profile: searchDetails.profile || partRequest.profile, shaft: searchDetails.shaft || partRequest.shaft, guide: searchDetails.guide || partRequest.guide, motor: searchDetails.motor || selectedSearchOrder?.drive || partRequest.motor, control: searchDetails.control || partRequest.control, side: searchDetails.side || partRequest.side, serial: searchDetails.serial || partRequest.serial, status: "Anfrage vorbereitet" });
    setMode?.("request");
    onUse?.({ type: "Ersatzteile", id: candidate.id, label: candidate.name, route: "parts" });
  };

  return <div className="space-y-5">
    <Card><SectionTitle icon={PackageSearch} title="Ersatzteil-Finder" subtitle="Erst mögliche Ersatzteilgruppen eingrenzen, dann einen professionellen Anfrageentwurf vorbereiten." />
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1"><button type="button" onClick={() => setMode?.("search")} className={`min-h-12 rounded-xl px-4 text-sm font-black ${mode === "search" ? "bg-white shadow" : "text-slate-500"}`}>Ersatzteil suchen</button><button type="button" onClick={() => setMode?.("request")} className={`min-h-12 rounded-xl px-4 text-sm font-black ${mode === "request" ? "bg-white shadow" : "text-slate-500"}`}>Anfrage erstellen</button></div>
      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900"><AlertTriangle size={17} className="mt-0.5 shrink-0" />Treffer sind mögliche Ersatzteilgruppen, keine Freigabe für ein konkretes Teil. Typenschild, Maße, Profil und Herstellerunterlagen vor Bestellung prüfen.</div>
    </Card>

    {mode === "search" && <>
      <Card><SectionTitle icon={Search} title="Ersatzteil suchen" subtitle="Auftragsdaten priorisieren Treffer; Detailfilter helfen bei Welle, Profil, Motor und Führung." />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><SelectField label="Auftrag" value={searchOrderId} onChange={(orderId) => { setSearchOrderId(orderId); const order = orders.find((item) => item.id === orderId); if (order) { setProductCategory(productLabelById[order.product] || "Alle"); setSearchDetails((current) => ({ ...current, manufacturer: order.manufacturer || "", motor: order.drive || "", serial: order.serial || "" })); } }}><option value="">Ohne Auftragsfilter</option>{orders.map((order) => <option key={order.id} value={order.id}>{order.id} · {order.customer}</option>)}</SelectField><SelectField label="Produkt" value={productCategory} onChange={setProductCategory}>{partProductCategories.map((item) => <option key={item}>{item}</option>)}</SelectField><SelectField label="Bauteilgruppe" value={partCategory} onChange={setPartCategory}><option>Alle</option>{[...new Set(allPartCatalog.map((item) => item.partCategory))].map((item) => <option key={item}>{item}</option>)}</SelectField><Field label="Hersteller" value={searchDetails.manufacturer} onChange={(manufacturer) => setSearchDetails({ ...searchDetails, manufacturer })} /></div>
        <div className="mt-3 flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4"><Search size={19} className="text-slate-400" /><input value={partQuery} onChange={(event) => setPartQuery(event.target.value)} placeholder="SW60 Mitnehmer, Gelenkarm, ZIP Führung, Aufzugsband ..." className="min-w-0 flex-1 text-sm font-bold outline-none" aria-label="Ersatzteilgruppen durchsuchen" /></div>
        <details className="mt-3 rounded-3xl bg-slate-50 p-4"><summary className="cursor-pointer text-sm font-black">Weitere Filter: Motor, Steuerung, Profil, Welle, Führung, Farbe, Seite, Maß, Seriennummer</summary><div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4"><Field label="Motor" value={searchDetails.motor} onChange={(motor) => setSearchDetails({ ...searchDetails, motor })} /><Field label="Steuerung" value={searchDetails.control} onChange={(control) => setSearchDetails({ ...searchDetails, control })} /><Field label="Profil" value={searchDetails.profile} onChange={(profile) => setSearchDetails({ ...searchDetails, profile })} /><Field label="Welle" value={searchDetails.shaft} onChange={(shaft) => setSearchDetails({ ...searchDetails, shaft })} /><Field label="Führung" value={searchDetails.guide} onChange={(guide) => setSearchDetails({ ...searchDetails, guide })} /><Field label="Farbe" value={searchDetails.color} onChange={(color) => setSearchDetails({ ...searchDetails, color })} /><Field label="Seite" value={searchDetails.side} onChange={(side) => setSearchDetails({ ...searchDetails, side })} /><Field label="Maß" value={searchDetails.dimensions} onChange={(dimensions) => setSearchDetails({ ...searchDetails, dimensions })} /><Field label="Seriennummer" value={searchDetails.serial} onChange={(serial) => setSearchDetails({ ...searchDetails, serial })} /></div></details>
      </Card>

      <Card><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-black">Mögliche Ersatzteilgruppen</h2><p className="mt-1 text-sm text-slate-500">Treffer nach vorhandenen Angaben und aktivem Auftrag.</p></div><Badge>{candidates.length}</Badge></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{candidates.slice(0, 30).map((candidate) => { const missing = getMissingPartDetails(candidate, searchDetails); return <article key={candidate.id} className="rounded-3xl bg-slate-50 p-5"><div className="flex flex-wrap gap-2"><Badge>{candidate.productCategory}</Badge><Badge>Mögliche Ersatzteilgruppe</Badge></div><h3 className="mt-3 font-black">{candidate.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{candidate.tip}</p><p className="mt-3 text-xs font-black uppercase text-slate-400">Zur Identifikation benötigt</p><div className="mt-2 flex flex-wrap gap-2">{candidate.requiredData.map((item) => <Badge key={item}>{item}</Badge>)}</div>{missing.length > 0 && <div className="mt-3 rounded-2xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">Weitere Angaben erforderlich: {missing.slice(0, 5).join(", ")}</div>}<button type="button" onClick={() => useCandidate(candidate)} className="mt-4 min-h-12 w-full rounded-2xl bg-slate-950 px-4 text-sm font-black text-white">In Anfrage übernehmen</button><label className="mt-3 block text-xs font-bold text-slate-500">Interne Notiz<textarea value={notes[`part:${candidate.id}`] || ""} onChange={(event) => onNoteChange?.(`part:${candidate.id}`, event.target.value)} className="mt-1 h-20 w-full resize-none rounded-xl border border-slate-200 bg-white p-2 text-xs" /></label></article>; })}{!candidates.length && <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-500">Keine passende Gruppe. Filter reduzieren oder Anfrage mit „Bauteil noch zu bestimmen“ vorbereiten.</p>}</div></Card>
    </>}

    {mode === "request" && <>
      <Card><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><SectionTitle icon={FileText} title="Ersatzteil-Anfrage erstellen" subtitle="Anlagendaten erfassen, passende Foto-Nachweise prüfen und nur einen kopierbaren Textentwurf erzeugen." /><div className="flex shrink-0 flex-wrap gap-2"><button type="button" onClick={newPartRequestDraft} className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-slate-100 px-4 text-xs font-black"><Plus size={17} />Neu</button><button type="button" onClick={savePartRequestDraft} className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-xs font-black text-white"><Save size={17} />Entwurf speichern</button></div></div>
        <div className="mb-4 rounded-2xl bg-sky-50 p-4 text-xs font-bold leading-5 text-sky-900">Die App erzeugt ausschließlich einen Entwurf. Es wird keine E-Mail oder Bestellung automatisch versendet.</div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"><SelectField label="Auftrag" value={partRequest.orderId || linkedOrder?.id || ""} onChange={selectOrderForRequest}><option value="">Aktiven Auftrag verwenden</option>{orders.map((order) => <option key={order.id} value={order.id}>{order.id} · {order.customer}</option>)}</SelectField><Field label="Kunde / Objekt" value={partRequest.customer || linkedOrder?.customer || ""} onChange={(customer) => setPartRequest({ ...partRequest, customer })} /><SelectField label="Produkt" value={partRequest.product} onChange={(product) => setPartRequest({ ...partRequest, product })}>{PART_PRODUCT_OPTIONS.map((item) => <option key={item}>{item}</option>)}</SelectField><Field label="Hersteller" value={partRequest.manufacturer} onChange={(manufacturer) => setPartRequest({ ...partRequest, manufacturer })} /><Field label="Bauteil / Gruppe" value={partRequest.part} onChange={(part) => setPartRequest({ ...partRequest, part })} /><Field label="Gewünschtes Ersatzteil" value={partRequest.requestedPart} onChange={(requestedPart) => setPartRequest({ ...partRequest, requestedPart })} /><Field label="Baujahr" value={partRequest.year} onChange={(year) => setPartRequest({ ...partRequest, year })} /><Field label="Seriennummer" value={partRequest.serial} onChange={(serial) => setPartRequest({ ...partRequest, serial })} /><Field label="Typ / Modell" value={partRequest.type} onChange={(type) => setPartRequest({ ...partRequest, type })} /><Field label="Maße" value={partRequest.dimensions} onChange={(dimensions) => setPartRequest({ ...partRequest, dimensions })} /><Field label="Farbe / Oberfläche" value={partRequest.color} onChange={(color) => setPartRequest({ ...partRequest, color })} /><Field label="Profil" value={partRequest.profile} onChange={(profile) => setPartRequest({ ...partRequest, profile })} /><Field label="Welle" value={partRequest.shaft} onChange={(shaft) => setPartRequest({ ...partRequest, shaft })} /><Field label="Führung" value={partRequest.guide} onChange={(guide) => setPartRequest({ ...partRequest, guide })} /><Field label="Motor" value={partRequest.motor} onChange={(motor) => setPartRequest({ ...partRequest, motor })} /><Field label="Steuerung" value={partRequest.control} onChange={(control) => setPartRequest({ ...partRequest, control })} /><SelectField label="Seite" value={partRequest.side} onChange={(side) => setPartRequest({ ...partRequest, side })}><option>unbekannt</option><option>links</option><option>rechts</option><option>beidseitig</option></SelectField><Field label="Anzahl" type="number" value={partRequest.quantity} onChange={(quantity) => setPartRequest({ ...partRequest, quantity })} /><SelectField label="Dringlichkeit" value={partRequest.urgency} onChange={(urgency) => setPartRequest({ ...partRequest, urgency })}><option>normal</option><option>dringend</option><option>Anlage sicher außer Betrieb</option></SelectField><SelectField label="Status" value={activeRequestStatus} onChange={(status) => setPartRequest({ ...partRequest, status })}>{PART_REQUEST_STATUSES.map((status) => <option key={status}>{status}</option>)}</SelectField></div>
        <div className="mt-3 grid gap-3 lg:grid-cols-2"><TextArea label="Typenschilddaten" value={partRequest.nameplate} onChange={(nameplate) => setPartRequest({ ...partRequest, nameplate })} placeholder="Nur abgelesene oder erkannte Angaben übernehmen" /><TextArea label="Fehlerbeschreibung" value={partRequest.errorDescription} onChange={(errorDescription) => setPartRequest({ ...partRequest, errorDescription })} placeholder="Fehlerbild, Prüfschritte und betroffene Baugruppe" /></div>
        <label className="mt-3 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold"><input type="checkbox" checked={Boolean(partRequest.includeAddress)} onChange={(event) => setPartRequest({ ...partRequest, includeAddress: event.target.checked })} className="mt-0.5 h-5 w-5" /><span>Adresse in Anfrage aufnehmen<span className="mt-1 block text-xs font-semibold text-slate-500">Nur aktivieren, wenn der Einsatzort für Identifikation oder Lieferung wirklich relevant ist.</span></span></label>
        <div className="mt-4"><NameplateAssistant onAnalyze={onAnalyzeNameplate} /></div>
        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-black">Passende Foto-Checkliste</h3><p className="mt-1 text-xs font-semibold text-slate-500">Je Produkt werden nur sinnvolle Nachweise angezeigt.</p></div><Badge>{photoDone}/{partPhotoRequirements.length}</Badge></div><InlineProgress moduleChecks={moduleChecks} groups={photoProgressGroup} label="Foto-Vollständigkeit" /><div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">{partPhotoRequirements.map((item) => checkButton(partPhotoScope, item))}</div></div>
        <div className="mt-4 rounded-3xl bg-slate-50 p-4"><h3 className="font-black">Arbeitsfortschritt</h3><InlineProgress moduleChecks={moduleChecks} groups={[{ scope: workflowScope, items: PART_WORKFLOW_CHECKS }]} /><div className="mt-3 grid gap-2 md:grid-cols-2">{PART_WORKFLOW_CHECKS.map((item) => checkButton(workflowScope, item))}</div></div>
        {materialWaitingSuggested && <button type="button" onClick={() => onSetOrderWaitingMaterial?.(linkedOrder.id)} className="mt-4 min-h-12 w-full rounded-2xl bg-amber-100 px-4 text-sm font-black text-amber-900">Auftrag auf „Wartet auf Material“ setzen</button>}
        <div className="mt-4"><CopyBox title="Lieferanten-/Herstelleranfrage kopieren" text={partRequestText} /></div>
      </Card>

      <Card><SectionTitle icon={Save} title="Gespeicherte Anfragen" subtitle="Lokal gespeichert, auftragsbezogen und über die bestehende Sync-Queue vorgemerkt." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{partRequests.map((request) => <article key={request.id} className="rounded-3xl bg-slate-50 p-4"><div className="flex flex-wrap gap-2"><Badge>{request.orderId || "ohne Auftrag"}</Badge><Badge>{normalizePartRequestStatus(request.status)}</Badge></div><h3 className="mt-3 font-black">{request.part || "Bauteil noch offen"}</h3><p className="mt-1 text-xs font-semibold text-slate-500">{request.manufacturer || "Hersteller offen"} · {request.product}</p><select value={normalizePartRequestStatus(request.status)} onChange={(event) => updatePartRequestStatus(request.id, event.target.value)} className={`mt-3 w-full rounded-xl px-3 py-2 text-xs font-black ${statusStyles[normalizePartRequestStatus(request.status).toLocaleLowerCase("de-DE")] || statusStyles.entwurf}`}>{PART_REQUEST_STATUSES.map((status) => <option key={status}>{status}</option>)}</select><button type="button" onClick={() => loadPartRequestDraft(request)} className="mt-3 min-h-11 w-full rounded-xl bg-slate-950 px-3 text-xs font-black text-white">Öffnen</button></article>)}{!partRequests.length && <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-500">Noch keine Anfrage gespeichert.</p>}</div></Card>
    </>}
  </div>;
}
