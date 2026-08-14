const productLabels = {
  vorbaurollladen: "Vorbaurollladen",
  aufsatzrollladen: "Aufsatzrollladen",
  markise: "Markise",
  raffstore: "Raffstore",
  zipscreen: "ZIP-Screen",
  insektenschutz: "Insektenschutz",
  rolltor: "Rolltor",
  garagentor_antrieb: "Torantrieb",
  pergola: "Pergola-Markise",
};

const productPartGroups = {
  vorbaurollladen: ["Panzer/Profile", "Führung", "Welle", "Motor/Bedienung"],
  aufsatzrollladen: ["Kasten", "Panzer/Profile", "Führung", "Motor/Bedienung"],
  markise: ["Tuch", "Gelenkarm", "Halter", "Motor/Steuerung"],
  raffstore: ["Lamellen", "Bänder/Kordeln", "Führung", "Motor/Steuerung"],
  zipscreen: ["Tuch/ZIP-Keder", "Führung", "Kassette", "Motor/Steuerung"],
  insektenschutz: ["Gewebe", "Profile", "Bürsten", "Beschläge"],
  rolltor: ["Profile", "Führung", "Antrieb", "Steuerung/Sicherheit"],
  garagentor_antrieb: ["Antrieb", "Steuerung", "Sicherheitseinrichtungen"],
  pergola: ["Tuch", "Führung", "Antrieb", "Sensorik"],
};

const slug = (value) => String(value).toLocaleLowerCase("de-DE").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function defineManufacturer(entry) {
  const typicalProducts = entry.productIds.map((id) => productLabels[id] || id);
  const partCategories = [...new Set(entry.productIds.flatMap((id) => productPartGroups[id] || []))];
  return {
    id: entry.id || slug(entry.name),
    categories: entry.categories || [],
    typicalProducts,
    motors: entry.motors || ["Antrieb modell- und produktabhängig bestimmen"],
    controls: entry.controls || ["Bedienelemente und Steuerung anhand Typenschild/Systemfamilie prüfen"],
    protocols: entry.protocols || ["modellabhängig"],
    sensors: entry.sensors || ["Sensorik nur nach konkreter Systemfamilie zuordnen"],
    smartHome: entry.smartHome || ["Gateway-/App-Kompatibilität in Herstellerunterlagen prüfen"],
    partCategories: entry.partCategories || partCategories,
    diagnosisIds: entry.diagnosisIds || [],
    documentHint: "Herstellerunterlagen, Typenschild und konkrete Serie prüfen. Dokumentenlink kann später ergänzt werden.",
    ...entry,
  };
}

export const manufacturerCaptureSteps = [
  "Produkt identifiziert",
  "Hersteller und Serie soweit erkennbar erfasst",
  "Typenschild dokumentiert",
  "Motor, Sender und Steuerung getrennt notiert",
  "Passende Herstellerunterlage geprüft",
];

