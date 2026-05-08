interface NeonEdgeProps {
  /** hex/rgb color for the edge */
  color: string
  /** intensity — 'soft' for restrained, 'bright' for hero KPIs (still subtle) */
  intensity?: 'soft' | 'bright'
}

/**
 * Tight, subtle pulsing top-edge. Drop inside a `relative overflow-hidden` parent.
 * Two layers: a 1px filament + a small glow underneath.
 */
export const NeonEdge = ({ color, intensity = 'bright' }: NeonEdgeProps) => {
  const lineOpacity = intensity === 'bright' ? 0.85 : 0.55
  const glowOpacity = intensity === 'bright' ? 0.28 : 0.18

  return (
    <>
      {/* tight glow underneath */}
      <div
        aria-hidden
        className="neon-edge-glow pointer-events-none absolute inset-x-12 top-0 h-1.5 blur-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          opacity: glowOpacity,
        }}
      />
      {/* crisp filament */}
      <div
        aria-hidden
        className="neon-edge-line pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          opacity: lineOpacity,
        }}
      />
    </>
  )
}
