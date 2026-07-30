export const productTypes = [
  { id: "vorbaurollladen", name: "Vorbaurollladen", category: "Rollladen", description: "Nachrüstung oder Renovierung. Kasten und Führung sitzen außen vor dem Fenster oder in der Laibung.", steps: ["Aufmaß prüfen", "Untergrund prüfen", "Kasten/Schienen ausrichten", "bohren und befestigen", "Panzerlauf prüfen", "Motor/Bedienung einstellen", "Übergabe dokumentieren"], tools: ["Maßband", "Laser", "Bohrmaschine", "Akkuschrauber", "Steinbohrer", "Nietzange", "Einstellkabel", "Multimeter"], risks: ["Revision verbaut", "Schienen nicht parallel", "Kabelauslass falsch", "WDVS falsch befestigt"] },
  { id: "aufsatzrollladen", name: "Aufsatzrollladen", category: "Rollladen", description: "Kasten sitzt auf dem Fenster. Relevant bei Neubau oder Fenstertausch.", steps: ["Fenstermaß abstimmen", "Kasten mit Fenster verbinden", "Dichtung/Dämmung prüfen", "Führung montieren", "Funktion testen"], tools: ["Fensterbau-Werkzeug", "Montagekeile", "Laser", "Dichtband", "Akkuschrauber", "Multimeter"], risks: ["Luftdichtheit", "Revision nicht zugänglich", "Fenstermaß passt nicht"] },
  { id: "markise", name: "Gelenkarm-/Kassettenmarkise", category: "Markise", description: "Terrassen- oder Balkonschutz mit hohen Kräften auf Konsolen und Untergrund.", steps: ["Montagehöhe und Ausfall prüfen", "Untergrund bewerten", "Konsolen anzeichnen", "Befestigung setzen", "Markise einhängen", "Neigung/Endlagen einstellen", "Windhinweis erklären"], tools: ["Bohrhammer", "Laser", "Drehmomentschlüssel", "Montagelift", "Injektionszubehör", "Steckschlüssel", "Sender"], risks: ["hohe Zugkräfte", "WDVS", "falsche Konsole", "Windklasse falsch verstanden"] },
  { id: "raffstore", name: "Raffstore / Außenjalousie", category: "Außenjalousie", description: "Außenliegende Lamellenanlage für Sonnenschutz und Lichtlenkung.", steps: ["Blende/Kasten prüfen", "Führungen ausrichten", "Lamellenpaket einsetzen", "Wendung prüfen", "Windwächter testen"], tools: ["Laser", "Akkuschrauber", "Bohrmaschine", "Nietzange", "Seilschneider", "Einstellkabel"], risks: ["Lamellen verdreht", "Wendepunkt falsch", "Windgrenze unklar", "Führung locker"] },
  { id: "zipscreen", name: "ZIP-Screen", category: "Textilscreen", description: "Textiler Sonnenschutz mit seitlicher ZIP-Führung.", steps: ["Öffnung prüfen", "Kasten setzen", "Schienen parallel montieren", "Tuchlauf prüfen", "Endlagen exakt einstellen"], tools: ["Laser", "Akkuschrauber", "Bohrmaschine", "Kunststoffkeile", "Sender", "weiche Bürste"], risks: ["Schienen schief", "Tuch verkantet", "Schmutz in ZIP-Führung"] },
  { id: "insektenschutz", name: "Insektenschutz", category: "Zubehör", description: "Spannrahmen, Drehrahmen, Schiebeanlage oder Rollo gegen Insekten.", steps: ["lichte Maße prüfen", "Rahmen vorbereiten", "Bürsten einsetzen", "montieren", "Schließung/Lauf prüfen"], tools: ["Maßband", "Gehrungssäge", "Gummihammer", "Feile", "Akkuschrauber", "Cuttermesser"], risks: ["Rahmen verzogen", "Bürste zu stramm", "Griffposition nicht beachtet"] },
  { id: "rolltor", name: "Rolltor / Rollgitter", category: "Tor", description: "Abschluss für Garage, Halle oder Gewerbe mit besonderem Sicherheitsbedarf.", steps: ["Öffnung prüfen", "Führungen/Welle montieren", "Panzer einsetzen", "Sicherheitseinrichtungen prüfen", "Notbedienung erklären"], tools: ["Bohrhammer", "Laser", "Montagelift", "Steckschlüssel", "Drehmomentschlüssel", "Multimeter", "Prüfprotokoll"], risks: ["Sicherheitseinrichtung fehlt", "Notentriegelung unklar", "Endlage falsch"] },
];

