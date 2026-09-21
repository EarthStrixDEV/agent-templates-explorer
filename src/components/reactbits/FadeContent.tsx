"use client";

/**
 * FadeContent — adapted from React Bits (https://reactbits.dev)
 * Fades + slides content in once it enters the viewport.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import type { ReactNode } from "react";
import { motion } from "motion/react";

type FadeContentProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  blur?: boolean;
};

export function FadeContent({
  children,
  className,
  delay = 0,
  duration = 0.5,
  blur = false,
}: FadeContentProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12, filter: blur ? "blur(6px)" : undefined }}
      whileInView={{ opacity: 1, y: 0, filter: blur ? "blur(0px)" : undefined }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
