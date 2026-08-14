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
  "Wetter / Bedienung": ["vorbaurollladen", "aufsatzrollladen", "markise", "raffstore", "zipscreen"],
  "Gurt / Bedienung": ["vorbaurollladen", "aufsatzrollladen"],
};

const partCategoriesByDiagnosis = {
  "motor-faehrt-nicht": ["Rohrmotor", "Bedienelement / Steuerung", "Adapter / Mitnehmer"],
  "motor-brummt": ["Rohrmotor", "Adapter / Mitnehmer", "Welle"],
  "motor-eine-richtung": ["Rohrmotor", "Bedienelement / Steuerung", "Externer Funkempfänger"],
  "funk-reagiert-nicht": ["Hand-/Wandsender", "Externer Funkempfänger", "Rohrmotor"],
  "sender-verloren": ["Hand-/Wandsender", "Externer Funkempfänger"],
  "rollladen-schief": ["Führungsschiene", "Panzer / Lamelle", "Aufhänger / Befestigungsfeder"],
  "rollladen-klemmt-unten": ["Endleiste / Abschlussprofil", "Führungsschiene", "Panzer / Lamelle"],
  "gurt-schwer": ["Gurt", "Gurtwickler", "Gurtscheibe"],
  "markise-stoppt": ["Motor", "Sensor / Steuerung", "Gelenkarm"],
  "markise-schliesst-schief": ["Gelenkarm", "Tuch", "Halter / Konsole"],
  "raffstore-wendet-falsch": ["Motor / Steuerung", "Aufzugsband", "Leiterkordel"],
  "raffstore-klappert": ["Führung / Endschiene", "Lamelle"],
  "zipscreen-klemmt": ["Tuch / ZIP-Keder", "Führungsschiene / Einlauf", "Motor"],
  "sensorik-falsch": ["Sensor / Steuerung", "Hand-/Wandsender"],
  "anlage-faehrt-selbst": ["Sensor / Steuerung", "Externer Funkempfänger", "Hand-/Wandsender"],
  "gateway-offline": ["Gateway", "Externer Funkempfänger"],
  "rolltor-reversiert": ["Steuerung / Sicherheitskomponente", "Motor / Seitenantrieb", "Profil / Führung / Welle"],
  "insektenschutz-klemmt": ["Profil / Eckverbinder", "Griff / Rolle / Führung", "Bürstendichtung"],
};

const safetyCategories = ["Motor / Elektro", "Tor / Sicherheit"];

export const diagnosisSymptomGroups = [
  { id: "movement", label: "Bewegung", items: ["fährt nicht", "fährt nur eine Richtung", "läuft schief", "stoppt früh", "reversiert", "fährt selbstständig"] },
  { id: "noise", label: "Geräusch", items: ["brummt", "klappert", "knackt", "schleift"] },
  { id: "operation", label: "Bedienung", items: ["Funk reagiert nicht", "Sender verloren", "Taster ohne Funktion", "Gateway offline"] },
  { id: "mechanics", label: "Mechanik", items: ["klemmt", "schwergängig", "verdreht", "Endleiste blockiert"] },
  { id: "weather", label: "Wetter", items: ["Frost", "Wind", "Sonne / Automatik", "Feuchtigkeit"] },
  { id: "product", label: "Produkt", items: ["Rollladen", "Markise", "Raffstore", "ZIP-Screen", "Insektenschutz", "Rolltor"] },
];

export const diagnosisSafetyLevels = Object.freeze({
  BASIC: "Kunde darf prüfen",
  PROFESSIONAL: "Nur Fachkraft prüfen",
  STOP: "Anlage nicht weiter betreiben",
});

