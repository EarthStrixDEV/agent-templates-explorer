"use client";

/**
 * ElectricBorder — adapted from React Bits (https://reactbits.dev)
 * Simplified CSS take on the canvas/Perlin-noise original: a rotating
 * conic-gradient ring masked down to a thin border, plus a contained glow.
 *
 * The rotating gradient is clipped with a mask so only the border ring shows;
 * without the mask the raw conic sweep reads as a large diagonal light bar
 * bleeding across (and outside) the panel.
 *
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
  thickness?: number;
};

export function ElectricBorder({
  children,
  className,
  color = "#7aa2f7",
  speed = 1,
  borderRadius = 12,
  thickness = 1.5,
}: ElectricBorderProps) {
  const maskStyle = {
    WebkitMask: `linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)`,
    WebkitMaskComposite: "xor",
    mask: `linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)`,
    maskComposite: "exclude",
    padding: thickness,
  } as React.CSSProperties;

  return (
    <div
      className={cn("relative", className)}
      style={{ borderRadius }}
    >
      {/* Rotating ring, masked to just the border band. */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ borderRadius, ...maskStyle }}
      >
        <div
          className="absolute left-1/2 top-1/2 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 animate-[electric-border-spin_var(--eb-speed)_linear_infinite]"
          style={
            {
              background: `conic-gradient(from 0deg, transparent 0%, ${color} 12%, transparent 28%, transparent 100%)`,
              "--eb-speed": `${3 / speed}s`,
            } as React.CSSProperties
          }
        />
      </div>

      {/* Soft ambient glow, kept tight so it doesn't wash over the layout. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-20 blur-md"
        style={{ background: color, borderRadius }}
      />

      <div className="relative" style={{ borderRadius }}>
        {children}
      </div>

      <style jsx global>{`
        @keyframes electric-border-spin {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
