import { useEffect } from "react";
import { useStreamStore } from "../store/streamStore";
import { useUiStore } from "../store/useUiStore";
import { useLogStore } from "../store/useLogStore";
import { sampleAlerts } from "../data/sampleAlerts";
import { DEMO_ALERTS } from "../data/demo-alerts";
import { DEMO_ATTACKS } from "../data/demo-attacks";
import type { Alert, Severity } from "../types/Alert";
import type { GeoEvent } from "../types/GeoEvent";
import type { WazuhAlert } from "../types/wazuh";

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

// Module-level cache so IPs already resolved don't trigger a second BFF call.
// Cleared on demo/live toggle so the map redraws from scratch.
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

/**
 * Build a synthetic WazuhAlert for the demo drip. Recycles a random row from
 * DEMO_ALERTS, restamps it now, and re-IDs it so it lands as a fresh hit.
 */
const synthesizeDripAlert = (): WazuhAlert => {
  const seed = DEMO_ALERTS[Math.floor(Math.random() * DEMO_ALERTS.length)]!;
  return {
    ...seed,
    id: `drip-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  };
};

export const useStream = () => {
  const status = useStreamStore((s) => s.status);
  const setStatus = useStreamStore((s) => s.setStatus);
  const pushAlert = useStreamStore((s) => s.pushAlert);
  const pushGeoEvent = useStreamStore((s) => s.pushGeoEvent);
  const clear = useStreamStore((s) => s.clear);
  const demoMode = useUiStore((s) => s.demoMode);

  useEffect(() => {
    // Reset accumulated state so a mode switch redraws from scratch.
    clear();
    resolvedIps.clear();

    const log = useLogStore.getState();
    const ui = useUiStore.getState();

    if (demoMode) {
      // Seed both pipelines: streamStore (Map/Overview) + useLogStore (Timeline/MITRE).
      setStatus("open");
      sampleAlerts.forEach(pushAlert);
      resolveGeoIps(sampleAlerts, pushGeoEvent);

      // Shift demo timestamps so they read as "happened over the last hour".
      const baseShift = Date.now() - 30 * 60 * 1000;
      const shiftedAlerts = DEMO_ALERTS.map((a, i) => ({
        ...a,
        timestamp: new Date(
          baseShift + i * (30 * 60 * 1000) / Math.max(DEMO_ALERTS.length, 1),
        ).toISOString(),
      }));
      log.setAlerts(shiftedAlerts);
      ui.setAttackLog(DEMO_ATTACKS);

      // Live drip: a fresh alert every 4-7s so cells pulse and charts move.
      const drip = setInterval(() => {
        useLogStore.getState().pushAlert(synthesizeDripAlert());
      }, 4000 + Math.random() * 3000);
      return () => clearInterval(drip);
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
          const arr = Array.isArray(items) ? items : [items];
          // streamStore (Alert) for Map/Overview
          const normalized = arr.map(normalizeAlert);
          normalized.forEach(pushAlert);
          resolveGeoIps(normalized, pushGeoEvent);
          // useLogStore (WazuhAlert) for Timeline/MITRE — payload is already
          // wazuh-shaped from the BFF, so we feed it through directly.
          useLogStore.getState().mergeAlerts(arr as WazuhAlert[]);
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
  }, [demoMode, clear, pushAlert, pushGeoEvent, setStatus]);

  return { status };
};
