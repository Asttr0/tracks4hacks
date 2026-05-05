import { useEffect } from "react";
import { useStreamStore } from "../store/streamStore";
import { sampleAlerts } from "../data/sampleAlerts";
import type { Alert, Severity } from "../types/Alert";
import type { GeoEvent } from "../types/GeoEvent";

const isDemo = () =>
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("demo") === "1";

function levelToSeverity(level: number): Severity {
  if (level >= 15) return "critical";
  if (level >= 12) return "high";
  if (level >= 8) return "medium";
  if (level >= 4) return "low";
  return "info";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeAlert(raw: any): Alert {
  return {
    id: raw._id ?? raw.id ?? `${Date.now()}-${Math.random()}`,
    ts: raw.timestamp ?? new Date().toISOString(),
    source: "wazuh",
    severity: levelToSeverity(raw.rule?.level ?? 0),
    ruleId: String(raw.rule?.id ?? ""),
    ruleDesc: raw.rule?.description ?? raw.rule?.firedtimes ?? "",
    agent: raw.agent ? { id: raw.agent.id, name: raw.agent.name } : undefined,
    srcIp: raw.data?.srcip ?? raw.data?.src_ip,
    dstIp: raw.data?.dstip ?? raw.data?.dst_ip,
    techniqueIds: raw.rule?.mitre?.id ?? [],
  };
}

// Module-level cache so IPs already resolved don't trigger a second BFF call
const resolvedIps = new Set<string>();

async function resolveGeoIps(
  alerts: Alert[],
  pushGeoEvent: (g: GeoEvent) => void
) {
  const ips = [
    ...new Set(
      alerts.map((a) => a.srcIp).filter((ip): ip is string => Boolean(ip))
    ),
  ].filter((ip) => !resolvedIps.has(ip));

  if (!ips.length) return;
  ips.forEach((ip) => resolvedIps.add(ip));

  try {
    const res = await fetch(`/api/geoip?ips=${ips.join(",")}`);
    if (!res.ok) {
      ips.forEach((ip) => resolvedIps.delete(ip));
      return;
    }
    const geos = (await res.json()) as Array<{
      ip: string;
      lat: number;
      lon: number;
      country: string;
      city: string;
    }>;
    geos.forEach((geo) => {
      const alert = alerts.find((a) => a.srcIp === geo.ip);
      pushGeoEvent({
        id: `${geo.ip}-${Date.now()}-${Math.random()}`,
        ts: alert?.ts ?? new Date().toISOString(),
        ip: geo.ip,
        lat: geo.lat,
        lon: geo.lon,
        country: geo.country,
        city: geo.city,
        severity: alert?.severity ?? "info",
      });
    });
  } catch {
    ips.forEach((ip) => resolvedIps.delete(ip));
  }
}

export const useStream = () => {
  const status = useStreamStore((s) => s.status);
  const setStatus = useStreamStore((s) => s.setStatus);
  const pushAlert = useStreamStore((s) => s.pushAlert);
  const pushGeoEvent = useStreamStore((s) => s.pushGeoEvent);

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
      es.addEventListener("alerts", (ev) => {
        try {
          const items = JSON.parse((ev as MessageEvent).data);
          const normalized = (Array.isArray(items) ? items : [items]).map(
            normalizeAlert
          );
          normalized.forEach(pushAlert);
          resolveGeoIps(normalized, pushGeoEvent);
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
  }, [pushAlert, pushGeoEvent, setStatus]);

  return { status };
};
