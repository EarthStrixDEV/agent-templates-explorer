"use client";

/**
 * ShinyText — adapted from React Bits (https://reactbits.dev)
 * Animated shimmering-text effect using a moving gradient mask.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import { cn } from "@/lib/utils";

type ShinyTextProps = {
  text: string;
  className?: string;
  speed?: number;
};

export function ShinyText({ text, className, speed = 4 }: ShinyTextProps) {
  return (
    <span
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{
        backgroundImage:
          "linear-gradient(110deg, #e6edf3 40%, #ffffff 50%, #e6edf3 60%)",
        backgroundSize: "200% 100%",
        animation: `shiny-text ${speed}s linear infinite`,
      }}
    >
      {text}
      <style jsx>{`
        @keyframes shiny-text {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </span>
  );
}
