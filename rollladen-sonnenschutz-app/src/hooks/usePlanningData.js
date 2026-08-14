import { useMemo } from "react";
import {
  filterPlanningOrders,
  findPlanningConflicts,
  getPartMaterialHint,
  getPlanningOpenPoints,
  getVisiblePlanningOrders,
  sortPlanningOrders,
} from "../lib/planning";

export default function usePlanningData({ absences, currentPerson, filters, orders, partRequests, people, role, selectedDate }) {
  const visibleOrders = useMemo(() => getVisiblePlanningOrders(role, currentPerson, orders, people), [role, currentPerson, orders, people]);
  const filteredOrders = useMemo(() => filterPlanningOrders(visibleOrders, filters, people), [visibleOrders, filters, people]);
  const conflicts = useMemo(() => findPlanningConflicts(visibleOrders, people, absences), [visibleOrders, people, absences]);
  const todayOrders = useMemo(() => sortPlanningOrders(filteredOrders.filter((order) => order.date === selectedDate)), [filteredOrders, selectedDate]);
  const unplannedOrders = useMemo(() => filteredOrders.filter((order) => !order.date || (!(order.assignedMemberIds || []).length && !order.assignedTo)), [filteredOrders]);
  const reworkOrders = useMemo(() => filteredOrders.filter((order) => String(order.orderType || "").toLocaleLowerCase("de-DE").includes("nacharbeit") || String(order.status || "").toLocaleLowerCase("de-DE").includes("nacharbeit")), [filteredOrders]);
  const nextOrder = useMemo(() => todayOrders.find((order) => `${order.date}T${order.time || "23:59"}` >= `${selectedDate}T${new Date().toTimeString().slice(0, 5)}`) || todayOrders[0] || null, [todayOrders, selectedDate]);
  const enrichedOrders = useMemo(() => Object.fromEntries(visibleOrders.map((order) => [order.id, {
    openPoints: getPlanningOpenPoints(order, partRequests),
    materialHint: getPartMaterialHint(order, partRequests),
  }])), [visibleOrders, partRequests]);

  return { conflicts, enrichedOrders, filteredOrders, nextOrder, reworkOrders, todayOrders, unplannedOrders, visibleOrders };
}
