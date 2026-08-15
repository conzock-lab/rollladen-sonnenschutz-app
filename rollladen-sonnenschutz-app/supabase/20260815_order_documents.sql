-- Dokumente & PDF 2.0: auftragsbezogene Dokumentmetadaten, Versionen und Freigaben.
-- Additiv und idempotent. Vor produktiver Nutzung im Supabase SQL Editor prüfen
-- und manuell ausführen. Bestehende Aufträge, Personen und Snapshots werden nicht gelöscht.

begin;

-- Firmenkopf für Dokumente. contact_phone/contact_email bleiben die bereits
-- vorhandenen allgemeinen Kontaktdaten aus der Kundenportal-Migration.
alter table public.companies add column if not exists street text not null default '';
alter table public.companies add column if not exists postal_code text not null default '';
alter table public.companies add column if not exists city text not null default '';
alter table public.companies add column if not exists phone text not null default '';
alter table public.companies add column if not exists email text not null default '';
alter table public.companies add column if not exists website text not null default '';
alter table public.companies add column if not exists logo_data text not null default '';
alter table public.companies add column if not exists document_footer text not null default '';
alter table public.companies add column if not exists contact_phone text not null default '';
alter table public.companies add column if not exists contact_email text not null default '';
alter table public.company_people add column if not exists email text not null default '';

-- Die stabile Kundenbeziehung wurde mit Kundenportal 2.0 eingeführt. Die
-- Wiederholung macht diese Migration für Installationen mit älterem Schema robust.
alter table public.orders add column if not exists customer_id text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'orders_customer_id_fkey'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_customer_id_fkey
      foreign key (customer_id) references public.company_people(id) on delete set null;
  end if;
end $$;

