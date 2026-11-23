"use client";

import { useEffect, useRef, useState } from "react";

interface FrameSequenceCanvasProps {
  basePath: string;
  frameCount?: number;
  progressRef: React.MutableRefObject<number>;
  className?: string;
  onAvailable?: (available: boolean) => void;
}

/**
 * Drop-in scroll-scrubbed WebP frame sequence renderer.
 * Automatically checks whether `${basePath}/frame_0001.webp` exists.
 * If present, preloads all frames and renders them 1:1 with scroll progress.
 * If absent, calls `onAvailable(false)` so the procedural Three.js fallback runs seamlessly.
 */
export default function FrameSequenceCanvas({
  basePath,
  frameCount = 120,
  progressRef,
  className = "",
  onAvailable,
}: FrameSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const probe = new Image();
    probe.src = `${basePath}/frame_0001.webp`;

    probe.onload = () => {
      if (cancelled) return;
      setActive(true);
      onAvailable?.(true);
    };
    probe.onerror = () => {
      if (cancelled) return;
      setActive(false);
      onAvailable?.(false);
    };

    return () => {
      cancelled = true;
    };
  }, [basePath, onAvailable]);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: (HTMLImageElement | null)[] = new Array(frameCount).fill(null);
    let lastDrawn = -1;
    let rafId = 0;

    const pad = (n: number) => String(n).padStart(4, "0");

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = `${basePath}/frame_${pad(i + 1)}.webp`;
      img.onload = () => {
        images[i] = img;
      };
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      lastDrawn = -1;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawFrame = () => {
      const p = Math.max(0, Math.min(1, progressRef.current));
      const idx = Math.min(frameCount - 1, Math.floor(p * (frameCount - 1)));
      if (idx !== lastDrawn && images[idx]) {
        const img = images[idx]!;
        const cw = canvas.width;
        const ch = canvas.height;
        const imgRatio = img.width / img.height;
        const canvasRatio = cw / ch;
        let dw = cw;
        let dh = ch;
        let dx = 0;
        let dy = 0;
        if (canvasRatio > imgRatio) {
          dh = cw / imgRatio;
          dy = (ch - dh) / 2;
        } else {
          dw = ch * imgRatio;
          dx = (cw - dw) / 2;
        }
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, dw, dh);
        lastDrawn = idx;
      }
      rafId = requestAnimationFrame(drawFrame);
    };
    rafId = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [active, basePath, frameCount, progressRef]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block ${className}`}
      aria-hidden="true"
    />
  );
}
