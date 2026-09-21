import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { CoreMdTabs } from "@/components/agent/CoreMdTabs";
import { MiniMap } from "@/components/agent/MiniMap";
import { RelatedAgents } from "@/components/agent/RelatedAgents";
import { getAgent, getAllAgents, getCategoriesWithAgents, getRelatedAgents } from "@/lib/agents";
import { getCategory } from "@/lib/categories";

export function generateStaticParams() {
  return getAllAgents().map((a) => ({ category: a.categoryId, id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  const agent = getAgent(category, id);
  if (!agent) return { title: "Agent not found" };
  return {
    title: `${agent.name} — Agent Templates Explorer`,
    description: agent.role,
  };
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  const agent = getAgent(category, id);
  const cat = getCategory(category);

  if (!agent || !cat) notFound();

  const related = getRelatedAgents(agent);
  const categories = getCategoriesWithAgents();

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center gap-3 border-b border-[var(--border-hairline)] px-7 py-4">
        <Link
          href="/?view=graph"
          className="flex items-center gap-1.5 text-[12.5px] text-[var(--secondary-text)] transition-colors hover:text-[var(--primary-text)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to graph
        </Link>
        <span className="text-[12px] text-[var(--faint-label)]">
          Agent Templates / {cat.label} / {agent.id}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-8 px-6 py-8 md:px-10 md:py-8 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
          <div className="space-y-6">
            <AgentHeader agent={agent} category={cat} />
            <CoreMdTabs agent={agent} />
          </div>

          <div className="space-y-4">
            <MiniMap categories={categories} selectedId={agent.id} />
            <RelatedAgents agents={related} />
          </div>
        </div>
      </div>
    </div>
  );
}
