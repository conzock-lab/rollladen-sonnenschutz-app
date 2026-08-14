-- Additive, idempotente Persistenz für persönliche Lernstände.
-- Erst nach Prüfung in der Zielumgebung über den Supabase SQL Editor ausführen.
-- Bestehende Tabellen, Daten und Policies werden nicht gelöscht.

begin;

create table if not exists public.learning_records (
  company_id text not null references public.companies(id) on delete cascade,
  person_id text not null references public.company_people(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (company_id, person_id)
);

create index if not exists idx_learning_records_person_updated
  on public.learning_records (person_id, updated_at desc);

alter table public.learning_records enable row level security;

drop policy if exists learning_records_select_self_or_admin on public.learning_records;
create policy learning_records_select_self_or_admin on public.learning_records
for select using (
  public.is_company_admin(company_id)
  or exists (
    select 1 from public.company_people cp
    where cp.company_id = learning_records.company_id
      and cp.id = learning_records.person_id
      and cp.auth_user_id = auth.uid()
      and cp.status = 'aktiv'
  )
);

drop policy if exists learning_records_insert_self_or_admin on public.learning_records;
create policy learning_records_insert_self_or_admin on public.learning_records
for insert with check (
  public.is_company_admin(company_id)
  or exists (
    select 1 from public.company_people cp
    where cp.company_id = learning_records.company_id
      and cp.id = learning_records.person_id
      and cp.auth_user_id = auth.uid()
      and cp.status = 'aktiv'
  )
);

drop policy if exists learning_records_update_self_or_admin on public.learning_records;
create policy learning_records_update_self_or_admin on public.learning_records
for update using (
  public.is_company_admin(company_id)
  or exists (
    select 1 from public.company_people cp
    where cp.company_id = learning_records.company_id
      and cp.id = learning_records.person_id
      and cp.auth_user_id = auth.uid()
      and cp.status = 'aktiv'
  )
) with check (
  public.is_company_admin(company_id)
  or exists (
    select 1 from public.company_people cp
    where cp.company_id = learning_records.company_id
      and cp.id = learning_records.person_id
      and cp.auth_user_id = auth.uid()
      and cp.status = 'aktiv'
  )
);

commit;
