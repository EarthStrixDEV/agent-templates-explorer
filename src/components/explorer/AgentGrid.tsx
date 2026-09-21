"use client";

import { motion } from "motion/react";
import { AgentCard } from "./AgentCard";
import { VariableProximity } from "@/components/reactbits/VariableProximity";
import type { CategoryWithAgents } from "@/lib/agents";

type AgentGridProps = {
  categories: CategoryWithAgents[];
  isMatch: (agentId: string, categoryId: string) => boolean;
  hasActiveFilter: boolean;
};

export function AgentGrid({ categories, isMatch, hasActiveFilter }: AgentGridProps) {
  const visibleCategories = categories.filter((c) => c.agents.length > 0);

  if (
    hasActiveFilter &&
    visibleCategories.every((c) => c.agents.every((a) => !isMatch(a.id, c.id)))
  ) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-center">
        <div>
          <p className="text-[14px] text-[var(--primary-text)]">ไม่พบ agent ที่ตรงกับคำค้นหา</p>
          <p className="mt-1 text-[12px] text-[var(--secondary-text)]">
            ลองปรับคำค้นหาหรือยกเลิกตัวกรองหมวดหมู่
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-10 overflow-y-auto px-6 py-8">
      {visibleCategories.map((cat) => (
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
              {cat.agents.length} agents
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
                  <AgentCard agent={agent} color={cat.color} dimmed={hasActiveFilter && !match} />
                </motion.div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
