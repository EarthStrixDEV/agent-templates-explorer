import fs from "node:fs";
import path from "node:path";
import { CATEGORIES } from "./categories";

const CONTENT_DIR = path.join(process.cwd(), "content", "agents");

export type AgentSections = {
  persona?: string;
  scope?: string;
  framework?: string;
  guardrail?: string;
};

export type Agent = {
  id: string;
  categoryId: string;
  name: string;
  role: string;
  tags: string[];
  sections: AgentSections;
  raw: string;
};

type IndexEntry = {
  id: string;
  categoryId: string;
  name: string;
  role: string;
};

let cachedAgents: Agent[] | null = null;

function readIndex(): IndexEntry[] {
  const indexPath = path.join(CONTENT_DIR, "index.json");
  const raw = fs.readFileSync(indexPath, "utf-8");
  return JSON.parse(raw) as IndexEntry[];
}

/**
 * Split core.md into named sections keyed by their H2 heading.
 * Headings observed in this repo's core.md files:
 *   ## Persona
 *   ## Scope ความเชี่ยวชาญ
 *   ## วิธีตอบคำถาม (Reasoning Framework)
 *   ## Guardrail
 */
function parseSections(markdown: string): AgentSections {
  const lines = markdown.split("\n");
  const sections: Record<string, string[]> = {};
  let current: string | null = null;

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      const heading = h2[1].trim();
      if (/^persona/i.test(heading)) current = "persona";
      else if (/^scope/i.test(heading)) current = "scope";
      else if (/reasoning framework|วิธีตอบคำถาม/i.test(heading)) current = "framework";
      else if (/^guardrail/i.test(heading)) current = "guardrail";
      else current = null;
      if (current) sections[current] = [];
      continue;
    }
    if (current) {
      sections[current].push(line);
    }
  }

  const trim = (arr?: string[]) => (arr ? arr.join("\n").trim() : undefined);

  return {
    persona: trim(sections.persona),
    scope: trim(sections.scope),
    framework: trim(sections.framework),
    guardrail: trim(sections.guardrail),
  };
}

function extractTags(role: string): string[] {
  // Roles look like "ERP ไม่ผูกยี่ห้อ: system selection, implementation lifecycle, ..."
  // Take the part after the last colon (if any), split on commas/slashes, trim, take first 3.
  const afterColon = role.includes(":") ? role.split(":").slice(1).join(":") : role;
  return afterColon
    .split(/[,\/]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function loadAgents(): Agent[] {
  if (cachedAgents) return cachedAgents;

  const index = readIndex();
  const agents: Agent[] = index.map((entry) => {
    const filePath = path.join(CONTENT_DIR, entry.categoryId, entry.id, "core.md");
    const raw = fs.readFileSync(filePath, "utf-8");
    return {
      id: entry.id,
      categoryId: entry.categoryId,
      name: entry.name,
      role: entry.role,
      tags: extractTags(entry.role),
      sections: parseSections(raw),
      raw,
    };
  });

  cachedAgents = agents;
  return agents;
}

export function getAllAgents(): Agent[] {
  return loadAgents();
}

export function getAgent(categoryId: string, id: string): Agent | undefined {
  return loadAgents().find((a) => a.categoryId === categoryId && a.id === id);
}

export function getAgentsByCategory(categoryId: string): Agent[] {
  return loadAgents().filter((a) => a.categoryId === categoryId);
}

export type CategoryWithAgents = {
  id: string;
  label: string;
  color: string;
  description: string;
  agents: Agent[];
};

export function getCategoriesWithAgents(): CategoryWithAgents[] {
  const agents = loadAgents();
  return CATEGORIES.map((cat) => ({
    ...cat,
    agents: agents.filter((a) => a.categoryId === cat.id),
  }));
}

/**
 * Words too generic to signal that two agents are actually related.
 * Without this, boilerplate like "และ" or "design" matches almost everything.
 */
const STOPWORDS = new Set([
  "และ", "หรือ", "ที่", "การ", "ของ", "ให้", "เป็น", "ไม่", "ใน", "กับ", "จาก",
  "ระดับ", "แบบ", "ด้วย", "ตาม", "เพื่อ", "ต้อง", "มี", "ทำ", "ได้",
  "and", "or", "the", "for", "with", "from", "into", "per", "via",
]);

/** Split a blob of text into comparable keyword tokens. */
function keywords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/**
 * Vocabulary that characterises an agent: its explicit tags plus the
 * meaningful words in its name and role.
 *
 * Tags alone are too sparse to rank with — they're derived by slicing the
 * role string, so most agents end up with phrases nobody else shares.
 */
function agentVocabulary(agent: Agent): Set<string> {
  return new Set([
    ...agent.tags.flatMap(keywords),
    ...keywords(agent.name),
    ...keywords(agent.role),
  ]);
}

/**
 * Score how related another agent is to `agent`: shared vocabulary dominates,
 * with a small bonus for sharing a category, so agents that genuinely overlap
 * in subject matter rank above arbitrary same-category neighbours.
 */
function relatednessScore(own: Set<string>, agent: Agent, other: Agent): number {
  const otherVocab = agentVocabulary(other);
  let shared = 0;
  for (const word of otherVocab) {
    if (own.has(word)) shared += 1;
  }
  const sameCategory = other.categoryId === agent.categoryId ? 1 : 0;
  return shared * 10 + sameCategory;
}

/** Related agents, ranked by shared vocabulary then by shared category. */
export function getRelatedAgents(agent: Agent, count = 3): Agent[] {
  const own = agentVocabulary(agent);
  return loadAgents()
    .filter((a) => a.id !== agent.id)
    .map((a) => ({ agent: a, score: relatednessScore(own, agent, a) }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) => b.score - a.score || a.agent.name.localeCompare(b.agent.name)
    )
    .slice(0, count)
    .map((entry) => entry.agent);
}
