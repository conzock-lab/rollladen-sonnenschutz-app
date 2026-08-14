import { useEffect, useRef } from "react";

export default function useAutoSync({
  ownerKey,
  ready,
  enabled,
  offline,
  pendingVersion,
  syncDelay = 1200,
  changeToken,
  onLocalChange,
  onSync,
  localChangeDebounceMs = 1000,
}) {
  const trackedOwnerRef = useRef("");
  const localChangeRef = useRef(onLocalChange);
  const syncRef = useRef(onSync);

  useEffect(() => { localChangeRef.current = onLocalChange; }, [onLocalChange]);
  useEffect(() => { syncRef.current = onSync; }, [onSync]);

  useEffect(() => {
    if (!ownerKey || !ready || !enabled) {
      trackedOwnerRef.current = "";
      return undefined;
    }
    if (trackedOwnerRef.current !== ownerKey) {
      trackedOwnerRef.current = ownerKey;
      return undefined;
    }
    const timeoutId = window.setTimeout(() => localChangeRef.current?.(), localChangeDebounceMs);
    return () => window.clearTimeout(timeoutId);
  }, [ownerKey, ready, enabled, changeToken, localChangeDebounceMs]);

  useEffect(() => {
    if (!ownerKey || !ready || !enabled || offline || !pendingVersion) return undefined;
    const timeoutId = window.setTimeout(() => syncRef.current?.(), Math.max(0, syncDelay));
    return () => window.clearTimeout(timeoutId);
  }, [ownerKey, ready, enabled, offline, pendingVersion, syncDelay]);
}
