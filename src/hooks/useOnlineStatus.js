import { useEffect, useState } from "react";

export default function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => typeof navigator === "undefined" || navigator.onLine);

  useEffect(() => {
    const update = () => setIsOnline(typeof navigator === "undefined" || navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return { isOnline, offline: !isOnline };
}
