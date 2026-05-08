import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, AlertTriangle, RotateCcw, X, Timer } from 'lucide-react'
import { useMemo } from 'react'
import { formatLag, tellAttack, type TimelineModel } from '@/lib/timeline'
import type { TimelineState } from './state'

interface Props { model: TimelineModel; state: TimelineState; visible: boolean }

export const StorySummary = ({ model, state, visible }: Props) => {
  const data = useMemo(() => {
    const total = model.attacks.length
    const detected = model.detected.size
    const missed = total - detected
    const rate = total ? detected / total : 0
    let lagSum = 0; let lagN = 0; let fastest = Infinity
    for (const c of model.correlations.values()) {
      lagSum += c.lagMs; lagN += 1
      if (c.lagMs < fastest) fastest = c.lagMs
    }
    const avgLag = lagN ? lagSum / lagN : 0
    const missedAttacks = model.attacks.filter((a) => !model.detected.has(a.id))
    return { total, detected, missed, rate, avgLag, fastest, missedAttacks }
  }, [model])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="summary"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-black/60 to-red-950/40 p-5"
        >
          <div className="absolute -right-20 -top-20 size-60 rounded-full bg-red-500/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-60 rounded-full bg-purple-500/15 blur-3xl" />

          <header className="relative mb-4 flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-purple-300">
                Bilan de l'exercice
              </span>
              <h3 className="mt-1 font-cinematic text-xl uppercase tracking-wide text-white">
                {data.rate >= 0.99 ? 'Couverture totale'
                  : data.rate >= 0.7  ? 'Bonne posture défensive'
                  : data.rate >= 0.4  ? 'Posture partielle'
                  :                     'Couverture critique'}
              </h3>
            </div>
            <button
              onClick={() => state.setPlayhead(null)}
              className="rounded-sm p-1 text-gray-500 hover:bg-white/5 hover:text-white"
              aria-label="Fermer"
            >
              <X size={14} />
            </button>
          </header>

          <div className="relative grid grid-cols-1 gap-3 md:grid-cols-3">
            {/* big rate */}
            <div className="rounded-md border border-white/5 bg-black/40 p-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-green-400" />
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-green-300">détection</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-4xl tabular-nums text-white">
                  {Math.round(data.rate * 100)}<span className="text-xl text-gray-500">%</span>
                </span>
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                {data.detected} / {data.total} actions
              </p>
            </div>

            {/* reaction */}
            <div className="rounded-md border border-white/5 bg-black/40 p-4">
              <div className="flex items-center gap-2">
                <Timer size={14} className="text-amber-400" />
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-amber-300">réaction</span>
              </div>
              <div className="mt-2 font-mono text-3xl tabular-nums text-white">
                {data.avgLag ? formatLag(data.avgLag) : '—'}
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                meilleur · {data.fastest !== Infinity ? formatLag(data.fastest) : '—'}
              </p>
            </div>

            {/* missed */}
            <div className={`rounded-md border p-4 ${data.missed ? 'border-red-500/30 bg-red-500/10' : 'border-white/5 bg-black/40'}`}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className={data.missed ? 'text-red-400' : 'text-gray-500'} />
                <span className={`font-mono text-[9px] uppercase tracking-[0.3em] ${data.missed ? 'text-red-300' : 'text-gray-400'}`}>angles morts</span>
              </div>
              <div className="mt-2 font-mono text-3xl tabular-nums text-white">
                {data.missed}
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                {data.missed ? 'à investiguer' : 'rien à signaler'}
              </p>
            </div>
          </div>

          {/* missed list */}
          {data.missedAttacks.length > 0 && (
            <div className="relative mt-4 rounded-md border border-red-500/20 bg-red-500/[0.05] p-3">
              <p className="mb-2 font-mono text-[10px] tracking-[0.3em] uppercase text-red-300">
                action{data.missedAttacks.length > 1 ? 's' : ''} non détectée{data.missedAttacks.length > 1 ? 's' : ''}
              </p>
              <ul className="space-y-1.5">
                {data.missedAttacks.map((a) => {
                  const story = tellAttack(a)
                  return (
                    <li key={a.id}>
                      <button
                        onClick={() => state.select({ kind: 'attack', id: a.id })}
                        className="flex w-full items-start gap-2 rounded-sm px-2 py-1 text-left hover:bg-white/5"
                      >
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red-400" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12px] font-medium text-white">{story.headline}</span>
                          <span className="block text-[11px] leading-snug text-gray-400">{story.blurb}</span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          <div className="relative mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => { state.setPlayhead(0); state.setPlaying(true) }}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-500/60 bg-red-500/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-red-200 hover:border-red-400 hover:bg-red-500/25"
            >
              <RotateCcw size={11} />
              Rejouer
            </button>
            <button
              onClick={() => state.setPlayhead(null)}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-300 hover:border-white/25 hover:text-white"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
