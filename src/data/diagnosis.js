export const diagnosisTrees = [
  { id: "motor-faehrt-nicht", title: "Motor fährt nicht", category: "Motor / Elektro", tools: ["Spannungsprüfer", "Multimeter", "Sender", "Einstellkabel"], firstSteps: ["Anlage nicht weiter belasten", "Sichtprüfung", "Motortyp feststellen"], start: { q: "Brummt der Motor?", yes: "Mechanische Blockade, schwergängiger Panzer oder defekter Motor möglich. Laufweg, Welle, Lager und Endlagen prüfen.", no: "Stromversorgung, Sicherung, Taster, Sender, Empfänger und Klemmen prüfen." } },
  { id: "motor-brummt", title: "Motor brummt, bewegt aber nicht", category: "Motor / Mechanik", tools: ["Spannungsprüfer", "Schraubendreher", "Einstellkabel"], firstSteps: ["Sofort stoppen", "Blockade ausschließen", "Panzer entlasten"], start: { q: "Lässt sich der Panzer mechanisch frei bewegen?", yes: "Motor, Kondensator, Bremse, Adapter oder Endlage prüfen.", no: "Blockade in Führung, Panzer, Endstab, Welle oder Aufhängung suchen." } },
  { id: "rollladen-schief", title: "Rollladen läuft schief", category: "Rollladen", tools: ["Laser", "Wasserwaage", "Akkuschrauber"], firstSteps: ["Lauf stoppen", "Führung prüfen", "Panzer prüfen"], start: { q: "Sind Führungsschienen parallel und frei?", yes: "Panzer, Lamellen, Aufhängungen, Welle und Lager prüfen.", no: "Schienen reinigen, neu ausrichten und Abstand oben/unten vergleichen." } },
  { id: "funk-reagiert-nicht", title: "Funk reagiert nicht", category: "Funk / Steuerung", tools: ["Ersatzbatterie", "Handsender", "Spannungsprüfer"], firstSteps: ["Batterie prüfen", "Kanal prüfen", "Reichweite prüfen"], start: { q: "Reagiert ein anderer Sender oder Kanal?", yes: "Problem liegt wahrscheinlich am einzelnen Sender, Kanal oder der Batterie.", no: "Empfänger/Motor mit Spannung versorgen, Reichweite prüfen und Einlernen kontrollieren." } },
  { id: "markise-stoppt", title: "Markise stoppt früh", category: "Markise", tools: ["Sender", "Einstellkabel", "Multimeter"], firstSteps: ["Hindernis prüfen", "Windautomatik prüfen", "Gelenkarme prüfen"], start: { q: "Ist Windautomatik oder Hindernis aktiv?", yes: "Windwächter, Hindernis, Gelenkarme und Sensorstatus prüfen.", no: "Endlagen, Motorschutz, Tuchwicklung und Schwergängigkeit prüfen." } },
  { id: "zipscreen-klemmt", title: "ZIP-Screen klemmt oder läuft schief", category: "ZIP-Screen", tools: ["Laser", "weiche Bürste", "Akkuschrauber"], firstSteps: ["Schienen reinigen", "Parallelität prüfen", "Tuchführung prüfen"], start: { q: "Sind die Seitenschienen sauber und parallel?", yes: "Tuchführung, ZIP-Keder, Endlagen und Tuchspannung prüfen.", no: "Schienen reinigen und neu ausrichten. Danach langsame Probefahrt." } },
  { id: "raffstore-wendet-falsch", title: "Raffstore wendet falsch", category: "Raffstore", tools: ["Sender", "Einstellkabel", "Laser"], firstSteps: ["Drehrichtung prüfen", "Wendepunkt prüfen", "Lamellen prüfen"], start: { q: "Stimmt die Drehrichtung?", yes: "Wendepunkt, Aufzugsbänder, Lamellenpaket und Steuerung prüfen.", no: "Drehrichtung nach Herstellerangabe korrigieren." } },
  { id: "sensorik-falsch", title: "Wind-/Sonnensensor reagiert falsch", category: "Sensorik", tools: ["Sender", "Herstelleranleitung", "Leiter"], firstSteps: ["Sensorposition prüfen", "Sensor reinigen", "Grenzwerte prüfen"], start: { q: "Ist der Sensor richtig positioniert und sauber?", yes: "Grenzwerte, Funkverbindung, Batterien und Automatikmodus prüfen.", no: "Sensor reinigen, ausrichten oder Montageort ändern." } },
];

