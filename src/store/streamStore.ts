import { create } from "zustand";
import type { Alert } from "../types/Alert";
import type { GeoEvent } from "../types/GeoEvent";

export type StreamStatus = "idle" | "connecting" | "open" | "error" | "closed";

interface StreamState {
  status: StreamStatus;
  alerts: Alert[];
  geoEvents: GeoEvent[];
  setStatus: (s: StreamStatus) => void;
  pushAlert: (a: Alert) => void;
  pushGeoEvent: (g: GeoEvent) => void;
  clear: () => void;
}

const MAX = 500;

export const useStreamStore = create<StreamState>((set) => ({
  status: "idle",
  alerts: [],
  geoEvents: [],
  setStatus: (status) => set({ status }),
  pushAlert: (a) =>
    set((s) => ({ alerts: [a, ...s.alerts].slice(0, MAX) })),
  pushGeoEvent: (g) =>
    set((s) => ({ geoEvents: [g, ...s.geoEvents].slice(0, MAX) })),
  clear: () => set({ alerts: [], geoEvents: [] }),
}));
