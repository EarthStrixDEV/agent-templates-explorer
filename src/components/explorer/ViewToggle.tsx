"use client";

import { cn } from "@/lib/utils";

export type ExplorerView = "graph" | "list";

type ViewToggleProps = {
  view: ExplorerView;
  onChange: (view: ExplorerView) => void;
};

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-[9px] border border-[var(--border-standard)] bg-[var(--surface)] p-1">
      {(["graph", "list"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            "rounded-[7px] px-3 py-1.5 text-[12.5px] font-medium capitalize transition-colors",
            view === v
              ? "bg-[var(--active-segment)] text-[var(--primary-text)]"
              : "text-[var(--secondary-text)] hover:text-[var(--label-text)]"
          )}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