const manufacturerEntries = [
  { name: "Somfy", categories: ["Motoren", "Steuerungen", "Funk", "Smart Home"], productIds: ["vorbaurollladen", "markise", "raffstore", "zipscreen"], protocols: ["RTS", "io-homecontrol", "modellabhängig"], motors: ["Rohr-, Funk- und Solarantriebe modellabhängig"], controls: ["Hand-/Wandsender, Empfänger und Gruppensteuerungen modellabhängig"], sensors: ["Wind-/Sonnensensorik modellabhängig"], smartHome: ["Gateway und App-Zuordnung systemabhängig"], topics: ["Motor und Empfänger unterscheiden", "Senderkanal sichern", "Endlagenart bestimmen", "Gateway-/Sensorzuordnung prüfen"], diagnosisIds: ["motor-faehrt-nicht", "funk-reagiert-nicht", "sensorik-falsch", "gateway-offline"], note: "Tastfolgen und Resetwege unterscheiden sich nach Motor- und Empfängerserie. Vor Programmierung Typenschild und Anleitung abgleichen." },
  { name: "Becker", categories: ["Motoren", "Steuerungen", "Funk"], productIds: ["vorbaurollladen", "markise", "raffstore", "zipscreen"], protocols: ["Centronic", "B-Tronic", "modellabhängig"], topics: ["Motortyp bestimmen", "Funkfamilie prüfen", "Endlagenart erfassen", "Schutzfunktionen nach Anleitung testen"], diagnosisIds: ["motor-faehrt-nicht", "funk-reagiert-nicht", "motor-eine-richtung"], note: "Motorserie, Sender und Anwendungsfall eindeutig aufnehmen; keine Lernfolge aus einem anderen Motortyp übernehmen." },
  { name: "SELVE", categories: ["Motoren", "Steuerungen", "Funk"], productIds: ["vorbaurollladen", "markise", "raffstore", "zipscreen"], protocols: ["commeo", "iveo", "modellabhängig"], topics: ["Motor und Funkfamilie erfassen", "Einzelanlage vor Gruppenanlage prüfen", "Gruppenstruktur dokumentieren", "Sensorik zuordnen"], diagnosisIds: ["motor-faehrt-nicht", "funk-reagiert-nicht", "anlage-faehrt-selbst"], note: "Bei Mehrfachanlagen Zielmotor isolieren und vorhandene Gruppen vor Änderungen festhalten." },
  { name: "elero", categories: ["Motoren", "Steuerungen", "Funk"], productIds: ["vorbaurollladen", "markise", "raffstore", "zipscreen"], protocols: ["ProLine", "Combio", "modellabhängig"], topics: ["Antrieb und Empfänger trennen", "Drehrichtung prüfen", "Endlagenweg bestimmen", "Sender-/Sensorzuordnung sichern"], diagnosisIds: ["motor-faehrt-nicht", "funk-reagiert-nicht", "motor-eine-richtung"], note: "Systemfamilie und Empfängertyp vor dem Einlernen bestimmen; anschließend mehrere vollständige Probefahrten durchführen." },
  { name: "Cherubini", categories: ["Motoren", "Steuerungen", "Funk"], productIds: ["vorbaurollladen", "markise", "zipscreen"], protocols: ["Funk/Kabel modellabhängig"], topics: ["Motorserie bestimmen", "Senderkompatibilität prüfen", "Endlagenart klären", "Bestehende Zuordnung vor Reset dokumentieren"], diagnosisIds: ["motor-faehrt-nicht", "funk-reagiert-nicht"], note: "Produkt- und Motorserie sauber erfassen; Programmierabläufe nicht zwischen Baureihen übertragen." },
  { name: "Geiger", categories: ["Motoren", "Steuerungen", "Funk"], productIds: ["vorbaurollladen", "markise", "raffstore", "zipscreen"], protocols: ["AIR", "Kabel/Funk modellabhängig"], topics: ["Rohrmotor identifizieren", "Anwendungsprodukt erfassen", "Einlernart prüfen", "Adapter und Mitnehmer dokumentieren"], diagnosisIds: ["motor-faehrt-nicht", "motor-brummt", "funk-reagiert-nicht"], note: "Typenschild, Welle und Mitnehmer gemeinsam dokumentieren. Einstellungen nur nach Unterlage der konkreten Serie." },
  { name: "Simu", categories: ["Motoren", "Steuerungen", "Funk"], productIds: ["vorbaurollladen", "markise", "zipscreen", "rolltor"], protocols: ["Kabel/Funk modellabhängig"], topics: ["Motortyp und Anwendung bestimmen", "Bedienung und Empfänger erfassen", "Endlagenart prüfen", "Welle und Adapter dokumentieren"], diagnosisIds: ["motor-faehrt-nicht", "funk-reagiert-nicht", "motor-eine-richtung"], note: "Konkrete Motorserie und Anwendung über Typenschild bestimmen; Programmierung ausschließlich nach passender Herstellerunterlage." },
  { name: "WAREMA", categories: ["Sonnenschutzsysteme", "Steuerungen", "Sensorik"], productIds: ["markise", "raffstore", "zipscreen"], protocols: ["WMS", "EWFS", "Systemsteuerung"], topics: ["Produktserie erfassen", "Steuerungsfamilie prüfen", "Wind-/Sonnensensor zuordnen", "Fassadenlage dokumentieren"], diagnosisIds: ["raffstore-wendet-falsch", "sensorik-falsch", "anlage-faehrt-selbst"], note: "Bei Raffstore und Sensorik Systemfamilie, Führung und Windkonzept gemeinsam aufnehmen." },
  { name: "ROMA", categories: ["Rollladen", "Raffstore", "ZIP-Screen"], productIds: ["vorbaurollladen", "aufsatzrollladen", "raffstore", "zipscreen"], protocols: ["Antriebssystem modellabhängig"], topics: ["Kasten- und Profilserie erfassen", "Führungsschiene fotografieren", "Revisionsart prüfen", "Antrieb separat bestimmen"], diagnosisIds: ["rollladen-schief", "zipscreen-klemmt", "raffstore-wendet-falsch"], note: "Bestellmaße, Kastenform, Profil und Führung nicht allein aus dem Produktnamen ableiten." },
  { name: "Alulux", categories: ["Rollladen", "Rolltor"], productIds: ["vorbaurollladen", "aufsatzrollladen", "rolltor"], protocols: ["Antriebssystem modellabhängig"], topics: ["Profil und Kasten aufnehmen", "Führung und Endstab erfassen", "Antrieb bestimmen", "Tor- und Sonnenschutzserie trennen"], diagnosisIds: ["rollladen-schief", "rolltor-reversiert"], note: "Profilquerschnitt, Kasten und Führung fotografieren; Bauteile können serienabhängig abweichen." },
  { name: "heroal", categories: ["Profilsysteme", "Rollladen", "Raffstore", "ZIP-Screen"], productIds: ["vorbaurollladen", "raffstore", "zipscreen"], protocols: ["Systemabhängig"], topics: ["Fassadensystem bestimmen", "Profilserie aufnehmen", "Revision und Führung prüfen", "Antrieb separat dokumentieren"], diagnosisIds: ["rollladen-schief", "zipscreen-klemmt"], note: "Systemprofile und Anschlussdetails mit Fotos und Maßen erfassen; Herstellerunterlage des konkreten Systems nutzen." },
  { name: "Schüco", categories: ["Profilsysteme", "Sonnenschutzsysteme"], productIds: ["vorbaurollladen", "raffstore", "zipscreen"], protocols: ["Systemabhängig"], topics: ["System- und Profilserie erfassen", "Einbausituation dokumentieren", "Führung und Revision prüfen", "Antrieb separat bestimmen"], note: "Keine Kompatibilität aus dem Markennamen ableiten. Systembezeichnung, Profilquerschnitt und Unterlagen des konkreten Elements prüfen." },
  { name: "Reflexa", categories: ["Markise", "Raffstore", "ZIP-Screen", "Insektenschutz"], productIds: ["markise", "raffstore", "zipscreen", "insektenschutz"], protocols: ["Antriebssystem modellabhängig"], topics: ["Produkttyp und Sonderform erfassen", "Führung und Maße dokumentieren", "Antrieb/Sender bestimmen", "Tuch- oder Lamellendaten aufnehmen"], diagnosisIds: ["markise-schliesst-schief", "raffstore-wendet-falsch", "zipscreen-klemmt"], note: "Sonderanlagen benötigen genaue Gesamt- und Detailfotos; Bauteile nicht nur optisch zuordnen." },
  { name: "weinor", categories: ["Markise", "Pergola", "Steuerungen"], productIds: ["markise", "pergola"], protocols: ["BiConnect", "Antriebssystem modellabhängig"], topics: ["Markisenserie erfassen", "Tuch und Gestell dokumentieren", "Zusatzfunktionen getrennt prüfen", "Sender- und Sensorfamilie bestimmen"], diagnosisIds: ["markise-stoppt", "markise-schliesst-schief", "sensorik-falsch"], note: "Zusatzfunktionen wie Licht oder Heizung getrennt aufnehmen und nur nach passender Systemunterlage prüfen." },
  { name: "markilux", categories: ["Markise", "Pergola"], productIds: ["markise", "pergola"], protocols: ["Funk/Kabel ausstattungsabhängig"], topics: ["Modell und Ausfall erfassen", "Tuchnummer dokumentieren", "Antrieb und Sensorik bestimmen", "Arm- und Kassettendetails fotografieren"], diagnosisIds: ["markise-stoppt", "markise-schliesst-schief"], note: "Modell, Tuch, Gestellfarbe und Ausstattung vollständig erfassen; Steuerung kann je Ausstattung variieren." },
  { name: "Lewens", categories: ["Markise", "Pergola"], productIds: ["markise", "pergola"], protocols: ["Ausstattungsabhängig"], topics: ["Modell und Abmessungen erfassen", "Tuch und Gestell dokumentieren", "Antrieb bestimmen", "Arm-/Führungsteile fotografieren"], note: "Konkrete Baureihe und Ausstattung anhand Unterlagen oder Typkennzeichnung bestimmen; Bauteile nicht allein optisch bestellen." },
  { name: "Klaiber", categories: ["Markise", "Pergola"], productIds: ["markise", "pergola"], protocols: ["Ausstattungsabhängig"], topics: ["Anlagentyp erfassen", "Maße und Tuchdaten dokumentieren", "Antrieb/Sensorik bestimmen", "Befestigungs- und Führungsteile fotografieren"], note: "Herstellerunterlagen der konkreten Anlage prüfen; bei tragenden oder federgespannten Bauteilen sichere Arbeitsweise beachten." },
  { name: "Hella", categories: ["Rollladen", "Raffstore", "ZIP-Screen", "Markise"], productIds: ["vorbaurollladen", "raffstore", "zipscreen", "markise"], protocols: ["Systemabhängig"], topics: ["Produktserie erfassen", "Führung und Behang dokumentieren", "Antrieb/Steuerung bestimmen", "Sensorik und Windkonzept prüfen"], diagnosisIds: ["raffstore-wendet-falsch", "zipscreen-klemmt", "sensorik-falsch"], note: "Produktserie, Behang, Führung und Steuerung als Gesamtsystem aufnehmen. Einstellwerte nur aus der konkreten Herstellerunterlage übernehmen." },
  { name: "GfA Elektromaten", categories: ["Torantriebe", "Torsteuerungen", "Sicherheit"], productIds: ["rolltor", "garagentor_antrieb"], protocols: ["Torsteuerung modellabhängig"], topics: ["Antrieb und Steuerung erfassen", "Sicherheitsleiste zuordnen", "Lichtschranke dokumentieren", "Fehleranzeige unverändert festhalten"], diagnosisIds: ["rolltor-reversiert", "motor-faehrt-nicht"], note: "Bei Toren Sicherheitskreise nicht überbrücken. Elektrofachkraft, Herstellerangaben und geltende Prüfvorgaben beachten." },
  { name: "Hörmann", categories: ["Tore", "Torantriebe", "Funk"], productIds: ["rolltor", "garagentor_antrieb"], protocols: ["Tor- und Funkfamilie modellabhängig"], topics: ["Tortyp bestimmen", "Antrieb und Steuerung erfassen", "Senderfamilie prüfen", "Sicherheits- und Notbedienung dokumentieren"], diagnosisIds: ["rolltor-reversiert", "funk-reagiert-nicht"], note: "Tortyp, Antrieb und Funkfamilie gemeinsam erfassen; Sicherheitsprüfung nach konkreter Anlage durchführen." },
  { name: "Neher", categories: ["Insektenschutz", "Profilsysteme"], productIds: ["insektenschutz"], protocols: ["Profilsystem modellabhängig"], topics: ["Rahmen- und Profilserie erfassen", "Gewebe und Bürste bestimmen", "Beschläge fotografieren", "lichte Maße dokumentieren"], diagnosisIds: ["insektenschutz-klemmt"], note: "Profilquerschnitt, Eckverbinder, Bürstenhöhe und Einbausituation für Ersatzteile vollständig aufnehmen." },
];

export const manufacturers = manufacturerEntries.map(defineManufacturer);
export const extraManufacturers = [];
export const allManufacturers = manufacturers;
export const manufacturerCategories = ["Alle", ...new Set(allManufacturers.flatMap((manufacturer) => manufacturer.categories))];

export function findManufacturer(value = "") {
  const normalized = String(value).trim().toLocaleLowerCase("de-DE");
  return allManufacturers.find((manufacturer) => manufacturer.id === normalized || manufacturer.name.toLocaleLowerCase("de-DE") === normalized) || null;
}
