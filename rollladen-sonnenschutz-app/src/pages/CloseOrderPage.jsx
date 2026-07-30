import React from "react";
import { AlertTriangle, CheckCircle2, FileText, PackageSearch, RefreshCw } from "lucide-react";
import Card from "../components/Card";
import MiniCheck, { Badge } from "../components/CheckItem";
import SectionTitle from "../components/SectionHeader";

const actionLabels = {
  checklists: "Checkliste öffnen",
  photos: "Fotos ergänzen",
  orders: "Auftrag ergänzen",
  pdf: "PDF-Protokoll öffnen",
  parts: "Ersatzteil-Anfrage starten",
  rework: "Nacharbeitsauftrag erzeugen",
};

export default function CloseOrderPage({
  closeReady,
  closingGroups,
  closingValues,
  completeSelectedOrder,
  createReworkOrder,
  missingClosingItems,
  openArea,
  selectedChecklistProgress,
  selectedOrder,
  selectedProduct,
  setQualityValue,
  startPartRequest,
  toggleQuality,
}) {
  if (!selectedOrder) {
    return <Card><div className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-600">Bitte zuerst einen Auftrag auswählen.</div></Card>;
  }

  const requiredItems = closingGroups.flatMap((group) => [
    ...group.items.filter((item) => item.required),
    ...(group.decision?.required ? [{ id: group.decision.id, done: Boolean(group.decision.value) }] : []),
  ]);
  const completedRequiredItems = requiredItems.filter((item) => item.done).length;
  const completionPercent = requiredItems.length ? Math.round((completedRequiredItems / requiredItems.length) * 100) : 0;
  const reworkNeeded = closingValues["rework-status"] === "needed";
  const partMissing = closingValues["parts-status"] === "missing";
  const hasPdfProtocol = closingGroups.some((group) => group.items.some((item) => item.id === "pdf-protocol" && item.done));
  const isCompleted = selectedOrder.status === "erledigt";

  const runItemAction = (action) => {
    if (action === "rework") createReworkOrder();
    else if (action === "parts") startPartRequest();
    else if (action) openArea(action);
  };

  return <div className="space-y-5">
    <Card>
      <SectionTitle icon={CheckCircle2} title="Auftrag abschließen" subtitle="Pflichtpunkte der Reihe nach prüfen. Der Auftrag kann erst vollständig abgeschlossen werden, wenn nichts Wesentliches mehr fehlt." />
      <div className="grid gap-3 md:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl bg-slate-950 p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-wide text-white/60">Aktiver Auftrag</p>
          <h2 className="mt-1 text-xl font-black">{selectedOrder.id} · {selectedOrder.customer}</h2>
          <p className="mt-2 text-sm text-white/70">{selectedProduct.name} · Status: {selectedOrder.status}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${completionPercent}%` }} /></div>
          <p className="mt-2 text-xs font-bold text-white/70">{completedRequiredItems}/{requiredItems.length} Pflichtpunkte erledigt</p>
        </div>
        <div className={`rounded-3xl p-5 ${closeReady ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>
          <p className="text-3xl font-black">{completionPercent}%</p>
          <p className="mt-1 text-sm font-bold">{closeReady ? "Abschluss vollständig" : `${missingClosingItems.length} Punkte fehlen`}</p>
          <p className="mt-3 text-xs">Produkt-Checkliste: {selectedChecklistProgress}%</p>
        </div>
      </div>
    </Card>

    <div className="grid gap-4 lg:grid-cols-2">
      {closingGroups.map((group) => {
        const requiredGroupItems = group.items.filter((item) => item.required);
        const groupDone = requiredGroupItems.every((item) => item.done) && (!group.decision?.required || Boolean(group.decision.value));
        const recommendedOpen = group.items.some((item) => item.recommended && !item.done);
        return <Card key={group.id}>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-black">{group.title}</h2>
            <Badge>{groupDone ? recommendedOpen ? "Pflicht erledigt" : "erledigt" : "prüfen"}</Badge>
          </div>
          <div className="mt-4 space-y-2">
            {group.items.map((item) => item.automatic ? <div key={item.id} className={`rounded-2xl p-3 ${item.done ? "bg-emerald-50 text-emerald-900" : item.required ? "bg-amber-50 text-amber-900" : "bg-slate-50 text-slate-700"}`}>
              <div className="flex items-start gap-3"><MiniCheck done={item.done} /><div className="min-w-0 flex-1"><p className="text-sm font-bold">{item.label}</p><p className="mt-1 text-xs opacity-70">{item.recommended ? "Empfohlen für die Dokumentation" : "Wird aus dem Auftrag geprüft"}</p></div></div>
              {!item.done && item.action && <button type="button" onClick={() => runItemAction(item.action)} className="mt-3 w-full rounded-xl bg-white px-3 py-2 text-xs font-black shadow-sm">{actionLabels[item.action]}</button>}
            </div> : <button key={item.id} type="button" onClick={() => toggleQuality(item.id)} className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left ${item.done ? "bg-emerald-50 text-emerald-900" : "bg-slate-50 text-slate-700"}`}><MiniCheck done={item.done} /><span className="text-sm font-bold">{item.label}</span></button>)}
          </div>
          {group.decision && <div className="mt-4 rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{group.decision.label}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">{group.decision.options.map((option) => {
              const selected = group.decision.value === option.value;
              return <button key={option.value} type="button" onClick={() => setQualityValue(group.decision.id, option.value)} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-black ${selected ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}><MiniCheck done={selected} />{option.label}</button>;
            })}</div>
          </div>}
        </Card>;
      })}
    </div>

    <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
      <Card>
        <SectionTitle icon={AlertTriangle} title="Fehlende Punkte" subtitle="Diese Pflichtpunkte verhindern aktuell den vollständigen Abschluss." />
        {missingClosingItems.length ? <div className="space-y-2">{missingClosingItems.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-900"><span>{item.label}</span>{item.action && item.action !== "closeOrder" && <button type="button" onClick={() => runItemAction(item.action)} className="rounded-xl bg-white px-3 py-2 text-xs font-black">{actionLabels[item.action] || "Öffnen"}</button>}</div>)}</div> : <div className="flex items-start gap-3 rounded-3xl bg-emerald-50 p-5 text-emerald-900"><CheckCircle2 className="shrink-0" /><div><p className="font-black">Alle Pflichtpunkte sind erledigt.</p><p className="mt-1 text-sm">Der Auftrag kann jetzt auf erledigt gesetzt werden.</p></div></div>}
      </Card>

      <Card>
        <SectionTitle icon={RefreshCw} title="Folgeaktionen" subtitle="Nur anzeigen, was für diesen Auftrag wirklich nötig ist." />
        <div className="space-y-2">
          {reworkNeeded && <div className="rounded-2xl bg-amber-50 p-3"><p className="text-sm font-black text-amber-900">Nacharbeit ist nötig.</p>{selectedOrder.reworkOrderId ? <p className="mt-1 text-xs text-amber-800">Auftrag {selectedOrder.reworkOrderId} wurde erzeugt.</p> : <button type="button" onClick={createReworkOrder} className="mt-2 w-full rounded-xl bg-amber-900 px-3 py-2 text-xs font-black text-white">Nacharbeitsauftrag erzeugen</button>}</div>}
          {partMissing && <div className="rounded-2xl bg-sky-50 p-3"><p className="text-sm font-black text-sky-900">Ein Ersatzteil fehlt.</p>{selectedOrder.partRequestStartedAt ? <p className="mt-1 text-xs text-sky-800">Ersatzteil-Anfrage wurde am {selectedOrder.partRequestStartedAt} gestartet.</p> : <button type="button" onClick={startPartRequest} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-900 px-3 py-2 text-xs font-black text-white"><PackageSearch size={16} />Ersatzteil-Anfrage starten</button>}</div>}
          {!reworkNeeded && !partMissing && <div className="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-600">Keine besondere Folgeaktion ausgewählt.</div>}
          <button type="button" onClick={() => openArea("pdf")} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black"><FileText size={18} />{hasPdfProtocol ? "PDF-Protokoll ansehen" : "PDF-Protokoll erstellen"}</button>
        </div>
      </Card>
    </div>

    {isCompleted && <div className="rounded-3xl bg-emerald-50 p-5 text-emerald-900"><p className="flex items-center gap-2 text-lg font-black"><CheckCircle2 />Auftrag ist erledigt</p><p className="mt-2 text-sm">Der Status wurde gespeichert. {hasPdfProtocol ? "Das PDF-Protokoll ist bereits vorhanden." : "Als nächster Schritt empfiehlt sich das PDF-Protokoll."}</p>{!hasPdfProtocol && <button type="button" onClick={() => openArea("pdf")} className="mt-3 rounded-2xl bg-emerald-900 px-4 py-3 text-sm font-black text-white">PDF-Protokoll jetzt erstellen</button>}</div>}

    <button type="button" disabled={!closeReady || isCompleted} onClick={completeSelectedOrder} className={`w-full rounded-3xl px-5 py-4 text-sm font-black ${closeReady && !isCompleted ? "bg-slate-950 text-white" : "cursor-not-allowed bg-slate-200 text-slate-500"}`}>{isCompleted ? "Auftrag ist als erledigt markiert" : closeReady ? "Auftrag als erledigt markieren" : `Abschluss nicht möglich · ${missingClosingItems.length} Pflichtpunkte fehlen`}</button>
  </div>;
}