export const extraDiagnosisTrees = [
  { id: "rollladen-klemmt-unten", title: "Rollladen klemmt unten", category: "Rollladen", tools: ["Taschenlampe", "Bürste", "Laser"], firstSteps: ["Endstab prüfen", "Führung reinigen", "Panzer entlasten"], start: { q: "Klemmt der Endstab in der Führung oder auf der Fensterbank?", yes: "Führung reinigen, Endstab kontrollieren, Anschläge und untere Endlage prüfen.", no: "Panzer, Aufhängung und Welle auf Schiefstand oder beschädigte Lamellen prüfen." } },
  { id: "frost-problem", title: "Rollladen bei Frost fest", category: "Wetter / Bedienung", tools: ["Sichtprüfung", "Kundenhinweis"], firstSteps: ["Nicht mit Gewalt fahren", "Eisbildung prüfen", "Endlage entlasten"], start: { q: "Ist Eis oder angefrorener Endstab sichtbar?", yes: "Nicht weiter belasten. Kunde über Frostschutz/Bedienpause informieren und nach Tauwetter testen.", no: "Führung, Endlage und Hinderniserkennung prüfen." } },
  { id: "gurt-schwer", title: "Gurt läuft schwer", category: "Gurt / Bedienung", tools: ["Schraubendreher", "Ersatzgurt", "Gurtwickler"], firstSteps: ["Gurtlauf prüfen", "Wickler öffnen", "Gurtscheibe ansehen"], start: { q: "Ist der Gurt ausgefranst oder verdreht?", yes: "Gurt ersetzen, Wickler und Gurtscheibe prüfen.", no: "Panzerlauf, Lager, Führung und Gurtwickler-Feder prüfen." } },
  { id: "sender-verloren", title: "Sender verloren oder defekt", category: "Funk / Steuerung", tools: ["Ersatzsender", "Herstelleranleitung", "Leiter"], firstSteps: ["Hersteller bestimmen", "Motortyp klären", "Zugang zur Programmtaste"], start: { q: "Gibt es noch einen funktionierenden Sender?", yes: "Sender kopieren/einlernen nach Herstellerangabe.", no: "Motor/Empfängerzugang prüfen, Reset nur nach Absprache und mit Einzelschaltung durchführen." } },
  { id: "markise-schliesst-schief", title: "Markise schließt nicht sauber", category: "Markise", tools: ["Laser", "Maßband", "Inbusschlüssel"], firstSteps: ["Ausfallprofil ansehen", "Arme vergleichen", "Tuchwicklung prüfen"], start: { q: "Ist das Ausfallprofil links/rechts unterschiedlich?", yes: "Arme, Neigung, Konsolen und Tuchwicklung prüfen.", no: "Endlage, Kassettensitz und Hindernisse prüfen." } },
  { id: "raffstore-klappert", title: "Raffstore klappert bei Wind", category: "Raffstore", tools: ["Schraubendreher", "Laser", "Windhinweis"], firstSteps: ["Führungen prüfen", "Abstand prüfen", "Windgrenze klären"], start: { q: "Sind Führungsschienen/Seile fest und richtig gespannt?", yes: "Lamellen, Clips, Windgrenze und Kundenhinweis prüfen.", no: "Führung befestigen/spannen und Probefahrt durchführen." } },
  { id: "rolltor-reversiert", title: "Rolltor stoppt oder reversiert", category: "Tor / Sicherheit", tools: ["Prüfkörper", "Multimeter", "Anleitung"], firstSteps: ["Sicherheitsleiste prüfen", "Lichtschranke prüfen", "Laufweg frei"], start: { q: "Löst eine Sicherheitseinrichtung aus?", yes: "Sicherheitsleiste, Lichtschranke, Kabel und Ausrichtung prüfen.", no: "Kraft, Endlagen, Torlauf und Steuerungsfehler prüfen." } },
  { id: "insektenschutz-klemmt", title: "Insektenschutzrahmen klemmt", category: "Insektenschutz", tools: ["Maßband", "Gummihammer", "Feile"], firstSteps: ["Rahmenmaß prüfen", "Bürsten prüfen", "Beschläge prüfen"], start: { q: "Ist der Rahmen verzogen oder zu stramm?", yes: "Rahmen richten, Bürstenhöhe prüfen und Beschläge justieren.", no: "Laufprofil reinigen, Griffe und Schließteile prüfen." } },
];

