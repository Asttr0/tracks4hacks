import { useEffect, useMemo, useRef } from 'react'
import { useTimelineModel } from '@/hooks/useTimelineModel'
import { useUiStore } from '@/store/useUiStore'
import { useTimelineState } from './state'
import { TimelineCanvas } from './TimelineCanvas'
import { TimelineKpis } from './TimelineKpis'
import { TimelineControls } from './TimelineControls'
import { TimelineDetail } from './TimelineDetail'
import { TimelineFilters } from './TimelineFilters'
import { Heatstrip } from './Heatstrip'
import { StoryNarrator } from './StoryNarrator'
import { StorySummary } from './StorySummary'
import { LiveStatusBanner } from './LiveEmptyState'

export const TimelineView = () => {
  const state = useTimelineState()
  const demoMode = useUiStore((s) => s.demoMode)

  const filters = useMemo(() => ({
    severities: state.severityFilter,
    search: state.searchQuery,
    agent: state.agentFilter,
    technique: state.technique,
    missedOnly: state.missedOnly,
  }), [state.severityFilter, state.searchQuery, state.agentFilter, state.technique, state.missedOnly])

  const model = useTimelineModel(filters)

  /* -------- auto-pause on missed attacks during playback -------- */
  const pausedFor = useRef<Set<string>>(new Set())
  useEffect(() => {
    if (!state.autoPauseOnMissed || !state.playing || state.playhead == null) return
    const span = model.windowEnd - model.windowStart
    const tNow = model.windowStart + span * state.playhead
    for (const atk of model.attacks) {
      if (model.detected.has(atk.id)) continue
      if (pausedFor.current.has(atk.id)) continue
      const atkT = Date.parse(atk.timestamp)
      // pause when playhead just crossed within ~1s of the attack
      if (atkT <= tNow && tNow - atkT < (span * 0.02)) {
        pausedFor.current.add(atk.id)
        state.setPlaying(false)
        state.select({ kind: 'attack', id: atk.id })
        // resume after a beat
        const handle = setTimeout(() => {
          if (state.autoPauseOnMissed) state.setPlaying(true)
        }, 2200)
        return () => clearTimeout(handle)
      }
    }
  }, [
    state.playhead, state.playing, state.autoPauseOnMissed,
    model.attacks, model.detected, model.windowStart, model.windowEnd,
    state,
  ])

  // reset pause-tracker when replay starts over
  useEffect(() => {
    if (state.playhead === 0 || state.playhead == null) pausedFor.current.clear()
  }, [state.playhead])

  const replayFinished = state.playhead != null && state.playhead >= 0.999 && !state.playing
  const showLiveBanner = !demoMode
  const noAttacksYet = !demoMode && model.attacks.length === 0

  return (
    <div className="space-y-4">
      {showLiveBanner && <LiveStatusBanner prominent={noAttacksYet} />}

      <TimelineKpis model={model} state={state} />

      <StorySummary model={model} state={state} visible={replayFinished} />

      <div className="flex flex-col gap-4 lg:flex-row">
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-lg border border-soc-border bg-soc-panel p-3 lg:p-4">
          <header className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-cinematic text-base text-white">
              Chronologie
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">
              {Math.round((model.windowEnd - model.windowStart) / 60_000)} min
            </span>
          </header>

          <TimelineFilters model={model} state={state} />

          <StoryNarrator model={model} state={state} />

          <div className="rounded-md border border-white/5 bg-black/40">
            <TimelineCanvas model={model} state={state} />
          </div>

          <TimelineControls model={model} state={state} />

          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-500">couverture</span>
            <Heatstrip model={model} />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-white/5 pt-3 font-mono text-[9px] uppercase tracking-[0.25em] text-gray-500">
            <Legend variant="dot"  color="#a855f7" label="attaque" />
            <Legend variant="dot"  color="#22c55e" label="détectée" />
            <Legend variant="dash" color="#ef4444" label="non détectée" />
          </div>
        </section>

        <TimelineDetail model={model} state={state} />
      </div>
    </div>
  )
}

const Legend = ({ variant, color, label }: { variant: 'dot' | 'ribbon' | 'dash'; color: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5">
    {variant === 'ribbon' && (
      <span className="block h-1.5 w-5 rounded-sm" style={{ background: color, opacity: 0.45 }} />
    )}
    {variant === 'dot' && (
      <span className="block size-2 rounded-full" style={{ background: color }} />
    )}
    {variant === 'dash' && (
      <span className="block h-px w-5" style={{
        background: `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 8px)`,
      }} />
    )}
    <span>{label}</span>
  </span>
)
