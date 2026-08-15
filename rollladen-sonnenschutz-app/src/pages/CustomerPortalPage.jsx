import React, { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Mail, MessageSquareText, Phone, RefreshCw } from "lucide-react";
import Card from "../components/Card";
import SectionTitle from "../components/SectionHeader";
import CustomerCareTips from "../components/customer/CustomerCareTips";
import CustomerDocuments from "../components/customer/CustomerDocuments";
import CustomerIssueForm from "../components/customer/CustomerIssueForm";
import CustomerMessageForm from "../components/customer/CustomerMessageForm";
import CustomerOrderCard from "../components/customer/CustomerOrderCard";
import CustomerOrderDetails from "../components/customer/CustomerOrderDetails";
import { getCustomerPortalState } from "../lib/customerPortal";

export default function CustomerPortalPage({
  company,
  currentCustomerOrders = [],
  customerDocuments = [],
  confirmCustomerAppointment,
  confirmCustomerApproval,
  confirmCustomerDocument,
  initialSection = "portal",
  offline,
  pendingSyncCount = 0,
  requestAppointmentChange,
  saveCustomerIssue,
  saveCustomerMessage,
  saveMaintenanceRequest,
  showNotice,
}) {
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [maintenanceOrder, setMaintenanceOrder] = useState(null);
  const [maintenanceForm, setMaintenanceForm] = useState({ preferredPeriod: "", message: "" });
  const selectedOrder = currentCustomerOrders.find((order) => order.id === selectedOrderId);
  const documentsForOrder = (orderId) => customerDocuments.filter((document) => document.orderId === orderId);
  const sortedOrders = useMemo(() => [...currentCustomerOrders].sort((left, right) => `${left.date || "9999"} ${left.time || ""}`.localeCompare(`${right.date || "9999"} ${right.time || ""}`)), [currentCustomerOrders]);
  const messages = currentCustomerOrders.flatMap((order) => getCustomerPortalState(order).messages.map((message) => ({ ...message, orderId: order.id })));
  const issues = currentCustomerOrders.flatMap((order) => getCustomerPortalState(order).issues.map((issue) => ({ ...issue, orderId: order.id })));

  useEffect(() => {
    setSelectedOrderId("");
  }, [initialSection]);

  const openMaintenance = (order) => {
    setMaintenanceOrder(order);
    setMaintenanceForm({ preferredPeriod: "", message: "" });
  };
  const submitMaintenance = () => {
    if (!maintenanceOrder || !maintenanceForm.preferredPeriod.trim()) return;
    saveMaintenanceRequest({ orderId: maintenanceOrder.id, product: maintenanceOrder.product, ...maintenanceForm });
    setMaintenanceOrder(null);
  };

  return <div className="space-y-4">
    {(offline || pendingSyncCount > 0) && <div role="status" className="rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-950">{offline ? "Offline verfügbar. Ihre Änderung wird synchronisiert, sobald wieder Internet verfügbar ist." : `${pendingSyncCount} Änderung${pendingSyncCount === 1 ? "" : "en"} wird noch sicher übertragen.`}</div>}

    {initialSection === "portal" && selectedOrder && <CustomerOrderDetails company={company} documents={documentsForOrder(selectedOrder.id)} onAcknowledgeDocument={confirmCustomerDocument} onApproval={confirmCustomerApproval} onBack={() => setSelectedOrderId("")} onConfirmAppointment={confirmCustomerAppointment} onIssue={saveCustomerIssue} onMessage={saveCustomerMessage} onRequestAppointment={requestAppointmentChange} order={selectedOrder} showNotice={showNotice} />}

    {initialSection === "portal" && !selectedOrder && <><Card><SectionTitle icon={BriefcaseBusiness} title="Meine Aufträge" subtitle="Nur Ihre eigenen Termine, Aufträge und freigegebenen Informationen." /><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-2xl bg-slate-50 p-3"><p className="text-2xl font-black">{currentCustomerOrders.filter((order) => !["Erledigt", "Archiviert"].includes(order.status)).length}</p><p className="text-xs font-bold text-slate-500">offen</p></div><div className="rounded-2xl bg-sky-50 p-3"><p className="text-2xl font-black text-sky-950">{currentCustomerOrders.filter((order) => order.date).length}</p><p className="text-xs font-bold text-sky-800">geplant</p></div><div className="rounded-2xl bg-amber-50 p-3"><p className="text-2xl font-black text-amber-950">{currentCustomerOrders.filter((order) => order.status === "In Arbeit").length}</p><p className="text-xs font-bold text-amber-800">in Arbeit</p></div><div className="rounded-2xl bg-emerald-50 p-3"><p className="text-2xl font-black text-emerald-950">{currentCustomerOrders.filter((order) => ["Erledigt", "Archiviert"].includes(order.status)).length}</p><p className="text-xs font-bold text-emerald-800">erledigt</p></div></div></Card><div className="grid gap-3 lg:grid-cols-2">{sortedOrders.map((order) => <CustomerOrderCard key={order.id} documentCount={documentsForOrder(order.id).length} onOpen={(item) => setSelectedOrderId(item.id)} order={order} />)}</div>{!sortedOrders.length && <Card><p className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-600">Aktuell keine offenen oder abgeschlossenen Aufträge für Ihr Kundenkonto.</p></Card>}</>}

    {initialSection === "customerDocuments" && <Card><SectionTitle icon={BriefcaseBusiness} title="Dokumente" subtitle="Nur vom Betrieb ausdrücklich für Sie freigegebene Dokumente." /><CustomerDocuments documents={customerDocuments} onAcknowledge={confirmCustomerDocument} /></Card>}

    {initialSection === "customerCare" && <Card><SectionTitle icon={RefreshCw} title="Pflege & Wartung" subtitle="Praxisnahe Hinweise passend zu Ihren Produkten. Herstellerangaben bleiben maßgeblich." /><CustomerCareTips onMaintenanceRequest={openMaintenance} orders={currentCustomerOrders} /></Card>}

    {initialSection === "customerContact" && <><Card><SectionTitle icon={MessageSquareText} title="Kontakt & Rückfragen" subtitle="Fragen und Meldungen werden Ihrem Auftrag zugeordnet – ohne automatische Nachricht oder Terminbuchung." /><div className="grid gap-3 sm:grid-cols-2">{company?.contactPhone && <a href={`tel:${company.contactPhone}`} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white"><Phone size={18} />Anrufen</a>}{company?.contactEmail && <a href={`mailto:${company.contactEmail}`} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-sky-100 px-4 text-sm font-black text-sky-950"><Mail size={18} />E-Mail</a>}</div>{!company?.contactPhone && !company?.contactEmail && <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">Kontaktdaten sind noch nicht hinterlegt. Sie können unten eine Rückfrage speichern.</p>}</Card><CustomerMessageForm onSubmit={saveCustomerMessage} orders={currentCustomerOrders} /><CustomerIssueForm onSubmit={saveCustomerIssue} orders={currentCustomerOrders} showNotice={showNotice} />{messages.length > 0 && <Card><h2 className="font-black">Meine Rückfragen</h2><div className="mt-3 space-y-2">{messages.map((message) => <article key={message.id} className="rounded-2xl bg-slate-50 p-3 text-sm"><div className="flex justify-between gap-2"><strong>{message.topic} · {message.orderId}</strong><span className="text-xs font-bold text-slate-500">{message.status}</span></div><p className="mt-2">{message.message}</p>{message.reply && <p className="mt-2 rounded-xl bg-emerald-50 p-3 font-bold text-emerald-950">Antwort: {message.reply}</p>}</article>)}</div></Card>}{issues.length > 0 && <Card><h2 className="font-black">Meine Meldungen</h2><div className="mt-3 space-y-2">{issues.map((issue) => <article key={issue.id} className="rounded-2xl bg-amber-50 p-3 text-sm"><div className="flex justify-between gap-2"><strong>{issue.category} · {issue.orderId}</strong><span className="text-xs font-bold">{issue.status}</span></div>{issue.reworkOrderId && <p className="mt-2 font-bold">Nacharbeit {issue.reworkOrderId} wurde vorbereitet.</p>}</article>)}</div></Card>}</>}

    {maintenanceOrder && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-2 sm:items-center" role="dialog" aria-modal="true"><div className="w-full max-w-lg rounded-[2rem] bg-white p-5"><h2 className="text-xl font-black">Wartung anfragen</h2><p className="mt-1 text-sm text-slate-600">Es wird nur eine Anfrage erstellt. Ein Termin wird nicht automatisch gebucht.</p><label className="mt-4 block text-sm font-bold">Gewünschter Zeitraum<input value={maintenanceForm.preferredPeriod} onChange={(event) => setMaintenanceForm({ ...maintenanceForm, preferredPeriod: event.target.value })} placeholder="z. B. Oktober oder vormittags" className="mt-1 min-h-12 w-full rounded-xl border border-slate-200 px-3" /></label><label className="mt-3 block text-sm font-bold">Nachricht<textarea value={maintenanceForm.message} onChange={(event) => setMaintenanceForm({ ...maintenanceForm, message: event.target.value })} className="mt-1 h-24 w-full resize-none rounded-xl border border-slate-200 p-3" /></label><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => setMaintenanceOrder(null)} className="min-h-12 rounded-xl bg-slate-100 font-black">Abbrechen</button><button type="button" disabled={!maintenanceForm.preferredPeriod.trim()} onClick={submitMaintenance} className="min-h-12 rounded-xl bg-slate-950 font-black text-white disabled:opacity-40">Anfrage speichern</button></div></div></div>}
  </div>;
}