const diagnosisProfiles = {
  "motor-faehrt-nicht": { symptoms: ["fährt nicht", "Taster ohne Funktion"], safetyLevel: diagnosisSafetyLevels.PROFESSIONAL, causes: ["Bedienung oder Funkweg", "Spannungsversorgung oder Anschluss", "mechanische Blockade", "Motor, Bremse oder Endlage"], related: ["funk-reagiert-nicht", "motor-brummt"] },
  "motor-brummt": { symptoms: ["brummt", "fährt nicht", "klemmt"], safetyLevel: diagnosisSafetyLevels.STOP, causes: ["Behang oder Führung blockiert", "Adapter, Mitnehmer oder Welle", "Motorbremse oder Motor", "Endlage ungünstig eingestellt"], related: ["motor-faehrt-nicht", "rollladen-schief"] },
  "rollladen-schief": { symptoms: ["läuft schief", "klemmt", "schleift"], causes: ["Führung verschmutzt oder nicht parallel", "Lamelle oder Endleiste beschädigt", "Aufhängung ungleich", "Welle oder Lager auffällig"], related: ["rollladen-klemmt-unten", "motor-brummt"] },
  "funk-reagiert-nicht": { symptoms: ["Funk reagiert nicht", "Taster ohne Funktion"], causes: ["Batterie, Kanal oder Sender", "Reichweite oder Funkstörung", "Zuordnung von Sender und Empfänger", "Versorgung von Empfänger oder Motor"], related: ["sender-verloren", "gateway-offline", "motor-faehrt-nicht"] },
  "markise-stoppt": { symptoms: ["stoppt früh", "Wind", "Sonne / Automatik"], causes: ["Windautomatik oder Sensorpriorität", "Hindernis oder Schwergängigkeit", "Motorschutz", "Endlage oder Tuchwicklung"], related: ["sensorik-falsch", "markise-schliesst-schief"] },
  "zipscreen-klemmt": { symptoms: ["klemmt", "läuft schief", "schleift"], safetyLevel: diagnosisSafetyLevels.STOP, causes: ["Seitenschiene verschmutzt oder nicht parallel", "ZIP-Keder oder Einlauf beschädigt", "Tuchspannung oder Endlage", "Motor oder Mitnehmer"], related: ["motor-brummt"] },
  "raffstore-wendet-falsch": { symptoms: ["fährt nur eine Richtung", "verdreht"], causes: ["Drehrichtung oder Steuerung", "Wendepunkt", "Leiterkordel oder Aufzugsband", "Lamellenpaket blockiert"], related: ["motor-eine-richtung", "raffstore-klappert"] },
  "sensorik-falsch": { symptoms: ["Wind", "Sonne / Automatik", "fährt selbstständig"], causes: ["Sensor verschmutzt oder ungünstig positioniert", "Grenzwert oder Automatikmodus", "Funkverbindung oder Versorgung", "Gruppen- oder Szenenzuordnung"], related: ["anlage-faehrt-selbst", "markise-stoppt"] },
  "rollladen-klemmt-unten": { symptoms: ["klemmt", "Endleiste blockiert", "läuft schief"], causes: ["Endleiste in Führung oder Fensterbank blockiert", "Führung verschmutzt", "Lamelle beschädigt", "Aufhängung oder Welle schief"], related: ["rollladen-schief", "frost-problem"] },
  "frost-problem": { symptoms: ["Frost", "Endleiste blockiert", "fährt nicht"], safetyLevel: diagnosisSafetyLevels.STOP, causes: ["Endleiste angefroren", "Eis in der Führung", "Hinderniserkennung ausgelöst", "Endlage unter Spannung"], related: ["rollladen-klemmt-unten"] },
  "gurt-schwer": { symptoms: ["schwergängig", "schleift", "verdreht"], causes: ["Gurt verdreht oder ausgefranst", "Gurtwickler schwergängig", "Gurtscheibe oder Lager", "Panzer läuft nicht frei"], related: ["rollladen-schief"] },
  "sender-verloren": { symptoms: ["Sender verloren", "Funk reagiert nicht"], causes: ["Sender fehlt oder ist defekt", "Batterie oder Kanal", "Systemfamilie nicht eindeutig", "Empfängerzugang erforderlich"], related: ["funk-reagiert-nicht"] },
  "markise-schliesst-schief": { symptoms: ["läuft schief", "stoppt früh"], causes: ["Gelenkarme unterschiedlich", "Tuchwicklung ungleich", "Konsole oder Neigung", "Endlage oder Kassettensitz"], related: ["markise-stoppt"] },
  "raffstore-klappert": { symptoms: ["klappert", "Wind"], causes: ["Führung oder Seil nicht passend eingestellt", "Lamellen oder Clips lose", "Abstände ungünstig", "Windgrenze überschritten"], related: ["raffstore-wendet-falsch"] },
  "rolltor-reversiert": { symptoms: ["reversiert", "stoppt früh", "fährt nicht"], safetyLevel: diagnosisSafetyLevels.STOP, causes: ["Sicherheitseinrichtung ausgelöst", "Lichtschranke verschmutzt oder verstellt", "Laufweg oder Führung blockiert", "Endlage oder Steuerung"], related: ["motor-faehrt-nicht"] },
  "insektenschutz-klemmt": { symptoms: ["klemmt", "schwergängig", "schleift"], causes: ["Rahmen verzogen oder zu stramm", "Laufprofil verschmutzt", "Bürstendichtung ungünstig", "Beschlag, Rolle oder Griff"], related: [] },
  "gateway-offline": { symptoms: ["Gateway offline", "Funk reagiert nicht"], causes: ["Gatewayversorgung", "lokales Netzwerk", "Konto- oder Gerätezuordnung", "lokaler Funkweg"], related: ["funk-reagiert-nicht", "anlage-faehrt-selbst"] },
  "motor-eine-richtung": { symptoms: ["fährt nur eine Richtung", "Taster ohne Funktion"], safetyLevel: diagnosisSafetyLevels.PROFESSIONAL, causes: ["Bedienstelle oder Kanal", "Anschluss oder Empfänger", "Endlage", "Motor oder mechanischer Laufweg"], related: ["motor-faehrt-nicht", "raffstore-wendet-falsch"] },
  "anlage-faehrt-selbst": { symptoms: ["fährt selbstständig", "Sonne / Automatik", "Wind"], causes: ["Zeitplan, Szene oder Zentralsteuerung", "Sensorpriorität", "Gruppenzuordnung", "Bedienstelle, Fremdsender oder Empfänger"], related: ["sensorik-falsch", "gateway-offline"] },
};

