# Tracks4Hacks — Frontend Standards & Dashboard Style Guide

> **Audience:** Taha (`@Asttr0`) and Ismail (`@sbijo`).
> **Purpose:** lock the dashboard's visual + structural language so our two work-streams merge into one coherent product. Inspired by — and continuous with — the landing page already on `main`.
>
> **Rule of thumb:** if it doesn't look like it could live next to the landing page screenshots, it doesn't ship.

---

## 0. Stack & non-negotiables

- **Framework:** React 19 + TypeScript (`strict: true`).
- **Bundler:** Vite 6.
- **Styling:** Tailwind CSS 3, `darkMode: 'class'`. **No inline `style={{}}`** for layout/colors — only for dynamic values (animated transforms, computed positions, SVG `d=`, etc.).
- **Animation:** Framer Motion. Keep `transition` durations between **0.15s – 0.45s**. Never animate `width`/`height`/`top`/`left` — only `transform` + `opacity`.
- **Icons:** `lucide-react` only. No emoji in UI.
- **State:** local `useState` first → Zustand store (`src/store/`) for cross-feature state → React Query *only* if we add server cache later. No Redux.
- **Routing:** `react-router-dom` v6, lazy-loaded routes per feature.
- **No new UI libs** without a PR discussion (no MUI, no Chakra, no shadcn copy-paste sprees). If we need a primitive, use Radix headless.
- **Accessibility floor:** every interactive element keyboard-reachable, visible `:focus-visible` ring, `aria-label` on icon-only buttons.

---

## 1. Brand DNA

The dashboard is a **SOC console**, not a landing page. It must feel:

| | |
|---|---|
| **Cinematic** | Cinzel display headings, deep blacks, red accent. Like a Netflix war-room. |
| **Operational** | Dense info, monospace numerics, fixed-width gutters. Like Grafana / Splunk. |
| **Calm by default** | Color is *semantic*, not decorative. Red means "attention," not "wall." |
| **Bilingual** | UI strings in **French**. Code identifiers, comments, telemetry labels in **English**. |

We never use:
- Gradients except the two already approved (red→purple hero glow, panel inner-glow).
- Drop shadows on text.
- Glassmorphism beyond `backdrop-blur-sm` on overlays.
- Comic Sans, emojis, or hand-drawn icons. Obviously.

---

## 2. Color tokens

All colors live in `tailwind.config.js`. **Use the tokens, not raw hex.** If you need a new shade, add it to the config — don't sprinkle `#XXXXXX` across components.

### 2.1 Surface (use these for backgrounds)

| Token | Hex | Use |
|---|---|---|
| `bg-soc-bg` | `#0a0e1a` | App canvas (dashboard root). |
| `bg-soc-panel` | `#111827` | Cards, panels, sidebars. |
| `bg-black/40` + `backdrop-blur-sm` | — | Floating overlays (command palette, modals). |
| `border-soc-border` | `#1f2937` | Default 1px border. |
| `border-white/5` … `white/10` | — | Hairlines on translucent surfaces. |

Light mode (`html` *without* `.dark`): use `bg-white`, `bg-slate-50`, `border-slate-200`. Same component must work in both — test both before pushing.

### 2.2 Text

| | Dark | Light |
|---|---|---|
| Primary | `text-white` | `text-slate-900` |
| Secondary | `text-gray-300` | `text-slate-700` |
| Muted / meta | `text-gray-400` | `text-slate-500` |
| Disabled | `text-gray-600` | `text-slate-400` |

**Rule:** every text class must have a `dark:` counterpart unless the surface is fixed-dark (e.g. always-dark map overlay).

### 2.3 Semantic accents

These are the **only** colors that carry meaning. Don't pick a teal because it looks nice.

| Color | Token | Meaning |
|---|---|---|
| 🔴 Red | `soc-red` `#ef4444` | Attack, critical alert, brand mark, primary CTA. |
| 🔵 Blue | `soc-blue` `#3b82f6` | Defender / blue-team telemetry, info. |
| 🟣 Purple | `soc-purple` `#a855f7` | MITRE ATT&CK, correlation links. |
| 🟢 Green | `soc-green` `#22c55e` | Healthy, online, success. |
| 🟠 Amber | `soc-amber` `#f59e0b` | Warning, degraded, medium severity. |

