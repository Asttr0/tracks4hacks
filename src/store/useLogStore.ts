import { create } from 'zustand'
import type { WazuhAlert } from '@/types/wazuh'

type LogState = {
  alerts: WazuhAlert[]
  setAlerts: (arr: WazuhAlert[]) => void
  pushAlert: (a: WazuhAlert) => void
  mergeAlerts: (arr: WazuhAlert[]) => void
  clear: () => void
}

export const useLogStore = create<LogState>((set) => ({
  alerts: [],
  setAlerts: (arr) => set({ alerts: arr }),
  pushAlert: (a) => set((s) => ({ alerts: [a, ...s.alerts].slice(0, 5000) })),
  mergeAlerts: (arr) => set((s) => {
    const map = new Map<string, WazuhAlert>()
    for (const a of [...arr, ...s.alerts]) map.set(a.id, a)
    const merged = Array.from(map.values()).sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    return { alerts: merged.slice(0, 5000) }
  }),
  clear: () => set({ alerts: [] })
}))
