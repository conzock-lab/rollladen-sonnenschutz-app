import React, { useMemo, useState } from "react";
import { Archive, Copy, Eye, EyeOff, FilePenLine, FilePlus2, FileText, Search } from "lucide-react";
import { Badge } from "../CheckItem";
import { DOCUMENT_STATUSES, DOCUMENT_TYPES } from "../../data/documentTemplates";

const tabs = [
  { id: "all", label: "Alle" },
  { id: "draft", label: "Entwürfe", statuses: ["Entwurf"] },
  { id: "created", label: "Erstellt", statuses: ["Erstellt", "Zur Freigabe", "Gesendet"] },
  { id: "released", label: "Freigegeben", statuses: ["Freigegeben"] },
  { id: "signed", label: "Unterschrieben", statuses: ["Unterschrieben"] },
  { id: "archived", label: "Archiviert", statuses: ["Archiviert"] },
];

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("de-DE") : value || "–";
};

function getDocumentSyncLabel(document, syncQueue, lastSyncedAt) {
  const related = syncQueue
    .filter((item) => item.recordId === document.id || item.data?.document?.id === document.id)
    .sort((left, right) => new Date(right.updatedAt || right.createdAt).getTime() - new Date(left.updatedAt || left.createdAt).getTime());
  const current = related[0];
  if (current?.status === "failed") return "Sync fehlgeschlagen";
  if (current?.status === "syncing") return "Synchronisierung läuft";
  if (current?.status === "pending") return "Wartet auf Sync";
  if (current?.status === "synced" || lastSyncedAt) return "Synchronisiert";
  return "Lokal gespeichert";
}