Severity scale (use everywhere — alerts, heatmap, timeline):
`info → soc-blue` · `low → soc-green` · `medium → soc-amber` · `high → #fb923c` · `critical → soc-red`.

---

## 3. Typography

Three families, loaded once via `@import` in `App.tsx`. **Don't import other fonts.**

| Family | Class | Use |
|---|---|---|
| **Cinzel** (serif, 900) | `font-cinematic` | Page titles, section headers, brand mark. ALWAYS `uppercase` + `tracking-wide`. |
| **Inter** (sans) | *default* | All body, labels, buttons, form text. |
| **JetBrains Mono** | `font-mono` | All numerics, IDs, IPs, CVEs, timestamps, telemetry, code, badges. |

### Scale (tailwind utilities)

| Use | Class |
|---|---|
| Page H1 | `font-cinematic text-3xl md:text-5xl uppercase tracking-wide` |
| Section H2 | `font-cinematic text-xl md:text-2xl uppercase tracking-wide` |
| Card title | `font-cinematic text-base uppercase tracking-wide` *or* `text-sm font-semibold` |
| Body | `text-sm leading-relaxed` |
| Meta / chip | `font-mono text-[10px] tracking-[0.3em] uppercase` |
| Big number (KPI) | `font-mono text-3xl md:text-4xl tabular-nums` |

**Numbers:** always `font-mono tabular-nums`. Always.
**Labels above values:** always `font-mono text-[10px] tracking-[0.3em] uppercase text-red-400` (or appropriate semantic color). This is the project's signature label style — see `CTASection.tsx`, `LandingFooter.tsx`.

---

## 4. Spacing & layout

- **Spacing scale:** Tailwind's default (`4 = 1rem`). Use `2 / 3 / 4 / 6 / 8 / 12 / 16` predominantly — avoid arbitrary `p-[13px]` style values.
- **Radius:** `rounded-md` (6px) for inputs/buttons, `rounded-lg` (8px) for cards, `rounded-2xl` (16px) for hero/feature panels. **No `rounded-full`** outside of avatars, status dots, pills.
- **Borders:** always 1px. Never 2px+.
- **Shadows:** `shadow-[0_0_30px_rgba(220,38,38,0.4)]` is the approved red-glow for the primary CTA. Otherwise prefer `ring-1 ring-white/10` over box-shadow.
- **Container:** dashboard content max-width `max-w-[1600px] mx-auto`. Fluid below.

### Dashboard shell (Ismail's territory, but everyone aligns to it)

```
┌──────────────────────────────────────────────────────────┐
│ TopBar  56px · sticky · bg-soc-panel/80 backdrop-blur    │
├────────┬─────────────────────────────────────────────────┤
│ Side   │                                                 │
│ bar    │  Page content                                   │
│ 240px  │  - max-w-[1600px], mx-auto                      │
│ (lg)   │  - px-6 lg:px-8                                 │
│ 64px   │  - py-6                                          │
│ (md)   │                                                 │
│        │                                                 │
└────────┴─────────────────────────────────────────────────┘
```

- Sidebar collapses to icon-only at `< lg`.
- Mobile (`< md`): sidebar becomes a Sheet drawer triggered from TopBar.

---

## 5. Component primitives

Each of us implements these the same way. If you need one, look in `src/components/ui/` first; if it's not there, add it there (and ping the other person in the PR).

### 5.1 Card / Panel

```tsx
<section className="rounded-lg border border-soc-border bg-soc-panel p-4 lg:p-6">
  <header className="mb-4 flex items-center justify-between">
    <h3 className="font-cinematic text-sm uppercase tracking-wide text-white">…</h3>
    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-red-400">LIVE</span>
  </header>
  {/* content */}
</section>
```

### 5.2 Button

| Variant | Classes |
|---|---|
| **Primary** | `bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-[0.25em] px-5 py-2.5 rounded-md shadow-[0_0_20px_rgba(220,38,38,0.35)]` |
| **Secondary** | `border border-white/15 bg-white/[0.03] hover:bg-white/[0.06] text-white …same typography` |
| **Ghost** | `text-gray-300 hover:text-white hover:bg-white/5 …same typography` |
| **Destructive** | Primary + `bg-red-700 hover:bg-red-600` (reserved for *real* destructive actions; "stop replay" is not destructive). |

