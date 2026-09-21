"use client";

import { Users, LayoutGrid } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ShinyText } from "@/components/reactbits/ShinyText";
import { CountUp } from "@/components/reactbits/CountUp";
import { RotatingText } from "@/components/reactbits/RotatingText";
import { SearchBox } from "./SearchBox";
import { CategoryChips } from "./CategoryChips";
import { ViewToggle, type ExplorerView } from "./ViewToggle";
import type { Category } from "@/lib/categories";

const HEADER_TAGLINE_WORDS = [
  "specialist agents",
  "reusable personas",
  "reasoning frameworks",
  "battle-tested guardrails",
];

type HeaderProps = {
  categories: Category[];
  search: string;
  onSearchChange: (v: string) => void;
  activeCats: string[];
  onToggleCategory: (id: string) => void;
  view: ExplorerView;
  onViewChange: (v: ExplorerView) => void;
  totalAgents: number;
  totalCats: number;
};

export function Header({
  categories,
  search,
  onSearchChange,
  activeCats,
  onToggleCategory,
  view,
  onViewChange,
  totalAgents,
  totalCats,
}: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center gap-4 border-b border-[var(--border-hairline)] px-6 py-3.5">
      <div className="flex items-center gap-2">
        <Logo />
        <ShinyText
          text="Agent Templates"
          className="text-[16px] font-extrabold tracking-[0.2px]"
        />
        <span className="hidden items-center gap-1 text-[12px] text-[var(--secondary-text)] lg:flex">
          for
          <RotatingText
            words={HEADER_TAGLINE_WORDS}
            className="min-w-[168px] font-medium text-[var(--link)]"
          />
        </span>
      </div>

      <SearchBox value={search} onChange={onSearchChange} />

      <CategoryChips
        categories={categories}
        activeCats={activeCats}
        onToggle={onToggleCategory}
      />

      <div className="ml-auto flex items-center gap-4">
        <span className="flex items-center gap-3 text-[12px] text-[var(--secondary-text)]">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <CountUp to={totalAgents} duration={1.4} /> agents
          </span>
          <span className="flex items-center gap-1">
            <LayoutGrid className="h-3.5 w-3.5" />
            <CountUp to={totalCats} duration={1} /> categories
          </span>
        </span>
        <ViewToggle view={view} onChange={onViewChange} />
      </div>
    </header>
  );
}
