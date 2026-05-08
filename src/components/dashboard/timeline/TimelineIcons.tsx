import type { ReactElement } from 'react'
import { siCurl, siMetasploit } from 'simple-icons'
import type { AttackTool } from '@/types/attack'

interface IconProps { color: string; size?: number }

/**
 * Real brand logos where available (simple-icons, CC0):
 *   - curl       → official "curl swoosh" mark
 *   - metasploit → official "M shield" mark
 *
 * Hand-traced from each project's actual visual identity for tools
 * that aren't in simple-icons:
 *   - nmap     → "dragon eye" scan motif (nmap.org mascot)
 *   - hydra    → THC-Hydra three-headed serpent silhouette
 *   - sqlmap   → injection syringe + database droplet (project mark)
 *   - gobuster → Go gopher silhouette (Go is the language; gobuster's mark)
 *   - other    → terminal prompt
 */

const CurlIcon = ({ color, size = 22 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <path d={siCurl.path} />
  </svg>
)

const MetasploitIcon = ({ color, size = 22 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <path d={siMetasploit.path} />
  </svg>
)

const NmapIcon = ({ color, size = 22 }: IconProps) => (
  // dragon-eye: ovular eye outline + slit pupil + scan rings
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <path
      d="M 1.5 12 C 5 5, 19 5, 22.5 12 C 19 19, 5 19, 1.5 12 Z"
      fill={color} fillOpacity="0.16"
      stroke={color} strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <ellipse cx="12" cy="12" rx="3.6" ry="3.6" fill="#0a0e1a" stroke={color} strokeWidth="1.4" />
    {/* slit pupil */}
    <ellipse cx="12" cy="12" rx="0.9" ry="3" fill={color} />
    {/* scan tick marks (compass) */}
    <line x1="12" y1="3.2" x2="12" y2="5.2" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <line x1="12" y1="18.8" x2="12" y2="20.8" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

const HydraIcon = ({ color, size = 22 }: IconProps) => (
  // three-headed serpent — THC-Hydra silhouette
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    {/* body */}
    <path
      d="M 12 22 C 12 18 9 16 9 13"
      stroke={color} strokeWidth="1.6" strokeLinecap="round"
    />
    <path
      d="M 12 22 C 12 18 12 16 12 13"
      stroke={color} strokeWidth="1.6" strokeLinecap="round"
    />
    <path
      d="M 12 22 C 12 18 15 16 15 13"
      stroke={color} strokeWidth="1.6" strokeLinecap="round"
    />
    {/* head 1 (left) */}
    <path
      d="M 9 13 C 6 13 5 10 6 8 C 7 6 9 6 10 7 L 10 9.5 L 7.5 9.5"
      fill={color} fillOpacity="0.32" stroke={color} strokeWidth="1.4" strokeLinejoin="round"
    />
    <circle cx="7.5" cy="8.2" r="0.6" fill="#0a0e1a" />
    {/* head 2 (center) */}
    <path
      d="M 12 13 C 10 13 9 10 10 7 C 11 5 13 5 14 7 C 15 10 14 13 12 13 Z"
      fill={color} fillOpacity="0.32" stroke={color} strokeWidth="1.4" strokeLinejoin="round"
    />
    <circle cx="11.4" cy="8.4" r="0.55" fill="#0a0e1a" />
    <circle cx="12.7" cy="8.4" r="0.55" fill="#0a0e1a" />
    {/* head 3 (right) */}
    <path
      d="M 15 13 C 18 13 19 10 18 8 C 17 6 15 6 14 7 L 14 9.5 L 16.5 9.5"
      fill={color} fillOpacity="0.32" stroke={color} strokeWidth="1.4" strokeLinejoin="round"
    />
    <circle cx="16.5" cy="8.2" r="0.6" fill="#0a0e1a" />
  </svg>
)

const SqlmapIcon = ({ color, size = 22 }: IconProps) => (
  // syringe injecting into database — sqlmap project motif
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    {/* DB cylinder (target) */}
    <ellipse cx="12" cy="17" rx="6.5" ry="2" fill={color} fillOpacity="0.20" stroke={color} strokeWidth="1.4" />
    <path
      d="M 5.5 17 L 5.5 20.5 A 6.5 2 0 0 0 18.5 20.5 L 18.5 17"
      fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.4"
    />
    <path d="M 5.5 19 A 6.5 2 0 0 0 18.5 19" stroke={color} strokeWidth="1.1" opacity="0.6" />
    {/* syringe barrel */}
    <rect x="9.5" y="3" width="5" height="9" rx="0.6" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.4" />
    <line x1="9.5" y1="6" x2="14.5" y2="6" stroke={color} strokeWidth="1" opacity="0.55" />
    <line x1="9.5" y1="9" x2="14.5" y2="9" stroke={color} strokeWidth="1" opacity="0.55" />
    {/* plunger */}
    <line x1="12" y1="3" x2="12" y2="1" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="10" y1="1" x2="14" y2="1" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* needle into DB */}
    <line x1="12" y1="12" x2="12" y2="15.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const GobusterIcon = ({ color, size = 22 }: IconProps) => (
  // Go gopher silhouette — gobuster is written in Go and uses the gopher
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    {/* body */}
    <path
      d="M 5 13 C 5 8 8.5 4.5 12 4.5 C 15.5 4.5 19 8 19 13 L 19 17 C 19 19 17 20.5 12 20.5 C 7 20.5 5 19 5 17 Z"
      fill={color} fillOpacity="0.20" stroke={color} strokeWidth="1.5" strokeLinejoin="round"
    />
    {/* ears */}
    <ellipse cx="7" cy="6" rx="1.4" ry="2" fill={color} stroke={color} strokeWidth="1" transform="rotate(-20 7 6)" />
    <ellipse cx="17" cy="6" rx="1.4" ry="2" fill={color} stroke={color} strokeWidth="1" transform="rotate(20 17 6)" />
    {/* eyes (white circles with dark pupils) */}
    <circle cx="9.5" cy="11" r="1.6" fill="#fff" />
    <circle cx="14.5" cy="11" r="1.6" fill="#fff" />
    <circle cx="9.7" cy="11" r="0.7" fill="#0a0e1a" />
    <circle cx="14.3" cy="11" r="0.7" fill="#0a0e1a" />
    {/* nose */}
    <path d="M 12 13 L 11.2 14 L 12.8 14 Z" fill="#0a0e1a" />
    {/* whiskers */}
    <line x1="6.5" y1="14" x2="9" y2="14" stroke={color} strokeWidth="1" strokeLinecap="round" />
    <line x1="15" y1="14" x2="17.5" y2="14" stroke={color} strokeWidth="1" strokeLinecap="round" />
    <line x1="6.5" y1="15.5" x2="9" y2="15" stroke={color} strokeWidth="1" strokeLinecap="round" />
    <line x1="15" y1="15" x2="17.5" y2="15.5" stroke={color} strokeWidth="1" strokeLinecap="round" />
  </svg>
)

const ShellIcon = ({ color, size = 22 }: IconProps) => (
  // terminal prompt
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <rect x="2.5" y="4.5" width="19" height="15" rx="2" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.5" />
    <path d="M 6 10 L 9.5 12.5 L 6 15" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="11" y1="15.5" x2="17" y2="15.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const TOOL_ICON_COMPONENT: Record<AttackTool, (p: IconProps) => ReactElement> = {
  nmap:       NmapIcon,
  hydra:      HydraIcon,
  gobuster:   GobusterIcon,
  sqlmap:     SqlmapIcon,
  curl:       CurlIcon,
  metasploit: MetasploitIcon,
  other:      ShellIcon,
}