const electricalCategories = new Set(["Motor / Elektro", "Motor / Mechanik", "Funk / Steuerung", "Sensorik", "Smart Home", "Tor / Sicherheit"]);

function structuredSteps(tree, profile) {
  const safetyLevel = profile.safetyLevel || (safetyCategories.includes(tree.category) ? diagnosisSafetyLevels.PROFESSIONAL : diagnosisSafetyLevels.BASIC);
  const electrical = electricalCategories.has(tree.category);
  return [
    {
      id: "safety",
      stage: "Sicherheit",
      question: "Ist die Anlage gesichert und kann die Prüfung ohne weitere Gefährdung beginnen?",
      explanation: safetyLevel === diagnosisSafetyLevels.BASIC ? "Nur sichtbare, gefahrlose Basisprüfungen durchführen." : "Bewegungsbereich freihalten und die Anlage nicht weiter belasten. Elektrische Arbeiten gehören zur Elektrofachkraft.",
      answerOptions: ["Ja", "Nein", "Nicht geprüft"],
      stopOn: "Nein",
    },
    {
      id: "visible-damage",
      stage: "Sichtbare Schäden",
      question: "Sind Blockaden, lose Teile, Beschädigungen oder ungewöhnliche Spuren sichtbar?",
      explanation: `Ohne Demontage prüfen: ${(tree.firstSteps || []).slice(0, 2).join("; ")}.`,
      answerOptions: ["Ja", "Nein", "Nicht geprüft"],
      toolHint: "Taschenlampe und Fotodokumentation",
    },
    {
      id: "operation",
      stage: "Bedienung",
      question: "Tritt der Fehler bei jeder verfügbaren, sicheren Bedienmöglichkeit gleich auf?",
      explanation: "Bedienstelle, Sender oder Handbedienung nur vergleichen, wenn dies ohne Eingriff sicher möglich ist.",
      answerOptions: ["Ja", "Nein", "Nicht zutreffend", "Nicht geprüft"],
      relatedDiagnosis: profile.related?.[0] || "",
    },
    {
      id: "supply",
      stage: electrical ? "Versorgung" : "Anlage und Umfeld",
      question: electrical ? "Wurde die Spannungsversorgung fachgerecht geprüft?" : "Sind Einbausituation, Führung und Umfeld unauffällig?",
      explanation: electrical ? "Keine Messung oder Verdrahtungsarbeit durch unqualifizierte Personen. Messergebnis nur dokumentieren." : "Befestigung, Abstände und Laufweg sichtbar prüfen.",
      answerOptions: electrical ? ["Ja, durch Fachkraft", "Auffällig", "Nicht geprüft", "Nicht zutreffend"] : ["Ja", "Auffällig", "Nicht geprüft"],
      toolHint: electrical ? "Geeignetes Prüfmittel nur durch qualifizierte Person" : tree.tools?.[0],
    },
    {
      id: "control-radio",
      stage: "Steuerung / Funk",
      question: "Sind Kanal, Automatik, Sensorik und Zuordnung soweit vorhanden plausibel?",
      explanation: "Zustand und Einstellungen dokumentieren. Kein pauschaler Reset ohne passende Herstellerunterlage.",
      answerOptions: ["Ja", "Auffällig", "Nicht zutreffend", "Nicht geprüft"],
      relatedDiagnosis: tree.category.includes("Funk") ? "gateway-offline" : "funk-reagiert-nicht",
    },
    {
      id: "mechanics",
      stage: "Mechanik",
      question: "Sind Laufweg, Führung, Behang, Welle und bewegliche Teile frei und unauffällig?",
      explanation: (tree.firstSteps || []).slice(1).join("; ") || "Mechanische Freigängigkeit nur bei gesicherter Anlage beurteilen.",
      answerOptions: ["Ja", "Auffällig", "Nicht zutreffend", "Nicht geprüft"],
      relatedPart: tree.partCategories?.[0] || "",
    },
    {
      id: "specific",
      stage: "Fehlerbild eingrenzen",
      question: tree.start.q,
      explanation: "Antwort als Hinweis werten und mit den bisherigen Beobachtungen abgleichen.",
      answerOptions: ["Ja", "Nein", "Nicht geprüft"],
      yesRecommendation: tree.start.yes,
      noRecommendation: tree.start.no,
      relatedPart: tree.partCategories?.[0] || "",
    },
  ];
}

