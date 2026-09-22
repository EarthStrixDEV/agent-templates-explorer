import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { BackLink } from "@/components/agent/BackLink";
import { CoreMdTabs } from "@/components/agent/CoreMdTabs";
import { MiniMap } from "@/components/agent/MiniMap";
import { RelatedAgents } from "@/components/agent/RelatedAgents";
import { DecryptedText } from "@/components/reactbits/DecryptedText";
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
        <Suspense
          fallback={<span className="text-[12.5px] text-[var(--secondary-text)]">Back</span>}
        >
          <BackLink />
        </Suspense>
        <span className="text-[12px] text-[var(--faint-label)]">
          <Link
            href="/?view=list"
            className="transition-colors hover:text-[var(--primary-text)]"
          >
            Agent Templates
          </Link>
          {" / "}
          <Link
            href={`/?view=list&cat=${cat.id}`}
            className="transition-colors hover:text-[var(--primary-text)]"
          >
            {cat.label}
          </Link>
          {" / "}
          <DecryptedText text={agent.id} animateOn="view" speed={25} />
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
            <Suspense fallback={null}>
              <RelatedAgents agents={related} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
