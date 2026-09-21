"use client";

import { Network, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export type ExplorerView = "graph" | "list";

type ViewToggleProps = {
  view: ExplorerView;
  onChange: (view: ExplorerView) => void;
};

const VIEW_ICONS: Record<ExplorerView, typeof Network> = {
  graph: Network,
  list: LayoutGrid,
};

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-[9px] border border-[var(--border-standard)] bg-[var(--surface)] p-1">
      {(["graph", "list"] as const).map((v) => {
        const Icon = VIEW_ICONS[v];
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={cn(
              "flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[12.5px] font-medium capitalize transition-colors",
              view === v
                ? "bg-[var(--active-segment)] text-[var(--primary-text)]"
                : "text-[var(--secondary-text)] hover:text-[var(--label-text)]"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {v}
          </button>
        );
      })}
    </div>
  );
}
