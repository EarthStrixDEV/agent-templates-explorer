"use client";

import { Users, LayoutGrid } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SearchBox } from "./SearchBox";
import { CategoryChips } from "./CategoryChips";
import { ViewToggle, type ExplorerView } from "./ViewToggle";
import type { Category } from "@/lib/categories";

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
        <span className="text-[16px] font-extrabold tracking-[0.2px]">
          Agent Templates
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
            {totalAgents} agents
          </span>
          <span className="flex items-center gap-1">
            <LayoutGrid className="h-3.5 w-3.5" />
            {totalCats} categories
          </span>
        </span>
        <ViewToggle view={view} onChange={onViewChange} />
      </div>
    </header>
  );
}
