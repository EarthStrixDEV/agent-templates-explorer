"use client";

/**
 * Magnet — adapted from React Bits (https://reactbits.dev)
 * Wraps content that drifts toward the cursor when it's nearby.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import { useState, useEffect, useRef, type ReactNode } from "react";

type MagnetProps = {
  children: ReactNode;
  padding?: number;
  magnetStrength?: number;
  className?: string;
};

export function Magnet({
  children,
  padding = 60,
  magnetStrength = 4,
  className,
}: MagnetProps) {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseMove(e: globalThis.MouseEvent) {
      if (!magnetRef.current) return;
      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setIsActive(true);
        setPosition({
          x: (e.clientX - centerX) / magnetStrength,
          y: (e.clientY - centerY) / magnetStrength,
        });
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, magnetStrength]);

  return (
    <div ref={magnetRef} className={className} style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: isActive ? "transform 0.3s ease-out" : "transform 0.5s ease-in-out",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
