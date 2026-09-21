"use client";

/**
 * Crosshair — adapted from React Bits (https://reactbits.dev)
 * Custom crosshair cursor that tracks the mouse inside a container,
 * built with Framer Motion springs for a slight trailing lag.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type CrosshairProps = {
  children: ReactNode;
  color?: string;
  className?: string;
};

export function Crosshair({ children, color = "#7aa2f7", className }: CrosshairProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", cursor: "none" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <>
          <motion.div
            className="pointer-events-none absolute top-0 left-0 z-50"
            style={{
              x: springX,
              y: 0,
              width: 1,
              height: "100%",
              background: color,
              opacity: 0.35,
            }}
          />
          <motion.div
            className="pointer-events-none absolute top-0 left-0 z-50"
            style={{
              x: 0,
              y: springY,
              width: "100%",
              height: 1,
              background: color,
              opacity: 0.35,
            }}
          />
          <motion.div
            className="pointer-events-none absolute top-0 left-0 z-50 rounded-full"
            style={{
              x: springX,
              y: springY,
              translateX: "-50%",
              translateY: "-50%",
              width: 10,
              height: 10,
              border: `1.5px solid ${color}`,
            }}
          />
        </>
      )}
    </div>
  );
}
