"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Sparkles, X, UserCheck, Compass, Camera, Lightbulb } from "lucide-react";
import { IMPACT_STATS, FOUNDERS, VISION_CONTENT } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

// Asymmetric, non-uniform spread items inspired by Alethia Solves / Trust (Image 1)
// Notice each item has distinct sizes, themes, tags, and starting perimeter positions (NEVER covering center text!)
const ASYMMETRIC_SPREAD_ITEMS = [
  // 1. Top-Left: Engineering Blueprint Card (Anurag)
  {
    id: "anurag-roots",
    type: "blueprint",
    baseX: -36, // % of half-screen
    baseY: -28,
    driftX: -10,
    driftY: -8,
    rotation: -3.5,
    widthClass: "w-[240px] sm:w-[275px]",
    badge: "[AERONAUTICAL 2012]",
    title: "Navigating Without a Map",
    subtitle: "When a sudden medical detour wiped the map, he learned to build on the ground.",
    tag: "ENGINEERING LOGIC",
    theme: "dark-blueprint",
  },
  // 2. Top-Center: Slim Horizontal Telemetry Pill (Alethia CLIMAVUE style)
  {
    id: "philosophy",
    type: "pill",
    baseX: -8,
    baseY: -42,
    driftX: -2,
    driftY: -10,
    rotation: 1.5,
    widthClass: "w-[250px] sm:w-[285px]",
    badge: "CORE PHILOSOPHY",
    title: '"Why can\'t business do both?"',
    subtitle: "Commercial growth × Planetary responsibility.",
    tag: "IMPACT × VALUE",
    theme: "lime-pill",
  },
  // 3. Top-Right: Nature / Foliage Photo Tile (2020 Epiphany)
  {
    id: "epiphany-2020",
    type: "photo-card",
    baseX: 35,
    baseY: -29,
    driftX: 11,
    driftY: -8,
    rotation: 3,
    widthClass: "w-[245px] sm:w-[280px]",
    badge: "2020 • TURNING POINT",
    title: "Waste Into Scalable Value",
    subtitle: "Exploring how waste itself could become productive, scalable and circular.",
    tag: "CIRCULARITY",
    theme: "photo-green",
  },
  // 4. Mid-Left: Wireframe Topography Contour Sketch
  {
    id: "frontline-ground",
    type: "contour",
    baseX: -42,
    baseY: 2,
    driftX: -12,
    driftY: 2,
    rotation: -2,
    widthClass: "w-[220px] sm:w-[250px]",
    badge: "[GROUND REALITY]",
    title: "8 Frontline Industries",
    subtitle: "Collections • Upselling • Real Estate • BD • Risk Management",
    tag: "14+ YRS EXPERIENCE",
    theme: "contour-dark",
  },
  // 5. Mid-Right: Studio & Analogue Photography Craft (Faiyaz)
  {
    id: "faiyaz-craft",
    type: "studio-card",
    baseX: 38,
    baseY: 4,
    driftX: 12,
    driftY: 4,
    rotation: 3,
    widthClass: "w-[235px] sm:w-[265px]",
    badge: "[STUDIO FLOOR • 2009]",
    title: "Swept Floors to Full Shoots",
    subtitle: "Mastering complete analogue film shoots in 7 months from the ground up.",
    tag: "VISUAL CRAFT",
    theme: "dark-studio",
  },
  // 6. Bottom-Left: Dual Metric Chip & Purpose Tag
  {
    id: "mission-edge",
    type: "metric-chip",
    baseX: -34,
    baseY: 34,
    driftX: -10,
    driftY: 10,
    rotation: -2.5,
    widthClass: "w-[240px] sm:w-[270px]",
    badge: "THE SHARED PURPOSE",
    title: '"Help good businesses get seen."',
    subtitle: "Giving ethical brands the strategic caliber of global market leaders.",
    tag: "ARKAF EDGE",
    theme: "emerald-glass",
  },
  // 7. Bottom-Center-Right: High-Contrast Solid Lime Card (Alethia Carbon Balance style!)
  {
    id: "resilience-bba",
    type: "solid-lime",
    baseX: 4,
    baseY: 40,
    driftX: 2,
    driftY: 12,
    rotation: 2,
    widthClass: "w-[250px] sm:w-[280px]",
    badge: "BBA 2024 • RESILIENCE",
    title: "Finish What You Started",
    subtitle: "Completing interrupted education while operating companies. Follow-through matters.",
    tag: "NO EXCUSES",
    theme: "solid-lime",
  },
  // 8. Bottom-Right: Philosophy / Persistence Pill
  {
    id: "closing-truth",
    type: "pill",
    baseX: 36,
    baseY: 35,
    driftX: 10,
    driftY: 10,
    rotation: -2,
    widthClass: "w-[230px] sm:w-[260px]",
    badge: "[THE EDGE]",
    title: '"Keep moving."',
    subtitle: "Neither building a business nor a life is ever a straight line.",
    tag: "PERSISTENCE",
    theme: "dark-accent",
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

  // GSAP ScrollTrigger: Immediate, responsive spread outward from perimeter positions!
  // CRITICAL FIX: Cards start ALREADY on perimeter (no overlapping center text!) and spread IMMEDIATELY on scroll!
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
        scrub: 0.5, // buttery smooth scrub response
        onUpdate: (self) => {
          const p = self.progress;

          // Immediate spread: 0 to 1 scrubs smoothly without dead buffer
          const spreadFactor = gsap.parseEase("power1.out")(p);

          tileRefs.current.forEach((el, idx) => {
            if (!el) return;
            const item = ASYMMETRIC_SPREAD_ITEMS[idx];
            if (!item) return;

            // Base position is already outside center!
            // On scroll, it drifts further outward by driftX / driftY multipliers
            const currentX = item.baseX * 8.2 + item.driftX * spreadFactor * 9.0;
            const currentY = item.baseY * 6.2 + item.driftY * spreadFactor * 7.5;
            const currentRot = item.rotation * (1 + spreadFactor * 0.4);
            const currentScale = 0.96 + spreadFactor * 0.08;

            el.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) scale(${currentScale.toFixed(2)}) rotate(${currentRot.toFixed(1)}deg)`;
            el.style.opacity = "1";
          });

          // Subtle breathing scale on center text
          if (centerText) {
            const textScale = 1 + spreadFactor * 0.02;
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
          Compact padding (NO big gap between stats and founders!)
      ========================================================================= */}
      <div className="max-w-[1140px] mx-auto px-5 sm:px-10 pt-12 sm:pt-16 pb-8 sm:pb-10">
        <div className="text-center mb-8 sm:mb-10">
          <p className="font-mono-label text-[10px] sm:text-[11px] text-[#14f884] mb-2 sm:mb-2.5">
            06. IMPACT &amp; NUMBERS
          </p>
          <h2 className="text-[clamp(1.75rem,3.4vw,3rem)] font-black tracking-[-0.025em] uppercase leading-tight">
            <span className="text-white">MEASURED BY </span>
            <span className="text-[#14f884] neon-text-glow">RESULTS.</span>
          </h2>
        </div>

        {/* 4-Column Wide Stat Boxes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {IMPACT_STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className="rounded-[16px] border border-white/20 bg-[#05211e]/90 backdrop-blur-sm py-5 sm:py-7 px-3 sm:px-4 text-center hover:border-[#14f884]/60 transition-colors shadow-lg"
            >
              <span
                ref={(el) => {
                  numberRefs.current[idx] = el;
                }}
                className="block text-[clamp(1.9rem,3.8vw,3.25rem)] font-black text-[#14f884] neon-text-glow tracking-tight leading-none"
              >
                {stat.display}
              </span>
              <span className="mt-2 block font-mono-label text-[8.5px] sm:text-[9.5px] text-[#c7d6d1]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          PART 2: SCROLL-DRIVEN SPREAD-OUT FOUNDERS SHOWCASE (Alethia Solves style)
          - Compact track height (140vh) to ELIMINATE any empty gap!
          - Asymmetric cards of different sizes & styles!
          - Cards ALREADY resting outside the center text, spreading IMMEDIATELY!
      ========================================================================= */}
      <div
        ref={spreadTrackRef}
        className="relative h-[140vh] w-full border-t border-white/10"
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

          {/* Centered Primary Headline & Subtitle (Always 100% unobstructed & readable!) */}
          <div
            ref={centerTextRef}
            className="relative z-20 max-w-xl mx-auto px-6 text-center select-none pointer-events-none transition-transform duration-200"
          >
            <span className="inline-block rounded-full border border-[#14f884]/35 bg-[#072924]/90 px-3.5 py-1 font-mono-label text-[9.5px] sm:text-[10px] text-[#14f884] mb-3 shadow-[0_0_16px_rgba(20,248,132,0.2)]">
              ABOUT &amp; LEADERSHIP
            </span>
            <h2 className="text-[clamp(1.85rem,4.2vw,3.4rem)] font-black uppercase tracking-tight leading-[1.05]">
              <span className="block text-white">TWO JOURNEYS.</span>
              <span className="block text-[#14f884] neon-text-glow">ONE EDGE.</span>
            </h2>
            <p className="mt-3.5 text-[clamp(0.82rem,1.1vw,0.98rem)] text-[#d4e4df] font-light leading-relaxed max-w-lg mx-auto">
              We weren&apos;t born in a boardroom. We were built through detours. Two different journeys arrived at one shared idea: build something meaningful and help others build theirs.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 font-mono-label text-[9px] text-[#14f884]/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14f884] animate-pulse" />
              <span>SCROLL TO SPREAD DETOURS &amp; FOUNDATIONS</span>
            </div>
          </div>

          {/* DESKTOP/TABLET (>=768px): 8 ASYMMETRIC FLOATING SPREAD TILES */}
          <div className="absolute inset-0 z-10 pointer-events-none hidden md:flex items-center justify-center">
            {ASYMMETRIC_SPREAD_ITEMS.map((item, idx) => {
              const isSolidLime = item.theme === "solid-lime";
              const isLimePill = item.theme === "lime-pill";
              const isBlueprint = item.theme === "dark-blueprint";
              const isPhoto = item.theme === "photo-green";
              const isContour = item.theme === "contour-dark";

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    tileRefs.current[idx] = el;
                  }}
                  className={`absolute ${item.widthClass} rounded-[18px] p-4 sm:p-4.5 shadow-2xl backdrop-blur-md will-change-transform border transition-all ${
                    isSolidLime
                      ? "bg-[#c6f19d] text-[#051f10] border-[#c6f19d] shadow-[0_12px_32px_rgba(198,241,157,0.25)]"
                      : isLimePill
                      ? "bg-[#06241c]/95 text-[#c6f19d] border-[#14f884]/45 rounded-full px-5 py-2.5"
                      : isBlueprint
                      ? "bg-[#051c18]/92 text-[#dce8e3] border-white/20"
                      : isPhoto
                      ? "bg-[#04201b]/95 text-[#e5f5ee] border-[#14f884]/35"
                      : isContour
                      ? "bg-[#051a16]/90 text-[#d0e0db] border-white/15"
                      : "bg-[#062c23]/95 text-[#e5f5ee] border-[#14f884]/40"
                  }`}
                  style={{
                    // Rendered on perimeter from the start!
                    transform: `translate3d(${(item.baseX * 8.2).toFixed(1)}px, ${(item.baseY * 6.2).toFixed(1)}px, 0) scale(0.96) rotate(${item.rotation}deg)`,
                    opacity: 1,
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`font-mono-label text-[8.5px] uppercase tracking-wider font-semibold ${
                        isSolidLime ? "text-[#051f10]/80" : "text-[#14f884]"
                      }`}
                    >
                      {item.badge}
                    </span>
                    <span
                      className={`font-mono-label text-[8.5px] font-bold px-2 py-0.5 rounded-full ${
                        isSolidLime
                          ? "bg-[#051f10] text-[#c6f19d]"
                          : "bg-[#14f884]/15 text-[#14f884] border border-[#14f884]/30"
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>

                  <h4
                    className={`font-black tracking-tight text-[12.5px] sm:text-[13.5px] leading-snug ${
                      isSolidLime ? "text-[#051f10]" : "text-white"
                    }`}
                  >
                    {item.title}
                  </h4>

                  {item.subtitle && (
                    <p
                      className={`mt-1 text-[10px] sm:text-[10.5px] leading-relaxed line-clamp-2 ${
                        isSolidLime ? "text-[#051f10]/80" : "text-[#9cb5ad]"
                      }`}
                    >
                      {item.subtitle}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* MOBILE VIEW (<768px): Clean horizontal swipe pill carousel */}
          <div className="absolute bottom-6 inset-x-4 md:hidden z-20 flex gap-2.5 overflow-x-auto pb-2 pointer-events-auto">
            {ASYMMETRIC_SPREAD_ITEMS.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="shrink-0 w-56 rounded-xl border border-white/20 bg-[#05211e]/90 p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono-label text-[8px] text-[#14f884]">
                    {item.badge}
                  </span>
                  <span className="font-mono-label text-[8px] text-[#a9f5cf]">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs font-bold text-white line-clamp-1">{item.title}</p>
                <p className="text-[10px] text-[#9cb5ad] line-clamp-1 mt-0.5">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PART 3: INTERACTIVE FOUNDER CARDS (Images 2, 4, 3 style)
          - Smooth, gradual, luxurious circular growth from arrow button (1.0s duration!)
          - Fills card with vibrant lime color (#c6f19d)
          - Flips text to crisp dark black
          - Gracefully unfolds extended real-world story points from docx!
      ========================================================================= */}
      <div className="max-w-[1140px] mx-auto px-5 sm:px-10 py-12 sm:py-18">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 font-mono-label text-[10px] text-[#14f884] mb-2 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE LEADERSHIP BEHIND THE EDGE</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
              <span className="text-white">HOVER CARDS TO </span>
              <span className="text-[#14f884] neon-text-glow">REVEAL THE JOURNEY.</span>
            </h3>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-[#a8beb8] font-light">
            Notice how the color originates directly from the arrow button, floods the card in a smooth wave, and reveals the grounded grit behind each founder.
          </p>
        </div>

        {/* 2 Wide Interactive Cards */}
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
                className="group relative rounded-[24px] border border-white/20 bg-[#051e17] overflow-hidden p-7 sm:p-9 flex flex-col justify-between min-h-[460px] sm:min-h-[520px] transition-all duration-500 shadow-2xl cursor-pointer select-none focus:outline-none"
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

                {/* Card Bottom: Names, Hook & REVEALED EXTENDED CONTENT */}
                <div className="relative z-20 mt-auto pt-6">
                  <h4
                    className={`text-2xl sm:text-3xl font-black uppercase tracking-tight transition-colors duration-500 ${
                      isHovered ? "text-[#051f10]" : "text-white"
                    }`}
                  >
                    {founder.name}
                  </h4>

                  <p
                    className={`mt-1.5 font-mono-label text-[11px] sm:text-[12px] italic transition-colors duration-500 ${
                      isHovered ? "text-[#0b3322] font-semibold" : "text-[#c7f5dd]/90"
                    }`}
                  >
                    &ldquo;{founder.hook}&rdquo;
                  </p>

                  {/* Default unhovered short excerpt */}
                  <p
                    className={`mt-3 text-xs sm:text-sm font-light leading-relaxed transition-opacity duration-300 ${
                      isHovered ? "opacity-0 h-0 overflow-hidden" : "opacity-90 text-[#a8beb8]"
                    }`}
                  >
                    {founder.preview}
                  </p>

                  {/* REVEALED CONTENT ON HOVER:
                      Gracefully unfolds with slight delay (delay-200 duration-700) after the circle wave covers the card! */}
                  <div
                    className={`overflow-hidden transition-all duration-700 delay-200 ease-out ${
                      isHovered
                        ? "max-h-[380px] opacity-100 mt-4 pt-4 border-t border-[#051f10]/20"
                        : "max-h-0 opacity-0 mt-0 pt-0"
                    }`}
                  >
                    <div className="space-y-2 text-[11.5px] sm:text-[12.5px] text-[#051f10] font-medium leading-relaxed">
                      {founder.revealedHighlights.map((hl, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#051f10] shrink-0 mt-1.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#051f10]/15 flex items-center justify-between">
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
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          PART 4: OUR VISION BANNER (From docx)
      ========================================================================= */}
      <div className="max-w-[1140px] mx-auto px-5 sm:px-10 pb-14 sm:pb-20">
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
