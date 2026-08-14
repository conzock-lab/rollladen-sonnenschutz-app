const ADMIN_ROLES = new Set(["dev", "meister", "buero"]);
const MATERIAL_WARNING_STATES = new Set(["nicht geprüft", "teilweise vorhanden", "bestellt", "wartet auf Lieferung", "fehlt"]);

export function dateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(`${value}T12:00:00`);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(value, amount) {
  const date = value instanceof Date ? new Date(value) : new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return dateKey(date);
}

export function startOfPlanningWeek(value = new Date()) {
  const date = value instanceof Date ? new Date(value) : new Date(`${value}T12:00:00`);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return dateKey(date);
}

export function getPlanningWeek(value = new Date(), includeSaturday = true) {
  const start = startOfPlanningWeek(value);
  return Array.from({ length: includeSaturday ? 6 : 5 }, (_, index) => addDays(start, index));
}

export function sortPlanningOrders(orders = []) {
  return [...orders].sort((left, right) => `${left.date || "9999-12-31"} ${left.time || "23:59"} ${left.id || ""}`.localeCompare(`${right.date || "9999-12-31"} ${right.time || "23:59"} ${right.id || ""}`));
}

export function getAssignedPeople(order, people = []) {
  const ids = new Set(order?.assignedMemberIds || []);
  return people.filter((person) => ids.has(person.id) || (!ids.size && order?.assignedTo === person.name));
}

export function isPersonAbsent(personId, day, absences = []) {
  if (!personId || !day) return null;
  return absences.find((absence) => absence.personId === personId && absence.startDate <= day && absence.endDate >= day) || null;
}

export function getVisiblePlanningOrders(role, currentPerson, orders = [], people = []) {
  if (ADMIN_ROLES.has(role)) return orders;
  if (!currentPerson || !["vorarbeiter", "monteur", "azubi"].includes(role)) return [];
  const ownOrders = orders.filter((order) => (order.assignedMemberIds || []).includes(currentPerson.id) || order.assignedTo === currentPerson.name);
  if (role !== "vorarbeiter" || !currentPerson.team) return ownOrders;
  const crewMemberIds = new Set(people.filter((person) => person.team === currentPerson.team).map((person) => person.id));
  crewMemberIds.add(currentPerson.id);
  return orders.filter((order) => ownOrders.includes(order) || order.crew === currentPerson.team || (order.assignedMemberIds || []).some((id) => crewMemberIds.has(id)));
}

export function getPartMaterialHint(order, partRequests = []) {
  const linked = partRequests.filter((request) => request.orderId === order?.id && !["erledigt", "verbaut"].includes(String(request.status || "").toLocaleLowerCase("de-DE")));
  const ordered = linked.filter((request) => ["bestellt", "angefragt"].includes(String(request.status || "").toLocaleLowerCase("de-DE")));
  if (!linked.length) return "";
  if (ordered.length) return `${ordered.length} Teil${ordered.length === 1 ? "" : "e"} bestellt/angefragt`;
  return `${linked.length} Ersatzteil${linked.length === 1 ? "" : "e"} offen`;
}

export function getPlanningOpenPoints(order, partRequests = []) {
  const points = [];
  if (!order?.date) points.push("Termin fehlt");
  if (!(order?.assignedMemberIds || []).length && !order?.assignedTo) points.push("Team fehlt");
  if (order?.customerChangeRequested) points.push("Terminänderung angefragt");
  else if (!order?.customerConfirmed) points.push("Termin unbestätigt");
  if (MATERIAL_WARNING_STATES.has(order?.materialStatus)) points.push("Material offen");
  if (partRequests.some((request) => request.orderId === order?.id && !["erledigt", "verbaut", "geliefert"].includes(String(request.status || "").toLocaleLowerCase("de-DE")))) points.push("Ersatzteil offen");
  if (order?.measurementRequired && !order?.measurementComplete) points.push("Aufmaß fehlt");
  if (order?.internalQuestionOpen) points.push("Interne Rückfrage offen");
  return [...new Set(points)];
}

export function isMaterialWarning(order, referenceDate = dateKey()) {
  if (!order?.date || !MATERIAL_WARNING_STATES.has(order?.materialStatus)) return false;
  const daysUntil = Math.ceil((new Date(`${order.date}T12:00:00`) - new Date(`${referenceDate}T12:00:00`)) / 86400000);
  return daysUntil >= 0 && daysUntil <= 2;
}

export function findPlanningConflicts(orders = [], people = [], absences = [], referenceDate = dateKey()) {
  const conflicts = Object.fromEntries(orders.map((order) => [order.id, []]));
  const slots = new Map();

  for (const order of orders) {
    const assignedIds = order.assignedMemberIds || [];
    if (!assignedIds.length && !order.assignedTo) conflicts[order.id].push({ type: "team", label: "Team fehlt" });
    if (isMaterialWarning(order, referenceDate)) conflicts[order.id].push({ type: "material", label: "Material vor Termin nicht vollständig" });

    for (const personId of assignedIds) {
      const absence = isPersonAbsent(personId, order.date, absences);
      const person = people.find((item) => item.id === personId);
      if (absence) conflicts[order.id].push({ type: "absence", personId, label: `${person?.name || "Person"} ist ${absence.type.toLocaleLowerCase("de-DE")}` });
      if (!order.date || !order.time) continue;
      const key = `${personId}:${order.date}:${order.time}`;
      const existing = slots.get(key);
      if (existing) {
        conflicts[order.id].push({ type: "double", personId, label: `${person?.name || "Person"} ist zeitgleich in ${existing}` });
        conflicts[existing] = [...(conflicts[existing] || []), { type: "double", personId, label: `${person?.name || "Person"} ist zeitgleich in ${order.id}` }];
      } else slots.set(key, order.id);
    }
  }
  return conflicts;
}

export function filterPlanningOrders(orders = [], filters = {}, people = []) {
  const search = String(filters.search || "").trim().toLocaleLowerCase("de-DE");
  return sortPlanningOrders(orders).filter((order) => {
    const assigned = getAssignedPeople(order, people);
    const haystack = [order.id, order.customer, order.address, order.product, order.productName, order.orderType, order.status, order.priority, order.materialStatus, ...assigned.map((person) => person.name)].join(" ").toLocaleLowerCase("de-DE");
    if (search && !haystack.includes(search)) return false;
    if (filters.person && !assigned.some((person) => person.id === filters.person)) return false;
    if (filters.team && order.crew !== filters.team && !assigned.some((person) => person.team === filters.team)) return false;
    if (filters.status && order.status !== filters.status) return false;
    if (filters.orderType && order.orderType !== filters.orderType) return false;
    if (filters.product && order.product !== filters.product) return false;
    if (filters.priority && order.priority !== filters.priority) return false;
    if (filters.materialStatus && order.materialStatus !== filters.materialStatus) return false;
    return true;
  });
}

export function getTeamLoad(orders = [], personId, day) {
  const count = orders.filter((order) => order.date === day && (order.assignedMemberIds || []).includes(personId)).length;
  return { count, label: count === 0 ? "frei" : count === 1 ? "1 Auftrag" : count === 2 ? "2 Aufträge" : "stark belegt" };
}

export function createPlanningAbsence(values, companyId) {
  return {
    id: values.id || `ABS-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    companyId,
    personId: values.personId,
    startDate: values.startDate,
    endDate: values.endDate || values.startDate,
    type: values.type || "Urlaub",
    note: values.note || "",
    createdAt: values.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
