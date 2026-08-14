export const reportActivityTemplates = [
  { id: "montage", label: "Montage", text: "Ich habe bei der Montage einer Sonnenschutzanlage mitgearbeitet. Dabei wurden Maße geprüft, Bauteile vorbereitet, Führungselemente ausgerichtet, Befestigungspunkte gesetzt und die Funktion der Anlage kontrolliert." },
  { id: "aufmass", label: "Aufmaß", text: "Ich habe ein Aufmaß vorbereitet beziehungsweise unterstützt. Dabei wurden Breite, Höhe, Einbausituation, Bedienseite, Untergrund, Stromanschluss und Besonderheiten dokumentiert." },
  { id: "wartung", label: "Wartung", text: "Ich habe Wartungs- und Pflegearbeiten durchgeführt. Dabei wurden Führungsschienen gereinigt, bewegliche Bauteile geprüft, die Funktion getestet und Kundenhinweise vorbereitet." },
  { id: "diagnose", label: "Fehlerdiagnose", text: "Ich habe bei der Fehlersuche unterstützt. Das Fehlerbild wurde aufgenommen, mögliche Ursachen wurden systematisch geprüft und die Ergebnisse wurden dokumentiert." },
  { id: "motor", label: "Motor & Steuerung", text: "Ich habe Arbeiten an Antrieb und Steuerung begleitet. Dabei wurden Motortyp, Bedienart, Laufrichtung, Endlagen und die Funktion der Steuerung geprüft." },
];

export const reportLearningFields = ["Montage und Instandhaltung", "Aufmaß und Planung", "Antriebe und Steuerungen", "Fehlerdiagnose und Wartung", "Kundenkommunikation", "Arbeitssicherheit", "Dokumentation und Qualitätssicherung"];

export const reportTechnicalTerms = {
  "1": ["Aufmaß", "Führungsschiene", "Rollladenpanzer", "Montagebereich", "Werkzeugauswahl", "Arbeitssicherheit"],
  "2": ["Rohrmotor", "Endlage", "Untergrundprüfung", "Befestigungspunkt", "Funktionsprüfung", "Kundenübergabe"],
  "3": ["Steuerung", "Sensorik", "Windwiderstand", "Fehlerdiagnose", "Dokumentation", "Qualitätssicherung"],
  "4": ["Gefährdungsbeurteilung", "Projektplanung", "Schnittstelle", "Reklamationsaufnahme", "Bedenkenhinweis", "Qualitätssicherung"],
};

export const quizCards = [
  { y: 1, t: "Grundlagen", q: "Warum müssen Führungsschienen parallel sein?", options: ["Freier Lauf ohne Klemmen", "schnellerer Motor", "mehr Farbe"], correctIndex: 0, explanation: "Parallele Schienen verhindern Reibung und Schieflauf." },
  { y: 1, t: "Grundlagen", q: "Was ist eine Endlage?", options: ["Kastenfarbe", "Motor-Abschaltpunkt oben/unten", "Schraubentyp"], correctIndex: 1, explanation: "Endlagen begrenzen die Fahrbewegung." },
  { y: 1, t: "Werkzeug", q: "Warum Bohrloch reinigen?", options: ["Optik", "weniger Lärm", "bessere Haltekraft"], correctIndex: 2, explanation: "Staub schwächt Dübel und Injektionsanker." },
  { y: 1, t: "Sicherheit", q: "Was bedeutet Revision?", options: ["Zugang für Wartung", "Lamellenfarbe", "Rabatt"], correctIndex: 0, explanation: "Bauteile müssen erreichbar bleiben." },
  { y: 1, t: "Untergrund", q: "Was ist bei WDVS wichtig?", options: ["in Dämmung schrauben", "Last in tragenden Untergrund", "nur kleben"], correctIndex: 1, explanation: "Dämmung trägt keine schweren Lasten." },
  { y: 2, t: "Motor", q: "Was vor Motor-Einstellung klären?", options: ["Motortyp/Hersteller", "Fensterfarbe", "Kundenalter"], correctIndex: 0, explanation: "Einstelllogik hängt vom Motortyp ab." },
  { y: 2, t: "Motor", q: "Warum nur einen Funkmotor bestromen?", options: ["falsches Einlernen vermeiden", "mehr Licht", "weniger Werkzeug"], correctIndex: 0, explanation: "Sonst koppeln mehrere Motoren falsch." },
  { y: 3, t: "Normen", q: "Windklasse bedeutet ...", options: ["Orientierung, keine pauschale Freigabe", "immer egal", "nur innen"], correctIndex: 0, explanation: "Einbausituation bleibt entscheidend." },
];

export const sketchCards = [
  { title: "Aufbau Rollladen", parts: ["Kasten", "Welle", "Lager", "Panzer", "Endstab", "Führungsschiene", "Bedienung/Motor"], tip: "Beim Lernen von oben nach unten denken: Kasten → Welle → Panzer → Führung → Bedienung." },
  { title: "Rohrmotor in der Welle", parts: ["Motorkopf", "Adapter", "Mitnehmer", "Achtkantwelle", "Lager", "Endlagen"], tip: "Adapter und Mitnehmer müssen zur Welle und zum Motor passen." },
  { title: "Markise", parts: ["Konsolen", "Tragrohr", "Tuchwelle", "Gelenkarme", "Ausfallprofil", "Motor", "Sensorik"], tip: "Konsolen nehmen hohe Kräfte auf. Untergrund immer ernst nehmen." },
  { title: "WDVS-Abstandsmontage", parts: ["Putz", "Dämmstoff", "tragender Untergrund", "Abstandssystem", "Dichtung", "Konsole"], tip: "Lasten gehören in den tragenden Untergrund, nicht in den Dämmstoff." },
];

export const azubiLearningModules = [
  { topic: "Rollladenmontage", year: "1", goal: "Bauteile erkennen, Führungsschienen ausrichten, einfache Montageabläufe erklären.", tasks: ["Skizze Rollladen ansehen", "5 Quizfragen Grundlagen", "Berichtssatz zur Montage schreiben"] },
  { topic: "Aufmaß", year: "1", goal: "Breite, Höhe, Einbausituation und Bedienseite sauber dokumentieren.", tasks: ["Aufmaßblatt ausfüllen", "Pflichtfelder prüfen", "Foto-Notiz ergänzen"] },
  { topic: "Motoren & Endlagen", year: "2", goal: "Motortyp erkennen, Laufrichtung prüfen und Endlagen erklären.", tasks: ["Motoren-Bereich lesen", "Quiz Motor wiederholen", "Prüfschritte im Bericht verwenden"] },
  { topic: "Fehlerdiagnose", year: "2", goal: "Fehlerbild aufnehmen und systematisch erste Prüfschritte ableiten.", tasks: ["Diagnose Schrittmodus nutzen", "mögliche Ursache notieren", "Protokolltext erzeugen"] },
  { topic: "Kundenkommunikation", year: "3", goal: "Übergabe, Pflegehinweise und Bedenken verständlich formulieren.", tasks: ["Kundentext kopieren", "Pflegehinweis erklären", "Übergabe im Bericht dokumentieren"] },
  { topic: "Qualität & Abschluss", year: "3", goal: "Checkliste, Fotos, Protokoll und Kundeneinweisung vor Abschluss prüfen.", tasks: ["Abschlussprüfung öffnen", "fehlende Punkte lösen", "PDF-Vorschau prüfen"] },
];

