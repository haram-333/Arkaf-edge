"use client";

import { useEffect, useState } from "react";
import { ROTATING_WORDS } from "@/data/content";

export default function DiscoverWordsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ROTATING_WORDS.words.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      id="discover-us"
      className="relative z-40 bg-gradient-to-b from-black via-[#02120e] to-[#031613] text-white py-20 sm:py-28 border-t border-white/10 overflow-hidden"
    >
      {/* Subtle ambient glow centered behind kinetic word reel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 62% 50%, rgba(20,248,132,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-[1220px] mx-auto px-5 sm:px-10">
        <div className="mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-2 rounded-full liquid-glass-pill px-4 py-1.5 font-mono-label text-[9.5px] text-[#14f884]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14f884] animate-pulse" />
            <span>DISCOVER US</span>
          </span>
        </div>

        {/* Monumental Split Kinetic Lockup: WE BUILD + Rotating Vertical Reel */}
        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6">
          <h2 className="text-[clamp(2rem,6.4vw,6.2rem)] font-medium tracking-[-0.04em] leading-[0.95] uppercase text-white shrink-0">
            {ROTATING_WORDS.prefix}
          </h2>

          {/* Smooth CSS Vertical Slot Window */}
          <div className="relative h-[1.08em] text-[clamp(2rem,6.4vw,6.2rem)] font-medium tracking-[-0.04em] leading-[1.08] uppercase overflow-hidden w-full">
            <div
              className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
              style={{ transform: `translate3d(0, -${activeIndex * 1.08}em, 0)` }}
            >
              {ROTATING_WORDS.words.map((word, idx) => (
                <div
                  key={word}
                  className={`h-[1.08em] flex items-center transition-opacity duration-500 ${
                    activeIndex === idx
                      ? "text-[#14f884] neon-text-glow opacity-100"
                      : "text-[#14f884]/25 opacity-30"
                  }`}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Word Selector Pills */}
        <div
          onMouseLeave={() => setIsPaused(false)}
          className="mt-10 sm:mt-14 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2 sm:gap-3"
        >
          {ROTATING_WORDS.words.map((word, idx) => {
            const active = activeIndex === idx;
            return (
              <button
                key={word}
                type="button"
                onMouseEnter={() => {
                  setIsPaused(true);
                  setActiveIndex(idx);
                }}
                onClick={() => {
                  setIsPaused(true);
                  setActiveIndex(idx);
                }}
                className={`px-4 py-2 rounded-full font-mono-label text-[10px] sm:text-[11px] font-semibold transition-all duration-300 cursor-pointer ${
                  active
                    ? "bg-[#14f884] text-[#050b09] shadow-[0_0_20px_rgba(20,248,132,0.45)] scale-105"
                    : "liquid-glass-pill text-white/65 hover:text-white"
                }`}
              >
                0{idx + 1} · {word}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
