import { PageHeader } from '../../components/ui/PageHeader'
import { FadeIn } from '../../components/ui/FadeIn'
import { StatusDot } from '../../components/ui/StatusDot'
import { TimelineView } from '../../components/dashboard/timeline'
import { useUiStore } from '../../store/useUiStore'

export default function Timeline() {
  const demoMode = useUiStore((s) => s.demoMode)

  return (
    <>
      <FadeIn delay={0}>
        <PageHeader
          eyebrow="Histoire"
          title="Attaque vs défense"
          description="Chaque action rouge se relie à la détection bleue qui l'a vue. Lance l'histoire pour la parcourir."
          actions={<StatusDot tone={demoMode ? 'warn' : 'live'} label={demoMode ? 'DÉMO' : 'LIVE'} />}
        />
      </FadeIn>
      <FadeIn delay={0.15}>
        <TimelineView />
      </FadeIn>
    </>
  )
}
