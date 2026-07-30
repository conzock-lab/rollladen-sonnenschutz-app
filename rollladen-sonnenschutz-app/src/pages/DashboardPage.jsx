import React from "react";
import { BriefcaseBusiness, CalendarDays, CheckCircle2, ChevronRight, GraduationCap, Home } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import SectionTitle from "../components/SectionHeader";
import { productTypes } from "../data/products";

export default function DashboardPage({ activeOrders, allowedNav, appRole, canOpenModule, company, learningDashboard = {}, openReports, orders, photos, roleHome, setActive, setSelectedOrderId, todaysOrders, visibleOrders }) {
  if (appRole === "kunde") {
    const sortedOrders = [...visibleOrders].sort((left, right) => `${left.date || ""} ${left.time || ""}`.localeCompare(`${right.date || ""} ${right.time || ""}`));
    const nextOrder = sortedOrders.find((order) => new Date(`${order.date || "1970-01-01"}T${order.time || "00:00"}`).getTime() >= Date.now());
    const confirmedAppointments = visibleOrders.filter((order) => order.customerConfirmed).length;

    return <div className="space-y-5">
      <Card>
        <SectionTitle icon={Home} title="Willkommen im Kundenportal" subtitle={`Ihre persönliche Übersicht bei ${company?.name || "Ihrem Fachbetrieb"}.`} />
        <button
          type="button"
          onClick={() => setActive("portal")}
          className="flex w-full items-center justify-between gap-4 rounded-3xl bg-slate-950 p-5 text-left text-white shadow-lg transition hover:-translate-y-0.5"
        >
          <span>
            <span className="block text-xs font-bold uppercase tracking-wide text-white/60">Direkt öffnen</span>
            <span className="mt-1 block text-xl font-black">Meine Termine & Aufträge</span>
            <span className="mt-1 block text-sm text-white/70">Termine, Status, Dokumente und Pflegehinweise ansehen.</span>
          </span>
          <ChevronRight className="shrink-0" size={26} />
        </button>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-4"><p className="text-3xl font-black">{visibleOrders.length}</p><p className="text-sm text-slate-600">meine Aufträge</p></div>
          <div className="rounded-3xl bg-emerald-50 p-4"><p className="text-3xl font-black text-emerald-900">{confirmedAppointments}</p><p className="text-sm text-emerald-800">Termine bestätigt</p></div>
          <div className="rounded-3xl bg-sky-50 p-4"><p className="text-3xl font-black text-sky-900">{nextOrder ? "1" : "0"}</p><p className="text-sm text-sky-800">nächster Termin</p></div>
        </div>
      </Card>
      <Card>
        <SectionTitle icon={CalendarDays} title="Nächster Termin" subtitle="Die vollständige Übersicht öffnen Sie über die Karte oben." />
        {nextOrder ? <button type="button" onClick={() => { setSelectedOrderId(nextOrder.id); setActive("portal"); }} className="w-full rounded-3xl bg-slate-50 p-5 text-left hover:bg-white hover:shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2"><strong>{nextOrder.date || "Termin offen"} {nextOrder.time || ""}</strong><Badge>{nextOrder.customerConfirmed ? "bestätigt" : nextOrder.status || "offen"}</Badge></div>
          <p className="mt-2 text-sm font-bold">{productTypes.find((product) => product.id === nextOrder.product)?.name || "Produkt"}</p>
          <p className="mt-1 text-sm text-slate-600">{nextOrder.address || "Adresse noch nicht hinterlegt"}</p>
        </button> : <div className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-600">{visibleOrders.length ? "Aktuell ist kein zukünftiger Termin eingetragen." : "Ihrem Kundenkonto ist noch kein Auftrag zugeordnet."}</div>}
      </Card>
    </div>;
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
