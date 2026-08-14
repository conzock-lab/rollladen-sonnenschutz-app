import { allPartPhotoRequirements, getPartPhotoRequirements } from "../data/parts.js";

export const PART_REQUEST_STATUSES = ["Entwurf", "Anfrage vorbereitet", "Angefragt", "Rückfrage", "Bestellt", "Liefertermin bekannt", "Geliefert", "Verbaut", "Erledigt"];

export function normalizePartRequestStatus(status = "") {
  const normalized = String(status || "").toLocaleLowerCase("de-DE");
  if (!normalized || normalized === "offen") return "Entwurf";
  if (normalized === "vorbereitet") return "Anfrage vorbereitet";
  return PART_REQUEST_STATUSES.find((item) => item.toLocaleLowerCase("de-DE") === normalized) || status;
}

export const PART_PHOTO_REQUIREMENTS = allPartPhotoRequirements;
export { getPartPhotoRequirements };

export const PART_PRODUCT_OPTIONS = ["Rollladen", "Markise", "Raffstore", "ZIP-Screen", "Insektenschutz", "Rolltor", "Motor"];

export function createEmptyPartRequest(order = null, prefill = {}) {
  const productLabels = {
    vorbaurollladen: "Rollladen",
    aufsatzrollladen: "Rollladen",
    markise: "Markise",
    raffstore: "Raffstore",
    zipscreen: "ZIP-Screen",
    screen_offen: "ZIP-Screen",
    insektenschutz: "Insektenschutz",
    rolltor: "Rolltor",
    garagentor_antrieb: "Rolltor",
  };
  return {
    id: "",
    draftKey: `PART-DRAFT-${Date.now()}`,
    orderId: order?.id || "",
    customer: order?.customer || "",
    includeAddress: false,
    product: productLabels[order?.product] || "Rollladen",
    manufacturer: order?.manufacturer || "",
    part: "",
    requestedPart: "",
    year: "",
    serial: order?.serial || "",
    type: order?.type || "",
    nameplate: order?.nameplate || "",
    dimensions: "",
    color: "",
    profile: "",
    shaft: "",
    guide: "",
    motor: order?.drive || "",
    control: order?.control || "",
    side: "unbekannt",
    quantity: "1",
    shaftProfileGuide: "",
    motorControl: order?.drive || "",
    errorDescription: "",
    urgency: "normal",
    status: "Entwurf",
    diagnosisId: "",
    ...prefill,
  };
}

const valueOrUnknown = (value, fallback = "nicht bekannt") => String(value || "").trim() || fallback;

export function buildPartRequestText(request, order, photoChecks = {}) {
  const requirements = getPartPhotoRequirements(request.product);
  const photoLines = requirements.map((item) => `${photoChecks[item] ? "[x]" : "[ ]"} ${item}`).join("\n");
  const customer = valueOrUnknown(request.customer || order?.customer, "nicht angegeben");
  const orderId = valueOrUnknown(request.orderId || order?.id, "ohne Auftragsnummer");
  const addressLine = request.includeAddress && order?.address ? `- Einsatzort: ${order.address}\n` : "";

  return `Betreff: Unterstützung bei Ersatzteil-Identifikation – ${valueOrUnknown(request.product, "Produkt unbekannt")} – Auftrag ${orderId}

Guten Tag,

für folgenden Auftrag benötigen wir Unterstützung bei der Identifikation eines passenden Ersatzteils beziehungsweise einer kompatiblen Alternative.

Auftragsbezug
- Auftrag: ${orderId}
- Kunde/Objekt: ${customer}
${addressLine}- Dringlichkeit: ${valueOrUnknown(request.urgency, "normal")}

Produkt und Bauteil
- Produkt: ${valueOrUnknown(request.product)}
- Hersteller: ${valueOrUnknown(request.manufacturer)}
- Bauteil / mögliche Ersatzteilgruppe: ${valueOrUnknown(request.part, "noch zu bestimmen")}
- Gewünschtes Ersatzteil: ${valueOrUnknown(request.requestedPart, "Identifikation/Angebot erbeten")}
- Typ/Baujahr: ${valueOrUnknown(request.type)} / ${valueOrUnknown(request.year)}
- Seriennummer: ${valueOrUnknown(request.serial)}
- Typenschilddaten: ${valueOrUnknown(request.nameplate)}
- Maße: ${valueOrUnknown(request.dimensions)}
- Farbe/Oberfläche: ${valueOrUnknown(request.color)}
- Profil: ${valueOrUnknown(request.profile || request.shaftProfileGuide)}
- Welle: ${valueOrUnknown(request.shaft || request.shaftProfileGuide)}
- Führung: ${valueOrUnknown(request.guide || request.shaftProfileGuide)}
- Motor: ${valueOrUnknown(request.motor || request.motorControl)}
- Steuerung: ${valueOrUnknown(request.control || request.motorControl)}
- Seite: ${valueOrUnknown(request.side)}
- Anzahl: ${valueOrUnknown(request.quantity, "1")}

Fehlerbild
${valueOrUnknown(request.errorDescription, "Fehlerbild noch zu ergänzen")}

Vorhandene Fotos
${photoLines}

Bitte prüfen Sie, welche Ersatzteilgruppe beziehungsweise welches konkrete Teil zur angegebenen Anlage passt. Bitte nennen Sie – sofern anhand der Unterlagen eindeutig möglich – Artikelnummer, Kompatibilität, Preis, Lieferzeit und zusätzlich benötigte Adapter oder Befestigungsteile.

Mit freundlichen Grüßen

Hinweis: Dieser Text ist ein vorbereiteter Entwurf und wird nicht automatisch versendet.`;
}
