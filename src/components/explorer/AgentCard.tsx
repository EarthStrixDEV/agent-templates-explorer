"use client";

import Link from "next/link";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { GlareHover } from "@/components/reactbits/GlareHover";
import { TiltedCard } from "@/components/reactbits/TiltedCard";
import { hexToRgba } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { Agent } from "@/lib/agents";

type AgentCardProps = {
  agent: Agent;
  color: string;
  dimmed?: boolean;
};

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  const letters = parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
  return letters.slice(0, 3) || name.slice(0, 2).toUpperCase();
}

export function AgentCard({ agent, color, dimmed }: AgentCardProps) {
  return (
    <Link href={`/agents/${agent.categoryId}/${agent.id}`} className="block">
      <TiltedCard maxTilt={5} scaleOnHover={1.015}>
        <GlareHover className="rounded-[9px]" glareOpacity={0.1}>
          <SpotlightCard
            spotlightColor={hexToRgba(color, 0.16)}
            className={cn(
              "h-full p-4 transition-opacity",
              dimmed && "opacity-30"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-[11px] font-bold"
                style={{
                  background: hexToRgba(color, 0.15),
                  color,
                  border: `1px solid ${hexToRgba(color, 0.35)}`,
                }}
              >
                {initials(agent.name)}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-[14px] font-semibold text-[var(--primary-text)]">
                  {agent.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-[var(--secondary-text)]">
                  {agent.role}
                </p>
              </div>
            </div>
            {agent.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {agent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[14px] px-[9px] py-[2px] text-[10.5px] text-[var(--label-text)]"
                    style={{ background: "var(--panel)", border: "1px solid var(--border-hairline)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </SpotlightCard>
        </GlareHover>
      </TiltedCard>
    </Link>
  );
}
