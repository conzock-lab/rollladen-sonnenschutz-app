-- Kundenportal 2.0: stabile Kundenzuordnung und eingeschränkte Portal-RPCs.
-- Additiv und idempotent. Vor produktiver Nutzung im Supabase SQL Editor prüfen
-- und manuell ausführen. Es werden keine bestehenden Aufträge oder Kunden gelöscht.

begin;

alter table public.companies add column if not exists contact_phone text not null default '';
alter table public.companies add column if not exists contact_email text not null default '';
alter table public.company_people add column if not exists email text not null default '';
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

-- Nur vorhandene, firmenidentische Kunden-IDs aus dem bestehenden JSON übernehmen.
update public.orders o
set customer_id = cp.id
from public.company_people cp
where o.customer_id is null
  and cp.id = o.data ->> 'customerPersonId'
  and cp.company_id = o.company_id
  and cp.role = 'kunde';

create index if not exists idx_orders_company_customer
  on public.orders (company_id, customer_id, updated_at desc);

create or replace function public.customer_portal_safe_state(p_portal jsonb)
returns jsonb
language sql
immutable
set search_path = public
as $$
  select jsonb_build_object(
    'appointmentRequests', coalesce((select jsonb_agg(jsonb_build_object(
      'id', item ->> 'id', 'createdAt', item ->> 'createdAt', 'updatedAt', item ->> 'updatedAt',
      'status', item ->> 'status', 'preferredDate', item ->> 'preferredDate', 'timeWindow', item ->> 'timeWindow',
      'message', item ->> 'message', 'proposedDate', item ->> 'proposedDate', 'proposedTime', item ->> 'proposedTime',
      'proposedAt', item ->> 'proposedAt', 'confirmedAt', item ->> 'confirmedAt'
    )) from jsonb_array_elements(coalesce(p_portal -> 'appointmentRequests', '[]'::jsonb)) item), '[]'::jsonb),
    'messages', coalesce((select jsonb_agg(jsonb_build_object(
      'id', item ->> 'id', 'createdAt', item ->> 'createdAt', 'updatedAt', item ->> 'updatedAt',
      'status', item ->> 'status', 'topic', item ->> 'topic', 'message', item ->> 'message', 'reply', item ->> 'reply'
    )) from jsonb_array_elements(coalesce(p_portal -> 'messages', '[]'::jsonb)) item), '[]'::jsonb),
    'issues', coalesce((select jsonb_agg(jsonb_build_object(
      'id', item ->> 'id', 'createdAt', item ->> 'createdAt', 'updatedAt', item ->> 'updatedAt',
      'status', item ->> 'status', 'category', item ->> 'category', 'description', item ->> 'description',
      'problemSince', item ->> 'problemSince', 'usable', item ->> 'usable',
      'photo', case when jsonb_typeof(item -> 'photo') = 'object' then jsonb_build_object(
        'name', item -> 'photo' ->> 'name', 'type', item -> 'photo' ->> 'type', 'dataUrl', item -> 'photo' ->> 'dataUrl'
      ) else 'null'::jsonb end,
      'reworkOrderId', item ->> 'reworkOrderId'
    )) from jsonb_array_elements(coalesce(p_portal -> 'issues', '[]'::jsonb)) item), '[]'::jsonb),
    'maintenanceRequests', coalesce((select jsonb_agg(jsonb_build_object(
      'id', item ->> 'id', 'createdAt', item ->> 'createdAt', 'updatedAt', item ->> 'updatedAt',
      'status', item ->> 'status', 'product', item ->> 'product', 'preferredPeriod', item ->> 'preferredPeriod', 'message', item ->> 'message'
    )) from jsonb_array_elements(coalesce(p_portal -> 'maintenanceRequests', '[]'::jsonb)) item), '[]'::jsonb),
    'approvals', coalesce((select jsonb_agg(jsonb_build_object(
      'id', item ->> 'id', 'createdAt', item ->> 'createdAt', 'updatedAt', item ->> 'updatedAt',
      'status', item ->> 'status', 'approvalType', item ->> 'approvalType', 'documentId', item ->> 'documentId'
    )) from jsonb_array_elements(coalesce(p_portal -> 'approvals', '[]'::jsonb)) item), '[]'::jsonb),
    'feedback', coalesce((select jsonb_agg(jsonb_build_object(
      'id', item ->> 'id', 'createdAt', item ->> 'createdAt', 'updatedAt', item ->> 'updatedAt',
      'status', item ->> 'status', 'rating', item -> 'rating', 'comment', item ->> 'comment'
    )) from jsonb_array_elements(coalesce(p_portal -> 'feedback', '[]'::jsonb)) item), '[]'::jsonb),
    'activities', coalesce((select jsonb_agg(jsonb_build_object(
      'id', item ->> 'id', 'type', item ->> 'type', 'label', item ->> 'label', 'createdAt', item ->> 'createdAt'
    )) from jsonb_array_elements(coalesce(p_portal -> 'activities', '[]'::jsonb)) item), '[]'::jsonb)
  );
