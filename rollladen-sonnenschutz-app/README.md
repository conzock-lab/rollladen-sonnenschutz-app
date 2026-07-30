# Rollladen & Sonnenschutz App

Web-App für Rollladen- und Sonnenschutzbetriebe.

Die App unterstützt Betriebe bei:

- Firmen-Login und geschütztem Zugriff
- Team- und Kundenverwaltung mit persönlichen Zugangscodes
- Aufträgen und Baustellenplanung
- Produktabhängigen Checklisten
- Aufmaß, Diagnose und Dokumentation
- Berichtsheft und Lernfortschritt für Azubis
- Kundenkommunikation und Abschlussprüfung
- Cloud-Synchronisation über Supabase

## Start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Vercel

- Root Directory: `rollladen-sonnenschutz-app`
- Install Command: `npm install --no-audit --no-fund`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: `24.x`

## Environment Variables

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```
