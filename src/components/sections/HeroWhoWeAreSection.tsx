"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroVortexCanvas from "@/components/canvas/HeroVortexCanvas";
import { HERO_CONTENT, SUSTAINABILITY_CONTENT } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

interface Hotspot {
  id: string;
  category: string;
  metric: string;
  detail: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  tooltipPos: "left" | "right" | "top";
}

// 4 Interactive Sensor Nodes from Alethia reference
const SENSOR_HOTSPOTS: Hotspot[] = [
  {
    id: "circularity",
    category: "CIRCULAR UP-CYCLING",
    metric: "12,000+ KG RECLAIMED",
    detail: "Repurposing industrial textile & material discard into scalable commercial assets.",
    top: "48%",
    left: "12%",
    tooltipPos: "right",
  },
  {
    id: "accountability",
    category: "VERIFIABLE METRICS",
    metric: "ZERO GREENWASHING",
    detail: "Scientific clarity & commercial logic translate into verifiable, compliance-ready metrics.",
    top: "58%",
    left: "35%",
    tooltipPos: "right",
  },
  {
    id: "nature-tech",
    category: "NATURE-POSITIVE TECH",
    metric: "COMPOUNDING REACH",
    detail: "Organic ecosystems designed to compound over time without endless paid ad spend.",
    bottom: "18%",
    left: "62%",
    tooltipPos: "top",
  },
  {
    id: "regenerative",
    category: "REGENERATIVE SCALE",
    metric: "GLOBAL BRAND CALIBER",
    detail: "Giving ethical organisations access to the strategic caliber of global market leaders.",
    top: "64%",
    right: "15%",
    tooltipPos: "left",
  },
];

