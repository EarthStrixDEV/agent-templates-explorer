# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

Package manager is **pnpm** (see `packageManager` in package.json).

```bash
pnpm dev            # dev server on :3000
pnpm build          # production build + static generation for all 77 agent pages
pnpm lint           # eslint
pnpm sync-agents    # re-pull agent content from GitHub into content/agents/
```

There is no test suite. `pnpm build` is the real correctness gate — it runs
TypeScript and reports whether the agent routes still prerender (see
"Static generation is load-bearing" below).

On Windows, pnpm may not be on `PATH` in a bash shell. Prefix commands with:
`export PATH="$APPDATA/npm:$PATH"` (typically `/c/Users/<user>/AppData/Roaming/npm`).

## What this is

An explorer for the 77 agent templates in
[EarthStrixDEV/agents](https://github.com/EarthStrixDEV/agents), presented as a
radial graph (every agent is a node) or a category-grouped card grid. Live at
[agent-templates-explorer.vercel.app](https://agent-templates-explorer.vercel.app);
pushes to `master` auto-deploy.

## Architecture

### Content is a committed snapshot, not a runtime fetch

`scripts/sync-agents.ts` pulls every `core.md` plus the README role table from
the upstream repo into `content/agents/**` and `content/agents/index.json`, which
are **committed**. `src/lib/agents.ts` reads that directory with `fs` at build
time and caches the parsed result in a module-level variable. Nothing calls
GitHub in production, and there are no runtime env vars.

To pick up upstream changes: run `pnpm sync-agents`, then commit the diff under
`content/`. `GITHUB_TOKEN` in `.env` only raises the API rate limit during sync.

`src/lib/agents.ts` parses `core.md` into four sections by matching H2 headings
(Persona / Scope / Framework / Guardrail) — the headings are a mix of Thai and
English, so the matchers are regex-based rather than exact-string.

### Explorer state lives in the URL

`ExplorerClient` is the single owner of explorer state, and it keeps all of it in
search params (`?q=`, `?cat=`, `?view=`) via `router.replace`. Graph and list are
two renderings of the same filtered data — there is no separate component state
to keep in sync, and every explorer view is shareable and reload-safe.

Filtering **dims** non-matches rather than removing them, in both views. That's
deliberate — it preserves the shape of the whole library — but it means every
filter needs explicit feedback (result counts, empty states) since "nothing
matched" and "everything is dim" look identical otherwise.

Agent links carry the current explorer URL as `?from=`, so the detail page's back
button restores the exact view and filters the user came from.

### Static generation is load-bearing

Both agent routes — `[id]` and `[id]/use` — prerender all 77 pages via
`generateStaticParams`. **Adding `searchParams` to either page silently opts the
whole route into dynamic rendering.** Anything that needs query params there must
read them client-side instead — see `BackLink`, `RelatedAgents`,
`UseTemplateButton` and `UseTemplateBackLink`, which all use `useSearchParams`
inside `<Suspense>` for exactly this reason.

After changing those routes, check the build output says `● (SSG) … [+74 more
paths]` for each and not `ƒ (Dynamic)`. A full build should report 158 static
pages.

### Platform export

`/agents/[category]/[id]/use` reformats an agent's `core.md` for ChatGPT, Claude,
Gemini, xAI and a generic fallback. `src/lib/platforms.ts` owns this: each
platform declares its manual setup steps plus a `build(agent)` that returns the
copyable fields, so adding a platform is one entry in `PLATFORMS`.

The shared `instructionBody` helper reassembles the parsed sections back into one
prompt with their headings restored, since most platforms take a single
free-text box. It falls back to `agent.raw` if no sections parsed.

### Graph layout is deterministic by necessity

`src/lib/graph-layout.ts` computes node positions from the category list: zones
on an orbit around a hub, agents on concentric rings inside each zone. All
coordinates are **rounded to 3 decimals** before rendering. This is not
cosmetic — raw floats can serialise with a different final digit on server vs.
client, which trips a React hydration mismatch and leaves the graph blank.

The same layout function drives the detail page's mini-map, so the two views
always agree on where an agent sits.

In `RadialGraph`, the view transform is **derived during render**: a filter that
narrows to a handful of agents auto-frames them, and a `manualView` state takes
over once the user pans or zooms. Don't reintroduce an effect that calls
`setState` to sync this — the React Compiler lint rules reject it.

## Conventions

- **Dark-only.** `src/app/globals.css` defines the palette as CSS variables and
  maps them onto shadcn tokens; `<html>` is hardcoded to `class="dark"`. There is
  no light theme and no theme toggle.
- **Category colours** live in `src/lib/categories.ts` alongside `hexToRgba`,
  used for the per-category accent ramp throughout.
- **`src/components/reactbits/`** holds ~20 motion components adapted from
  [React Bits](https://reactbits.dev) under its copy-paste model — vendored
  source, not a dependency. They're built on Framer Motion, canvas or CSS; GSAP
  is deliberately not a dependency, so GSAP-based originals were reimplemented or
  skipped.
- **Language split:** UI chrome is English, agent content stays Thai (as authored
  upstream). Keep new UI strings English.
- **SVG + Framer Motion:** scale SVG groups with `transformBox: "fill-box"` and
  `transformOrigin: "center"`. Passing pixel `originX`/`originY` does not work on
  an SVG `<g>` and makes nodes fly away from the viewBox origin.
