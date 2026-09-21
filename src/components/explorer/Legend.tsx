import { Palette } from "lucide-react";
import { MagicBento } from "@/components/reactbits/MagicBento";
import type { Category } from "@/lib/categories";

export function Legend({ categories }: { categories: Category[] }) {
  return (
    <MagicBento className="absolute bottom-6 left-6 rounded-[10px] border border-[var(--border-hairline)] bg-[var(--surface)] p-4 shadow-[0_8px_24px_rgba(0,0,0,.4)]">
      <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.4px] text-[var(--label-text)]">
        <Palette className="h-3 w-3" />
        Categories
      </h3>
      <ul className="space-y-1.5">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center gap-2 text-[11px] text-[var(--body-text)]">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: c.color }}
            />
            {c.label}
          </li>
        ))}
      </ul>
    </MagicBento>
  );
}
