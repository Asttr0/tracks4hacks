import { PageHeader } from '../../components/ui/PageHeader'
import { StatusDot } from '../../components/ui/StatusDot'
import { MitreView } from '../../components/dashboard/mitre'
import { useUiStore } from '../../store/useUiStore'

export default function Mitre() {
  const demoMode = useUiStore((s) => s.demoMode)
  return (
    <>
      <PageHeader
        eyebrow="ATT&CK"
        title="Heatmap"
        description="Une case par technique. Plus elle est foncée, plus l'attaquant l'utilise."
        actions={<StatusDot tone={demoMode ? 'warn' : 'live'} label={demoMode ? 'DÉMO' : 'LIVE'} />}
      />
      <MitreView />
    </>
  )
}
