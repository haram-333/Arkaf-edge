"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticleWaveCanvas from "@/components/canvas/ParticleWaveCanvas";
import { APPROACH_STAGES } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

function StageTelemetryGraphic({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 280 130" className="w-full h-full">
        <defs>
          <radialGradient id="g0" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#14f884" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#14f884" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="280" height="130" fill="#020705" />
        <circle cx="140" cy="65" r="46" fill="url(#g0)" />
        <circle cx="140" cy="65" r="40" fill="none" stroke="#14f884" strokeOpacity="0.22" strokeDasharray="3 4" />
        <circle cx="140" cy="65" r="22" fill="none" stroke="#14f884" strokeOpacity="0.5" />
        <line x1="65" y1="65" x2="215" y2="65" stroke="#14f884" strokeOpacity="0.18" />
        <line x1="140" y1="18" x2="140" y2="112" stroke="#14f884" strokeOpacity="0.18" />
        <circle cx="140" cy="65" r="4.5" fill="#14f884" />
        <circle cx="164" cy="48" r="2.8" fill="#a9f5cf" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 280 130" className="w-full h-full">
        <rect width="280" height="130" fill="#020705" />
        <ellipse cx="140" cy="65" rx="78" ry="25" fill="none" stroke="#14f884" strokeOpacity="0.32" transform="rotate(-14 140 65)" />
        <ellipse cx="140" cy="65" rx="78" ry="25" fill="none" stroke="#14f884" strokeOpacity="0.55" transform="rotate(14 140 65)" />
        <circle cx="140" cy="65" r="13" fill="#14f884" fillOpacity="0.15" stroke="#14f884" />
        <circle cx="75" cy="50" r="3.5" fill="#14f884" />
        <circle cx="205" cy="80" r="3.5" fill="#a9f5cf" />
        <circle cx="140" cy="65" r="3.5" fill="#ffffff" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 280 130" className="w-full h-full">
      <defs>
        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14f884" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#14f884" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="280" height="130" fill="#020705" />
      <path d="M 24 106 C 75 100, 118 82, 162 56 C 198 36, 224 26, 256 18 L 256 114 L 24 114 Z" fill="url(#g2)" />
      <path d="M 24 106 C 75 100, 118 82, 162 56 C 198 36, 224 26, 256 18" fill="none" stroke="#14f884" strokeWidth="2.2" />
      <circle cx="256" cy="18" r="4.5" fill="#14f884" />
    </svg>
  );
}

