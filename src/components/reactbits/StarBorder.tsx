"use client";

/**
 * StarBorder — adapted from React Bits (https://reactbits.dev)
 * Button/link wrapper with a rotating radial-gradient "comet" border.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type StarBorderProps = {
  as?: ElementType;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  children: ReactNode;
  [key: string]: unknown;
};

export function StarBorder({
  as: Component = "div",
  className,
  color = "#7aa2f7",
  speed = "5s",
  thickness = 1,
  children,
  ...rest
}: StarBorderProps) {
  return (
    <Component
      className={cn("relative overflow-hidden rounded-[10px]", className)}
      style={{ padding: `${thickness}px` }}
      {...rest}
    >
      <span
        className="absolute inset-0 animate-[star-border-spin_var(--sb-speed)_linear_infinite]"
        style={
          {
            background: `conic-gradient(from 0deg, transparent 0%, ${color} 15%, transparent 30%)`,
            "--sb-speed": speed,
          } as React.CSSProperties
        }
      />
      <span className="relative z-10 flex h-full w-full items-center justify-center rounded-[9px] bg-[var(--surface)]">
        {children}
      </span>
      <style jsx global>{`
        @keyframes star-border-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Component>
  );
}
