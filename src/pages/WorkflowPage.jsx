import React from "react";
import { Archive, ArrowRight, BriefcaseBusiness, CheckCircle2, Circle, ClipboardList, Plus } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import SectionTitle from "../components/SectionHeader";
import { allProductTypes } from "../data/products";

function currentStageIndex(status = "") {
  const normalized = String(status).toLowerCase();
  if (normalized.includes("archiv")) return 5;
  if (normalized.includes("abgerechnet") || normalized.includes("erledigt")) return 4;
  if (normalized.includes("nacharbeit") || normalized.includes("abschluss")) return 3;
  if (normalized.includes("arbeit") || normalized.includes("teil")) return 2;
  if (normalized.includes("geplant")) return 1;
  return 0;
}

export default function WorkflowPage({
  archiveSelectedOrder,
  canOpenModule,
  createOrderFromWorkflowTemplate,
  createReworkOrder,
  currentOrderHistory,
  duplicateSelectedOrder,
  orderWorkflowTemplates,
  selectedOrder,
  selectedProduct,
  selectedWorkflowTemplate,
  setActive,
  setWorkflowTemplateId,
  workflowStages,
  workflowTemplateId,
}) {
  const activeStage = currentStageIndex(selectedOrder?.status);

  const runAction = (action) => {
    if (action.id === "rework") createReworkOrder();
    else if (action.id === "archive") archiveSelectedOrder();
    else if (action.module) setActive(action.module);
  };

  if (!selectedOrder) {
    return <Card><div className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-600">Bitte zuerst einen Auftrag auswählen.</div></Card>;
  }

  return <div className="space-y-5">
    <Card>
      <SectionTitle icon={ClipboardList} title="Auftrags-Workflow" subtitle="Vom ersten Kundenwunsch bis zum Archiv – in sechs verständlichen Schritten." />
      <div className="rounded-3xl bg-slate-950 p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-wide text-white/60">Aktiver Auftrag</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-xl font-black">{selectedOrder.id} · {selectedOrder.customer}</h2><p className="mt-1 text-sm text-white/70">{selectedProduct.name} · {selectedOrder.address || "Adresse noch offen"}</p></div>
          <Badge>Aktuell: {workflowStages[activeStage].title}</Badge>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto pb-2">
        <div className="grid min-w-[760px] grid-cols-6 gap-2">
          {workflowStages.map((stage, index) => {
            const completed = index < activeStage;
            const current = index === activeStage;
            return <div key={stage.id} className="relative">
              <div className={`rounded-2xl border p-3 ${current ? "border-slate-950 bg-slate-950 text-white" : completed ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-white text-slate-500"}`}>
                <div className="flex items-center gap-2">{completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}<span className="text-xs font-black">{index + 1}</span></div>
                <p className="mt-2 text-xs font-black leading-4">{stage.title}</p>
                {current && <p className="mt-1 text-[10px] font-bold text-white/60">aktueller Schritt</p>}
              </div>
              {index < workflowStages.length - 1 && <ArrowRight size={15} className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white text-slate-400" />}
            </div>;
          })}
        </div>
      </div>
    </Card>

    <Card>
      <SectionTitle icon={BriefcaseBusiness} title={`Aktueller Schritt: ${workflowStages[activeStage].title}`} subtitle={workflowStages[activeStage].text} />
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {workflowStages[activeStage].actions.map((action) => {
          const allowed = !action.module || canOpenModule(action.module);
          return <button key={action.id} type="button" disabled={!allowed} onClick={() => runAction(action)} title={allowed ? "" : "Für Ihre Rolle nicht freigegeben"} className={`rounded-2xl px-4 py-3 text-sm font-black ${allowed ? "bg-slate-950 text-white" : "cursor-not-allowed bg-slate-100 text-slate-400"}`}>{action.label}</button>;
        })}
      </div>
    </Card>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {workflowStages.map((stage, index) => <Card key={stage.id}>
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase text-slate-500">Schritt {index + 1}</p><h2 className="mt-1 text-lg font-black">{stage.title}</h2></div>{index === activeStage && <Badge>aktuell</Badge>}</div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{stage.text}</p>
        <div className="mt-4 grid gap-2">
          {stage.actions.map((action) => {
            const allowed = !action.module || canOpenModule(action.module);
            return <button key={action.id} type="button" disabled={!allowed} onClick={() => runAction(action)} className={`rounded-xl px-3 py-2 text-left text-xs font-black ${allowed ? index === activeStage ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700" : "cursor-not-allowed bg-slate-50 text-slate-400"}`}>{action.label}{!allowed ? " · nicht freigegeben" : ""}</button>;
          })}
        </div>
      </Card>)}
    </div>

    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <SectionTitle icon={Plus} title="Auftrag aus Vorlage starten" subtitle="Typischen Auftrag anlegen und anschließend über die Schrittleiste bearbeiten." />
        <select value={workflowTemplateId} onChange={(event) => setWorkflowTemplateId(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold">{orderWorkflowTemplates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}</select>
        <div className="mt-4 rounded-3xl bg-slate-50 p-4"><h3 className="font-black">{selectedWorkflowTemplate.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{selectedWorkflowTemplate.notes}</p><div className="mt-3 flex flex-wrap gap-2"><Badge>{selectedWorkflowTemplate.orderType}</Badge><Badge>{allProductTypes.find((product) => product.id === selectedWorkflowTemplate.product)?.name || selectedWorkflowTemplate.product}</Badge></div></div>
        <button type="button" onClick={createOrderFromWorkflowTemplate} className="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">Vorlage als neuen Auftrag anlegen</button>
      </Card>

      <Card>
        <SectionTitle icon={Archive} title="Weitere Auftragsaktionen" subtitle="Seltenere Aktionen bleiben erreichbar, ohne den Ablauf unübersichtlich zu machen." />
        <div className="grid gap-2 sm:grid-cols-2"><button type="button" onClick={duplicateSelectedOrder} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold">Auftrag duplizieren</button><button type="button" onClick={archiveSelectedOrder} className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">Auftrag archivieren</button></div>
        <details className="mt-4 rounded-2xl bg-slate-50 p-4"><summary className="cursor-pointer text-sm font-black">Bisheriger Verlauf</summary><div className="mt-3 space-y-2">{currentOrderHistory.map((entry, index) => <div key={`${entry.at}-${index}`} className="rounded-2xl bg-white p-3 text-sm"><strong>{entry.status}</strong><p className="mt-1 text-xs text-slate-500">{entry.at} · {entry.by} · {entry.note}</p></div>)}</div></details>
      </Card>
    </div>
  </div>;
}
