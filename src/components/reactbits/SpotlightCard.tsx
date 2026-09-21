"use client";

/**
 * SpotlightCard — adapted from React Bits (https://reactbits.dev)
 * A card that renders a radial-gradient spotlight following the cursor.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  onClick?: () => void;
};

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(122, 162, 247, 0.18)",
  onClick,
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const div = divRef.current;
    if (!div) return;
    const rect = div.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    div.style.setProperty("--spotlight-x", `${x}px`);
    div.style.setProperty("--spotlight-y", `${y}px`);
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={cn(
        "group/spotlight relative overflow-hidden rounded-[9px] border border-[var(--border-standard)] bg-[var(--surface)]",
        onClick && "cursor-pointer",
        className
      )}
      style={
        {
          "--spotlight-color": spotlightColor,
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
        style={{
          background: `radial-gradient(400px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), var(--spotlight-color), transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
