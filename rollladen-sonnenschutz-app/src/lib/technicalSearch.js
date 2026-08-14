const normalize = (value) => String(value || "").toLocaleLowerCase("de-DE");

export const TECHNICAL_FILTERS = ["Alle", "Rollladen", "Markise", "Raffstore", "ZIP", "Motor", "Funk", "Ersatzteil"];

function matchesFilter(text, filter) {
  if (!filter || filter === "Alle") return true;
  if (filter === "ZIP") return text.includes("zip") || text.includes("screen");
  if (filter === "Ersatzteil") return true;
  return text.includes(normalize(filter));
}

export function buildTechnicalSearchResults({ query = "", filter = "Alle", manufacturers = [], motors = [], parts = [], diagnoses = [], products = [] }) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const toResult = (type, item, label, text, route) => {
    const haystack = normalize(text);
    const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 2 : 0), 0);
    return { id: `${type}:${item.id || item.name}`, sourceId: item.id || item.name, type, label, route, score, text: haystack };
  };
  const results = [
    ...diagnoses.map((item) => toResult("Diagnose", item, item.title, [item.title, item.category, item.start?.q, item.start?.yes, item.start?.no, ...(item.partCategories || [])].join(" "), "diagnose")),
    ...manufacturers.map((item) => toResult("Hersteller", item, item.name, [item.name, ...(item.categories || []), ...(item.typicalProducts || []), ...(item.protocols || []), ...(item.topics || []), ...(item.partCategories || [])].join(" "), "manufacturers")),
    ...motors.map((item) => toResult("Motoren", item, item.name, [item.name, item.category, item.details, ...(item.useCases || []), ...(item.failureSymptoms || []), ...(item.partCategories || [])].join(" "), "motors")),
    ...parts.map((item) => toResult("Ersatzteile", item, item.name, [item.name, item.productCategory, item.partCategory, ...(item.requiredData || []), ...(item.searchTerms || [])].join(" "), "parts")),
    ...products.map((item) => toResult("Produkte", item, item.name, [item.name, item.category, item.description, ...(item.steps || [])].join(" "), "products")),
  ];
  return results
    .filter((result) => filter !== "Ersatzteil" || result.type === "Ersatzteile")
    .filter((result) => matchesFilter(result.text, filter))
    .filter((result) => !terms.length || result.score > 0)
    .sort((left, right) => right.score - left.score || left.label.localeCompare(right.label, "de"));
}
