import { Suspense } from "react";
import { ExplorerClient } from "@/components/explorer/ExplorerClient";
import { getAllAgents, getCategoriesWithAgents } from "@/lib/agents";

export default function Home() {
  const categories = getCategoriesWithAgents();
  const totalAgents = getAllAgents().length;

  return (
    <Suspense fallback={null}>
      <ExplorerClient categories={categories} totalAgents={totalAgents} />
    </Suspense>
  );
}
