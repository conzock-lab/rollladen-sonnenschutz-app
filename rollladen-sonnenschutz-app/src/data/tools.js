const allProducts = ["vorbaurollladen", "aufsatzrollladen", "markise", "raffstore", "zipscreen", "insektenschutz", "rolltor"];

export const toolKits = [
  {
    id: "messen",
    group: "Messen & Anzeichnen",
    purpose: "Maße, Achsen, Konsolen und Führungslinien vor dem ersten Bohrloch absichern.",
    productIds: allProducts,
    items: ["Maßband und Gliedermaßstab", "Laser-Entfernungsmesser", "Kreuzlinienlaser", "Wasserwaage", "Winkel und Schieblehre", "Bleistift/Marker plus Schablone"],
  },
  {
    id: "bohren",
    group: "Bohren & Bohrlochreinigung",
    purpose: "Bohrverfahren und Reinigung immer auf Untergrund und Befestigungssystem abstimmen.",
    productIds: allProducts,
    items: ["Bohrmaschine und Bohrhammer", "Beton-, Stein-, Holz- und Metallbohrer", "Tiefenanschlag", "Leitungssucher", "Bohrlochbürste", "Ausbläser oder geeigneter Sauger"],
  },
  {
    id: "befestigung",
    group: "Befestigungsmaterial",
    purpose: "Nur das zum tragenden Untergrund, zur Last und zur Herstellerfreigabe passende System verladen.",
    productIds: allProducts,
    items: ["Freigegebene Schrauben/Anker", "Passende Dübel oder Siebhülsen", "Injektionsmörtel mit Zubehör", "Distanz- oder Abstandsmontage", "Unterlegscheiben und Sicherung", "Dichtmaterial für Durchdringungen"],
  },
  {
    id: "wdvs-lochstein",
    group: "WDVS & Lochstein",
    purpose: "Abstand, Lastweg, Hohlkammer und Abdichtung vor Ort kontrollieren.",
    productIds: ["markise", "vorbaurollladen", "raffstore", "zipscreen"],
    substrates: ["WDVS", "Lochstein", "Klinker / Verblendmauerwerk", "Altbau Mischmauerwerk"],
    items: ["Lange passende Bohrer", "Abstandsmontagesystem", "Siebhülsen", "Injektionspistole und Ersatzdüse", "Bohrlochreinigung", "Abdicht- und Thermotrennelemente"],
  },
  {
    id: "montage",
    group: "Montage & Ausrichten",
    purpose: "Bauteile kontrolliert halten, ausrichten und ohne Beschädigung montieren.",
    productIds: allProducts,
    items: ["Akkuschrauber und Bit-Satz", "Steck- und Inbusschlüssel", "Drehmomentschlüssel", "Montagekissen und Kunststoffkeile", "Gummihammer", "Montagelift oder geeignete Hebehilfe"],
  },
  {
    id: "zuschnitt",
    group: "Zuschnitt & Nacharbeit",
    purpose: "Profile sauber, rechtwinklig und gratfrei bearbeiten; Späne von Tuch und Oberfläche fernhalten.",
    productIds: ["vorbaurollladen", "raffstore", "zipscreen", "insektenschutz", "rolltor"],
    items: ["Metall- oder Gehrungssäge", "Blechschere", "Feile und Entgrater", "Nietzange", "Cuttermesser", "Schutzunterlage und Spänefang"],
  },
  {
    id: "motor",
    group: "Motor & Steuerung",
    purpose: "Motortyp identifizieren, sicher prüfen und Einstellungen nachvollziehbar dokumentieren.",
    productIds: ["vorbaurollladen", "aufsatzrollladen", "markise", "raffstore", "zipscreen", "rolltor"],
    drives: ["Funkmotor", "Tastermotor", "Rohrmotor"],
    items: ["Zweipoliger Spannungsprüfer", "Multimeter", "Passendes Einstell-/Prüfkabel", "Herstelleranleitung", "Handsender und Ersatzbatterie", "Beschriftungs- und Dokumentationsmaterial"],
    safety: true,
  },
  {
    id: "funk-smart-home",
    group: "Funk, Sensorik & Smart Home",
    purpose: "Kanal, Funkfamilie, Sensorposition und Kundenzugriff strukturiert in Betrieb nehmen.",
    productIds: ["vorbaurollladen", "markise", "raffstore", "zipscreen", "rolltor"],
    drives: ["Funkmotor", "Smart Home", "Sensorik"],
    items: ["Kompatibler Hand-/Wandsender", "Ersatzbatterien", "Gateway mit Netzteil", "Kundengerät nur mit Zustimmung", "Netzwerkdaten durch Kunden", "Etiketten für Kanäle und Geräte"],
  },
  {
    id: "wartung",
    group: "Service & Wartung",
    purpose: "Reinigen, prüfen und dokumentieren, ohne ungeeignete Schmier- oder Reinigungsmittel einzusetzen.",
    productIds: allProducts,
    items: ["Weiche Bürste und Kleinbesen", "Mikrofasertücher", "Milder produkttauglicher Reiniger", "Ersatzbürsten und Kleinmaterial", "Typenschild-/Fotoliste", "Wartungs- und Mängelprotokoll"],
  },
  {
    id: "sicherheit",
    group: "Sicherheit & Baustelle",
    purpose: "Arbeitsplatz, Zugang, Absturz- und Gefahrenbereich vor Beginn absichern.",
    productIds: allProducts,
    items: ["PSA, Handschuhe und Schutzbrille", "Gehör- und Atemschutz nach Arbeit", "Geeignete Leiter oder Gerüst", "Absperrmaterial", "Erste-Hilfe-Set", "Sichere Transport- und Hebehilfe"],
    safety: true,
  },
  {
    id: "uebergabe",
    group: "Dokumentation & Übergabe",
    purpose: "Auftrag so abschließen, dass Bedienung, Einstellungen und offene Punkte später nachvollziehbar sind.",
    productIds: allProducts,
    items: ["Vorher- und Nachher-Fotos", "Typenschildfoto", "Befestigungs-/Untergrundfoto", "Bedienungs- und Pflegehinweis", "Sender-/Kanalbeschriftung", "Unterschrift oder digitale Übergabe"],
  },
];

export const extraToolKits = [];
export const allToolKits = toolKits;
