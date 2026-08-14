import React from "react";
import { Camera, ScanText } from "lucide-react";
import { Badge } from "../CheckItem";

const fieldLabels = {
  manufacturer: "Hersteller",
  model: "Modell",
  type: "Typ",
  serial: "Seriennummer",
  voltage: "Spannung",
  power: "Leistung",
  torque: "Drehmoment",
  speed: "Drehzahl",
};

export default function NameplateAssistant({ onAnalyze, recognized = {} }) {
  const values = Object.entries(fieldLabels).filter(([key]) => recognized[key]?.value || typeof recognized[key] === "string");
  return <div className="rounded-3xl border border-sky-200 bg-sky-50 p-4">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="flex items-center gap-2 font-black text-sky-950"><ScanText size={18} />Typenschild-Assistent</p><p className="mt-1 text-xs font-semibold leading-5 text-sky-800">Zeigt ausschließlich übernommene oder erkannte Werte. Unsichere Angaben müssen am Original geprüft werden.</p></div><button type="button" onClick={onAnalyze} className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-sky-950 px-4 text-xs font-black text-white"><Camera size={17} />Typenschild analysieren</button></div>
    {values.length ? <div className="mt-3 grid gap-2 sm:grid-cols-2">{values.map(([key, label]) => { const entry = typeof recognized[key] === "string" ? { value: recognized[key], confidence: "übernommen" } : recognized[key]; return <div key={key} className="rounded-2xl bg-white p-3"><p className="text-[11px] font-bold uppercase text-slate-400">{label}</p><div className="mt-1 flex items-center justify-between gap-2"><strong className="text-sm">{entry.value}</strong><Badge>{entry.confidence || "prüfen"}</Badge></div></div>; })}</div> : <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold text-slate-500">Noch keine erkannten Typenschildwerte vorhanden.</p>}
  </div>;
}
