"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";
import { SUSTAINABILITY_CONTENT } from "@/data/content";

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

// 4 Interactive Sensor Nodes from Alethia screenshots
const SENSOR_HOTSPOTS: Hotspot[] = [
  {
    id: "circularity",
    category: "CIRCULAR UP-CYCLING",
    metric: "12,000+ KG RECLAIMED",
    detail: "Repurposing industrial textile & material discard into scalable commercial assets.",
    top: "50%",
    left: "14%",
    tooltipPos: "right",
  },
  {
    id: "accountability",
    category: "VERIFIABLE METRICS",
    metric: "ZERO GREENWASHING",
    detail: "Scientific clarity & commercial logic translate into verifiable, compliance-ready metrics.",
    top: "58%",
    left: "36%",
    tooltipPos: "right",
  },
  {
    id: "nature-tech",
    category: "NATURE-POSITIVE TECH",
    metric: "COMPOUNDING REACH",
    detail: "Organic ecosystems designed to compound over time without endless paid ad spend.",
    bottom: "16%",
    left: "62%",
    tooltipPos: "top",
  },
  {
    id: "regenerative",
    category: "REGENERATIVE SCALE",
    metric: "GLOBAL BRAND CALIBER",
    detail: "Giving ethical organisations access to the strategic caliber of global market leaders.",
    top: "66%",
    right: "16%",
    tooltipPos: "left",
  },
];

