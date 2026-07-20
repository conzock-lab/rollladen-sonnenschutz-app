# Bereinigte Login- und Team-Version

Änderungen in dieser Version:

- Login steht weiter vor der App.
- Demo-Zugang auf der Login-Seite wurde entfernt.
- Platzhalter/Beispieldaten wurden anonymisiert:
  - Max Mustermann
  - max.mustermann@example.com
  - Muster Sonnenschutz GmbH
- Innerhalb der App wurde die zusätzliche Name+Code-Login-Box entfernt.
- Allgemeine Firmen-Codes wurden aus dem Bereich „Firma & Team“ entfernt.
- Personen werden direkt im Verzeichnis erstellt und erhalten persönliche Zugangscodes.
- Kunden sind nach Erstellung direkt aktiv; der Hinweis „wartet auf Freigabe“ wurde entfernt.
- Im Formular „Person erstellen“ erscheint Ausbildungsjahr nur bei Azubi.
- Kolonne/Team erscheint nicht mehr bei Kunden.
- Verzeichnis nutzt neutrale Musterdaten.

Vercel-Einstellungen:

- Root Directory: rollladen-sonnenschutz-app
- Install Command: npm install --no-audit --no-fund
- Build Command: npm run build
- Output Directory: dist
- Node.js Version: 24.x

Wichtig: package-lock.json und npm-shrinkwrap.json bitte nicht hochladen.
