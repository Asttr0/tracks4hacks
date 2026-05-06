import { create } from 'zustand'
import type { AttackEvent } from '@/types/attack'

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
  selectedAlertId: string | null
  selectAlert: (id: string | null) => void
  selectedTechnique: string | null
  selectTechnique: (id: string | null) => void
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
  selectedAlertId: null,
  selectAlert: (id) => set({ selectedAlertId: id }),
  selectedTechnique: null,
  selectTechnique: (id) => set({ selectedTechnique: id })
}))
