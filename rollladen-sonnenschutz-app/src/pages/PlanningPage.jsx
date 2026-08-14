import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, Filter, PackageSearch, Plus, RotateCcw, Search } from "lucide-react";
import AbsenceManager from "../components/planning/AbsenceManager";
import AssignmentDialog from "../components/planning/AssignmentDialog";
import PlanningOrderCard from "../components/planning/PlanningOrderCard";
import PlanningToday from "../components/planning/PlanningToday";
import PlanningWeek from "../components/planning/PlanningWeek";
import TeamSchedule from "../components/planning/TeamSchedule";
import UnplannedOrders from "../components/planning/UnplannedOrders";
import { MATERIAL_STATUSES, PLANNING_ORDER_TYPES, PLANNING_PRIORITIES, canManageAbsences, canManagePlanning, getPlanningTabsForRole } from "../data/planning";
import { ORDER_STATUSES } from "../data/orders";
import { productTypes } from "../data/products";
import usePlanningData from "../hooks/usePlanningData";
import { dateKey } from "../lib/planning";

const emptyFilters = { search: "", team: "", person: "", status: "", orderType: "", product: "", priority: "", materialStatus: "" };

export default function PlanningPage({
  absences = [],
  appRole,
  currentPerson,
  initialTab = "today",
  offline,
  onCreateAbsence,
  onCreateLearningCase,
  onDeleteAbsence,
  onOpenOrder,
  onOpenOrderArea,
  onStartOrder,
  onUpdateOrder,
  orders = [],
  partRequests = [],
  pendingOrderIds = [],
  people = [],
  todayOnly = false,
}) {
  const tabs = getPlanningTabsForRole(appRole, todayOnly);
  const [activeTab, setActiveTab] = useState(tabs.some((tab) => tab.id === initialTab) ? initialTab : tabs[0]?.id || "today");
  const [selectedDate, setSelectedDate] = useState(dateKey());
  const [filters, setFilters] = useState(emptyFilters);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const canPlan = canManagePlanning(appRole);
  const canEditAbsences = canManageAbsences(appRole);
  const visiblePeople = useMemo(() => appRole === "vorarbeiter" && currentPerson?.team ? people.filter((person) => person.team === currentPerson.team || person.id === currentPerson.id) : people, [appRole, currentPerson, people]);
  const pendingSet = useMemo(() => new Set(pendingOrderIds), [pendingOrderIds]);
  const { conflicts, enrichedOrders, filteredOrders, nextOrder, reworkOrders, todayOrders, unplannedOrders, visibleOrders } = usePlanningData({ absences, currentPerson, filters, orders, partRequests, people: visiblePeople, role: appRole, selectedDate });
  const teams = [...new Set(visiblePeople.map((person) => person.team).filter(Boolean))];
  const conflictCount = Object.values(conflicts).filter((items) => items.length).length;
  const materialProblems = visibleOrders.filter((order) => ["fehlt", "wartet auf Lieferung", "teilweise vorhanden"].includes(order.materialStatus)).length;

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab)) setActiveTab(tabs[0]?.id || "today");
  }, [activeTab, tabs]);

  const saveAssignment = (orderId, changes) => {
    const names = changes.assignedMemberIds.map((id) => people.find((person) => person.id === id)?.name).filter(Boolean).join(", ");
    onUpdateOrder(orderId, { ...changes, assignedTo: names, status: changes.date ? "Geplant" : "Neu" }, "Baustellenplanung geändert");
    setEditingOrder(null);
  };
  const dragStart = (event, order) => event.dataTransfer.setData("text/plain", order.id);
  const dropOrder = (event, targetDate) => {
    const orderId = event.dataTransfer.getData("text/plain");
    if (orderId) onUpdateOrder(orderId, { date: targetDate, status: targetDate ? "Geplant" : "Neu" }, targetDate ? "Auftrag per Drag & Drop verschoben" : "Auftrag auf ungeplant gesetzt");
  };
  const cardPropsForOrder = (order) => ({
    canPlan,
    conflicts: conflicts[order.id] || [],
    currentRole: appRole,
    details: enrichedOrders[order.id] || {},
    onCreateLearningCase,
    onDragStart: dragStart,
    onMove: setEditingOrder,
    onOpen: onOpenOrder,
    onOpenArea: onOpenOrderArea,
    onStart: onStartOrder,
    people,
    productName: productTypes.find((product) => product.id === order.product)?.name || order.product,
    syncPending: offline || pendingSet.has(order.id),
  });

  if (!tabs.length) return <div className="rounded-[2rem] bg-white p-8 text-sm font-bold text-slate-500">Für diese Rolle ist die interne Baustellenplanung nicht freigegeben.</div>;

  return <div className="space-y-5">
    <section className="rounded-[2rem] bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div className="flex items-start gap-3"><span className="rounded-2xl bg-slate-950 p-3 text-white"><CalendarDays size={21} /></span><div><h1 className="text-2xl font-black">Baustellenplanung</h1><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">Tages- und Wochenplanung mit bestehenden Aufträgen, flexiblen Teams, Materialhinweisen und Abwesenheiten.</p></div></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><div className="rounded-2xl bg-slate-50 p-3"><strong className="text-2xl">{todayOrders.length}</strong><p className="text-xs font-bold text-slate-500">heute</p></div><button type="button" onClick={() => setActiveTab("unplanned")} disabled={!tabs.some((tab) => tab.id === "unplanned")} className="rounded-2xl bg-slate-50 p-3 text-left disabled:opacity-60"><strong className="text-2xl">{unplannedOrders.length}</strong><p className="text-xs font-bold text-slate-500">ungeplant</p></button><div className="rounded-2xl bg-amber-50 p-3"><strong className="text-2xl text-amber-900">{materialProblems}</strong><p className="text-xs font-bold text-amber-800">Material</p></div><div className="rounded-2xl bg-rose-50 p-3"><strong className="text-2xl text-rose-900">{conflictCount}</strong><p className="text-xs font-bold text-rose-800">Warnungen</p></div></div></div>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">{tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`min-h-11 shrink-0 rounded-xl px-4 text-xs font-black ${activeTab === tab.id ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`}>{tab.label}</button>)}</div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row"><label className="flex min-h-12 flex-1 items-center gap-2 rounded-xl border border-slate-200 px-4"><Search size={17} /><input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Auftragsnummer, Kunde, Ort, Monteur, Produkt" className="min-w-0 flex-1 text-sm outline-none" /></label><button type="button" onClick={() => setShowFilters((value) => !value)} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-black"><Filter size={17} />Filter</button><button type="button" onClick={() => setFilters(emptyFilters)} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-black"><RotateCcw size={17} />Zurücksetzen</button></div>
      {showFilters && <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{[
        ["team", "Team", teams],
        ["person", "Person", visiblePeople.filter((person) => person.role !== "kunde").map((person) => ({ value: person.id, label: person.name }))],
        ["status", "Status", ORDER_STATUSES],
        ["orderType", "Auftragsart", PLANNING_ORDER_TYPES],
        ["product", "Produkt", productTypes.map((product) => ({ value: product.id, label: product.name }))],
        ["priority", "Priorität", PLANNING_PRIORITIES],
        ["materialStatus", "Materialstatus", MATERIAL_STATUSES],
      ].map(([key, label, options]) => <label key={key} className="text-xs font-black text-slate-500">{label}<select value={filters[key]} onChange={(event) => setFilters({ ...filters, [key]: event.target.value })} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"><option value="">Alle</option>{options.map((option) => { const value = typeof option === "string" ? option : option.value; const text = typeof option === "string" ? option : option.label; return <option key={value} value={value}>{text}</option>; })}</select></label>)}</div>}
      {offline && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-900">Offline: Planung bleibt lesbar. Änderungen werden lokal gespeichert und zur Synchronisierung vorgemerkt.</p>}
    </section>

    {activeTab === "today" && <PlanningToday cardPropsForOrder={cardPropsForOrder} nextOrder={nextOrder} onDateChange={setSelectedDate} orders={todayOrders} people={visiblePeople} selectedDate={selectedDate} />}
    {activeTab === "week" && <PlanningWeek canPlan={canPlan} cardPropsForOrder={cardPropsForOrder} onDateChange={setSelectedDate} onDropOrder={dropOrder} orders={filteredOrders} selectedDate={selectedDate} />}
    {activeTab === "unplanned" && <UnplannedOrders cardPropsForOrder={cardPropsForOrder} orders={unplannedOrders} />}
    {activeTab === "teams" && <TeamSchedule absences={absences} orders={filteredOrders} people={visiblePeople} selectedDate={selectedDate} />}
    {activeTab === "absences" && <AbsenceManager absences={absences} canManage={canEditAbsences} onCreate={onCreateAbsence} onDelete={onDeleteAbsence} people={people} />}
    {activeTab === "rework" && <div className="space-y-4"><section className="rounded-[2rem] bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="rounded-2xl bg-slate-950 p-3 text-white"><PackageSearch size={20} /></span><div><h2 className="text-xl font-black">Nacharbeiten</h2><p className="text-sm text-slate-600">Nacharbeitsaufträge bleiben mit ihrem ursprünglichen Auftrag verknüpft und werden hier nur eingeplant.</p></div></div></section><div className="grid gap-3 xl:grid-cols-2">{reworkOrders.map((order) => <PlanningOrderCard key={order.id} {...cardPropsForOrder(order)} order={order} />)}</div>{!reworkOrders.length && <div className="rounded-[2rem] bg-white p-8 text-center text-sm font-bold text-slate-500">Keine offenen Nacharbeiten.</div>}</div>}

    {canPlan && <div className="fixed bottom-24 right-4 z-30 sm:bottom-6 sm:right-6"><button type="button" onClick={() => setActiveTab("unplanned")} className="flex min-h-14 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-xl"><Plus size={19} />Auftrag einplanen</button></div>}
    <AssignmentDialog absences={absences} onClose={() => setEditingOrder(null)} onSave={saveAssignment} open={Boolean(editingOrder)} order={editingOrder} people={people.filter((person) => person.role !== "kunde")} />
  </div>;
}