function diagnosis(tree) {
  const profile = diagnosisProfiles[tree.id] || {};
  const productIds = tree.productIds || diagnosisProductsByCategory[tree.category] || [];
  const partCategories = tree.partCategories || partCategoriesByDiagnosis[tree.id] || [];
  const safetyLevel = tree.safetyLevel || profile.safetyLevel || (safetyCategories.includes(tree.category) ? diagnosisSafetyLevels.PROFESSIONAL : diagnosisSafetyLevels.BASIC);
  const enrichedTree = { ...tree, productIds, partCategories };
  return {
    ...enrichedTree,
    productCategories: productIds,
    manufacturerIds: tree.manufacturerIds || [],
    motorCategories: tree.motorCategories || (electricalCategories.has(tree.category) ? [tree.category] : []),
    symptoms: tree.symptoms || profile.symptoms || [],
    keywords: tree.keywords || [tree.title, tree.category, ...(profile.symptoms || []), ...(tree.firstSteps || []), ...(tree.tools || [])],
    safetyLevel,
    safety: tree.safety ?? safetyLevel !== diagnosisSafetyLevels.BASIC,
    partCategories,
    requiredTools: tree.requiredTools || tree.tools || [],
    possibleCauses: tree.possibleCauses || profile.causes || [tree.start.yes, tree.start.no],
    relatedParts: tree.relatedParts || partCategories,
    relatedDiagnostics: tree.relatedDiagnostics || profile.related || [],
    learningTargets: tree.learningTargets || [tree.category],
    knowledgeTargets: tree.knowledgeTargets || ["products", ...(electricalCategories.has(tree.category) ? ["motors"] : [])],
    steps: tree.steps || structuredSteps(enrichedTree, profile),
    finishSteps: tree.finishSteps || ["Ursache oder Verdacht im Auftrag notiert", "Foto/Typenschild ergänzt", "Probefahrt oder sichere Außerbetriebnahme dokumentiert"],
  };
}