export const extraQuizCards = [
  { y: 1, t: "Werkzeug", q: "Welches Foto sollte bei Ersatzteilen fast immer gemacht werden?", options: ["Typenschild/Profilfoto", "Mittagessen", "Fahrzeugreifen"], correctIndex: 0, explanation: "Typenschild und Profilfoto helfen bei Hersteller, Serie und Ersatzteilwahl." },
  { y: 1, t: "Sicherheit", q: "Was muss vor dem Bohren geprüft werden?", options: ["Leitungen und Untergrund", "Musiklautstärke", "Wetter-App Farbe"], correctIndex: 0, explanation: "Leitungssuche und Untergrundprüfung vermeiden Schäden und Unfälle." },
  { y: 2, t: "Untergrund", q: "Warum sind Siebhülsen bei Lochstein oft wichtig?", options: ["Damit Injektionsmörtel gehalten wird", "Damit die Farbe passt", "Damit der Bohrer schneller ist"], correctIndex: 0, explanation: "Siebhülsen halten den Mörtel im Hohlkammerstein." },
  { y: 2, t: "Markise", q: "Warum ist eine Markise bei WDVS kritisch?", options: ["Hohe Zugkräfte und Dämmung trägt nicht", "Weil sie immer innen sitzt", "Weil kein Werkzeug nötig ist"], correctIndex: 0, explanation: "Markisen erzeugen hohe Hebelkräfte, die in den tragenden Untergrund abgetragen werden müssen." },
  { y: 2, t: "Funk", q: "Warum beim Einlernen nur einen Motor bestromen?", options: ["Damit nicht mehrere Motoren falsch gekoppelt werden", "Damit es dunkler ist", "Damit der Kunde wartet"], correctIndex: 0, explanation: "Mehrere aktive Empfänger können sonst gleichzeitig reagieren." },
  { y: 3, t: "Qualität", q: "Was gehört vor Abschluss geprüft?", options: ["Checkliste, Fotos, Funktion, Einweisung", "Nur der Preis", "Nur die Uhrzeit"], correctIndex: 0, explanation: "Der Abschluss braucht technische und dokumentarische Prüfung." },
  { y: 3, t: "Tor", q: "Was ist bei Rolltoren besonders wichtig?", options: ["Sicherheitseinrichtungen und Notbedienung", "Tuchfarbe", "Blumenkasten"], correctIndex: 0, explanation: "Tore haben besondere Sicherheitsanforderungen." },
  { y: 3, t: "Dokumentation", q: "Warum Statusverlauf speichern?", options: ["Damit nachvollziehbar ist, was wann passiert ist", "Damit die App bunter wird", "Damit Fotos verschwinden"], correctIndex: 0, explanation: "Statusverlauf hilft bei Büro, Kunde, Reklamation und Nacharbeit." },
];

const additionalQuizCards = [
  { id: "quiz-safety-height", y: 1, t: "Sicherheit", q: "Was ist vor Arbeiten in der Höhe zuerst zu klären?", options: ["Sicherer Zugang, Standplatz und Absturzschutz", "Nur die Arbeitsdauer", "Die Farbe der Anlage"], correctIndex: 0, explanation: "Zugang, Standplatz und notwendige Schutzmaßnahmen müssen vor Arbeitsbeginn geklärt sein.", moduleIds: ["y1-safety-basics"] },
  { id: "quiz-measurement-three-points", y: 1, t: "Aufmaß", q: "Warum wird eine Öffnung an mehreren Stellen gemessen?", options: ["Um Abweichungen und das geeignete Bestellmaß zu erkennen", "Damit mehr Zahlen im Protokoll stehen", "Nur zur Kontrolle des Maßbands"], correctIndex: 0, explanation: "Bauteile und Öffnungen können schief oder ungleich sein; mehrere Messpunkte machen das sichtbar.", moduleIds: ["y1-measurement-basics"] },
  { id: "quiz-concrete-drill", y: 2, t: "Untergrund", q: "Was gehört zur Befestigungswahl in Beton?", options: ["Last, Bauteil, Randabstand und freigegebenes System prüfen", "Immer denselben Dübel verwenden", "Nur den Putz beurteilen"], correctIndex: 0, explanation: "Die Befestigung wird anhand der realen Einbausituation und der Systemunterlagen ausgewählt.", moduleIds: ["y2-fastening-systems", "y2-concrete-fastening"] },
  { id: "quiz-wdvs-load", y: 2, t: "Untergrund", q: "Wohin müssen relevante Lasten bei WDVS abgetragen werden?", options: ["In den tragfähigen Untergrund", "Nur in den Dämmstoff", "Nur in den Oberputz"], correctIndex: 0, explanation: "Die Dämmung ist nicht der tragende Befestigungsgrund; Wärmebrücke und Abdichtung sind zusätzlich zu beachten.", moduleIds: ["y2-wdvs-altbau"] },
  { id: "quiz-roller-suspension", y: 2, t: "Rollladen", q: "Was kann einen schief laufenden Rollladen verursachen?", options: ["Ungleiche Aufhängung oder nicht parallele Führung", "Nur die Farbe des Panzers", "Ein voller Senderakku"], correctIndex: 0, explanation: "Führung, Panzer, Aufhängung, Welle und Lager müssen gemeinsam betrachtet werden.", moduleIds: ["y2-roller-installation"] },
  { id: "quiz-awning-arms", y: 2, t: "Markise", q: "Warum dürfen Gelenkarme nicht ungesichert geöffnet werden?", options: ["Sie können unter hoher Federspannung stehen", "Das Tuch wird sonst heller", "Der Sender verliert den Kanal"], correctIndex: 0, explanation: "Gelenkarme und schwere Bauteile können gespeicherte Kräfte enthalten und müssen fachgerecht gesichert werden.", moduleIds: ["y2-awning-components"] },
  { id: "quiz-zip-guide", y: 2, t: "ZIP", q: "Was ist vor einer Endlageneinstellung beim ZIP-Screen wichtig?", options: ["Führung und Tuchlauf müssen frei und parallel sein", "Die Endleiste muss festgeklemmt sein", "Nur der Funkkanal zählt"], correctIndex: 0, explanation: "Eine klemmende Mechanik darf nicht über die Motoreinstellung kompensiert werden.", moduleIds: ["y2-zip-screen-basics"] },
  { id: "quiz-insect-drain", y: 2, t: "Insektenschutz", q: "Was darf ein Insektenschutzrahmen nicht verdecken?", options: ["Notwendige Entwässerungsöffnungen", "Den Fenstergriff vollständig", "Das Typenschild des Motors"], correctIndex: 0, explanation: "Entwässerung, Bedienung und kollisionsfreie Funktion müssen erhalten bleiben.", moduleIds: ["y2-insect-protection"] },
  { id: "quiz-electronic-motor", y: 3, t: "Motor", q: "Was ist bei elektronischen Endlagen besonders wichtig?", options: ["Passende Herstellerunterlage und freie Mechanik", "Eine Lernfolge aus irgendeiner Serie", "Endlage gegen den Anschlag erzwingen"], correctIndex: 0, explanation: "Lernabläufe sind modellabhängig; die Mechanik muss vorher geprüft werden.", moduleIds: ["y3-motors-end-limits", "y3-electronic-motors"] },
  { id: "quiz-radio-reset", y: 3, t: "Funk", q: "Wann ist ein pauschaler Funk-Reset sinnvoll?", options: ["Nicht pauschal; nur nach Identifikation und Herstellerunterlage", "Immer als erster Schritt", "Sobald eine Batterie leer ist"], correctIndex: 0, explanation: "Ein ungezielter Reset kann vorhandene Zuordnungen anderer Anlagen verändern.", moduleIds: ["y3-radio-sensors", "y3-radio-systems"] },
  { id: "quiz-solar-shade", y: 3, t: "Motor", q: "Was beeinflusst einen Solarantrieb besonders?", options: ["Akkuzustand, Verschattung und Steckverbindungen", "Nur die Profilfarbe", "Nur die Raumtemperatur"], correctIndex: 0, explanation: "Ladezustand und reale Besonnung müssen getrennt vom Motorfehler betrachtet werden.", moduleIds: ["y3-solar-motors"] },
  { id: "quiz-diagnosis-one-change", y: 3, t: "Diagnose", q: "Warum sollte bei der Diagnose nur eine Einflussgröße nach der anderen verändert werden?", options: ["Damit Ursache und Wirkung nachvollziehbar bleiben", "Damit die Prüfung länger dauert", "Damit keine Fotos nötig sind"], correctIndex: 0, explanation: "Systematisches Prüfen verhindert, dass mehrere Änderungen das Ergebnis verfälschen.", moduleIds: ["y3-diagnosis-systematic"] },
  { id: "quiz-maintenance-lubricant", y: 3, t: "Wartung", q: "Darf jedes Schmiermittel an Führung und Behang verwendet werden?", options: ["Nein, Produkt- und Herstellerhinweise beachten", "Ja, je mehr desto besser", "Nur bei Funkmotoren"], correctIndex: 0, explanation: "Ungeeignete Mittel können Schmutz binden oder Material und Funktion beeinträchtigen.", moduleIds: ["y3-maintenance"] },
  { id: "quiz-smart-home-local", y: 3, t: "Funk", q: "Was wird vor der Gateway-Diagnose geprüft?", options: ["Ob die lokale Bedienung funktioniert", "Ob das Kundenpasswort notiert wurde", "Ob alle Geräte zurückgesetzt sind"], correctIndex: 0, explanation: "Erst Antrieb und lokalen Bedienweg prüfen, danach Netzwerk und Gateway betrachten.", moduleIds: ["y3-smart-home"] },
  { id: "quiz-rolltor-safety", y: 3, t: "Sicherheit", q: "Darf eine Sicherheitseinrichtung am Rolltor zum Test überbrückt werden?", options: ["Nein", "Ja, wenn es schnell geht", "Nur ohne Dokumentation"], correctIndex: 0, explanation: "Sicherheitskreise dürfen nicht überbrückt werden; Herstellerangaben und geltende Vorschriften beachten.", moduleIds: ["y3-rolltor-safety"] },
  { id: "quiz-customer-handover", y: 3, t: "Kundenkommunikation", q: "Was gehört zu einer guten Kundenübergabe?", options: ["Bedienung, Grenzen, Pflege und offene Punkte verständlich erklären", "Nur die Rechnung nennen", "Nur den Sender übergeben"], correctIndex: 0, explanation: "Die Übergabe verbindet Funktion, Sicherheit, Pflege und Dokumentation.", moduleIds: ["y3-customer-handover"] },
  { id: "quiz-risk-change", y: 4, t: "Sicherheit", q: "Was ist bei geänderter Baustellensituation zu tun?", options: ["Gefährdung neu bewerten und Maßnahmen anpassen", "Unverändert weiterarbeiten", "Nur später erwähnen"], correctIndex: 0, explanation: "Eine Gefährdungsbeurteilung muss die tatsächliche Situation berücksichtigen.", moduleIds: ["y4-risk-assessment"] },
  { id: "quiz-complaint-facts", y: 4, t: "Kundenkommunikation", q: "Was ist bei einer Reklamation zuerst sinnvoll?", options: ["Beobachtung, Fakten und nächsten Schritt dokumentieren", "Sofort Schuld versprechen", "Den Kunden unterbrechen"], correctIndex: 0, explanation: "Sachliche Aufnahme schafft eine belastbare Grundlage für Diagnose und weitere Abstimmung.", moduleIds: ["y4-complaints"] },
  { id: "quiz-complex-measurement-reference", y: 4, t: "Aufmaß", q: "Was braucht ein komplexes Fassadenaufmaß?", options: ["Eindeutige Bezugslinien und dokumentierte offene Fragen", "Nur ein Gesamtmaß", "Keine Skizze"], correctIndex: 0, explanation: "Bezugspunkte, Schnitte und offene technische Fragen verhindern unklare Annahmen.", moduleIds: ["y4-complex-measurement"] },
  { id: "quiz-qualification", y: 4, t: "Sicherheit", q: "Was zeigt der Status ‚Sicher‘ im Lernmodus?", options: ["App-Lernfortschritt, keine automatische fachliche Qualifikation", "Eine offizielle Elektrofreigabe", "Eine Herstellerzertifizierung"], correctIndex: 0, explanation: "Die App dokumentiert Lernen; Unterweisung, Qualifikation und betriebliche Freigaben bleiben separat.", moduleIds: ["y4-risk-assessment"] },
];

