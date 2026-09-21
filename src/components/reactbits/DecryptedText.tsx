"use client";

/**
 * DecryptedText — adapted from React Bits (https://reactbits.dev)
 * Scrambles characters and progressively reveals the real text on hover.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&*";

type DecryptedTextProps = {
  text: string;
  className?: string;
  speed?: number;
  animateOn?: "hover" | "view";
};

export function DecryptedText({
  text,
  className,
  speed = 35,
  animateOn = "hover",
}: DecryptedTextProps) {
  const [display, setDisplay] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hasRunRef = useRef(false);

  function scramble() {
    if (isAnimating) return;
    setIsAnimating(true);
    let iteration = 0;
    const maxIterations = text.length;

    const id = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iteration) return text[i];
            return CHARSET[Math.floor(Math.random() * CHARSET.length)];
          })
          .join("")
      );

      iteration += 1;
      if (iteration > maxIterations) {
        clearInterval(id);
        setDisplay(text);
        setIsAnimating(false);
      }
    }, speed);
  }

  useEffect(() => {
    if (animateOn !== "view" || hasRunRef.current) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasRunRef.current = true;
          scramble();
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animateOn]);

  return (
    <span
      ref={ref}
      className={cn("font-mono", className)}
      onMouseEnter={animateOn === "hover" ? scramble : undefined}
    >
      {display}
    </span>
  );
}
