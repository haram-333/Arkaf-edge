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
  const stickyStageRef = useRef<HTMLDivElement | null>(null);
  const heroLayerRef = useRef<HTMLDivElement | null>(null);
  const whoLayerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<number>(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stickyStage = stickyStageRef.current;
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

          // 0.38 -> 0.54 fade in | 0.54 -> 0.82 hold | 0.82 -> 0.98 seamless transition
          let whoOpacity = 0;
          let whoY = 28;
          if (p >= 0.38 && p < 0.54) {
            const t = (p - 0.38) / 0.16;
            whoOpacity = t;
            whoY = (1 - t) * 28;
          } else if (p >= 0.54 && p <= 0.82) {
            whoOpacity = 1;
            whoY = 0;
          } else if (p > 0.82 && p <= 0.98) {
            const t = (p - 0.82) / 0.16;
            whoOpacity = 1 - t;
            whoY = -t * 22;
          }
          whoEl.style.opacity = String(Math.max(0, Math.min(1, whoOpacity)));
          whoEl.style.transform = `translate3d(0, ${whoY.toFixed(1)}px, 0)`;
          whoEl.style.pointerEvents = whoOpacity > 0.3 ? "auto" : "none";

          // At the end of Hero (p: 0.84 -> 0.99), fade out the entire sticky stage (canvas + dark bg)
          // so it dissolves in place into pure transparency instead of sliding up like a garage door!
          let stageOpacity = 1;
          if (p > 0.84) {
            stageOpacity = Math.max(0, 1 - (p - 0.84) / 0.14);
          }
          if (stickyStage) {
            stickyStage.style.opacity = String(stageOpacity);
          }
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
      className="relative h-[250vh] bg-transparent"
    >
      <div id="who-we-are" className="absolute top-[56%] left-0 h-1 w-1" />

      <div
        ref={stickyStageRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-[#050b09] will-change-[opacity]"
      >
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
            {/* Eyebrow pill matching screenshot 1 with Liquid Glass */}
            <div className="inline-flex items-center gap-2 rounded-full liquid-glass-pill px-3.5 sm:px-4 py-1.5 mb-5 sm:mb-8">
              <Sparkles className="w-3 h-3 text-[#14f884] shrink-0" />
              <span className="font-mono-label text-[9px] sm:text-[11px] text-[#c7f5dd]">
                {HERO_CONTENT.eyebrow}
              </span>
            </div>

            {/* EXACT 3-Line Massive Display Headline from revised docx */}
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

              {/* 2. Discover ARKAF Edge (Liquid Glass Specular Button) */}
              <div className="liquid-glass-btn-wrap">
                <a
                  href="#who-we-are"
                  className="liquid-glass-btn text-[#c7f5dd] hover:text-[#14f884] font-mono-label text-[10px] sm:text-[11.5px] font-semibold px-5 sm:px-6 py-3.5 sm:py-4"
                >
                  <span className="liquid-glass-btn-shine" />
                  <span className="relative z-10 flex items-center gap-2">
                    {HERO_CONTENT.discoverCta}
                    <ArrowRight className="w-3.5 h-3.5 text-[#14f884]" />
                  </span>
                </a>
              </div>

              {/* 3. Explore Our Work (Liquid Glass Specular Button) */}
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

          {/* Clean Borderless Bottom Utility Row */}
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 font-mono-label text-[9.5px] sm:text-[10.5px] text-[#8fa8a0]">
              <span className="w-4 h-[1px] bg-[#14f884]/70" />
              <span>ARKAF EDGE</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-2 font-mono-label text-[10px] sm:text-[11px] text-[#8fa8a0]">
              <span className="w-2 h-2 rounded-full bg-[#14f884] animate-pulse-dot" />
              {HERO_CONTENT.bottomRight}
            </span>
          </div>
        </div>

        {/* STAGE 2 — BRAND STATEMENT / WHO WE ARE LAYER (From Written Content docx) */}
        <div
          ref={whoLayerRef}
          style={{ opacity: 0, pointerEvents: "none" }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12 will-change-transform"
        >
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center my-auto">
            <span className="inline-block rounded-[5px] bg-[#a9f5cf] text-[#051a12] font-mono-label text-[9px] sm:text-[10px] font-semibold px-3 py-1 mb-2.5 sm:mb-3 shadow-[0_0_24px_rgba(169,245,207,0.38)]">
              {BRAND_STATEMENT.badge}
            </span>

            <h2 className="text-[clamp(1.75rem,3.8vw,3.2rem)] font-medium tracking-[-0.035em] leading-[1.08] max-w-3xl uppercase">
              <span className="block text-white">{BRAND_STATEMENT.headlineWhite}</span>
              <span className="block text-[#14f884] neon-text-glow">
                {BRAND_STATEMENT.headlineGreen}
              </span>
            </h2>

            <div className="mt-4 sm:mt-5 max-w-2xl space-y-2.5 text-center">
              {BRAND_STATEMENT.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={`text-[clamp(0.85rem,1.15vw,1.02rem)] leading-relaxed ${
                    i === BRAND_STATEMENT.paragraphs.length - 1
                      ? "text-[#14f884] font-semibold text-[clamp(0.92rem,1.25vw,1.08rem)]"
                      : "text-[#c7d6d1] font-light"
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Link seamlessly to the new Sustainability Section */}
            <div className="mt-6 sm:mt-8 pointer-events-auto flex items-center gap-3">
              <a
                href="#sustainability"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[#14f884] bg-[#14f884] px-6 sm:px-8 py-3.5 sm:py-4 font-mono-label text-[10.5px] sm:text-[11.5px] font-semibold text-[#050b09] shadow-[0_0_24px_rgba(20,248,132,0.45)] hover:bg-[#a9f5cf] hover:shadow-[0_0_36px_rgba(20,248,132,0.75)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>OUR COMMITMENT TO IMPACT</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
