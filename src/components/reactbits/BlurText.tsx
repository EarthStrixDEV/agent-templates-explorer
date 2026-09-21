"use client";

/**
 * BlurText — adapted from React Bits (https://reactbits.dev)
 * Reveals text word-by-word with a blur + fade-in once scrolled into view.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type BlurTextProps = {
  text: string;
  className?: string;
  delay?: number;
  direction?: "top" | "bottom";
};

export function BlurText({ text, className, delay = 80, direction = "top" }: BlurTextProps) {
  const words = text.split(" ");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const fromY = direction === "top" ? -16 : 16;

  return (
    <p ref={ref} className={className} style={{ display: "flex", flexWrap: "wrap" }}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ filter: "blur(8px)", opacity: 0, y: fromY }}
          animate={inView ? { filter: "blur(0px)", opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: (index * delay) / 1000 }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}
