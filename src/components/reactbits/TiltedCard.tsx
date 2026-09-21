"use client";

/**
 * TiltedCard — adapted from React Bits (https://reactbits.dev)
 * 3D tilt that follows the cursor using Framer Motion springs.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

type TiltedCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  scaleOnHover?: number;
};

export function TiltedCard({
  children,
  className,
  maxTilt = 8,
  scaleOnHover = 1.02,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 220 };
  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), springConfig);
  const scale = useSpring(1, springConfig);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
    scale.set(1);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("[transform-style:preserve-3d]", className)}
      style={{ rotateX, rotateY, scale, perspective: 800 }}
    >
      {children}
    </motion.div>
  );
}