export const allQuizCards = [...quizCards, ...extraQuizCards, ...additionalQuizCards].map((card, index) => ({
  ...card,
  id: card.id || `quiz-${index + 1}`,
  category: card.category || card.t,
  moduleIds: card.moduleIds || [],
}));

export const expandedLearningModules = [
  { topic: "Grundlagen Rollladen", year: "1", goal: "Bauteile erkennen und Laufweg erklären.", tasks: ["Kasten, Welle, Panzer, Führung benennen", "Skizze anfertigen", "3 typische Fehler nennen"] },
  { topic: "Werkzeug & Sicherheit", year: "1", goal: "Werkzeug passend auswählen und Arbeit sicher vorbereiten.", tasks: ["PSA prüfen", "Leitungssuche einplanen", "Bohrlochreinigung erklären"] },
  { topic: "Untergrund & Befestigung", year: "2", goal: "Untergründe unterscheiden und Risiken erkennen.", tasks: ["Beton/Lochstein/WDVS vergleichen", "Befestigungssystem auswählen", "Bedenkenhinweis formulieren"] },
  { topic: "Motor-Endlagen", year: "2", goal: "Motortyp erkennen und Endlagen sauber prüfen.", tasks: ["mechanisch/elektronisch/Funk unterscheiden", "Drehrichtung prüfen", "Endlagen dokumentieren"] },
  { topic: "Funk & Sensorik", year: "2", goal: "Sender, Empfänger und Sensorik systematisch prüfen.", tasks: ["Batterie/Kanal/Reichweite prüfen", "nur einen Motor bestromen", "Kundenautomatik erklären"] },
  { topic: "Markise & Wind", year: "3", goal: "Kräfte, Konsolen und Windhinweise sicher bewerten.", tasks: ["Montagehöhe prüfen", "Konsole/Untergrund bewerten", "Windhinweis dokumentieren"] },
  { topic: "Fehlerdiagnose", year: "3", goal: "Fehlerbild aufnehmen und strukturiert entscheiden.", tasks: ["Fehler beschreiben", "erste Prüfschritte durchführen", "Ersatzteilbedarf formulieren"] },
  { topic: "Auftrag abschließen", year: "3", goal: "Qualität, Fotos, PDF und Kundeneinweisung vollständig erledigen.", tasks: ["Checkliste 100%", "Pflichtfotos", "Unterschrift/PDF vorbereiten"] },
];

export const learningCategories = [
  "Grundlagen",
  "Sicherheit",
  "Werkzeug & Material",
  "Untergründe & Befestigung",
  "Rollladen",
  "Markise",
  "Raffstore",
  "ZIP-Screen",
  "Insektenschutz",
  "Rolltor",
  "Motoren & Steuerungen",
  "Funk & Sensorik",
  "Fehlerdiagnose",
  "Aufmaß",
  "Wartung",
  "Kundenkommunikation",
  "Normen & Dokumentation",
];

export const learningCheckpoints = [
  { id: "read", label: "gelesen" },
  { id: "understood", label: "verstanden" },
  { id: "practiceSeen", label: "in Praxis gesehen" },
  { id: "selfPerformed", label: "selbst durchgeführt" },
  { id: "masterAsked", label: "mit Meister besprochen" },
  { id: "secure", label: "sicher beherrscht", optional: true },
];

