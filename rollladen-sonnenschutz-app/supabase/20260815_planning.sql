-- Baustellenplanung 2.0: additive Abwesenheiten und eingeschränkte Außendienst-Aktualisierung.
-- Vor produktiver Nutzung im Supabase SQL Editor prüfen und manuell ausführen.
-- Bestehende Tabellen und Daten werden nicht gelöscht.

create table if not exists public.company_absences (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  person_id text not null references public.company_people(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  type text not null check (type in ('Urlaub','Krank','Schule','Berufsschule','Lehrgang','Frei','Sonstiges')),
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint company_absences_valid_range check (end_date >= start_date)
);

create index if not exists idx_company_absences_company_dates
  on public.company_absences (company_id, start_date, end_date);

create index if not exists idx_company_absences_person_dates
  on public.company_absences (person_id, start_date, end_date);

alter table public.company_absences enable row level security;

drop policy if exists company_absences_select_internal on public.company_absences;
create policy company_absences_select_internal on public.company_absences
for select using (
  public.current_company_role(company_id) in ('dev','meister','buero','vorarbeiter','monteur','azubi')
);

drop policy if exists company_absences_insert_admin on public.company_absences;
create policy company_absences_insert_admin on public.company_absences
for insert with check (public.is_company_admin(company_id));

drop policy if exists company_absences_update_admin on public.company_absences;
create policy company_absences_update_admin on public.company_absences
for update using (public.is_company_admin(company_id))
with check (public.is_company_admin(company_id));

drop policy if exists company_absences_delete_admin on public.company_absences;
create policy company_absences_delete_admin on public.company_absences
for delete using (public.is_company_admin(company_id));

-- Außendienstrollen dürfen ausschließlich Arbeitsstatus und Baustellennotizen
-- an bereits zugewiesenen Aufträgen ändern. Termin- und Teamdisposition bleibt Adminrollen vorbehalten.
create or replace function public.update_assigned_order_work(
  p_company_id text,
  p_order_id text,
  p_patch jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
  v_current jsonb;
  v_safe_patch jsonb;
  v_result jsonb;
begin
  v_role := public.current_company_role(p_company_id);

  select data into v_current
  from public.orders
  where id = p_order_id and company_id = p_company_id
  for update;

  if v_current is null then
    raise exception 'Auftrag wurde nicht gefunden.';
  end if;

  if v_role not in ('dev','meister','buero','vorarbeiter','monteur') then
    raise exception 'Rolle darf den Arbeitsstatus nicht ändern.';
  end if;

  if v_role in ('vorarbeiter','monteur') and not public.is_assigned_to_order(p_company_id, v_current) then
    raise exception 'Auftrag ist dieser Person nicht zugewiesen.';
  end if;

  select coalesce(jsonb_object_agg(entry.key, entry.value), '{}'::jsonb)
  into v_safe_patch
  from jsonb_each(coalesce(p_patch, '{}'::jsonb)) entry
  where entry.key in ('status','statusHistory','startedAt','technicianNote','planningNote','updatedAt');

  if v_safe_patch ? 'status' and (v_safe_patch ->> 'status') not in (
    'Neu','Geplant','In Vorbereitung','In Arbeit','Wartet auf Kunde',
    'Wartet auf Material','Nacharbeit','Abschluss offen','Erledigt','Archiviert'
  ) then
    raise exception 'Unzulässiger Auftragsstatus.';
  end if;

  update public.orders
  set data = data || v_safe_patch,
      updated_at = now()
  where id = p_order_id and company_id = p_company_id
  returning data into v_result;

  return v_result;
end;
$$;

revoke all on function public.update_assigned_order_work(text, text, jsonb) from public;
grant execute on function public.update_assigned_order_work(text, text, jsonb) to authenticated;
