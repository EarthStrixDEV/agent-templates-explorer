"use client";

import { motion } from "motion/react";
import { SearchX } from "lucide-react";
import { AgentCard } from "./AgentCard";
import { VariableProximity } from "@/components/reactbits/VariableProximity";
import type { CategoryWithAgents } from "@/lib/agents";

type AgentGridProps = {
  categories: CategoryWithAgents[];
  isMatch: (agentId: string, categoryId: string) => boolean;
  hasActiveFilter: boolean;
  returnTo: string;
  onClearFilters: () => void;
};

export function AgentGrid({
  categories,
  isMatch,
  hasActiveFilter,
  returnTo,
  onClearFilters,
}: AgentGridProps) {
  const visibleCategories = categories.filter((c) => c.agents.length > 0);

  if (
    hasActiveFilter &&
    visibleCategories.every((c) => c.agents.every((a) => !isMatch(a.id, c.id)))
  ) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-center">
        <div className="flex flex-col items-center gap-2">
          <SearchX className="h-6 w-6 text-[var(--muted-stroke)]" />
          <p className="text-[14px] text-[var(--primary-text)]">No agents match your filters</p>
          <p className="text-[12px] text-[var(--secondary-text)]">
            Try a different search term or remove a category filter.
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-2 rounded-[9px] border border-[var(--border-standard)] bg-[var(--surface)] px-4 py-2 text-[12.5px] text-[var(--primary-text)] transition-colors hover:bg-[var(--active-segment)]"
          >
            Clear filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-10 overflow-y-auto px-6 py-8">
      {visibleCategories.map((cat) => {
        const matchCount = cat.agents.filter((a) => isMatch(a.id, cat.id)).length;
        return (
          <section key={cat.id}>
            <div className="mb-4 flex items-baseline gap-2">
              <h2 style={{ color: cat.color }}>
                <VariableProximity
                  text={cat.label.toUpperCase()}
                  className="text-[12px] font-bold tracking-[0.4px]"
                  radius={70}
                />
              </h2>
              <span className="text-[11px] text-[var(--secondary-text)]">
                {hasActiveFilter
                  ? `${matchCount} of ${cat.agents.length} agents`
                  : `${cat.agents.length} agents`}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cat.agents.map((agent) => {
                const match = isMatch(agent.id, cat.id);
                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AgentCard
                      agent={agent}
                      color={cat.color}
                      dimmed={hasActiveFilter && !match}
                      returnTo={returnTo}
                    />
                  </motion.div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