export const diagnosisTrees = [
  diagnosis({ id: "motor-faehrt-nicht", title: "Motor fährt nicht", category: "Motor / Elektro", tools: ["Geeignetes Prüfmittel", "Herstellerunterlage", "Sender", "Einstellkabel"], firstSteps: ["Anlage nicht weiter belasten", "Sichtprüfung durchführen", "Motortyp feststellen"], start: { q: "Brummt der Motor?", yes: "Mechanische Blockade, schwergängiger Behang oder Motorproblem möglich. Laufweg, Welle, Lager und Endlagen prüfen.", no: "Versorgung, Bedienstelle, Sender, Empfänger und Anschluss durch entsprechend qualifizierte Personen prüfen." } }),
  diagnosis({ id: "motor-brummt", title: "Motor brummt, bewegt aber nicht", category: "Motor / Mechanik", tools: ["Geeignetes Prüfmittel", "Schraubendreher", "Herstellerunterlage"], firstSteps: ["Sofort stoppen", "Blockade ausschließen", "Behang sicher entlasten"], start: { q: "Lässt sich die Anlage mechanisch frei bewegen?", yes: "Motor, Bremse, Adapter, Mitnehmer oder Endlage prüfen.", no: "Blockade in Führung, Behang, Endleiste, Welle oder Aufhängung suchen." } }),
  diagnosis({ id: "rollladen-schief", title: "Rollladen läuft schief", category: "Rollladen", tools: ["Laser", "Wasserwaage", "Akkuschrauber"], firstSteps: ["Lauf stoppen", "Führungen prüfen", "Panzer prüfen"], start: { q: "Sind Führungsschienen parallel und frei?", yes: "Panzer, Lamellen, Aufhängungen, Welle und Lager prüfen.", no: "Schienen reinigen, ausrichten und Abstand oben/unten vergleichen." } }),
  diagnosis({ id: "funk-reagiert-nicht", title: "Funk reagiert nicht", category: "Funk / Steuerung", tools: ["Passende Ersatzbatterie", "Handsender", "Herstellerunterlage"], firstSteps: ["Batterie prüfen", "Kanal prüfen", "Reichweite prüfen"], start: { q: "Reagiert ein anderer vorhandener Sender oder Kanal?", yes: "Problem liegt wahrscheinlich am einzelnen Sender, Kanal oder der Batterie.", no: "Versorgung des Empfängers/Motors fachgerecht prüfen und Systemfamilie sowie Zuordnung kontrollieren." } }),
  diagnosis({ id: "markise-stoppt", title: "Markise stoppt früh", category: "Markise", tools: ["Sender", "Herstellerunterlage", "Geeignetes Prüfmittel"], firstSteps: ["Hindernis prüfen", "Windautomatik prüfen", "Gelenkarme prüfen"], start: { q: "Ist Windautomatik oder ein Hindernis aktiv?", yes: "Windwächter, Hindernis, Gelenkarme und Sensorstatus prüfen.", no: "Endlagen, Motorschutz, Tuchwicklung und Schwergängigkeit prüfen." } }),
  diagnosis({ id: "zipscreen-klemmt", title: "ZIP-Screen klemmt oder läuft schief", category: "ZIP-Screen", tools: ["Laser", "Weiche Bürste", "Akkuschrauber"], firstSteps: ["Schienen reinigen", "Parallelität prüfen", "Tuchführung prüfen"], start: { q: "Sind die Seitenschienen sauber und parallel?", yes: "Tuchführung, ZIP-Keder, Endlagen und Tuchspannung prüfen.", no: "Schienen reinigen und ausrichten. Danach langsame Probefahrt." } }),
  diagnosis({ id: "raffstore-wendet-falsch", title: "Raffstore wendet falsch", category: "Raffstore", tools: ["Sender", "Herstellerunterlage", "Laser"], firstSteps: ["Drehrichtung prüfen", "Wendepunkt prüfen", "Lamellen prüfen"], start: { q: "Stimmt die Drehrichtung?", yes: "Wendepunkt, Aufzugsbänder, Lamellenpaket und Steuerung prüfen.", no: "Drehrichtung nach konkreter Herstellerunterlage korrigieren." } }),
  diagnosis({ id: "sensorik-falsch", title: "Wind-/Sonnensensor reagiert falsch", category: "Sensorik", tools: ["Sender", "Herstellerunterlage", "Sicherer Zugang"], firstSteps: ["Sensorposition prüfen", "Sensor reinigen", "Status/Grenzwerte dokumentieren"], start: { q: "Ist der Sensor richtig positioniert und sauber?", yes: "Grenzwerte, Funkverbindung, Versorgung und Automatikmodus prüfen.", no: "Sensor reinigen, ausrichten oder Montageort nach Herstellerangabe bewerten." } }),
];