export default function SustainabilitySection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fixedStageRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const fogVideoRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subtextRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const pillsRef = useRef<HTMLDivElement | null>(null);
  const pinsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Hotspot states (starts completely clean & closed)
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const fixedStage = fixedStageRef.current;
    const bgImage = bgImageRef.current;
    const fogVideo = fogVideoRef.current;
    const eyebrow = eyebrowRef.current;
    const headline = headlineRef.current;
    const subtext = subtextRef.current;
    const cta = ctaRef.current;
    const pills = pillsRef.current;

    if (!container || !fixedStage || !bgImage) return;

    const ctx = gsap.context(() => {
      const activePins = pinsRef.current.filter(Boolean);
      const headlineLines = headline ? headline.querySelectorAll(".reveal-line") : [];

      // MASTER TIMELINE:
      // Controlled by the scroll track, while the stage is FIXED AT TOP: 0 OF THE DEFAULT VIEWPORT.
      // Generous runway (320vh) for silky-smooth, cinematic animation pacing:
      // 0.00 -> 0.16: Stage softly fades in at top: 0
      // 0.14 -> 0.46: Cinematic zoom-out (1.38 -> 1.0) and direct blur clearing (12px -> 0px)
      // 0.44 -> 0.58: Organic fog video rolls in across floor and corners once panorama is clear
      // 0.52 -> 0.70: GSAP masked text reveal of headline lines, subtext, CTAs, sensor pins
      // 0.70 -> 0.88: Generous interactive exploration hold
      // 0.88 -> 0.98: Stage dissolves cleanly, handing over to next section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            // Manage visibility and pointer-events accurately
            if (p <= 0.01 || p >= 0.99) {
              fixedStage.style.visibility = "hidden";
              fixedStage.style.pointerEvents = "none";
            } else {
              fixedStage.style.visibility = "visible";
              fixedStage.style.pointerEvents = p >= 0.25 && p <= 0.88 ? "auto" : "none";
            }
          },
        },
      });

      // --- PHASE 1: STAGE FADES IN AT TOP 0 OF DEFAULT VIEWPORT (0.00 -> 0.16) ---
      tl.fromTo(
        fixedStage,
        { opacity: 0 },
        { opacity: 1, ease: "power2.out", duration: 0.16 },
        0
      );

      // --- PHASE 2: GENEROUS CINEMATIC ZOOM-OUT & BLUR CLEARING DIRECTLY ON IMAGE (0.14 -> 0.46) ---
      // Direct filter: blur on the image itself — no separate div sliding up!
      tl.fromTo(
        bgImage,
        { scale: 1.38, filter: "blur(12px)" },
        { scale: 1.0, filter: "blur(0px)", ease: "power2.out", duration: 0.32 },
        0.14
      );

      // --- PHASE 3: FOG OVERLAY APPLIES ONLY AFTER IMAGE HAS ZOOMED OUT (0.44 -> 0.58) ---
      if (fogVideo) {
        tl.fromTo(
          fogVideo,
          { opacity: 0 },
          { opacity: 0.65, ease: "power2.out", duration: 0.14 },
          0.44
        );
      }

      // --- PHASE 4: GSAP-STYLE TEXT REVEAL AFTER ZOOM OUT (0.52 -> 0.70) ---
      if (eyebrow) {
        tl.fromTo(
          eyebrow,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, ease: "power3.out", duration: 0.10 },
          0.52
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
            duration: 0.14,
          },
          0.54
        );
      }

      if (subtext) {
        tl.fromTo(
          subtext,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.10 },
          0.58
        );
      }

      if (cta) {
        tl.fromTo(
          cta,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.08 },
          0.62
        );
      }

      if (activePins.length > 0) {
        tl.fromTo(
          activePins,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.04, ease: "back.out(2)", duration: 0.12 },
          0.56
        );
      }

      if (pills) {
        tl.fromTo(
          pills,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.10 },
          0.64
        );
      }

      // --- PHASE 5: INTERACTIVE HOLD (0.70 -> 0.88) ---
      tl.to({}, { duration: 0.18 }, 0.70);

      // --- PHASE 6: CLEAN EXIT HANDOFF TO NEXT SECTION (0.88 -> 0.98) ---
      tl.fromTo(
        fixedStage,
        { opacity: 1 },
        { opacity: 0, ease: "power2.in", duration: 0.10 },
        0.88
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sustainability"
      ref={containerRef}
      className="relative w-full h-[320vh] bg-transparent"
    >
      {/* =====================================================================
          FIXED VIEWPORT STAGE:
          Positioned strictly at top: 0 of the DEFAULT VIEWPORT (not the container!)
          Spans fixed inset-0 (100vw x 100vh) with zero sliding from bottom!
      ===================================================================== */}
      <div
        ref={fixedStageRef}
        style={{ opacity: 0, visibility: "hidden" }}
        className="fixed inset-0 top-0 left-0 w-screen h-screen z-25 pointer-events-none overflow-hidden bg-[#031513] text-white will-change-[opacity,visibility]"
      >
        {/* =====================================================================
            LAYER 1: NATURE LANDSCAPE IMAGE (2880x1800 UNCOMPRESSED TERRARIUM)
            - Fixed at top: 0 of default viewport
            - Direct blur (12px) on the image itself (no separate overlay sliding up!)
            - Smoothly unblurs to 0px as it zooms out from 1.38 to 1.0
        ===================================================================== */}
        <div
          ref={bgImageRef}
          style={{ filter: "blur(12px)", transform: "scale(1.38)" }}
          className="absolute inset-0 z-0 pointer-events-none will-change-[transform,filter]"
        >
          <Image
            src="/images/sustainability-landscape.jpg"
            alt="ARKAF Edge Nature-Positive Terrarium Landscape"
            fill
            priority
            unoptimized
            className="object-cover object-top"
            sizes="100vw"
          />
          {/* Subtle vignette protecting text legibility without obscuring nature */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(3,21,19,0.50) 0%, rgba(3,21,19,0.08) 45%, rgba(3,21,19,0.55) 100%)",
            }}
          />
        </div>

        {/* =====================================================================
            LAYER 2: AUTHENTIC ALETHIA CORNER & FLOOR FOG
            - Clean screen mix-blend with 0.70 opacity
            - Starts at opacity: 0, and APPLIES ONLY AFTER IMAGE HAS ZOOMED OUT!
        ===================================================================== */}
        <div
          ref={fogVideoRef}
          style={{ opacity: 0 }}
          className="absolute inset-0 z-[14] pointer-events-none overflow-hidden mix-blend-screen will-change-[opacity]"
        >
          <video
            src="/videos/clouds-fog.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* =====================================================================
            LAYER 4: 4 INTERACTIVE SENSOR NODES (Exact Alethia 5-Dot Matrix + Inline Labels)
            - Clean & closed by default so they never block text or view
            - Inline uppercase tag directly beside the dot (matches Alethia reference)
            - Hovering or tapping smoothly reveals rich data capsule
        ===================================================================== */}
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
                {/* 5-Dot Matrix Sensor Pin Button + Inline Label */}
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

                  {/* Inline Tag beside dot (matches Alethia screenshot reference) */}
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

        {/* =====================================================================
            LAYER 5: FULL-HEIGHT EDITORIAL TYPOGRAPHY & GSAP TEXT REVEAL
            - Positioned in Upper-Right Quadrant (Alethia Layout)
            - Leaves Lower 60% of Screen 100% OPEN for Nature & Sensor Nodes
        ===================================================================== */}
        <div className="relative z-20 w-full max-w-[1360px] mx-auto px-5 sm:px-12 h-screen h-[100dvh] flex flex-col justify-between pt-24 sm:pt-28 pb-6 sm:pb-8 pointer-events-none">
          {/* Top Row: Eyebrow on Far-Left + Upper-Right Headline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Top-Left Eyebrow (Alethia Carbon Intelligence style) */}
            <div ref={eyebrowRef} className="lg:col-span-4 pointer-events-auto">
              <span className="block font-mono-label text-[9px] sm:text-[10.5px] text-[#14f884] font-bold uppercase tracking-[0.16em] leading-relaxed">
                REAL-TIME,<br />
                CIRCULAR-BACKED<br />
                IMPACT INTELLIGENCE
              </span>
            </div>

            {/* Upper-Right Headline + Subtitle (Alethia Style) */}
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

          {/* Lower Row: 9 Focus Circular Sectors Pills (Discreetly at the bottom edge) */}
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
    </section>
  );
}
