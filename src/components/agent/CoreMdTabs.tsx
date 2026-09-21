"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { UserCircle, Compass, Workflow, ShieldCheck, FileCode, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ElectricBorder } from "@/components/reactbits/ElectricBorder";
import type { Agent } from "@/lib/agents";

const TAB_DEFS: { key: keyof Agent["sections"]; label: string; icon: typeof UserCircle }[] = [
  { key: "persona", label: "Persona", icon: UserCircle },
  { key: "scope", label: "Scope", icon: Compass },
  { key: "framework", label: "Framework", icon: Workflow },
  { key: "guardrail", label: "Guardrail", icon: ShieldCheck },
];

function Markdown({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none prose-headings:font-semibold prose-headings:text-[var(--primary-text)] prose-p:text-[var(--body-text)] prose-li:text-[var(--body-text)] prose-strong:text-[var(--primary-text)] prose-code:text-[var(--code-text)] prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

export function CoreMdTabs({ agent }: { agent: Agent }) {
  const availableTabs = TAB_DEFS.filter((t) => agent.sections[t.key]);
  const defaultTab = availableTabs[0]?.key ?? "raw";

  return (
    <ElectricBorder color="#7aa2f7" speed={0.6} borderRadius={12}>
      <div className="rounded-[12px] border border-[var(--border-hairline)] bg-[var(--panel)]">
        <div className="flex items-center gap-1.5 border-b border-[var(--border-hairline)] px-4 py-2.5 font-mono text-[11px] text-[var(--secondary-text)]">
          <FileCode className="h-3.5 w-3.5" />
          {agent.categoryId}/{agent.id}/core.md
        </div>
        <Tabs defaultValue={defaultTab} className="p-4">
          <TabsList className="mb-3 bg-[var(--surface)]">
            {availableTabs.map((t) => (
              <TabsTrigger key={t.key} value={t.key} className="gap-1.5 text-[12.5px]">
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </TabsTrigger>
            ))}
            <TabsTrigger value="raw" className="gap-1.5 text-[12.5px]">
              <FileText className="h-3.5 w-3.5" />
              Raw
            </TabsTrigger>
          </TabsList>

          {availableTabs.map((t) => (
            <TabsContent key={t.key} value={t.key} className="max-h-[420px] overflow-auto">
              <Markdown content={agent.sections[t.key] ?? ""} />
            </TabsContent>
          ))}

          <TabsContent value="raw" className="max-h-[420px] overflow-auto">
            <pre className="whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed text-[var(--code-text)]">
              {agent.raw}
            </pre>
          </TabsContent>
        </Tabs>
      </div>
    </ElectricBorder>
  );
}
