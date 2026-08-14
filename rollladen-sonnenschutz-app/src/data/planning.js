export const PLANNING_TABS = [
  { id: "today", label: "Heute" },
  { id: "week", label: "Woche" },
  { id: "unplanned", label: "Ungeplant" },
  { id: "teams", label: "Teams" },
  { id: "absences", label: "Abwesenheiten" },
  { id: "rework", label: "Nacharbeiten" },
];

export const MATERIAL_STATUSES = [
  "nicht geprüft",
  "vollständig",
  "teilweise vorhanden",
  "bestellt",
  "wartet auf Lieferung",
  "fehlt",
  "nicht erforderlich",
];

export const ABSENCE_TYPES = ["Urlaub", "Krank", "Schule", "Berufsschule", "Lehrgang", "Frei", "Sonstiges"];
export const PLANNING_PRIORITIES = ["normal", "hoch", "dringend"];
export const PLANNING_ORDER_TYPES = ["Montage", "Reparatur", "Wartung", "Aufmaß", "Nacharbeit", "Reklamation"];

const FULL_PLANNING_ROLES = ["dev", "meister", "buero"];

export function getPlanningTabsForRole(role, todayOnly = false) {
  if (todayOnly || ["monteur", "azubi"].includes(role)) return PLANNING_TABS.filter((tab) => tab.id === "today");
  if (role === "vorarbeiter") return PLANNING_TABS.filter((tab) => ["today", "week", "teams", "rework"].includes(tab.id));
  if (FULL_PLANNING_ROLES.includes(role)) return PLANNING_TABS;
  return [];
}

export function canManagePlanning(role) {
  return FULL_PLANNING_ROLES.includes(role);
}

export function canManageAbsences(role) {
  return FULL_PLANNING_ROLES.includes(role);
}

export function canUpdateFieldStatus(role) {
  return [...FULL_PLANNING_ROLES, "vorarbeiter", "monteur"].includes(role);
}
