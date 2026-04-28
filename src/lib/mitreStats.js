import { TECHNIQUES } from '@/data/mitre-matrix';
export function mitreCellStats(alerts, attacks) {
    const alertByTechnique = new Map();
    for (const a of alerts) {
        const ids = a.rule.mitre?.id ?? [];
        for (const t of ids)
            alertByTechnique.set(t, (alertByTechnique.get(t) ?? 0) + 1);
    }
    const redByTechnique = new Map();
    for (const a of attacks) {
        for (const t of a.mitre ?? [])
            redByTechnique.set(t, (redByTechnique.get(t) ?? 0) + 1);
    }
    return TECHNIQUES.map((t) => {
        const alertCount = alertByTechnique.get(t.id) ?? 0;
        const redHits = redByTechnique.get(t.id) ?? 0;
        return { technique: t, alertCount, redTeamHits: redHits, detected: alertCount > 0 && redHits > 0 };
    });
}
export function groupByTactic(cells) {
    const m = new Map();
    for (const c of cells) {
        const arr = m.get(c.technique.tactic) ?? [];
        arr.push(c);
        m.set(c.technique.tactic, arr);
    }
    return m;
}
