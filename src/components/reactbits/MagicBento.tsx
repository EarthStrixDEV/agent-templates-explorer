"use client";

/**
 * MagicBento (border-glow variant) — adapted from React Bits (https://reactbits.dev)
 * Tracks the cursor position with CSS custom properties and renders a
 * spotlight-tinted border/glow around the panel.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type MagicBentoProps = {
  children: ReactNode;
  className?: string;
  glowColor?: string;
};

export function MagicBento({ children, className, glowColor = "122, 162, 247" }: MagicBentoProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 100;
    const relY = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--glow-x", `${relX}%`);
    el.style.setProperty("--glow-y", `${relY}%`);
    el.style.setProperty("--glow-intensity", "1");
  }

  function handleMouseLeave() {
    ref.current?.style.setProperty("--glow-intensity", "0");
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative overflow-hidden", className)}
      style={
        {
          "--glow-x": "50%",
          "--glow-y": "50%",
          "--glow-intensity": "0",
          "--glow-color": glowColor,
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: "var(--glow-intensity)",
          background: `radial-gradient(240px circle at var(--glow-x) var(--glow-y), rgba(var(--glow-color), 0.15), transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: "var(--glow-intensity)",
          border: `1px solid rgba(var(--glow-color), 0.5)`,
          boxShadow: `0 0 16px rgba(var(--glow-color), 0.25)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
