import { PageHeader } from '../../components/ui/PageHeader'
import { FadeIn } from '../../components/ui/FadeIn'
import { StatusDot } from '../../components/ui/StatusDot'
import { MitreView } from '../../components/dashboard/mitre'
import { useUiStore } from '../../store/useUiStore'

export default function Mitre() {
  const demoMode = useUiStore((s) => s.demoMode)
  return (
    <>
      <FadeIn delay={0}>
        <PageHeader
          eyebrow="ATT&CK"
          title="Heatmap"
          description="Une case par technique. Plus elle est foncée, plus l'attaquant l'utilise."
          actions={<StatusDot tone={demoMode ? 'warn' : 'live'} label={demoMode ? 'DÉMO' : 'LIVE'} />}
        />
      </FadeIn>
      <FadeIn delay={0.15}>
        <MitreView />
      </FadeIn>
    </>
  )
}
