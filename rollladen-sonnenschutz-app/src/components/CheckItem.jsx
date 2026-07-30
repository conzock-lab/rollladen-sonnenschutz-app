import { Check } from "lucide-react";

export function Badge({ children }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{children}</span>;
}

export default function CheckItem({ done = false }) {
  return <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${done ? "bg-emerald-100 text-emerald-800" : "bg-white text-slate-300"}`}>{done ? <Check size={15} /> : ""}</span>;
}
