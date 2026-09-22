import { Tag } from "lucide-react";
import { hexToRgba, type Category } from "@/lib/categories";
import { GradientText } from "@/components/reactbits/GradientText";
import { BlurText } from "@/components/reactbits/BlurText";
import { StarBorder } from "@/components/reactbits/StarBorder";
import { FadeContent } from "@/components/reactbits/FadeContent";
import { CopyButton } from "./CopyButton";
import type { Agent } from "@/lib/agents";

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  const letters = parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
  return letters.slice(0, 3) || name.slice(0, 2).toUpperCase();
}

export function AgentHeader({ agent, category }: { agent: Agent; category: Category }) {
  const filePath = `agents/${agent.categoryId}/${agent.id}/core.md`;

  return (
    <FadeContent duration={0.4}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] text-[16px] font-bold"
            style={{
              background: hexToRgba(category.color, 0.15),
              color: category.color,
              border: `1px solid ${hexToRgba(category.color, 0.35)}`,
            }}
          >
            {initials(agent.name)}
          </div>
          <div>
            <GradientText
              colors={[category.color, "#e6edf3", category.color]}
              animationSpeed={7}
              className="text-[24px] font-extrabold"
            >
              {agent.name}
            </GradientText>
            <BlurText
              text={agent.role}
              className="mt-1 max-w-[560px] text-[13px] leading-relaxed text-[var(--secondary-text)]"
            />
          </div>
        </div>

        {agent.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {agent.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-[14px] px-[11px] py-[4px] text-[11.5px] text-[var(--label-text)]"
                style={{ background: "var(--panel)", border: "1px solid var(--border-hairline)" }}
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <StarBorder color={category.color} speed="4s">
            <CopyButton
              text={agent.raw}
              label="Copy core.md"
              toastMessage="Copied core.md"
              variant="default"
              className="border-0 bg-transparent font-bold hover:bg-transparent hover:opacity-90"
              style={{ color: category.color }}
            />
          </StarBorder>
          <CopyButton text={filePath} label="Copy path" toastMessage="Copied file path" />
        </div>
      </div>
    </FadeContent>
  );
}
