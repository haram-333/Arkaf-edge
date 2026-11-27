"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroVortexCanvas from "@/components/canvas/HeroVortexCanvas";
import { HERO_CONTENT } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

/** Renders `" × "`-delimited hero keywords with luminous emerald separators. */
function DisciplineTokens({ text }: { text: string }) {
  const parts = text.split(" × ");
  return (
    <>
      {parts.map((item, idx) => (
        <span key={item} className="inline-flex items-center gap-1.5">
          <span>{item}</span>
          {idx < parts.length - 1 && (
            <span className="text-[#14f884] drop-shadow-[0_0_6px_rgba(20,248,132,0.7)]">
              ×
            </span>
          )}
        </span>
      ))}
    </>
  );
}

export default function HeroSection() {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const heroLayerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<number>(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const heroEl = heroLayerRef.current;
    if (!wrapper || !heroEl) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;

          // 0.00 -> 0.36: Hero copy softly scales & dissolves into the vortex before Sustainability arrives
          const heroOpacity = Math.max(0, 1 - Math.max(0, (p - 0.03) / 0.30));
          const heroScale = 1 + Math.min(p / 0.36, 1) * 0.05;
          const heroBlur = Math.min(Math.max(0, (p - 0.05) / 0.28) * 7, 7);
          heroEl.style.opacity = String(heroOpacity);
          heroEl.style.transform = `scale(${heroScale.toFixed(4)})`;
          heroEl.style.filter = `blur(${heroBlur.toFixed(1)}px)`;
          heroEl.style.pointerEvents = heroOpacity > 0.25 ? "auto" : "none";
        },
      });

      return () => st.kill();
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={wrapperRef}
      className="relative z-10 h-[155vh] bg-[#050b09]"
    >
      <div className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden flex items-center bg-[#050b09]">
        {/* Realtime 3D Emerald Particle Vortex Tunnel */}
        <HeroVortexCanvas progressRef={progressRef} />

        {/* Subtle dark readability vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 70% at 24% 52%, rgba(5,11,9,0.62) 0%, rgba(5,11,9,0.14) 60%, rgba(5,11,9,0.48) 100%)",
          }}
        />

        {/* Hero Foreground Stage */}
        <div
          ref={heroLayerRef}
          className="relative z-10 w-full max-w-[1160px] mx-auto px-5 sm:px-14 pt-20 pb-6 sm:pb-8 flex flex-col justify-between h-full will-change-transform"
        >
          <div className="my-auto">
            {/* Eyebrow pill with crisp emerald spotlight border & contrast */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#14f884]/60 bg-[#05261b]/88 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-2.5 mb-5 sm:mb-8 shadow-[0_0_26px_rgba(20,248,132,0.28),inset_0_1px_1px_rgba(255,255,255,0.24)] max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-[#14f884] shrink-0 drop-shadow-[0_0_8px_rgba(20,248,132,0.85)]" />
              <span className="font-mono-label text-[9.5px] sm:text-[11.5px] font-semibold tracking-[0.14em] text-[#ecfff5] flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <DisciplineTokens text={HERO_CONTENT.eyebrow} />
              </span>
            </div>

            {/* EXACT 3-Line Display Headline from doc */}
            <h1 className="text-[clamp(2.15rem,5.6vw,5.3rem)] font-medium tracking-[-0.038em] leading-[1.02] uppercase">
              <span className="block text-white whitespace-nowrap">
                {HERO_CONTENT.line1}
              </span>
              <span className="block text-white whitespace-nowrap">
                {HERO_CONTENT.line2}
              </span>
              <span className="block text-[#14f884] neon-text-glow whitespace-nowrap">
                {HERO_CONTENT.line3Accent}
              </span>
            </h1>

            {/* Generous Editorial Subtitle */}
            <p className="mt-4 sm:mt-6 max-w-[680px] text-[clamp(0.92rem,1.55vw,1.25rem)] text-[#c7d6d1] font-light leading-[1.54]">
              {HERO_CONTENT.subtitle}
            </p>

            {/* The 3 Hero CTAs from Website Written Content docx */}
            <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-3 sm:gap-3.5">
              {/* 1. What We Do */}
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0ffa7f] text-[#050b09] font-mono-label text-[10px] sm:text-[11.5px] font-semibold px-5 sm:px-6 py-3.5 sm:py-4 neon-box-glow hover:scale-[1.03] active:scale-[0.99] transition-transform"
              >
                {HERO_CONTENT.primaryCta}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {/* 2. Discover ARKAF Edge -> scrolls straight into Sustainability below */}
              <div className="liquid-glass-btn-wrap">
                <a
                  href="#sustainability"
                  className="liquid-glass-btn text-[#c7f5dd] hover:text-[#14f884] font-mono-label text-[10px] sm:text-[11.5px] font-semibold px-5 sm:px-6 py-3.5 sm:py-4"
                >
                  <span className="liquid-glass-btn-shine" />
                  <span className="relative z-10 flex items-center gap-2">
                    {HERO_CONTENT.discoverCta}
                    <ArrowRight className="w-3.5 h-3.5 text-[#14f884]" />
                  </span>
                </a>
              </div>

              {/* 3. Explore Our Work */}
              <div className="liquid-glass-btn-wrap">
                <a
                  href="#work"
                  className="liquid-glass-btn text-white hover:text-[#14f884] font-mono-label text-[10px] sm:text-[11.5px] font-semibold px-5 sm:px-6 py-3.5 sm:py-4"
                >
                  <span className="liquid-glass-btn-shine" />
                  <span className="relative z-10">{HERO_CONTENT.secondaryCta}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Utility Row with Prominent Right Discipline Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="inline-flex items-center gap-2 font-mono-label text-[9.5px] sm:text-[10.5px] font-medium text-[#b8d4c9]">
              <span className="w-4 h-[1px] bg-[#14f884]" />
              <span>ARKAF EDGE</span>
            </span>

            <div className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full border border-[#14f884]/55 bg-[#05261b]/88 backdrop-blur-md px-3.5 sm:px-5 py-1.5 sm:py-2 shadow-[0_0_24px_rgba(20,248,132,0.24),inset_0_1px_1px_rgba(255,255,255,0.22)]">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#14f884] animate-pulse-dot shrink-0 shadow-[0_0_10px_#14f884]" />
              <span className="font-mono-label text-[9px] sm:text-[11px] font-semibold tracking-[0.13em] text-[#ecfff5] inline-flex flex-wrap items-center gap-x-1.5">
                <DisciplineTokens text={HERO_CONTENT.bottomRight} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