All buttons: `transition-colors`, focus ring `focus-visible:ring-1 focus-visible:ring-red-500/60 focus-visible:outline-none`.

### 5.3 Input

```
bg-black/40 border border-white/10 rounded-md px-3 py-2
font-mono text-sm text-white placeholder:text-gray-500
focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30
```

### 5.4 Status dot / pill

```tsx
<span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.3em] uppercase">
  <span className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.7)]" />
  ONLINE
</span>
```

### 5.5 Severity badge

`rounded-sm px-1.5 py-0.5 font-mono text-[10px] tracking-widest uppercase` + bg per severity at `/15` opacity, text at `/90`. Example: `bg-red-500/15 text-red-300`.

### 5.6 Table

- `<table className="w-full font-mono text-xs">`.
- `<thead>`: `text-[10px] tracking-[0.3em] uppercase text-red-400 border-b border-white/10`.
- `<tbody> tr`: `border-b border-white/5 hover:bg-white/[0.02]`.
- Numeric cells: `tabular-nums text-right`.
- Empty state: centered, `font-mono text-xs text-gray-500`, with one lucide icon at 24px.

### 5.7 Modal / Sheet / Command palette

- Backdrop: `bg-black/70 backdrop-blur-sm`.
- Panel: `rounded-2xl border border-white/10 bg-soc-panel/95`.
- Enter: `opacity 0→1, scale 0.97→1, 180ms ease-out`. Exit reverse, 120ms.
- Focus trap mandatory. Esc closes.

---

## 6. Charts & data viz

We will inevitably need charts. Standardize **before** we each pick a different lib.

