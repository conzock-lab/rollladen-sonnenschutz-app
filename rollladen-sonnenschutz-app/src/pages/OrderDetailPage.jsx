import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, Camera, CheckCircle2, ClipboardCheck, ClipboardList, FileText, History, HelpCircle, LayoutDashboard, Layers, PackageSearch, Ruler, UsersRound } from "lucide-react";
import Card from "../components/Card";
import { Badge } from "../components/CheckItem";
import { Field, TextArea } from "../components/Field";
import SectionTitle from "../components/SectionHeader";
import OrderChecklist from "../components/order/OrderChecklist";
import OrderDetailsTab from "../components/order/OrderDetailsTab";
import OrderHeader from "../components/order/OrderHeader";
import OrderMeasurement from "../components/order/OrderMeasurement";
import OrderOverview from "../components/order/OrderOverview";
import OrderPhotos from "../components/order/OrderPhotos";
import OrderTabs from "../components/order/OrderTabs";
import OrderTeamTab from "../components/order/OrderTeamTab";
import OrderTimeline from "../components/order/OrderTimeline";
import { diagnosisOrderStatuses } from "../lib/diagnosisAssistant";

const TAB_DEFINITIONS = [
  { id: "overview", label: "Übersicht", icon: LayoutDashboard },
  { id: "details", label: "Details", icon: ClipboardList },
  { id: "team", label: "Team", icon: UsersRound },
  { id: "checklist", label: "Checkliste", icon: ClipboardCheck, module: "checklists" },
  { id: "measurement", label: "Aufmaß", icon: Ruler, module: "measurement" },
  { id: "photos", label: "Fotos", icon: Camera, module: "photos" },
  { id: "sketches", label: "Skizzen", icon: Layers, module: "knowledge" },
  { id: "diagnosis", label: "Diagnose", icon: HelpCircle, module: "diagnose" },
  { id: "parts", label: "Ersatzteile", icon: PackageSearch, module: "parts" },
  { id: "documents", label: "Dokumente", icon: FileText, module: "pdf" },
  { id: "completion", label: "Abschluss", icon: CheckCircle2, module: "closeOrder" },
  { id: "timeline", label: "Verlauf", icon: History },
];

const MODULE_TO_TAB = {
  orders: "details",
  planning: "team",
  checklists: "checklist",
  measurement: "measurement",
  photos: "photos",
  knowledge: "sketches",
  diagnose: "diagnosis",
  parts: "parts",
  pdf: "documents",
  closeOrder: "completion",
};

