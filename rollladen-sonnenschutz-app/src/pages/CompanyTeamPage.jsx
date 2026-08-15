import React, { useMemo, useState } from "react";
import { Archive, Check, Copy, Image, Pencil, Plus, RefreshCw, Search, Upload, UserRound, X } from "lucide-react";
import Card from "../components/Card";
import SectionTitle from "../components/SectionHeader";
import { Field } from "../components/Field";

const roleFilters = [
  { id: "all", label: "Alle", roles: null },
  { id: "management", label: "Büro/Meister", roles: ["buero", "meister"] },
  { id: "vorarbeiter", label: "Vorarbeiter", roles: ["vorarbeiter"] },
  { id: "monteur", label: "Monteur", roles: ["monteur"] },
  { id: "azubi", label: "Azubi", roles: ["azubi"] },
  { id: "kunde", label: "Kunde", roles: ["kunde"] },
];

const statusStyles = {
  aktiv: "bg-emerald-100 text-emerald-800",
  inaktiv: "bg-amber-100 text-amber-900",
  archiviert: "bg-slate-200 text-slate-600",
};

const emptyEditForm = {
  name: "",
  role: "monteur",
  phone: "",
  address: "",
  team: "",
  trainingYear: "1",
};

function RoleSelect({ value, onChange, teamRoleOptions }) {
  return (
    <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">
      Rolle
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3">
        {teamRoleOptions.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}
      </select>
    </label>
  );
}

function TrainingYearSelect({ value, onChange }) {
  return (
    <label className="block rounded-2xl bg-slate-50 p-4 text-sm font-bold">
      Ausbildungsjahr
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3">
        {[1, 2, 3, 4].map((year) => <option key={year} value={String(year)}>{year}. Ausbildungsjahr</option>)}
      </select>
    </label>
  );
}

