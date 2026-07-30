import React from "react";
import { CheckCircle2, ChevronDown, MinusCircle, Settings, ShieldCheck, XCircle } from "lucide-react";
import { Badge } from "../components/CheckItem";
import Card from "../components/Card";
import SectionTitle from "../components/SectionHeader";
import { permissionLevels, permissionRoles, rolePermissionMatrix, roles } from "../data/rights";

const levelStyles = {
  allowed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  limited: "border-amber-200 bg-amber-50 text-amber-900",
  denied: "border-slate-200 bg-slate-100 text-slate-500",
};

const levelIcons = {
  allowed: CheckCircle2,
  limited: MinusCircle,
  denied: XCircle,
};

function PermissionCell({ value }) {
  const Icon = levelIcons[value.level] || XCircle;
  const label = permissionLevels[value.level]?.shortLabel || value.level;

  return (
    <div className={`min-w-[116px] rounded-xl border px-2.5 py-2 ${levelStyles[value.level] || levelStyles.denied}`}>
      <div className="flex items-center gap-1.5 text-xs font-black">
        <Icon size={14} aria-hidden="true" />
        <span>{label}</span>
      </div>
      {value.note !== "-" && <p className="mt-1 text-[11px] font-semibold leading-4 opacity-80">{value.note}</p>}
    </div>
  );
}

export default function RightsPage({ navItems }) {
  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle
          icon={Settings}
          title="Rechte-Matrix"
          subtitle="Rollenrichtlinie für die App. Rollen und persönliche Zugänge werden im Verzeichnis verwaltet."
        />

        <div className="mb-4 flex flex-wrap gap-2" aria-label="Legende der Rechte-Status">
          {Object.entries(permissionLevels).map(([level, item]) => {
            const Icon = levelIcons[level];
            return (
              <span key={level} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black ${levelStyles[level]}`}>
                <Icon size={14} aria-hidden="true" />
                {item.label}
              </span>
            );
          })}
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200">
          <table className="w-full min-w-[1160px] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-56 p-3">Berechtigung</th>
                {permissionRoles.map((role) => <th key={role.id} className="p-3">{role.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {rolePermissionMatrix.map((group) => (
                <React.Fragment key={group.group}>
                  <tr className="border-t border-slate-200 bg-slate-950 text-white">
                    <th colSpan={permissionRoles.length + 1} className="px-3 py-2 text-xs font-black uppercase tracking-wider">{group.group}</th>
                  </tr>
                  {group.permissions.map((row) => (
                    <tr key={`${group.group}-${row.area}`} className="border-t border-slate-100 align-top hover:bg-slate-50/70">
                      <th className="p-3 font-black text-slate-800">{row.area}</th>
                      {permissionRoles.map((role) => <td key={role.id} className="p-2"><PermissionCell value={row[role.id]} /></td>)}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs font-semibold text-slate-500">
          Die Matrix ist nicht direkt editierbar. Dev, Meister und Büro verwalten die konkrete Rolle einer Person unter „Firma & Team“.
        </p>
      </Card>

      <Card>
        <SectionTitle icon={ShieldCheck} title="Sichtbare App-Bereiche" subtitle="Kurzübersicht der Navigation je Rolle." />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {roles.map((role) => (
            <article key={role.id} className="rounded-3xl bg-slate-50 p-4">
              <h3 className="font-black">{role.label}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">{role.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(role.id === "dev" ? navItems : navItems.filter((item) => item.roles.includes(role.id))).map((item) => <Badge key={item.id}>{item.label}</Badge>)}
              </div>
            </article>
          ))}
        </div>
      </Card>

      <details className="group rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black text-slate-700">
          Technische Hinweise für spätere Supabase RLS
          <ChevronDown size={18} className="transition group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="mt-4 grid gap-2 text-xs font-semibold leading-5 text-slate-600 md:grid-cols-2">
          <p className="rounded-2xl bg-slate-50 p-3">Jede fachliche Tabelle benötigt eine <code>company_id</code>; Policies müssen diese gegen das authentifizierte Profil prüfen.</p>
          <p className="rounded-2xl bg-slate-50 p-3">Personen- und Kundendaten zusätzlich über Zuweisung beziehungsweise eigene <code>person_id</code> begrenzen.</p>
          <p className="rounded-2xl bg-slate-50 p-3">Schreibrechte serverseitig aus Rollen-Claims oder einer geschützten Mitgliedschaftstabelle ableiten.</p>
          <p className="rounded-2xl bg-slate-50 p-3">Code-Neugenerierung und Archivierung als privilegierte RPC mit Audit-Eintrag umsetzen.</p>
        </div>
      </details>
    </div>
  );
}
