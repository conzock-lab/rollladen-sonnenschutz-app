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

export const allQuizCards = [...quizCards, ...extraQuizCards];

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
  "Sicherheit",
  "Werkzeug & Material",
  "Untergründe & Befestigung",
  "Rollladen",
  "Markise",
  "Raffstore",
  "ZIP-Screen",
  "Insektenschutz",
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
  { id: "masterAsked", label: "Meister gefragt" },
];

export const learningModules = [
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

export function getLearningModuleProgress(progress = {}) {
  return learningCheckpoints.filter((checkpoint) => Boolean(progress?.[checkpoint.id])).length;
}

export function isLearningModuleComplete(progress = {}) {
  return getLearningModuleProgress(progress) === learningCheckpoints.length;
}
