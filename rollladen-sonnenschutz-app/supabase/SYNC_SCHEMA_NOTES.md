# Speicherung und Supabase-Sync

Stand: 14. August 2026. Diese Notiz beschreibt den im Repository vorhandenen Code und ersetzt keine Prüfung des tatsächlich deployten Supabase-Projekts.

## Lokale Speicherung

Die App arbeitet local-first. Folgende Daten werden im Browser gespeichert und stehen nach einem Neuladen weiterhin zur Verfügung:

- Aufträge, ausgewählter Auftrag, Checklisten, Notizen und Aufmaßwerte
- Qualitäts-/Abschlussprüfungen und Fotoanalysen beziehungsweise Foto-Metadaten
- Berichtsheft-Einträge und Lernfortschritt
- Firma und Personenverzeichnis
- PDF-Formulardaten und PDF-Metadaten
- Ersatzteil-Anfragen
- freie und gespeicherte Skizzen
- Navigationseinstellungen, lokaler Loginzustand, Sync-Protokoll und Sync-Warteschlange

Auftragsfotos werden für den lokalen Prototyp als Data-URL mit Kategorie, Datum und Notiz gespeichert. Das macht sie nach einem Neuladen lokal verfügbar, ersetzt aber keinen produktiven Datei-Upload. Für größere Datenmengen ist später Supabase Storage mit RLS-geschützten Objektpfaden erforderlich.

## Cloud-Speicherung

Der aktuelle Client verwendet keine fachbezogenen Paralleltabellen, sondern die bereits vorhandenen Tabellen:

| Tabelle | Verwendung |
| --- | --- |
| `companies` | Firmenstammdaten und Eigentümer |
| `company_people` | Personen, persönliche Codes, Rolle und Firmenzuordnung |
| `orders` | ein Datensatz pro Auftrag; Fachdaten liegen derzeit in `data jsonb` |
| `app_snapshots` | vollständiger App-Snapshot für Checklisten, Lernen, Berichtsheft, Skizzen, PDF-Metadaten und weitere lokale Bereiche |

Zusätzlich werden die RPCs `create_company_for_current_user`, `claim_person_access` und `get_customer_portal_data` verwendet. Eine Tabelle `order_assignments` ist im vorhandenen Schema nicht definiert. Zuordnungen liegen aktuell in `orders.data` (`assignedMemberIds`, `assignedTo`, `customerPersonId`). Daher wurde keine zweite Zuordnungsstruktur eingeführt.

## Schema-Prüfung

Für den jetzigen Snapshot-Sync sind in den Repository-SQL-Dateien alle direkt benötigten Tabellen und Spalten vorhanden. Vorhandene Foreign Keys:

- `company_people.company_id -> companies.id` mit `on delete cascade`
- `orders.company_id -> companies.id` mit `on delete cascade`
- `app_snapshots.company_id -> companies.id` mit `on delete cascade`
- `companies.owner_id`, `company_people.auth_user_id` und `app_snapshots.updated_by -> auth.users.id` mit `on delete set null`

Die additive Migration `20260814_sync_indexes.sql` ergänzt nur zusammengesetzte Indizes für die bereits ausgeführten Listenabfragen. Sie löscht keine Daten und verändert keine RLS-Regeln.

## RLS-Hinweis für den nächsten Sicherheitsschritt

RLS ist für alle vier Tabellen aktiviert. Nach dem Repository-Schema dürfen `dev`, `meister` und `buero` Firmen-, Personen-, Auftrags- und Snapshot-Daten verwalten. Vorarbeiter, Monteure und Azubis können ihnen zugewiesene Aufträge lesen, aber `orders` und `app_snapshots` nicht direkt schreiben. Das bedeutet: Ihre Offline-Änderungen bleiben sicher lokal in der Queue, ein direkter Cloud-Sync wird jedoch von RLS abgewiesen.

Die Policies wurden bewusst nicht automatisch gelockert. Empfohlen ist ein eigener, sicherheitsgeprüfter RPC für erlaubte Feldänderungen. Dieser sollte Authentifizierung, Firmenmitgliedschaft, Auftragszuweisung, erlaubte JSON-Felder und Konflikte serverseitig validieren. Erst danach sollten passende RLS-Policies oder RPC-Berechtigungen separat ausgerollt und mit jeder Rolle getestet werden.

## Bekannte Modellgrenzen

- Der Snapshot ist derzeit die gemeinsame Cloud-Wahrheit für viele Fachbereiche. Gleichzeitige Änderungen mehrerer Geräte werden noch nicht feldweise zusammengeführt; der letzte erfolgreiche Snapshot gewinnt.
- Die lokale Queue beschreibt einzelne Änderungen, synchronisiert aber aktuell bewusst den vollständigen Snapshot plus die normalisierten Firmen-, Personen- und Auftragszeilen.
- Ein separates Datei-Storage-Konzept für Originalfotos und Skizzenbilder ist noch nicht vorhanden.
- `team-schema.sql` und `company-codes-schema.sql` enthalten weitgehend dasselbe Vollschema. Künftig sollte eine einzige nummerierte Migrationskette die verbindliche Quelle werden.