export const checklistTemplates = {
  vorbaurollladen: ["Auftrag und Maße geprüft", "Kabelauslass geklärt", "Untergrund geprüft", "Schienen parallel markiert", "Kasten befestigt", "Panzerlauf getestet", "Endlagen eingestellt", "Fotos gemacht", "Kunde eingewiesen"],
  aufsatzrollladen: ["Fenstermaß abgestimmt", "Kastenverbindung geprüft", "Luftdichtheit/Dämmung geprüft", "Führungsschienen montiert", "Revision zugänglich", "Antrieb getestet", "Übergabe dokumentiert"],
  markise: ["Untergrund bewertet", "Konsolenposition geprüft", "Befestigungssystem gewählt", "Bohrlöcher gereinigt", "Drehmoment geprüft", "Neigung eingestellt", "Windhinweis erklärt", "Protokoll erstellt"],
  raffstore: ["Paketraum geprüft", "Führung montiert", "Lamellenlauf geprüft", "Wendung getestet", "Windwächter geprüft", "Kunde eingewiesen"],
  zipscreen: ["Öffnung rechtwinklig geprüft", "Schienen parallel", "Tuchlauf sauber", "Endlagen exakt", "Schienenreinigung erklärt"],
  insektenschutz: ["lichte Maße geprüft", "Rahmen rechtwinklig", "Bürsten angepasst", "Schließung/Lauf getestet", "Pflegehinweis gegeben"],
  rolltor: ["Sicherheitsabstände geprüft", "Führungen befestigt", "Panzerlauf geprüft", "Sicherheitseinrichtungen getestet", "Notbedienung erklärt", "Wartungshinweis gegeben"],
};

export const dynamicChecklistRules = [
  { when: { substrate: "WDVS" }, items: ["Dämmstärke ermittelt", "Abstandsmontagesystem gewählt", "Lastabtragung in tragenden Untergrund geprüft", "Abdichtung dokumentiert"] },
  { when: { drive: "Funkmotor" }, items: ["Senderkanal beschriftet", "Funkreichweite geprüft", "Gruppensteuerung erklärt", "Batteriehinweis gegeben"] },
  { when: { drive: "Tastermotor" }, items: ["Tasterposition geprüft", "Drehrichtung geprüft", "Anschluss dokumentiert", "Bedienung erklärt"] },
  { when: { installType: "Renovierung" }, items: ["Altanlage demontiert", "Entsorgung geklärt", "Bestandsschäden dokumentiert"] },
  { when: { windCritical: true }, items: ["Windlage bewertet", "Windklasse/Herstellerangabe geprüft", "Kundenhinweis Wind dokumentiert", "Sensorik geprüft"] },
];

export const measurementRequiredFields = {
  vorbaurollladen: ["Breite", "Höhe", "Kastenform", "Führungsschiene", "Bedienseite", "Motorseite", "Revision", "Kabelauslass", "Untergrund", "Farbe", "Fensterfoto"],
  markise: ["Breite", "Ausfall", "Montagehöhe", "Neigung", "Untergrund", "Konsolenposition", "Windlage", "Stromanschluss", "Tuchfarbe", "Montagefoto"],
  raffstore: ["Breite", "Höhe", "Paketraum", "Führung", "Lamellentyp", "Bedienung", "Windwächter", "Fassadenlage", "Foto"],
  zipscreen: ["Breite", "Höhe", "Schienenmaß", "Kastenmaß", "Tuchfarbe", "Motorseite", "Untergrund", "Rechtwinkligkeit", "Foto"],
  insektenschutz: ["lichte Breite", "lichte Höhe", "Rahmentyp", "Griffposition", "Bürstenhöhe", "Farbe", "Foto"],
  rolltor: ["lichte Breite", "lichte Höhe", "Sturzhöhe", "Seitenplatz", "Strom", "Sicherheitseinrichtung", "Notbedienung", "Foto"],
};

