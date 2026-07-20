# Rollladen & Sonnenschutz App

React/Vite-Prototyp für Rollladen- und Sonnenschutzbetriebe.

## Neu in Version 1.1

- Firma & Team Bereich
- persönliche Zugangscodes für Vorarbeiter, Monteure, Azubis und Kunden
- Anmeldung mit Name + Code ohne E-Mail im Demo-Modus
- Kunden warten auf Freigabe, bevor sie aktiv sind
- Firmenverzeichnis mit Team, Kunden, Status, Codes und Lernfortschritt
- Baustellenplanung mit Zuweisung von Aufträgen an Teammitglieder und Kunden
- Rollenfilter: Vorarbeiter/Monteur/Azubi/Kunde sehen nur passende Baustellen im Prototyp
- Backup/Cloud-Simulation enthält jetzt Firma und Verzeichnis
- Supabase Tabellen-Vorschlag unter `supabase/team-schema.sql`

## Lokal starten

```bash
npm install
npm run dev
```

## Für Vercel

- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory bei deinem GitHub-Aufbau: `rollladen-sonnenschutz-app`

## Hinweis

Der aktuelle Stand ist ein funktionierender Frontend-Prototyp mit localStorage und Demo-Cloud. Für echte Sicherheit über mehrere Geräte braucht es Supabase/Firebase + Row Level Security.
