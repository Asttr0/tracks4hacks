import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CommandPalette } from '@/components/common/CommandPalette'
import { MitreHeatmap } from '@/components/views/MitreHeatmap'
import { CorrelationTimeline } from '@/components/views/CorrelationTimeline'
import { CoverageScorecard } from '@/components/views/CoverageScorecard'
import { GeoMap } from '@/components/views/GeoMap'
import { AttackReplay } from '@/components/views/AttackReplay'
import { AlertsTable } from '@/components/views/AlertsTable'
import { IncidentReport } from '@/components/views/IncidentReport'
import { useUiStore } from '@/store/useUiStore'
import { useAlertsQuery } from '@/hooks/useAlertsQuery'
import { useAttackLog } from '@/hooks/useAttackLog'
import { useAlertStream } from '@/hooks/useAlertStream'

export default function App() {
  useAlertsQuery()
  useAttackLog()
  useAlertStream()

  const view = useUiStore((s) => s.activeView)

  return (
    <div className="flex h-screen bg-soc-bg text-soc-ink">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto">
          {view === 'timeline' && <CorrelationTimeline />}
          {view === 'mitre'    && <MitreHeatmap />}
          {view === 'coverage' && <CoverageScorecard />}
          {view === 'geo'      && <GeoMap />}
          {view === 'replay'   && <AttackReplay />}
          {view === 'alerts'   && <AlertsTable />}
        </main>
      </div>
      <CommandPalette />
      <IncidentReport />
    </div>
  )
}
