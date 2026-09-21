import { hexToRgba, CATEGORIES } from "@/lib/categories";
import { computeGraphLayout, VIEWBOX_W, VIEWBOX_H } from "@/lib/graph-layout";
import type { CategoryWithAgents } from "@/lib/agents";

type MiniMapProps = {
  categories: CategoryWithAgents[];
  selectedId: string;
};

export function MiniMap({ categories, selectedId }: MiniMapProps) {
  const { zones, agents } = computeGraphLayout(categories);
  const selected = agents.find((a) => a.id === selectedId);

  return (
    <div className="rounded-[10px] border border-[var(--border-hairline)] bg-[var(--panel)] p-3">
      <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-[0.4px] text-[var(--label-text)]">
        Position in graph
      </h3>
      <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} className="h-[120px] w-full">
        {zones.map((z) => {
          const isSelectedZone = selected?.categoryId === z.id;
          return (
            <circle
              key={z.id}
              cx={z.x}
              cy={z.y}
              r={z.radius}
              fill="none"
              stroke={z.color}
              strokeOpacity={isSelectedZone ? 0.9 : 0.35}
              strokeWidth={2}
            />
          );
        })}
        {selected && (
          <circle
            cx={selected.x}
            cy={selected.y}
            r={16}
            fill={
              CATEGORIES.find((c) => c.id === selected.categoryId)?.color
                ? hexToRgba(CATEGORIES.find((c) => c.id === selected.categoryId)!.color, 1)
                : "#7aa2f7"
            }
            stroke="#ffffff"
            strokeWidth={2}
          />
        )}
      </svg>
    </div>
  );
}
