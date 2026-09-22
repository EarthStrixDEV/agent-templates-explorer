"use client";

import { useState } from "react";
import { ExternalLink, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLATFORMS, type PlatformField, type PlatformId } from "@/lib/platforms";
import { hexToRgba, type Category } from "@/lib/categories";
import type { Agent } from "@/lib/agents";

/**
 * A single copyable field. Kept local rather than reusing CopyButton because
 * the value is the content being shown, so the copy control belongs on the
 * block's own header.
 */
function FieldBlock({ field, color }: { field: PlatformField; color: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(field.value);
      setCopied(true);
      toast.success(`Copied ${field.label.toLowerCase()}`);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy — please try again");
    }
  }

  return (
    <div className="rounded-[10px] border border-[var(--border-hairline)] bg-[var(--panel)]">
      <div className="flex items-center gap-3 border-b border-[var(--border-hairline)] px-3 py-2">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold text-[var(--primary-text)]">
            {field.label}
          </div>
          {field.hint && (
            <div className="truncate font-mono text-[10.5px] text-[var(--secondary-text)]">
              {field.hint}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="ml-auto flex shrink-0 items-center gap-1.5 rounded-[8px] border px-2.5 py-1 text-[11.5px] font-medium transition-colors"
          style={{
            borderColor: hexToRgba(color, 0.35),
            background: hexToRgba(color, 0.12),
            color,
          }}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className={
          field.short
            ? "overflow-x-auto px-3 py-2.5 font-mono text-[12px] text-[var(--body-text)]"
            : "max-h-[320px] overflow-auto whitespace-pre-wrap px-3 py-2.5 font-mono text-[12px] leading-relaxed text-[var(--code-text)]"
        }
      >
        {field.value}
      </pre>
    </div>
  );
}

export function PlatformSetup({
  agent,
  category,
}: {
  agent: Agent;
  category: Category;
}) {
  const [active, setActive] = useState<PlatformId>("chatgpt");

  return (
    <Tabs
      value={active}
      onValueChange={(v) => setActive(v as PlatformId)}
      className="space-y-5"
    >
      <TabsList className="flex-wrap bg-[var(--surface)]">
        {PLATFORMS.map((p) => (
          <TabsTrigger key={p.id} value={p.id} className="text-[12.5px]">
            {p.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {PLATFORMS.map((platform) => (
        <TabsContent key={platform.id} value={platform.id} className="space-y-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="text-[15px] font-bold text-[var(--primary-text)]">
              {platform.target}
            </h2>
            {platform.docsUrl && (
              <a
                href={platform.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[12px] text-[var(--link)] hover:underline"
              >
                {platform.docsLabel ?? "Docs"}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <ol className="space-y-2">
            {platform.steps.map((step, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-[12.5px] leading-relaxed text-[var(--body-text)]"
              >
                <span
                  className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold"
                  style={{
                    background: hexToRgba(category.color, 0.15),
                    color: category.color,
                  }}
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <div className="space-y-3">
            {platform.build(agent).map((field) => (
              <FieldBlock key={field.label} field={field} color={category.color} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
