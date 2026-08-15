export const DOCUMENT_STATUSES = [
  "Entwurf",
  "Erstellt",
  "Zur Freigabe",
  "Freigegeben",
  "Gesendet",
  "Unterschrieben",
  "Archiviert",
];

export const DOCUMENT_TYPES = [
  "Montageprotokoll",
  "Aufmaßblatt",
  "Wartungsprotokoll",
  "Kundenübergabe",
  "Angebotsentwurf",
  "Berichtsheft-Eintrag",
  "Nacharbeitsprotokoll",
  "Reklamationsprotokoll",
  "Prüf-/Funktionsprotokoll",
  "Sonstiges Dokument",
];

const check = (key, label, section, options = {}) => ({ key, label, section, type: "checkbox", ...options });
const text = (key, label, section, options = {}) => ({ key, label, section, type: "text", ...options });
const area = (key, label, section, options = {}) => ({ key, label, section, type: "textarea", ...options });
const select = (key, label, section, options, extra = {}) => ({ key, label, section, type: "select", options, ...extra });

export const documentTemplateDefinitions = {
  Montageprotokoll: {
    code: "MP",
    title: "Montageprotokoll",
    description: "Montage, Prüfung, Kundenübergabe und offene Punkte nachvollziehbar dokumentieren.",
    customerSafe: true,
    fields: [
      text("monteur", "Monteur / Vorarbeiter", "Auftrag", { auto: "assignedTo", required: true }),
      text("montageDate", "Montagedatum", "Auftrag", { type: "date", auto: "date", required: true }),
      text("startTime", "Beginn", "Auftrag", { type: "time", auto: "time" }),
      text("endTime", "Ende", "Auftrag", { type: "time" }),
      text("manufacturer", "Hersteller", "Auftrag", { auto: "manufacturer", recommended: true }),
      area("workDone", "Durchgeführte Arbeiten", "Arbeiten", { auto: "workDone", required: true }),
      area("components", "Verwendete Komponenten", "Arbeiten"),
      area("specialNotes", "Besonderheiten", "Arbeiten"),
      check("functionChecked", "Funktion geprüft", "Prüfung", { auto: "quality:function-result", required: true }),
      check("motorChecked", "Motor geprüft", "Prüfung", { auto: "quality:motor" }),
      check("endPositionsChecked", "Endlagen geprüft", "Prüfung", { auto: "quality:end-positions" }),
      check("operationChecked", "Bedienung geprüft", "Prüfung", { auto: "quality:controls" }),
      check("sensorsChecked", "Sensorik geprüft, falls vorhanden", "Prüfung", { auto: "quality:radio-sensors" }),
      check("fixingsChecked", "Befestigung geprüft", "Prüfung", { auto: "quality:fixings-checked", required: true }),
      check("operationExplained", "Bedienung erklärt", "Kundenübergabe", { auto: "quality:customer", required: true }),
      check("careExplained", "Pflegehinweise erklärt", "Kundenübergabe", { auto: "quality:customer-care" }),
      check("safetyExplained", "Sicherheitshinweise gegeben", "Kundenübergabe", { auto: "quality:customer-safety", required: true }),
      area("defects", "Mängel", "Offene Punkte"),
      area("rework", "Nacharbeit", "Offene Punkte"),
      area("parts", "Fehlende Ersatzteile", "Offene Punkte"),
    ],
    signatures: ["Monteur", "Kunde"],
  },
  "Aufmaßblatt": {
    code: "AM",
    title: "Aufmaßblatt",
    description: "Produkt- und Einbaumaße mit auftragsbezogener Skizzen- und Fotoreferenz erfassen.",
    customerSafe: false,
    fields: [
      text("measuredBy", "Aufmaß aufgenommen von", "Allgemein", { auto: "assignedTo", required: true }),
      text("measurementDate", "Datum", "Allgemein", { type: "date", auto: "date", required: true }),
      text("manufacturer", "Hersteller", "Allgemein", { auto: "manufacturer" }),
      text("installation", "Einbausituation", "Allgemein", { auto: "installType", required: true }),
      area("specialNotes", "Besonderheiten", "Dokumentation"),
      text("sketchReference", "Skizzenhinweis", "Dokumentation", { auto: "sketchReference" }),
      check("photosAvailable", "Fotos vorhanden", "Dokumentation", { auto: "photosAvailable", recommended: true }),
    ],
    productFields: {
      rollladen: [text("width", "Breite", "Rollladen", { auto: "measurement:Breite", required: true }), text("height", "Höhe", "Rollladen", { auto: "measurement:Höhe", required: true }), text("box", "Kasten", "Rollladen"), text("guide", "Führung", "Rollladen"), text("shaft", "Welle", "Rollladen"), text("operationSide", "Bedienseite", "Rollladen")],
      markise: [text("width", "Breite", "Markise", { auto: "measurement:Breite", required: true }), text("projection", "Ausfall", "Markise", { auto: "measurement:Ausfall", required: true }), text("mountingHeight", "Montagehöhe", "Markise"), text("substrate", "Untergrund", "Markise", { auto: "substrate", required: true }), text("inclination", "Neigung", "Markise"), text("connectionSide", "Anschlussseite", "Markise")],
      raffstore: [text("width", "Breite", "Raffstore", { auto: "measurement:Breite", required: true }), text("height", "Höhe", "Raffstore", { auto: "measurement:Höhe", required: true }), text("guide", "Führung", "Raffstore"), text("stackHeight", "Pakethöhe", "Raffstore"), text("slatType", "Lamellentyp", "Raffstore")],
      zip: [text("width", "Breite", "ZIP-Screen", { auto: "measurement:Breite", required: true }), text("height", "Höhe", "ZIP-Screen", { auto: "measurement:Höhe", required: true }), text("cassette", "Kassette", "ZIP-Screen"), text("guide", "Führung", "ZIP-Screen"), text("motorSide", "Motorseite", "ZIP-Screen")],
      default: [text("width", "Breite", "Maße", { auto: "measurement:Breite", required: true }), text("height", "Höhe", "Maße", { auto: "measurement:Höhe", required: true }), text("operationSide", "Bedien-/Motorseite", "Maße")],
    },
  },
  Wartungsprotokoll: {
    code: "WP",
    title: "Wartungsprotokoll",
    description: "Zustand, ausgeführte Prüfungen, Mängel und Empfehlungen ohne erfundene Wartungsfrist festhalten.",
    customerSafe: true,
    fields: [
      text("maintenanceBy", "Wartung durch", "Anlage", { auto: "assignedTo", required: true }),
      text("maintenanceDate", "Wartungsdatum", "Anlage", { type: "date", auto: "date", required: true }),
      text("manufacturer", "Hersteller", "Anlage", { auto: "manufacturer" }),
      text("yearBuilt", "Baujahr, falls bekannt", "Anlage"),
      check("visualCondition", "Anlage auf sichtbare Schäden geprüft", "Sichtprüfung", { required: true }),
      check("fixings", "Befestigungen und Führungen geprüft", "Sichtprüfung"),
      check("cleaned", "Zugängliche Bereiche gereinigt", "Reinigung"),
      check("drainage", "Abläufe / Führung von Schmutz befreit", "Reinigung"),
      check("mechanics", "Mechanik und Lauf geprüft", "Mechanik", { required: true }),
      check("wearParts", "Verschleißteile beurteilt", "Mechanik"),
      check("motorControl", "Motor / Steuerung geprüft", "Motor / Steuerung"),
      check("sensorFunction", "Sensorik geprüft, falls vorhanden", "Sensorik"),
      area("defects", "Festgestellte Mängel", "Mängel"),
      select("priority", "Priorität", "Mängel", ["keine", "beobachten", "zeitnah prüfen", "Nutzung einschränken"]),
      area("recommendation", "Empfehlung", "Empfehlung", { required: true }),
      select("nextStep", "Nächster Schritt", "Empfehlung", ["keine weitere Maßnahme", "weitere Prüfung", "Reparatur", "Ersatzteil"]),
      text("nextMaintenance", "Nächster Wartungstermin, falls vereinbart", "Empfehlung", { type: "date" }),
    ],
    signatures: ["Monteur", "Kunde"],
  },
  Kundenübergabe: {
    code: "KU",
    title: "Kundenübergabe",
    description: "Bedienung, Pflege, Sicherheit und übergebene Unterlagen kompakt bestätigen.",
    customerSafe: true,
    fields: [
      text("handoverTo", "Übergabe an", "Übergabe", { auto: "customer", required: true }),
      text("handoverDate", "Übergabedatum", "Übergabe", { type: "date", auto: "date", required: true }),
      check("operationExplained", "Bedienung erklärt", "Einweisung", { auto: "quality:customer", required: true }),
      check("radioExplained", "Funk / Steuerung erklärt", "Einweisung"),
      check("careExplained", "Pflegehinweise erklärt", "Einweisung", { auto: "quality:customer-care" }),
      check("safetyExplained", "Sicherheitshinweise gegeben", "Einweisung", { auto: "quality:customer-safety", required: true }),
      check("weatherExplained", "Wind-/Wetterhinweise erklärt", "Einweisung"),
      area("documents", "Übergebene Unterlagen", "Unterlagen"),
      area("customerQuestions", "Offene Fragen", "Ergebnis"),
      select("handoverResult", "Ergebnis", "Ergebnis", ["ohne Beanstandung", "mit Hinweis", "Nacharbeit erforderlich"], { required: true }),
    ],
    signatures: ["Monteur", "Kunde"],
  },
  Angebotsentwurf: {
    code: "AN",
    title: "Angebotsentwurf",
    description: "Unverbindlicher Arbeitsentwurf; keine vollständige Angebots- oder Rechnungssoftware.",
    customerSafe: false,
    fields: [
      text("offerDate", "Angebotsdatum", "Angebot", { type: "date", auto: "today", required: true }),
      text("validUntil", "Gültig bis", "Angebot", { type: "date" }),
      area("service", "Leistung", "Positionen", { auto: "offerService", required: true }),
      area("materialDescription", "Material", "Positionen"),
      text("material", "Material netto", "Kalkulation", { type: "number", auto: "material" }),
      text("labor", "Arbeitszeit / Lohn", "Kalkulation", { auto: "labor" }),
      text("travel", "Fahrt netto", "Kalkulation", { type: "number", auto: "travel" }),
      text("additional", "Zusatzleistungen netto", "Kalkulation", { type: "number" }),
      text("totalNet", "Gesamt netto", "Kalkulation", { type: "number", auto: "net" }),
      text("tax", "Steuer, falls bewusst verwendet", "Kalkulation", { type: "number" }),
      text("total", "Gesamtbetrag", "Kalkulation", { type: "number" }),
      area("offerNotes", "Hinweise", "Hinweise"),
    ],
  },
  "Berichtsheft-Eintrag": {
    code: "BH",
    title: "Berichtsheft-Eintrag",
    description: "Vorhandenen Berichtsheft-Entwurf als Dokument aufbereiten.",
    customerSafe: false,
    fields: [
      select("reportMode", "Berichtsart", "Bericht", ["Tagesbericht", "Wochenbericht"]),
      select("reportYear", "Ausbildungsjahr", "Bericht", ["1", "2", "3", "4"]),
      text("learningField", "Lernfeld", "Bericht", { auto: "learningField", required: true }),
      area("reportText", "Berichtstext", "Bericht", { auto: "reportProposal", required: true }),
      select("reportStatus", "Status", "Prüfung", ["Entwurf", "Zur Prüfung", "Änderung erforderlich", "Freigegeben"]),
      area("masterComment", "Meister-Kommentar", "Prüfung", { auto: "masterComment" }),
    ],
    signatures: ["Auszubildende Person", "Ausbildungsleitung"],
  },
  Nacharbeitsprotokoll: {
    code: "NA",
    title: "Nacharbeitsprotokoll",
    description: "Grund, Arbeiten, Ergebnis und weitere Schritte einer Nacharbeit dokumentieren.",
    customerSafe: true,
    fields: [
      text("sourceOrder", "Ursprungsauftrag", "Ausgangslage", { auto: "sourceOrder", required: true }),
      area("reason", "Grund der Nacharbeit", "Ausgangslage", { auto: "reworkReason", required: true }),
      area("problem", "Festgestelltes Problem", "Ausgangslage", { required: true }),
      area("material", "Benötigtes Material", "Ausführung"),
      area("workDone", "Durchgeführte Arbeiten", "Ausführung", { required: true }),
      area("result", "Ergebnis", "Ergebnis", { required: true }),
      area("nextSteps", "Weitere Schritte", "Ergebnis"),
      text("photoReferences", "Ausgewählte Fotos", "Dokumentation", { auto: "photoReferences" }),
      text("monteur", "Monteur", "Dokumentation", { auto: "assignedTo" }),
    ],
    signatures: ["Monteur", "Kunde"],
  },
  Reklamationsprotokoll: {
    code: "RK",
    title: "Reklamationsprotokoll",
    description: "Kundenmeldung, Prüfung, Ursache und Maßnahme erfassen; interne Diagnose bleibt in der internen Ansicht.",
    customerSafe: true,
    fields: [
      text("complaintDate", "Datum der Kundenmeldung", "Meldung", { type: "date", auto: "today", required: true }),
      area("customerReport", "Kundenmeldung", "Meldung", { auto: "customerIssue", required: true }),
      area("problem", "Problem", "Prüfung", { required: true }),
      area("visualInspection", "Sichtprüfung", "Prüfung"),
      area("diagnosis", "Interne Diagnose", "Interne Angaben", { internal: true }),
      area("cause", "Festgestellte Ursache", "Prüfung"),
      area("measure", "Maßnahme", "Ergebnis", { required: true }),
      area("rework", "Nacharbeit", "Ergebnis"),
      area("result", "Ergebnis", "Ergebnis", { required: true }),
    ],
  },
  "Prüf-/Funktionsprotokoll": {
    code: "FP",
    title: "Prüf-/Funktionsprotokoll",
    description: "Kompakte Funktions- und Sicherheitsdokumentation für Produkt, Motor und Steuerung.",
    customerSafe: true,
    fields: [
      text("motor", "Motor", "Anlage", { auto: "drive" }),
      text("control", "Steuerung", "Anlage"),
      check("function", "Funktionsprüfung durchgeführt", "Prüfung", { auto: "quality:function-result", required: true }),
      check("endPositions", "Endlagen geprüft", "Prüfung", { auto: "quality:end-positions" }),
      check("operation", "Bedienung geprüft", "Prüfung", { auto: "quality:controls", required: true }),
      check("sensors", "Sensorik geprüft, falls vorhanden", "Prüfung", { auto: "quality:radio-sensors" }),
      check("safety", "Sicherheitsprüfung durchgeführt", "Prüfung", { auto: "quality:safety-check", required: true }),
      select("result", "Ergebnis", "Ergebnis", ["ohne Beanstandung", "mit Hinweis", "nicht bestanden"], { required: true }),
      area("notes", "Hinweise", "Ergebnis"),
    ],
    signatures: ["Prüfende Person"],
  },
  "Sonstiges Dokument": {
    code: "DOC",
    title: "Sonstiges Dokument",
    description: "Freies auftragsbezogenes Dokument mit neutralem Firmenkopf.",
    customerSafe: false,
    fields: [
      text("subject", "Betreff", "Dokument", { required: true }),
      area("content", "Inhalt", "Dokument", { required: true }),
      area("notes", "Hinweise", "Dokument"),
    ],
  },
};

function productGroup(productId = "") {
  const value = String(productId).toLocaleLowerCase("de-DE");
  if (value.includes("rollladen")) return "rollladen";
  if (value.includes("markise") || value.includes("pergola")) return "markise";
  if (value.includes("raffstore")) return "raffstore";
  if (value.includes("zip")) return "zip";
  return "default";
}
export function getDocumentTemplate(type, productId = "") {
  const template = documentTemplateDefinitions[type] || documentTemplateDefinitions["Sonstiges Dokument"];
  const productFields = template.productFields?.[productGroup(productId)] || template.productFields?.default || [];
  return { ...template, fields: [...template.fields, ...productFields] };
}
