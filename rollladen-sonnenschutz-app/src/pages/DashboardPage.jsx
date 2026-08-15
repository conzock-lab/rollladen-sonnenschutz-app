import React from "react";
import { BriefcaseBusiness, CalendarDays, CheckCircle2, GraduationCap, Home } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import SectionTitle from "../components/SectionHeader";
import CustomerDashboard from "../components/customer/CustomerDashboard";
import { productTypes } from "../data/products";

export default function DashboardPage({ activeOrders, allowedNav, appRole, canOpenModule, company, currentUser, customerDocuments = [], learningDashboard = {}, openReports, orders, photos, planningSummary = {}, roleHome, setActive, setSelectedOrderId, todaysOrders, visibleOrders }) {
  if (appRole === "kunde") {
    return <CustomerDashboard customerName={currentUser?.name} documents={customerDocuments} onNavigate={setActive} orders={visibleOrders} />;
  }

  return <div className="space-y-5">
    <Card>
      <SectionTitle icon={Home} title={roleHome.title} subtitle={roleHome.subtitle} />
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{activeOrders.length}</p><p className="text-sm text-slate-600">aktive Aufträge</p></div>
        <div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{todaysOrders.length}</p><p className="text-sm text-slate-600">heute geplant</p></div>
        <div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{openReports.length}</p><p className="text-sm text-slate-600">offene Berichte</p></div>
        <div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{allowedNav.length}</p><p className="text-sm text-slate-600">verfügbare Bereiche</p></div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{roleHome.focus.map((item) => <div key={item} className="rounded-2xl bg-slate-950 p-4 text-sm font-bold text-white">{item}</div>)}</div>
    </Card>
    <Card>
      <SectionTitle icon={CalendarDays} title="Heute in der Einsatzplanung" subtitle="Baustellen, Teams, Materialprobleme und Nacharbeiten auf einen Blick." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        {[
          ["Geplant", planningSummary.plannedToday || 0],
          ["Aktive Monteure", planningSummary.activePeople || 0],
          ["Ungeplant", planningSummary.unplanned || 0],
          ["Materialprobleme", planningSummary.materialProblems || 0],
          ["Nacharbeiten", planningSummary.rework || 0],
          ["Abschluss offen", planningSummary.openClosures || 0],
        ].map(([label, value]) => <button key={label} type="button" onClick={() => setActive(canOpenModule("planning") ? "planning" : "today")} className="rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-white hover:shadow-md"><strong className="text-2xl">{value}</strong><span className="mt-1 block text-xs font-bold text-slate-500">{label}</span></button>)}
      </div>
    </Card>
    {appRole === "azubi" && <Card>
      <SectionTitle icon={GraduationCap} title="Mein Lernstand" subtitle="Offene und erledigte Module, Berichtsheft sowie die nächsten empfohlenen Themen." />
      <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{learningDashboard.open || 0}</p><p className="text-sm text-slate-600">offene Module</p></div>
        <div className="rounded-3xl bg-emerald-50 p-4"><p className="text-3xl font-black text-emerald-900">{learningDashboard.completed || 0}</p><p className="text-sm text-emerald-800">erledigte Module</p></div>
        <div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{learningDashboard.percent || 0}%</p><p className="text-sm text-slate-600">Lernfortschritt</p></div>
        <div className="rounded-3xl bg-amber-50 p-4"><p className="text-3xl font-black text-amber-900">{learningDashboard.openReports || 0}</p><p className="text-sm text-amber-800">offene Berichte</p></div>
      </div>
      <div className="mt-5 grid gap-2 md:grid-cols-3">
        {(learningDashboard.recommended || []).map((module) => <button key={module.id} onClick={() => setActive("learning")} className="rounded-2xl bg-slate-950 p-3 text-left text-sm font-bold text-white"><span className="block text-xs text-white/60">Empfohlen · {module.year}. Jahr</span><span className="mt-1 block">{module.title}</span></button>)}
        {(learningDashboard.recommended || []).length === 0 && <div className="rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-900">Aktueller Lernplan vollständig.</div>}
      </div>
    </Card>}
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <Card><SectionTitle icon={BriefcaseBusiness} title={appRole === "kunde" ? "Meine Aufträge" : appRole === "azubi" ? "Meine Baustellen & Lernen" : "Nächste Baustellen"} subtitle="Rollenabhängige Übersicht mit den wichtigsten nächsten Aktionen." />
        <div className="grid gap-3 md:grid-cols-2">{visibleOrders.slice(0, 4).map((o) => <button key={o.id} onClick={() => { setSelectedOrderId(o.id); setActive(appRole === "kunde" ? "portal" : "orders"); }} className="rounded-3xl bg-slate-50 p-4 text-left hover:bg-white hover:shadow-md"><div className="flex items-center justify-between"><strong>{o.id}</strong><Badge>{o.status}</Badge></div><p className="mt-2 font-bold">{o.customer}</p><p className="text-sm text-slate-600">{o.date} {o.time} · {o.address || "ohne Adresse"}</p><p className="mt-2 text-xs text-slate-500">{productTypes.find((p) => p.id === o.product)?.name}</p></button>)}</div>
        {visibleOrders.length === 0 && <div className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-600">Für diese Rolle sind noch keine passenden Aufträge zugewiesen.</div>}
      </Card>
      <Card><SectionTitle icon={CheckCircle2} title="Schnellaktionen" subtitle="Direkt in den passenden Arbeitsbereich springen." />
        <div className="grid gap-3 md:grid-cols-2">
          {canOpenModule("checklists") && <button onClick={() => setActive("checklists")} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold">Checkliste öffnen</button>}
          {canOpenModule("photos") && <button onClick={() => setActive("photos")} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold">Fotos ergänzen</button>}
          {canOpenModule("closeOrder") && <button onClick={() => setActive("closeOrder")} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold">Abschluss prüfen</button>}
          {canOpenModule("azubiPlan") && appRole === "azubi" && <button onClick={() => setActive("azubiPlan")} className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800">Lernplan öffnen</button>}
          {canOpenModule("portal") && appRole === "kunde" && <button onClick={() => setActive("portal")} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Kundenportal öffnen</button>}
          {canOpenModule("planning") && <button onClick={() => setActive("planning")} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Baustellen planen</button>}
          {canOpenModule("company") && <button onClick={() => setActive("company")} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold">Team verwalten</button>}
          {canOpenModule("pdf") && <button onClick={() => setActive("pdf")} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold">PDF vorbereiten</button>}
        </div>
      </Card>
    </div>
  </div>;
}
