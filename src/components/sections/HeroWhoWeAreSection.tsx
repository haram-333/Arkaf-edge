"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import HeroVortexCanvas from "@/components/canvas/HeroVortexCanvas";
import { HERO_CONTENT, BRAND_STATEMENT } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export default function HeroWhoWeAreSection() {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const heroLayerRef = useRef<HTMLDivElement | null>(null);
  const whoLayerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<number>(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const heroEl = heroLayerRef.current;
    const whoEl = whoLayerRef.current;
    if (!wrapper || !heroEl || !whoEl) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;

          // 0.00 -> 0.28: Hero dissolves cleanly into the vortex tunnel warp
          const heroOpacity = Math.max(0, 1 - Math.max(0, (p - 0.04) / 0.22));
          const heroScale = 1 + Math.min(p / 0.28, 1) * 0.05;
          const heroBlur = Math.min(Math.max(0, (p - 0.06) / 0.22) * 8, 8);
          heroEl.style.opacity = String(heroOpacity);
          heroEl.style.transform = `scale(${heroScale})`;
          heroEl.style.filter = `blur(${heroBlur.toFixed(1)}px)`;
          heroEl.style.pointerEvents = heroOpacity > 0.25 ? "auto" : "none";

          // 0.42 -> 0.60 fade in | 0.60 -> 0.78 hold | 0.78 -> 0.94 fade to pure #000000
          let whoOpacity = 0;
          let whoY = 28;
          if (p >= 0.42 && p < 0.60) {
            const t = (p - 0.42) / 0.18;
            whoOpacity = t;
            whoY = (1 - t) * 28;
          } else if (p >= 0.60 && p <= 0.78) {
            whoOpacity = 1;
            whoY = 0;
          } else if (p > 0.78 && p <= 0.94) {
            const t = (p - 0.78) / 0.16;
            whoOpacity = 1 - t;
            whoY = -t * 22;
          }
          whoEl.style.opacity = String(Math.max(0, Math.min(1, whoOpacity)));
          whoEl.style.transform = `translate3d(0, ${whoY.toFixed(1)}px, 0)`;
          whoEl.style.pointerEvents = whoOpacity > 0.3 ? "auto" : "none";
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
      className="relative h-[320vh] bg-[#050b09]"
    >
      <div id="who-we-are" className="absolute top-[56%] left-0 h-1 w-1" />

      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
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

        {/* STAGE 1 — HERO LAYER (exact measured scale from Screenshot 1 + responsive mobile fit) */}
        <div
          ref={heroLayerRef}
          className="relative z-10 w-full max-w-[1160px] mx-auto px-5 sm:px-14 pt-20 pb-6 sm:pb-8 flex flex-col justify-between h-full will-change-transform"
        >
          <div className="my-auto">
            {/* Eyebrow pill matching screenshot 1 */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#14f884]/40 bg-[#050b09]/70 backdrop-blur-sm px-3.5 sm:px-4 py-1.5 mb-5 sm:mb-8">
              <Sparkles className="w-3 h-3 text-[#14f884] shrink-0" />
              <span className="font-mono-label text-[9px] sm:text-[11px] text-[#c7f5dd]">
                {HERO_CONTENT.eyebrow}
              </span>
            </div>

            {/* EXACT 2-Line Massive Display Headline locked against wrapping on desktop, crisp on mobile */}
            <h1 className="text-[clamp(2.15rem,5.7vw,5.4rem)] font-black tracking-[-0.03em] leading-[1.03] uppercase">
              <span className="block text-white whitespace-nowrap">
                {HERO_CONTENT.line1}
                <span className="text-white ml-1.5 sm:ml-2">•</span>
              </span>
              <span className="block sm:whitespace-nowrap">
                <span className="text-[#14f884] neon-text-glow">
                  {HERO_CONTENT.line2Accent}
                </span>
                <span className="text-white mx-1.5 sm:mx-2">•</span>
                <span className="text-white">{HERO_CONTENT.line2End}</span>
              </span>
            </h1>

            {/* Generous Editorial Subtitle */}
            <p className="mt-4 sm:mt-6 max-w-[660px] text-[clamp(0.92rem,1.75vw,1.5rem)] text-[#c7d6d1] font-light leading-[1.52]">
              {HERO_CONTENT.subtitle}
            </p>

            {/* Exact Dual Pill CTAs matching Screenshot 1 */}
            <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2.5 sm:gap-3 rounded-full bg-[#0ffa7f] text-[#050b09] font-mono-label text-[10.5px] sm:text-[12px] font-bold px-6 sm:px-8 py-3.5 sm:py-4 neon-box-glow hover:scale-[1.03] active:scale-[0.99] transition-transform"
              >
                {HERO_CONTENT.primaryCta}
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a
                href="#work"
                className="inline-flex items-center justify-center gap-2.5 sm:gap-3 rounded-full border border-white/30 bg-[#050b09]/55 backdrop-blur-sm text-white font-mono-label text-[10.5px] sm:text-[12px] font-semibold px-6 sm:px-8 py-3.5 sm:py-4 hover:border-[#14f884] hover:text-[#14f884] transition-colors"
              >
                {HERO_CONTENT.secondaryCta}
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>

          {/* Clean Borderless Bottom Utility Row matching Screenshot 1 */}
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono-label text-[9.5px] sm:text-[11px] text-[#8fa8a0]">
              {HERO_CONTENT.bottomLeft}
            </span>
            <span className="hidden sm:inline-flex items-center gap-2 font-mono-label text-[10px] sm:text-[11px] text-[#8fa8a0]">
              <span className="w-2 h-2 rounded-full bg-[#14f884] animate-pulse-dot" />
              {HERO_CONTENT.bottomRight}
            </span>
          </div>
        </div>

        {/* STAGE 2 — WHO WE ARE LAYER (exact measured massive scale + clean mobile padding) */}
        <div
          ref={whoLayerRef}
          style={{ opacity: 0, pointerEvents: "none" }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-5 sm:px-12 will-change-transform"
        >
          <span className="inline-block rounded-[5px] bg-[#a9f5cf] text-[#051a12] font-mono-label text-[10px] sm:text-[11px] font-bold px-3.5 sm:px-4 py-1.5 mb-5 sm:mb-7 shadow-[0_0_26px_rgba(169,245,207,0.38)]">
            {BRAND_STATEMENT.badge}
          </span>

          <h2 className="text-[clamp(2.1rem,6.4vw,5.8rem)] font-black tracking-[-0.03em] leading-[1.06] max-w-5xl">
            <span className="block text-white">{BRAND_STATEMENT.headlineWhite}</span>
            <span className="block text-[#14f884] neon-text-glow">
              {BRAND_STATEMENT.headlineGreen}
            </span>
          </h2>

          <p className="mt-5 sm:mt-7 max-w-[820px] text-[clamp(0.95rem,2.05vw,1.75rem)] text-[#dce8e4] font-light leading-[1.54]">
            {BRAND_STATEMENT.body}
          </p>

          <a
            href="#services"
            className="mt-7 sm:mt-9 inline-flex items-center gap-2.5 font-mono-label text-[10.5px] sm:text-[12px] font-semibold text-[#14f884] hover:gap-4 transition-all"
          >
            {BRAND_STATEMENT.cta}
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
