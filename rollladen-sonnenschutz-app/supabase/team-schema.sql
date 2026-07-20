-- Supabase Vorschlag für echte Firmen-/Team-Zugänge
-- Dieser Prototyp funktioniert lokal. Für echte Cloud-Sicherheit diese Tabellen + RLS verwenden.

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references auth.users(id) on delete set null,
  azubi_code text,
  customer_code text,
  monteur_code text,
  created_at timestamptz default now()
);

create table if not exists public.company_people (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  auth_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  role text not null check (role in ('meister','buero','vorarbeiter','monteur','azubi','kunde')),
  access_code text unique not null,
  status text default 'aktiv' check (status in ('aktiv','inaktiv','wartet auf Freigabe')),
  phone text,
  address text,
  team text,
  training_year text,
  learning_progress int default 0,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  customer_person_id uuid references public.company_people(id) on delete set null,
  customer text not null,
  address text,
  product text,
  status text default 'offen',
  date text,
  time text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.order_assignments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  person_id uuid references public.company_people(id) on delete cascade,
  assignment_role text,
  created_at timestamptz default now(),
  unique(order_id, person_id)
);

create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  person_id uuid references public.company_people(id) on delete cascade,
  topic text not null,
  progress int default 0,
  wrong_answers int default 0,
  updated_at timestamptz default now()
);

alter table public.companies enable row level security;
alter table public.company_people enable row level security;
alter table public.orders enable row level security;
alter table public.order_assignments enable row level security;
alter table public.learning_progress enable row level security;

-- Beispiel-RLS: Für Produktion anpassen/erweitern.
-- Admins sehen ihre Firma; Mitarbeitende/Kunden nur zugehörige Datensätze.
