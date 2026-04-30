# Tracks4Hacks — Purple Team Correlation Engine

> *Tracking every hacker's footprints — from the attacker's terminal to the defender's dashboard.*

React 19 + TypeScript 5.4 + Vite 6 dashboard that correlates Red Team attack campaigns (Kali) with Blue Team telemetry (Wazuh SIEM + Suricata IDS) on a Debian 12 VM hosted on Microsoft Azure.

Built for the **ENSA Berrechid 2025-2026 *Technologies Web*** module (Pr. Ilhame Ait Lbachir) by **Mohamed Taha Slimani** (`@Asttr0`) & **Ismail Garnaoui (`@Sbijo`)**.

📖 Full architecture & glossary: [`TRACKS4HACKS_ARCHITECTURE_EN.md`](../TRACKS4HACKS_ARCHITECTURE_EN.md) · [FR](../TRACKS4HACKS_ARCHITECTURE_FR.md)

## Features

1. **Red/Blue Correlation Timeline** — dual-lane Recharts timeline with shaded correlation bands.
2. **MITRE ATT&CK Heatmap** — 14-tactic grid colored by alert volume; red cells flag attacks Wazuh missed.
3. **Detection Coverage Scoreboard** — KPIs + per-tool + per-technique detection rate.
4. **Attack Replay** — triggers a scripted Kali campaign via a secret-protected Netlify Function.
5. **GeoIP World Map** — attacker source IPs plotted on a world map (react-simple-maps).
6. **Incident Report PDF** — click any alert → printable one-pager via `window.print()`.
7. **Cmd+K Command Palette** — Fuse.js fuzzy search over views and alerts.

## Architecture

```
Kali (local)  →  Azure VM (Wazuh + Suricata)  →  Wazuh REST API :55000
                                                     ↓ (HTTPS + JWT)
                                             Netlify Function (BFF)
                                                     ↓ (JSON / SSE)
                                             React 19 dashboard (Netlify CDN)
```
<img width="1610" height="937" alt="image" src="https://github.com/user-attachments/assets/8815e981-abe7-42fe-b850-16d04fa92900" />



## Quickstart

```bash
npm install
npm run dev           # Vite on :5173 (Demo Mode by default — no infra needed)
npm run test          # vitest
npm run build         # tsc + vite build → dist/

# Netlify local (BFF + frontend together):
npx netlify dev       # :8888 — needed for live Wazuh/SSE
```

Env vars (see `.env.example`): `WAZUH_URL`, `WAZUH_USER`, `WAZUH_PASS`, `WAZUH_INSECURE=1` (lab only), `REPLAY_SECRET`, `TARGET_IP`.

## Demo Mode

Toggle in the top bar. Uses `src/data/demo-alerts.ts` + `demo-attacks.ts` so you can demo without running the Azure VM — saves Azure for Students credits.

## Team & Task Split


| **Taha (`@Asttr0`)** | Responsibilities : Netlify Functions (BFF, SSE, attack replay) · GeoIP Map · Correlation Timeline view · MITRE Heatmap |
| **Ismail Garnaoui (`@sbijo`)** | Responsibilities : React Layout (App shell, routing) · Sidebar / TopBar · Incident Report PDF · Command Palette (⌘K) · Coverage Scoreboard (analytics) |

## Workflow

- `main` is protected — no direct pushes.
- One feature = one branch = one PR (`feat/<scope>`, e.g. `feat/heatmap`).
- The other teammate reviews + merges. Branch deleted after merge.
- CI (`.github/workflows/ci.yml`) runs `tsc --noEmit` + `vitest` on every push.

## Grading map (ENSA criteria)

| Criterion | Where |
|---|---|
| TS strict, 0 errors | `tsconfig.json` |
| Tests > 80% (Vitest) | `tests/*.test.ts` |
| Netlify deploy | `netlify.toml`, `netlify/functions/` |
| Zustand state mgmt | `src/store/` |
| Recharts visualisation | `CorrelationTimeline`, `CoverageScoreboard` |
| Fuse.js search | `CommandPalette` (⌘K) |
| Strong typed interfaces | `src/types/` |

## Repo layout

```
netlify/functions/   BFF: Wazuh JWT proxy + SSE stream + attack replay
src/
  components/
    layout/          Sidebar, TopBar  (Ismail)
    views/           6 hero feature views
    common/          CommandPalette (⌘K)  (Ismail)
  data/              Static MITRE matrix, demo alerts, GeoIP table
  hooks/             TanStack Query, SSE, attack log
  lib/               correlator, coverage, mitreStats (pure, tested)
  store/             Zustand stores
  types/             WazuhAlert, MitreTactic, AttackEvent
tests/               Vitest unit tests
```

