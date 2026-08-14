-- Additive Indizes für die vorhandenen Sync-Abfragen.
-- Keine Tabellen, Daten oder RLS-Policies werden verändert.

begin;

create index if not exists idx_company_people_company_created_at
  on public.company_people (company_id, created_at desc);

create index if not exists idx_company_people_company_status
  on public.company_people (company_id, status);

create index if not exists idx_orders_company_updated_at
  on public.orders (company_id, updated_at desc);

commit;
