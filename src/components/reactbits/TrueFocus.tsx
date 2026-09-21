"use client";

/**
 * TrueFocus — adapted from React Bits (https://reactbits.dev)
 * Cycles a focus frame across each word in a sentence, blurring the rest.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type TrueFocusProps = {
  sentence: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
};

export function TrueFocus({
  sentence,
  manualMode = false,
  blurAmount = 4,
  borderColor = "#7aa2f7",
  glowColor = "rgba(122, 162, 247, 0.6)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1.2,
  className,
}: TrueFocusProps) {
  const words = sentence.split(" ");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (manualMode) return;
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % words.length),
      (animationDuration + pauseBetweenAnimations) * 1000
    );
    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex < 0 || !wordRefs.current[currentIndex] || !containerRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();
    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex]);

  function handleMouseEnter(index: number) {
    if (!manualMode) return;
    setLastActiveIndex(index);
    setCurrentIndex(index);
  }

  function handleMouseLeave() {
    if (!manualMode) return;
    setCurrentIndex(lastActiveIndex ?? 0);
  }

  return (
    <div className={className} ref={containerRef} style={{ position: "relative" }}>
      <div className="flex flex-wrap gap-x-[0.3em]">
        {words.map((word, index) => {
          const isActive = index === currentIndex;
          return (
            <span
              key={index}
              ref={(el) => {
                wordRefs.current[index] = el;
              }}
              style={{
                filter: isActive ? "blur(0px)" : `blur(${blurAmount}px)`,
                opacity: isActive ? 1 : 0.6,
                transition: `filter ${animationDuration}s ease, opacity ${animationDuration}s ease`,
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {word}
            </span>
          );
        })}
      </div>

      <motion.div
        className="pointer-events-none absolute rounded-md border"
        animate={{
          x: focusRect.x - 4,
          y: focusRect.y - 3,
          width: focusRect.width + 8,
          height: focusRect.height + 6,
          opacity: currentIndex >= 0 ? 1 : 0,
        }}
        transition={{ duration: animationDuration }}
        style={{
          borderColor,
          boxShadow: `0 0 12px ${glowColor}`,
        }}
      />
    </div>
  );
}