export const extraDiagnosisTrees = [
  diagnosis({ id: "rollladen-klemmt-unten", title: "Rollladen klemmt unten", category: "Rollladen", tools: ["Taschenlampe", "Bürste", "Laser"], firstSteps: ["Endleiste prüfen", "Führung reinigen", "Panzer entlasten"], start: { q: "Klemmt die Endleiste in der Führung oder auf der Fensterbank?", yes: "Führung reinigen, Endleiste kontrollieren, Anschläge und untere Endlage prüfen.", no: "Panzer, Aufhängung und Welle auf Schiefstand oder beschädigte Lamellen prüfen." } }),
  diagnosis({ id: "frost-problem", title: "Rollladen bei Frost fest", category: "Wetter / Bedienung", tools: ["Sichtprüfung", "Kundenhinweis"], firstSteps: ["Nicht mit Gewalt fahren", "Eisbildung prüfen", "Endlage entlasten"], start: { q: "Ist Eis oder eine angefrorene Endleiste sichtbar?", yes: "Nicht weiter belasten. Bedienpause erklären und nach dem Abtauen prüfen.", no: "Führung, Endlage und Hinderniserkennung prüfen." } }),
  diagnosis({ id: "gurt-schwer", title: "Gurt läuft schwer", category: "Gurt / Bedienung", tools: ["Schraubendreher", "Gurtmuster", "Gurtwickler"], firstSteps: ["Gurtlauf prüfen", "Wickler sichern", "Gurtscheibe ansehen"], start: { q: "Ist der Gurt ausgefranst oder verdreht?", yes: "Gurt ersetzen sowie Wickler und Gurtscheibe prüfen.", no: "Panzerlauf, Lager, Führung und Gurtwickler prüfen." } }),
  diagnosis({ id: "sender-verloren", title: "Sender verloren oder defekt", category: "Funk / Steuerung", tools: ["Kompatibler Ersatzsender", "Herstellerunterlage", "Sicherer Zugang"], firstSteps: ["Hersteller bestimmen", "Motortyp klären", "Vorhandene Sender erfassen"], start: { q: "Gibt es noch einen funktionierenden Sender?", yes: "Weiteres Vorgehen ausschließlich nach passender Herstellerunterlage prüfen.", no: "Motor-/Empfängerzugang klären; Reset nur nach Absprache und mit eindeutig isolierter Anlage." } }),
  diagnosis({ id: "markise-schliesst-schief", title: "Markise schließt nicht sauber", category: "Markise", tools: ["Laser", "Maßband", "Herstellerunterlage"], firstSteps: ["Ausfallprofil ansehen", "Arme vergleichen", "Tuchwicklung prüfen"], start: { q: "Ist das Ausfallprofil links/rechts unterschiedlich?", yes: "Arme, Neigung, Konsolen und Tuchwicklung prüfen.", no: "Endlage, Kassettensitz und Hindernisse prüfen." } }),
  diagnosis({ id: "raffstore-klappert", title: "Raffstore klappert bei Wind", category: "Raffstore", tools: ["Schraubendreher", "Laser", "Windhinweis"], firstSteps: ["Führungen prüfen", "Abstände prüfen", "Windgrenze klären"], start: { q: "Sind Führungsschienen oder Seile fest und passend eingestellt?", yes: "Lamellen, Clips, Windgrenze und Kundenhinweis prüfen.", no: "Führung fachgerecht befestigen/einstellen und Probefahrt durchführen." } }),
  diagnosis({ id: "rolltor-reversiert", title: "Rolltor stoppt oder reversiert", category: "Tor / Sicherheit", tools: ["Geeigneter Prüfkörper", "Herstellerunterlage", "Prüfprotokoll"], firstSteps: ["Sicherheitskontakt prüfen", "Lichtschranke prüfen", "Laufweg sichern"], start: { q: "Löst eine Sicherheitseinrichtung aus?", yes: "Sicherheitskontakt, Lichtschranke, Leitung und Ausrichtung prüfen; nichts überbrücken.", no: "Endlagen, Torlauf und Steuerungsfehler fachgerecht prüfen." } }),
  diagnosis({ id: "insektenschutz-klemmt", title: "Insektenschutzrahmen klemmt", category: "Insektenschutz", tools: ["Maßband", "Gummihammer", "Feile"], firstSteps: ["Rahmenmaß prüfen", "Bürsten prüfen", "Beschläge prüfen"], start: { q: "Ist der Rahmen verzogen oder zu stramm?", yes: "Rahmen, Bürstenhöhe und Beschläge prüfen.", no: "Laufprofil reinigen sowie Griffe und Schließteile prüfen." } }),
];

