"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * Reads the explorer state the user came from (`?from=`) on the client, so
 * the detail route itself stays statically generated — adding `searchParams`
 * to the server component would opt all 77 pages into dynamic rendering.
 *
 * Only same-origin paths are honoured, so a crafted link can't turn the back
 * button into an off-site redirect.
 */
function safeReturnPath(from: string | null): string | null {
  if (!from) return null;
  if (!from.startsWith("/") || from.startsWith("//")) return null;
  return from;
}

export function BackLink() {
  const searchParams = useSearchParams();
  const returnPath = safeReturnPath(searchParams.get("from")) ?? "/?view=graph";
  const label = returnPath.includes("view=list") ? "Back to list" : "Back to graph";

  return (
    <Link
      href={returnPath}
      className="flex items-center gap-1.5 text-[12.5px] text-[var(--secondary-text)] transition-colors hover:text-[var(--primary-text)]"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}
