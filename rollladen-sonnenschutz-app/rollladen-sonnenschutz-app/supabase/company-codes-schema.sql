-- Rollladen-/Sonnenschutz-App: Firmen, persönliche Codes, Baustellen und App-Sync
-- In Supabase ausführen: SQL Editor → New query → kompletten Inhalt einfügen → Run.
-- Danach in Supabase Authentication → Providers → Anonymous Sign-ins aktivieren.

create extension if not exists pgcrypto;

create or replace function public.make_access_code(prefix text)
returns text
language sql
as $$
  select upper(prefix) || '-' || upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 6));
$$;

create table if not exists public.companies (
  id text primary key,
  name text not null,
  owner_id uuid references auth.users(id) on delete set null,
  admin_code text default public.make_access_code('ADM'),
  azubi_code text default public.make_access_code('AZU'),
  customer_code text default public.make_access_code('KUN'),
  monteur_code text default public.make_access_code('MON'),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.company_people (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  name text not null,
  role text not null check (role in ('dev','meister','buero','vorarbeiter','monteur','azubi','kunde')),
  access_code text not null unique,
  status text not null default 'aktiv' check (status in ('aktiv','inaktiv','wartet auf Freigabe')),
  phone text default '',
  address text default '',
  team text default '',
  training_year text default '',
  progress integer default 0 check (progress >= 0 and progress <= 100),
  auth_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.orders (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

create table if not exists public.app_snapshots (
  company_id text primary key references public.companies(id) on delete cascade,
  snapshot jsonb not null default '{}',
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz default now()
);

create index if not exists idx_company_people_company on public.company_people(company_id);
create index if not exists idx_company_people_auth on public.company_people(auth_user_id);
create index if not exists idx_company_people_access_code on public.company_people(access_code);
create index if not exists idx_orders_company on public.orders(company_id);

create or replace function public.current_company_role(p_company_id text)
returns text
language sql
security definer
set search_path = public
as $$
  select cp.role
  from public.company_people cp
  where cp.company_id = p_company_id
    and cp.auth_user_id = auth.uid()
    and cp.status = 'aktiv'
  limit 1;
$$;

create or replace function public.is_company_admin(p_company_id text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.company_people cp
    where cp.company_id = p_company_id
      and cp.auth_user_id = auth.uid()
      and cp.status = 'aktiv'
      and cp.role in ('dev','meister','buero')
  );
$$;

create or replace function public.is_assigned_to_order(p_company_id text, p_order jsonb)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.company_people cp
    where cp.company_id = p_company_id
      and cp.auth_user_id = auth.uid()
      and cp.status = 'aktiv'
      and (
        cp.role in ('dev','meister','buero')
        or (coalesce(p_order -> 'assignedMemberIds', '[]'::jsonb) ? cp.id)
        or (p_order ->> 'customerPersonId') = cp.id
        or (p_order ->> 'assignedTo') = cp.name
        or (p_order ->> 'customer') = cp.name
      )
  );
$$;

create or replace function public.create_company_for_current_user(
  p_company_id text,
  p_company_name text,
  p_admin_name text
)
returns public.companies
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company public.companies;
  v_admin_id text;
begin
  if auth.uid() is null then
    raise exception 'Nicht angemeldet.';
  end if;

  insert into public.companies (id, name, owner_id)
  values (p_company_id, p_company_name, auth.uid())
  on conflict (id) do update
    set name = excluded.name,
        owner_id = coalesce(public.companies.owner_id, auth.uid()),
        updated_at = now()
  returning * into v_company;

  v_admin_id := 'P-' || replace(substr(auth.uid()::text, 1, 8), '-', '');

  insert into public.company_people (id, company_id, name, role, access_code, status, auth_user_id)
  values (v_admin_id, v_company.id, coalesce(nullif(p_admin_name, ''), 'Meister/Admin'), 'meister', public.make_access_code('ADM'), 'aktiv', auth.uid())
  on conflict (id) do update
    set name = excluded.name,
        role = 'meister',
        status = 'aktiv',
        auth_user_id = auth.uid(),
        updated_at = now();

  return v_company;
end;
$$;

create or replace function public.claim_person_access(p_name text, p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_person public.company_people;
  v_company public.companies;
begin
  if auth.uid() is null then
    raise exception 'Nicht angemeldet.';
  end if;

  select * into v_person
  from public.company_people
  where lower(trim(name)) = lower(trim(p_name))
    and upper(trim(access_code)) = upper(trim(p_code))
  limit 1;

  if not found then
    raise exception 'Name oder Code nicht gefunden.';
  end if;

  if v_person.status <> 'aktiv' then
    raise exception 'Dieser Zugang ist noch nicht aktiv.';
  end if;

  update public.company_people
  set auth_user_id = auth.uid(), updated_at = now()
  where id = v_person.id
  returning * into v_person;

  select * into v_company from public.companies where id = v_person.company_id;

  return jsonb_build_object(
    'auth_user_id', auth.uid(),
    'company', jsonb_build_object(
      'id', v_company.id,
      'name', v_company.name,
      'adminCode', v_company.admin_code,
      'azubiCode', v_company.azubi_code,
      'customerCode', v_company.customer_code,
      'monteurCode', v_company.monteur_code,
      'createdAt', to_char(v_company.created_at, 'DD.MM.YYYY HH24:MI')
    ),
    'person', jsonb_build_object(
      'id', v_person.id,
      'name', v_person.name,
      'role', v_person.role,
      'accessCode', v_person.access_code,
      'status', v_person.status,
      'phone', v_person.phone,
      'address', v_person.address,
      'team', v_person.team,
      'trainingYear', v_person.training_year,
      'progress', v_person.progress
    )
  );
end;
$$;

alter table public.companies enable row level security;
alter table public.company_people enable row level security;
alter table public.orders enable row level security;
alter table public.app_snapshots enable row level security;

drop policy if exists companies_select_member on public.companies;
create policy companies_select_member on public.companies
for select using (owner_id = auth.uid() or public.current_company_role(id) is not null);

drop policy if exists companies_insert_owner on public.companies;
create policy companies_insert_owner on public.companies
for insert with check (owner_id = auth.uid());

drop policy if exists companies_update_admin on public.companies;
create policy companies_update_admin on public.companies
for update using (owner_id = auth.uid() or public.is_company_admin(id))
with check (owner_id = auth.uid() or public.is_company_admin(id));

drop policy if exists people_select_company on public.company_people;
create policy people_select_company on public.company_people
for select using (auth_user_id = auth.uid() or public.current_company_role(company_id) is not null);

drop policy if exists people_insert_admin on public.company_people;
create policy people_insert_admin on public.company_people
for insert with check (public.is_company_admin(company_id));

drop policy if exists people_update_admin_or_self on public.company_people;
create policy people_update_admin_or_self on public.company_people
for update using (auth_user_id = auth.uid() or public.is_company_admin(company_id))
with check (auth_user_id = auth.uid() or public.is_company_admin(company_id));

drop policy if exists people_delete_admin on public.company_people;
create policy people_delete_admin on public.company_people
for delete using (public.is_company_admin(company_id));

drop policy if exists orders_select_assigned on public.orders;
create policy orders_select_assigned on public.orders
for select using (public.is_assigned_to_order(company_id, data));

drop policy if exists orders_insert_admin on public.orders;
create policy orders_insert_admin on public.orders
for insert with check (public.is_company_admin(company_id));

drop policy if exists orders_update_admin on public.orders;
create policy orders_update_admin on public.orders
for update using (public.is_company_admin(company_id)) with check (public.is_company_admin(company_id));

drop policy if exists orders_delete_admin on public.orders;
create policy orders_delete_admin on public.orders
for delete using (public.is_company_admin(company_id));

drop policy if exists snapshots_select_member on public.app_snapshots;
create policy snapshots_select_member on public.app_snapshots
for select using (public.current_company_role(company_id) is not null);

drop policy if exists snapshots_insert_admin on public.app_snapshots;
create policy snapshots_insert_admin on public.app_snapshots
for insert with check (public.is_company_admin(company_id));

drop policy if exists snapshots_update_admin on public.app_snapshots;
create policy snapshots_update_admin on public.app_snapshots
for update using (public.is_company_admin(company_id)) with check (public.is_company_admin(company_id));
