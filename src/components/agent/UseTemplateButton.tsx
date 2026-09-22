"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { Agent } from "@/lib/agents";

/**
 * Links to the platform setup page, preserving the explorer's `?from=` so the
 * back chain (explorer → agent → use) stays intact.
 */
export function UseTemplateButton({
  agent,
  color,
}: {
  agent: Agent;
  color: string;
}) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const suffix =
    from && from.startsWith("/") && !from.startsWith("//")
      ? `?from=${encodeURIComponent(from)}`
      : "";

  return (
    <Link
      href={`/agents/${agent.categoryId}/${agent.id}/use${suffix}`}
      className="flex items-center gap-1.5 rounded-[9px] px-3 py-2 text-[12.5px] font-bold transition-opacity hover:opacity-90"
      style={{ background: color, color: "#0b0f17" }}
    >
      <Sparkles className="h-3.5 w-3.5" />
      Use template
    </Link>
  );
}
