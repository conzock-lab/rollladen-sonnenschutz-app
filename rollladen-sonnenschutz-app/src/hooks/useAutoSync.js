import { useEffect, useRef } from "react";

export default function useAutoSync({ ownerKey, ready, enabled, offline, pendingVersion, changeToken, onLocalChange, onSync }) {
  const trackedOwnerRef = useRef("");
  const localChangeRef = useRef(onLocalChange);
  const syncRef = useRef(onSync);

  useEffect(() => { localChangeRef.current = onLocalChange; }, [onLocalChange]);
  useEffect(() => { syncRef.current = onSync; }, [onSync]);

  useEffect(() => {
    if (!ownerKey || !ready || !enabled) {
      trackedOwnerRef.current = "";
      return;
    }
    if (trackedOwnerRef.current !== ownerKey) {
      trackedOwnerRef.current = ownerKey;
      return;
    }
    localChangeRef.current?.();
  }, [ownerKey, ready, enabled, changeToken]);

  useEffect(() => {
    if (!ownerKey || !ready || !enabled || offline || pendingVersion === 0) return;
    const timeoutId = window.setTimeout(() => syncRef.current?.(), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [ownerKey, ready, enabled, offline, pendingVersion]);
}
