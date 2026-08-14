const productIdsByCategory = {
  Rollladen: ["vorbaurollladen", "aufsatzrollladen"],
  Markise: ["markise", "pergola"],
  Raffstore: ["raffstore"],
  "ZIP-Screen": ["zipscreen", "screen_offen"],
  Insektenschutz: ["insektenschutz"],
  Rolltor: ["rolltor", "garagentor_antrieb"],
  Motor: ["vorbaurollladen", "aufsatzrollladen", "markise", "raffstore", "zipscreen", "rolltor"],
};

const slug = (value) => String(value).toLocaleLowerCase("de-DE").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function part(productCategory, partCategory, requiredData, tip, extra = {}) {
  return {
    id: `${slug(productCategory)}-${slug(partCategory)}`,
    group: productCategory,
    product: productCategory,
    productCategory,
    productIds: productIdsByCategory[productCategory] || [],
    partCategory,
    name: partCategory,
    requiredData,
    asks: requiredData,
    tip,
    diagnosisIds: [],
    searchTerms: [],
    ...extra,
  };
}

export const partCatalog = [
  part("Rollladen", "Panzer / Lamelle", ["Profilhöhe", "Deckbreite", "Material", "Farbe", "Gesamtbreite"], "Profilquerschnitt und mehrere intakte Lamellen fotografieren; nicht nur nach Farbe zuordnen.", { searchTerms: ["Rollladenprofil", "Behang"] }),
  part("Rollladen", "Endleiste / Abschlussprofil", ["Profilquerschnitt", "Breite", "Farbe", "Dichtung", "Seitliche Stopfen"], "Endleiste, Dichtung und Stopfen gemeinsam erfassen."),
  part("Rollladen", "Führungsschiene", ["Profilquerschnitt", "Tiefe/Breite", "Länge", "Farbe", "Bürste/Keder"], "Schienenprofil und Einbausituation fotografieren; links/rechts prüfen."),
  part("Rollladen", "Gurt", ["Gurtbreite", "Länge", "Farbe", "Gurtführung"], "Gurtlauf und vorhandene Gurtbreite vor Bestellung messen.", { diagnosisIds: ["gurt-schwer"] }),
  part("Rollladen", "Gurtwickler", ["Gurtbreite", "Aufputz/Einlass", "Lochabstand", "Einbaumaß", "Farbe"], "Federmechanik steht unter Spannung; Wicklertyp vollständig erfassen.", { diagnosisIds: ["gurt-schwer"] }),
  part("Rollladen", "Gurtscheibe", ["Wellentyp", "Gurtbreite", "Durchmesser", "Lagerseite"], "Passend zu Welle, Gurt und Lagerseite bestimmen.", { diagnosisIds: ["gurt-schwer"] }),
  part("Rollladen", "Lager / Walzenkapsel", ["Wellentyp", "Zapfenmaß", "Lageraufnahme", "Seite"], "Welle und Lageraufnahme gemeinsam fotografieren und messen."),
  part("Rollladen", "Welle", ["Wellentyp", "Länge", "Lager", "Motor/Gurt", "Profil"], "Welle gerade messen; Lager-, Motor- und Antriebsseite dokumentieren.", { searchTerms: ["SW40", "SW60", "Achtkantwelle"] }),
  part("Rollladen", "Aufhänger / Befestigungsfeder", ["Wellentyp", "Panzerprofil", "Elementbreite", "Sicherungsart"], "Aufhängungen gleichmäßig verteilen und Systemfreigabe prüfen."),
  part("Rollladen", "Hochschiebesicherung", ["Wellentyp", "Panzerprofil", "Elementbreite", "Motor/Gurt"], "Nur passend zu Welle, Behang und Antriebsart verwenden."),
  part("Motor", "Rohrmotor", ["Hersteller", "Typenschild", "Drehmoment", "Wellentyp", "Baulänge", "Funk/Kabel", "Endlagenart"], "Drehmoment und Kompatibilität nicht schätzen; Motortyp und Anlage fachgerecht auslegen.", { diagnosisIds: ["motor-faehrt-nicht", "motor-brummt", "motor-eine-richtung"], searchTerms: ["Funkmotor", "Tastermotor"] }),
  part("Motor", "Adapter / Mitnehmer", ["Motorhersteller", "Motorserie", "Wellentyp", "Profilmaß"], "Motor, Adapter, Mitnehmer und Welle gemeinsam dokumentieren.", { diagnosisIds: ["motor-brummt"] }),
  part("Motor", "Hand-/Wandsender", ["Hersteller", "Funkfamilie", "Kanalzahl", "Tastenbelegung", "Farbe"], "Kompatibilität nur über konkrete Funkfamilie und Herstellerunterlage prüfen.", { diagnosisIds: ["funk-reagiert-nicht", "sender-verloren"] }),
  part("Motor", "Externer Funkempfänger", ["Hersteller", "Funkfamilie", "Versorgung", "Motorart", "Schaltart"], "Versorgung und Schaltart fachgerecht prüfen; Antennenlage dokumentieren.", { diagnosisIds: ["funk-reagiert-nicht", "motor-eine-richtung"] }),
  part("Markise", "Gelenkarm", ["Hersteller", "Modell/Serie", "Ausfall", "Seite", "Armtyp", "Farbe"], "Gelenkarme stehen unter Federspannung und dürfen nur gesichert bearbeitet werden.", { diagnosisIds: ["markise-schliesst-schief"] }),
  part("Markise", "Tuch", ["Hersteller/Modell", "Breite", "Ausfall", "Tuchnummer", "Volant", "Wickelrichtung"], "Tuchdaten, Saum, Volant und Wickelrichtung vollständig erfassen."),
  part("Markise", "Tuchwelle", ["Hersteller/Serie", "Profil", "Länge", "Motor-/Lagerseite"], "Wellenprofil, Lagerung und Motoraufnahme gemeinsam aufnehmen."),
  part("Markise", "Motor", ["Hersteller", "Typenschild", "Drehmoment", "Welle", "Funk/Kabel", "Endlagenart"], "Markisentyp und Arm-/Tuchlauf vor Motorwahl prüfen.", { diagnosisIds: ["markise-stoppt", "motor-faehrt-nicht"] }),
  part("Markise", "Getriebe / Kurbel / Öse", ["Hersteller", "Modell", "Übersetzung", "Ösenform", "Seite"], "Getriebe vor Ausbau entlasten und Drehrichtung dokumentieren."),
  part("Markise", "Halter / Konsole", ["Hersteller/Modell", "Konsolentyp", "Lochbild", "Untergrund", "Farbe"], "Tragende Befestigung nur nach Konsolenplan, Last und Untergrund auswählen."),
  part("Markise", "Sensor / Steuerung", ["Hersteller", "Funkfamilie", "Versorgung", "Sensorart", "Montageart"], "Sensorposition und Vorranglogik dokumentieren; Grenzwerte nicht erfinden.", { diagnosisIds: ["sensorik-falsch", "anlage-faehrt-selbst"] }),
  part("Raffstore", "Lamelle", ["Hersteller/Serie", "Lamellenform", "Breite", "Länge", "Farbe"], "Lamellenform, Stanzung und intakte Vergleichslamelle fotografieren."),
  part("Raffstore", "Leiterkordel", ["Hersteller/Serie", "Lamellentyp", "Teilung", "Länge"], "Kordelgeometrie und Lamellenteilung dokumentieren; nicht allein nach Farbe wählen."),
  part("Raffstore", "Aufzugsband", ["Hersteller/Serie", "Breite", "Länge", "Lamellentyp"], "Bandführung und Wickelrichtung vor Ausbau markieren.", { diagnosisIds: ["raffstore-wendet-falsch"] }),
  part("Raffstore", "Führung / Endschiene", ["Hersteller/Serie", "Führungsart", "Profilquerschnitt", "Länge", "Farbe"], "Schienen-/Seilführung, Halter und Endschiene gemeinsam erfassen."),
  part("Raffstore", "Motor / Steuerung", ["Hersteller", "Typenschild", "Kupplung", "Steuerungsart", "Wendefunktion"], "Motor und mechanische Wendefunktion getrennt prüfen.", { diagnosisIds: ["raffstore-wendet-falsch", "motor-faehrt-nicht"] }),
  part("ZIP-Screen", "Tuch / ZIP-Keder", ["Hersteller/Serie", "Breite/Höhe", "Tuchtyp", "Kederprofil", "Seite"], "Tuch nicht mit Gewalt aus der Führung ziehen; Keder und Einlauf fotografieren.", { diagnosisIds: ["zipscreen-klemmt"] }),
  part("ZIP-Screen", "Führungsschiene / Einlauf", ["Hersteller/Serie", "Profilquerschnitt", "Länge", "Farbe", "Seite"], "Schiene, Einlauftrichter und Anschluss an Kassette dokumentieren.", { diagnosisIds: ["zipscreen-klemmt"] }),
  part("ZIP-Screen", "Kassette / Endleiste", ["Hersteller/Serie", "Profilquerschnitt", "Breite", "Farbe", "Revision"], "Profil und Revisionsart aufnehmen; Systemteile serienabhängig prüfen."),
  part("ZIP-Screen", "Motor", ["Hersteller", "Typenschild", "Welle", "Motorseite", "Funk/Kabel"], "Vor Motorbewertung Schienenparallelität und Tuchlauf prüfen.", { diagnosisIds: ["zipscreen-klemmt", "motor-brummt"] }),
  part("Insektenschutz", "Gewebe", ["Gewebeart", "Breite/Höhe", "Farbe", "Befestigungsart"], "Gewebeart und Befestigung im Profil bestimmen."),
  part("Insektenschutz", "Profil / Eckverbinder", ["Profilquerschnitt", "System/Serie", "Farbe", "Rahmentyp"], "Profilquerschnitt und Eckverbindung fotografieren.", { diagnosisIds: ["insektenschutz-klemmt"] }),
  part("Insektenschutz", "Bürstendichtung", ["Nutmaß", "Bürstenhöhe", "Farbe", "Länge"], "Bürste soll dichten, ohne den Lauf unnötig zu bremsen."),
  part("Insektenschutz", "Griff / Rolle / Führung", ["System/Serie", "Bauteilfoto", "Maße", "Position", "Farbe"], "Einbausituation und Gegenstück mit erfassen.", { diagnosisIds: ["insektenschutz-klemmt"] }),
  part("Rolltor", "Profil / Führung / Welle", ["Hersteller/Serie", "Profilquerschnitt", "Abmessungen", "Seite", "Oberfläche"], "Schwere Bauteile sichern; Torpanzer, Führung und Welle als System aufnehmen."),
  part("Rolltor", "Motor / Seitenantrieb", ["Hersteller", "Typenschild", "Antriebsart", "Welle/Kupplung", "Notbedienung"], "Antriebsauslegung und Notbedienung nur nach konkreter Toranlage prüfen.", { diagnosisIds: ["motor-faehrt-nicht", "rolltor-reversiert"] }),
  part("Rolltor", "Steuerung / Sicherheitskomponente", ["Hersteller", "Steuerungstyp", "Fehleranzeige", "Sicherheitskomponente", "Anschlussart"], "Sicherheitskreise niemals überbrücken; Zustand und Fehleranzeige unverändert dokumentieren.", { diagnosisIds: ["rolltor-reversiert"], searchTerms: ["Sicherheitskontakt", "Lichtschranke", "Schließkantensicherung"] }),
];

