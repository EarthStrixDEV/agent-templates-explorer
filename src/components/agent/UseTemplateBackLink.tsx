"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Agent } from "@/lib/agents";

/**
 * Returns to the agent's detail page, carrying `?from=` through so the
 * explorer state survives the whole chain (explorer → agent → use → back).
 *
 * Read client-side to keep this route statically generated — adding
 * `searchParams` to the page would opt all 77 pages into dynamic rendering.
 */
export function UseTemplateBackLink({ agent }: { agent: Agent }) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const suffix =
    from && from.startsWith("/") && !from.startsWith("//")
      ? `?from=${encodeURIComponent(from)}`
      : "";

  return (
    <Link
      href={`/agents/${agent.categoryId}/${agent.id}${suffix}`}
      className="flex items-center gap-1.5 text-[12.5px] text-[var(--secondary-text)] transition-colors hover:text-[var(--primary-text)]"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back to agent
    </Link>
  );
}
