import { create } from 'zustand';
export const useUiStore = create((set) => ({
    demoMode: true,
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
}));
