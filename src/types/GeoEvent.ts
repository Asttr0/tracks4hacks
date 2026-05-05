import type { Severity } from "./Alert";

export interface GeoEvent {
  id: string;
  ts: string;
  ip: string;
  lat: number;
  lon: number;
  country?: string;
  city?: string;
  severity: Severity;
}
