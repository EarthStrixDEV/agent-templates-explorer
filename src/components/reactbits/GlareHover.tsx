"use client";

/**
 * GlareHover — adapted from React Bits (https://reactbits.dev)
 * Diagonal glare sweep that plays on hover, done with CSS custom properties.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlareHoverProps = {
  children: ReactNode;
  className?: string;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
};

export function GlareHover({
  children,
  className,
  glareColor = "#ffffff",
  glareOpacity = 0.12,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
}: GlareHoverProps) {
  return (
    <div
      className={cn("group/glare relative overflow-hidden", className)}
      style={
        {
          "--gh-angle": `${glareAngle}deg`,
          "--gh-size": `${glareSize}%`,
          "--gh-duration": `${transitionDuration}ms`,
        } as React.CSSProperties
      }
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 -translate-x-full transition-transform group-hover/glare:translate-x-full"
        style={{
          background: `linear-gradient(var(--gh-angle), transparent 40%, ${glareColor} 50%, transparent 60%)`,
          opacity: glareOpacity,
          backgroundSize: "var(--gh-size) var(--gh-size)",
          transitionDuration: "var(--gh-duration)",
          transitionTimingFunction: "ease",
        }}
      />
    </div>
  );
}
