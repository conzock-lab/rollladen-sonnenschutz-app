# Rollladen & Sonnenschutz App

React/Vite-Prototyp für Rollladen- und Sonnenschutzmechatroniker.

## Start lokal

```bash
npm install
npm run dev
```

## Deployment

Build Command: `npm run build`  
Output Directory: `dist`

## Supabase aktivieren

1. In Vercel unter **Settings → Environment Variables** eintragen:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. In Supabase den SQL Editor öffnen.
3. Datei `supabase/company-codes-schema.sql` komplett ausführen.
4. In Supabase **Authentication → Providers → Anonymous Sign-ins** aktivieren.
5. In Vercel neu deployen.

## Neue echte Backend-Funktionen

- Firma mit E-Mail/Passwort registrieren
- Firma mit E-Mail/Passwort einloggen
- Supabase-Anbindung über `src/lib/supabase.js`
- Persönlicher Code-Login für Vorarbeiter, Monteure, Azubis und Kunden
- Code-Login nutzt Supabase Anonymous Auth
- Firma & Verzeichnis werden in Supabase gespeichert
- Aufträge werden in Supabase gespeichert
- App-Snapshot speichert Checklisten, Aufmaß, Berichte und Notizen als JSON
- lokale Demo-Cloud und Backup bleiben zusätzlich erhalten

## Wichtige Hinweise

- Niemals den Supabase `service_role` Key im Frontend/Vercel als `VITE_...` speichern.
- Für das Frontend nur den `anon public` Key verwenden.
- Kunden und Monteure bekommen persönliche Zugangscodes aus dem Bereich **Firma & Team**.
