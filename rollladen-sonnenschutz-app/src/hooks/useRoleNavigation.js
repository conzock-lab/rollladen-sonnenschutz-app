import { useCallback, useMemo } from "react";
import { getAllowedPages, getMobilePrimaryItems, getNavigationGroups } from "../config/navigation";

export default function useRoleNavigation(role, active) {
  const groups = useMemo(() => getNavigationGroups(role), [role]);
  const items = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  const allowedPages = useMemo(() => getAllowedPages(role), [role]);
  const mobilePrimaryItems = useMemo(() => getMobilePrimaryItems(role), [role]);
  const activeGroup = useMemo(() => groups.find((group) => group.items.some((item) => item.id === active)) || null, [active, groups]);
  const canOpenModule = useCallback((moduleId) => allowedPages.some((item) => item.id === moduleId), [allowedPages]);

  return { activeGroup, allowedPages, canOpenModule, groups, items, mobilePrimaryItems };
}