export const qualityRequirements = [
  { id: "checklist", label: "Produkt-Checkliste vollständig", type: "checklist" },
  { id: "photos", label: "Vorher-, Nachher- und Typenschildfoto vorhanden", type: "photos" },
  { id: "customer", label: "Kunde eingewiesen", type: "manual" },
  { id: "motor", label: "Motor/Bedienung getestet", type: "manual" },
  { id: "protocol", label: "Protokoll/Notizen ausgefüllt", type: "notes" },
  { id: "pdf", label: "PDF/Export vorbereitet", type: "manual" },
];

export const additionalProductTypes = [
  { id: "pergola", name: "Pergola-Markise", category: "Markise", description: "Geführte Sonnenschutzanlage mit Pfosten, Führung und hohem Anspruch an Ausrichtung, Wasserablauf und Windhinweise.", steps: ["Aufstellfläche und Gefälle prüfen", "Fundamente/Platten prüfen", "Führungen ausrichten", "Tuchlauf testen", "Sensorik erklären", "Wasserablauf dokumentieren"], tools: ["Laser", "Bohrhammer", "Drehmomentschlüssel", "Montagelift", "Steckschlüssel", "Einstellkabel"], risks: ["Fundament unklar", "Wasserablauf", "Windbelastung", "Schiefstand"] },
  { id: "terrassendach", name: "Terrassendach-Beschattung", category: "Sonnenschutz", description: "Innen- oder außenliegende Beschattung für Glasdächer mit besonderer Prüfung von Führung, Neigung und Stromzuführung.", steps: ["Dachmaß prüfen", "Führungssystem wählen", "Kabelweg klären", "Tuchspannung prüfen", "Endlagen einstellen"], tools: ["Laser", "Leiter/Gerüst", "Akkuschrauber", "Einstellkabel", "Schutzmatten"], risks: ["Glasbruch", "Zugang schwierig", "Hitzeentwicklung", "Kabelweg"] },
  { id: "screen_offen", name: "Offener Textilscreen", category: "Textilscreen", description: "Textiler Sonnenschutz ohne ZIP, stärker abhängig von Wind, Tuchspannung und sauberer Führung.", steps: ["Öffnung prüfen", "Kasten/Führung ausrichten", "Tuchwelle prüfen", "Endlagen einstellen", "Windhinweis erklären"], tools: ["Laser", "Akkuschrauber", "Sender", "weiche Bürste"], risks: ["Tuch flattert", "Windgrenze", "Schienen schief"] },
  { id: "garagentor_antrieb", name: "Garagentor-Antrieb", category: "Tor", description: "Nachrüstung oder Service an Torantrieben mit Fokus auf Kraftabschaltung, Notentriegelung und Sicherheitsprüfung.", steps: ["Tor mechanisch prüfen", "Laufschiene montieren", "Kraft lernen", "Sicherheitsabschaltung testen", "Notentriegelung erklären"], tools: ["Akkuschrauber", "Bohrmaschine", "Leiter", "Multimeter", "Prüfprotokoll"], risks: ["Tor schwergängig", "Kraft zu hoch", "Notentriegelung unklar"] },
];

export const allProductTypes = [...productTypes, ...additionalProductTypes];

