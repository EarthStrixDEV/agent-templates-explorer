"use client";

import { useState, type WheelEvent } from "react";
import { motion } from "motion/react";
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
import { Plus, Minus } from "lucide-react";

type RadialGraphProps = {
  categories: CategoryWithAgents[];
  allCategories: Category[];
  isMatch: (agentId: string, categoryId: string) => boolean;
  hasActiveFilter: boolean;
};

export function RadialGraph({
  categories,
  allCategories,
  isMatch,
  hasActiveFilter,
}: RadialGraphProps) {
  const router = useRouter();
  const { zones, agents } = computeGraphLayout(categories);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  function handleWheel(e: WheelEvent<HTMLDivElement>) {
    e.preventDefault();
    setZoom((z) => Math.min(2.5, Math.max(0.5, z - e.deltaY * 0.001)));
  }

  function zoneDimmed(zoneId: string) {
    if (!hasActiveFilter) return false;
    const zoneAgents = categories.find((c) => c.id === zoneId)?.agents ?? [];
    return zoneAgents.every((a) => !isMatch(a.id, zoneId));
  }

  return (
    <Crosshair color="#7aa2f7" className="relative flex-1 overflow-hidden" >
    <div className="absolute inset-0" style={{ minHeight: 560 }}>
      <Noise opacity={0.02} />
      <ClickSpark sparkColor="#7aa2f7" sparkCount={10} className="absolute inset-0">
      <motion.div
        drag
        dragMomentum={false}
        onDragEnd={(_, info) => {
          setPan((p) => ({ x: p.x + info.offset.x, y: p.y + info.offset.y }));
        }}
        onWheel={handleWheel}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{
          x: pan.x,
          y: pan.y,
        }}
      >
        <motion.div
          animate={{ scale: zoom }}
          transition={{ type: "tween", duration: 0.15 }}
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
              const dim = hasActiveFilter && !isMatch(a.id, a.categoryId);

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
                  onClick={() => router.push(`/agents/${a.categoryId}/${a.id}`)}
                  style={{ cursor: "pointer", originX: `${a.x}px`, originY: `${a.y}px` }}
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

      <Legend categories={allCategories} />

      <Magnet
        padding={40}
        magnetStrength={5}
        className="absolute bottom-6 right-6"
      >
        <div className="flex flex-col gap-1 rounded-[9px] border border-[var(--border-hairline)] bg-[var(--surface)] p-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Magnet>
    </div>
    </Crosshair>
  );
}
