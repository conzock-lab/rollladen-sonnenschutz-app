import React from "react";
import { ClipboardList, Plus, Search } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import { Field, TextArea } from "../components/Field";
import OrderWorkflowBar from "../components/OrderWorkflowBar";
import SectionTitle from "../components/SectionHeader";
import { productTypes } from "../data/products";

export default function OrdersPage({
  addOrder,
  archiveSelectedOrder,
  canOpenModule,
  createReworkOrder,
  deleteSelectedOrder,
  filteredOrders,
  newOrder,
  newOrderChecklistPreview,
  newOrderProduct,
  orderSearch,
  selectedOrder,
  selectedOrderId,
  setActive,
  setNewOrder,
  setOrderSearch,
  setSelectedOrderId,
  startPartRequest,
  updateSelectedOrder,
  updateSelectedOrderProduct,
  workflowStages,
}) {
  return <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
    <Card>
      <SectionTitle icon={Plus} title="Auftrag anlegen" subtitle="Der Auftrag ist der Mittelpunkt: Fotos, Checklisten, Protokolle und Berichte werden damit verbunden." />
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Kunde" value={newOrder.customer} onChange={(value) => setNewOrder({ ...newOrder, customer: value })} />
          <Field label="Ansprechpartner" value={newOrder.contact} onChange={(value) => setNewOrder({ ...newOrder, contact: value })} />
          <Field label="Telefon" value={newOrder.phone} onChange={(value) => setNewOrder({ ...newOrder, phone: value })} />
          <Field label="E-Mail" value={newOrder.email} onChange={(value) => setNewOrder({ ...newOrder, email: value })} />
          <Field label="Adresse" value={newOrder.address} onChange={(value) => setNewOrder({ ...newOrder, address: value })} />
          <Field label="Monteur" value={newOrder.assignedTo} onChange={(value) => setNewOrder({ ...newOrder, assignedTo: value })} />
          <Field label="Datum" type="date" value={newOrder.date} onChange={(value) => setNewOrder({ ...newOrder, date: value })} />
          <Field label="Uhrzeit" type="time" value={newOrder.time} onChange={(value) => setNewOrder({ ...newOrder, time: value })} />
        </div>
        <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Produkt<select value={newOrder.product} onChange={(event) => setNewOrder({ ...newOrder, product: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3">{productTypes.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
        <div className="rounded-3xl border border-slate-100 bg-white p-4"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase text-slate-500">Checkliste wird automatisch gewählt</p><h3 className="mt-1 font-black">{newOrderProduct.name}</h3></div><Badge>{newOrderChecklistPreview.length} Punkte</Badge></div><div className="mt-3 grid gap-2">{newOrderChecklistPreview.slice(0, 5).map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-700">{item}</div>)}</div></div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Untergrund<select value={newOrder.substrate} onChange={(event) => setNewOrder({ ...newOrder, substrate: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option>Beton</option><option>Lochstein</option><option>WDVS</option><option>Holz</option><option>Stahl</option></select></label>
          <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Antrieb<select value={newOrder.drive} onChange={(event) => setNewOrder({ ...newOrder, drive: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option>Gurt</option><option>Kurbel</option><option>Tastermotor</option><option>Funkmotor</option><option>Solarmotor</option></select></label>
          <Field label="Priorität" value={newOrder.priority} onChange={(value) => setNewOrder({ ...newOrder, priority: value })} />
          <TextArea label="Notizen" value={newOrder.notes} onChange={(value) => setNewOrder({ ...newOrder, notes: value })} />
        </div>
        <div className="grid gap-3 md:grid-cols-2"><button onClick={() => addOrder(false)} className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Auftrag speichern</button><button onClick={() => addOrder(true)} className="w-full rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800">Speichern & Checkliste öffnen</button></div>
      </div>
    </Card>

    <Card>
      <SectionTitle icon={ClipboardList} title="Auftragsliste" subtitle="Auftrag auswählen, Ablauf sehen und die passende nächste Aktion starten." />
      {selectedOrder && <div className="mb-5 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase text-slate-500">Aktiven Auftrag bearbeiten</p>
        <OrderWorkflowBar canOpenModule={canOpenModule} onArchive={archiveSelectedOrder} onCreateRework={createReworkOrder} onNavigate={setActive} onStartParts={startPartRequest} order={selectedOrder} stages={workflowStages} />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="Kunde" value={selectedOrder.customer || ""} onChange={(value) => updateSelectedOrder({ customer: value })} />
          <Field label="Adresse" value={selectedOrder.address || ""} onChange={(value) => updateSelectedOrder({ address: value })} />
          <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Produkt<select value={selectedOrder.product} onChange={(event) => updateSelectedOrderProduct(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3">{productTypes.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
          <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Status<select value={selectedOrder.status || "offen"} onChange={(event) => updateSelectedOrder({ status: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option>offen</option><option>geplant</option><option>in Arbeit</option><option>wartet auf Teile</option><option>Abschluss</option><option>abgerechnet</option><option>erledigt</option></select></label>
          <TextArea label="Notizen" value={selectedOrder.notes || ""} onChange={(value) => updateSelectedOrder({ notes: value })} />
        </div>
        <button onClick={deleteSelectedOrder} className="mt-4 rounded-2xl bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">Auftrag löschen</button>
      </div>}
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"><Search size={18} /><input value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder="Auftrag suchen ..." className="w-full outline-none" /></div>
      <div className="space-y-3">{filteredOrders.map((order) => <button key={order.id} onClick={() => setSelectedOrderId(order.id)} className={`w-full rounded-3xl border p-4 text-left ${selectedOrderId === order.id ? "border-slate-950 bg-white shadow-md" : "border-slate-100 bg-slate-50"}`}><div className="flex items-center justify-between"><strong>{order.id} · {order.customer}</strong><Badge>{order.status}</Badge></div><p className="mt-1 text-sm text-slate-600">{order.address}</p><div className="mt-2 flex flex-wrap gap-2"><Badge>{productTypes.find((product) => product.id === order.product)?.name}</Badge><Badge>{order.priority}</Badge></div><p className="mt-2 text-xs text-slate-500">{order.notes}</p></button>)}</div>
    </Card>
  </div>;
}
