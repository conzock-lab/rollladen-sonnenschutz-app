import React from "react";
import { Building2, Camera, CheckCircle2, FileText, MapPin, PackageSearch, PenTool, Phone, Search, Zap } from "lucide-react";

export default function OrderQuickActions({ address, canOpen = () => true, onOpen, phone }) {
  const actions = [
    { id: "manufacturers", label: "Hersteller öffnen", icon: Building2 },
    { id: "motors", label: "Motor prüfen", icon: Zap },
    { id: "photos", label: "Foto hinzufügen", icon: Camera },
    { id: "diagnosis", label: "Diagnose starten", icon: Search },
    { id: "parts", label: "Ersatzteil suchen", icon: PackageSearch },
    { id: "sketches", label: "Skizze erstellen", icon: PenTool },
    { id: "documents", label: "PDF erstellen", icon: FileText },
    { id: "completion", label: "Auftrag abschließen", icon: CheckCircle2 },
  ];
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-5">
    <a href={phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : undefined} aria-disabled={!phone} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-center text-xs font-black ${phone ? "bg-emerald-50 text-emerald-900" : "pointer-events-none bg-slate-100 text-slate-400"}`}><Phone size={18} />Anrufen</a>
    <a href={address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : undefined} target="_blank" rel="noreferrer" aria-disabled={!address} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-center text-xs font-black ${address ? "bg-sky-50 text-sky-900" : "pointer-events-none bg-slate-100 text-slate-400"}`}><MapPin size={18} />Navigation</a>
    {actions.filter((action) => canOpen(action.id)).map((action) => { const Icon = action.icon; return <button key={action.id} type="button" onClick={() => onOpen(action.id)} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl bg-slate-50 px-2 text-center text-xs font-black text-slate-700 hover:bg-slate-950 hover:text-white"><Icon size={18} />{action.label}</button>; })}
  </div>;
}
