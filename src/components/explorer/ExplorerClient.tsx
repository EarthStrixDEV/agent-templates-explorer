"use client";

import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Header } from "./Header";
import { AgentGrid } from "./AgentGrid";
import { RadialGraph } from "./RadialGraph";
import type { ExplorerView } from "./ViewToggle";
import { CATEGORIES } from "@/lib/categories";
import { matchesAgent } from "@/lib/search";
import type { CategoryWithAgents } from "@/lib/agents";

type ExplorerClientProps = {
  categories: CategoryWithAgents[];
  totalAgents: number;
};

export function ExplorerClient({ categories, totalAgents }: ExplorerClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const activeCats = useMemo(
    () => (searchParams.get("cat") ? searchParams.get("cat")!.split(",").filter(Boolean) : []),
    [searchParams]
  );
  const view = (searchParams.get("view") as ExplorerView) || "graph";

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleSearchChange = useCallback((v: string) => setParam("q", v), [setParam]);

  const handleToggleCategory = useCallback(
    (id: string) => {
      const next = activeCats.includes(id)
        ? activeCats.filter((c) => c !== id)
        : [...activeCats, id];
      setParam("cat", next.join(","));
    },
    [activeCats, setParam]
  );

  const handleViewChange = useCallback((v: ExplorerView) => setParam("view", v), [setParam]);

  const isMatch = useCallback(
    (agentId: string, categoryId: string) => {
      const catMatch = activeCats.length === 0 || activeCats.includes(categoryId);
      if (!catMatch) return false;
      if (!search) return true;
      const agent = categories
        .find((c) => c.id === categoryId)
        ?.agents.find((a) => a.id === agentId);
      const catLabel = categories.find((c) => c.id === categoryId)?.label ?? "";
      return agent ? matchesAgent(agent, search, catLabel) : false;
    },
    [activeCats, categories, search]
  );

  const hasActiveFilter = search.length > 0 || activeCats.length > 0;

  return (
    <div className="flex h-screen flex-col">
      <Header
        categories={CATEGORIES}
        search={search}
        onSearchChange={handleSearchChange}
        activeCats={activeCats}
        onToggleCategory={handleToggleCategory}
        view={view}
        onViewChange={handleViewChange}
        totalAgents={totalAgents}
        totalCats={CATEGORIES.length}
      />

      <AnimatePresence mode="wait">
        {view === "graph" ? (
          <motion.div
            key="graph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-1"
          >
            <RadialGraph
              categories={categories}
              allCategories={CATEGORIES}
              isMatch={isMatch}
              hasActiveFilter={hasActiveFilter}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-1 overflow-hidden"
          >
            <AgentGrid
              categories={categories}
              isMatch={isMatch}
              hasActiveFilter={hasActiveFilter}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