export const advancedDiagnosisTrees = [
  { id: "gateway-offline", title: "Smart-Home Gateway offline", category: "Smart Home", tools: ["Routerstatus", "Gateway-App", "Netzteil", "Herstelleranleitung"], firstSteps: ["Lokale Bedienung der Anlage testen", "Gateway-LED/Status unverändert dokumentieren", "Netzwerkänderung beim Kunden erfragen"], start: { q: "Funktioniert die Anlage noch über lokalen Taster oder Sender?", yes: "Antrieb ist grundsätzlich erreichbar. Gatewayversorgung, Netzwerk, Konto und Gerätezuordnung schrittweise prüfen.", no: "Zuerst Versorgung, Antrieb und lokalen Funkweg prüfen; Gateway nicht vorschnell zurücksetzen." } },
  { id: "motor-eine-richtung", title: "Motor fährt nur in eine Richtung", category: "Motor / Elektro", tools: ["Zweipoliger Spannungsprüfer", "Schaltbild", "Einstellkabel", "Herstelleranleitung"], firstSteps: ["Mechanischen Laufweg ansehen", "Taster/Sender gegenprüfen", "Motortyp und Endlagenart feststellen"], start: { q: "Liegt der Fehler bei einer zweiten Bedienstelle genauso vor?", yes: "Endlage, Motor, Empfänger oder Anschluss fachgerecht prüfen.", no: "Einzelne Bedienstelle, Kanal, Batterie oder Schaltkontakt prüfen." } },
  { id: "anlage-faehrt-selbst", title: "Anlage fährt unerwartet selbstständig", category: "Sensorik", tools: ["Sender", "Gateway-App", "Sensorstatus", "Herstelleranleitung"], firstSteps: ["Zeit und Fahrtrichtung dokumentieren", "Automatik/Szene beim Kunden erfragen", "Wind-/Sonnensensorstatus prüfen"], start: { q: "Ist eine Automatik, Szene oder Zentralsteuerung aktiv?", yes: "Zeitplan, Sensorpriorität und Gruppenzuordnung prüfen; nicht sofort zurücksetzen.", no: "Fremdsender, klemmende Bedienstelle, Empfänger und Versorgung durch Fachkraft prüfen lassen." } },
];

const diagnosisProductsByCategory = {
  Rollladen: ["vorbaurollladen", "aufsatzrollladen"],
  Markise: ["markise", "pergola"],
  Raffstore: ["raffstore"],
  "ZIP-Screen": ["zipscreen", "screen_offen"],
  Insektenschutz: ["insektenschutz"],
  "Tor / Sicherheit": ["rolltor", "garagentor_antrieb"],
  "Motor / Elektro": ["vorbaurollladen", "aufsatzrollladen", "markise", "raffstore", "zipscreen", "rolltor"],
  "Motor / Mechanik": ["vorbaurollladen", "aufsatzrollladen", "markise", "raffstore", "zipscreen", "rolltor"],
  "Funk / Steuerung": ["vorbaurollladen", "aufsatzrollladen", "markise", "raffstore", "zipscreen", "rolltor"],
  Sensorik: ["markise", "raffstore", "zipscreen", "vorbaurollladen"],
  "Smart Home": ["vorbaurollladen", "aufsatzrollladen", "markise", "raffstore", "zipscreen", "rolltor"],
};

const safetyCategories = ["Motor / Elektro", "Tor / Sicherheit"];

export const allDiagnosisTrees = [...diagnosisTrees, ...extraDiagnosisTrees, ...advancedDiagnosisTrees].map((tree) => ({
  ...tree,
  productIds: tree.productIds || diagnosisProductsByCategory[tree.category] || [],
  safety: safetyCategories.includes(tree.category),
  finishSteps: ["Ursache oder Verdacht im Auftrag notiert", "Foto/Typenschild ergänzt", "Probefahrt oder sichere Außerbetriebnahme dokumentiert"],
}));

