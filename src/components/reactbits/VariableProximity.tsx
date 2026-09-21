"use client";

/**
 * VariableProximity — adapted from React Bits (https://reactbits.dev)
 * Boosts font-weight/scale of characters near the cursor.
 * Simplified from the original variable-font-axis version to a
 * font-weight + scale interpolation that works with any font.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type VariableProximityProps = {
  text: string;
  className?: string;
  radius?: number;
};

export function VariableProximity({ text, className, radius = 80 }: VariableProximityProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [centers, setCenters] = useState<{ x: number; y: number }[]>([]);
  const letters = text.split("");

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    setCenters(
      letterRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        };
      })
    );
  }, [text]);

  function handleMouseMove(e: MouseEvent<HTMLSpanElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <span
      ref={containerRef}
      className={cn("inline-flex", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouse(null)}
    >
      {letters.map((letter, i) => {
        let weight = 500;
        let scale = 1;
        const center = centers[i];

        if (mouse && center) {
          const dist = Math.hypot(mouse.x - center.x, mouse.y - center.y);
          const proximity = Math.max(0, 1 - dist / radius);
          weight = 500 + proximity * 400;
          scale = 1 + proximity * 0.25;
        }

        return (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            style={{
              fontWeight: weight,
              display: "inline-block",
              transform: `scale(${scale})`,
              transition: "font-weight 0.1s, transform 0.1s",
            }}
          >
            {letter === " " ? " " : letter}
          </span>
        );
      })}
    </span>
  );
}
