import { create } from 'zustand'
import type { AttackEvent } from '@/types/attack'
import { DEMO_ATTACKS } from '@/data/demo-attacks'
import { DEMO_ALERTS } from '@/data/demo-alerts'
import { useLogStore } from '@/store/useLogStore'

export type ViewId = 'timeline' | 'mitre' | 'coverage' | 'geo' | 'replay' | 'alerts'

type UiState = {
  demoMode: boolean
  toggleDemo: () => void
  activeView: ViewId
  setView: (v: ViewId) => void
  paletteOpen: boolean
  setPalette: (b: boolean) => void
  attackLog: AttackEvent[]
  setAttackLog: (arr: AttackEvent[]) => void
  pushAttack: (a: AttackEvent) => void
  /** Inject the demo scenario as a live attack log, shifting all timestamps so it starts now. */
  injectScenario: (id: string) => void
  selectedAlertId: string | null
  selectAlert: (id: string | null) => void
  selectedTechnique: string | null
  selectTechnique: (id: string | null) => void
  /** Attacks the analyst marked as authorised exercises (so they don't read as real intrusions). */
  authorizedAttackIds: Set<string>
  toggleAuthorized: (id: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  demoMode: false,
  toggleDemo: () => set((s) => ({ demoMode: !s.demoMode })),
  activeView: 'timeline',
  setView: (v) => set({ activeView: v }),
  paletteOpen: false,
  setPalette: (b) => set({ paletteOpen: b }),
  attackLog: [],
  setAttackLog: (arr) => set({ attackLog: arr }),
  pushAttack: (a) => set((s) => ({ attackLog: [a, ...s.attackLog] })),
  injectScenario: (id) => set(() => {
    // start the scenario 12 minutes ago so the full story is already in-window.
    const base = Date.now() - 12 * 60_000
    const t0Atk = Date.parse(DEMO_ATTACKS[0]!.timestamp)
    const shiftedAttacks = DEMO_ATTACKS.map((a) => ({
      ...a,
      id: `${id}-${a.id}`,
      timestamp: new Date(base + (Date.parse(a.timestamp) - t0Atk)).toISOString(),
    }))
    // also seed paired Wazuh alerts so the timeline renders end-to-end without a
    // running Wazuh — real alerts arriving on /api/stream will merge in later.
    const t0Al = Date.parse(DEMO_ALERTS[0]!.timestamp)
    const shiftedAlerts = DEMO_ALERTS.map((a) => ({
      ...a,
      id: `${id}-${a.id}`,
      timestamp: new Date(base + (Date.parse(a.timestamp) - t0Al)).toISOString(),
    }))
    useLogStore.getState().setAlerts(shiftedAlerts)
    return { attackLog: shiftedAttacks }
  }),
  selectedAlertId: null,
  selectAlert: (id) => set({ selectedAlertId: id }),
  selectedTechnique: null,
  selectTechnique: (id) => set({ selectedTechnique: id }),
  authorizedAttackIds: new Set<string>(),
  toggleAuthorized: (id) => set((s) => {
    const next = new Set(s.authorizedAttackIds)
    if (next.has(id)) next.delete(id); else next.add(id)
    return { authorizedAttackIds: next }
  }),
}))
