import { useEffect } from "react";
import { useStreamStore } from "../store/streamStore";
import { sampleAlerts } from "../data/sampleAlerts";

const isDemo = () =>
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("demo") === "1";

export const useStream = () => {
  const status = useStreamStore((s) => s.status);
  const setStatus = useStreamStore((s) => s.setStatus);
  const pushAlert = useStreamStore((s) => s.pushAlert);

  useEffect(() => {
    if (isDemo()) {
      setStatus("open");
      sampleAlerts.forEach(pushAlert);
      return;
    }

    setStatus("connecting");
    let es: EventSource | null = null;
    try {
      es = new EventSource("/api/stream");
      es.onopen = () => setStatus("open");
      es.onerror = () => setStatus("error");
      es.addEventListener("alert", (ev) => {
        try {
          pushAlert(JSON.parse((ev as MessageEvent).data));
        } catch {
          /* ignore malformed */
        }
      });
    } catch {
      setStatus("error");
    }
    return () => {
      es?.close();
      setStatus("closed");
    };
  }, [pushAlert, setStatus]);

  return { status };
};
