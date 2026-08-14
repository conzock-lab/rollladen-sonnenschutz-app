# Baustellenplanung 2.0 – Datenmodell

Die Planung verwendet weiterhin `public.orders` als einzige Auftragsquelle. Es wird keine zweite Auftrags- oder Terminverwaltung angelegt.

## Bestehende Strukturen

- Auftragstermin: `orders.data.date` und `orders.data.time`
- temporäre Teamzuweisung: `orders.data.assignedMemberIds` und der kompatible Anzeigewert `assignedTo`
- feste Kolonne einer Person: `company_people.team`
- Auftragsstatus, Kunde, Produkt und Adresse: vorhandene Felder in `orders.data`
- Ersatzteilhinweise: vorhandene, auftragsbezogene `partRequests` im App-Snapshot

## Neue Planungsfelder im vorhandenen JSON-Datensatz

- `crew`
- `estimatedDuration`
- `planningNote`
- `planningRevision`
- `planningUpdatedAt`
- `materialStatus`

Die flexible JSON-Struktur der vorhandenen Tabelle reicht für diese Felder aus. Zusätzliche Spalten oder eine parallele `order_assignments`-Tabelle sind daher nicht erforderlich.

## Neue Tabelle

`public.company_absences` speichert Urlaub, Krankheit, Schule, Berufsschule, Lehrgang und weitere Abwesenheiten. Die Migration `20260815_planning.sql` ist additiv und idempotent.

## Rollen und Offline-Konflikte

Dev, Meister und Büro verwalten Planung und Abwesenheiten. Vorarbeiter und Monteure können über die eingeschränkte Funktion `update_assigned_order_work` nur Arbeitsstatus und Baustellennotizen ihrer zugewiesenen Aufträge synchronisieren. Termin- und Teamänderungen bleiben Adminrollen vorbehalten.

Offline-Änderungen enthalten eine lokale `planningRevision` und die Queue speichert die Ausgangsrevision. Eine automatische Merge-Engine existiert bewusst nicht. Bei konkurrierenden Änderungen muss ein späterer Serververgleich ergänzt werden; bis dahin zeigt die App wartende Synchronisierung sichtbar an und überschreibt nicht heimlich im Hintergrund.
