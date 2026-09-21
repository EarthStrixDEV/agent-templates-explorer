"use client";

/**
 * GlareHover — adapted from React Bits (https://reactbits.dev)
 * Diagonal glare sweep that plays on hover.
 * The sweep is driven by background-position on a full-bleed overlay so the
 * highlight always stays inside the card bounds (translating an oversized
 * gradient instead lets it spill outside the rounded corners).
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlareHoverProps = {
  children: ReactNode;
  className?: string;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  transitionDuration?: number;
};

export function GlareHover({
  children,
  className,
  glareColor = "#ffffff",
  glareOpacity = 0.12,
  glareAngle = -45,
  transitionDuration = 650,
}: GlareHoverProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(${glareAngle}deg, transparent 35%, ${glareColor} 50%, transparent 65%)`,
          backgroundSize: "250% 250%",
          backgroundPosition: hovered ? "0% 0%" : "100% 100%",
          opacity: hovered ? glareOpacity : 0,
          transition: `background-position ${transitionDuration}ms ease, opacity ${transitionDuration / 2}ms ease`,
        }}
      />
    </div>
  );
}
