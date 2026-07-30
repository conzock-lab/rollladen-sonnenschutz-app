export const PART_REQUEST_STATUSES = ["offen", "angefragt", "bestellt", "geliefert", "erledigt"];

export const PART_PHOTO_REQUIREMENTS = [
  "Typenschildfoto",
  "Gesamtansicht",
  "Detailfoto",
  "Maßfoto",
  "Schadenfoto",
];

export const PART_PRODUCT_OPTIONS = [
  "Rollladen",
  "Markise",
  "Raffstore",
  "ZIP-Screen",
  "Insektenschutz",
  "Rolltor",
  "Rohrmotor",
  "Motor",
  "Rollladen/Screen",
  "Funk/Steuerung",
  "Sensorik",
  "Sensorik/Smart Home",
];

export function createEmptyPartRequest(order = null) {
  return {
    id: "",
    draftKey: `PART-DRAFT-${Date.now()}`,
    orderId: order?.id || "",
    customer: order?.customer || "",
    product: "Rollladen",
    manufacturer: "",
    part: "",
    year: "",
    serial: "",
    nameplate: "",
    dimensions: "",
    color: "",
    side: "unbekannt",
    shaftProfileGuide: "",
    motorControl: "",
    errorDescription: "",
    urgency: "normal",
    status: "offen",
  };
}

const valueOrUnknown = (value, fallback = "nicht bekannt") => String(value || "").trim() || fallback;

export function buildPartRequestText(request, order, photoChecks = {}) {
  const photoLines = PART_PHOTO_REQUIREMENTS.map((item) => `${photoChecks[item] ? "[x]" : "[ ]"} ${item}`).join("\n");
  const customer = valueOrUnknown(request.customer || order?.customer, "nicht angegeben");
  const orderId = valueOrUnknown(request.orderId || order?.id, "ohne Auftragsnummer");

  return `Betreff: Ersatzteilanfrage – ${valueOrUnknown(request.product, "Produkt unbekannt")} / ${valueOrUnknown(request.part, "Bauteil zu bestimmen")} – Auftrag ${orderId}

Guten Tag,

für die nachfolgend beschriebene Anlage bitten wir um Prüfung und ein Angebot für ein passendes Ersatzteil beziehungsweise eine kompatible Alternative.

Auftragsbezug
- Auftrag: ${orderId}
- Kunde/Objekt: ${customer}
- Einsatzort: ${valueOrUnknown(order?.address, "nicht angegeben")}
- Dringlichkeit: ${valueOrUnknown(request.urgency, "normal")}

Anlage und Bauteil
- Produktart: ${valueOrUnknown(request.product)}
- Hersteller: ${valueOrUnknown(request.manufacturer)}
- Gesuchtes Bauteil: ${valueOrUnknown(request.part, "bitte anhand der Daten bestimmen")}
- Baujahr: ${valueOrUnknown(request.year)}
- Seriennummer: ${valueOrUnknown(request.serial)}
- Typenschilddaten: ${valueOrUnknown(request.nameplate)}
- Maße: ${valueOrUnknown(request.dimensions)}
- Farbe/Oberfläche: ${valueOrUnknown(request.color)}
- Seite: ${valueOrUnknown(request.side)}
- Welle/Profil/Führung: ${valueOrUnknown(request.shaftProfileGuide)}
- Motor/Steuerung: ${valueOrUnknown(request.motorControl)}

Fehlerbeschreibung
${valueOrUnknown(request.errorDescription, "Fehlerbild noch zu ergänzen")}

Foto-Nachweise
${photoLines}

Bitte teilen Sie uns Artikelnummer, Preis, Lieferzeit, Kompatibilität und gegebenenfalls zusätzlich benötigte Adapter oder Befestigungsteile mit. Bitte weisen Sie auf notwendige Alternativen hin, falls das Originalteil nicht mehr verfügbar ist.

Mit freundlichen Grüßen

Hinweis: Dieser Text ist ein vorbereiteter Entwurf und wird nicht automatisch versendet.`;
}