const baseLearningModules = [
  {
    id: "y1-safety-basics",
    year: 1,
    category: "Sicherheit",
    title: "Sicher auf Baustelle und Leiter",
    explanation: "PSA, Arbeitsbereich, Leiterstellung und sichere Wege werden vor Arbeitsbeginn gemeinsam geprüft.",
    practiceTask: "Baustelle absichern, Leiter prüfen und die persönliche Schutzausrüstung dem Meister erklären.",
    typicalErrors: ["Leiter auf unebenem Untergrund", "Arbeitsbereich nicht abgesperrt", "Schutzbrille beim Bohren vergessen"],
  },
  {
    id: "y1-tools-basics",
    year: 1,
    category: "Werkzeug & Material",
    title: "Grundwerkzeug richtig auswählen",
    explanation: "Handwerkzeuge, Messmittel, Bohrer und Verbrauchsmaterial werden passend zum Auftrag vorbereitet.",
    practiceTask: "Für eine Rollladenmontage eine Werkzeugkiste zusammenstellen und jedes Werkzeug begründen.",
    typicalErrors: ["Falscher Bohrer", "Stumpfe Bits", "Messmittel nicht geprüft"],
  },
  {
    id: "y1-substrates-recognize",
    year: 1,
    category: "Untergründe & Befestigung",
    title: "Untergründe erkennen",
    explanation: "Beton, Vollstein, Lochstein, Holz, Metall und WDVS werden anhand typischer Merkmale unterschieden.",
    practiceTask: "Drei Untergründe fotografieren, benennen und eine passende Probebohrung besprechen.",
    typicalErrors: ["Putz mit tragendem Untergrund verwechselt", "Ohne Leitungssuche gebohrt", "Bohrmehl nicht beurteilt"],
  },
  {
    id: "y1-roller-components",
    year: 1,
    category: "Rollladen",
    title: "Bauteile eines Rollladens",
    explanation: "Kasten, Welle, Lager, Panzer, Endstab, Führungsschienen und Bedienung bilden ein zusammenhängendes System.",
    practiceTask: "Eine Anlage skizzieren und alle sichtbaren sowie verdeckten Bauteile beschriften.",
    typicalErrors: ["Panzer und Profil verwechselt", "Revision nicht beachtet", "Bedienseite falsch benannt"],
  },
  {
    id: "y1-measurement-basics",
    year: 1,
    category: "Aufmaß",
    title: "Breite, Höhe und Einbausituation",
    explanation: "Mehrere Messpunkte, Bedienseite, Einbauart und Besonderheiten werden nachvollziehbar dokumentiert.",
    practiceTask: "Ein Fenster an drei Stellen messen und eine einfache Aufmaß-Skizze mit Maßpfeilen erstellen.",
    typicalErrors: ["Nur einmal gemessen", "Kleinstmaß nicht erkannt", "Einheit oder Bezugspunkt fehlt"],
  },
  {
    id: "y1-customer-basics",
    year: 1,
    category: "Kundenkommunikation",
    title: "Sicheres Auftreten beim Kunden",
    explanation: "Begrüßung, Rückfragen, Schutz des Arbeitsbereichs und verständliche Abschlussinformationen gehören zum Auftrag.",
    practiceTask: "Begrüßung und kurze Erklärung des geplanten Arbeitsablaufs als Rollenspiel üben.",
    typicalErrors: ["Fachbegriffe nicht erklärt", "Änderungen nicht abgestimmt", "Arbeitsbereich ungefragt genutzt"],
  },
  {
    id: "y2-fastening-systems",
    year: 2,
    category: "Untergründe & Befestigung",
    title: "Befestigungssysteme auswählen",
    explanation: "Schrauben, Dübel, Siebhülsen, Injektionsmörtel und Abstandssysteme werden nach Last und Untergrund gewählt.",
    practiceTask: "Für Beton, Lochstein und WDVS je eine Befestigung vorschlagen und mit dem Meister prüfen.",
    typicalErrors: ["Dübel ohne Zulassung gewählt", "Randabstände ignoriert", "Bohrloch nicht gereinigt"],
  },
  {
    id: "y2-roller-installation",
    year: 2,
    category: "Rollladen",
    title: "Führungsschienen und Panzer montieren",
    explanation: "Führungsschienen müssen parallel, spannungsfrei und passend zum Panzerlauf ausgerichtet sein.",
    practiceTask: "Führungsschienen ausrichten, Diagonalen prüfen und den Lauf vor dem Abschluss dokumentieren.",
    typicalErrors: ["Schienen nicht parallel", "Zu wenig Laufspiel", "Befestigung verzieht das Profil"],
  },
  {
    id: "y2-awning-components",
    year: 2,
    category: "Markise",
    title: "Markisenaufbau und Kräfte",
    explanation: "Konsolen, Tragrohr, Tuchwelle, Gelenkarme und Ausfallprofil übertragen hohe Hebel- und Windkräfte.",
    practiceTask: "An einer Anlage den Kraftweg von den Armen bis in den tragenden Untergrund erklären.",
    typicalErrors: ["Konsole nur im Putz befestigt", "Konsolenabstand nicht eingehalten", "Windhinweis vergessen"],
  },
  {
    id: "y2-venetian-basics",
    year: 2,
    category: "Raffstore",
    title: "Raffstore führen und ausrichten",
    explanation: "Lamellen, Leiterkordel, Aufzugsband, Führungsschiene oder Seilführung müssen sauber zusammenspielen.",
    practiceTask: "Bauteile zeigen, Führung kontrollieren und eine Schiefstellung systematisch untersuchen.",
    typicalErrors: ["Aufzugsband verdreht", "Führung verspannt", "Lamellenpaket nicht gleichmäßig"],
  },
  {
    id: "y2-zip-screen-basics",
    year: 2,
    category: "ZIP-Screen",
    title: "ZIP-Tuch und Führungssystem",
    explanation: "Der seitliche Reißverschlusskeder hält das Tuch in der Führung und verlangt präzise Maße und Ausrichtung.",
    practiceTask: "Führungen parallel ausrichten und den Tuchlauf über mehrere Fahrten beobachten.",
    typicalErrors: ["Führungen nicht parallel", "Tuchspannung falsch bewertet", "Keder beim Einfädeln beschädigt"],
  },
  {
    id: "y2-insect-protection",
    year: 2,
    category: "Insektenschutz",
    title: "Spannrahmen, Drehrahmen und Rollo",
    explanation: "Bauform, Griffposition, Bürstendichtung und kollisionsfreie Bedienung bestimmen das passende System.",
    practiceTask: "Eine Öffnung aufmessen und begründen, welches Insektenschutzsystem geeignet ist.",
    typicalErrors: ["Entwässerung verdeckt", "Griffe kollidieren", "Lichtes Maß falsch übernommen"],
  },
  {
    id: "y3-motors-end-limits",
    year: 3,
    category: "Motoren & Steuerungen",
    title: "Rohrmotor, Drehrichtung und Endlagen",
    explanation: "Motortyp, Adapter, Mitnehmer, Drehrichtung und Endlagensystem müssen vor der Einstellung bekannt sein.",
    practiceTask: "Motordaten aufnehmen, Drehrichtung prüfen und Endlagen nach Herstellerablauf dokumentieren.",
    typicalErrors: ["Falscher Motortyp angenommen", "Endlage gegen Anschlag gefahren", "Adapter passt nicht zur Welle"],
  },
  {
    id: "y3-radio-sensors",
    year: 3,
    category: "Funk & Sensorik",
    title: "Sender, Empfänger und Sensoren",
    explanation: "Kanäle, Gruppen, Reichweite, Wind- und Sonnensensoren werden kontrolliert eingelernt und getestet.",
    practiceTask: "Einen Sender zuordnen, Automatik testen und die Bedienung verständlich erklären.",
    typicalErrors: ["Mehrere Motoren gleichzeitig bestromt", "Falscher Kanal", "Sensor nur optisch statt funktional geprüft"],
  },
  {
    id: "y3-diagnosis-systematic",
    year: 3,
    category: "Fehlerdiagnose",
    title: "Fehlerbilder systematisch eingrenzen",
    explanation: "Fehlerbeschreibung, Sichtprüfung, sichere Messung und Vergleich mit Herstellerdaten führen zur belastbaren Ursache.",
    practiceTask: "Ein Fehlerbild mit Ursache, Prüfschritten, Ergebnis und nächster Maßnahme protokollieren.",
    typicalErrors: ["Bauteil auf Verdacht getauscht", "Mehrere Änderungen gleichzeitig", "Messergebnis nicht dokumentiert"],
  },
  {
    id: "y3-maintenance",
    year: 3,
    category: "Wartung",
    title: "Wartung und Verschleiß erkennen",
    explanation: "Reinigung, Sichtprüfung, Befestigungen, bewegliche Teile, Motorlauf und Sicherheitseinrichtungen werden geplant geprüft.",
    practiceTask: "Eine Wartungsliste abarbeiten und zwischen Pflege, Einstellung und Reparatur unterscheiden.",
    typicalErrors: ["Ungeeignetes Schmiermittel", "Nur Funktion statt Befestigung geprüft", "Verschleiß nicht fotografiert"],
  },
  {
    id: "y3-norms",
    year: 3,
    category: "Normen & Dokumentation",
    title: "Herstellerangaben, Normen und Wind",
    explanation: "Normen geben den Rahmen vor; Produktfreigabe, Größe, Einbauort und Herstellerangaben entscheiden im Einzelfall.",
    practiceTask: "Für einen Auftrag relevante Herstellerunterlagen und drei dokumentationspflichtige Punkte benennen.",
    typicalErrors: ["Norm als pauschale Freigabe verstanden", "Windklasse ohne Einbausituation bewertet", "Anleitung nicht zugeordnet"],
  },
  {
    id: "y3-documentation",
    year: 3,
    category: "Normen & Dokumentation",
    title: "Fotos, Protokoll und Übergabe",
    explanation: "Status, Vorher-/Nachher-Fotos, Messwerte, Abweichungen, Kundeneinweisung und Unterschriften sichern den Auftrag ab.",
    practiceTask: "Einen Musterauftrag mit vollständigem Foto- und Montageprotokoll abschließen.",
    typicalErrors: ["Fotos ohne Zuordnung", "Abweichung nur mündlich", "Kundeneinweisung nicht dokumentiert"],
  },
  {
    id: "y4-risk-assessment",
    year: 4,
    category: "Sicherheit",
    title: "Gefährdungsbeurteilung und Verantwortung",
    explanation: "Komplexe Baustellen werden vor Beginn nach Absturz, Elektrik, Verkehrswegen, Lasten und Fremdgewerken bewertet.",
    practiceTask: "Für eine Markisenmontage eine kurze Gefährdungsbeurteilung mit Maßnahmen erstellen.",
    typicalErrors: ["Routine ersetzt Planung", "Änderung der Baustelle nicht neu bewertet", "Verantwortung unklar"],
  },
  {
    id: "y4-special-substrates",
    year: 4,
    category: "Untergründe & Befestigung",
    title: "Sonderuntergründe und Bedenken",
    explanation: "Mehrschalige, unbekannte oder geschädigte Untergründe verlangen Prüfung, Freigabe oder einen dokumentierten Bedenkenhinweis.",
    practiceTask: "Eine unsichere Einbausituation bewerten und einen technisch klaren Bedenkenhinweis formulieren.",
    typicalErrors: ["Tragfähigkeit geschätzt", "Probebohrung nicht abgestimmt", "Bedenken erst nach Montage gemeldet"],
  },
  {
    id: "y4-awning-planning",
    year: 4,
    category: "Markise",
    title: "Markisenmontage planen und freigeben",
    explanation: "Ausfall, Breite, Konsolenlage, Untergrund, Montagehöhe, Strom und Wind ergeben gemeinsam das Montagekonzept.",
    practiceTask: "Aus Aufmaß und Herstellerunterlage einen Montageplan mit Konsolen und Befestigung erstellen.",
    typicalErrors: ["Konsolen nach Optik verteilt", "Leitungen nicht eingeplant", "Seitliche Freiräume übersehen"],
  },
  {
    id: "y4-complex-measurement",
    year: 4,
    category: "Aufmaß",
    title: "Komplexes Aufmaß und technische Klärung",
    explanation: "Schiefe Öffnungen, Fassadenversprünge, Kopplungen, Kabelwege und Wartungszugänge werden in einer belastbaren Skizze zusammengeführt.",
    practiceTask: "Eine komplexe Fassade mit Bezugslinien, Schnitt und offenen technischen Fragen dokumentieren.",
    typicalErrors: ["Kein fester Bezugspunkt", "Toleranzen nicht berücksichtigt", "Offene Frage als Annahme behandelt"],
  },
  {
    id: "y4-complaints",
    year: 4,
    category: "Kundenkommunikation",
    title: "Reklamation und schwierige Gespräche",
    explanation: "Sachliches Zuhören, gesicherte Fakten, klare nächste Schritte und keine vorschnellen Schuldeingeständnisse schützen alle Beteiligten.",
    practiceTask: "Ein Reklamationsgespräch mit Fehleraufnahme und schriftlicher Zusammenfassung üben.",
    typicalErrors: ["Ursache sofort versprochen", "Kundenwahrnehmung abgewertet", "Termin oder Zuständigkeit bleibt offen"],
  },
  {
    id: "y4-drive-diagnosis",
    year: 4,
    category: "Motoren & Steuerungen",
    title: "Antriebs- und Steuerungsdiagnose",
    explanation: "Netzversorgung, Motor, Steuerung, Funkweg, Sensorik und mechanische Last werden getrennt und sicher geprüft.",
    practiceTask: "Einen Diagnosebaum für eine sporadisch ausfallende Anlage erstellen und Messpunkte festlegen.",
    typicalErrors: ["Elektrischen und mechanischen Fehler vermischt", "Ohne Schaltplan gemessen", "Sporadischen Fehler nicht reproduziert"],
  },
];