export const extraPartCatalog = [];
export const allPartCatalog = partCatalog;
export const partProductCategories = ["Alle", ...new Set(allPartCatalog.map((item) => item.productCategory))];
export const partCategories = ["Alle", ...new Set(allPartCatalog.map((item) => item.partCategory))];

export const partPhotoRequirementsByProduct = {
  Rollladen: ["Gesamtansicht", "Typenschild", "Bauteil", "Schaden", "Maß", "Profilquerschnitt", "Motor", "Führung"],
  Markise: ["Gesamtansicht", "Typenschild", "Bauteil", "Schaden", "Maß", "Motor"],
  Raffstore: ["Gesamtansicht", "Typenschild", "Bauteil", "Schaden", "Maß", "Motor", "Führung"],
  "ZIP-Screen": ["Gesamtansicht", "Typenschild", "Bauteil", "Schaden", "Maß", "Profilquerschnitt", "Motor", "Führung"],
  Insektenschutz: ["Gesamtansicht", "Bauteil", "Schaden", "Maß", "Profilquerschnitt", "Führung"],
  Rolltor: ["Gesamtansicht", "Typenschild", "Bauteil", "Schaden", "Maß", "Profilquerschnitt", "Motor", "Führung"],
};

export const allPartPhotoRequirements = ["Gesamtansicht", "Typenschild", "Bauteil", "Schaden", "Maß", "Profilquerschnitt", "Motor", "Führung"];

