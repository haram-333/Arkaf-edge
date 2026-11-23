"use client";

import { useEffect, useRef } from "react";

/**
 * Glowing emerald cursor follower ring matching the video's interactive ring.
 * Automatically stays hidden on touch / coarse-pointer devices.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ringRef.current;
    if (!el) return;

    const pos = { x: -100, y: -100, tx: -100, ty: -100 };
    let hovering = false;
    let visible = false;
    let rafId = 0;

    const onMove = (e: PointerEvent) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
      if (!visible) {
        pos.x = e.clientX;
        pos.y = e.clientY;
        visible = true;
        el.style.opacity = "1";
      }
      const interactive = (e.target as HTMLElement | null)?.closest(
        "a, button, input, textarea, [role='button']"
      );
      hovering = Boolean(interactive);
    };

    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const lerp = 1 - Math.exp(-dt * 10);
      pos.x += (pos.tx - pos.x) * lerp;
      pos.y += (pos.ty - pos.y) * lerp;
      const scale = hovering ? 1.32 : 1;
      el.style.transform = `translate3d(${pos.x - 21}px, ${pos.y - 21}px, 0) scale(${scale})`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[80] w-[42px] h-[42px] rounded-full pointer-events-none opacity-0 transition-[opacity,background-color] duration-200 hidden md:block"
      style={{
        border: "1.5px solid rgba(20, 248, 132, 0.85)",
        backgroundColor: "rgba(20, 248, 132, 0.08)",
        boxShadow:
          "0 0 18px rgba(20, 248, 132, 0.35), inset 0 0 10px rgba(20, 248, 132, 0.12)",
      }}
    />
  );
}
