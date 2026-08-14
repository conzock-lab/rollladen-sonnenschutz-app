import assert from "node:assert/strict";
import { getAllowedPages } from "../src/config/navigation.js";
import { enqueueSyncItem, getQueueSummary } from "../src/lib/syncQueue.js";
import {
  createPlanningAbsence,
  filterPlanningOrders,
  findPlanningConflicts,
  getPlanningWeek,
  getVisiblePlanningOrders,
  isMaterialWarning,
  isPersonAbsent,
} from "../src/lib/planning.js";

const people = [
  { id: "P-1", name: "Vorarbeiter Eins", role: "vorarbeiter", team: "Kolonne 1", status: "aktiv" },
  { id: "P-2", name: "Monteur Eins", role: "monteur", team: "Kolonne 1", status: "aktiv" },
  { id: "P-3", name: "Azubi Eins", role: "azubi", team: "Kolonne 1", status: "aktiv" },
  { id: "P-4", name: "Monteur Zwei", role: "monteur", team: "Kolonne 2", status: "aktiv" },
];
const orders = [
  { id: "A-1", customer: "Kunde A", address: "Ort A", date: "2026-08-17", time: "08:00", assignedMemberIds: ["P-1", "P-2", "P-3"], crew: "Kolonne 1", orderType: "Montage", product: "markise", priority: "normal", materialStatus: "vollständig", status: "Geplant" },
  { id: "A-2", customer: "Kunde B", address: "Ort B", date: "2026-08-17", time: "08:00", assignedMemberIds: ["P-2"], crew: "Kolonne 1", orderType: "Reparatur", product: "rollladen", priority: "hoch", materialStatus: "fehlt", status: "Wartet auf Material" },
  { id: "A-3", customer: "Kunde C", address: "Ort C", date: "", time: "", assignedMemberIds: [], orderType: "Nacharbeit", product: "raffstore", priority: "dringend", materialStatus: "bestellt", status: "Nacharbeit" },
  { id: "A-4", customer: "Kunde D", address: "Ort D", date: "2026-08-18", time: "09:00", assignedMemberIds: ["P-4"], crew: "Kolonne 2", orderType: "Wartung", product: "zipscreen", priority: "normal", materialStatus: "nicht erforderlich", status: "Geplant" },
];
const absences = [createPlanningAbsence({ id: "ABS-1", personId: "P-3", startDate: "2026-08-17", endDate: "2026-08-17", type: "Berufsschule", note: "Schultag" }, "betrieb-test")];

assert.equal(getPlanningWeek("2026-08-19").length, 6, "Wochenansicht muss Montag bis Samstag liefern");
assert.deepEqual(getPlanningWeek("2026-08-19").slice(0, 2), ["2026-08-17", "2026-08-18"]);
assert.equal(getVisiblePlanningOrders("buero", null, orders, people).length, 4, "Büro sieht die Firmenplanung");
assert.deepEqual(getVisiblePlanningOrders("monteur", people[1], orders, people).map((order) => order.id), ["A-1", "A-2"], "Monteur sieht nur zugewiesene Baustellen");
assert.deepEqual(getVisiblePlanningOrders("azubi", people[2], orders, people).map((order) => order.id), ["A-1"], "Azubi sieht nur eigene Baustellen");
assert.deepEqual(getVisiblePlanningOrders("vorarbeiter", people[0], orders, people).map((order) => order.id), ["A-1", "A-2"], "Vorarbeiter sieht die eigene Kolonne");
assert.equal(getVisiblePlanningOrders("kunde", { id: "K-1" }, orders, people).length, 0, "Kunden sehen keine interne Planung");

assert.equal(isPersonAbsent("P-3", "2026-08-17", absences)?.type, "Berufsschule");
const conflicts = findPlanningConflicts(orders, people, absences, "2026-08-15");
assert.ok(conflicts["A-1"].some((item) => item.type === "absence"), "Abwesenheit muss warnen");
assert.ok(conflicts["A-1"].some((item) => item.type === "double"), "Doppelbelegung muss warnen");
assert.ok(conflicts["A-2"].some((item) => item.type === "material"), "Fehlendes Material vor Termin muss warnen");
assert.ok(conflicts["A-3"].some((item) => item.type === "team"), "Fehlendes Team muss warnen");
assert.equal(isMaterialWarning(orders[1], "2026-08-15"), true);
assert.deepEqual(filterPlanningOrders(orders, { search: "Monteur Zwei" }, people).map((order) => order.id), ["A-4"]);
assert.deepEqual(filterPlanningOrders(orders, { orderType: "Nacharbeit" }, people).map((order) => order.id), ["A-3"]);

assert.ok(getAllowedPages("vorarbeiter").some((page) => page.id === "planning"));
assert.ok(getAllowedPages("monteur").some((page) => page.id === "today"));
assert.ok(!getAllowedPages("kunde").some((page) => page.id === "planning" || page.id === "today"));

let queue = enqueueSyncItem([], "Baustellenplanung geändert", { orderId: "A-1" }, true, { immediate: true });
queue = enqueueSyncItem(queue, "Abwesenheit angelegt", { absenceId: "ABS-1" }, true, { immediate: true });
assert.equal(queue[0].type, "absence");
assert.equal(queue[1].type, "planning");
assert.equal(getQueueSummary(queue).pending, 2, "Offline-Änderungen müssen pending bleiben");

console.log("Baustellenplanung-Prüfung erfolgreich: Rollen, Woche, Filter, Abwesenheit, Konflikte und Offline-Queue geprüft.");
