import { Pause, Play, RotateCcw, Pause as AutoPauseIcon, Trash2 } from 'lucide-react'
import { useUiStore } from '@/store/useUiStore'
import { useLogStore } from '@/store/useLogStore'
import type { TimelineModel } from '@/lib/timeline'
import type { TimelineState } from './state'

interface Props {
  model: TimelineModel
  state: TimelineState
}

const SPEEDS = [0.5, 1, 2, 5]

export const TimelineControls = ({ state }: Props) => {
  const playing = state.playing
  const atLive = state.playhead == null
  const demoMode = useUiStore((s) => s.demoMode)
  const setAttackLog = useUiStore((s) => s.setAttackLog)
  const clearAlerts = useLogStore((s) => s.clear)
  const injectScenario = useUiStore((s) => s.injectScenario)

  const onPlayStory = () => {
    if (atLive || (state.playhead ?? 0) >= 1) state.setPlayhead(0)
    state.setPlaying(true)
  }
  const onPause = () => state.setPlaying(false)
  const onLive = () => { state.setPlayhead(null); state.setPlaying(false) }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border border-soc-border bg-black/30 px-3 py-2">
      <button
        onClick={playing ? onPause : onPlayStory}
        className={`group inline-flex items-center gap-2 rounded-md border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors ${
          playing
            ? 'border-amber-500/50 bg-amber-500/15 text-amber-200'
            : 'border-red-500/60 bg-red-500/15 text-red-200 shadow-[0_0_18px_rgba(239,68,68,0.25)] hover:border-red-400 hover:bg-red-500/25'
        }`}
      >
        {playing ? <Pause size={13} /> : <Play size={13} />}
        {playing ? 'Pause' : "Jouer l'histoire"}
      </button>

      <button
        onClick={onLive}
        className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-300 hover:border-white/25 hover:text-white"
      >
        <RotateCcw size={11} />
        Live
      </button>

      <div className="h-6 w-px bg-white/10" />

      <div className="flex min-w-[180px] flex-1 items-center gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-gray-500">progression</span>
        <input
          type="range"
          min={0} max={1000} step={1}
          value={atLive ? 1000 : Math.round((state.playhead ?? 0) * 1000)}
          onChange={(e) => state.setPlayhead(Number(e.target.value) / 1000)}
          className="flex-1 accent-red-500"
        />
        <span className="w-12 text-right font-mono text-[10px] tabular-nums text-gray-300">
          {atLive ? 'LIVE' : `${Math.round((state.playhead ?? 0) * 100)}%`}
        </span>
      </div>

      <div className="h-6 w-px bg-white/10" />

      <div className="flex items-center gap-1">
        <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.25em] text-gray-500">vitesse</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => state.setSpeed(s)}
            className={`rounded-sm px-2 py-1 font-mono text-[10px] tabular-nums transition-colors ${
              state.speed === s
                ? 'bg-red-500/20 text-red-200'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            {s}×
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-white/10" />

      <button
        onClick={state.toggleAutoPause}
        title="Met l'histoire en pause sur chaque action non détectée pour l'expliquer"
        className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.22em] transition-colors ${
          state.autoPauseOnMissed
            ? 'border-purple-500/50 bg-purple-500/15 text-purple-200'
            : 'border-white/10 bg-white/[0.02] text-gray-500 hover:border-white/25 hover:text-white'
        }`}
      >
        <AutoPauseIcon size={10} />
        Pause sur manqués
      </button>

      {/* live-mode utilities */}
      {!demoMode && (
        <>
          <div className="h-6 w-px bg-white/10" />
          <button
            onClick={() => injectScenario('demo-' + Date.now().toString(36))}
            className="inline-flex items-center gap-1.5 rounded-sm border border-red-500/40 bg-red-500/10 px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.22em] text-red-200 hover:border-red-400 hover:bg-red-500/20"
          >
            Recharger scénario
          </button>
          <button
            onClick={() => { setAttackLog([]); clearAlerts() }}
            className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.22em] text-gray-400 hover:border-white/25 hover:text-white"
          >
            <Trash2 size={10} />
            Vider
          </button>
        </>
      )}
    </div>
  )
}
