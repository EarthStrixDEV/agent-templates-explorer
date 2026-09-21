"use client";

import { Search } from "lucide-react";

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
        placeholder="Search agents, roles, tags…"
        className="w-full bg-transparent font-sans text-[13px] text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)]"
      />
    </div>
  );
}
