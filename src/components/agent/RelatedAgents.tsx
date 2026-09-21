import Link from "next/link";
import { Users2, ChevronRight } from "lucide-react";
import { getCategory } from "@/lib/categories";
import type { Agent } from "@/lib/agents";

export function RelatedAgents({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) return null;

  return (
    <div className="rounded-[10px] border border-[var(--border-hairline)] bg-[var(--panel)] p-3">
      <h3 className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.4px] text-[var(--label-text)]">
        <Users2 className="h-3.5 w-3.5" />
        Related agents
      </h3>
      <ul className="space-y-1">
        {agents.map((a) => {
          const cat = getCategory(a.categoryId);
          return (
            <li key={a.id}>
              <Link
                href={`/agents/${a.categoryId}/${a.id}`}
                className="group flex items-center gap-2 rounded-[9px] px-2 py-1.5 text-[12.5px] text-[var(--body-text)] transition-colors hover:bg-[var(--surface)]"
              >
                <span
                  className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: cat?.color ?? "#7aa2f7" }}
                />
                <span className="truncate">{a.name}</span>
                <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-[var(--secondary-text)] opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
