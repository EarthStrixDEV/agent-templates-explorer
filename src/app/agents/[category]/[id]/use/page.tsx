import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PlatformSetup } from "@/components/agent/PlatformSetup";
import { UseTemplateBackLink } from "@/components/agent/UseTemplateBackLink";
import { getAgent, getAllAgents } from "@/lib/agents";
import { getCategory, hexToRgba } from "@/lib/categories";

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
    title: `Use ${agent.name} — Agent Templates Explorer`,
    description: `Set up ${agent.name} on ChatGPT, Claude, Gemini, xAI or any other platform.`,
  };
}

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  const letters = parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
  return letters.slice(0, 3) || name.slice(0, 2).toUpperCase();
}

export default async function UseTemplatePage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  const agent = getAgent(category, id);
  const cat = getCategory(category);

  if (!agent || !cat) notFound();

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center gap-3 border-b border-[var(--border-hairline)] px-7 py-4">
        <Suspense
          fallback={
            <Link
              href={`/agents/${agent.categoryId}/${agent.id}`}
              className="flex items-center gap-1.5 text-[12.5px] text-[var(--secondary-text)] transition-colors hover:text-[var(--primary-text)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to agent
            </Link>
          }
        >
          <UseTemplateBackLink agent={agent} />
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
          <Link
            href={`/agents/${agent.categoryId}/${agent.id}`}
            className="font-mono transition-colors hover:text-[var(--primary-text)]"
          >
            {agent.id}
          </Link>
          {" / use"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[860px] px-6 py-8 md:px-10">
          <div className="mb-7 flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] text-[14px] font-bold"
              style={{
                background: hexToRgba(cat.color, 0.15),
                color: cat.color,
                border: `1px solid ${hexToRgba(cat.color, 0.35)}`,
              }}
            >
              {initials(agent.name)}
            </div>
            <div>
              <h1 className="text-[22px] font-extrabold text-[var(--primary-text)]">
                Use {agent.name}
              </h1>
              <p className="mt-1 max-w-[560px] text-[13px] leading-relaxed text-[var(--secondary-text)]">
                Pick your platform, then copy each field into its matching box.
              </p>
            </div>
          </div>

          <PlatformSetup agent={agent} category={cat} />
        </div>
      </div>
    </div>
  );
}