export const advancedDiagnosisTrees = [
  diagnosis({ id: "gateway-offline", title: "Smart-Home Gateway offline", category: "Smart Home", tools: ["Routerstatus", "Gateway-App", "Netzteil", "Herstellerunterlage"], firstSteps: ["Lokale Bedienung testen", "Gatewaystatus dokumentieren", "Netzwerkänderung erfragen"], start: { q: "Funktioniert die Anlage noch über lokalen Taster oder Sender?", yes: "Gatewayversorgung, Netzwerk, Konto und Gerätezuordnung schrittweise prüfen.", no: "Zuerst Versorgung, Antrieb und lokalen Funkweg prüfen; Gateway nicht vorschnell zurücksetzen." } }),
  diagnosis({ id: "motor-eine-richtung", title: "Motor fährt nur in eine Richtung", category: "Motor / Elektro", tools: ["Geeignetes Prüfmittel", "Schaltbild", "Herstellerunterlage"], firstSteps: ["Mechanischen Laufweg ansehen", "Zweite Bedienstelle gegenprüfen", "Motortyp und Endlagenart feststellen"], start: { q: "Liegt der Fehler bei einer zweiten Bedienstelle genauso vor?", yes: "Endlage, Motor, Empfänger oder Anschluss fachgerecht prüfen.", no: "Einzelne Bedienstelle, Kanal, Batterie oder Schaltkontakt prüfen." } }),
  diagnosis({ id: "anlage-faehrt-selbst", title: "Anlage fährt unerwartet selbstständig", category: "Sensorik", tools: ["Sender", "Gateway-App", "Sensorstatus", "Herstellerunterlage"], firstSteps: ["Zeit und Fahrtrichtung dokumentieren", "Automatik/Szene erfragen", "Sensorstatus prüfen"], start: { q: "Ist eine Automatik, Szene oder Zentralsteuerung aktiv?", yes: "Zeitplan, Sensorpriorität und Gruppenzuordnung prüfen; nicht sofort zurücksetzen.", no: "Fremdsender, Bedienstelle, Empfänger und Versorgung fachgerecht prüfen." } }),
];

export const allDiagnosisTrees = [...diagnosisTrees, ...extraDiagnosisTrees, ...advancedDiagnosisTrees];
