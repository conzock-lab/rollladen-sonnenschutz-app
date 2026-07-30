import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyBox({ title, text }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return <article className="rounded-3xl bg-slate-50 p-5"><h3 className="font-bold">{title}</h3><textarea readOnly value={text} className="mt-3 h-32 w-full resize-none rounded-2xl border border-slate-200 bg-white p-3 text-sm leading-6" /><button onClick={copy} className="mt-3 flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Kopiert" : "Text kopieren"}</button></article>;
}
