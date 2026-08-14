import { RefreshCw, Wifi, WifiOff } from "lucide-react";

export default function StatusBadge({ offline, pendingCount, failedCount = 0, lastSyncedAt, error, syncing = false, onRetry, showTechnicalDetails = false }) {
  const lastSyncTime = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
    : "";
  const label = offline
    ? "Offline"
    : syncing
      ? "Synchronisierung läuft"
      : error || failedCount > 0
        ? "Sync fehlgeschlagen"
      : pendingCount > 0
      ? pendingCount === 1 ? "1 Änderung wartet auf Synchronisierung" : `${pendingCount} Änderungen warten auf Synchronisierung`
      : lastSyncTime
        ? `Zuletzt synchronisiert: ${lastSyncTime}`
        : "Online";
  const statusClass = error || failedCount > 0
    ? "bg-rose-100 text-rose-900"
    : syncing
    ? "bg-sky-100 text-sky-900"
    : offline || pendingCount > 0
      ? "bg-amber-100 text-amber-900"
      : "bg-emerald-100 text-emerald-800";

  return <div className="flex min-w-0 flex-col items-stretch gap-1 sm:items-end">
    <div className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs font-black ${statusClass}`} title={showTechnicalDetails ? error || "" : ""}>{offline ? <WifiOff size={16} /> : syncing ? <RefreshCw size={16} className="animate-spin" /> : <Wifi size={16} />}<span className="truncate">{label}</span></div>
    {(error || failedCount > 0) && <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-800"><span>Änderungen lokal gespeichert.</span>{onRetry && <button type="button" onClick={onRetry} className="rounded-lg bg-white px-2 py-1 font-black shadow-sm">Erneut synchronisieren</button>}</div>}
  </div>;
}
