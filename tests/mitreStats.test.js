import { describe, it, expect } from 'vitest';
import { mitreCellStats } from '@/lib/mitreStats';
const now = new Date().toISOString();
describe('mitreCellStats', () => {
    it('counts alerts and red-team hits per technique', () => {
        const alerts = [
            { id: '1', timestamp: now, rule: { id: 'r', level: 5, description: '', mitre: { id: ['T1046'] } }, agent: { name: 'x' } },
            { id: '2', timestamp: now, rule: { id: 'r', level: 6, description: '', mitre: { id: ['T1046'] } }, agent: { name: 'x' } }
        ];
        const atks = [
            { id: 'a1', timestamp: now, tool: 'nmap', command: '', target: '', mitre: ['T1046'] }
        ];
        const stats = mitreCellStats(alerts, atks);
        const t = stats.find((s) => s.technique.id === 'T1046');
        expect(t.alertCount).toBe(2);
        expect(t.redTeamHits).toBe(1);
        expect(t.detected).toBe(true);
    });
});
