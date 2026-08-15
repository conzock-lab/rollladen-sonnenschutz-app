import React from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { careTipsByProduct, productLabel } from "../../lib/customerPortal";

export default function CustomerCareTips({ orders = [], onMaintenanceRequest }) {
  const products = [...new Map(orders.map((order) => [order.product, order])).values()];
  return <div className="space-y-3">
    {products.map((order) => <article key={order.product} className="rounded-3xl bg-emerald-50 p-4"><div className="flex items-center gap-2"><RefreshCw size={18} /><h3 className="font-black">{productLabel(order.product)}</h3></div><ul className="mt-3 space-y-2 text-sm text-emerald-950">{(careTipsByProduct[order.product] || ["Anlage sauber halten und bei ungewöhnlichem Verhalten den Fachbetrieb kontaktieren."]).map((tip) => <li key={tip} className="rounded-2xl bg-white/80 p-3">• {tip}</li>)}</ul>{order.nextMaintenanceDate && <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-bold">Nächste empfohlene Wartung: {order.nextMaintenanceDate}</p>}{onMaintenanceRequest && <button type="button" onClick={() => onMaintenanceRequest(order)} className="mt-3 min-h-11 w-full rounded-xl bg-emerald-900 px-4 text-sm font-black text-white">Wartung anfragen</button>}</article>)}
    {!products.length && <div className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-600">Noch keine produktbezogenen Pflegehinweise verfügbar.</div>}
    <div className="flex gap-2 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-950"><ShieldCheck className="shrink-0" size={18} />Herstellerangaben bleiben maßgeblich. Bei Schäden, elektrischen Arbeiten oder Unsicherheit wenden Sie sich bitte an den Fachbetrieb.</div>
  </div>;
}
