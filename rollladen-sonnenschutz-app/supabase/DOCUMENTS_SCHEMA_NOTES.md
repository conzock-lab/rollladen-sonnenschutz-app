# Dokumente & PDF 2.0 – Schemahinweise

Die App behält `pdfDocuments` als eine zentrale lokale Datenquelle. Im Browser werden Entwürfe, Metadaten, Versionen und die sichere Kundenvorschau sofort in `localStorage` gespeichert; die vorhandene Sync-Queue verwendet dafür den Typ `pdfMetadata`. Es wurde keine zweite Dokumentenoberfläche und keine zweite Queue eingeführt.

## Migration

`20260815_order_documents.sql` ist additiv, idempotent und muss nach `20260815_customer_portal.sql` manuell in einer Test-/Staging-Umgebung ausgeführt werden. Sie:

- ergänzt optionale Firmenkopf-Felder auf `companies`,
- legt `order_documents` mit Fremdschlüsseln auf `companies`, `orders` und optional `company_people` an,
- ergänzt Indizes für Auftrag, Kundenfreigabe, Status und Dokumentnummer,
- übernimmt gültige, auftragsbezogene Alt-Dokumente einmalig aus `app_snapshots.snapshot.pdfDocuments`,
- lässt auftragslose oder inkonsistente Altobjekte unverändert im Snapshot,
- ersetzt die Kundenportal-Lesefunktion durch eine Whitelist aus `order_documents`.

Die App schreibt den Gesamtsnapshot vorerst weiter als Abwärtskompatibilität. `order_documents` ist die normalisierte Dokumentablage; dies ist keine parallele Fachfunktion.

## RLS und Kundenschutz

Kunden erhalten absichtlich keine direkte `SELECT`-Policy auf `order_documents`: Die Spalte `data` kann interne Diagnose-, Kalkulations- oder Historienfelder enthalten. `get_customer_portal_data` gibt nur Dokumente der stabil per `orders.customer_id` zugeordneten eigenen Aufträge aus, sofern `customer_visible = true`; ausgeliefert wird ausschließlich die beim Speichern erzeugte `customerPreview` plus freigegebene Metadaten.

Dev, Meister und Büro können Firmendokumente verwalten. Vorarbeiter und Monteure können Dokumente nur für zugewiesene Aufträge lesen/schreiben. Azubis können zugewiesene Dokumente lesen. Archivieren erfolgt in der App als Statusänderung; physisches Löschen bleibt administrativ begrenzt.

Vor dem Produktivlauf sollten die Rollen in Supabase mit getrennten Testkonten geprüft werden. Besonders zu testen sind Fremdfirmenzugriff, unzugewiesene Aufträge, entzogene Kundenfreigaben und der Ausschluss interner Felder. Die Migration wird bewusst nicht automatisch durch die App ausgeführt.

## Bekannte technische Grenze

Das Firmenlogo wird aktuell als kompaktes lokales Data-URL-Feld gespeichert (Upload-Limit in der UI: 1,5 MB). Für viele oder größere Logos sollte später ein privater Supabase-Storage-Bucket mit signierten URLs und eigener RLS eingeführt werden. Digitale Canvas-Unterschriften dienen nur der Dokumentation und sind keine qualifizierten elektronischen Signaturen.
