<div align="center">

# 🕸️ Agent Templates Explorer

**An interactive radial-graph explorer for 77 specialist AI agent templates.**

Browse personas, expertise scopes, reasoning frameworks and guardrails —
as a living constellation or a searchable grid.

### [▶ Open the live demo](https://agent-templates-explorer.vercel.app)

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://agent-templates-explorer.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Motion](https://img.shields.io/badge/Motion-13-FF5C5C?style=flat-square)](https://motion.dev)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-black?style=flat-square)](https://ui.shadcn.com)

</div>

---

## ✨ What it does

Every agent in [`EarthStrixDEV/agents`](https://github.com/EarthStrixDEV/agents) becomes a node you
can explore. The graph lays all **77 agents** across **7 categories** on concentric rings around a
central hub — no fake "+N more" placeholders, every agent is really there.

| | |
|---|---|
| 🌌 **Graph view** | Radial constellation with drag-to-pan, wheel zoom, and nodes that idle with their own float + breathing rhythm |
| 🗂️ **List view** | Category-grouped card grid with 3D tilt, cursor spotlight and glare sweep on hover |
| 🔍 **Live filtering** | Search across names, roles and tags; filter by category. Non-matches dim rather than disappear, so the shape of the whole library stays visible |
| 📄 **Agent detail** | `core.md` split into Persona / Scope / Framework / Guardrail tabs, plus the raw source |
| 🧭 **Mini-map** | Shows exactly where the current agent sits in the wider graph |
| 🔗 **Shareable state** | Search, filters and view mode all live in the URL |
| 📋 **One-click copy** | Grab the full `core.md` or just its repo path |

---

## 🎨 Design

Dark-only, built on a GitHub-dark-inspired palette with a per-category accent ramp:

| Category | Accent | | Category | Accent |
|---|---|---|---|---|
| Consultant | `#f2994a` 🟠 | | Research | `#a78bfa` 🟣 |
| Business | `#5b8def` 🔵 | | Life-style | `#f6c945` 🟡 |
| Software Engineering | `#2ecc71` 🟢 | | Productivity | `#4dd0e1` 🩵 |
| Creative | `#eb5da0` 🩷 | | | |

Typography is **Inter** for UI and **JetBrains Mono** for paths and raw markdown.

### Motion & micro-interactions

Twenty [React Bits](https://reactbits.dev)-style components are vendored into
`src/components/reactbits/` (copy-paste, no runtime dependency on the library) and wired across
every screen:

<table>
<tr><td>

**Text**
`ShinyText` · `GradientText`
`BlurText` · `RotatingText`
`DecryptedText` · `TrueFocus`
`CountUp` · `VariableProximity`

</td><td>

**Surfaces**
`SpotlightCard` · `TiltedCard`
`GlareHover` · `MagicBento`
`StarBorder` · `ElectricBorder`
`PixelShimmer`

</td><td>

**Scene**
`ClickSpark` · `Crosshair`
`Magnet` · `Noise`
`AnimatedList` · `FadeContent`

</td></tr>
</table>

All of them run on Framer Motion, canvas or plain CSS — nothing pulls in GSAP.

---

## 🧱 Stack

- **[Next.js 16](https://nextjs.org)** — App Router, React 19, Turbopack, fully static output
- **TypeScript 5** + **Tailwind CSS 4**
- **[shadcn/ui](https://ui.shadcn.com)** — theme tokens overridden to a dark-only palette
- **[Motion](https://motion.dev)** — graph pan/zoom, node idle loops, view transitions
- **react-markdown** + **remark-gfm** — renders each agent's `core.md`
- **lucide-react** — iconography

---

## 📦 Data pipeline

Agent content is a **committed static snapshot**, not a runtime fetch — the whole site builds to
static HTML and never calls GitHub in production.

```
EarthStrixDEV/agents  ──(pnpm sync-agents)──▶  content/agents/**/core.md
                                               content/agents/index.json
                                                        │
                                              src/lib/agents.ts (build time)
                                                        │
                                                 77 static pages
```

```bash
pnpm sync-agents   # pull the latest core.md files + README role table
```

Re-run it whenever the upstream repo changes, then commit the diff under `content/agents/`.
Set `GITHUB_TOKEN` in `.env` (see [`.env.example`](.env.example)) if you hit API rate limits.

---

## 🚀 Getting started

```bash
pnpm install
pnpm dev          # → http://localhost:3000
```

| Script | What it does |
|---|---|
| `pnpm dev` | Dev server with HMR |
| `pnpm build` | Production build + static generation for all 77 agent pages |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm sync-agents` | Re-sync agent content from GitHub |

---

## 🗺️ Project structure

```
├── content/agents/              # committed snapshot: 77 × core.md + index.json
├── docs/reference/              # original standalone HTML the design is based on
├── scripts/
│   └── sync-agents.ts           # GitHub → content/agents/ sync
└── src/
    ├── app/
    │   ├── page.tsx             # explorer (graph + list)
    │   └── agents/[category]/[id]/
    │       └── page.tsx         # agent detail (SSG, 77 pages)
    ├── components/
    │   ├── explorer/            # header, search, chips, graph, cards
    │   ├── agent/               # detail header, tabs, mini-map, related
    │   ├── reactbits/           # 20 vendored motion components
    │   └── ui/                  # shadcn primitives
    └── lib/
        ├── agents.ts            # reads content/ at build time, parses sections
        ├── categories.ts        # the 7 categories + colour helpers
        └── graph-layout.ts      # deterministic radial layout math
```

> **Note on the layout math** — node positions are rounded to a fixed precision so the server and
> client serialise identical SVG attributes. Without it, floating-point drift in the last digit
> trips a React hydration mismatch.

---

## ☁️ Deployment

Live at **[agent-templates-explorer.vercel.app](https://agent-templates-explorer.vercel.app)**,
hosted on Vercel and linked to this repository — every push to `master` ships automatically.

No environment variables are required at runtime: agent content is baked into the build, so the
deployed site is fully static.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/EarthStrixDEV/agent-templates-explorer)

---

## 🙏 Credits

- Agent templates — [EarthStrixDEV/agents](https://github.com/EarthStrixDEV/agents)
- Motion components — [React Bits](https://reactbits.dev) by [@davidhaz](https://github.com/DavidHDev)
- UI primitives — [shadcn/ui](https://ui.shadcn.com)
