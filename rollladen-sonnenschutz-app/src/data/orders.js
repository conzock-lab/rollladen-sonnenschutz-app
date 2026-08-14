export const ORDER_STATUSES = [
  "Neu",
  "Geplant",
  "In Vorbereitung",
  "In Arbeit",
  "Wartet auf Kunde",
  "Wartet auf Material",
  "Nacharbeit",
  "Abschluss offen",
  "Erledigt",
  "Archiviert",
];

export const ORDER_FILTERS = [
  { id: "all", label: "Alle" },
  { id: "today", label: "Heute" },
  { id: "open", label: "Offen" },
  { id: "working", label: "In Arbeit" },
  { id: "material", label: "Wartet auf Material" },
  { id: "rework", label: "Nacharbeit" },
  { id: "done", label: "Erledigt" },
];

export function normalizeOrderStatus(status = "") {
  const value = String(status || "").trim();
  const normalized = value.toLocaleLowerCase("de-DE");
  if (!normalized || normalized === "offen") return "Neu";
  if (normalized === "geplant" || normalized === "planung") return "Geplant";
  if (normalized.includes("vorbereit")) return "In Vorbereitung";
  if (normalized === "in arbeit" || normalized.includes("montage")) return "In Arbeit";
  if (normalized.includes("kunde")) return "Wartet auf Kunde";
  if (normalized.includes("material") || normalized.includes("teil")) return "Wartet auf Material";
  if (normalized.includes("nacharbeit")) return "Nacharbeit";
  if (normalized.includes("abschluss")) return "Abschluss offen";
  if (normalized === "erledigt" || normalized === "abgerechnet") return "Erledigt";
  if (normalized.includes("archiv")) return "Archiviert";
  return ORDER_STATUSES.includes(value) ? value : value;
}

export function getOrderStageIndex(status = "") {
  const normalized = normalizeOrderStatus(status);
  if (normalized === "Archiviert" || normalized === "Erledigt") return 6;
  if (normalized === "Abschluss offen" || normalized === "Nacharbeit") return 4;
  if (["In Arbeit", "Wartet auf Kunde", "Wartet auf Material"].includes(normalized)) return 3;
  if (normalized === "In Vorbereitung") return 2;
  if (normalized === "Geplant") return 1;
  return 0;
}

export function matchesOrderFilter(order, filter, today) {
  const status = normalizeOrderStatus(order?.status);
  if (filter === "today") return order?.date === today;
  if (filter === "open") return !["Erledigt", "Archiviert"].includes(status);
  if (filter === "working") return status === "In Arbeit";
  if (filter === "material") return status === "Wartet auf Material";
  if (filter === "rework") return status === "Nacharbeit" || String(order?.orderType || "").toLocaleLowerCase("de-DE").includes("nacharbeit");
  if (filter === "done") return status === "Erledigt";
  return true;
}