export default function DocumentLibrary({ canArchive, canCreate, canRelease, documents, lastSyncedAt, onArchive, onDuplicate, onNew, onOpen, onStatusChange, onVisibilityChange, orders, syncQueue = [] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ orderId: "", customer: "", type: "", status: "", period: "" });
  const customers = [...new Set(orders.map((order) => order.customer).filter(Boolean))].sort();
  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const filtered = useMemo(() => documents.filter((document) => {
    const order = orders.find((item) => item.id === document.orderId);
    const search = [document.documentNumber, document.fileName, document.title, document.type, document.orderId, document.customer, order?.customer].join(" ").toLocaleLowerCase("de-DE");
    const updated = new Date(document.updatedAt || document.createdAt).getTime();
    const periodStart = filters.period ? new Date(`${filters.period}-01T00:00:00`).getTime() : 0;
    const periodEnd = filters.period ? new Date(new Date(`${filters.period}-01T00:00:00`).setMonth(new Date(`${filters.period}-01T00:00:00`).getMonth() + 1)).getTime() : Infinity;
    return (!currentTab.statuses || currentTab.statuses.includes(document.status))
      && (!query.trim() || search.includes(query.trim().toLocaleLowerCase("de-DE")))
      && (!filters.orderId || document.orderId === filters.orderId)
      && (!filters.customer || (document.customer || order?.customer) === filters.customer)
      && (!filters.type || document.type === filters.type)
      && (!filters.status || document.status === filters.status)
      && (!filters.period || (updated >= periodStart && updated < periodEnd));
  }), [currentTab.statuses, documents, filters, orders, query]);

  return <div className="space-y-4">
    <div className="flex gap-2 overflow-x-auto pb-1">{tabs.map((tab) => { const count = documents.filter((document) => !tab.statuses || tab.statuses.includes(document.status)).length; return <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`min-h-11 shrink-0 rounded-full px-4 text-xs font-black ${activeTab === tab.id ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`}>{tab.label} · {count}</button>; })}</div>
    <div className="rounded-3xl border border-slate-200 bg-white p-4"><div className="flex min-h-12 items-center gap-2 rounded-2xl border border-slate-200 px-3"><Search size={18} className="text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Auftragsnummer, Kunde oder Dokumentname suchen" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none" /></div><div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5"><select value={filters.orderId} onChange={(event) => setFilters({ ...filters, orderId: event.target.value })} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="">Alle Aufträge</option>{orders.map((order) => <option key={order.id} value={order.id}>{order.id}</option>)}</select><select value={filters.customer} onChange={(event) => setFilters({ ...filters, customer: event.target.value })} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="">Alle Kunden</option>{customers.map((customer) => <option key={customer}>{customer}</option>)}</select><select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="">Alle Typen</option>{DOCUMENT_TYPES.map((type) => <option key={type}>{type}</option>)}</select><select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="">Alle Status</option>{DOCUMENT_STATUSES.map((status) => <option key={status}>{status}</option>)}</select><input type="month" value={filters.period} onChange={(event) => setFilters({ ...filters, period: event.target.value })} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm" /></div></div>
    {canCreate && <section className="rounded-3xl bg-slate-950 p-4 text-white"><p className="text-xs font-black uppercase text-white/50">Häufige Vorlagen</p><div className="mt-3 grid gap-2 sm:grid-cols-3">{["Montageprotokoll", "Aufmaßblatt", "Wartungsprotokoll"].map((type) => <button key={type} type="button" onClick={() => onNew(type)} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white/10 px-3 text-xs font-black hover:bg-white/20"><FilePlus2 size={16} />{type}</button>)}</div></section>}
    <div className="grid gap-3 lg:grid-cols-2">{filtered.map((document) => { const lockedForFieldRole = !canRelease && (document.customerVisible || ["Freigegeben", "Archiviert"].includes(document.status)); const canEditDocument = canCreate && !lockedForFieldRole; const statusOptions = canRelease ? DOCUMENT_STATUSES : DOCUMENT_STATUSES.filter((status) => !["Freigegeben", "Archiviert"].includes(status)); return <article key={document.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap gap-2"><Badge>{document.type}</Badge><Badge>{document.status}</Badge>{document.customerVisible && <Badge>Kunde sichtbar</Badge>}</div><h2 className="mt-3 truncate font-black">{document.title}</h2><p className="mt-1 truncate text-xs font-bold text-slate-500">{document.documentNumber || document.id} · Auftrag {document.orderId || "–"}</p></div><FileText className="shrink-0 text-slate-300" /></div><div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-3 text-xs"><p><strong>Version:</strong> {document.version}</p><p><strong>Geändert:</strong> {formatDate(document.updatedAt)}</p><p><strong>Unterschrift:</strong> {document.signedStatus}</p><p><strong>Sync:</strong> {getDocumentSyncLabel(document, syncQueue, lastSyncedAt)}</p></div>{canEditDocument ? <select value={document.status} onChange={(event) => onStatusChange(document.id, event.target.value)} className="mt-3 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold">{statusOptions.map((status) => <option key={status}>{status}</option>)}</select> : <p className="mt-3 rounded-xl bg-slate-50 px-3 py-3 text-sm font-bold">Status: {document.status}</p>}<div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"><button type="button" onClick={() => onOpen(document)} className="flex min-h-11 items-center justify-center gap-1 rounded-xl bg-slate-950 px-2 text-xs font-black text-white"><FilePenLine size={15} />{canEditDocument ? "Öffnen" : "Anzeigen"}</button>{canCreate && <button type="button" onClick={() => onDuplicate(document)} className="flex min-h-11 items-center justify-center gap-1 rounded-xl bg-slate-100 px-2 text-xs font-black"><Copy size={15} />Duplizieren</button>}{canRelease && <button type="button" onClick={() => onVisibilityChange(document.id, !document.customerVisible)} className={`flex min-h-11 items-center justify-center gap-1 rounded-xl px-2 text-xs font-black ${document.customerVisible ? "bg-amber-100 text-amber-950" : "bg-emerald-100 text-emerald-950"}`}>{document.customerVisible ? <EyeOff size={15} /> : <Eye size={15} />}{document.customerVisible ? "Zurück" : "Freigeben"}</button>}{canArchive && <button type="button" disabled={document.status === "Archiviert"} onClick={() => onArchive(document)} className="flex min-h-11 items-center justify-center gap-1 rounded-xl bg-slate-100 px-2 text-xs font-black disabled:opacity-40"><Archive size={15} />Archivieren</button>}</div></article>; })}</div>
    {!filtered.length && <div className="rounded-3xl bg-slate-50 p-6 text-center"><FileText className="mx-auto text-slate-300" /><h2 className="mt-3 font-black">Noch keine passenden Dokumente.</h2><p className="mt-1 text-sm text-slate-500">Filter zurücksetzen oder das erste Dokument aus einem Auftrag erstellen.</p>{canCreate && <button type="button" onClick={() => onNew("Montageprotokoll")} className="mt-4 min-h-12 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white">Erstes Dokument erstellen</button>}</div>}
  </div>;
}