export default function HeroWhoWeAreSection() {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const heroLayerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<number>(0);

  // Sustainability Layer Refs
  const sustLayerRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const blurOverlayRef = useRef<HTMLDivElement | null>(null);
  const fogVideoRef = useRef<HTMLVideoElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subtextRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const pillsRef = useRef<HTMLDivElement | null>(null);
  const pinsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const heroEl = heroLayerRef.current;
    const sustEl = sustLayerRef.current;
    const bgImage = bgImageRef.current;
    const blurOverlay = blurOverlayRef.current;
    const fogVideo = fogVideoRef.current;
    const eyebrow = eyebrowRef.current;
    const headline = headlineRef.current;
    const subtext = subtextRef.current;
    const cta = ctaRef.current;
    const pills = pillsRef.current;

    if (!wrapper || !heroEl || !sustEl || !bgImage) return;

    const ctx = gsap.context(() => {
      const activePins = pinsRef.current.filter(Boolean);
      const headlineLines = headline ? headline.querySelectorAll(".reveal-line") : [];

      // MASTER TIMELINE: Seamlessly pins Hero and transitions into full-height Sustainability!
      // Progress Breakdown:
      // 0.00 -> 0.20: Hero active
      // 0.20 -> 0.30: Hero dissolves cleanly
      // 0.22 -> 0.58: Sustainability nature image is ALREADY AT TOP IN FULL HEIGHT, zooming out & clearing blur
      // 0.56 -> 0.78: GSAP-style masked text reveal
      // 0.78 -> 0.95: Interactive hold state
      // 0.95 -> 1.00: Smooth unpin transition into Services
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      // --- PHASE 1: HERO DISSOLVES (0.00 -> 0.28) ---
      tl.fromTo(
        heroEl,
        { opacity: 1, scale: 1, filter: "blur(0px)" },
        {
          opacity: 0,
          scale: 1.04,
          filter: "blur(8px)",
          ease: "power2.in",
          duration: 0.24,
        },
        0.04
      );

      // --- PHASE 2: SUSTAINABILITY NATURE IMAGE IS ALREADY AT TOP (0.18 -> 0.58) ---
      // Fade in the container without sliding from bottom (already full-height at top!)
      tl.fromTo(
        sustEl,
        { opacity: 0, pointerEvents: "none" },
        { opacity: 1, pointerEvents: "auto", ease: "power2.out", duration: 0.12 },
        0.18
      );

      // Background landscape ZOOMS OUT from 1.55 to 1.02 with ample bleed so height never clips
      tl.fromTo(
        bgImage,
        { scale: 1.55, y: 35 },
        { scale: 1.02, y: -15, ease: "power2.inOut", duration: 0.38 },
        0.20
      );

      // Blur overlay clears from 18px down to 0px before text reveal
      if (blurOverlay) {
        tl.fromTo(
          blurOverlay,
          { opacity: 1, backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" },
          {
            opacity: 0,
            backdropFilter: "blur(0px)",
            WebkitBackdropFilter: "blur(0px)",
            ease: "power2.out",
            duration: 0.34,
          },
          0.20
        );
      }

      // Fog video follows with subtle parallax drift
      if (fogVideo) {
        tl.fromTo(
          fogVideo,
          { y: 25, opacity: 0.3 },
          { y: -15, opacity: 0.8, ease: "power2.inOut", duration: 0.38 },
          0.20
        );
      }

      // --- PHASE 3: GSAP-STYLE TEXT REVEAL AFTER BLUR CLEARS (0.54 -> 0.78) ---
      if (eyebrow) {
        tl.fromTo(
          eyebrow,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, ease: "power3.out", duration: 0.10 },
          0.54
        );
      }

      if (headlineLines.length > 0) {
        tl.fromTo(
          headlineLines,
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.04,
            ease: "power3.out",
            duration: 0.16,
          },
          0.56
        );
      }

      if (subtext) {
        tl.fromTo(
          subtext,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.12 },
          0.64
        );
      }

      if (cta) {
        tl.fromTo(
          cta,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.10 },
          0.68
        );
      }

      if (activePins.length > 0) {
        tl.fromTo(
          activePins,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.03, ease: "back.out(2)", duration: 0.14 },
          0.62
        );
      }

      if (pills) {
        tl.fromTo(
          pills,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.10 },
          0.70
        );
      }

      // --- PHASE 4: INTERACTIVE HOLD (0.78 -> 0.95) ---
      tl.to({}, { duration: 0.17 }, 0.78);
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={wrapperRef}
      className="relative h-[340vh] bg-[#050b09]"
    >
      <div id="who-we-are" className="absolute top-[30%] left-0 h-1 w-1" />
      <div id="sustainability" className="absolute top-[30%] left-0 h-1 w-1" />

      {/* STICKY FULL-SCREEN 100VH / 100DVH VIEWPORT STAGE */}
      <div className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-[#050b09]">
        {/* =====================================================================
            STAGE 1: HERO LAYER (Particle Vortex + Display Typography + 3 CTAs)
        ===================================================================== */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <HeroVortexCanvas progressRef={progressRef} />
        </div>

        {/* Hero Content Container */}
        <div
          ref={heroLayerRef}
          className="relative z-20 w-full max-w-[1160px] mx-auto px-5 sm:px-14 pt-20 pb-6 sm:pb-8 flex flex-col justify-between h-full will-change-transform"
        >
          <div className="my-auto">
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#14f884]/40 bg-[#050b09]/70 backdrop-blur-sm px-3.5 sm:px-4 py-1.5 mb-5 sm:mb-8">
              <Sparkles className="w-3 h-3 text-[#14f884] shrink-0" />
              <span className="font-mono-label text-[9px] sm:text-[11px] text-[#c7f5dd]">
                {HERO_CONTENT.eyebrow}
              </span>
            </div>

            {/* 3-Line Massive Display Headline */}
            <h1 className="text-[clamp(2.15rem,5.6vw,5.3rem)] font-black tracking-[-0.03em] leading-[1.02] uppercase">
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

            {/* Subtitle */}
            <p className="mt-4 sm:mt-6 max-w-[680px] text-[clamp(0.92rem,1.55vw,1.25rem)] text-[#c7d6d1] font-light leading-[1.54]">
              {HERO_CONTENT.subtitle}
            </p>

            {/* 3 Hero CTAs */}
            <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-3 sm:gap-3.5">
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0ffa7f] text-[#050b09] font-mono-label text-[10px] sm:text-[11.5px] font-bold px-5 sm:px-6 py-3.5 sm:py-4 neon-box-glow hover:scale-[1.03] active:scale-[0.99] transition-transform"
              >
                {HERO_CONTENT.primaryCta}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#sustainability"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#14f884]/40 bg-[#051a12]/75 backdrop-blur-sm text-[#c7f5dd] hover:text-[#14f884] hover:border-[#14f884] font-mono-label text-[10px] sm:text-[11.5px] font-semibold px-5 sm:px-6 py-3.5 sm:py-4 transition-all hover:scale-[1.03] active:scale-[0.99]"
              >
                {HERO_CONTENT.discoverCta}
                <ArrowRight className="w-3.5 h-3.5 text-[#14f884]" />
              </a>

              <a
                href="#work"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-[#050b09]/55 backdrop-blur-sm text-white font-mono-label text-[10px] sm:text-[11.5px] font-semibold px-5 sm:px-6 py-3.5 sm:py-4 hover:border-[#14f884] hover:text-[#14f884] transition-all hover:scale-[1.03] active:scale-[0.99]"
              >
                {HERO_CONTENT.secondaryCta}
              </a>
            </div>
          </div>

          {/* Bottom Utility Row */}
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

        {/* =====================================================================
            STAGE 2: SUSTAINABILITY ECOSYSTEM LAYER (ALREADY AT TOP, FULL-HEIGHT!)
            - NEVER slides up from bottom
            - Starts ZOOMED IN with Bokeh Blur Overlay
            - Smoothly ZOOMS OUT to full panorama, clears blur, then GSAP Text Reveal
        ===================================================================== */}
        <div
          ref={sustLayerRef}
          style={{ opacity: 0, pointerEvents: "none" }}
          className="absolute inset-0 z-30 w-full h-full will-change-transform"
        >
          {/* Nature Landscape Image (2880x1800 Uncompressed) with 12vh top/bottom bleed to guarantee full height */}
          <div
            ref={bgImageRef}
            className="absolute -top-[12vh] -bottom-[12vh] -left-[6vw] -right-[6vw] z-0 pointer-events-none will-change-transform"
          >
            <Image
              src="/images/sustainability-landscape.jpg"
              alt="ARKAF Edge Nature-Positive Terrarium Landscape"
              fill
              priority
              unoptimized
              className="object-cover object-center"
              sizes="100vw"
            />
            {/* Soft gradient vignette protecting text legibility without obscuring nature */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(3,21,19,0.52) 0%, rgba(3,21,19,0.12) 45%, rgba(3,21,19,0.55) 100%)",
              }}
            />
          </div>

          {/* Dreamlike Bokeh Blur Overlay Before Text Reveal */}
          <div
            ref={blurOverlayRef}
            className="pointer-events-none absolute -inset-16 z-[12] bg-[#031513]/25 will-change-[opacity,backdrop-filter]"
            style={{
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          />

          {/* Continuous Corner & Floor Fog Video */}
          <div className="absolute -inset-10 z-[14] pointer-events-none overflow-hidden">
            <video
              ref={fogVideoRef}
              src="/videos/clouds-fog.webm"
              autoPlay
              loop
              muted
              playsInline
              className="absolute -top-[8vh] -left-[5vw] w-[110vw] h-[116vh] object-cover mix-blend-screen opacity-75 will-change-transform"
              style={{
                maskImage:
                  "radial-gradient(ellipse 90% 75% at 50% 85%, black 20%, rgba(0,0,0,0.85) 60%, transparent 85%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 90% 75% at 50% 85%, black 20%, rgba(0,0,0,0.85) 60%, transparent 85%)",
              }}
            />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-[#14f884]/10 blur-[80px]" />
            <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#c6f19d]/10 blur-[80px]" />
          </div>

          {/* 4 Interactive 5-Dot Sensor Nodes (Exact Alethia 5-Dot Matrix with inline labels) */}
          <div className="absolute inset-0 z-30 pointer-events-none">
            {SENSOR_HOTSPOTS.map((spot, idx) => {
              const isActive = activeHotspot === spot.id;

              return (
                <div
                  key={spot.id}
                  ref={(el) => {
                    pinsRef.current[idx] = el;
                  }}
                  style={{
                    top: spot.top,
                    left: spot.left,
                    right: spot.right,
                    bottom: spot.bottom,
                  }}
                  className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 will-change-transform"
                >
                  {/* 5-Dot Matrix Sensor Pin Button + Inline Label matching Alethia */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveHotspot(isActive ? null : spot.id)}
                      onMouseEnter={() => setActiveHotspot(spot.id)}
                      onMouseLeave={() => setActiveHotspot(null)}
                      aria-label={`Inspect ${spot.category}`}
                      className="group relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#c6f19d] text-[#051f10] shadow-[0_0_20px_rgba(198,241,157,0.7)] flex items-center justify-center transition-all duration-300 hover:scale-115 focus:outline-none cursor-pointer shrink-0"
                    >
                      <span className="absolute -inset-1 rounded-full bg-[#c6f19d]/40 animate-ping pointer-events-none" />

                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 fill-current transition-transform duration-300 group-hover:rotate-45"
                      >
                        <circle cx="12" cy="12" r="1.8" />
                        <circle cx="12" cy="6" r="1.8" />
                        <circle cx="12" cy="18" r="1.8" />
                        <circle cx="6" cy="12" r="1.8" />
                        <circle cx="18" cy="12" r="1.8" />
                      </svg>
                    </button>

                    {/* Inline Tag directly beside the dot (Alethia reference) */}
                    <div
                      onClick={() => setActiveHotspot(isActive ? null : spot.id)}
                      className="hidden sm:inline-block cursor-pointer select-none font-mono-label text-[8px] uppercase tracking-wider font-bold text-[#c6f19d] drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-[#c6f19d]/30 whitespace-nowrap hover:border-[#c6f19d] transition-colors"
                    >
                      {spot.metric}
                    </div>
                  </div>

                  {/* Tooltip Capsule (Reveals on Hover / Tap) */}
                  <div
                    className={`absolute z-40 transition-all duration-300 ease-out pointer-events-none ${
                      isActive
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-1.5 pointer-events-none"
                    } ${
                      spot.tooltipPos === "right"
                        ? "left-12 sm:left-14 top-1/2 -translate-y-1/2"
                        : spot.tooltipPos === "left"
                        ? "right-12 sm:right-14 top-1/2 -translate-y-1/2"
                        : "bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 rounded-2xl bg-black/90 border border-[#c6f19d]/60 backdrop-blur-md px-3.5 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.85)] min-w-[200px] max-w-[260px]">
                      <div className="w-2 h-2 rounded-full bg-[#14f884] shrink-0 animate-pulse" />
                      <div className="text-left">
                        <span className="block font-mono-label text-[7.5px] text-[#14f884] font-bold tracking-wider uppercase">
                          {spot.category}
                        </span>
                        <span className="block text-[10.5px] font-black text-white leading-tight mt-0.5">
                          {spot.metric}
                        </span>
                        <span className="block text-[8.5px] text-[#c7d6d1] font-light leading-snug mt-0.5">
                          {spot.detail}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full-Height Content Container (Spans edge-to-edge under blurred glass navbar) */}
          <div className="relative z-20 w-full max-w-[1360px] mx-auto px-5 sm:px-12 h-screen h-[100dvh] flex flex-col justify-between pt-24 sm:pt-28 pb-6 sm:pb-8 pointer-events-none">
            {/* Top Row: Eyebrow + Upper-Right Headline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Eyebrow */}
              <div ref={eyebrowRef} className="lg:col-span-4 pointer-events-auto">
                <span className="block font-mono-label text-[9px] sm:text-[10.5px] text-[#14f884] font-bold uppercase tracking-[0.16em] leading-relaxed">
                  REAL-TIME,<br />
                  CIRCULAR-BACKED<br />
                  IMPACT INTELLIGENCE
                </span>
              </div>

              {/* Upper-Right Headline & Subtitle */}
              <div className="lg:col-span-8 lg:pl-6 pointer-events-auto">
                <h2
                  ref={headlineRef}
                  className="text-[clamp(1.2rem,1.9vw,1.85rem)] font-medium sm:font-semibold text-[#f5f4f2] tracking-[-0.025em] leading-[1.3]"
                >
                  <span className="block overflow-hidden py-0.5">
                    <span className="reveal-line block will-change-transform">
                      The future shouldn&apos;t need another marketing campaign.
                    </span>
                  </span>
                  <span className="block overflow-hidden py-0.5 mt-0.5">
                    <span className="reveal-line block text-[#14f884] font-bold will-change-transform">
                      It needs businesses willing to build it.
                    </span>
                  </span>
                </h2>

                <p
                  ref={subtextRef}
                  className="mt-3 max-w-lg text-[clamp(0.8rem,0.95vw,0.88rem)] text-[#d0ded9] font-light leading-relaxed"
                >
                  Sustainability isn&apos;t a green badge we attach to our services. It is one of the reasons ARKAF Edge exists. We bring the strategic caliber and technology of global market leaders to founders building what comes next.
                </p>

                {/* Clean Action Buttons */}
                <div ref={ctaRef} className="mt-4 sm:mt-5 flex items-center gap-3">
                  <a
                    href="#services"
                    className="inline-flex items-center gap-2 rounded-full bg-[#14f884] text-[#050b09] px-5 sm:px-6 py-2.5 sm:py-3 font-mono-label text-[10px] sm:text-[11px] font-bold shadow-[0_0_18px_rgba(20,248,132,0.35)] hover:bg-[#a9f5cf] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>DISCOVER ARKAF EDGE</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </a>

                  <a
                    href="#work"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white px-4 sm:px-5 py-2.5 sm:py-3 font-mono-label text-[9.5px] sm:text-[10.5px] font-medium hover:border-[#14f884] hover:text-[#14f884] transition-all cursor-pointer"
                  >
                    <span>CIRCULAR WORK ↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Lower Row: 9 Focus Sectors Pills */}
            <div ref={pillsRef} className="pt-3 pointer-events-auto border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-mono-label text-[8px] sm:text-[9px] text-[#14f884] font-bold uppercase tracking-wider">
                  PARTICULAR AFFECTION FOR:
                </span>
                <span className="hidden sm:inline-block font-mono-label text-[8px] text-white/40">
                  CIRCULAR &amp; REGENERATIVE VERTICALS
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {SUSTAINABILITY_CONTENT.industries.map((ind) => (
                  <span
                    key={ind}
                    className="px-2.5 py-1 rounded-full border border-white/15 bg-black/60 backdrop-blur-md font-mono-label text-[8px] sm:text-[9px] text-[#d4ede4] hover:border-[#14f884]/60 hover:text-[#14f884] transition-colors"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
