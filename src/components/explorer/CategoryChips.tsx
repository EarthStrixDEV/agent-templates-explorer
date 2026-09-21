"use client";

import { hexToRgba, type Category } from "@/lib/categories";
import { cn } from "@/lib/utils";

type CategoryChipsProps = {
  categories: Category[];
  activeCats: string[];
  onToggle: (id: string) => void;
};

export function CategoryChips({ categories, activeCats, onToggle }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((c) => {
        const active = activeCats.includes(c.id);
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onToggle(c.id)}
            className={cn(
              "rounded-[16px] border px-[11px] py-[6px] text-[11.5px] font-medium transition-colors"
            )}
            style={{
              borderColor: active ? c.color : "var(--border-standard)",
              background: active ? hexToRgba(c.color, 0.15) : "transparent",
              color: active ? c.color : "var(--label-text)",
            }}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