export const partCatalog = [
  { group: "Rollladen", product: "Rollladen", name: "Gurtwickler", asks: ["Gurtbreite", "Aufputz/Einlass", "Lochabstand", "Farbe"], tip: "Federkraft prüfen und Gurt nicht verdrehen." },
  { group: "Rollladen", product: "Rollladen", name: "Gurtscheibe", asks: ["Welle", "Gurtbreite", "Durchmesser", "Lagerseite"], tip: "Passend zur Welle und zum Gurt wählen." },
  { group: "Rollladen", product: "Rollladen", name: "Rollladenwelle SW40/SW60", asks: ["Länge", "Wellentyp", "Lager", "Motor/Gurt"], tip: "Welle gerade zuschneiden und entgraten." },
  { group: "Motor", product: "Motor", name: "Rohrmotor", asks: ["Nm", "Welle", "Länge", "Funk/Kabel", "Endlagenart"], tip: "Drehmoment anhand Panzergewicht/Größe prüfen." },
  { group: "Motor", product: "Motor", name: "Motoradapter / Mitnehmer", asks: ["Motormarke", "Wellentyp", "Serie"], tip: "Falscher Adapter verursacht Spiel oder Blockade." },
  { group: "Markise", product: "Markise", name: "Markisentuch", asks: ["Breite", "Ausfall", "Tuchnummer", "Volant"], tip: "Wickelrichtung und Tuchspannung dokumentieren." },
  { group: "Markise", product: "Markise", name: "Gelenkarm", asks: ["Hersteller", "Ausfall", "Seite", "Armtyp"], tip: "Federgespannte Arme nur gesichert bearbeiten." },
  { group: "Raffstore", product: "Raffstore", name: "Aufzugsband", asks: ["Breite", "Länge", "Hersteller", "Lamellentyp"], tip: "Bänder nicht verdrehen." },
  { group: "Insektenschutz", product: "Insektenschutz", name: "Bürstendichtung", asks: ["Nutmaß", "Bürstenhöhe", "Farbe"], tip: "Dicht, aber nicht bremsend einsetzen." },
];

export const extraPartCatalog = [
  { group: "Rollladen", product: "Rollladen", name: "Aufhängefeder / Befestigungsfeder", asks: ["Wellentyp", "Panzerprofil", "Breite", "Sicherungsart"], tip: "Aufhängungen gleichmäßig verteilen und Hochschiebeschutz beachten." },
  { group: "Rollladen", product: "Rollladen", name: "Hochschiebesicherung", asks: ["Welle", "Profil", "Elementbreite", "Motor/Gurt"], tip: "Nur passend zur Welle und zum Panzer einsetzen." },
  { group: "Rollladen", product: "Rollladen", name: "Endstab / Abschlussprofil", asks: ["Profilhöhe", "Farbe", "Breite", "Gummidichtung"], tip: "Seitliche Stopfen und Dichtung mitbestellen." },
  { group: "Führung", product: "Rollladen/Screen", name: "Führungsschiene", asks: ["Profiltyp", "Tiefe/Breite", "Farbe", "Bürste/Keder"], tip: "Schienenprofil fotografieren und Länge messen." },
  { group: "Motor", product: "Motor", name: "Taster / Wandsender", asks: ["Hersteller", "Funk/Kabel", "Kanalzahl", "Farbe"], tip: "Kompatibilität mit Motor/Empfänger prüfen." },
  { group: "Motor", product: "Sensorik", name: "Wind-/Sonnensensor", asks: ["Hersteller", "Funkprotokoll", "Versorgung", "Montageart"], tip: "Sensorposition und Windlogik dokumentieren." },
  { group: "ZIP-Screen", product: "ZIP-Screen", name: "ZIP-Keder / Tuchführung", asks: ["Hersteller", "Tuchtyp", "Schienenprofil", "Seite"], tip: "Tuch nicht mit Gewalt aus Führung ziehen." },
  { group: "Markise", product: "Markise", name: "Kurbelgetriebe / Öse", asks: ["Hersteller", "Übersetzung", "Ösenform", "Seite"], tip: "Getriebe vor Ausbau entlasten und Drehrichtung notieren." },
  { group: "Insektenschutz", product: "Insektenschutz", name: "Eckverbinder / Griff", asks: ["Profilserie", "Farbe", "Rahmentyp", "Position"], tip: "Profilquerschnitt fotografieren." },
];

export const allPartCatalog = [...partCatalog, ...extraPartCatalog];
