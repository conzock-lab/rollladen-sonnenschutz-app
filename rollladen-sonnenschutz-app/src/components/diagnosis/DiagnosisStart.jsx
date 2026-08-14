import React from "react";
import { ClipboardList, ListChecks, MessageSquareText, Search } from "lucide-react";
import { Badge } from "../CheckItem";

const modes = [
  { id: "assistant", label: "Diagnose-Assistent", icon: MessageSquareText, text: "Problem beschreiben und Vorschläge erhalten" },
  { id: "select", label: "Fehlerbild auswählen", icon: ListChecks, text: "Direkt aus allen Fehlerbildern wählen" },
  { id: "order", label: "Zum Auftrag starten", icon: ClipboardList, text: "Produkt und Auftragsdaten übernehmen" },
];

export default function DiagnosisStart({ mode, onModeChange, onAnalyze, order, problemText, selectedSymptoms, setProblemText, symptomGroups, toggleSymptom }) {
  return <section className="space-y-4">
    <div className="grid gap-3 md:grid-cols-3">{modes.map(({ id, label, icon: Icon, text }) => <button key={id} type="button" onClick={() => onModeChange(id)} className={`min-h-24 rounded-3xl border p-4 text-left ${mode === id ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-800"}`}><Icon size={20} /><span className="mt-3 block font-black">{label}</span><span className={`mt-1 block text-xs font-semibold ${mode === id ? "text-white/70" : "text-slate-500"}`}>{text}</span></button>)}</div>

    {mode !== "select" && <div className="rounded-3xl bg-slate-50 p-4 md:p-5">
      {mode === "order" && <div className="mb-4 rounded-2xl bg-sky-50 p-4 text-sm font-bold text-sky-950">{order ? <><Badge>Aktiver Auftrag</Badge><p className="mt-2">{order.id} · {order.customer}</p><p className="mt-1 text-xs text-sky-800">{order.manufacturer || "Hersteller offen"} · {order.drive || "Antrieb offen"}</p></> : "Kein Auftrag ausgewählt. Die Diagnose kann trotzdem lokal begonnen werden."}</div>}
      <label className="block text-sm font-black">Problem kurz beschreiben<textarea value={problemText} onChange={(event) => setProblemText(event.target.value)} placeholder="z. B. Markise brummt und fährt nicht aus" className="mt-2 min-h-28 w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold leading-6 outline-none focus:border-slate-500" /></label>
      <div className="mt-4 space-y-3">{symptomGroups.map((group) => <details key={group.id} className="rounded-2xl bg-white p-3" open={group.id === "movement" || group.id === "operation"}><summary className="cursor-pointer text-xs font-black uppercase text-slate-500">{group.label}</summary><div className="mt-3 flex flex-wrap gap-2">{group.items.map((item) => { const active = selectedSymptoms.includes(item); return <button key={item} type="button" onClick={() => toggleSymptom(item)} className={`min-h-10 rounded-full px-3 text-xs font-black ${active ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}>{item}</button>; })}</div></details>)}</div>
      <button type="button" onClick={onAnalyze} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white"><Search size={18} />Passende Prüffälle anzeigen</button>
    </div>}
  </section>;
}