export default function CompanyTeamPage({
  canManage,
  company,
  companyPeople,
  createCompanyPerson,
  onArchivePerson,
  onRegenerateCode,
  onSetPersonStatus,
  onUpdatePerson,
  orders,
  personForm,
  personRoleLabel,
  setCompany,
  setPersonForm,
  showNotice,
  teamRoleOptions,
  updateAzubiProgress,
}) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingPersonId, setEditingPersonId] = useState("");
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [copiedPersonId, setCopiedPersonId] = useState("");

  const filteredPeople = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const selectedFilter = roleFilters.find((filter) => filter.id === roleFilter) || roleFilters[0];

    return companyPeople.filter((person) => {
      const matchesRole = !selectedFilter.roles || selectedFilter.roles.includes(person.role);
      const searchable = [person.name, person.role, person.accessCode, person.status, person.team, person.address, person.phone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesRole && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [companyPeople, query, roleFilter]);

  const startEditing = (person) => {
    setEditingPersonId(person.id);
    setEditForm({
      name: person.name || "",
      role: person.role || "monteur",
      phone: person.phone || "",
      address: person.address || "",
      team: person.team || "",
      trainingYear: person.trainingYear || "1",
    });
  };

  const saveEditing = () => {
    if (!editForm.name.trim()) {
      showNotice("Bitte einen Namen eintragen.");
      return;
    }
    onUpdatePerson(editingPersonId, { ...editForm, name: editForm.name.trim() });
    setEditingPersonId("");
  };

  const copyPersonalCode = async (person) => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard nicht verfügbar");
      await navigator.clipboard.writeText(person.accessCode);
      setCopiedPersonId(person.id);
      showNotice(`Persönlicher Code von ${person.name} wurde kopiert.`);
      window.setTimeout(() => setCopiedPersonId((current) => current === person.id ? "" : current), 1800);
    } catch {
      showNotice("Code konnte nicht automatisch kopiert werden.");
    }
  };

  const regenerateCode = (person) => {
    if (!window.confirm(`Persönlichen Code von ${person.name} neu generieren? Der bisherige Code wird ungültig.`)) return;
    onRegenerateCode(person.id);
  };

  const archivePerson = (person) => {
    if (!window.confirm(`${person.name} archivieren? Bestehende Auftragszuweisungen bleiben erhalten.`)) return;
    onArchivePerson(person.id);
    if (editingPersonId === person.id) setEditingPersonId("");
  };

  const loadLogo = (file) => {
    if (!file) return;
    if (file.size > 1_500_000) { showNotice("Logo ist zu groß. Bitte eine Datei unter 1,5 MB verwenden."); return; }
    const reader = new FileReader();
    reader.onload = () => setCompany({ ...company, logoDataUrl: String(reader.result || "") });
    reader.onerror = () => showNotice("Logo konnte nicht lokal gelesen werden.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle icon={UserRound} title="Firma & Team" subtitle="Persönliche Zugänge, Rollen und Status zentral verwalten." />
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-[1fr_0.8fr_0.8fr] lg:items-end">
          <Field label="Firmenname" value={company.name} onChange={(value) => setCompany({ ...company, name: value })} />
          <Field label="Kundentelefon" value={company.contactPhone || ""} onChange={(value) => setCompany({ ...company, contactPhone: value })} placeholder="Für das Kundenportal" />
          <Field label="Kunden-E-Mail" type="email" value={company.contactEmail || ""} onChange={(value) => setCompany({ ...company, contactEmail: value })} placeholder="Für das Kundenportal" />
        </div>
        <details className="mt-4 rounded-3xl bg-slate-50 p-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-black"><Image size={18} />Firmenkopf für Dokumente</summary>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Straße" value={company.street || ""} onChange={(value) => setCompany({ ...company, street: value })} />
            <Field label="PLZ" value={company.postalCode || ""} onChange={(value) => setCompany({ ...company, postalCode: value })} />
            <Field label="Ort" value={company.city || ""} onChange={(value) => setCompany({ ...company, city: value })} />
            <Field label="Telefon im Dokument" value={company.phone || ""} onChange={(value) => setCompany({ ...company, phone: value })} />
            <Field label="E-Mail im Dokument" type="email" value={company.email || ""} onChange={(value) => setCompany({ ...company, email: value })} />
            <Field label="Website" value={company.website || ""} onChange={(value) => setCompany({ ...company, website: value })} />
            <Field label="Schlichter Dokument-Footer" value={company.documentFooter || ""} onChange={(value) => setCompany({ ...company, documentFooter: value })} placeholder="optional" />
            <div className="rounded-2xl bg-white p-4 md:col-span-2"><p className="text-sm font-bold">Logo</p><div className="mt-2 flex flex-wrap items-center gap-3">{company.logoDataUrl ? <img src={company.logoDataUrl} alt="Aktuelles Firmenlogo" className="h-16 max-w-52 rounded-xl border border-slate-200 bg-white object-contain" /> : <span className="flex h-16 w-40 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-400">Logo-Platzhalter</span>}<label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white"><Upload size={16} />Logo lokal auswählen<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => { loadLogo(event.target.files?.[0]); event.target.value = ""; }} /></label>{company.logoDataUrl && <button type="button" onClick={() => setCompany({ ...company, logoDataUrl: "" })} className="min-h-11 rounded-xl bg-slate-100 px-4 text-xs font-black">Logo entfernen</button>}</div><p className="mt-2 text-xs font-semibold text-slate-500">Das Logo wird proportional im Firmenkopf dargestellt und nicht von einem externen CDN geladen.</p></div>
          </div>
        </details>
        <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-900">Es gibt ausschließlich persönliche Codes. Kunden sind nach dem Anlegen sofort aktiv und benötigen keine zusätzliche Freigabe.</div>
      </Card>

      {canManage && (
        <details className="group rounded-3xl border border-slate-200 bg-white shadow-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-black">
            <span className="flex items-center gap-2"><Plus size={18} />Person anlegen</span>
            <span className="text-xs font-bold text-slate-500">Persönlicher Code wird automatisch erzeugt</span>
          </summary>
          <div className="border-t border-slate-100 p-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Name" value={personForm.name} onChange={(value) => setPersonForm({ ...personForm, name: value })} placeholder="z. B. Max Mustermann" />
              <RoleSelect value={personForm.role} onChange={(role) => setPersonForm({ ...personForm, role })} teamRoleOptions={teamRoleOptions} />
              <Field label="Telefon" value={personForm.phone} onChange={(value) => setPersonForm({ ...personForm, phone: value })} placeholder="optional" />
              <Field label={personForm.role === "kunde" ? "Adresse" : "Adresse / Bereich"} value={personForm.address} onChange={(value) => setPersonForm({ ...personForm, address: value })} placeholder="optional" />
              {personForm.role !== "kunde" && <Field label="Kolonne / Team" value={personForm.team} onChange={(value) => setPersonForm({ ...personForm, team: value })} placeholder="z. B. Kolonne 1" />}
              {personForm.role === "azubi" && <TrainingYearSelect value={personForm.trainingYear} onChange={(trainingYear) => setPersonForm({ ...personForm, trainingYear })} />}
            </div>
            <button onClick={createCompanyPerson} className="mt-4 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">Person anlegen und Code erzeugen</button>
          </div>
        </details>
      )}

      <Card>
        <SectionTitle icon={Search} title="Verzeichnis" subtitle={`${filteredPeople.length} von ${companyPeople.length} Personen angezeigt`} />

        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <Search size={18} className="text-slate-400" aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, Code, Rolle, Team, Adresse oder Status suchen" className="w-full bg-transparent text-sm outline-none" aria-label="Personen durchsuchen" />
            {query && <button onClick={() => setQuery("")} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Suche leeren"><X size={16} /></button>}
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Nach Rolle filtern">
            {roleFilters.map((filter) => (
              <button key={filter.id} onClick={() => setRoleFilter(filter.id)} className={`rounded-full px-3 py-2 text-xs font-black transition ${roleFilter === filter.id ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {editingPersonId && canManage && (
          <div className="mb-4 rounded-3xl border border-sky-200 bg-sky-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-black">Person bearbeiten</h3>
              <button onClick={() => setEditingPersonId("")} className="rounded-xl bg-white p-2 text-slate-500" aria-label="Bearbeitung abbrechen"><X size={17} /></button>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Name" value={editForm.name} onChange={(name) => setEditForm({ ...editForm, name })} />
              <RoleSelect value={editForm.role} onChange={(role) => setEditForm({ ...editForm, role })} teamRoleOptions={teamRoleOptions} />
              <Field label="Telefon" value={editForm.phone} onChange={(phone) => setEditForm({ ...editForm, phone })} />
              <Field label={editForm.role === "kunde" ? "Adresse" : "Adresse / Bereich"} value={editForm.address} onChange={(address) => setEditForm({ ...editForm, address })} />
              {editForm.role !== "kunde" && <Field label="Kolonne / Team" value={editForm.team} onChange={(team) => setEditForm({ ...editForm, team })} />}
              {editForm.role === "azubi" && <TrainingYearSelect value={editForm.trainingYear} onChange={(trainingYear) => setEditForm({ ...editForm, trainingYear })} />}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={saveEditing} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white"><Check size={16} />Speichern</button>
              <button onClick={() => setEditingPersonId("")} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-slate-700">Abbrechen</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-3xl border border-slate-200">
          <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="p-3">Person</th>
                <th className="p-3">Rolle</th>
                <th className="p-3">Bereich / Kontakt</th>
                <th className="p-3">Status</th>
                <th className="p-3">Persönlicher Code</th>
                <th className="p-3 text-center">Aufträge</th>
                <th className="p-3">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredPeople.map((person) => {
                const assignedCount = orders.filter((order) => (order.assignedMemberIds || []).includes(person.id) || order.customerPersonId === person.id).length;
                const status = person.status || "inaktiv";
                return (
                  <tr key={person.id} className={`border-t border-slate-100 align-top ${status === "archiviert" ? "bg-slate-50/70 text-slate-500" : "hover:bg-slate-50/60"}`}>
                    <td className="p-3">
                      <p className="font-black text-slate-900">{person.name}</p>
                      {person.role === "azubi" && (
                        <div className="mt-1.5 min-w-36">
                          <div className="flex justify-between text-[11px] font-bold text-slate-500"><span>{person.trainingYear || "?"}. Jahr</span><span>{person.progress || 0}%</span></div>
                          {canManage && <input type="range" min="0" max="100" value={person.progress || 0} onChange={(event) => updateAzubiProgress(person.id, event.target.value)} className="mt-1 h-1.5 w-full accent-slate-950" aria-label={`Lernfortschritt von ${person.name}`} />}
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-bold">{personRoleLabel(person.role)}</td>
                    <td className="p-3 text-xs leading-5 text-slate-600">
                      <p>{person.role === "kunde" ? (person.address || "Keine Adresse") : (person.team || person.address || "Kein Bereich")}</p>
                      {person.phone && <p>{person.phone}</p>}
                    </td>
                    <td className="p-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${statusStyles[status] || statusStyles.inaktiv}`}>{status === "inaktiv" ? "deaktiviert" : status}</span></td>
                    <td className="p-3"><code className="rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-black text-white">{person.accessCode}</code></td>
                    <td className="p-3 text-center font-black">{assignedCount}</td>
                    <td className="p-3">
                      {canManage ? (
                        <div className="flex max-w-sm flex-wrap gap-1.5">
                          <button onClick={() => startEditing(person)} className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-2 text-xs font-bold" title="Person bearbeiten"><Pencil size={14} />Bearbeiten</button>
                          <button onClick={() => copyPersonalCode(person)} className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-2 text-xs font-bold" title="Persönlichen Code kopieren">{copiedPersonId === person.id ? <Check size={14} /> : <Copy size={14} />}Kopieren</button>
                          <button onClick={() => regenerateCode(person)} className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-2 text-xs font-bold" title="Persönlichen Code neu generieren"><RefreshCw size={14} />Code neu</button>
                          <button onClick={() => onSetPersonStatus(person.id, status === "aktiv" ? "inaktiv" : "aktiv")} className="rounded-xl bg-slate-100 px-2.5 py-2 text-xs font-bold">{status === "aktiv" ? "Deaktivieren" : "Aktivieren"}</button>
                          {status !== "archiviert" && <button onClick={() => archivePerson(person)} className="inline-flex items-center gap-1 rounded-xl bg-rose-100 px-2.5 py-2 text-xs font-bold text-rose-800"><Archive size={14} />Archivieren</button>}
                        </div>
                      ) : <span className="text-xs font-semibold text-slate-400">Nur lesbar</span>}
                    </td>
                  </tr>
                );
              })}
              {filteredPeople.length === 0 && (
                <tr><td colSpan="7" className="p-8 text-center text-sm font-bold text-slate-500">Keine Personen für Suche und Rollenfilter gefunden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
