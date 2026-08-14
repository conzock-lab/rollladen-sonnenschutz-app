import React, { useMemo, useState } from "react";
import { ClipboardList, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import { Field, TextArea } from "../components/Field";
import SectionTitle from "../components/SectionHeader";
import OrderDetailPage from "./OrderDetailPage";
import { ORDER_FILTERS, matchesOrderFilter, normalizeOrderStatus } from "../data/orders";
import { productTypes } from "../data/products";

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function OrdersPage({
  addOrder,
  canCreate,
  canManage,
  deleteSelectedOrder,
  detailProps,
  filteredOrders,
  newOrder,
  newOrderChecklistPreview,
  newOrderProduct,
  orderOpenCounts,
  orderSearch,
  selectedOrder,
  selectedOrderId,
  setNewOrder,
  setOrderSearch,
  setSelectedOrderId,
}) {
  const [filter, setFilter] = useState("all");
  const listedOrders = useMemo(() => filteredOrders.filter((order) => matchesOrderFilter(order, filter, todayIso())), [filter, filteredOrders]);

  return <div className="space-y-5">
    {canCreate && <details className="group rounded-[2rem] bg-white shadow-sm">
      <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 px-4 font-black md:px-6"><span className="flex items-center gap-2"><Plus size={20} />Neuen Auftrag anlegen</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 group-open:hidden">Formular öffnen</span></summary>
      <div className="border-t border-slate-100 p-4 md:p-6">
        <p className="mb-4 text-sm text-slate-600">Nach dem Speichern wird der Auftrag direkt als digitale Baustellenakte geöffnet.</p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><Field label="Kunde" value={newOrder.customer} onChange={(value) => setNewOrder({ ...newOrder, customer: value })} /><Field label="Ansprechpartner" value={newOrder.contact} onChange={(value) => setNewOrder({ ...newOrder, contact: value })} /><Field label="Telefon" value={newOrder.phone} onChange={(value) => setNewOrder({ ...newOrder, phone: value })} /><Field label="E-Mail" value={newOrder.email} onChange={(value) => setNewOrder({ ...newOrder, email: value })} /><Field label="Adresse" value={newOrder.address} onChange={(value) => setNewOrder({ ...newOrder, address: value })} /><Field label="Datum" type="date" value={newOrder.date} onChange={(value) => setNewOrder({ ...newOrder, date: value })} /><Field label="Uhrzeit" type="time" value={newOrder.time} onChange={(value) => setNewOrder({ ...newOrder, time: value })} /><Field label="Auftragsart" value={newOrder.orderType} onChange={(value) => setNewOrder({ ...newOrder, orderType: value })} /></div>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4"><label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Produkt<select value={newOrder.product} onChange={(event) => setNewOrder({ ...newOrder, product: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3">{productTypes.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label><label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">Untergrund<select value={newOrder.substrate} onChange={(event) => setNewOrder({ ...newOrder, substrate: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option>Beton</option><option>Lochstein</option><option>WDVS</option><option>Holz</option><option>Stahl</option><option>Klinker</option><option>Altbau-Mischmauerwerk</option></select></label><Field label="Antrieb" value={newOrder.drive} onChange={(value) => setNewOrder({ ...newOrder, drive: value })} /><Field label="Priorität" value={newOrder.priority} onChange={(value) => setNewOrder({ ...newOrder, priority: value })} /></div>
        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_0.7fr]"><TextArea label="Interne Notiz" value={newOrder.notes} onChange={(value) => setNewOrder({ ...newOrder, notes: value })} /><div className="rounded-3xl bg-slate-50 p-4"><p className="text-xs font-black uppercase text-slate-400">Automatische Checkliste</p><h3 className="mt-1 font-black">{newOrderProduct.name}</h3><p className="mt-2 text-sm text-slate-600">{newOrderChecklistPreview.length} passende Punkte werden vorbereitet.</p></div></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => addOrder(false)} className="min-h-12 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white">Auftrag speichern</button><button type="button" onClick={() => addOrder(true)} className="min-h-12 rounded-2xl bg-emerald-100 px-4 text-sm font-black text-emerald-900">Speichern & Checkliste öffnen</button></div>
      </div>
    </details>}

    <div className="grid items-start gap-5 xl:grid-cols-[330px_minmax(0,1fr)]">
      <Card className="xl:sticky xl:top-24">
        <SectionTitle icon={ClipboardList} title="Aufträge" subtitle="Baustelle auswählen und Akte öffnen." />
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"><Search size={18} /><input value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder="Nummer, Kunde, Adresse, Produkt" className="min-w-0 flex-1 text-sm outline-none" /></div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 xl:flex-wrap">{ORDER_FILTERS.map((item) => <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={`min-h-10 shrink-0 rounded-xl px-3 text-xs font-black ${filter === item.id ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`}>{item.label}</button>)}</div>
        <div className="mt-3 max-h-[58vh] space-y-2 overflow-y-auto pr-1">{listedOrders.map((order) => { const product = productTypes.find((item) => item.id === order.product); const openCount = orderOpenCounts[order.id] || 0; return <button key={order.id} type="button" onClick={() => setSelectedOrderId(order.id)} className={`w-full rounded-2xl border p-3 text-left ${selectedOrderId === order.id ? "border-slate-950 bg-white shadow-md" : "border-transparent bg-slate-50"}`}><div className="flex items-start justify-between gap-2"><strong>{order.id} · {order.customer}</strong><Badge>{openCount ? `${openCount} offen` : "bereit"}</Badge></div><p className="mt-1 text-xs font-semibold text-slate-500">{product?.name || order.product} · {order.date || "Termin offen"}</p><div className="mt-2 flex flex-wrap gap-2"><Badge>{normalizeOrderStatus(order.status)}</Badge><Badge>{order.priority || "normal"}</Badge></div><p className="mt-2 truncate text-xs font-bold text-slate-400">{order.assignedTo || "Team offen"}</p></button>; })}{!listedOrders.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">Keine Aufträge für diesen Filter.</p>}</div>
        {canManage && selectedOrder && <button type="button" onClick={deleteSelectedOrder} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 px-3 text-xs font-black text-rose-800"><Trash2 size={16} />Ausgewählten Auftrag löschen</button>}
      </Card>
      {selectedOrder ? <OrderDetailPage {...detailProps} /> : <Card><p className="text-sm font-bold text-slate-500">Bitte einen Auftrag auswählen.</p></Card>}
    </div>
  </div>;
}