const additionalLearningModules = [
  { id: "y1-workplace-organization", year: 1, category: "Grundlagen", title: "Arbeitsplatz und Fahrzeug organisieren", explanation: "Material, Werkzeug, Schutzbereiche und Rücktransport werden so vorbereitet, dass sichere und saubere Abläufe möglich sind.", practiceTask: "Für einen Montageauftrag Material und Werkzeug in Arbeitsreihenfolge zusammenstellen und fehlende Teile markieren.", typicalErrors: ["Suchzeiten durch ungeordnete Ablage", "Flucht- oder Kundenwege zugestellt", "Restmaterial nicht zugeordnet"], relatedTools: ["Werkzeugkoffer", "Materialliste"] },
  { id: "y1-units-documentation", year: 1, category: "Grundlagen", title: "Maße, Einheiten und saubere Notizen", explanation: "Millimeter, Zentimeter, Winkel, Stückzahlen und eindeutige Bezugspunkte werden ohne stillschweigende Annahmen dokumentiert.", practiceTask: "Eine Aufmaßnotiz prüfen, Einheiten ergänzen und drei unklare Angaben eindeutig formulieren.", typicalErrors: ["Einheit fehlt", "Innen- und Außenmaß verwechselt", "Unleserliche Korrektur"], relatedTools: ["Maßband", "Winkelmesser"], prerequisites: [] },
  { id: "y1-hand-tools", year: 1, category: "Werkzeug & Material", title: "Handwerkzeuge sicher einsetzen", explanation: "Schraubendreher, Zangen, Schlüssel, Feilen und Handnietwerkzeuge werden passend, unbeschädigt und materialschonend eingesetzt.", practiceTask: "Fünf Handwerkzeuge auswählen, Einsatzgrenze erklären und vor Gebrauch sichtbar prüfen.", typicalErrors: ["Falsche Größe", "Werkzeug als Hebel missbraucht", "Beschädigte Griffe übersehen"], relatedTools: ["Schraubendreher", "Zange", "Feile"] },
  { id: "y1-power-tools", year: 1, category: "Werkzeug & Material", title: "Elektrowerkzeuge vorbereiten", explanation: "Bohrmaschine, Akkuschrauber und Trennwerkzeuge werden nur nach Einweisung, Sichtprüfung und passender Werkzeugauswahl benutzt.", practiceTask: "Bohrer und Drehmoment für drei Übungssituationen auswählen und die Sicherheitsprüfung erklären.", typicalErrors: ["Falscher Bohrer", "Leitungssuche vergessen", "Werkstück nicht gesichert"], safetyNotes: ["Nur nach betrieblicher Einweisung verwenden", "Schutzbrille und weitere erforderliche PSA beachten"] },
  { id: "y1-measuring-tools", year: 1, category: "Werkzeug & Material", title: "Messwerkzeuge kontrollieren", explanation: "Maßband, Wasserwaage, Laser und Winkel helfen nur, wenn Bezugspunkt, Zustand und Plausibilität stimmen.", practiceTask: "Eine Öffnung mit zwei Messmitteln prüfen und Abweichungen nachvollziehbar notieren.", typicalErrors: ["Laser ohne Bezugslinie", "Maßband schräg gehalten", "Messwert ohne Gegenprüfung"], relatedTools: ["Maßband", "Wasserwaage", "Laser"] },
  { id: "y1-basic-reporting", year: 1, category: "Normen & Dokumentation", title: "Tätigkeiten fachlich dokumentieren", explanation: "Ein guter Ausbildungsnachweis nennt konkrete Arbeiten, Werkzeug, Produkt und Lerninhalt, ohne Kundendaten unnötig zu übernehmen.", practiceTask: "Aus fünf Stichpunkten einen kurzen eigenen Tagesbericht formulieren und vor dem Speichern prüfen.", typicalErrors: ["Nur ‚Montage gemacht‘", "Kundendaten unnötig kopiert", "Text ungeprüft übernommen"], relatedTools: ["Berichtsheft"] },

  { id: "y2-concrete-fastening", year: 2, category: "Untergründe & Befestigung", title: "Befestigung in Beton und Vollstein", explanation: "Untergrundzustand, Last, Randabstände, Bohrloch und freigegebenes Befestigungssystem werden gemeinsam betrachtet.", practiceTask: "Eine Befestigungssituation aufnehmen und die Auswahl mit Produktunterlage und Meister besprechen.", typicalErrors: ["Bohrloch nicht gereinigt", "Randbereich unterschätzt", "Putz als Untergrund bewertet"], relatedProducts: ["markise", "vorbaurollladen"], relatedTools: ["Bohrhammer", "Leitungssucher"], prerequisites: ["y1-substrates-recognize"] },
  { id: "y2-hollow-aac", year: 2, category: "Untergründe & Befestigung", title: "Lochstein und Porenbeton unterscheiden", explanation: "Hohlkammern, geringe Rohdichte und unterschiedliche Bohrverfahren verlangen passende, freigegebene Systeme und vorsichtiges Arbeiten.", practiceTask: "Bohrmehl und Probebohrung beurteilen und Unterschiede zwischen Lochstein und Porenbeton erklären.", typicalErrors: ["Schlagbohren ungeprüft verwendet", "Siebhülse vergessen", "Untergrund nur nach Farbe bestimmt"], relatedTools: ["Bohrer", "Siebhülse"], prerequisites: ["y1-substrates-recognize"] },
  { id: "y2-wood-steel", year: 2, category: "Untergründe & Befestigung", title: "Holz und Stahl als Befestigungsgrund", explanation: "Bauteildicke, Korrosionsschutz, Vorbohren und geeignete Verbindungsmittel werden vor der Montage geklärt.", practiceTask: "Je eine Holz- und Stahlverbindung vorbereiten und Auswahl sowie Korrosionsschutz begründen.", typicalErrors: ["Bauteildicke nicht geprüft", "Ungeeignete Schraube", "Korrosionsschutz beschädigt"], relatedTools: ["Metallbohrer", "Holzbohrer", "Drehmomenteinstellung"] },
  { id: "y2-wdvs-altbau", year: 2, category: "Untergründe & Befestigung", title: "WDVS, Klinker und Altbau-Mischmauerwerk", explanation: "Mehrschichtige oder unbekannte Aufbauten werden nicht pauschal bewertet. Lastabtragung, Abstandsmontage, Abdichtung und fachliche Freigabe sind zu klären.", practiceTask: "Eine Fassadensituation skizzieren, Schichten markieren und offene Fragen vor der Befestigungswahl notieren.", typicalErrors: ["Dämmung als tragend angenommen", "Klinkerschale ungeprüft belastet", "Altbau-Untergrund geschätzt"], safetyNotes: ["Bei unklarem Traggrund Arbeit stoppen und fachliche Klärung einholen"], prerequisites: ["y2-fastening-systems"] },
  { id: "y2-roller-gurt-maintenance", year: 2, category: "Rollladen", title: "Gurt, Wickler und Rollladenwartung", explanation: "Gurtlauf, Wickler, Gurtscheibe, Führung und Panzer werden als zusammenhängender mechanischer Weg geprüft.", practiceTask: "An einer gesicherten Anlage Verschleißpunkte benennen und eine Wartungsnotiz erstellen.", typicalErrors: ["Wickler ungesichert geöffnet", "Gurt verdreht eingebaut", "Schwergängigkeit nur am Gurt gesucht"], relatedDiagnostics: ["gurt-schwer", "rollladen-schief"], prerequisites: ["y1-roller-components"] },
  { id: "y2-awning-measurement", year: 2, category: "Aufmaß", title: "Markisen-Aufmaß vorbereiten", explanation: "Breite, Ausfall, Montagehöhe, Untergrund, Freiräume, Stromweg und Zugänglichkeit müssen gemeinsam dokumentiert werden.", practiceTask: "Eine Einbausituation ohne Bestellfreigabe aufnehmen und alle offenen technischen Fragen markieren.", typicalErrors: ["Nur Breite und Ausfall", "Konsolenbereich nicht geprüft", "Leitungsweg fehlt"], relatedProducts: ["markise"], prerequisites: ["y1-measurement-basics", "y2-awning-components"] },
  { id: "y2-raffstore-bands", year: 2, category: "Raffstore", title: "Aufzugsband, Leiterkordel und Wendung", explanation: "Heben, Senken und Wenden entstehen aus dem Zusammenspiel von Motor, Welle, Bändern, Leiterkordeln und Lamellen.", practiceTask: "Den Bewegungsablauf beobachten und eine verdrehte oder ungleichmäßige Führung erkennen.", typicalErrors: ["Band über Wendung kompensiert", "Lamelle gewaltsam gerichtet", "Führung nicht verglichen"], relatedDiagnostics: ["raffstore-wendet-falsch", "raffstore-klappert"], prerequisites: ["y2-venetian-basics"] },
  { id: "y2-insect-repair", year: 2, category: "Insektenschutz", title: "Insektenschutz prüfen und reparieren", explanation: "Rahmen, Gewebe, Bürsten, Rollen und Beschläge werden auf Maß, Verschleiß und kollisionsfreie Bedienung geprüft.", practiceTask: "Eine kleine Reparatur dokumentieren und benötigte Ersatzteilmaße aufnehmen.", typicalErrors: ["Gewebe zu stark gespannt", "Bürste zu hoch", "Rahmen verzogen"], relatedDiagnostics: ["insektenschutz-klemmt"], prerequisites: ["y2-insect-protection"] },

  { id: "y3-mechanical-motors", year: 3, category: "Motoren & Steuerungen", title: "Mechanische Rohrmotoren", explanation: "Mechanische Endlagen, Adapter, Mitnehmer, Welle und Drehrichtung werden eindeutig identifiziert, bevor Einstellungen verändert werden.", practiceTask: "Motortyp aufnehmen und eine sichere Prüf- und Dokumentationsreihenfolge erstellen.", typicalErrors: ["Endlage gegen Anschlag", "Adapter nicht geprüft", "Mechanik über Einstellung kompensiert"], safetyNotes: ["Elektrische Arbeiten nur entsprechend Qualifikation und geltenden Vorschriften"], prerequisites: ["y1-roller-components"] },
  { id: "y3-electronic-motors", year: 3, category: "Motoren & Steuerungen", title: "Elektronische Rohrmotoren", explanation: "Elektronische Lern- und Schutzfunktionen sind modellabhängig. Hersteller, Serie und freie Mechanik müssen vor dem Lernlauf feststehen.", practiceTask: "Herstellerunterlage zuordnen und einen Lernablauf als Prüfliste dokumentieren, ohne ihn an einer unbekannten Anlage auszuführen.", typicalErrors: ["Falsche Lernsequenz", "Mehrere Motoren gleichzeitig", "Schwergängigkeit eingelernt"], safetyNotes: ["Keine Programmierung ohne eindeutige Identifikation"], prerequisites: ["y3-mechanical-motors", "y3-motors-end-limits"] },
  { id: "y3-radio-systems", year: 3, category: "Funk & Sensorik", title: "Funkmotoren und Senderzuordnung", explanation: "Funkfamilie, Kanal, Einzel-/Gruppenbedienung und vorhandene Zuordnungen werden vor Änderungen aufgenommen.", practiceTask: "Eine Funkanlage dokumentieren und eine fehlerfreie Testreihenfolge mit Rückfallebene erklären.", typicalErrors: ["Pauschaler Reset", "Falscher Kanal", "Nachbarmotor mitgekoppelt"], relatedDiagnostics: ["funk-reagiert-nicht", "sender-verloren"], prerequisites: ["y3-motors-end-limits"] },
  { id: "y3-solar-motors", year: 3, category: "Motoren & Steuerungen", title: "Solarmotor, Akku und Panel", explanation: "Ladezustand, Panelposition, Verschattung, Steckverbindungen und Funkweg werden getrennt vom mechanischen Lauf beurteilt.", practiceTask: "Eine Solarinstallation sichtbar prüfen und Lade-, Funk- sowie Mechanikpunkte getrennt protokollieren.", typicalErrors: ["Panel im Schatten", "Akku vor Lernfahrt leer", "Steckverbindung nicht verriegelt"], relatedProducts: ["vorbaurollladen", "zipscreen"], prerequisites: ["y3-radio-systems"] },
  { id: "y3-controls-sensors", year: 3, category: "Motoren & Steuerungen", title: "Taster, Steuerungen und Sensorprioritäten", explanation: "Lokale Bedienstelle, Zentralsteuerung, Zeitprogramm und Sensorik können unterschiedliche Prioritäten besitzen.", practiceTask: "Bedienwege einer Anlage skizzieren und Hand-, Zentral- sowie Schutzbefehle unterscheiden.", typicalErrors: ["Priorität unbekannt", "Lokalen Taster nicht geprüft", "Sensorstatus nur angenommen"], relatedDiagnostics: ["sensorik-falsch", "anlage-faehrt-selbst"], prerequisites: ["y3-radio-sensors"] },
  { id: "y3-smart-home", year: 3, category: "Funk & Sensorik", title: "Smart-Home-Gateway Grundlagen", explanation: "Lokale Bedienung, Gatewayversorgung, Netzwerk und Gerätezuordnung werden in dieser Reihenfolge geprüft. Zugangsdaten gehören nicht in Lerntexte.", practiceTask: "Eine datensparsame Systemskizze mit Geräten, Gruppen und lokaler Ausfallbedienung erstellen.", typicalErrors: ["Gateway zuerst zurückgesetzt", "Kundenzugangsdaten notiert", "Lokalen Funkweg nicht geprüft"], relatedDiagnostics: ["gateway-offline", "anlage-faehrt-selbst"], prerequisites: ["y3-radio-systems"] },
  { id: "y3-rolltor-safety", year: 3, category: "Rolltor", title: "Rolltor, Antrieb und Sicherheit", explanation: "Torlauf, Führung, Profil, Antrieb, Notbedienung und Sicherheitseinrichtungen werden nur nach konkretem System und geltenden Vorgaben geprüft.", practiceTask: "Eine Sicht- und Dokumentationsprüfung planen; Sicherheitskreise nicht verändern oder überbrücken.", typicalErrors: ["Sicherheitskreis überbrückt", "Quetschbereich nicht gesichert", "Notbedienung nicht erklärt"], safetyNotes: ["Schwere bewegte Bauteile und Quetschstellen sichern", "Elektrische Prüfung nur durch qualifizierte Personen"], relatedProducts: ["rolltor"], relatedDiagnostics: ["rolltor-reversiert"] },
  { id: "y3-diagnosis-radio", year: 3, category: "Fehlerdiagnose", title: "Motor-, Funk- und Steuerungsfehler trennen", explanation: "Sichtprüfung, Bedienweg, Versorgung, Funk, Steuerung und Mechanik werden nacheinander geprüft und als Hinweise dokumentiert.", practiceTask: "Mit Diagnose 2.0 einen Fall bearbeiten und geprüfte sowie offene Punkte als Lernfall speichern.", typicalErrors: ["Bauteil auf Verdacht", "Mehrere Änderungen zugleich", "Unsicherheit nicht dokumentiert"], relatedDiagnostics: ["motor-faehrt-nicht", "funk-reagiert-nicht", "motor-eine-richtung"], prerequisites: ["y3-diagnosis-systematic", "y3-radio-systems"] },
  { id: "y3-customer-handover", year: 3, category: "Kundenkommunikation", title: "Bedienung und Pflege übergeben", explanation: "Bedienung, Automatik, Grenzen, Pflege und offene Punkte werden verständlich erklärt und nachvollziehbar dokumentiert.", practiceTask: "Eine fünfminütige Übergabe durchführen und anschließend die wichtigsten Hinweise schriftlich festhalten.", typicalErrors: ["Nur Sender übergeben", "Automatik nicht erklärt", "Pflegehinweis vergessen"], relatedProducts: ["vorbaurollladen", "markise", "raffstore", "zipscreen"] },

  { id: "y4-system-planning", year: 4, category: "Grundlagen", title: "Komplexen Auftrag fachlich strukturieren", explanation: "Aufmaß, Produkt, Untergrund, Befestigung, Antrieb, Sicherheit, Team und Dokumentation werden zu einem nachvollziehbaren Arbeitsplan verbunden.", practiceTask: "Einen realen Auftrag anonymisiert als Ablauf mit offenen Freigaben und Verantwortlichkeiten planen.", typicalErrors: ["Annahmen als Fakten", "Schnittstellen vergessen", "Keine Rückfallplanung"], prerequisites: ["y3-documentation", "y3-diagnosis-systematic"] },
  { id: "y4-electrical-responsibility", year: 4, category: "Sicherheit", title: "Elektrische Verantwortung und Grenzen", explanation: "Die App vermittelt Prüfstruktur, ersetzt aber weder Qualifikation noch betriebliche Beauftragung. Arbeiten werden nur im zulässigen Rahmen durchgeführt.", practiceTask: "Für drei Tätigkeiten klären, welche Qualifikation, Unterlage und Freigabe benötigt wird.", typicalErrors: ["App-Checkmark als Freigabe verstanden", "Ohne Schaltplan gearbeitet", "Messung nicht dokumentiert"], safetyNotes: ["Herstellerangaben, Elektrofachkraft und geltende Vorschriften beachten"], prerequisites: ["y4-risk-assessment"] },
  { id: "y4-height-heavy-parts", year: 4, category: "Sicherheit", title: "Arbeiten in Höhe und schwere Bauteile", explanation: "Zugang, Hebemittel, Anschlagpunkte, Teamkommunikation und Sperrbereiche werden vor Markisen- oder Torarbeiten geplant.", practiceTask: "Eine Montagebesprechung mit Rollen, Hebeweg, Abbruchkriterien und Notfallweg vorbereiten.", typicalErrors: ["Gewicht unterschätzt", "Unklare Kommandos", "Bereich nicht gesperrt"], safetyNotes: ["Keine improvisierten Hebe- oder Sicherungsmethoden"], relatedProducts: ["markise", "rolltor"] },
  { id: "y4-project-documentation", year: 4, category: "Normen & Dokumentation", title: "Technische Projekt- und Abweichungsdokumentation", explanation: "Unterlagen, Freigaben, Änderungen, Fotos, Prüfungen und Kundenübergabe werden nachvollziehbar zusammengeführt.", practiceTask: "Eine anonymisierte Auftragsakte auf Lücken prüfen und eine sachliche Abweichungsnotiz formulieren.", typicalErrors: ["Freigabe nicht zugeordnet", "Foto ohne Kontext", "Abweichung nur mündlich"], prerequisites: ["y3-documentation"] },
  { id: "y4-learning-reflection", year: 4, category: "Kundenkommunikation", title: "Praxis erklären und Lernbedarf erkennen", explanation: "Wer einen Ablauf verständlich erklären und Unsicherheiten benennen kann, erkennt eigene Lernlücken und unterstützt sichere Teamarbeit.", practiceTask: "Einen Praxisfall einem jüngeren Azubi erklären und zwei offene Fragen für den Meister notieren.", typicalErrors: ["Unsicherheit überspielt", "Zu viele Fachbegriffe", "Keine Rückfrage zugelassen"], prerequisites: ["y3-customer-handover"] },
];

