"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles, Check, Globe } from "lucide-react";
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
    category: "CIRCULAR VALUE",
    metric: "12,000+ KG TEXTILE RECLAIMED",
    detail: "Upcycling industrial waste streams into scalable commercial assets.",
    top: "44%",
    left: "7%",
    tooltipPos: "right",
  },
  {
    id: "truth",
    category: "REAL-WORLD DATA",
    metric: "ZERO GREENWASHING",
    detail: "Translating complex sustainability logic into verifiable business metrics.",
    top: "56%",
    left: "32%",
    tooltipPos: "right",
  },
  {
    id: "nature-tech",
    category: "NATURE-POSITIVE TECH",
    metric: "COMPOUNDING ORGANIC GROWTH",
    detail: "Ecosystems that compound over time without endless paid vanity budgets.",
    bottom: "16%",
    left: "58%",
    tooltipPos: "top",
  },
  {
    id: "scale",
    category: "REGENERATIVE SCALE",
    metric: "GLOBAL BRAND CALIBER",
    detail: "Empowering earth-first founders with world-class strategy & design.",
    top: "58%",
    right: "12%",
    tooltipPos: "left",
  },
];

export default function SustainabilitySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const fogVideoRef = useRef<HTMLVideoElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const subtextRef = useRef<HTMLParagraphElement | null>(null);
  const pillsRef = useRef<HTMLDivElement | null>(null);
  const hotspotsRef = useRef<HTMLDivElement | null>(null);

  const [activeHotspot, setActiveHotspot] = useState<string | null>("circularity");

  // GSAP: Parallax Scroll + Viewport-Triggered Text Reveal
  useEffect(() => {
    const track = trackRef.current;
    const bgImage = bgImageRef.current;
    const fogVideo = fogVideoRef.current;
    const headline = headlineRef.current;
    const eyebrow = eyebrowRef.current;
    const subtext = subtextRef.current;
    const pills = pillsRef.current;
    const hotspots = hotspotsRef.current;

    if (!track) return;

    const ctx = gsap.context(() => {
      // 1. Parallax Scroll Scrub on Background Landscape & Fog
      ScrollTrigger.create({
        trigger: track,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          // Parallax depth: background moves slower than foreground
          if (bgImage) {
            const yMove = (p - 0.5) * -90;
            const scale = 1.08 - p * 0.05;
            bgImage.style.transform = `translate3d(0, ${yMove.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          }
          if (fogVideo) {
            const fogY = (p - 0.5) * -50;
            fogVideo.style.transform = `translate3d(0, ${fogY.toFixed(1)}px, 0)`;
          }
        },
      });

      // 2. Cinematic Viewport-Triggered Reveal Animation
      // Fires when this section is prominently centered in viewport
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top 60%",
          end: "bottom 30%",
          toggleActions: "play reverse play reverse",
        },
      });

      if (eyebrow) {
        revealTl.fromTo(
          eyebrow,
          { opacity: 0, y: 30, letterSpacing: "0.25em" },
          { opacity: 1, y: 0, letterSpacing: "0.15em", duration: 0.8, ease: "power3.out" },
          0
        );
      }

      if (headline) {
        const lines = headline.querySelectorAll(".reveal-line");
        revealTl.fromTo(
          lines,
          { opacity: 0, y: 70, rotateX: 12 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.0,
            stagger: 0.12,
            ease: "power3.out",
          },
          0.1
        );
      }

      if (subtext) {
        revealTl.fromTo(
          subtext,
          { opacity: 0, y: 25, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power2.out" },
          0.3
        );
      }

      if (hotspots) {
        const pins = hotspots.querySelectorAll(".sensor-pin");
        revealTl.fromTo(
          pins,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, stagger: 0.08, ease: "back.out(2)" },
          0.4
        );
      }

      if (pills) {
        revealTl.fromTo(
          pills,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          0.5
        );
      }
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sustainability"
      ref={sectionRef}
      className="relative w-full bg-[#031513] text-white border-t border-b border-white/15 overflow-hidden"
    >
      <div id="who-we-are" className="absolute -top-12 left-0 h-1 w-1" />

      {/* Main Parallax Track Stage (Full-Screen Immersive Canvas) */}
      <div
        ref={trackRef}
        className="relative min-h-[92vh] lg:min-h-screen w-full flex items-center justify-center overflow-hidden py-20 sm:py-28"
      >
        {/* =====================================================================
            LAYER 1: PHOTOREALISTIC TERRARIUM / MOSS / FOLIAGE PARALLAX BACKGROUND
        ===================================================================== */}
        <div
          ref={bgImageRef}
          className="absolute inset-0 z-0 pointer-events-none will-change-transform scale-[1.06]"
        >
          <Image
            src="/images/sustainability-landscape.png"
            alt="ARKAF Edge Nature-Positive Terrarium Landscape"
            fill
            priority
            className="object-cover object-center opacity-85"
            sizes="100vw"
          />
          {/* Editorial Readability Vignette: darkens top for text contrast, retains raw nature at bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 90% 80% at 50% 30%, rgba(3,21,19,0.72) 0%, rgba(3,21,19,0.35) 55%, rgba(3,21,19,0.75) 100%)",
            }}
          />
        </div>

        {/* =====================================================================
            LAYER 2: CONTINUOUS ANIMATED FOG / CLOUD DRIFT ON CORNERS & FLOOR
        ===================================================================== */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {/* Looping WebM Cloud / Mist Video from Alethia */}
          <video
            ref={fogVideoRef}
            src="/videos/clouds-fog.webm"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-70 will-change-transform"
            style={{
              maskImage:
                "radial-gradient(ellipse 85% 75% at 50% 80%, black 20%, rgba(0,0,0,0.85) 60%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 85% 75% at 50% 80%, black 20%, rgba(0,0,0,0.85) 60%, transparent 85%)",
            }}
          />

          {/* Corner Volumetric Glows for Atmospheric Warmth */}
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#14f884]/10 blur-[90px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#c6f19d]/10 blur-[90px]" />
        </div>

        {/* =====================================================================
            LAYER 3: 4 INTERACTIVE SENSOR HOTSPOT NODES (Exact Alethia 5-Dot Matrix)
        ===================================================================== */}
        <div ref={hotspotsRef} className="absolute inset-0 z-30 pointer-events-none">
          {SENSOR_HOTSPOTS.map((spot) => {
            const isActive = activeHotspot === spot.id;

            return (
              <div
                key={spot.id}
                style={{
                  top: spot.top,
                  left: spot.left,
                  right: spot.right,
                  bottom: spot.bottom,
                }}
                className="sensor-pin absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
              >
                {/* 5-Dot Matrix Sensor Pin Button */}
                <button
                  type="button"
                  onClick={() => setActiveHotspot(isActive ? null : spot.id)}
                  onMouseEnter={() => setActiveHotspot(spot.id)}
                  aria-label={`Inspect ${spot.category}`}
                  className="group relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#c6f19d] text-[#051f10] shadow-[0_0_24px_rgba(198,241,157,0.7)] flex items-center justify-center transition-all duration-300 hover:scale-115 focus:outline-none cursor-pointer"
                >
                  {/* Outer breathing ping radar ring */}
                  <span className="absolute -inset-1 rounded-full bg-[#c6f19d]/45 animate-ping pointer-events-none" />

                  {/* 5-Dot Matrix Icon (Exact match to Alethia sensor node) */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current transition-transform duration-300 group-hover:rotate-45">
                    <circle cx="12" cy="12" r="1.8" />
                    <circle cx="12" cy="6" r="1.8" />
                    <circle cx="12" cy="18" r="1.8" />
                    <circle cx="6" cy="12" r="1.8" />
                    <circle cx="18" cy="12" r="1.8" />
                  </svg>
                </button>

                {/* Floating Tooltip Data Capsule (Appears on Hover / Active) */}
                <div
                  className={`absolute z-40 transition-all duration-300 ease-out pointer-events-none ${
                    isActive ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none"
                  } ${
                    spot.tooltipPos === "right"
                      ? "left-12 sm:left-14 top-1/2 -translate-y-1/2"
                      : spot.tooltipPos === "left"
                      ? "right-12 sm:right-14 top-1/2 -translate-y-1/2"
                      : "bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2"
                  }`}
                >
                  <div className="flex items-center gap-2.5 rounded-2xl bg-black/90 border border-[#c6f19d]/60 backdrop-blur-md px-4 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.8)] min-w-[210px] max-w-[270px]">
                    <div className="w-2 h-2 rounded-full bg-[#14f884] shrink-0 animate-pulse" />
                    <div className="text-left">
                      <span className="block font-mono-label text-[8px] text-[#14f884] font-bold tracking-wider uppercase">
                        {spot.category}
                      </span>
                      <span className="block text-[11px] font-black text-white leading-tight mt-0.5">
                        {spot.metric}
                      </span>
                      <span className="block text-[9px] text-[#c7d6d1] font-light leading-snug mt-1">
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
            LAYER 4: EDITORIAL CONTENT & VIEWPORT-TRIGGERED HEADLINE REVEAL
        ===================================================================== */}
        <div className="relative z-20 w-full max-w-[1240px] mx-auto px-5 sm:px-12 flex flex-col justify-between min-h-[75vh]">
          {/* Top Eyebrow Row (Alethia style) */}
          <div ref={eyebrowRef} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#14f884] animate-pulse" />
              <span className="font-mono-label text-[9px] sm:text-[11px] text-[#14f884] font-bold uppercase tracking-[0.18em]">
                REAL-TIME, CIRCULAR-BACKED IMPACT INTELLIGENCE
              </span>
            </div>

            <span className="hidden sm:inline-block font-mono-label text-[9px] text-white/50 tracking-wider">
              SECTION 02 • SUSTAINABILITY
            </span>
          </div>

          {/* Central Editorial Display Headline (Masked Line-by-Line Reveal) */}
          <div className="my-auto py-10 sm:py-14 max-w-4xl">
            <h2
              ref={headlineRef}
              className="text-[clamp(2.1rem,4.8vw,4.5rem)] font-black uppercase tracking-tight leading-[1.04]"
              style={{ perspective: 1000 }}
            >
              <span className="block overflow-hidden">
                <span className="reveal-line block text-white">
                  The future shouldn&apos;t need
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="reveal-line block text-white">
                  another marketing campaign.
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="reveal-line block text-[#14f884] neon-text-glow">
                  It needs businesses willing to build it.
                </span>
              </span>
            </h2>

            {/* Subtitle Paragraph with Clear Contrast */}
            <p
              ref={subtextRef}
              className="mt-5 sm:mt-7 max-w-2xl text-[clamp(0.92rem,1.25vw,1.1rem)] text-[#dbeae4] font-light leading-relaxed"
            >
              Sustainability isn&apos;t a green badge we attach to our services. It is one of the reasons ARKAF Edge exists. We bring the strategic caliber, design precision, and growth technology of global market leaders to founders building what comes next.
            </p>

            {/* Primary Action Button */}
            <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#14f884] text-[#050b09] px-6 sm:px-8 py-3.5 sm:py-4 font-mono-label text-[10.5px] sm:text-[11.5px] font-bold shadow-[0_0_24px_rgba(20,248,132,0.4)] hover:bg-[#a9f5cf] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>DISCOVER ARKAF EDGE</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </a>

              <a
                href="#work"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-black/40 backdrop-blur-sm text-white px-5 sm:px-6 py-3.5 sm:py-4 font-mono-label text-[10.5px] sm:text-[11px] font-medium hover:border-[#14f884] hover:text-[#14f884] transition-all"
              >
                <span>EXPLORE CIRCULAR WORK ↗</span>
              </a>
            </div>
          </div>

          {/* Lower Row: 9 Focus Circular Sectors Pills from Written Content Docx */}
          <div ref={pillsRef} className="pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono-label text-[9px] text-[#14f884] font-bold tracking-wider uppercase">
                PARTICULAR AFFECTION FOR SECTORS IN:
              </span>
              <span className="hidden sm:inline-block font-mono-label text-[8.5px] text-white/40">
                09 FOCUS VERTICALS
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {SUSTAINABILITY_CONTENT.industries.map((ind) => (
                <span
                  key={ind}
                  className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-sm font-mono-label text-[8.5px] sm:text-[9.5px] text-[#d4ede4] hover:border-[#14f884]/60 hover:text-[#14f884] transition-colors"
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
