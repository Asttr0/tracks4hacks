<img width="1824" height="232" alt="logo" src="https://github.com/user-attachments/assets/b52f3034-cc4a-46b3-9258-d6e0ec3ff64f" />


> *Tracking every hacker's footprints — from the attacker's terminal to the defender's dashboard.*

[![Netlify Status](https://api.netlify.com/api/v1/badges/d73447cb-fe9b-4ba9-ba69-3a4ada87dacb/deploy-status)](https://tracks4hacks.netlify.app)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06b6d4?logo=tailwindcss&logoColor=white)

A real-time SOC dashboard that correlates Red Team offensive operations (Kali Linux) with Blue Team SIEM telemetry (Wazuh + Suricata) on a Debian 12 VM hosted on Microsoft Azure. Built as a final project for the **ENSA Berrechid 2025-2026 *Technologies Web*** module (Pr. Ilhame Ait Lbachir).

**Live demo →** [tracks4hacks.netlify.app](https://tracks4hacks.netlify.app)

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quickstart](#quickstart)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Team](#team)
- [Workflow](#workflow)

---

## Features

### Taha — `@Asttr0`

| Feature | Description |
|---------|-------------|
| **Vue d'ensemble** | Real-time SOC overview — 4 live KPI cards, 15-min sliding flux chart (custom SVG animated at 6 Hz), top MITRE techniques & source countries |
| **GeoIP World Map** | 3D interactive globe (deck.gl + WebGL) — animated great-circle arcs from attacker IPs to the Azure server, colored by severity, pulsing at 30 fps |
| **Red/Blue Timeline** | Story-mode incident replay — correlates every red team action with its blue team detection, auto-pauses on missed attacks, Heatstrip coverage bar |
| **MITRE ATT&CK Heatmap** | 14-tactic grid colored by alert volume — lollipop time chart, per-tactic bar chart, slide-in detail panel per technique |

### Ismail — `@ismailgr10`

| Feature | Description |
|---------|-------------|
| **Coverage Scoreboard** | Detection KPIs (coverage %, MTTD), per-tool and per-technique breakdown, Recharts bar & pie charts |
| **Incident Report PDF** | Per-alert printable one-pager via `@media print` |
| **App Shell** | Sidebar navigation, TopBar, routing (React Router v7), light/dark theme |
| **Command Palette** | `Ctrl+K` fuzzy search over views and alerts (Fuse.js) |

---

## Architecture

```mermaid
flowchart TD
    subgraph GH["☁️  GITHUB"]
        G["Repository · main branch
        ──────────────────────
        GitHub Actions CI
        tsc  ·  vitest  ·  vite build
        Auto-deploys to Netlify on merge"]
    end

    subgraph AZ["🖥️  AZURE VM — Debian 12  (Sweden Central)"]
        A["Kali Linux  →  Suricata IDS  →  Wazuh Manager
        ───────────────────────────────────────────
        Suricata writes events to eve.json
        Wazuh ingests, enriches with MITRE ATT&CK tags
        OpenSearch Indexer exposes REST on :9443"]
    end

    subgraph BFF["⚡  NETLIFY EDGE — Backend for Frontend"]
        B["/api/stream          SSE — polls Indexer every 5 s
        /api/wazuh-alerts   Paginated alert proxy
        /api/wazuh-agents   Agent list
        /api/geoip            IP → lat / lon resolver
        /api/attack-replay  Scripted scenario trigger
        ─────────────────────────────────────────────
        Credentials stay server-side · never reach the client"]
    end

    subgraph DASH["🖥️  REACT DASHBOARD — Netlify CDN"]
        D["useStream()  →  Zustand  (streamStore · useUiStore · useLogStore)
        ────────────────────────────────────────────────────────────
        Overview  ·  GeoIP Map  ·  Red/Blue Timeline  ·  MITRE Heatmap"]
    end

    GH  -->|"CI/CD deploy"| BFF
    AZ  -->|"HTTPS + JWT"| BFF
    BFF -->|"SSE  —  persistent connection"| DASH
```

**Data flow in one sentence:** Wazuh tags every network event with a MITRE technique ID → the BFF polls the Wazuh Indexer every 5 s and streams results via SSE → Zustand distributes the data to all dashboard views simultaneously.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 19 + TypeScript 5.4 (strict) |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 3 + custom CSS variables |
| Animations | Framer Motion |
| State management | Zustand (global store + SSE integration) |
| Routing | React Router v7 (lazy-loaded pages) |
| 3D Map | deck.gl (WebGL) + react-map-gl + MapLibre |
| Charts | Recharts (Coverage page) + custom SVG (Overview, MITRE) |
| Icons | Lucide React |
| Search | Fuse.js (Command Palette) |
| Backend | Netlify Functions (Node.js Edge) |
| CI/CD | GitHub Actions → Netlify |
| SIEM | Wazuh 4.x + OpenSearch |
| IDS | Suricata |
| Infrastructure | Microsoft Azure — Debian 12 VM (B2ls_v2, Sweden Central) |

---

## Quickstart

### Prerequisites

- Node.js 20+
- npm 10+

### Install & run

```bash
git clone https://github.com/Asttr0/tracks4hacks.git
cd tracks4hacks
npm install
npm run dev        # Vite on :5173 — Demo Mode (no infra needed)
```

### Run with live Wazuh data (BFF)

```bash
cp .env.example .env.local
# Fill in your Wazuh credentials in .env.local
npx netlify dev    # :8888 — BFF + frontend together
```

### Other commands

```bash
npm run build      # TypeScript check + Vite production build → dist/
npm run test       # Vitest unit tests
npm run typecheck  # tsc --noEmit only
```

### Demo Mode

Toggle the **DEMO** button in the top bar. Loads static data from `src/data/demo-alerts.ts` and `demo-attacks.ts` — no Azure VM required. Useful for offline development and saving Azure credits.

---

## Environment Variables

Set these in **Netlify → Project configuration → Environment variables**. Never commit real values.

| Variable | Description | Example |
|----------|-------------|---------|
| `WAZUH_URL` | Wazuh Manager base URL | `https://74.x.x.x:55000` |
| `WAZUH_USER` | Wazuh API user | `wazuh-wui` |
| `WAZUH_PASS` | Wazuh API password | `••••••••` |
| `WAZUH_INSECURE` | Skip TLS verification (lab only) | `1` |
| `INDEXER_URL` | Wazuh OpenSearch Indexer URL | `https://74.x.x.x:9443` |
| `INDEXER_PROXY_TOKEN` | Indexer proxy auth token | `7a5f3f...` |
| `REPLAY_SECRET` | Protects the attack-replay endpoint | `change-me` |
| `TARGET_IP` | Internal IP of the target VM | `10.0.0.4` |

> After saving variables in Netlify, trigger a new deploy for them to take effect.

---

## Project Structure

```
tracks4hacks/
├── netlify/
│   └── functions/
│       ├── _wazuh.ts          Shared Wazuh JWT helper (not exposed as endpoint)
│       ├── wazuh-stream.ts    SSE stream — polls Indexer every 5s
│       ├── wazuh-alerts.ts    Paginated alert proxy
│       ├── wazuh-agents.ts    Agent list
│       ├── geoip.ts           IP → lat/lon resolver
│       └── attack-replay.ts   Scripted attack scenario trigger
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── coverage/      Coverage Scoreboard components (Ismail)
│   │   │   ├── geo/           GeoMap — deck.gl 3D globe (Taha)
│   │   │   ├── incidents/     Incident detail components (Ismail)
│   │   │   ├── mitre/         MITRE Heatmap, ChartByTactic, ChartByTime (Taha)
│   │   │   └── timeline/      Timeline canvas, controls, detail panel (Taha)
│   │   ├── landing/           Landing page sections
│   │   ├── layout/            Sidebar, TopBar, app shell (Ismail)
│   │   ├── common/            Command Palette ⌘K (Ismail)
│   │   └── ui/                Shared primitives: Card, Badge, NeonEdge, StatusDot
│   ├── contexts/              ThemeContext (light/dark)
│   ├── data/                  Static MITRE matrix, demo alerts & attacks, GeoIP table
│   ├── hooks/                 useStream (SSE), useTimelineModel, useLogStore
│   ├── lib/                   Pure logic: timeline correlator, coverage calculator
│   ├── pages/
│   │   ├── Landing.tsx
│   │   └── dashboard/
│   │       ├── Overview.tsx   (Taha)
│   │       ├── Map.tsx        (Taha)
│   │       ├── Mitre.tsx      (Taha)
│   │       ├── Timeline.tsx   (Taha)
│   │       ├── Coverage.tsx   (Ismail)
│   │       └── Incidents.tsx  (Ismail)
│   ├── store/
│   │   ├── streamStore.ts     SSE alerts + geoEvents (Zustand)
│   │   ├── useUiStore.ts      UI state: demo mode, selected technique, attack log
│   │   └── useLogStore.ts     Alert log for the command palette
│   └── types/                 Alert, GeoEvent, Coverage, MITRE types
└── tests/                     Vitest unit tests (lib/ coverage)
```

---

## Team

| | Contributor | Responsibilities |
|--|-------------|-----------------|
| <img src="https://github.com/Asttr0.png" width="32" height="32" style="border-radius:50%"> | **Mohamed Taha Slimani** · [`@Asttr0`](https://github.com/Asttr0) | Vue d'ensemble · GeoIP Map · Red/Blue Timeline · MITRE Heatmap · Netlify BFF (SSE, GeoIP, attack replay) |
| <img src="https://github.com/ismailgr10.png" width="32" height="32" style="border-radius:50%"> | **Ismail Garnaoui** · [`@ismailgr10`](https://github.com/ismailgr10) | App shell (routing, sidebar, topbar) · Coverage Scoreboard · Incident Report PDF · Command Palette · Landing page |

---

## Workflow

- `main` is **branch-protected** — direct pushes are rejected.
- Required status check: `tsc --noEmit` + `vitest` + `vite build` must pass.
- One feature = one branch = one PR. The other teammate reviews and merges.
- CI pipeline: `.github/workflows/ci.yml` runs on every push and pull request.
- Netlify deploys automatically on every merge to `main`.
