"use client";

/**
 * AnimatedList — adapted from React Bits (https://reactbits.dev)
 * Staggers each list item in with a fade + slide when mounted.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import type { ReactNode } from "react";
import { motion } from "motion/react";

type AnimatedListProps = {
  children: ReactNode[];
  className?: string;
  stagger?: number;
};

export function AnimatedList({ children, className, stagger = 0.06 }: AnimatedListProps) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * stagger, ease: "easeOut" }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
