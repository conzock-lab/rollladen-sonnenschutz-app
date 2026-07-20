# Rollladen & Sonnenschutz Assistent

React/Vite-Prototyp für eine Monteur-App für Rollladen- und Sonnenschutzmechatroniker.

## Enthalten

- Responsive Handy-/Tablet-/Desktop-Layout
- Mobile Bottom Navigation
- Rollen: Dev, Azubi, Monteur, Meister, Büro, Kunde
- Aufträge anlegen, bearbeiten, suchen und lokal speichern
- Dynamische Checklisten nach Produkt, Untergrund, Antrieb, Einbauart und Windlage
- Tagesübersicht
- Aufmaß-Assistent mit Pflichtfeldern
- Produkt-Lexikon
- Werkzeug- und Untergrund-Assistent
- Motoren & Steuerungen
- Fehlerdiagnose mit Schrittmodus
- Herstellerdatenbank-Struktur
- Angebotsassistent
- Foto-KI-Demo mit Upload und Analyse-Simulation
- Ersatzteil-Finder mit Anfrageformular
- Kundenkommunikation mit kopierbaren Texten
- Wartung & Pflege
- Lernmodus mit Quiz
- Berichtsheft mit Tages-/Wochenbericht, Vorlagen, Freigabe, Export und Speicherfunktion
- Auftrag abschließen mit Qualitätsprüfung
- PDF-/Druck-Vorbereitung
- Offline-Schalter
- Demo-Login, Cloud-Simulation, Backup/Restore
- Notizen und KI-Demoantwort

## Starten

```bash
npm install
npm run dev
```

Dann im Browser die angezeigte localhost-Adresse öffnen, meistens:

```bash
http://localhost:5173
```

## Hinweis

Der Prototyp speichert Daten aktuell lokal im Browser über `localStorage`. Für echte Nutzer, Geräte-Synchronisierung, Cloud-Fotos und Online-Login muss später Supabase oder Firebase angebunden werden.
