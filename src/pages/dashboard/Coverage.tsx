import { motion } from "framer-motion";

import { PageHeader } from "../../components/ui/PageHeader";
import { useUiStore } from "../../store/useUiStore";

import {
  LiveEmptyState,
  DetectionExplainer,
  CoverageKpiBento,
  MttdBarChart,
  DetectionByToolChart,
  DetectedAttacksSection,
  BlindSpotsSection,
  ExportReportCta,
} from "../../components/dashboard/coverage";
import { DEMO_KPI, DEMO_MISSED, DEMO_DETECTED, DEMO_MTTD_BARS } from "../../data/demo-coverage";
import type { CoverageKpi, DetectedAttack, MissedAttack } from "../../types/coverage";

// Re-exports for backwards compatibility (Incidents page imports these from here)
export { PrintableReport, type PrintableReportProps } from "../../components/dashboard/incidents";
export { DEMO_KPI, DEMO_MISSED, DEMO_DETECTED } from "../../data/demo-coverage";

const EMPTY_KPI: CoverageKpi = { coverage: 0, totalAttacks: 0, detectedAttacks: 0, missedAttacks: 0, mttdAvg: 0, exerciseDuration: "—" };

export default function Coverage() {
  const demoMode   = useUiStore((s) => s.demoMode);
  const toggleDemo = useUiStore((s) => s.toggleDemo);

  const kpi      = demoMode ? DEMO_KPI      : EMPTY_KPI;
  const missed: MissedAttack[]     = demoMode ? DEMO_MISSED   : [];
  const detected: DetectedAttack[] = demoMode ? DEMO_DETECTED : [];
  const mttdBars = demoMode ? DEMO_MTTD_BARS : [];

  const noRuleCount  = missed.filter((a) => a.missReason === "NO_RULE").length;
  const timeoutCount = missed.filter((a) => a.missReason === "TIMEOUT").length;
  const minDelay = detected.length ? Math.min(...detected.map((d) => d.delaySeconds)) : 0;
  const maxDelay = detected.length ? Math.max(...detected.map((d) => d.delaySeconds)) : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="● Analytics — Purple Team"
        title="Coverage Scoreboard"
        description="Corrélation entre les attaques Red Team et les alertes Wazuh. Angles morts identifiés, raisons classifiées, preuves de détection disponibles."
        actions={
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest ${
              demoMode
                ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-night-bordeaux-500/40 dark:bg-night-bordeaux-500/10 dark:text-night-bordeaux-300"
                : "border-green-200 bg-green-50 text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-400"
            }`}>
              <motion.span animate={!demoMode ? { scale: [1, 1.5, 1], opacity: [1, 0.4, 1] } : { scale: 1 }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className={`size-1.5 rounded-full ${demoMode ? "bg-orange-500 dark:bg-night-bordeaux-500" : "bg-green-500"}`} />
              {demoMode ? "Exercice Démo" : "En direct"}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/60">{kpi.detectedAttacks}/{kpi.totalAttacks} détectées</span>
          </div>
        }
      />

      <DetectionExplainer />

      <CoverageKpiBento
        kpi={kpi}
        noRuleCount={noRuleCount}
        timeoutCount={timeoutCount}
        minDelay={minDelay}
        maxDelay={maxDelay}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MttdBarChart bars={mttdBars} />
        <DetectionByToolChart detected={detected} />
      </div>

      {!demoMode ? <LiveEmptyState onToggle={toggleDemo} /> : (
        <>
          <DetectedAttacksSection detected={detected} kpi={kpi} minDelay={minDelay} maxDelay={maxDelay} />
          <BlindSpotsSection missed={missed} noRuleCount={noRuleCount} timeoutCount={timeoutCount} />
          <ExportReportCta />
        </>
      )}
    </div>
  );
}
