# Auftragsakte und Supabase-Schema

Stand: 14. August 2026.

Für die zentrale Auftragsakte ist aktuell keine neue SQL-Migration erforderlich. Die vorhandene Tabelle `public.orders` speichert die erweiterbaren Auftragsdaten bereits in `data jsonb`; der vollständige lokale Zustand wird zusätzlich in `public.app_snapshots.snapshot` gesichert.

## Weiterverwendete Beziehungen

- Teamzuweisungen: `orders.data.assignedMemberIds` und der kompatible Anzeigewert `assignedTo`
- Kundenverknüpfung: `orders.data.customerPersonId`
- Status und Verlauf: `orders.data.status` und `statusHistory`
- Diagnoseergebnisse: `orders.data.diagnoses`
- Notizbereiche: `internalNotes`, `technicianNote`, `customerNote`, `completionNote`
- Aufmaß, Checklisten, Foto-Metadaten, PDF-Metadaten, Skizzen und Ersatzteilanfragen: bestehende Snapshot-Bereiche mit `orderId`

Es wurde bewusst keine parallele Tabelle `order_assignments`, `order_photos` oder `order_events` eingeführt. Die bestehende App synchronisiert weiterhin den vollständigen Snapshot sowie normalisierte Auftragszeilen.

## Späterer Ausbauschritt

Bei gleichzeitigem produktivem Mehrbenutzerbetrieb sollten Fotos in Supabase Storage und stark wachsende Verläufe beziehungsweise Diagnosen in eigene normalisierte Tabellen verschoben werden. Dieser Schritt benötigt vorab ein Rollen-/RLS-Konzept und eine konfliktfähige Synchronisierung. Die aktuelle RLS-Einschränkung für Vorarbeiter, Monteure und Azubis bleibt unverändert; es wurde keine Policy automatisch gelockert.
