"use client";

import { useMemo, useState, type WheelEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ClickSpark } from "@/components/reactbits/ClickSpark";
import { Magnet } from "@/components/reactbits/Magnet";
import { Noise } from "@/components/reactbits/Noise";
import { Crosshair } from "@/components/reactbits/Crosshair";
import { Legend } from "./Legend";
import { hexToRgba, type Category } from "@/lib/categories";
import {
  computeGraphLayout,
  HUB_X,
  HUB_Y,
  VIEWBOX_W,
  VIEWBOX_H,
} from "@/lib/graph-layout";
import type { CategoryWithAgents } from "@/lib/agents";
import { Plus, Minus, MousePointerClick, SearchX, Crosshair as CrosshairIcon } from "lucide-react";

type RadialGraphProps = {
  categories: CategoryWithAgents[];
  allCategories: Category[];
  isMatch: (agentId: string, categoryId: string) => boolean;
  hasActiveFilter: boolean;
  matchingAgents: number;
  returnTo: string;
  onClearFilters: () => void;
};

/** When a filter narrows the graph to this few agents, name them inline. */
const LABEL_THRESHOLD = 6;

export function RadialGraph({
  categories,
  allCategories,
  isMatch,
  hasActiveFilter,
  matchingAgents,
  returnTo,
  onClearFilters,
}: RadialGraphProps) {
  const router = useRouter();
  const { zones, agents } = useMemo(
    () => computeGraphLayout(categories),
    [categories]
  );

  // `null` means "no manual override" — the view is auto-framed from the
  // current filter. Any pan/zoom the user performs takes over from there.
  const [manualView, setManualView] = useState<
    { zoom: number; pan: { x: number; y: number } } | null
  >(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  function markInteracted() {
    if (!hasInteracted) setHasInteracted(true);
  }

  function zoneDimmed(zoneId: string) {
    if (!hasActiveFilter) return false;
    const zoneAgents = categories.find((c) => c.id === zoneId)?.agents ?? [];
    return zoneAgents.every((a) => !isMatch(a.id, zoneId));
  }

  const noMatches = hasActiveFilter && matchingAgents === 0;
  const showMatchLabels =
    hasActiveFilter && matchingAgents > 0 && matchingAgents <= LABEL_THRESHOLD;

  /**
   * Auto-framing: when a filter narrows the graph to a handful of agents,
   * pull their centre of mass into view so the user isn't left hunting for
   * the few nodes that stayed lit. Derived during render rather than synced
   * through an effect, so there are no cascading renders.
   */
  const autoView = useMemo(() => {
    const base = { zoom: 1, pan: { x: 0, y: 0 } };
    if (!hasActiveFilter) return base;

    const matched = agents.filter((a) => isMatch(a.id, a.categoryId));
    if (matched.length === 0 || matched.length > LABEL_THRESHOLD) return base;

    const sum = matched.reduce(
      (acc, a) => ({ x: acc.x + a.x, y: acc.y + a.y }),
      { x: 0, y: 0 }
    );
    const centroid = { x: sum.x / matched.length, y: sum.y / matched.length };
    const zoom = 1.6;
    return {
      zoom,
      pan: {
        x: (HUB_X - centroid.x) * (zoom / 2),
        y: (HUB_Y - centroid.y) * (zoom / 2),
      },
    };
  }, [agents, hasActiveFilter, isMatch]);

  const { zoom, pan } = manualView ?? autoView;

  function nudgeZoom(delta: number) {
    markInteracted();
    setManualView((current) => {
      const from = current ?? autoView;
      return {
        pan: from.pan,
        zoom: Math.min(2.5, Math.max(0.5, from.zoom + delta)),
      };
    });
  }

  function handleWheel(e: WheelEvent<HTMLDivElement>) {
    e.preventDefault();
    nudgeZoom(-e.deltaY * 0.001);
  }

  return (
    <div className="relative flex-1 overflow-hidden" style={{ minHeight: 560 }}>
      <Noise opacity={0.02} />

      {/* Crosshair is scoped to the canvas layer only, so the controls and
          legend stacked above it keep their normal pointer cursor. */}
      <Crosshair color="#7aa2f7" className="absolute inset-0">
        <ClickSpark sparkColor="#7aa2f7" sparkCount={10} className="absolute inset-0">
          <motion.div
            drag
            dragMomentum={false}
            onDragStart={markInteracted}
            onDragEnd={(_, info) => {
              setManualView((current) => {
                const from = current ?? autoView;
                return {
                  zoom: from.zoom,
                  pan: {
                    x: from.pan.x + info.offset.x,
                    y: from.pan.y + info.offset.y,
                  },
                };
              });
            }}
            onWheel={handleWheel}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            style={{ x: pan.x, y: pan.y }}
          >
            <motion.div
              animate={{ scale: zoom }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute inset-0"
            >
              <svg
                viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
                className="h-full w-full"
                style={{ minHeight: 560 }}
              >
                <defs>
                  <radialGradient id="hubglow">
                    <stop offset="0%" stopColor="#7aa2f7" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7aa2f7" stopOpacity={0} />
                  </radialGradient>
                </defs>

                {/* Spokes: hub -> zone centers */}
                {zones.map((z) => (
                  <line
                    key={`spoke-${z.id}`}
                    x1={HUB_X}
                    y1={HUB_Y}
                    x2={z.x}
                    y2={z.y}
                    stroke={zoneDimmed(z.id) ? "#3a4556" : z.color}
                    strokeOpacity={zoneDimmed(z.id) ? 0.15 : 0.35}
                    strokeWidth={1.4}
                  />
                ))}

                {/* Zone circles */}
                {zones.map((z) => (
                  <circle
                    key={`zone-${z.id}`}
                    cx={z.x}
                    cy={z.y}
                    r={z.radius}
                    fill={hexToRgba(z.color, zoneDimmed(z.id) ? 0.02 : 0.06)}
                    stroke={z.color}
                    strokeOpacity={zoneDimmed(z.id) ? 0.15 : 0.45}
                    strokeWidth={1.5}
                    strokeDasharray="5,5"
                  />
                ))}

                {/* Hub */}
                <circle cx={HUB_X} cy={HUB_Y} r={80} fill="url(#hubglow)" />
                <circle
                  cx={HUB_X}
                  cy={HUB_Y}
                  r={34}
                  fill="#121826"
                  stroke="#3a4556"
                  strokeWidth={1.5}
                />
                <text
                  x={HUB_X}
                  y={HUB_Y - 4}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill="#e6edf3"
                >
                  AGENT
                </text>
                <text
                  x={HUB_X}
                  y={HUB_Y + 10}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill="#e6edf3"
                >
                  TEMPLATES
                </text>

                {/* Agent nodes — each one idles with its own float + breathing
                    rhythm so the whole graph reads as alive, not static. */}
                {agents.map((a, i) => {
                  const cat = allCategories.find((c) => c.id === a.categoryId);
                  const color = cat?.color ?? "#7aa2f7";
                  const matched = isMatch(a.id, a.categoryId);
                  const dim = hasActiveFilter && !matched;

                  // Deterministic pseudo-random phase/amplitude per node (seeded
                  // by index, not Math.random()) so server and client render the
                  // same initial animation state and hydration stays clean.
                  // Amplitude is kept small (<=2.5px) so the float reads as
                  // "alive" without making the node hard to click.
                  const seed = (i * 137.5) % 360;
                  const floatX = 1 + (i % 3) * 0.75;
                  const floatY = 1 + ((i * 3) % 3) * 0.75;
                  const duration = 3.2 + (i % 7) * 0.25;
                  const delay = -((seed / 360) * duration);

                  return (
                    <motion.g
                      key={a.id}
                      onClick={() =>
                        router.push(
                          `/agents/${a.categoryId}/${a.id}?from=${encodeURIComponent(returnTo)}`
                        )
                      }
                      // transform-box: fill-box makes transform-origin resolve
                      // against this group's own bounding box, so scaling grows
                      // the node in place instead of flinging it away from the
                      // SVG's 0,0 origin.
                      style={{
                        cursor: "pointer",
                        transformBox: "fill-box",
                        transformOrigin: "center",
                      }}
                      initial={false}
                      animate={
                        dim
                          ? { x: 0, y: 0, scale: 1 }
                          : {
                              x: [0, floatX, 0, -floatX, 0],
                              y: [0, -floatY, 0, floatY, 0],
                              scale: [1, 1.04, 1],
                            }
                      }
                      transition={
                        dim
                          ? { duration: 0.2 }
                          : {
                              duration,
                              delay,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }
                      }
                      whileHover={{ scale: 1.25, x: 0, y: 0, transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <title>{a.name}</title>
                      {!dim && (
                        <circle cx={a.x} cy={a.y} r={20} fill={hexToRgba(color, 0.08)} />
                      )}
                      <circle
                        cx={a.x}
                        cy={a.y}
                        r={16}
                        fill={dim ? "#0f1420" : "#121826"}
                        stroke={dim ? "#3a4556" : color}
                        strokeWidth={1.5}
                      />
                      <text
                        x={a.x}
                        y={a.y + 3.5}
                        textAnchor="middle"
                        fontSize={9}
                        fontWeight={600}
                        fill={dim ? "#3a4556" : "#e6edf3"}
                      >
                        {a.short}
                      </text>

                      {/* With only a handful of results left, initials are not
                          enough to tell agents apart — name them outright. */}
                      {showMatchLabels && matched && (
                        <text
                          x={a.x}
                          y={a.y + 30}
                          textAnchor="middle"
                          fontSize={10}
                          fontWeight={600}
                          fill={color}
                        >
                          {a.name}
                        </text>
                      )}
                    </motion.g>
                  );
                })}

                {/* Zone labels */}
                {zones.map((z) => {
                  const labelX = Math.round(
                    (HUB_X + Math.cos(z.angle) * (330 + z.radius + 24)) * 1000
                  ) / 1000;
                  const labelY = Math.round(
                    (HUB_Y + Math.sin(z.angle) * (330 + z.radius + 24)) * 1000
                  ) / 1000;
                  return (
                    <text
                      key={`label-${z.id}`}
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={700}
                      fill={z.color}
                      opacity={zoneDimmed(z.id) ? 0.3 : 1}
                    >
                      {z.label}
                    </text>
                  );
                })}
              </svg>
            </motion.div>
          </motion.div>
        </ClickSpark>
      </Crosshair>

      {/* Graph interactions are all hidden affordances, so say them out loud
          until the user has actually panned or zoomed once. */}
      <AnimatePresence>
        {!hasInteracted && !hasActiveFilter && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute left-1/2 top-5 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[var(--border-hairline)] bg-[var(--surface)]/90 px-4 py-2 text-[11.5px] text-[var(--secondary-text)] backdrop-blur"
          >
            <span className="flex items-center gap-1.5">
              <CrosshairIcon className="h-3.5 w-3.5" />
              Drag to pan
            </span>
            <span className="text-[var(--muted-stroke)]">·</span>
            <span>Scroll to zoom</span>
            <span className="text-[var(--muted-stroke)]">·</span>
            <span className="flex items-center gap-1.5">
              <MousePointerClick className="h-3.5 w-3.5" />
              Click a node to open it
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The graph dims rather than hides non-matches, so an all-dim canvas
          needs to say "nothing matched" explicitly. */}
      <AnimatePresence>
        {noMatches && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-[12px] border border-[var(--border-hairline)] bg-[var(--surface)]/95 px-6 py-5 text-center backdrop-blur"
          >
            <SearchX className="h-6 w-6 text-[var(--muted-stroke)]" />
            <p className="text-[14px] text-[var(--primary-text)]">
              No agents match your filters
            </p>
            <p className="text-[12px] text-[var(--secondary-text)]">
              Try a different search term or remove a category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                // Drop any manual pan/zoom too, so the graph re-frames to
                // the full constellation rather than staying zoomed into an
                // area that no longer has a reason to be focused.
                setManualView(null);
                onClearFilters();
              }}
              className="mt-1 rounded-[9px] border border-[var(--border-standard)] bg-[var(--surface)] px-4 py-2 text-[12.5px] text-[var(--primary-text)] transition-colors hover:bg-[var(--active-segment)]"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Legend categories={allCategories} />

      <Magnet padding={40} magnetStrength={5} className="absolute bottom-6 right-6">
        <div className="flex flex-col gap-1 rounded-[9px] border border-[var(--border-hairline)] bg-[var(--surface)] p-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-7 w-7 cursor-pointer"
            aria-label="Zoom in"
            onClick={() => nudgeZoom(0.2)}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-7 w-7 cursor-pointer"
            aria-label="Zoom out"
            onClick={() => nudgeZoom(-0.2)}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Magnet>
    </div>
  );
}