export function getPartPhotoRequirements(product = "") {
  return partPhotoRequirementsByProduct[product] || allPartPhotoRequirements;
}

export function getMissingPartDetails(candidate, values = {}) {
  const source = [values.manufacturer, values.serial, values.type, values.dimensions, values.color, values.profile, values.shaft, values.guide, values.motor, values.control, values.side, values.nameplate, values.shaftProfileGuide, values.motorControl].filter(Boolean).join(" ").toLocaleLowerCase("de-DE");
  return (candidate.requiredData || []).filter((requirement) => {
    const words = requirement.toLocaleLowerCase("de-DE").split(/[\s/()-]+/).filter((word) => word.length > 3);
    return !words.some((word) => source.includes(word));
  });
}

export function searchPartCandidates({ query = "", productCategory = "Alle", partCategory = "Alle", manufacturer = "", orderProductId = "" } = {}) {
  const terms = `${query} ${manufacturer}`.trim().toLocaleLowerCase("de-DE").split(/\s+/).filter(Boolean);
  return allPartCatalog
    .filter((candidate) => productCategory === "Alle" || candidate.productCategory === productCategory)
    .filter((candidate) => partCategory === "Alle" || candidate.partCategory === partCategory)
    .map((candidate) => {
      const haystack = [candidate.name, candidate.group, candidate.productCategory, candidate.partCategory, ...(candidate.requiredData || []), ...(candidate.searchTerms || []), ...(candidate.diagnosisIds || [])].join(" ").toLocaleLowerCase("de-DE");
      const textScore = terms.reduce((score, term) => score + (haystack.includes(term) ? 2 : 0), 0);
      const orderScore = orderProductId && candidate.productIds.includes(orderProductId) ? 3 : 0;
      return { ...candidate, relevance: textScore + orderScore };
    })
    .filter((candidate) => !terms.length || candidate.relevance > 0)
    .sort((left, right) => right.relevance - left.relevance || left.name.localeCompare(right.name, "de"));
}
