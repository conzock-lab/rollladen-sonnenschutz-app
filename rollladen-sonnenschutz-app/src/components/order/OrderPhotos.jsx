import React from "react";
import { Camera, Upload } from "lucide-react";
import Card from "../Card";
import { Badge } from "../CheckItem";
import SectionTitle from "../SectionHeader";

export const ORDER_PHOTO_CATEGORIES = ["Vorher", "Nachher", "Typenschild", "Schaden", "Untergrund", "Befestigung", "Motor", "Aufmaß", "Ersatzteil", "Kundenübergabe", "Sonstiges"];
export const REQUIRED_ORDER_PHOTOS = ["Vorher", "Nachher", "Typenschild"];

export default function OrderPhotos({ canEdit = true, onAnalyze, onNoteChange, onUpload, order, photoAnalyses = {}, photos = {} }) {
  const complete = REQUIRED_ORDER_PHOTOS.filter((category) => photos[category]).length;
  return <Card><SectionTitle icon={Camera} title="Auftragsgalerie" subtitle="Fotos werden nach Kategorie direkt mit der Baustelle verknüpft und lokal gespeichert." />
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-slate-50 p-4"><div><p className="font-black">{order?.id} · {order?.customer}</p><p className="mt-1 text-xs font-bold text-slate-500">Pflichtfotos: {complete}/{REQUIRED_ORDER_PHOTOS.length}</p></div><Badge>{complete === REQUIRED_ORDER_PHOTOS.length ? "Pflichtfotos vollständig" : `${REQUIRED_ORDER_PHOTOS.length - complete} Pflichtfoto(s) fehlen`}</Badge></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{ORDER_PHOTO_CATEGORIES.map((category) => { const photo = photos[category]; const required = REQUIRED_ORDER_PHOTOS.includes(category); return <article key={category} className="rounded-3xl bg-slate-50 p-4"><div className="flex items-center justify-between gap-2"><h3 className="font-black">{category}</h3>{required && <Badge>Pflichtfoto</Badge>}</div>{photo ? <img src={photo.url} alt={`${category} zu Auftrag ${order?.id}`} className="mt-3 h-44 w-full rounded-2xl bg-white object-cover" /> : <div className="mt-3 flex h-44 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white text-sm font-bold text-slate-400">Noch kein Foto</div>}
      {canEdit && <label className="mt-3 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-3 text-xs font-black shadow-sm"><Upload size={16} />Foto hinzufügen<input type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => { onUpload(category, event.target.files?.[0]); event.target.value = ""; }} /></label>}
      {photo && <><p className="mt-2 text-[11px] font-bold text-slate-400">{photo.createdAt || "lokal gespeichert"} · {photo.name}</p><input disabled={!canEdit} value={photo.note || ""} onChange={(event) => onNoteChange(category, event.target.value)} placeholder="Notiz zum Foto" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none" /><button type="button" onClick={() => onAnalyze(category)} className="mt-2 w-full rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white">Foto auswerten</button>{photoAnalyses[category] && <p className="mt-2 rounded-xl bg-white p-3 text-xs font-semibold leading-5 text-slate-600">{photoAnalyses[category]}</p>}</>}
    </article>; })}</div>
  </Card>;
}
