import { create } from 'zustand';
export const useLogStore = create((set) => ({
    alerts: [],
    setAlerts: (arr) => set({ alerts: arr }),
    pushAlert: (a) => set((s) => ({ alerts: [a, ...s.alerts].slice(0, 5000) })),
    mergeAlerts: (arr) => set((s) => {
        const map = new Map();
        for (const a of [...arr, ...s.alerts])
            map.set(a.id, a);
        const merged = Array.from(map.values()).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        return { alerts: merged.slice(0, 5000) };
    }),
    clear: () => set({ alerts: [] })
}));