export default function ApproachWaveSection() {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<number>(0);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;

          if (p < 0.34) {
            setActiveStage(0);
          } else if (p < 0.67) {
            setActiveStage(1);
          } else {
            setActiveStage(2);
          }
        },
      });

      return () => st.kill();
    }, wrapper);

    return () => ctx.revert();
  }, []);

  const scrollToStage = (idx: number) => {
    setActiveStage(idx);
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const progressTargets = [0.15, 0.50, 0.85];
    const targetScroll =
      wrapper.offsetTop + progressTargets[idx] * (wrapper.offsetHeight - window.innerHeight);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: object) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 1.1 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  return (
    <section
      id="approach"
      ref={wrapperRef}
      className="relative h-[380vh] bg-[#0b1f18]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* Realtime 3D Undulating Emerald Particle Terrain + Bokeh */}
        <ParticleWaveCanvas progressRef={progressRef} />

        {/* Subtle vertical gradient scrim */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,22,17,0.68) 0%, rgba(8,22,17,0.14) 38%, rgba(8,22,17,0.22) 76%, rgba(4,29,26,0.9) 100%)",
          }}
        />

        {/* Pinned Top-Left Header */}
        <div className="relative z-20 w-full max-w-[1380px] mx-auto px-5 sm:px-10 pt-16 sm:pt-24">
          <div className="inline-flex items-center gap-2 font-mono-label text-[9.5px] sm:text-[11px] text-[#14f884] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14f884]" />
            <span>05. OUR APPROACH — HOW WE WORK</span>
          </div>
          <h2 className="text-[clamp(1.4rem,3.35vw,3.05rem)] font-black tracking-[-0.025em] uppercase leading-tight">
            <span className="text-white">THINK. CREATE. </span>
            <span className="text-[#14f884] neon-text-glow">TRANSFORM.</span>
          </h2>
        </div>

        {/* Center Stacked Words & Stage Controls */}
        <div className="relative z-20 w-full max-w-[1380px] mx-auto px-5 sm:px-10 flex-1 flex flex-col justify-between lg:justify-center lg:items-center pt-4 pb-5 lg:py-0 lg:pb-8">
          {/* Center Stacked Words (interactive clickable buttons) */}
          <div className="text-center select-none z-10 my-auto lg:my-0 flex flex-col items-center">
            {APPROACH_STAGES.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <button
                  key={stage.word}
                  type="button"
                  onClick={() => scrollToStage(idx)}
                  aria-label={`Jump to stage ${stage.word}`}
                  className={`block text-[clamp(2rem,5.2vw,4.75rem)] font-black tracking-[-0.03em] leading-[1.06] uppercase transition-all duration-300 cursor-pointer focus:outline-none ${
                    isActive
                      ? "text-white scale-100 drop-shadow-[0_0_24px_rgba(20,248,132,0.4)]"
                      : "text-white/30 hover:text-white/60 scale-[0.97]"
                  }`}
                >
                  {stage.word}
                </button>
              );
            })}

            <div className="mt-3 sm:mt-6 inline-flex items-center gap-2 text-[clamp(0.8rem,1.35vw,1.2rem)] text-[#d0dfd9] font-light">
              <span>Each essential. Each in</span>
              <span className="rounded-full border border-white/40 bg-[#051a12]/55 backdrop-blur-sm px-3 py-0.5 text-[0.88em] text-white font-normal">
                sync.
              </span>
            </div>
          </div>

          {/* Mobile/Tablet Docked Card Slot with Clickable Stage Selector Tabs */}
          <div className="lg:hidden w-full max-w-md mx-auto mt-2 flex flex-col items-center">
            {/* Quick selector tabs cleanly separated ABOVE the card */}
            <div className="flex items-center justify-center gap-2 mb-2.5 z-30">
              {APPROACH_STAGES.map((s, idx) => (
                <button
                  key={s.word}
                  type="button"
                  onClick={() => scrollToStage(idx)}
                  className={`px-3.5 py-1.5 rounded-full font-mono-label text-[9.5px] font-bold transition-all cursor-pointer ${
                    activeStage === idx
                      ? "bg-[#14f884] text-[#050b09] shadow-[0_0_14px_rgba(20,248,132,0.85)] scale-105"
                      : "bg-[#060f0c]/90 text-white/60 border border-white/15 hover:text-white hover:border-[#14f884]/40"
                  }`}
                >
                  0{idx + 1} {s.word}
                </button>
              ))}
            </div>

            {/* Docked Card Slot */}
            <div className="relative w-full min-h-[260px] sm:min-h-[240px]">
              {APPROACH_STAGES.map((stage, idx) => {
                const isActive = activeStage === idx;
                return (
                  <div
                    key={stage.num}
                    className={`absolute inset-x-0 top-0 transition-all duration-500 ease-out ${
                      isActive
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
                  >
                    <div className="rounded-[16px] border border-white/12 bg-[#060f0c]/95 backdrop-blur-xl p-4 shadow-[0_18px_40px_rgba(0,0,0,0.65)]">
                      <div className="relative h-[82px] rounded-[10px] overflow-hidden border border-white/8 mb-3 bg-black">
                        <StageTelemetryGraphic index={idx} />
                        <span className="absolute bottom-1.5 inset-x-0 text-center font-mono-label text-[8.5px] text-[#14f884]/85">
                          {stage.previewLabel}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 font-mono-label text-[9px] text-[#14f884] mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#14f884]" />
                        <span>
                          {stage.num} — {stage.word}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug">
                        {stage.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-[#a9bfb8] font-light leading-relaxed">
                        {stage.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Alternating Floating Cards (Right -> Left -> Right) */}
          {APPROACH_STAGES.map((stage, idx) => {
            const isActive = activeStage === idx;
            const sideClass =
              stage.side === "right"
                ? "right-10 left-auto"
                : "left-10 right-auto";

            return (
              <div
                key={stage.num}
                onClick={() => scrollToStage(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && scrollToStage(idx)}
                className={`hidden lg:block absolute top-1/2 -translate-y-1/2 w-[310px] xl:w-[345px] ${sideClass} z-20 cursor-pointer transition-all duration-500 ease-out ${
                  isActive
                    ? "opacity-100 -translate-y-1/2 pointer-events-auto"
                    : "opacity-0 translate-y-[-43%] pointer-events-none"
                }`}
              >
                <div className="rounded-[18px] border border-white/10 bg-[#060f0c]/92 backdrop-blur-xl p-5 shadow-[0_24px_60px_rgba(0,0,0,0.68)] hover:border-[#14f884]/60 transition-colors">
                  <div className="relative h-[145px] rounded-[12px] overflow-hidden border border-white/8 mb-4 bg-black">
                    <StageTelemetryGraphic index={idx} />
                    <span className="absolute bottom-2.5 inset-x-0 text-center font-mono-label text-[9px] text-[#14f884]/85">
                      {stage.previewLabel}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 font-mono-label text-[9.5px] text-[#14f884] mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#14f884]" />
                    <span>
                      {stage.num} — {stage.word}
                    </span>
                  </div>

                  <h3 className="text-[clamp(0.95rem,1.35vw,1.25rem)] font-bold text-white leading-[1.28]">
                    {stage.title}
                  </h3>

                  <p className="mt-2.5 text-[clamp(0.75rem,0.98vw,0.88rem)] text-[#a9bfb8] font-light leading-[1.52]">
                    {stage.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
