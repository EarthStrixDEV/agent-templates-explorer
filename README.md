# Agent Templates Explorer

Next.js explorer for the 77 specialist agent templates in
[EarthStrixDEV/agents](https://github.com/EarthStrixDEV/agents), across 7 categories
(Consultant, Business, Software Engineering, Creative, Research, Life-style, Productivity).

Look & feel is based on [docs/reference/Agent Templates Explorer (standalone).html](docs/reference/Agent%20Templates%20Explorer%20%28standalone%29.html)
— a dark-only, GitHub-dark-inspired radial graph + detail view — rebuilt as a real app with
every agent as a real graph node (not a fake "+N more" placeholder) and a working list view.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind v4, `src/`)
- **shadcn/ui** — dark-only theme tokens matching the reference palette
- **Framer Motion** (`motion`) — pan/zoom graph, page/view transitions
- **React Bits**-style copy-paste components (`SpotlightCard`, `ShinyText`) in `src/components/reactbits/`
- **react-markdown** + **remark-gfm** — renders each agent's `core.md`

## Data

Agent `core.md` files and README role metadata are synced from GitHub and committed as a static
snapshot under `content/agents/` — the app never fetches GitHub at runtime.

```bash
pnpm sync-agents
```

Re-run this whenever `EarthStrixDEV/agents` changes, then commit the diff in `content/agents/`.
Set `GITHUB_TOKEN` in `.env` (see `.env.example`) to raise GitHub API rate limits if needed.

## Development

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build + static generation for all 77 agent pages
pnpm lint
```

## Structure

- `/` — Explorer home: search, category filter chips, Graph/List toggle (state kept in the URL)
- `/agents/[category]/[id]` — Agent detail: persona/scope/framework/guardrail tabs, copy buttons,
  position-in-graph mini-map, related agents
- `scripts/sync-agents.ts` — pulls `core.md` + README role table from GitHub into `content/agents/`
- `src/lib/agents.ts` — reads `content/agents/` at build time, parses sections/tags
- `src/lib/graph-layout.ts` — deterministic radial layout math for the graph and mini-map
