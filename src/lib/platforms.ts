import type { Agent } from "./agents";

export type PlatformId = "chatgpt" | "claude" | "gemini" | "xai" | "other";

/** One copyable block of the finished setup — a field to paste somewhere. */
export type PlatformField = {
  label: string;
  /** Where this value goes in the platform's own UI. */
  hint?: string;
  value: string;
  /** Rendered as a short input rather than a scrollable block. */
  short?: boolean;
};

export type Platform = {
  id: PlatformId;
  label: string;
  /** What you end up with on this platform. */
  target: string;
  docsUrl?: string;
  docsLabel?: string;
  /** Manual steps the user performs in the platform's UI. */
  steps: string[];
  build: (agent: Agent) => PlatformField[];
};

/** Heading used for the framework section in the upstream core.md files. */
const FRAMEWORK_HEADING = "วิธีตอบคำถาม (Reasoning Framework)";

/**
 * The agent's instructions as one prompt body. Section headings are restored
 * because most platforms take a single free-text box, and the structure is
 * what makes these templates useful.
 */
function instructionBody(agent: Agent): string {
  const parts: string[] = [];
  const { persona, scope, framework, guardrail } = agent.sections;

  if (persona) parts.push(`## Persona\n\n${persona}`);
  if (scope) parts.push(`## Scope\n\n${scope}`);
  if (framework) parts.push(`## ${FRAMEWORK_HEADING}\n\n${framework}`);
  if (guardrail) parts.push(`## Guardrail\n\n${guardrail}`);

  // Nothing parsed cleanly — hand over the source rather than an empty box.
  if (parts.length === 0) return agent.raw.trim();

  return parts.join("\n\n");
}

/** Persona line used as a one-paragraph summary where a short field is needed. */
function shortDescription(agent: Agent): string {
  return agent.role;
}

const SOURCE_NOTE = (agent: Agent) =>
  `Source: EarthStrixDEV/agents — agents/${agent.categoryId}/${agent.id}/core.md`;

export const PLATFORMS: Platform[] = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    target: "Custom GPT",
    docsUrl: "https://help.openai.com/en/articles/8554397-creating-a-gpt",
    docsLabel: "Creating a GPT",
    steps: [
      "Open ChatGPT and go to Explore GPTs → Create.",
      "Switch to the Configure tab.",
      "Paste each field below into its matching box.",
      "Leave Web Search / Code Interpreter on only if this agent needs them.",
      "Save, then choose who can access the GPT.",
    ],
    build: (agent) => [
      { label: "Name", hint: "Configure → Name", value: agent.name, short: true },
      {
        label: "Description",
        hint: "Configure → Description",
        value: shortDescription(agent),
        short: true,
      },
      {
        label: "Instructions",
        hint: "Configure → Instructions",
        value: `${instructionBody(agent)}\n\n---\n${SOURCE_NOTE(agent)}`,
      },
    ],
  },
  {
    id: "claude",
    label: "Claude",
    target: "Project",
    docsUrl: "https://support.anthropic.com/en/articles/9517075-what-are-projects",
    docsLabel: "What are Projects",
    steps: [
      "In Claude, create a new Project.",
      "Name it, then open Set project instructions.",
      "Paste the instructions below and save.",
      "Optionally add reference files to the project's knowledge.",
    ],
    build: (agent) => [
      { label: "Project name", value: agent.name, short: true },
      {
        label: "Project instructions",
        hint: "Project → Set project instructions",
        value: `${instructionBody(agent)}\n\n---\n${SOURCE_NOTE(agent)}`,
      },
    ],
  },
  {
    id: "gemini",
    label: "Gemini",
    target: "Gem",
    docsUrl: "https://support.google.com/gemini/answer/15235603",
    docsLabel: "Create a Gem",
    steps: [
      "Open Gemini and go to Gem manager → New Gem.",
      "Fill in the name, then paste the instructions.",
      "Preview the Gem to check it responds in character.",
      "Save.",
    ],
    build: (agent) => [
      { label: "Gem name", value: agent.name, short: true },
      {
        label: "Instructions",
        hint: "Gem → Instructions",
        value: `${instructionBody(agent)}\n\n---\n${SOURCE_NOTE(agent)}`,
      },
    ],
  },
  {
    id: "xai",
    label: "xAI",
    target: "Grok system prompt",
    docsUrl: "https://docs.x.ai/docs/guides/chat",
    docsLabel: "xAI chat guide",
    steps: [
      "Use this as the system message on a chat completion request.",
      "Send the user's question as the following user message.",
      "Keep the system message on every request in the conversation.",
    ],
    build: (agent) => [
      {
        label: "System prompt",
        hint: "messages[0] with role: \"system\"",
        value: `${instructionBody(agent)}\n\n---\n${SOURCE_NOTE(agent)}`,
      },
      {
        label: "Request body",
        hint: "POST https://api.x.ai/v1/chat/completions",
        value: JSON.stringify(
          {
            model: "grok-4",
            messages: [
              { role: "system", content: instructionBody(agent) },
              { role: "user", content: "<your question here>" },
            ],
          },
          null,
          2
        ),
      },
    ],
  },
  {
    id: "other",
    label: "Other",
    target: "Plain system prompt",
    steps: [
      "Paste the system prompt wherever the platform accepts one.",
      "If it only offers a single prompt box, prepend it to the user's question.",
      "If it supports files, the raw core.md below can be attached instead.",
    ],
    build: (agent) => [
      {
        label: "System prompt",
        hint: "Any platform that accepts a system or custom instruction",
        value: `${instructionBody(agent)}\n\n---\n${SOURCE_NOTE(agent)}`,
      },
      {
        label: "Raw core.md",
        hint: "The unmodified source file",
        value: agent.raw,
      },
    ],
  },
];

export function getPlatform(id: string): Platform | undefined {
  return PLATFORMS.find((p) => p.id === id);
}
