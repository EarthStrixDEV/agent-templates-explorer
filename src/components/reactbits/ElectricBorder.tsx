"use client";

/**
 * ElectricBorder — adapted from React Bits (https://reactbits.dev)
 * Simplified CSS take on the canvas/Perlin-noise original: a rotating
 * conic-gradient ring masked to a thin border, layered with a soft glow.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ElectricBorderProps = {
  children: ReactNode;
  className?: string;
  color?: string;
  speed?: number;
  borderRadius?: number;
};

export function ElectricBorder({
  children,
  className,
  color = "#7aa2f7",
  speed = 1,
  borderRadius = 12,
}: ElectricBorderProps) {
  return (
    <div
      className={cn("relative isolate", className)}
      style={{ borderRadius }}
    >
      <div
        className="pointer-events-none absolute -inset-[1.5px] -z-10 animate-[electric-border-spin_var(--eb-speed)_linear_infinite] opacity-70"
        style={
          {
            borderRadius: borderRadius + 1.5,
            background: `conic-gradient(from 0deg, transparent, ${color}, transparent 30%)`,
            "--eb-speed": `${3 / speed}s`,
          } as React.CSSProperties
        }
      />
      <div
        className="pointer-events-none absolute -inset-3 -z-20 opacity-25 blur-xl"
        style={{ background: color, borderRadius }}
      />
      <div
        className="relative h-full w-full bg-[var(--panel)]"
        style={{ borderRadius }}
      >
        {children}
      </div>
      <style jsx global>{`
        @keyframes electric-border-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
