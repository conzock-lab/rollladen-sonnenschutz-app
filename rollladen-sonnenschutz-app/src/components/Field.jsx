export function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-800">{label}<input type={type} value={value ?? ""} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium outline-none focus:border-slate-950" /></label>;
}

export function LoginField({ label, value, onChange, placeholder = "", type = "text", autoComplete = "off" }) {
  return <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-800">{label}<input type={type} value={value ?? ""} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} autoComplete={autoComplete} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium outline-none placeholder:font-medium placeholder:text-slate-400 focus:border-slate-950" /></label>;
}

export function TextArea({ label, value, onChange, placeholder = "" }) {
  return <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-800">{label}<textarea value={value ?? ""} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} className="mt-2 h-28 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium outline-none focus:border-slate-950" /></label>;
}

export default Field;
