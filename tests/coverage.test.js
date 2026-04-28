import { describe, it, expect } from 'vitest';
import { coverageReport } from '@/lib/coverage';
const BASE = 1_700_000_000_000;
const ts = (s) => new Date(BASE + s * 1000).toISOString();
const atk = [
    { id: 'a1', timestamp: ts(0), tool: 'nmap', command: 'x', target: 'x', mitre: ['T1046'] },
    { id: 'a2', timestamp: ts(60), tool: 'hydra', command: 'x', target: 'x', mitre: ['T1110'] },
    { id: 'a3', timestamp: ts(120), tool: 'sqlmap', command: 'x', target: 'x', mitre: ['T1190'] }
];
const alerts = [
    { id: 'al1', timestamp: ts(5), rule: { id: 'r', level: 5, description: '', mitre: { id: ['T1046'] } }, agent: { name: 'x' } },
    { id: 'al2', timestamp: ts(70), rule: { id: 'r', level: 8, description: '', mitre: { id: ['T1110'] } }, agent: { name: 'x' } }
];
describe('coverageReport', () => {
    it('computes detection rate', () => {
        const r = coverageReport(atk, alerts);
        expect(r.totalAttacks).toBe(3);
        expect(r.detectedAttacks).toBe(2);
        expect(r.missedAttacks).toBe(1);
        expect(r.detectionRate).toBeCloseTo(2 / 3, 2);
    });
    it('tracks per-tool stats', () => {
        const r = coverageReport(atk, alerts);
        expect(r.byTool.nmap).toEqual({ launched: 1, detected: 1 });
        expect(r.byTool.hydra).toEqual({ launched: 1, detected: 1 });
        expect(r.byTool.sqlmap).toEqual({ launched: 1, detected: 0 });
    });
    it('reports gaps per technique', () => {
        const r = coverageReport(atk, alerts);
        const gap = r.byTechnique.find((t) => t.techniqueId === 'T1190');
        expect(gap.launched).toBe(1);
        expect(gap.detected).toBe(0);
    });
});
