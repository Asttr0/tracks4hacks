import { useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import {
  PrintStyles,
  IncidentHeroCard,
  ReportSectionsPreview,
  ExportToast,
  PrintableReport,
} from "../../components/dashboard/incidents";
import { DEMO_KPI, DEMO_DETECTED, DEMO_MISSED } from "../../data/demo-coverage";

const noRuleCount  = DEMO_MISSED.filter((a) => a.missReason === "NO_RULE").length;
const timeoutCount = DEMO_MISSED.filter((a) => a.missReason === "TIMEOUT").length;

export default function Incidents() {
  const [hovered,    setHovered]    = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toast,      setToast]      = useState(false);

  const handleExport = () => {
    setGenerating(true);
    setTimeout(() => {
      window.print();
      setGenerating(false);
      setToast(true);
      setTimeout(() => setToast(false), 2200);
    }, 600);
  };

  return (
    <>
      <PrintStyles />

      <div className="space-y-8">
        <PageHeader
          eyebrow="● Incidents — Reporting"
          title="Rapport d'Incident"
          description="Génère un rapport PDF complet à partir de la dernière session Red Team / Wazuh — preuves de corrélation, angles morts et charges utiles."
        />

        <IncidentHeroCard
          hovered={hovered}
          setHovered={setHovered}
          generating={generating}
          detectedCount={DEMO_DETECTED.length}
          missedCount={DEMO_MISSED.length}
          onExport={handleExport}
        />

        <ReportSectionsPreview />
      </div>

      <ExportToast visible={toast} />

      <PrintableReport
        kpi={DEMO_KPI}
        detected={DEMO_DETECTED}
        missed={DEMO_MISSED}
        noRuleCount={noRuleCount}
        timeoutCount={timeoutCount}
      />
    </>
  );
}
