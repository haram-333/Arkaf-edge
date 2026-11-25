"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticleWaveCanvas from "@/components/canvas/ParticleWaveCanvas";
import { APPROACH_STAGES, ARKAF_METHOD_HEADER } from "@/data/content";

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

        {/* Pinned Top-Left Header: Full ARKAF Method Identity */}
        <div className="relative z-20 w-full max-w-[1380px] mx-auto px-5 sm:px-10 pt-16 sm:pt-22">
          <div className="inline-flex items-center gap-2 font-mono-label text-[9.5px] sm:text-[11px] text-[#14f884] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14f884]" />
            <span>{ARKAF_METHOD_HEADER.badge}</span>
          </div>
          <h2 className="text-[clamp(1.1rem,2.35vw,2.2rem)] font-black tracking-[-0.025em] uppercase leading-[1.12] max-w-3xl">
            <span className="text-white">{ARKAF_METHOD_HEADER.line1} </span>
            <span className="text-[#14f884] neon-text-glow">
              {ARKAF_METHOD_HEADER.line2Accent}
            </span>
          </h2>
        </div>

        {/* Center Stacked Words & Stage Controls */}
        <div className="relative z-20 w-full max-w-[1380px] mx-auto px-5 sm:px-10 flex-1 flex flex-col justify-between lg:justify-center lg:items-center pt-2 pb-4 lg:py-0 lg:pb-6">
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
                  className={`block text-[clamp(1.65rem,4.7vw,4.35rem)] font-black tracking-[-0.03em] leading-[1.06] uppercase transition-all duration-300 cursor-pointer focus:outline-none ${
                    isActive
                      ? "text-white scale-100 drop-shadow-[0_0_24px_rgba(20,248,132,0.4)]"
                      : "text-white/30 hover:text-white/60 scale-[0.97]"
                  }`}
                >
                  {stage.word}
                </button>
              );
            })}

            <div className="mt-2.5 sm:mt-5 inline-flex items-center gap-2 text-[clamp(0.76rem,1.2vw,1.08rem)] text-[#d0dfd9] font-light">
              <span>Each essential. Each in</span>
              <span className="rounded-full border border-white/40 bg-[#051a12]/55 backdrop-blur-sm px-3 py-0.5 text-[0.88em] text-white font-normal">
                sync.
              </span>
            </div>
          </div>

          {/* Mobile/Tablet Docked Card Slot using CSS Grid stacking (Zero vertical clipping) */}
          <div className="lg:hidden w-full max-w-md mx-auto mt-2 flex flex-col items-center">
            {/* Quick selector tabs cleanly separated ABOVE the card */}
            <div className="flex items-center justify-center gap-2 mb-2 z-30">
              {APPROACH_STAGES.map((s, idx) => (
                <button
                  key={s.word}
                  type="button"
                  onClick={() => scrollToStage(idx)}
                  className={`px-3 py-1.5 rounded-full font-mono-label text-[9px] font-bold transition-all cursor-pointer ${
                    activeStage === idx
                      ? "bg-[#14f884] text-[#050b09] shadow-[0_0_14px_rgba(20,248,132,0.85)] scale-105"
                      : "bg-[#060f0c]/90 text-white/60 border border-white/15 hover:text-white hover:border-[#14f884]/40"
                  }`}
                >
                  {s.num} {s.word}
                </button>
              ))}
            </div>

            {/* Grid-stacked Docked Card Slot (auto-sizes naturally to tallest stage, overflow-y guard for tiny screens) */}
            <div className="grid grid-cols-1 w-full">
              {APPROACH_STAGES.map((stage, idx) => {
                const isActive = activeStage === idx;
                return (
                  <div
                    key={stage.num}
                    className={`col-start-1 row-start-1 transition-all duration-500 ease-out ${
                      isActive
                        ? "opacity-100 translate-y-0 pointer-events-auto z-10"
                        : "opacity-0 translate-y-4 pointer-events-none z-0"
                    }`}
                  >
                    <div
                      data-lenis-prevent
                      className="rounded-[16px] border border-white/15 bg-[#060f0c]/95 backdrop-blur-xl p-3.5 sm:p-4 shadow-[0_18px_40px_rgba(0,0,0,0.65)] max-h-[45dvh] overflow-y-auto"
                    >
                      <div className="relative h-[58px] rounded-[10px] overflow-hidden border border-white/8 mb-2.5 bg-black">
                        <StageTelemetryGraphic index={idx} />
                        <span className="absolute bottom-1 inset-x-0 text-center font-mono-label text-[8px] text-[#14f884]/90">
                          {stage.previewLabel}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {stage.steps.map((st, sIdx) => (
                          <div
                            key={st.step}
                            className={sIdx > 0 ? "pt-2 border-t border-white/10" : ""}
                          >
                            <div className="inline-flex items-center gap-1.5 font-mono-label text-[8.5px] text-[#14f884] mb-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#14f884]" />
                              <span>
                                {st.step} — {st.name}
                              </span>
                            </div>
                            <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">
                              {st.lead}
                            </h3>
                            <p className="mt-0.5 text-[11px] sm:text-xs text-[#a9bfb8] font-light leading-relaxed">
                              {st.desc}
                            </p>
                          </div>
                        ))}
                      </div>

                      {stage.isRepeat && (
                        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-end">
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#14f884]/15 border border-[#14f884]/40 px-2.5 py-0.5 font-mono-label text-[8.5px] font-bold text-[#14f884]">
                            ↻ {ARKAF_METHOD_HEADER.repeatLabel}
                          </span>
                        </div>
                      )}
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
                ? "right-8 xl:right-10 left-auto"
                : "left-8 xl:left-10 right-auto";

            return (
              <div
                key={stage.num}
                onClick={() => scrollToStage(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && scrollToStage(idx)}
                className={`hidden lg:block absolute top-[55%] -translate-y-1/2 w-[335px] xl:w-[375px] ${sideClass} z-20 cursor-pointer transition-all duration-500 ease-out ${
                  isActive
                    ? "opacity-100 -translate-y-1/2 pointer-events-auto"
                    : "opacity-0 translate-y-[-43%] pointer-events-none"
                }`}
              >
                <div
                  data-lenis-prevent
                  className="rounded-[18px] border border-white/15 bg-[#060f0c]/92 backdrop-blur-xl p-4 xl:p-5 shadow-[0_24px_60px_rgba(0,0,0,0.68)] hover:border-[#14f884]/60 transition-colors max-h-[68dvh] overflow-y-auto"
                >
                  <div className="relative h-[88px] xl:h-[104px] rounded-[12px] overflow-hidden border border-white/8 mb-3 bg-black">
                    <StageTelemetryGraphic index={idx} />
                    <span className="absolute bottom-2 inset-x-0 text-center font-mono-label text-[8.5px] text-[#14f884]/85">
                      {stage.previewLabel}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {stage.steps.map((st, sIdx) => (
                      <div
                        key={st.step}
                        className={sIdx > 0 ? "pt-2.5 border-t border-white/10" : ""}
                      >
                        <div className="inline-flex items-center gap-1.5 font-mono-label text-[9px] text-[#14f884] mb-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#14f884]" />
                          <span>
                            {st.step} — {st.name}
                          </span>
                        </div>
                        <h3 className="text-[13.5px] xl:text-[15px] font-bold text-white leading-snug">
                          {st.lead}
                        </h3>
                        <p className="mt-0.5 text-[11.5px] xl:text-[12.5px] text-[#a9bfb8] font-light leading-relaxed">
                          {st.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {stage.isRepeat && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#14f884]/15 border border-[#14f884]/40 px-2.5 py-0.5 font-mono-label text-[9px] font-bold text-[#14f884]">
                        ↻ {ARKAF_METHOD_HEADER.repeatLabel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
