export const roles = [
  { id: "dev", label: "Dev", description: "Entwickleransicht mit allen App-Bereichen und Systemdiagnose." },
  { id: "meister", label: "Meister", description: "Planung, Qualität, Normen, Freigaben und Teamverwaltung." },
  { id: "buero", label: "Büro", description: "Aufmaß, Kunden, PDFs, Termine und Auftragsverwaltung." },
  { id: "vorarbeiter", label: "Vorarbeiter", description: "Eigene Kolonne, Baustellenzuweisung, Fotos und Abschlussprüfung." },
  { id: "monteur", label: "Monteur", description: "Zugewiesene Aufträge, Montage, Diagnose, Fotos und Protokolle." },
  { id: "azubi", label: "Azubi", description: "Lernen, Berichtsheft, Sicherheit und zugewiesene Baustellen." },
  { id: "kunde", label: "Kunde", description: "Eigene Termine, Auftragsstatus, Pflegehinweise und Dokumente." },
];

export const roleHomeConfig = {
  dev: { title: "Dev-Systemübersicht", subtitle: "Alle Rollen, Module, Sync-Status und Testdaten im Blick.", focus: ["Alle Rollen testen", "Supabase-Sync prüfen", "PDF-Export testen", "Persönliche Codes kontrollieren"] },
  meister: { title: "Betriebsübersicht", subtitle: "Aufträge, Team, Qualität, Berichte und Kundenkommunikation steuern.", focus: ["Offene Aufträge priorisieren", "Team einteilen", "Berichte freigeben", "Abschlüsse prüfen"] },
  buero: { title: "Büro-Cockpit", subtitle: "Termine, Kunden, Angebote, PDFs und Auftragsdaten vorbereiten.", focus: ["Kundendaten pflegen", "PDFs vorbereiten", "Termine kontrollieren", "Angebote erstellen"] },
  vorarbeiter: { title: "Kolonnenübersicht", subtitle: "Eigene Baustellen, Teamfortschritt, Fotos und Abschlussprüfung.", focus: ["Tagesplan prüfen", "Team zuweisen", "Fotos kontrollieren", "Abschluss vorbereiten"] },
  monteur: { title: "Monteur-Start", subtitle: "Zugewiesene Baustellen, Checklisten, Fotos und Diagnose direkt starten.", focus: ["Nächste Baustelle öffnen", "Checkliste abhaken", "Fotos ergänzen", "Auftrag abschließen"] },
  azubi: { title: "Azubi-Start", subtitle: "Berichtsheft, Lernfortschritt, Quiz und zugewiesene Baustellen.", focus: ["Tagesbericht schreiben", "Quiz wiederholen", "Meister-Kommentar prüfen", "Baustellen lernen"] },
  kunde: { title: "Kundenportal", subtitle: "Eigene Termine, Auftragsstatus, Pflegehinweise und Dokumente.", focus: ["Termin prüfen", "Auftragsstatus ansehen", "Pflegehinweis lesen", "Dokumente herunterladen"] },
};

export const teamRoleOptions = [
  { id: "meister", label: "Meister", prefix: "MEI", description: "Verwaltet Betrieb, Team, Qualität und Freigaben." },
  { id: "buero", label: "Büro", prefix: "BUE", description: "Verwaltet Kunden, Termine, Aufträge, PDFs und das Verzeichnis." },
  { id: "vorarbeiter", label: "Vorarbeiter", prefix: "VOR", description: "Sieht die eigene Kolonne und zugehörige Baustellen." },
  { id: "monteur", label: "Monteur", prefix: "MON", description: "Sieht zugewiesene Baustellen, Checklisten, Fotos und Diagnose." },
  { id: "azubi", label: "Azubi", prefix: "AZU", description: "Sieht Lernen, Berichtsheft und zugewiesene Baustellen." },
  { id: "kunde", label: "Kunde", prefix: "KUN", description: "Sieht ohne Freigabeschritt nur das eigene Kundenportal." },
];

export const permissionRoles = [
  { id: "dev", label: "Dev" },
  { id: "meister", label: "Meister" },
  { id: "buero", label: "Büro" },
  { id: "vorarbeiter", label: "Vorarbeiter" },
  { id: "monteur", label: "Monteur" },
  { id: "azubi", label: "Azubi" },
  { id: "kunde", label: "Kunde" },
];

export const permissionLevels = {
  allowed: { label: "Erlaubt", shortLabel: "Erlaubt" },
  limited: { label: "Eingeschränkt", shortLabel: "Eingeschr." },
  denied: { label: "Nicht erlaubt", shortLabel: "Nein" },
};

const access = (level, note) => ({ level, note });

