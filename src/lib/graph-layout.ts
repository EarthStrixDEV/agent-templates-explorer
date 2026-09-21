import type { CategoryWithAgents } from "./agents";

export const VIEWBOX_W = 1600;
export const VIEWBOX_H = 1000;
export const HUB_X = VIEWBOX_W / 2;
export const HUB_Y = VIEWBOX_H / 2;
export const ORBIT_RADIUS = 330;

export type LaidOutAgent = {
  id: string;
  categoryId: string;
  name: string;
  short: string;
  x: number;
  y: number;
};

export type LaidOutZone = {
  id: string;
  label: string;
  color: string;
  count: number;
  x: number;
  y: number;
  radius: number;
  angle: number;
};

export type GraphLayout = {
  zones: LaidOutZone[];
  agents: LaidOutAgent[];
};

/** Round to a fixed precision so server- and client-rendered SVG attribute
 * strings serialize identically (raw floats can differ in their last digit
 * between V8 builds, which trips a React hydration mismatch). */
function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  const letters = parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
  return letters.slice(0, 3) || name.slice(0, 2).toUpperCase();
}

/**
 * Lay out every category as a zone on an orbit around the hub, and every
 * agent inside its zone on concentric rings (so all agents render as real
 * nodes rather than a fake "+N more" placeholder).
 */
export function computeGraphLayout(categories: CategoryWithAgents[]): GraphLayout {
  const n = categories.length;
  const zones: LaidOutZone[] = [];
  const agents: LaidOutAgent[] = [];

  categories.forEach((cat, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const count = cat.agents.length;
    const zoneRadius = 105 + Math.min(count, 24) * 5.2;
    const zx = HUB_X + Math.cos(angle) * ORBIT_RADIUS;
    const zy = HUB_Y + Math.sin(angle) * ORBIT_RADIUS;

    zones.push({
      id: cat.id,
      label: cat.label,
      color: cat.color,
      count,
      x: round(zx),
      y: round(zy),
      radius: round(zoneRadius),
      angle: round(angle),
    });

    // Place agents on concentric rings inside the zone circle so the graph
    // scales to any count without relying on a fake overflow node.
    const perRing = 8;
    const ringGap = zoneRadius / Math.max(1, Math.ceil(count / perRing) + 0.5);

    cat.agents.forEach((agent, j) => {
      const ring = Math.floor(j / perRing);
      const posInRing = j % perRing;
      const ringCount = Math.min(perRing, count - ring * perRing);
      const ringRadius = ringGap * (ring + 1) * 0.85;
      const a =
        angle +
        (posInRing / Math.max(1, ringCount)) * Math.PI * 2 +
        ring * 0.35;

      agents.push({
        id: agent.id,
        categoryId: agent.categoryId,
        name: agent.name,
        short: initials(agent.name),
        x: round(zx + Math.cos(a) * ringRadius),
        y: round(zy + Math.sin(a) * ringRadius),
      });
    });
  });

  return { zones, agents };
}

export function toPercent(value: number, axis: "x" | "y"): number {
  return (value / (axis === "x" ? VIEWBOX_W : VIEWBOX_H)) * 100;
}
