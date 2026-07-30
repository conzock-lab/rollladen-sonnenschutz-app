export default function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="rounded-2xl bg-slate-950 p-3 text-white"><Icon size={20} /></div>
      <div>
        <h2 className="text-xl font-black tracking-tight text-slate-950 md:text-2xl">{title}</h2>
        <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">{subtitle}</p>
      </div>
    </div>
  );
}
