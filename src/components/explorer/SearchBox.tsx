"use client";

import { Search, X } from "lucide-react";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="flex min-w-[180px] max-w-[420px] flex-1 items-center gap-2 rounded-[10px] border border-[var(--border-standard)] bg-[var(--surface)] px-3 py-2.5">
      <Search className="h-4 w-4 shrink-0 text-[var(--secondary-text)]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) {
            e.preventDefault();
            onChange("");
          }
        }}
        placeholder="Search agents, roles, tags…"
        aria-label="Search agents"
        className="w-full bg-transparent font-sans text-[13px] text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          title="Clear search (Esc)"
          className="shrink-0 rounded-full p-0.5 text-[var(--secondary-text)] transition-colors hover:bg-[var(--active-segment)] hover:text-[var(--primary-text)]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