const categoryDefaults = {
  Sicherheit: { products: [], tools: ["PSA"] },
  "Werkzeug & Material": { products: [], tools: ["Werkzeugauswahl"] },
  "Untergründe & Befestigung": { products: ["vorbaurollladen", "markise", "raffstore", "zipscreen"], tools: ["Bohrtechnik", "Leitungssucher"] },
  Rollladen: { products: ["vorbaurollladen", "aufsatzrollladen"], tools: ["Maßband", "Akkuschrauber"] },
  Markise: { products: ["markise", "pergola"], tools: ["Maßband", "Montagehilfe"] },
  Raffstore: { products: ["raffstore"], tools: ["Laser", "Maßband"] },
  "ZIP-Screen": { products: ["zipscreen", "screen_offen"], tools: ["Laser", "Maßband"] },
  Insektenschutz: { products: ["insektenschutz"], tools: ["Maßband", "Feile"] },
  Rolltor: { products: ["rolltor"], tools: ["Prüfprotokoll"] },
  "Motoren & Steuerungen": { products: ["vorbaurollladen", "markise", "raffstore", "zipscreen", "rolltor"], tools: ["Herstellerunterlage"] },
  "Funk & Sensorik": { products: ["vorbaurollladen", "markise", "raffstore", "zipscreen"], tools: ["Sender", "Herstellerunterlage"] },
  Fehlerdiagnose: { products: ["vorbaurollladen", "markise", "raffstore", "zipscreen", "rolltor"], tools: ["Diagnose 2.0"] },
};

