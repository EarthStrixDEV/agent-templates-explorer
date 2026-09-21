/**
 * Sync agent core.md files + README metadata from EarthStrixDEV/agents (branch: master)
 * into content/agents/ as a committed static snapshot.
 *
 * Usage: pnpm sync-agents
 * Optional: set GITHUB_TOKEN env var to raise GitHub API rate limits.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OWNER = "EarthStrixDEV";
const REPO = "agents";
const BRANCH = "master";
const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`;
const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;
const CONTENT_DIR = path.join(process.cwd(), "content", "agents");

const token = process.env.GITHUB_TOKEN;
const ghHeaders: Record<string, string> = token
  ? { Authorization: `Bearer ${token}` }
  : {};

type TreeEntry = { path: string; type: string };

type IndexEntry = {
  id: string;
  categoryId: string;
  name: string;
  role: string;
};

async function fetchJson<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`);
  }
  return res.text();
}

// README table rows look like: | 1 | Consultant | `erp-epicor-consultant` | role text |
const CATEGORY_LABEL_TO_ID: Record<string, string> = {
  Consultant: "consultant",
  Business: "business",
  "Software Engineering": "software-engineering",
  Creative: "creative",
  Research: "research",
  "Life-style": "life-style",
  Productivity: "productivity",
};

function parseReadmeIndex(readme: string): IndexEntry[] {
  const lines = readme.split("\n");
  const entries: IndexEntry[] = [];
  let inTable = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("| # | หมวด | Agent | บทบาท |")) {
      inTable = true;
      continue;
    }
    if (!inTable) continue;
    if (!trimmed.startsWith("|")) {
      if (entries.length > 0) break; // table ended
      continue;
    }
    // skip separator row: | --- | --- | ... |
    if (/^\|[\s-]+\|/.test(trimmed) && trimmed.includes("---")) continue;

    const cells = trimmed
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length < 4) continue;
    const [, catLabel, idCell, roleCell] = cells;
    const categoryId = CATEGORY_LABEL_TO_ID[catLabel];
    const idMatch = idCell.match(/`([^`]+)`/);
    if (!categoryId || !idMatch) continue;
    const id = idMatch[1];
    entries.push({
      id,
      categoryId,
      name: "",
      role: roleCell,
    });
  }

  return entries;
}

async function main() {
  console.log(`Fetching repo tree for ${OWNER}/${REPO}@${BRANCH}...`);
  const tree = await fetchJson<{ tree: TreeEntry[] }>(
    `${API_BASE}/git/trees/${BRANCH}?recursive=1`,
    ghHeaders
  );

  const coreMdPaths = tree.tree.filter(
    (e) => e.type === "blob" && /^agents\/[^/]+\/[^/]+\/core\.md$/.test(e.path)
  );

  console.log(`Found ${coreMdPaths.length} core.md files.`);

  console.log("Fetching README.md for role metadata...");
  const readme = await fetchText(`${RAW_BASE}/README.md`);
  const readmeIndex = parseReadmeIndex(readme);
  const roleById = new Map(readmeIndex.map((e) => [e.id, e]));

  console.log(`Parsed ${readmeIndex.length} rows from README index table.`);

  const indexEntries: IndexEntry[] = [];
  let done = 0;

  for (const entry of coreMdPaths) {
    const match = entry.path.match(/^agents\/([^/]+)\/([^/]+)\/core\.md$/);
    if (!match) continue;
    const [, categoryId, id] = match;

    const rawUrl = `${RAW_BASE}/${entry.path}`;
    const content = await fetchText(rawUrl);

    const destDir = path.join(CONTENT_DIR, categoryId, id);
    await mkdir(destDir, { recursive: true });
    await writeFile(path.join(destDir, "core.md"), content, "utf-8");

    const h1Match = content.match(/^#\s+(.+)$/m);
    const name = h1Match ? h1Match[1].replace(/\s*-\s*Full Text\s*$/i, "").trim() : id;

    const readmeMeta = roleById.get(id);
    indexEntries.push({
      id,
      categoryId,
      name,
      role: readmeMeta?.role ?? "",
    });

    done += 1;
    console.log(`[${done}/${coreMdPaths.length}] ${categoryId}/${id}`);
  }

  indexEntries.sort((a, b) => a.categoryId.localeCompare(b.categoryId) || a.id.localeCompare(b.id));

  await mkdir(CONTENT_DIR, { recursive: true });
  await writeFile(
    path.join(CONTENT_DIR, "index.json"),
    JSON.stringify(indexEntries, null, 2) + "\n",
    "utf-8"
  );

  console.log(`\nDone. Wrote ${indexEntries.length} agents to content/agents/index.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