export const rolePermissionMatrix = [
  {
    group: "Aufträge",
    permissions: [
      { area: "Aufträge ansehen", dev: access("allowed", "Alle"), meister: access("allowed", "Firma"), buero: access("allowed", "Firma"), vorarbeiter: access("limited", "Eigene Kolonne"), monteur: access("limited", "Zugewiesen"), azubi: access("limited", "Zugewiesen"), kunde: access("limited", "Eigene") },
      { area: "Anlegen und bearbeiten", dev: access("allowed", "Vollzugriff"), meister: access("allowed", "Vollzugriff"), buero: access("allowed", "Vollzugriff"), vorarbeiter: access("limited", "Status und Team"), monteur: access("limited", "Status und Checkliste"), azubi: access("limited", "Checkliste und Bericht"), kunde: access("denied", "-") },
    ],
  },
  {
    group: "Team",
    permissions: [
      { area: "Personen und Codes verwalten", dev: access("allowed", "Persönlich"), meister: access("allowed", "Persönlich"), buero: access("allowed", "Persönlich"), vorarbeiter: access("limited", "Team lesen"), monteur: access("denied", "-"), azubi: access("denied", "-"), kunde: access("denied", "-") },
      { area: "Baustellen zuweisen", dev: access("allowed", "Alle"), meister: access("allowed", "Alle"), buero: access("allowed", "Alle"), vorarbeiter: access("allowed", "Eigene Kolonne"), monteur: access("limited", "Zuweisung sehen"), azubi: access("limited", "Zuweisung sehen"), kunde: access("denied", "-") },
    ],
  },
  {
    group: "Kunden",
    permissions: [
      { area: "Kundendaten", dev: access("allowed", "Firma"), meister: access("allowed", "Firma"), buero: access("allowed", "Firma"), vorarbeiter: access("limited", "Auftragsbezogen"), monteur: access("limited", "Auftragsbezogen"), azubi: access("limited", "Auftragsbezogen"), kunde: access("limited", "Eigene") },
      { area: "Kundenportal", dev: access("allowed", "Testen"), meister: access("allowed", "Verwalten"), buero: access("allowed", "Verwalten"), vorarbeiter: access("limited", "Status sehen"), monteur: access("limited", "Status sehen"), azubi: access("denied", "-"), kunde: access("allowed", "Eigenes Portal") },
    ],
  },
  {
    group: "PDFs",
    permissions: [
      { area: "PDF-Vorschau erstellen", dev: access("allowed", "Alle"), meister: access("allowed", "Alle"), buero: access("allowed", "Alle"), vorarbeiter: access("allowed", "Zugewiesen"), monteur: access("allowed", "Zugewiesen"), azubi: access("limited", "Berichtsheft"), kunde: access("denied", "-") },
      { area: "Dokumente ansehen", dev: access("allowed", "Alle"), meister: access("allowed", "Alle"), buero: access("allowed", "Alle"), vorarbeiter: access("limited", "Zugewiesen"), monteur: access("limited", "Zugewiesen"), azubi: access("limited", "Eigene Berichte"), kunde: access("limited", "Eigene") },
    ],
  },
  {
    group: "Lernen/Berichtsheft",
    permissions: [
      { area: "Lernfortschritt", dev: access("allowed", "Ansehen"), meister: access("allowed", "Begleiten"), buero: access("allowed", "Ansehen"), vorarbeiter: access("limited", "Team begleiten"), monteur: access("denied", "-"), azubi: access("allowed", "Eigenen pflegen"), kunde: access("denied", "-") },
      { area: "Berichtsheft", dev: access("allowed", "Alle"), meister: access("allowed", "Prüfen"), buero: access("limited", "Übersicht"), vorarbeiter: access("limited", "Zugewiesen"), monteur: access("denied", "-"), azubi: access("allowed", "Eigenes schreiben"), kunde: access("denied", "-") },
    ],
  },
  {
    group: "Diagnose/Wissen",
    permissions: [
      { area: "Diagnose und Wissen nutzen", dev: access("allowed", "Alle"), meister: access("allowed", "Alle"), buero: access("limited", "Dokumentation"), vorarbeiter: access("allowed", "Alle"), monteur: access("allowed", "Alle"), azubi: access("allowed", "Lernzugriff"), kunde: access("limited", "Pflegehinweise") },
      { area: "Fachinhalte pflegen", dev: access("allowed", "Alle"), meister: access("allowed", "Freigeben"), buero: access("limited", "Dokumentation"), vorarbeiter: access("denied", "-"), monteur: access("denied", "-"), azubi: access("denied", "-"), kunde: access("denied", "-") },
    ],
  },
  {
    group: "Einstellungen",
    permissions: [
      { area: "Firma und Team verwalten", dev: access("allowed", "Alle"), meister: access("allowed", "Firma"), buero: access("allowed", "Firma"), vorarbeiter: access("denied", "-"), monteur: access("denied", "-"), azubi: access("denied", "-"), kunde: access("denied", "-") },
      { area: "Rechte-Matrix ansehen", dev: access("allowed", "Alle"), meister: access("allowed", "Firma"), buero: access("allowed", "Firma"), vorarbeiter: access("denied", "-"), monteur: access("denied", "-"), azubi: access("denied", "-"), kunde: access("denied", "-") },
    ],
  },
  {
    group: "Dev/System",
    permissions: [
      { area: "Sync und Systemdiagnose", dev: access("allowed", "Vollzugriff"), meister: access("limited", "Status"), buero: access("limited", "Status"), vorarbeiter: access("denied", "-"), monteur: access("denied", "-"), azubi: access("denied", "-"), kunde: access("denied", "-") },
      { area: "Dev-Rollenwechsel", dev: access("allowed", "Alle Rollen"), meister: access("denied", "-"), buero: access("denied", "-"), vorarbeiter: access("denied", "-"), monteur: access("denied", "-"), azubi: access("denied", "-"), kunde: access("denied", "-") },
    ],
  },
];
