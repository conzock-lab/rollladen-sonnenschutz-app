# Kundenportal 2.0 – Datenmodell und RLS

Stand: 15. August 2026. Diese Notiz beschreibt die Repository-Migration. Sie bestätigt nicht, dass dieselben Policies bereits im produktiven Supabase-Projekt aktiv sind.

## Bestehende Daten werden weiterverwendet

- Aufträge bleiben in `public.orders`; der tatsächliche Termin bleibt `orders.data.date` und `orders.data.time` und damit Teil der Baustellenplanung.
- Kundenportal-Aktionen liegen im kundenbezogenen Bereich `orders.data.customerPortal` und erscheinen dadurch auch in der zentralen Auftragsakte.
- PDF-Metadaten bleiben im bestehenden `app_snapshots.snapshot.pdfDocuments`-Bereich. Ein Dokument wird nur mit `customerVisible: true` ausgeliefert.
- Es wird keine zweite Auftrags-, Kalender- oder Dokumentverwaltung eingeführt.

## Migration

`20260815_customer_portal.sql` ergänzt additiv:

- `orders.customer_id` als stabilen Fremdschlüssel auf `company_people.id`
- den Index `idx_orders_company_customer`
- öffentliche Firmen-Kontaktfelder `companies.contact_phone` und `companies.contact_email`
- optional `company_people.email`
- eine strikt whitelisted Version von `get_customer_portal_data`
- den idempotenten RPC `save_customer_portal_action`

Vorhandene `orders.data.customerPersonId`-Werte werden nur übernommen, wenn Person, Rolle und Firma eindeutig passen. Eine reine Namenszuordnung wird nicht als Sicherheitsbeziehung verwendet.

## RLS-Entscheidung

Kunden erhalten absichtlich **keine** direkte Select-Policy auf `orders`. RLS kann zwar Zeilen filtern, aber nicht die internen Schlüssel innerhalb von `orders.data jsonb` verbergen. Ein direkter Select würde daher interne Notizen, Diagnose, Team- oder Einkaufsinformationen derselben Auftragszeile offenlegen.

Stattdessen liefert `get_customer_portal_data` ausschließlich freigegebene Felder und Dokumentmetadaten. `save_customer_portal_action` prüft serverseitig:

1. gültige Auth-Sitzung,
2. aktive Kundenrolle in der angeforderten Firma,
3. stabile Kundenzuordnung des Auftrags,
4. erlaubten Aktionstyp,
5. eine feste Feld- und Längen-Whitelist,
6. die Aktions-ID zur idempotenten Wiederholung aus der Offline-Queue.

Beide Funktionen werden `public` entzogen und nur `authenticated` erteilt. Bestehende Admin- und Außendienst-Policies werden nicht gelockert.

## Vor dem produktiven Rollout prüfen

- Migration zunächst in einer Staging-Instanz ausführen.
- Mit zwei verschiedenen Kundenkonten prüfen, dass jeder RPC nur eigene Aufträge liefert.
- Prüfen, dass Dokumente ohne `customerVisible: true` nicht zurückgegeben werden.
- Prüfen, dass Kunden weder `orders`, `app_snapshots`, `company_absences` noch fremde `company_people` direkt lesen können.
- Alte Aufträge ohne `customerPersonId` im internen Team-/Auftragsbereich einem persönlichen Kundenkonto zuordnen.

## Bekannte Grenze

Problemfotos werden im aktuellen local-first Prototyp als begrenzte Data-URL im Kundenaktionsdatensatz gespeichert. Für einen produktiven Betrieb sollte dafür Supabase Storage mit kunden- und auftragsgebundenen Objektpfaden sowie eigenen Storage-Policies verwendet werden.
