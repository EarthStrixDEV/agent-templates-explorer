"use client";

/**
 * Noise — adapted from React Bits (https://reactbits.dev)
 * Canvas film-grain overlay, redrawn every frame with random pixel data.
 * Copied into the codebase per React Bits' copy-paste distribution model.
 */
import { useEffect, useRef } from "react";

type NoiseProps = {
  opacity?: number;
  className?: string;
};

export function Noise({ opacity = 0.035, className }: NoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    const patternSize = 128;
    canvas.width = patternSize;
    canvas.height = patternSize;

    function draw() {
      const imageData = ctx!.createImageData(patternSize, patternSize);
      const buffer = new Uint32Array(imageData.data.buffer);
      for (let i = 0; i < buffer.length; i++) {
        const v = (Math.random() * 255) | 0;
        buffer[i] = (255 << 24) | (v << 16) | (v << 8) | v;
      }
      ctx!.putImageData(imageData, 0, 0);
      frameId = requestAnimationFrame(draw);
    }
    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
        imageRendering: "pixelated",
      }}
    />
  );
}