function normalizeLearningModule(module) {
  const defaults = categoryDefaults[module.category] || { products: [], tools: [] };
  const requiredCheckpoints = module.requiredCheckpoints || ["read", "understood", "practiceSeen", "selfPerformed", "masterAsked"];
  const configuredQuizIds = module.relatedQuizIds || [];
  const categoryQuizIds = allQuizCards.filter((card) => card.moduleIds.includes(module.id) || card.category === module.category).map((card) => card.id).slice(0, 8);
  const relatedQuizIds = configuredQuizIds.length ? configuredQuizIds : categoryQuizIds.length ? categoryQuizIds : allQuizCards.filter((card) => card.y === module.year).map((card) => card.id).slice(0, 5);
  return {
    ...module,
    learningYear: module.learningYear || module.year,
    difficulty: module.difficulty || (module.year <= 1 ? "Grundlage" : module.year === 2 ? "Aufbau" : module.year === 3 ? "Vertiefung" : "Transfer"),
    estimatedMinutes: module.estimatedMinutes || 15 + module.year * 5,
    summary: module.summary || module.explanation,
    learningGoals: module.learningGoals || [`${module.title} fachlich einordnen`, "Wichtige Prüfpunkte benennen", "Ergebnis praxisnah dokumentieren"],
    theory: module.theory || module.explanation,
    practicalTask: module.practicalTask || module.practiceTask,
    practiceTask: module.practiceTask || module.practicalTask,
    typicalMistakes: module.typicalMistakes || module.typicalErrors || [],
    typicalErrors: module.typicalErrors || module.typicalMistakes || [],
    safetyNotes: module.safetyNotes || (["Sicherheit", "Motoren & Steuerungen", "Rolltor"].includes(module.category) ? ["Lernmodus ersetzt keine Unterweisung. Herstellerangaben, Qualifikation und geltende Vorschriften beachten."] : []),
    relatedProducts: module.relatedProducts || defaults.products,
    relatedTools: module.relatedTools || defaults.tools,
    relatedDiagnostics: module.relatedDiagnostics || [],
    relatedQuizIds,
    prerequisites: module.prerequisites || [],
    requiredCheckpoints,
  };
}

