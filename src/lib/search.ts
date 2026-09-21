import type { Agent } from "./agents";

export function matchesAgent(agent: Agent, query: string, categoryLabel: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    agent.name.toLowerCase().includes(q) ||
    agent.role.toLowerCase().includes(q) ||
    agent.tags.some((t) => t.toLowerCase().includes(q)) ||
    categoryLabel.toLowerCase().includes(q)
  );
}