create table if not exists public.order_documents (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  order_id text not null references public.orders(id) on delete cascade,
  customer_id text references public.company_people(id) on delete set null,
  type text not null,
  title text not null,
  status text not null default 'Entwurf'
    check (status in ('Entwurf','Erstellt','Zur Freigabe','Freigegeben','Gesendet','Unterschrieben','Archiviert')),
  version integer not null default 1 check (version >= 1),
  data jsonb not null default '{}'::jsonb,
  customer_visible boolean not null default false,
  signed_status text not null default 'nicht erforderlich',
  file_name text not null,
  document_number text,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_order_documents_company_order
  on public.order_documents (company_id, order_id, updated_at desc);
create index if not exists idx_order_documents_customer_visible
  on public.order_documents (company_id, customer_id, customer_visible, updated_at desc);
create index if not exists idx_order_documents_company_status
  on public.order_documents (company_id, status, updated_at desc);
create index if not exists idx_order_documents_company_number
  on public.order_documents (company_id, document_number)
  where document_number is not null;

-- Einmalige, verlustfreie Übernahme vorhandener Dokumente aus app_snapshots.
-- Fehlerhafte/auftragslose Altobjekte bleiben im Snapshot erhalten und werden
-- absichtlich nicht in die neue, streng auftragsbezogene Tabelle geschrieben.
insert into public.order_documents (
  id, company_id, order_id, customer_id, type, title, status, version, data,
  customer_visible, signed_status, file_name, document_number, created_by,
  created_at, updated_at
)
select
  document.value ->> 'id',
  snapshot.company_id,
  document.value ->> 'orderId',
  case
    when exists (
      select 1 from public.company_people customer
      where customer.id = document.value ->> 'customerId'
        and customer.company_id = snapshot.company_id
        and customer.role = 'kunde'
    ) then document.value ->> 'customerId'
    else null
  end,
  coalesce(nullif(document.value ->> 'type', ''), nullif(document.value ->> 'template', ''), 'Sonstiges Dokument'),
  coalesce(nullif(document.value ->> 'title', ''), nullif(document.value ->> 'type', ''), 'Sonstiges Dokument'),
  case when document.value ->> 'status' in ('Entwurf','Erstellt','Zur Freigabe','Freigegeben','Gesendet','Unterschrieben','Archiviert')
    then document.value ->> 'status' else 'Entwurf' end,
  case when coalesce(document.value ->> 'version', '') ~ '^[1-9][0-9]*$'
    then (document.value ->> 'version')::integer else 1 end,
  coalesce(document.value -> 'data', '{}'::jsonb)
    || jsonb_build_object(
      'fields', coalesce(document.value -> 'fields', document.value -> 'data' -> 'fields', '{}'::jsonb),
      'signatures', coalesce(document.value -> 'signatures', document.value -> 'data' -> 'signatures', '{}'::jsonb),
      'history', coalesce(document.value -> 'history', document.value -> 'data' -> 'history', '[]'::jsonb),
      'customerPreview', coalesce(document.value -> 'customerPreview', document.value -> 'data' -> 'customerPreview', '[]'::jsonb),
      'customerStatus', coalesce(document.value ->> 'customerStatus', 'wartet auf Freigabe'),
      'customerVisibleAt', coalesce(document.value ->> 'customerVisibleAt', '')
    ),
  coalesce(document.value ->> 'customerVisible', 'false') = 'true',
  coalesce(nullif(document.value ->> 'signedStatus', ''), 'nicht erforderlich'),
  coalesce(nullif(document.value ->> 'fileName', ''), (document.value ->> 'id') || '.pdf'),
  nullif(document.value ->> 'documentNumber', ''),
  nullif(document.value ->> 'createdBy', ''),
  snapshot.updated_at,
  snapshot.updated_at
from public.app_snapshots snapshot
cross join lateral jsonb_array_elements(coalesce(snapshot.snapshot -> 'pdfDocuments', '[]'::jsonb)) document
join public.orders orders
  on orders.id = document.value ->> 'orderId'
 and orders.company_id = snapshot.company_id
where nullif(document.value ->> 'id', '') is not null
  and nullif(document.value ->> 'orderId', '') is not null
on conflict (id) do nothing;

-- Kunden werden bewusst ausgeschlossen. RLS auf einer JSONB-Zeile kann interne
-- Dokumentfelder nicht spaltenweise verbergen; Kunden lesen nur die Whitelist-RPC.
create or replace function public.can_access_order_document(p_company_id text, p_order_id text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.company_people person
    join public.orders orders
      on orders.id = p_order_id
     and orders.company_id = p_company_id
    where person.company_id = p_company_id
      and person.auth_user_id = auth.uid()
      and person.status = 'aktiv'
      and (
        person.role in ('dev','meister','buero')
        or (
          person.role in ('vorarbeiter','monteur','azubi')
          and (
            coalesce(orders.data -> 'assignedMemberIds', '[]'::jsonb) ? person.id
            or orders.data ->> 'assignedTo' = person.name
          )
        )
      )
  );
$$;

create or replace function public.can_write_order_document(p_company_id text, p_order_id text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.company_people person
    join public.orders orders
      on orders.id = p_order_id
     and orders.company_id = p_company_id
    where person.company_id = p_company_id
      and person.auth_user_id = auth.uid()
      and person.status = 'aktiv'
      and (
        person.role in ('dev','meister','buero')
        or (
          person.role in ('vorarbeiter','monteur')
          and (
            coalesce(orders.data -> 'assignedMemberIds', '[]'::jsonb) ? person.id
            or orders.data ->> 'assignedTo' = person.name
          )
        )
      )
  );
$$;

alter table public.order_documents enable row level security;

drop policy if exists order_documents_select_internal on public.order_documents;
create policy order_documents_select_internal on public.order_documents
  for select to authenticated
  using (public.can_access_order_document(company_id, order_id));

drop policy if exists order_documents_insert_authorized on public.order_documents;
create policy order_documents_insert_authorized on public.order_documents
  for insert to authenticated
  with check (
    public.can_write_order_document(company_id, order_id)
    and (
      public.is_company_admin(company_id)
      or (customer_visible = false and status not in ('Freigegeben','Archiviert'))
    )
  );

drop policy if exists order_documents_update_authorized on public.order_documents;
create policy order_documents_update_authorized on public.order_documents
  for update to authenticated
  using (public.can_write_order_document(company_id, order_id))
  with check (
    public.can_write_order_document(company_id, order_id)
    and (
      public.is_company_admin(company_id)
      or (customer_visible = false and status not in ('Freigegeben','Archiviert'))
    )
  );

drop policy if exists order_documents_delete_admin on public.order_documents;
create policy order_documents_delete_admin on public.order_documents
  for delete to authenticated
  using (public.is_company_admin(company_id));

revoke all on function public.can_access_order_document(text, text) from public;
revoke all on function public.can_write_order_document(text, text) from public;
grant execute on function public.can_access_order_document(text, text) to authenticated;
grant execute on function public.can_write_order_document(text, text) to authenticated;
grant select, insert, update, delete on public.order_documents to authenticated;

-- Sichere Kundenansicht: nur eigene Aufträge und explizit freigegebene,
-- vorab erzeugte customerPreview-Felder. Kein direkter Zugriff auf data.
create or replace function public.get_customer_portal_data(p_company_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_person public.company_people;
  v_company public.companies;
  v_orders jsonb := '[]'::jsonb;
  v_documents jsonb := '[]'::jsonb;
begin
  select * into v_person
  from public.company_people
  where company_id = p_company_id
    and auth_user_id = auth.uid()
    and role = 'kunde'
    and status = 'aktiv'
  limit 1;

  if not found then
    raise exception 'Kein aktiver Kundenzugang für diese Firma.';
  end if;

  select * into v_company from public.companies where id = p_company_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', orders.id,
    'customerPersonId', v_person.id,
    'product', orders.data ->> 'product',
    'orderType', orders.data ->> 'orderType',
    'date', orders.data ->> 'date',
    'time', orders.data ->> 'time',
    'status', orders.data ->> 'status',
    'address', orders.data ->> 'address',
    'customerNote', orders.data ->> 'customerNote',
    'customerContactName', coalesce(nullif(orders.data ->> 'customerContactName', ''), 'Ihr Kundenservice'),
    'customerConfirmed', coalesce(orders.data -> 'customerConfirmed', 'false'::jsonb),
    'customerConfirmedAt', orders.data ->> 'customerConfirmedAt',
    'nextMaintenanceDate', orders.data ->> 'nextMaintenanceDate',
    'customerPortal', public.customer_portal_safe_state(coalesce(orders.data -> 'customerPortal', '{}'::jsonb))
  ) order by orders.updated_at desc), '[]'::jsonb)
  into v_orders
  from public.orders orders
  where orders.company_id = p_company_id
    and (
      orders.customer_id = v_person.id
      or (orders.customer_id is null and orders.data ->> 'customerPersonId' = v_person.id)
    );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', document.id,
    'orderId', document.order_id,
    'fileName', document.file_name,
    'type', document.type,
    'title', document.title,
    'status', coalesce(document.data ->> 'customerStatus', document.status),
    'version', document.version,
    'signedStatus', document.signed_status,
    'documentNumber', document.document_number,
    'createdAt', document.created_at,
    'updatedAt', document.updated_at,
    'customerVisible', true,
    'customerVisibleAt', document.data ->> 'customerVisibleAt',
    'customerPreview', coalesce(document.data -> 'customerPreview', '[]'::jsonb)
  ) order by document.updated_at desc), '[]'::jsonb)
  into v_documents
  from public.order_documents document
  join public.orders orders
    on orders.id = document.order_id
   and orders.company_id = document.company_id
  where document.company_id = p_company_id
    and document.customer_visible = true
    and (
      orders.customer_id = v_person.id
      or (orders.customer_id is null and orders.data ->> 'customerPersonId' = v_person.id)
    );

  return jsonb_build_object(
    'customer', jsonb_build_object(
      'id', v_person.id,
      'name', v_person.name,
      'role', 'kunde',
      'status', v_person.status,
      'phone', v_person.phone,
      'email', v_person.email,
      'address', v_person.address
    ),
    'company', jsonb_build_object(
      'id', v_company.id,
      'name', v_company.name,
      'contactPhone', v_company.contact_phone,
      'contactEmail', v_company.contact_email
    ),
    'orders', v_orders,
    'pdfDocuments', v_documents
  );
end;
$$;

revoke all on function public.get_customer_portal_data(text) from public;
grant execute on function public.get_customer_portal_data(text) to authenticated;

commit;