export const learningModules = [...baseLearningModules, ...additionalLearningModules].map(normalizeLearningModule);

export const learningPaths = [1, 2, 3, 4].map((year) => ({
  year,
  title: `Ausbildungsjahr ${year}`,
  moduleIds: learningModules.filter((module) => module.year === year).map((module) => module.id),
}));

export const learningGlossary = [
  { name: "Aufzugsband", explanation: "Trägt und bewegt das Lamellenpaket eines Raffstores.", category: "Raffstore", relatedProducts: ["raffstore"], relatedModules: ["y2-raffstore-bands"] },
  { name: "Leiterkordel", explanation: "Führt die Raffstorelamellen und unterstützt die Wendebewegung.", category: "Raffstore", relatedProducts: ["raffstore"], relatedModules: ["y2-raffstore-bands"] },
  { name: "Mitnehmer", explanation: "Überträgt das Motordrehmoment auf die Welle.", category: "Motor", relatedProducts: ["vorbaurollladen", "markise"], relatedModules: ["y3-mechanical-motors"] },
  { name: "Endlage", explanation: "Definierter Abschalt- oder Begrenzungspunkt einer Fahrbewegung.", category: "Motor", relatedProducts: ["vorbaurollladen", "markise", "raffstore", "zipscreen"], relatedModules: ["y3-motors-end-limits"] },
  { name: "ZIP-Keder", explanation: "Seitliche Tuchkante, die im ZIP-Screen in der Führung gehalten wird.", category: "ZIP-Screen", relatedProducts: ["zipscreen"], relatedModules: ["y2-zip-screen-basics"] },
  { name: "Ausfall", explanation: "Abstand, um den eine Markise von der Fassade ausfährt.", category: "Markise", relatedProducts: ["markise"], relatedModules: ["y2-awning-measurement"] },
  { name: "Revision", explanation: "Geplanter Zugang für Wartung, Prüfung oder Austausch von Bauteilen.", category: "Grundlagen", relatedProducts: ["vorbaurollladen", "aufsatzrollladen"], relatedModules: ["y1-roller-components"] },
  { name: "WDVS", explanation: "Mehrschichtiger Fassadenaufbau mit Dämmung; Lastabtragung und Abdichtung müssen geklärt werden.", category: "Untergrund", relatedProducts: ["markise", "vorbaurollladen"], relatedModules: ["y2-wdvs-altbau"] },
  { name: "Siebhülse", explanation: "Hilfsmittel, das Injektionsmörtel in Hohlkammersteinen am vorgesehenen Ort hält.", category: "Untergrund", relatedProducts: [], relatedModules: ["y2-hollow-aac"] },
  { name: "Sensorpriorität", explanation: "Festgelegter Vorrang bestimmter Automatik- oder Schutzbefehle, etwa Wind vor Sonne.", category: "Sensorik", relatedProducts: ["markise", "raffstore"], relatedModules: ["y3-controls-sensors"] },
  { name: "Funkfamilie", explanation: "Zusammengehöriges System kompatibler Sender, Empfänger und Antriebe.", category: "Funk", relatedProducts: ["vorbaurollladen", "markise"], relatedModules: ["y3-radio-systems"] },
  { name: "Bedenkenhinweis", explanation: "Sachliche Dokumentation eines erkannten technischen oder sicherheitsrelevanten Risikos vor der Ausführung.", category: "Dokumentation", relatedProducts: [], relatedModules: ["y4-special-substrates"] },
];

export function getLearningModuleProgress(progress = {}) {
  return learningCheckpoints.filter((checkpoint) => Boolean(progress?.[checkpoint.id])).length;
}

export function isLearningModuleComplete(progress = {}, module = null) {
  const required = module?.requiredCheckpoints || learningCheckpoints.filter((checkpoint) => !checkpoint.optional).map((checkpoint) => checkpoint.id);
  return required.every((checkpointId) => Boolean(progress?.[checkpointId]));
}
