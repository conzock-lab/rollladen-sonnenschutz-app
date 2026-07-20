# Login zuerst + automatische Cloud-Synchronisation

Diese Version sperrt die App hinter eine Login-Oberfläche.

## Neu

- Die eigentliche App wird erst nach Anmeldung angezeigt.
- Firmen melden sich per E-Mail/Passwort über Supabase an.
- Monteure, Vorarbeiter, Azubis und Kunden melden sich mit Name + persönlichem Code an.
- Nach erfolgreichem Login werden Cloud-Daten automatisch aus Supabase geladen.
- Änderungen an Aufträgen, Checklisten, Team, Berichten, Aufmaß und Notizen werden automatisch nach Supabase gespeichert.
- Oben in der App gibt es einen Auto-Sync-Status und einen Schalter zum Ein-/Ausschalten.
- Nicht-Dev-Nutzer können ihre Rolle oben nicht mehr einfach auf Dev wechseln.

## Vercel Einstellungen

Root Directory: rollladen-sonnenschutz-app
Install Command: npm install --no-audit --no-fund
Build Command: npm run build
Output Directory: dist
Node.js Version: 24.x

## Wichtig

In GitHub bitte keine package-lock.json hochladen, falls sie noch alte interne Registry-Links enthält.
Die Datei .npmrc verweist auf die öffentliche npm Registry.
