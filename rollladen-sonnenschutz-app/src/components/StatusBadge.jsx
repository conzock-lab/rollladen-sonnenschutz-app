import { Wifi, WifiOff } from "lucide-react";

export default function StatusBadge({ offline, pendingCount, lastSyncedAt, error }) {
  const lastSyncTime = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
    : "";
  const label = offline
    ? "Offline erkannt"
    : pendingCount > 0
      ? "Änderungen warten auf Sync"
      : lastSyncTime
        ? `Zuletzt synchronisiert ${lastSyncTime}`
        : "Online";
  const statusClass = offline || pendingCount > 0
    ? "bg-amber-100 text-amber-900"
    : "bg-emerald-100 text-emerald-800";

  return <div className="flex min-w-0 flex-col items-stretch gap-1 sm:items-end"><div className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs font-black ${statusClass}`}>{offline ? <WifiOff size={16} /> : <Wifi size={16} />}<span className="truncate">{label}</span></div>{error && <div title={error} className="rounded-xl bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-800">Sync-Fehler · lokal gespeichert</div>}</div>;
}