export default function OrderDetailPage({
  actions,
  canEditWork,
  canManage,
  canOpenModule,
  checklist,
  companyPeople,
  documents,
  measurement,
  openItems,
  order,
  panels,
  photos,
  product,
  progressItems,
  roleLabel,
  stages,
  syncStatus,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [diagnosisDraft, setDiagnosisDraft] = useState({ issue: "", steps: "", result: "", recommendation: "", status: "offen" });
  useEffect(() => { setActiveTab("overview"); setDiagnosisDraft({ issue: "", steps: "", result: "", recommendation: "", status: "offen" }); }, [order.id]);

  const tabs = useMemo(() => TAB_DEFINITIONS.filter((tab) => !tab.module || canOpenModule(tab.module)).map((tab) => ({
    ...tab,
    count: tab.id === "overview" ? openItems.length : tab.id === "parts" ? documents.openPartRequests.length : tab.id === "documents" ? documents.orderDocuments.length : undefined,
  })), [canOpenModule, documents.openPartRequests.length, documents.orderDocuments.length, openItems.length]);
  const visibleOpenItems = openItems.filter((item) => tabs.some((tab) => tab.id === item.tab));

  const teamMembers = (order.assignedMemberIds || []).map((id) => companyPeople.find((person) => person.id === id)).filter(Boolean).map((person) => ({ ...person, roleLabel: roleLabel(person.role) }));
  const teamLabel = teamMembers.map((person) => person.name).join(", ") || order.assignedTo || "Team offen";

  const openTarget = (target) => {
    const tab = MODULE_TO_TAB[target] || target;
    if (tabs.some((item) => item.id === tab)) setActiveTab(tab);
    else if (target) actions.navigate(target);
  };

  const saveDiagnosis = () => {
    if (!diagnosisDraft.issue.trim() && !diagnosisDraft.result.trim()) return;
    actions.saveDiagnosis(diagnosisDraft);
    setDiagnosisDraft({ issue: "", steps: "", result: "", recommendation: "", status: "offen" });
  };

  return <div className="min-w-0 space-y-4">
    <OrderHeader canOpenModule={canOpenModule} onArchive={actions.archive} onCreateRework={actions.createRework} onNavigate={openTarget} onStartParts={() => { actions.startPartRequest(false); setActiveTab("parts"); }} order={order} product={product} stages={stages} syncStatus={syncStatus} teamLabel={teamLabel} />
    <OrderTabs active={activeTab} onChange={setActiveTab} tabs={tabs} />

    {activeTab === "overview" && <div className="space-y-3"><OrderOverview canOpen={(target) => tabs.some((tab) => tab.id === target) || (["manufacturers", "motors"].includes(target) && canOpenModule(target))} onOpen={openTarget} openItems={visibleOpenItems} order={order} progressItems={progressItems} teamMembers={teamMembers} />{canOpenModule("learning") && <button type="button" onClick={actions.createLearningCase} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-sky-50 px-4 text-sm font-black text-sky-950"><BookOpen size={17} />Auftrag als technischen Lernfall verwenden</button>}</div>}
    {activeTab === "details" && <OrderDetailsTab canEditCore={canManage} canEditWork={canEditWork} onChange={actions.update} onProductChange={actions.updateProduct} onStatusChange={actions.updateStatus} order={order} />}
    {activeTab === "team" && <OrderTeamTab canManage={canManage} onAssignCustomer={actions.assignCustomer} onTogglePerson={actions.toggleAssignment} order={order} people={companyPeople} roleLabel={roleLabel} />}
    {activeTab === "checklist" && <OrderChecklist canEdit={canEditWork} checks={checklist.values} items={checklist.items} onProductChange={actions.updateProduct} onToggle={actions.toggleCheck} order={order} product={product} />}
    {activeTab === "measurement" && <OrderMeasurement canEdit={canEditWork} fields={measurement.fields} missing={measurement.missing} onChange={actions.setMeasurementField} order={order} product={product} values={measurement.values} />}
    {activeTab === "photos" && <OrderPhotos canEdit={canEditWork} onAnalyze={actions.analyzePhoto} onNoteChange={actions.updatePhotoNote} onUpload={actions.uploadPhoto} order={order} photoAnalyses={photos.analyses} photos={photos.values} />}
    {activeTab === "sketches" && panels.sketches}
    {activeTab === "diagnosis" && <div className="space-y-5"><Card><SectionTitle icon={HelpCircle} title="Diagnose zum Auftrag speichern" subtitle="Auftragsdaten werden in der geführten Diagnose darunter bereits berücksichtigt." /><details className="rounded-2xl bg-slate-50 p-4"><summary className="cursor-pointer text-xs font-black uppercase text-slate-500">Freie Diagnose-Notiz</summary><div className="mt-4 grid gap-3 md:grid-cols-2"><Field label="Fehlerbild" value={diagnosisDraft.issue} onChange={(issue) => setDiagnosisDraft({ ...diagnosisDraft, issue })} /><label className="block text-sm font-bold">Status<select value={diagnosisDraft.status} onChange={(event) => setDiagnosisDraft({ ...diagnosisDraft, status: event.target.value })} className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4">{diagnosisOrderStatuses.map((status) => <option key={status}>{status}</option>)}</select></label><TextArea label="Prüfschritte" value={diagnosisDraft.steps} onChange={(steps) => setDiagnosisDraft({ ...diagnosisDraft, steps })} /><TextArea label="Ergebnis" value={diagnosisDraft.result} onChange={(result) => setDiagnosisDraft({ ...diagnosisDraft, result })} /><TextArea label="Empfehlung" value={diagnosisDraft.recommendation} onChange={(recommendation) => setDiagnosisDraft({ ...diagnosisDraft, recommendation })} /></div><button type="button" onClick={saveDiagnosis} className="mt-3 min-h-12 w-full rounded-2xl bg-slate-950 px-4 text-sm font-black text-white">Freie Diagnose-Notiz speichern</button></details><div className="mt-4 grid gap-3 md:grid-cols-2">{(order.diagnoses || []).map((entry) => <article key={entry.id} className="rounded-2xl bg-slate-50 p-4"><div className="flex flex-wrap gap-2"><Badge>{entry.status || "offen"}</Badge><Badge>{entry.createdAt}</Badge><Badge>{entry.createdBy}</Badge></div><h3 className="mt-2 font-black">{entry.issue || "Diagnose"}</h3><p className="mt-2 text-sm font-bold text-slate-700">{entry.result || entry.recommendation}</p>{entry.recommendation && <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">Nächster Schritt: {entry.recommendation}</p>}{entry.openSteps?.length > 0 && <p className="mt-2 text-xs font-bold text-amber-700">Offen: {entry.openSteps.join(" · ")}</p>}</article>)}</div></Card>{panels.diagnosis}</div>}
    {activeTab === "parts" && <div className="space-y-3"><button type="button" onClick={() => actions.startPartRequest(false)} className="min-h-12 w-full rounded-2xl bg-slate-950 px-4 text-sm font-black text-white">Ersatzteil-Anfrage für {order.id} erstellen</button>{panels.parts}</div>}
    {activeTab === "documents" && <Card><SectionTitle icon={FileText} title="Dokumente des Auftrags" subtitle="Alle gespeicherten PDF-Metadaten mit Status an einer Stelle." /><div className="grid gap-3 md:grid-cols-2">{documents.orderDocuments.map((document) => <article key={document.id} className="rounded-3xl bg-slate-50 p-4"><div className="flex flex-wrap gap-2"><Badge>{document.template}</Badge><Badge>{document.status}</Badge></div><h3 className="mt-2 font-black">{document.fileName}</h3><p className="mt-1 text-xs font-bold text-slate-500">{document.createdAt}</p></article>)}{!documents.orderDocuments.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">Noch kein Dokument für diesen Auftrag.</p>}</div><button type="button" onClick={() => actions.navigate("pdf")} className="mt-4 min-h-12 w-full rounded-2xl bg-slate-950 px-4 text-sm font-black text-white">Neues Dokument erstellen</button></Card>}
    {activeTab === "completion" && panels.completion(openTarget)}
    {activeTab === "timeline" && <OrderTimeline events={order.statusHistory || []} />}
  </div>;
}
