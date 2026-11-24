"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Sparkles, X } from "lucide-react";
import { IMPACT_STATS, FOUNDERS, VISION_CONTENT } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// ASYMMETRICAL ARTIFACTS (True Alethia Style)
// - RADICALLY DIFFERENT WIDTHS & HEIGHTS for each box (to show true uniqueness)
// - ORGANIC, STAGGERED ASYMMETRIC POSITIONS (curated editorial scatter, no rigid grid)
// - STRICT CENTER CORRIDOR PROTECTION: Zero overlap with center headline & paragraph!
// ============================================================================
const ASYMMETRIC_ARTIFACTS = [
  // 1. TOP-LEFT: Tall Vertical Blueprint Card (Anurag) + Detached Pill
  // Unique Dimensions: w-[195px] h-[230px] (Tall & narrow vertical format!)
  {
    id: "aero-turbine",
    startX: -330,
    startY: -140,
    spreadX: -55,
    spreadY: -25,
    rotation: -3.5,
    render: () => (
      <div className="relative flex items-center gap-2">
        <div className="w-[195px] h-[230px] rounded-2xl border border-white/20 bg-[#051c17]/95 p-3.5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono-label text-[8px] text-[#14f884] font-semibold tracking-wider">
              [AERONAUTICAL 2012]
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#14f884] animate-pulse" />
          </div>

          {/* Detailed Turbine Schematic (Tall) */}
          <div className="relative h-24 w-full rounded-xl bg-black/65 border border-white/10 overflow-hidden flex items-center justify-center my-1">
            <svg viewBox="0 0 160 80" className="w-full h-full stroke-[#14f884]/65 fill-none">
              <circle cx="80" cy="40" r="28" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="80" cy="40" r="18" strokeWidth="1.2" />
              <circle cx="80" cy="40" r="8" strokeWidth="1.4" />
              <circle cx="80" cy="40" r="3" fill="#14f884" />
              <line x1="15" y1="40" x2="145" y2="40" strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1="80" y1="6" x2="80" y2="74" strokeWidth="0.8" strokeOpacity="0.4" />
              <path d="M 60 20 L 100 60 M 60 60 L 100 20" strokeWidth="0.8" strokeOpacity="0.5" />
            </svg>
            <span className="absolute bottom-1 right-2 font-mono-label text-[7px] text-[#14f884]/80">
              MACH-LOGIC
            </span>
          </div>

          <div>
            <p className="text-[11px] font-bold text-white leading-tight">Navigating Without a Map</p>
            <p className="text-[9px] text-[#9cb5ad] leading-snug mt-1">
              Sudden medical detour built on-ground frontline resilience.
            </p>
          </div>
        </div>

        {/* Detached floating pill (Alethia style) */}
        <span className="shrink-0 px-2 py-1 rounded-full bg-[#14f884] text-[#051f10] font-mono-label text-[8px] font-black shadow-[0_0_12px_rgba(20,248,132,0.45)]">
          LOGIC
        </span>
      </div>
    ),
  },

  // 2. TOP-CENTER-RIGHT: Wide Horizontal Telemetry Capsule (CLIMAVUE style)
  // Unique Dimensions: w-[290px] h-[95px] (Ultra-wide, sleek horizontal capsule!)
  {
    id: "climavue-pill",
    startX: 40,
    startY: -165,
    spreadX: 25,
    spreadY: -35,
    rotation: 1.5,
    render: () => (
      <div className="w-[290px] h-[95px] rounded-2xl border border-white/20 bg-black/90 backdrop-blur-md px-4 py-3 shadow-xl flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14f884]" />
            <span className="font-mono-label text-[7.5px] text-[#14f884] uppercase tracking-wider">
              CORE PHILOSOPHY
            </span>
          </div>
          <p className="text-[12px] font-bold text-white leading-snug">
            &ldquo;Why can&apos;t business do both?&rdquo;
          </p>
          <span className="font-mono-label text-[8px] text-[#a9f5cf]">
            2.4x COMPOUND GROWTH
          </span>
        </div>

        {/* Equalizer Bar Chart */}
        <div className="flex items-end gap-1 h-8 shrink-0 px-2 py-1 rounded-lg bg-[#05261e] border border-[#14f884]/30">
          <span className="w-1.5 h-3 rounded-sm bg-[#14f884]" />
          <span className="w-1.5 h-6 rounded-sm bg-[#14f884]" />
          <span className="w-1.5 h-4.5 rounded-sm bg-[#14f884]" />
          <span className="w-1.5 h-7 rounded-sm bg-[#14f884]" />
          <span className="w-1.5 h-4 rounded-sm bg-[#14f884]" />
        </div>
      </div>
    ),
  },

  // 3. TOP-RIGHT: Landscape Foliage Photo Tile
  // Unique Dimensions: w-[230px] h-[150px] (Medium landscape format!)
  {
    id: "foliage-tile",
    startX: 330,
    startY: -150,
    spreadX: 55,
    spreadY: -25,
    rotation: 3,
    render: () => (
      <div className="w-[230px] h-[150px] rounded-2xl border border-white/20 bg-[#05221b] p-3 shadow-2xl overflow-hidden relative flex flex-col justify-between">
        <div className="relative h-18 w-full rounded-xl overflow-hidden">
          <Image
            src="/images/art-01.jpg"
            alt="Circularity"
            fill
            className="object-cover opacity-65"
            sizes="230px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05221b] via-transparent to-transparent" />
          <span className="absolute top-1.5 right-1.5 font-mono-label text-[7.5px] font-bold px-1.5 py-0.5 rounded bg-black/85 text-[#14f884] border border-[#14f884]/35 shadow-md">
            2020 • VALUE
          </span>
        </div>

        <div>
          <p className="text-[11.5px] font-bold text-white leading-tight">Waste Into Scalable Value</p>
          <p className="text-[9.5px] text-[#9cb5ad] leading-snug mt-0.5">
            Converting discarded materials into high-value commercial solutions.
          </p>
        </div>
      </div>
    ),
  },

  // 4. MID-LEFT: Pure 3D Topographical Wireframe (NO BOX / NO BACKGROUND RECTANGLE!)
  // Unique Dimensions: w-[180px] h-[140px] (Pure freestanding wireframe model!)
  {
    id: "topo-contour",
    startX: -360,
    startY: 35,
    spreadX: -50,
    spreadY: 10,
    rotation: -2.5,
    render: () => (
      <div className="w-[180px] h-[140px] p-2 flex flex-col justify-between select-none">
        <div className="relative w-full h-20 flex items-center justify-center">
          <svg viewBox="0 0 160 64" className="w-full h-full stroke-[#14f884] fill-none opacity-85">
            <ellipse cx="80" cy="32" rx="72" ry="24" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" />
            <ellipse cx="80" cy="31" rx="54" ry="18" strokeWidth="1" strokeOpacity="0.5" />
            <ellipse cx="80" cy="30" rx="38" ry="13" strokeWidth="1.2" strokeOpacity="0.75" />
            <ellipse cx="80" cy="28" rx="22" ry="8" strokeWidth="1.4" strokeOpacity="0.95" />
            <ellipse cx="80" cy="26" rx="10" ry="4" fill="#14f884" fillOpacity="0.35" strokeWidth="1.5" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-mono-label text-[8.5px] text-[#14f884] font-bold uppercase">
              [GROUND REALITY]
            </span>
            <span className="font-mono-label text-[8px] text-white/50">8 SECTORS</span>
          </div>
          <p className="text-[10px] text-[#c7d6d1] font-medium leading-snug">
            Collections • Real Estate • BD • Risk
          </p>
        </div>
      </div>
    ),
  },

  // 5. MID-RIGHT: Analogue Photography Deep Square Tile
  // Unique Dimensions: w-[210px] h-[210px] (Deep square studio tile!)
  {
    id: "film-studio",
    startX: 340,
    startY: 15,
    spreadX: 50,
    spreadY: 10,
    rotation: 2.5,
    render: () => (
      <div className="w-[210px] h-[210px] rounded-2xl border border-white/20 bg-[#051d18]/95 p-4 shadow-2xl backdrop-blur-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono-label text-[8.5px] text-[#14f884] font-semibold">
            [STUDIO FLOOR 2009]
          </span>
          <svg viewBox="0 0 20 20" className="w-4 h-4 stroke-[#14f884] fill-none">
            <circle cx="10" cy="10" r="8" strokeWidth="1.2" />
            <path d="M 6 4 L 14 6 M 16 7 L 14 15 M 13 16 L 5 14 M 4 13 L 6 5" strokeWidth="1" />
          </svg>
        </div>

        {/* Film reel strip aesthetic */}
        <div className="h-20 w-full rounded-xl bg-black/65 border border-white/10 flex flex-col items-center justify-center my-1 px-3">
          <span className="font-mono-label text-[10px] text-[#14f884] tracking-widest font-bold">
            FILM &amp; ANALOGUE
          </span>
          <span className="font-mono-label text-[7.5px] text-white/40 mt-1">
            DAKC • 35MM • MEDIUM FORMAT
          </span>
        </div>

        <div>
          <p className="text-[11.5px] font-bold text-white leading-tight">Swept Floors to Full Shoots</p>
          <p className="text-[9.5px] text-[#9cb5ad] leading-snug mt-0.5">
            7 months from sweeping studio floors to running complete film shoots.
          </p>
        </div>
      </div>
    ),
  },

  // 6. BOTTOM-LEFT: Dual Telemetry Sparkline Chip
  // Unique Dimensions: w-[220px] h-[105px] (Slim horizontal data chip!)
  {
    id: "metric-line",
    startX: -300,
    startY: 175,
    spreadX: -45,
    spreadY: 25,
    rotation: -2,
    render: () => (
      <div className="w-[220px] h-[105px] rounded-2xl border border-white/15 bg-[#05211b]/95 p-3 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono-label text-[8px] text-[#14f884] font-semibold">
            THE SHARED PURPOSE
          </span>
          <span className="font-mono-label text-[7.5px] text-white/50 px-1.5 py-0.5 rounded bg-white/5">
            14+ YRS
          </span>
        </div>

        <p className="text-[11px] font-bold text-white leading-tight">
          &ldquo;Help good businesses get seen.&rdquo;
        </p>

        <div className="h-4 w-full flex items-center">
          <svg viewBox="0 0 130 14" className="w-full h-full stroke-[#14f884] fill-none">
            <polyline points="0,12 35,9 70,11 100,4 130,2" strokeWidth="1.4" />
            <circle cx="130" cy="2" r="2" fill="#14f884" />
          </svg>
        </div>
      </div>
    ),
  },

  // 7. BOTTOM-CENTER-LEFT: Compact High-Contrast Solid Lime Badge (Carbon Balance style)
  // Unique Dimensions: w-[210px] h-[120px] (Bold, punchy, compact lime pill!)
  // Placed safely at startY = 180px (Leaves 45px clear margin below paragraph! ZERO overlap!)
  {
    id: "solid-lime-bba",
    startX: -40,
    startY: 180,
    spreadX: -15,
    spreadY: 25,
    rotation: 2,
    render: () => (
      <div className="w-[210px] h-[120px] rounded-2xl bg-[#c6f19d] text-[#051f10] p-3.5 shadow-[0_10px_30px_rgba(198,241,157,0.35)] border border-[#c6f19d] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono-label text-[8px] font-bold uppercase tracking-wider text-[#051f10]/80">
            BBA 2024 • RESILIENCE
          </span>
          <span className="font-mono-label text-[7.5px] font-black px-1.5 py-0.2 rounded bg-[#051f10] text-[#c6f19d]">
            NO EXCUSES
          </span>
        </div>

        <div>
          <p className="text-[12.5px] font-black leading-tight text-[#051f10]">
            Finish What You Started
          </p>
          <p className="text-[9.5px] text-[#051f10]/80 leading-snug mt-0.5">
            Completing education while operating companies. Follow-through matters.
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#051f10]/15">
          <span className="font-mono-label text-[8px] font-bold text-[#051f10]">
            100% RESOLVE
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#051f10]" />
        </div>
      </div>
    ),
  },

  // 8. BOTTOM-RIGHT: Minimalist Persistence Capsule
  // Unique Dimensions: w-[180px] h-[65px] (Compact rounded pill!)
  {
    id: "persistence-pill",
    startX: 270,
    startY: 175,
    spreadX: 40,
    spreadY: 25,
    rotation: -2,
    render: () => (
      <div className="w-[180px] h-[65px] rounded-full border border-white/20 bg-[#051e17]/95 px-4 py-2 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#14f884]" />
          <div>
            <span className="block font-mono-label text-[7px] text-[#14f884] uppercase">
              [THE EDGE]
            </span>
            <span className="block text-[11px] font-bold text-white leading-tight">
              &ldquo;Keep moving.&rdquo;
            </span>
          </div>
        </div>
        <span className="font-mono-label text-[7.5px] text-[#14f884]/80">GRIT</span>
      </div>
    ),
  },
];

export default function ImpactFoundersSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const spreadTrackRef = useRef<HTMLDivElement | null>(null);
  const spreadStickyRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const centerTextRef = useRef<HTMLDivElement | null>(null);

  const [hoveredFounder, setHoveredFounder] = useState<string | null>(null);
  const [activeFounder, setActiveFounder] = useState<(typeof FOUNDERS)[number] | null>(null);

  // Impact Counter Intersection Observer
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        IMPACT_STATS.forEach((stat, idx) => {
          const el = numberRefs.current[idx];
          if (!el || stat.value === null) return;
          const counter = { val: 0 };
          gsap.to(counter, {
            val: stat.value,
            duration: 1.25,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${Math.round(counter.val)}${stat.suffix}`;
            },
          });
        });
      },
      { threshold: 0.15 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // GSAP: Scroll-Driven SPREAD OUT from center to perimeter!
  // Always 100% visible, perfectly safe bounds, zero clipping!
  useEffect(() => {
    const track = spreadTrackRef.current;
    const sticky = spreadStickyRef.current;
    const centerText = centerTextRef.current;
    if (!track || !sticky) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => {
          const p = self.progress;
          const easeProgress = gsap.parseEase("power2.out")(p);

          tileRefs.current.forEach((el, idx) => {
            if (!el) return;
            const item = ASYMMETRIC_ARTIFACTS[idx];
            if (!item) return;

            // Spreads smoothly from startX/startY outward by spreadX/spreadY
            const currentX = item.startX + item.spreadX * easeProgress;
            const currentY = item.startY + item.spreadY * easeProgress;
            const currentRot = item.rotation * (1 + easeProgress * 0.35);

            el.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) rotate(${currentRot.toFixed(1)}deg)`;
          });

          // Subtle breathing effect on center text
          if (centerText) {
            const textScale = 1 + easeProgress * 0.02;
            centerText.style.transform = `scale(${textScale.toFixed(3)})`;
          }
        },
      });
    }, track);

    return () => ctx.revert();
  }, []);

  // Close story modal on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveFounder(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="relative bg-[#041d1a] text-white border-t border-b border-white/20"
    >
      {/* =========================================================================
          PART 1: IMPACT & NUMBERS COUNTER
          Compact padding (NO big gap!)
      ========================================================================= */}
      <div className="max-w-[1140px] mx-auto px-5 sm:px-10 pt-10 sm:pt-14 pb-6 sm:pb-8">
        <div className="text-center mb-6 sm:mb-8">
          <p className="font-mono-label text-[10px] sm:text-[11px] text-[#14f884] mb-1.5 sm:mb-2">
            06. IMPACT &amp; NUMBERS
          </p>
          <h2 className="text-[clamp(1.75rem,3.4vw,2.9rem)] font-black tracking-[-0.025em] uppercase leading-tight">
            <span className="text-white">MEASURED BY </span>
            <span className="text-[#14f884] neon-text-glow">RESULTS.</span>
          </h2>
        </div>

        {/* 4-Column Wide Stat Boxes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {IMPACT_STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className="rounded-[16px] border border-white/20 bg-[#05211e]/90 backdrop-blur-sm py-4 sm:py-6 px-3 sm:px-4 text-center hover:border-[#14f884]/60 transition-colors shadow-lg"
            >
              <span
                ref={(el) => {
                  numberRefs.current[idx] = el;
                }}
                className="block text-[clamp(1.85rem,3.6vw,3.1rem)] font-black text-[#14f884] neon-text-glow tracking-tight leading-none"
              >
                {stat.display}
              </span>
              <span className="mt-1.5 block font-mono-label text-[8.5px] sm:text-[9.5px] text-[#c7d6d1]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          PART 2: SPREAD-OUT FOUNDERS SHOWCASE (Alethia Solves style)
          - UNIQUE WIDTHS & HEIGHTS for each box (showing true uniqueness!)
          - ASYMMETRICAL ORGANIC POSITIONS (curated scatter, no rigid grid)
          - STRICT CENTER CORRIDOR PROTECTION: Zero overlap with center text!
          - Outward spread on scroll with ZERO clipping
      ========================================================================= */}
      <div
        ref={spreadTrackRef}
        className="relative h-[125vh] w-full border-t border-white/10"
      >
        <div
          ref={spreadStickyRef}
          className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#041d1a] via-[#031916] to-[#041d1a]"
        >
          {/* Subtle radial focus vignette behind center */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 65% 65% at 50% 50%, rgba(20,248,132,0.05) 0%, transparent 75%)",
            }}
          />

          {/* Centered Primary Headline & Subtitle (Completely open, unobstructed, 100% readable!) */}
          <div
            ref={centerTextRef}
            className="relative z-20 max-w-lg mx-auto px-5 text-center select-none pointer-events-none transition-transform duration-200"
          >
            <span className="inline-block rounded-full border border-[#14f884]/35 bg-[#072924]/90 px-3.5 py-1 font-mono-label text-[9px] sm:text-[10px] text-[#14f884] mb-2.5 shadow-[0_0_16px_rgba(20,248,132,0.2)]">
              ABOUT &amp; LEADERSHIP
            </span>
            <h2 className="text-[clamp(1.75rem,3.8vw,3.1rem)] font-black uppercase tracking-tight leading-[1.05]">
              <span className="block text-white">TWO JOURNEYS.</span>
              <span className="block text-[#14f884] neon-text-glow">ONE EDGE.</span>
            </h2>
            <p className="mt-3 text-[clamp(0.8rem,1.05vw,0.95rem)] text-[#d4e4df] font-light leading-relaxed max-w-md mx-auto">
              We weren&apos;t born in a boardroom. We were built through detours. Two different journeys arrived at one shared idea: build something meaningful and help others build theirs.
            </p>
          </div>

          {/* DESKTOP/TABLET (>=768px): 8 ASYMMETRICAL ARTIFACTS
              Each with unique width, height, and organic staggered positions */}
          <div className="absolute inset-0 z-10 pointer-events-none hidden md:flex items-center justify-center">
            {ASYMMETRIC_ARTIFACTS.map((item, idx) => (
              <div
                key={item.id}
                ref={(el) => {
                  tileRefs.current[idx] = el;
                }}
                className="absolute will-change-transform opacity-100"
                style={{
                  transform: `translate3d(${item.startX}px, ${item.startY}px, 0) rotate(${item.rotation}deg)`,
                }}
              >
                {item.render()}
              </div>
            ))}
          </div>

          {/* MOBILE VIEW (<768px): Clean horizontal swipe pill carousel */}
          <div className="absolute bottom-6 inset-x-4 md:hidden z-20 flex gap-2.5 overflow-x-auto pb-2 pointer-events-auto">
            {ASYMMETRIC_ARTIFACTS.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="shrink-0 w-52 rounded-xl border border-white/20 bg-[#05211e]/90 p-3 opacity-100"
              >
                {item.render()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PART 3: INTERACTIVE FOUNDER CARDS (Images 2, 4, 3 style)
          - STRICT FIXED HEIGHT: h-[540px] sm:h-[580px] (ZERO height jump on hover!)
          - Crossfade container prevents any layout expansion
          - Luxurious unhurried 1.0s circular expansion growing from arrow button
          - Clean header without patronizing explanatory subtext!
      ========================================================================= */}
      <div className="max-w-[1140px] mx-auto px-5 sm:px-10 py-10 sm:py-16">
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 font-mono-label text-[10px] text-[#14f884] mb-2 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE LEADERSHIP BEHIND THE EDGE</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
            <span className="text-white">HOVER CARDS TO </span>
            <span className="text-[#14f884] neon-text-glow">REVEAL THE JOURNEY.</span>
          </h3>
        </div>

        {/* 2 Wide Interactive Cards with STRICT FIXED HEIGHT (Zero layout shift on hover!) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {FOUNDERS.map((founder) => {
            const isHovered = hoveredFounder === founder.name;

            return (
              <div
                key={founder.name}
                onMouseEnter={() => setHoveredFounder(founder.name)}
                onMouseLeave={() => setHoveredFounder(null)}
                onClick={() => setActiveFounder(founder)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActiveFounder(founder)}
                className="group relative rounded-[24px] border border-white/20 bg-[#051e17] overflow-hidden p-7 sm:p-9 h-[540px] sm:h-[580px] flex flex-col justify-between transition-all duration-500 shadow-2xl cursor-pointer select-none focus:outline-none"
              >
                {/* Visual Background Photography Layer */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    className="object-cover opacity-20 group-hover:opacity-10 scale-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041d1a] via-[#051e17]/80 to-transparent" />
                </div>

                {/* THE GROWING CIRCLE ANIMATION (Exact match to Images 2, 4, 3)
                    - Smooth, luxurious, unhurried 1.0s expansion: duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                    - Originates at top-right (center of the arrow button: calc(100% - 42px) 42px)
                    - Grows smoothly to 150% radius, covering the full card! */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 bg-[#c6f19d] transition-[clip-path] duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                  style={{
                    clipPath: isHovered
                      ? "circle(150% at calc(100% - 42px) 42px)"
                      : "circle(0px at calc(100% - 42px) 42px)",
                  }}
                />

                {/* Card Top Row: Category tag + Arrow Button */}
                <div className="relative z-20 flex items-center justify-between">
                  <span
                    className={`font-mono-label text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full border transition-colors duration-500 ${
                      isHovered
                        ? "border-[#051f10]/30 bg-white/45 text-[#051f10]"
                        : "border-[#14f884]/40 bg-[#051a12]/80 text-[#14f884]"
                    }`}
                  >
                    {founder.tag}
                  </span>

                  {/* Circular Arrow Button (Source of the growing circle) */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${
                      isHovered
                        ? "bg-[#051f10] text-[#c6f19d] scale-105"
                        : "bg-[#14f884] text-[#050b09] shadow-[0_0_16px_rgba(20,248,132,0.4)]"
                    }`}
                  >
                    <ArrowRight
                      className={`w-4 h-4 stroke-[2.5] transition-transform duration-500 ${
                        isHovered ? "rotate-[-45deg]" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>

                {/* Card Bottom: Strictly contained within fixed height (ZERO HEIGHT TWITCH!) */}
                <div className="relative z-20 mt-auto">
                  <h4
                    className={`text-2xl sm:text-3xl font-black uppercase tracking-tight transition-colors duration-500 ${
                      isHovered ? "text-[#051f10]" : "text-white"
                    }`}
                  >
                    {founder.name}
                  </h4>

                  <p
                    className={`mt-1 font-mono-label text-[11px] sm:text-[12px] italic transition-colors duration-500 ${
                      isHovered ? "text-[#0b3322] font-semibold" : "text-[#c7f5dd]/90"
                    }`}
                  >
                    &ldquo;{founder.hook}&rdquo;
                  </p>

                  {/* FIXED-HEIGHT CROSSFADE CONTAINER (h-[240px] - NEVER EXPANDS CARD!) */}
                  <div className="relative h-[240px] mt-3">
                    {/* LAYER 1: Unhovered Excerpt Preview */}
                    <div
                      className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 ${
                        isHovered
                          ? "opacity-0 -translate-y-3 pointer-events-none"
                          : "opacity-100 translate-y-0 pointer-events-auto"
                      }`}
                    >
                      <p className="text-xs sm:text-sm font-light leading-relaxed text-[#a8beb8]">
                        {founder.preview}
                      </p>
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="font-mono-label text-[10px] text-[#14f884] flex items-center gap-1.5">
                          Hover to reveal key milestones
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                        <span className="font-mono-label text-[9px] text-white/40 uppercase">
                          PROFILE
                        </span>
                      </div>
                    </div>

                    {/* LAYER 2: Hovered Revealed Milestones + Read Bio Button */}
                    <div
                      className={`absolute inset-0 flex flex-col justify-between transition-all duration-700 delay-150 ${
                        isHovered
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 translate-y-3 pointer-events-none"
                      }`}
                    >
                      <div className="space-y-1.5 text-[11px] sm:text-[12px] text-[#051f10] font-medium leading-relaxed">
                        {founder.revealedHighlights.map((hl, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#051f10] shrink-0 mt-1.5" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-[#051f10]/15 flex items-center justify-between">
                        <span className="font-mono-label text-[10.5px] sm:text-[11px] font-bold text-[#051f10] uppercase tracking-wider underline underline-offset-4 inline-flex items-center gap-1.5 hover:gap-2 transition-all">
                          READ FULL BIOGRAPHY &amp; INTERVIEW
                          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                        </span>
                        <span className="font-mono-label text-[9px] text-[#051f10]/70 uppercase">
                          CLICK TO OPEN
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          PART 4: OUR VISION BANNER (From docx)
      ========================================================================= */}
      <div className="max-w-[1140px] mx-auto px-5 sm:px-10 pb-12 sm:pb-16">
        <div className="rounded-[22px] border border-[#14f884]/35 bg-[#031c19] p-7 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(20,248,132,0.4) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block rounded-full border border-[#14f884]/40 bg-[#051a12] px-3.5 py-1 font-mono-label text-[9.5px] text-[#14f884] mb-3.5">
              OUR VISION
            </span>
            <h4 className="text-xl sm:text-3xl font-black tracking-tight text-white uppercase leading-snug">
              {VISION_CONTENT.headline}
            </h4>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-5 font-mono-label text-[10.5px] sm:text-xs text-[#a9f5cf]">
              {VISION_CONTENT.pillars.map((p) => (
                <span key={p} className="flex items-center gap-1.5 bg-[#05261f]/80 px-3 py-1 rounded-full border border-[#14f884]/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14f884]" />
                  {p}
                </span>
              ))}
            </div>

            <p className="mt-6 pt-5 border-t border-white/10 text-xs sm:text-sm text-[#c5ded5] font-light leading-relaxed italic">
              &ldquo;{VISION_CONTENT.quote}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PART 5: IMMERSIVE FULL STORY MODAL
      ========================================================================= */}
      {activeFounder && (
        <div
          className="fixed inset-0 z-[95] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveFounder(null)}
        >
          <div
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl border border-[#14f884]/40 bg-[#041d1a] p-7 sm:p-10 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setActiveFounder(null)}
              aria-label="Close story"
              className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/75 hover:text-[#14f884] hover:border-[#14f884] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="font-mono-label text-xs text-[#14f884] mb-1.5 block">
              {activeFounder.role}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase leading-tight pr-8">
              {activeFounder.name}
            </h3>
            <p className="mt-2 font-mono-label text-xs sm:text-sm text-[#a9f5cf] italic">
              &ldquo;{activeFounder.hook}&rdquo;
            </p>

            <div className="mt-6 pt-4 border-t border-white/10 space-y-4 text-sm sm:text-base text-[#c7d6d1] font-light leading-relaxed">
              {activeFounder.bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