$$;

-- Kunden erhalten ausschließlich eine Whitelist ihrer eigenen Daten.
-- Das vollständige orders.data-JSON und app_snapshots bleiben für Kunden gesperrt.
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
    'id', o.id,
    'customerPersonId', v_person.id,
    'product', o.data ->> 'product',
    'orderType', o.data ->> 'orderType',
    'date', o.data ->> 'date',
    'time', o.data ->> 'time',
    'status', o.data ->> 'status',
    'address', o.data ->> 'address',
    'customerNote', o.data ->> 'customerNote',
    'customerContactName', coalesce(nullif(o.data ->> 'customerContactName', ''), 'Ihr Kundenservice'),
    'customerConfirmed', coalesce(o.data -> 'customerConfirmed', 'false'::jsonb),
    'customerConfirmedAt', o.data ->> 'customerConfirmedAt',
    'nextMaintenanceDate', o.data ->> 'nextMaintenanceDate',
    'customerPortal', public.customer_portal_safe_state(coalesce(o.data -> 'customerPortal', '{}'::jsonb))
  ) order by o.updated_at desc), '[]'::jsonb)
  into v_orders
  from public.orders o
  where o.company_id = p_company_id
    and (
      o.customer_id = v_person.id
      or (o.customer_id is null and o.data ->> 'customerPersonId' = v_person.id)
    );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', document.value ->> 'id',
    'orderId', document.value ->> 'orderId',
    'fileName', document.value ->> 'fileName',
    'template', document.value ->> 'template',
    'status', coalesce(document.value ->> 'customerStatus', document.value ->> 'status'),
    'createdAt', document.value ->> 'createdAt',
    'customerVisible', true,
    'customerVisibleAt', document.value ->> 'customerVisibleAt',
    'customerPreview', coalesce(document.value -> 'customerPreview', '[]'::jsonb)
  ) order by document.value ->> 'createdAt' desc), '[]'::jsonb)
  into v_documents
  from public.app_snapshots snapshot
  cross join lateral jsonb_array_elements(coalesce(snapshot.snapshot -> 'pdfDocuments', '[]'::jsonb)) document
  where snapshot.company_id = p_company_id
    and (document.value ->> 'customerVisible') = 'true'
    and exists (
      select 1
      from jsonb_array_elements(v_orders) customer_order
      where customer_order ->> 'id' = document.value ->> 'orderId'
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

-- Portalaktionen werden serverseitig auf den angemeldeten Kunden, dessen Firma,
-- dessen Auftrag sowie eine feste Typ-/Feld-Whitelist begrenzt.
create or replace function public.save_customer_portal_action(
  p_company_id text,
  p_action_id text,
  p_order_id text,
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_person public.company_people;
  v_order jsonb;
  v_portal jsonb;
  v_collection text;
  v_entry jsonb;
  v_entries jsonb;
  v_activities jsonb;
  v_created_at text := to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
  v_label text;
  v_request_id text;
  v_rating integer;
begin
  if nullif(trim(p_action_id), '') is null or nullif(trim(p_order_id), '') is null then
    raise exception 'Kundenaktion ist unvollständig.';
  end if;

  select * into v_person
  from public.company_people
  where company_id = p_company_id
    and auth_user_id = auth.uid()
    and role = 'kunde'
    and status = 'aktiv'
  limit 1;

  if not found then
    raise exception 'Kein aktiver Kundenzugang.';
  end if;

  select data into v_order
  from public.orders
  where id = p_order_id
    and company_id = p_company_id
    and (
      customer_id = v_person.id
      or (customer_id is null and data ->> 'customerPersonId' = v_person.id)
    )
  for update;

  if v_order is null then
    raise exception 'Auftrag gehört nicht zu diesem Kundenkonto.';
  end if;

  v_portal := coalesce(v_order -> 'customerPortal', '{}'::jsonb);
  v_activities := coalesce(v_portal -> 'activities', '[]'::jsonb);

  if exists (select 1 from jsonb_array_elements(v_activities) item where item ->> 'id' = p_action_id) then
    return jsonb_build_object('ok', true, 'actionId', p_action_id, 'duplicate', true);
  end if;

  case p_action_type
    when 'appointment_confirmation' then
      if coalesce(v_order ->> 'date', '') = '' then
        raise exception 'Es ist noch kein Termin hinterlegt.';
      end if;
      if coalesce(v_order ->> 'customerConfirmed', 'false') = 'true' then
        return jsonb_build_object('ok', true, 'actionId', p_action_id, 'duplicate', true);
      end if;
      v_label := 'Termin bestätigt';
      v_request_id := coalesce(p_payload ->> 'requestId', '');
      v_entries := coalesce(v_portal -> 'appointmentRequests', '[]'::jsonb);
      if v_request_id <> '' then
        select coalesce(jsonb_agg(case when item ->> 'id' = v_request_id then item || jsonb_build_object('status', 'bestätigt', 'confirmedAt', v_created_at) else item end), '[]'::jsonb)
        into v_entries from jsonb_array_elements(v_entries) item;
        v_portal := jsonb_set(v_portal, '{appointmentRequests}', v_entries, true);
      end if;
      v_order := jsonb_set(v_order, '{customerConfirmed}', 'true'::jsonb, true);
      v_order := jsonb_set(v_order, '{customerConfirmedAt}', to_jsonb(v_created_at), true);

    when 'appointment_change' then
      v_collection := 'appointmentRequests';
      v_label := 'Terminänderung angefragt';
      v_entry := jsonb_build_object(
        'id', p_action_id, 'createdAt', v_created_at, 'status', 'Anfrage gesendet',
        'preferredDate', left(coalesce(p_payload ->> 'preferredDate', ''), 10),
        'timeWindow', case when p_payload ->> 'timeWindow' in ('vormittags','mittags','nachmittags','egal') then p_payload ->> 'timeWindow' else 'egal' end,
        'message', left(coalesce(p_payload ->> 'message', ''), 2000)
      );
      v_order := jsonb_set(v_order, '{customerConfirmed}', 'false'::jsonb, true);
      v_order := jsonb_set(v_order, '{customerConfirmedAt}', '""'::jsonb, true);

    when 'customer_message' then
      v_collection := 'messages';
      v_label := 'Rückfrage eingegangen';
      v_entry := jsonb_build_object(
        'id', p_action_id, 'createdAt', v_created_at, 'status', 'neu', 'reply', '',
        'topic', case when p_payload ->> 'topic' in ('Termin','Bedienung','Dokument','Pflege','Rechnung','Problem','Sonstiges') then p_payload ->> 'topic' else 'Sonstiges' end,
        'message', left(coalesce(p_payload ->> 'message', ''), 4000)
      );

    when 'customer_issue' then
      v_collection := 'issues';
      v_label := 'Problem gemeldet';
      v_entry := jsonb_build_object(
        'id', p_action_id, 'createdAt', v_created_at, 'status', 'gemeldet', 'reworkOrderId', '',
        'category', left(coalesce(p_payload ->> 'category', 'sonstiges'), 80),
        'description', left(coalesce(p_payload ->> 'description', ''), 4000),
        'problemSince', left(coalesce(p_payload ->> 'problemSince', ''), 10),
        'usable', case when p_payload ->> 'usable' in ('ja','eingeschränkt','nein') then p_payload ->> 'usable' else 'ja' end,
        'photo', case
          when length(coalesce(p_payload -> 'photo' ->> 'dataUrl', '')) <= 2800000 then coalesce(p_payload -> 'photo', 'null'::jsonb)
          else jsonb_build_object('name', left(coalesce(p_payload -> 'photo' ->> 'name', ''), 255), 'type', left(coalesce(p_payload -> 'photo' ->> 'type', ''), 120))
        end
      );

    when 'maintenance_request' then
      v_collection := 'maintenanceRequests';
      v_label := 'Wartung angefragt';
      v_entry := jsonb_build_object(
        'id', p_action_id, 'createdAt', v_created_at, 'status', 'neu',
        'product', left(coalesce(p_payload ->> 'product', ''), 120),
        'preferredPeriod', left(coalesce(p_payload ->> 'preferredPeriod', ''), 250),
        'message', left(coalesce(p_payload ->> 'message', ''), 2000)
      );

    when 'customer_approval' then
      v_collection := 'approvals';
      v_label := 'Freigabe bestätigt';
      v_entry := jsonb_build_object(
        'id', p_action_id, 'createdAt', v_created_at, 'status', 'bestätigt',
        'approvalType', left(coalesce(p_payload ->> 'approvalType', 'Kenntnisnahme'), 160),
        'documentId', left(coalesce(p_payload ->> 'documentId', ''), 160)
      );

    when 'customer_feedback' then
      v_collection := 'feedback';
      v_label := 'Feedback abgegeben';
      begin
        v_rating := greatest(1, least(5, (p_payload ->> 'rating')::integer));
      exception when others then
        v_rating := 0;
      end;
      v_entry := jsonb_build_object(
        'id', p_action_id, 'createdAt', v_created_at, 'status', 'intern',
        'rating', v_rating,
        'comment', left(coalesce(p_payload ->> 'comment', ''), 2000)
      );

    else
      raise exception 'Unzulässiger Typ für Kundenaktion.';
  end case;

  if v_collection is not null then
    v_entries := coalesce(v_portal -> v_collection, '[]'::jsonb);
    if not exists (select 1 from jsonb_array_elements(v_entries) item where item ->> 'id' = p_action_id) then
      v_entries := jsonb_build_array(v_entry) || v_entries;
      v_portal := jsonb_set(v_portal, array[v_collection], v_entries, true);
    end if;
  end if;

  v_activities := jsonb_build_array(jsonb_build_object(
    'id', p_action_id,
    'type', p_action_type,
    'label', v_label,
    'createdAt', v_created_at
  )) || v_activities;
  v_portal := jsonb_set(v_portal, '{activities}', v_activities, true);
  v_order := jsonb_set(v_order, '{customerPortal}', v_portal, true);
  v_order := jsonb_set(v_order, '{updatedAt}', to_jsonb(v_created_at), true);

  update public.orders
  set data = v_order,
      customer_id = coalesce(customer_id, v_person.id),
      updated_at = now()
  where id = p_order_id and company_id = p_company_id;

  return jsonb_build_object('ok', true, 'actionId', p_action_id, 'duplicate', false);
end;
$$;

revoke all on function public.get_customer_portal_data(text) from public;
revoke all on function public.save_customer_portal_action(text, text, text, text, jsonb) from public;
revoke all on function public.customer_portal_safe_state(jsonb) from public;
grant execute on function public.get_customer_portal_data(text) to authenticated;
grant execute on function public.save_customer_portal_action(text, text, text, text, jsonb) to authenticated;

commit;