export const productPracticeDetails = {
  vorbaurollladen: { identify: "Kastenform, Panzerprofil, Führung, Revision und Antrieb gemeinsam aufnehmen.", practiceChecks: ["Kasten und Revision zugänglich geplant", "Führungsschienen parallel und lotrecht", "Panzeraufhängung gleichmäßig", "Kabelauslass und Motorseite dokumentiert", "Endlagen und Hochschiebeschutz geprüft", "Bedienung und Pflege übergeben"] },
  aufsatzrollladen: { identify: "Fenster, Aufsatzkasten, Führung und Bauanschluss als gemeinsames System betrachten.", practiceChecks: ["Fenstermaß und Kastenmaß abgestimmt", "Kastenverbindung zum Fenster geprüft", "Revision zugänglich", "Dämmung und Anschlussfuge berücksichtigt", "Führung ohne Versatz montiert", "Antrieb und Übergabe dokumentiert"] },
  markise: { identify: "Markisentyp, Breite, Ausfall, Konsolen, Untergrund, Tuch und Antrieb vollständig erfassen.", practiceChecks: ["Konsolenplan zur Anlage vorhanden", "Tragender Untergrund an jedem Punkt geprüft", "Montagehöhe und Neigung geklärt", "Arme und Tuchlauf ohne Kollision", "Endlagen und Sensorik getestet", "Windhinweis dokumentiert"] },
  raffstore: { identify: "Lamellenform, Paket, Führung, Bänder, Motor und Windsteuerung getrennt dokumentieren.", practiceChecks: ["Paketraum und Revisionszugang geprüft", "Führung oder Spannseil korrekt ausgerichtet", "Aufzugsbänder nicht verdreht", "Lamellenwendung gleichmäßig", "Endlagen und Windwächter getestet", "Kundenbedienung erklärt"] },
  zipscreen: { identify: "Kasten, Tuch, ZIP-Keder, Einlauftrichter, Schiene und Motor bilden ein abgestimmtes System.", practiceChecks: ["Öffnung rechtwinklig aufgenommen", "Schienenabstand oben/unten verglichen", "Einlauftrichter korrekt eingesetzt", "Tuch ohne Falten und Klemmen", "Endlagen mit Laufreserve", "Reinigung und Windhinweis erklärt"] },
  insektenschutz: { identify: "Rahmentyp, Profil, Gewebe, Bürsten, Griffe und lichte Maße erfassen.", practiceChecks: ["Lichte Maße an mehreren Punkten geprüft", "Rahmen rechtwinklig und spannungsfrei", "Bürsten dichten ohne zu bremsen", "Griffe und Beschläge erreichbar", "Lauf und Schließung getestet", "Reinigungshinweis gegeben"] },
  rolltor: { identify: "Torpanzer, Führung, Welle, Antrieb, Steuerung und Sicherheitseinrichtungen gemeinsam aufnehmen.", practiceChecks: ["Öffnung und Schutzbereiche geprüft", "Führungen und Befestigung kontrolliert", "Panzerlauf ohne Kollision", "Sicherheitsleiste/Lichtschranke getestet", "Notbedienung funktionsfähig", "Prüfung und Einweisung protokolliert"] },
  pergola: { identify: "Pfosten, Führung, Tuch, Entwässerung, Fundamente und Sensorik als Gesamtsystem betrachten.", practiceChecks: ["Aufstellfläche und Fundamente geklärt", "Pfosten und Führungen ausgerichtet", "Gefälle/Entwässerung geprüft", "Tuchlauf ohne Kollision", "Sensorik und Endlagen getestet", "Wetterhinweise übergeben"] },
  terrassendach: { identify: "Dachsystem, Glasbereiche, Führung, Neigung, Kabelweg und Wartungszugang erfassen.", practiceChecks: ["Dachmaß und Einbauraum geprüft", "Glas und Oberflächen geschützt", "Führungssystem sauber ausgerichtet", "Kabelweg revisionsfähig", "Tuchspannung und Endlagen geprüft", "Wartungszugang dokumentiert"] },
  screen_offen: { identify: "Tuchwelle, offener Tuchlauf, Führung, Endstab und Windlage eindeutig aufnehmen.", practiceChecks: ["Öffnung und Befestigung geprüft", "Kasten und Führung ausgerichtet", "Tuchwicklung sauber", "Endstab läuft frei", "Endlagen eingestellt", "Windgrenzen praktisch erklärt"] },
  garagentor_antrieb: { identify: "Mechanischen Torzustand vor Antrieb, Schiene, Steuerung und Sicherheitszubehör bewerten.", practiceChecks: ["Tor von Hand leichtgängig", "Laufschiene und Mitnehmer ausgerichtet", "Endlagen/Fahrweg gelernt", "Kraftabschaltung geprüft", "Notentriegelung getestet", "Sicherheitsprüfung dokumentiert"] },
};