- **Library:** [Recharts](https://recharts.org) for bars/lines/area. [visx](https://airbnb.io/visx/) only if Recharts can't (custom timeline, MITRE heatmap grid).
- **Map:** `react-leaflet` with a dark CartoDB tile (`dark_all`). No Mapbox token cost.
- **Default palette (in chart order):** `#ef4444 → #a855f7 → #3b82f6 → #22c55e → #f59e0b`.
- **Axes / grid:** `#1f2937` lines, `#6b7280` labels, `font-mono text-[10px]`.
- **Tooltips:** custom — `bg-black/90 border border-white/10 rounded-md px-3 py-2 font-mono text-xs`. Never the default white Recharts tooltip.
- **No 3D, no pie charts > 4 slices, no donut with center text > 2 lines.**

---

## 7. Motion

| Use | Recipe |
|---|---|
| Page enter | `initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:0.25}}` |
| List stagger | `staggerChildren: 0.04`, child fades up 6px |
| Hover lift (cards) | `whileHover={{ y: -2 }}` + border color shift |
| Button press | `whileTap={{ scale: 0.97 }}` |
| Live data tick | Color flash on the cell, **never** layout shift |

**Reduced motion:** wrap big animations in `useReducedMotion()` and disable. The smoke shader and spores already pause on `visibilitychange` — keep that pattern.

---

## 8. Real-time & data conventions

Both of us touch live data — these rules prevent the dashboard from looking inconsistent across panels.

- **Source of truth:** SSE stream from Netlify Function (`/api/stream`). Don't poll the Wazuh API from the React side directly — go through the BFF.
- **State shape lives in `src/store/`**. New events append to a Zustand store; components subscribe with selectors.
- **Time:** store as ISO 8601 UTC. Render with `Intl.DateTimeFormat` in `Europe/Paris`. Relative times via `date-fns/formatDistanceToNowStrict` with `locale: fr`.
- **IDs / IPs / hashes:** always `font-mono`, always selectable, truncate with `truncate` + `title={fullValue}`.
- **Loading states:** skeleton with `animate-pulse bg-white/5`. No spinners except for >2s actions.
- **Empty states:** centered, friendly French copy, one icon, optional CTA. Never just a blank panel.
- **Error states:** red-tinted panel with `AlertTriangle` icon, retry button. Never a raw error message — log to console for us, show a one-line French message to the user.

---

## 9. File & folder layout

Stay inside this structure. Don't invent new top-level folders without discussion.

```
src/
├── App.tsx                  # router + providers
├── main.tsx
├── index.css                # tailwind directives ONLY
├── components/
│   ├── ui/                  # shared primitives (Button, Card, Badge, …)
│   ├── layout/              # AppShell, Sidebar, TopBar  (Ismail)
│   ├── landing/             # frozen — do not touch
│   └── dashboard/
│       ├── geo/             # Taha — GeoIP map
│       ├── timeline/        # Taha — Correlation Timeline
│       ├── mitre/           # Taha — ATT&CK heatmap
│       ├── coverage/        # Ismail — Coverage scoreboard
│       ├── report/          # Ismail — Incident PDF
│       └── palette/         # Ismail — Command palette
├── contexts/                # ThemeContext + minimal providers
├── store/                   # zustand slices
├── hooks/                   # useStream, useAlerts, useMitre, …
├── lib/                     # pure utils (severity, time, geo)
├── data/                    # static JSON (mitre matrix, sample data)
└── types/                   # shared TS types
netlify/
└── functions/               # Taha — BFF, SSE, replay
```

- **One feature = one folder** under `dashboard/`. Public surface = `index.tsx` (the route view) + `index.ts` (re-exports). Internals stay private to the folder.
- **Shared types** (e.g. `Alert`, `Technique`, `GeoEvent`) live in `src/types/` and are imported by both sides. Don't redeclare.
- **Hooks that touch the stream** live in `src/hooks/` and are owned by Taha — Ismail consumes them.

---

## 10. Code style

- **TypeScript:** `strict: true`. No `any`, no `as any`. If you really need an escape hatch, use `unknown` + a type guard.
- **Components:** function components, named exports. `export const FeatureName = …`. No default exports except for routes.
- **Props:** explicit `interface FooProps`. No `React.FC` (it adds implicit `children`).
- **Tailwind class order:** layout → spacing → sizing → typography → color → effects → state. Use `clsx` (already a dep) for conditionals — don't string-concat classes.
- **Imports:** absolute from `@/` (configured in `vite.config.ts` + `tsconfig.json`). No `../../../`.
- **Naming:**
  - Components `PascalCase`.
  - Hooks `useCamelCase`.
  - Files match the default export's name.
  - Test files `*.test.ts(x)` next to the source.
- **Commits:** Conventional Commits. `feat(geo): …`, `fix(timeline): …`, `chore: …`. PRs squashed.
- **Branches:** `feat/<short-name>`. Never push to `main` (the protection rule will reject anyway). PRs require the green "Type-check · Test · Build" check.

---

## 11. Quality gates (before you open a PR)

Run locally:

```bash
npm run lint     # eslint, must be clean
npm run typecheck
npm run build    # must succeed
```

Visual checklist:

- [ ] Works at 1440 / 1920 / 1280 widths.
- [ ] Works in dark **and** light mode (toggle is in the TopBar).
- [ ] Keyboard navigable; visible focus on every interactive element.
- [ ] No CLS when live data ticks in.
- [ ] No `console.log`, no commented-out code, no TODOs without a `// TODO(taha):` or `// TODO(ismail):` owner.
- [ ] No new dependency without a one-line justification in the PR description.

---

## 12. Cross-team rules of engagement

- **Don't touch the other person's folder** without a heads-up. If a shared primitive needs to change, edit it in `components/ui/` and tag both reviewers.
- **`src/components/landing/` is frozen.** If you spot a bug there, fix it in a separate PR titled `fix(landing): …`.
- **Shared types are append-only** during a sprint. Renames go through a sync.
- **Dashboard route ownership:**
  - `/` (overview) — joint, but Ismail owns the shell.
  - `/incidents`, `/incidents/:id`, `/coverage` — Ismail.
  - `/map`, `/timeline`, `/mitre` — Taha.
  - `/replay` — Taha.
- **Demo mode:** every feature must have a `?demo=1` path that uses fixtures from `src/data/`. We demo from a laptop with no Azure VM running, so this is non-negotiable.

---

## 13. When in doubt

1. Open the landing page and look at how a similar element is rendered.
2. Look in `src/components/ui/` for an existing primitive.
3. Ask in the PR. We're two people — over-communicating is cheap.
4. Ship the smaller change. We can always refine; we can't easily un-merge a sprawling rewrite.

---

*Last updated: 2026-05-04 — owners: @Asttr0 & @sbijo. Bump this file in a PR if a rule changes; don't quietly diverge.*
