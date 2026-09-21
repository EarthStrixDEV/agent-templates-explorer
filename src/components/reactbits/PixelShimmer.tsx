"use client";

/**
 * PixelShimmer — simplified from React Bits' PixelCard (https://reactbits.dev)
 * Draws a small grid of pixels that fade in/shimmer on hover, using canvas.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import { useEffect, useRef, type ReactNode } from "react";

type PixelShimmerProps = {
  children: ReactNode;
  className?: string;
  colors?: string;
  gap?: number;
};

type PixelState = { x: number; y: number; size: number; target: number; color: string };

export function PixelShimmer({
  children,
  className,
  colors = "#7aa2f7,#a78bfa,#4dd0e1",
  gap = 6,
}: PixelShimmerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<PixelState[]>([]);
  const animRef = useRef<number | undefined>(undefined);
  const hoveredRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colorList = colors.split(",");

    function init() {
      const rect = container!.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      canvas!.width = width;
      canvas!.height = height;
      const pixels: PixelState[] = [];
      for (let x = 0; x < width; x += gap) {
        for (let y = 0; y < height; y += gap) {
          pixels.push({
            x,
            y,
            size: 0,
            target: 0,
            color: colorList[Math.floor(Math.random() * colorList.length)],
          });
        }
      }
      pixelsRef.current = pixels;
    }
    init();

    const ro = new ResizeObserver(init);
    ro.observe(container);

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const p of pixelsRef.current) {
        p.target = hoveredRef.current ? 1.4 : 0;
        p.size += (p.target - p.size) * 0.15;
        if (p.size > 0.05) {
          ctx!.fillStyle = p.color;
          ctx!.globalAlpha = Math.min(1, p.size);
          ctx!.fillRect(p.x, p.y, p.size, p.size);
        }
      }
      ctx!.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    }
    animRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [colors, gap]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
      onMouseEnter={() => (hoveredRef.current = true)}
      onMouseLeave={() => (hoveredRef.current = false)}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
