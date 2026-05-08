import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import { formatLag, tellAttack, type TimelineModel } from '@/lib/timeline'
import type { TimelineState } from './state'

interface Props {
  model: TimelineModel
  state: TimelineState
}

/** Floating caption that follows the playhead and narrates the current attack in plain French. */
export const StoryNarrator = ({ model, state }: Props) => {
  const current = useMemo(() => {
    if (state.playhead == null) return null
    const span = model.windowEnd - model.windowStart
    const t = model.windowStart + span * state.playhead
    const sorted = [...model.attacks].sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    let pickAtk: typeof model.attacks[number] | null = null
    let pickIndex = -1
    sorted.forEach((atk, i) => {
      if (Date.parse(atk.timestamp) <= t) { pickAtk = atk; pickIndex = i }
    })
    if (!pickAtk) return null
    return { atk: pickAtk as typeof model.attacks[number], index: pickIndex, total: sorted.length }
  }, [state.playhead, model.attacks, model.windowStart, model.windowEnd])

  return (
    <AnimatePresence mode="wait">
      {current && (
        <motion.div
          key={current.atk.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="rounded-md border border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-red-500/10 to-purple-500/10 px-4 py-3"
        >
          <NarrationBody current={current} model={model} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const NarrationBody = ({ current, model }: {
  current: { atk: typeof model.attacks[number]; index: number; total: number };
  model: TimelineModel;
}) => {
  const story = tellAttack(current.atk)
  const corr = model.correlations.get(current.atk.id)
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-purple-300">
        Étape {current.index + 1} / {current.total}
      </span>
      <p className="flex-1 text-[13px] leading-snug text-white">
        <span className="font-semibold">{story.headline}.</span>{' '}
        <span className="text-gray-300">{story.narration}</span>
      </p>
      {corr ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-green-300">
          ✓ détecté · {formatLag(corr.lagMs)}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-red-300">
          ✗ non détecté
        </span>
      )}
    </div>
  )
}
