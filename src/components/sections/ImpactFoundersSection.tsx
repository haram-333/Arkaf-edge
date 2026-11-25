"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Sparkles, X, Check } from "lucide-react";
import { ABOUT_CONTENT, IMPACT_STATS, FOUNDERS, VISION_CONTENT } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export default function ImpactFoundersSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const spreadTrackRef = useRef<HTMLDivElement | null>(null);
  const spreadStickyRef = useRef<HTMLDivElement | null>(null);
  const centerTextRef = useRef<HTMLDivElement | null>(null);
  const artifactsContainerRef = useRef<HTMLDivElement | null>(null);

  // Individual refs for the 8 Alethia-positioned artifacts
  const item1Ref = useRef<HTMLDivElement | null>(null);
  const item2Ref = useRef<HTMLDivElement | null>(null);
  const item3Ref = useRef<HTMLDivElement | null>(null);
  const item4Ref = useRef<HTMLDivElement | null>(null);
  const item5Ref = useRef<HTMLDivElement | null>(null);
  const item6Ref = useRef<HTMLDivElement | null>(null);
  const item7Ref = useRef<HTMLDivElement | null>(null);
  const item8Ref = useRef<HTMLDivElement | null>(null);

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

  // GSAP: Scroll-Driven Spread Outward from Snug Starting Positions near the text
  useEffect(() => {
    const track = spreadTrackRef.current;
    const sticky = spreadStickyRef.current;
    const centerText = centerTextRef.current;
    if (!track || !sticky) return;

    const ctx = gsap.context(() => {
      // Configuration for each artifact:
      // (dx, dy): Inward offset at progress=0 (snug close to text).
      // As progress -> 1, offset smoothly eases to 0 (spreading out to full Alethia perimeter).
      const SPREAD_ITEMS = [
        { ref: item1Ref, dx: 190, dy: 75, s: 0.94 },   // Top-Far-Left (Mast blueprint)
        { ref: item2Ref, dx: 55, dy: 70, s: 0.95 },    // Top-Center-Left (Telemetry sensor)
        { ref: item3Ref, dx: -35, dy: 45, s: 0.94 },   // Top-Center-Right (Aerial photo + chart)
        { ref: item4Ref, dx: -175, dy: 40, s: 0.94 },  // Top-Far-Right (Ribbed cylinder)
        { ref: item5Ref, dx: 185, dy: 0, s: 0.94 },    // Mid-Far-Left (3D wireframe contour)
        { ref: item6Ref, dx: 55, dy: -60, s: 0.94 },   // Bottom-Center-Left (Foliage photo + graph)
        { ref: item7Ref, dx: -45, dy: -75, s: 0.95 },  // Bottom-Center-Right (Solid lime badge)
        { ref: item8Ref, dx: -175, dy: -50, s: 0.94 }, // Bottom-Far-Right (3D island & stat)
      ];

      const updatePositions = (progress: number) => {
        const p = Math.max(0, Math.min(1, progress));
        const ease = gsap.parseEase("power2.out")(p);
        const inward = 1 - ease;

        SPREAD_ITEMS.forEach(({ ref, dx, dy, s }) => {
          if (!ref.current) return;
          const currX = (dx * inward).toFixed(1);
          const currY = (dy * inward).toFixed(1);
          const currScale = (s + (1 - s) * ease).toFixed(3);
          ref.current.style.transform = `translate3d(${currX}px, ${currY}px, 0) scale(${currScale})`;
        });

        if (centerText) {
          const textScale = (0.98 + 0.03 * ease).toFixed(3);
          centerText.style.transform = `translate(-50%, -48%) scale(${textScale})`;
        }
      };

      // Set initial snug starting position immediately (close to text)
      updatePositions(0);

      // Modern Entrance Animation when section comes into view
      if (centerText) {
        gsap.fromTo(
          centerText,
          { opacity: 0, y: 25, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 0.98,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: track,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      const activeItemElements = SPREAD_ITEMS.map((item) => item.ref.current).filter(Boolean);
      if (activeItemElements.length > 0) {
        gsap.fromTo(
          activeItemElements,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            stagger: 0.04,
            ease: "power2.out",
            scrollTrigger: {
              trigger: track,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Scroll-driven spread scrub: as you scroll down, cards burst outward from snug to wide!
      ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          updatePositions(self.progress);
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
          PART 2: SPREAD-OUT FOUNDERS SHOWCASE (EXACT ALETHIA COMPOSITION)
          Modeled 1:1 on Alethia Solves ("The Biggest Problem in Climate Action: Trust"):
          - 1. Top-Far-Left: Tall vertical card + detached pill badge
          - 2. Top-Center-Left: Horizontal sensor card with checkmark & green equalizer
          - 3. Top-Center-Right: Aerial photo card + overlapping floating chart card!
          - 4. Top-Far-Right: Vertical cylinder component card
          - 5. Mid-Far-Left: Square 3D wireframe contour model card
          - 6. Bottom-Center-Left: Foliage photo card + overlapping line graph card
          - 7. Bottom-Center-Right: High-contrast solid lime badge (shifted right, well clear of text!)
          - 8. Bottom-Far-Right: Dark card with stat & 3D graphic
          - Center Text: 100% CLEAR, UNOBSTRUCTED & OPEN CORRIDOR!
      ========================================================================= */}
      <div
        ref={spreadTrackRef}
        className="relative h-[160vh] w-full border-t border-white/10"
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

          {/* Spatial Stage calibrated to viewport height */}
          <div className="relative w-full max-w-[1360px] h-[min(730px,88vh)] mx-auto px-4">
            {/* CENTER TEXT BLOCK (Centered with safe margin inside perimeter cards on all viewports) */}
            <div
              ref={centerTextRef}
              className="absolute left-1/2 top-[43%] md:top-[48%] -translate-x-1/2 -translate-y-1/2 z-20 max-w-sm md:max-w-[390px] lg:max-w-[500px] xl:max-w-[540px] w-full px-4 text-center select-none pointer-events-none"
            >
              <span className="inline-block rounded-full border border-[#14f884]/35 bg-[#072924]/90 px-3.5 py-1 font-mono-label text-[9px] sm:text-[10px] text-[#14f884] mb-2 shadow-[0_0_16px_rgba(20,248,132,0.2)]">
                {ABOUT_CONTENT.badge}
              </span>
              <h2 className="text-[clamp(1.65rem,3.1vw,2.75rem)] font-black uppercase tracking-tight leading-[1.06]">
                <span className="block text-white">{ABOUT_CONTENT.headlineWhite}</span>
                <span className="block text-[#14f884] neon-text-glow">
                  {ABOUT_CONTENT.headlineGreen}
                </span>
              </h2>
              <p className="mt-2.5 text-xs sm:text-[13.5px] font-semibold text-[#c7f5dd] leading-snug">
                {ABOUT_CONTENT.sublead}
              </p>
              <p className="mt-1.5 text-[11px] sm:text-[12.5px] text-[#d4e4df] font-light leading-relaxed max-w-md mx-auto">
                {ABOUT_CONTENT.body}
              </p>
              <p className="mt-2 text-[10.5px] sm:text-[11.5px] text-[#9ec4b8] font-light">
                {ABOUT_CONTENT.sharedIdeaLabel}{" "}
                <span className="text-[#14f884] font-semibold">
                  {ABOUT_CONTENT.sharedIdeaPillars.join(" ")}
                </span>
              </p>
            </div>

            {/* DESKTOP/TABLET (>=768px): 8 ASYMMETRICAL ARTIFACTS IN EXACT ALETHIA POSITIONS */}
            <div ref={artifactsContainerRef} className="hidden md:block">
              {/* 1. TOP-FAR-LEFT: Tall vertical card + detached pill (Alethia weather mast style) */}
              <div
                ref={item1Ref}
                className="absolute left-[2.5%] top-[3%] z-10 will-change-transform flex items-end gap-2"
              >
                <div className="w-[185px] sm:w-[195px] h-[250px] sm:h-[265px] rounded-3xl border border-white/20 bg-[#051c17]/95 p-3.5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-label text-[8px] text-[#14f884] font-semibold tracking-wider">
                      [AERONAUTICAL 2012]
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#14f884] animate-pulse" />
                  </div>
                  {/* Vertical mast schematic (Alethia mast style) */}
                  <div className="relative h-28 w-full rounded-2xl bg-black/70 border border-white/10 flex items-center justify-center overflow-hidden my-1">
                    <svg viewBox="0 0 100 120" className="w-full h-full stroke-[#14f884] fill-none">
                      <line x1="50" y1="10" x2="50" y2="110" strokeWidth="1.8" />
                      <line x1="20" y1="35" x2="80" y2="35" strokeWidth="1.4" />
                      <circle cx="25" cy="35" r="7" strokeWidth="1.2" />
                      <circle cx="35" cy="25" r="5" strokeWidth="1" />
                      <circle cx="75" cy="35" r="7" strokeWidth="1.2" />
                      <line x1="30" y1="110" x2="50" y2="70" strokeWidth="1" strokeOpacity="0.4" />
                      <line x1="70" y1="110" x2="50" y2="70" strokeWidth="1" strokeOpacity="0.4" />
                      <circle cx="50" cy="15" r="2.5" fill="#14f884" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white leading-tight">Navigating Without a Map</p>
                    <p className="text-[9px] text-[#9cb5ad] leading-snug mt-0.5">Built on-ground commercial resilience.</p>
                  </div>
                </div>
                {/* Floating detached pill (Alethia 1 tCO2e style) */}
                <span className="mb-3 px-2 py-0.5 rounded-full bg-[#14f884] text-[#051f10] font-mono-label text-[8px] font-black shadow-[0_0_12px_rgba(20,248,132,0.45)]">
                  LOGIC
                </span>
              </div>

              {/* 2. TOP-CENTER-LEFT: Horizontal telemetry card (Alethia CLIMAVUE style) */}
              <div
                ref={item2Ref}
                className="absolute left-[26%] top-[7%] z-10 will-change-transform"
              >
                <div className="w-[215px] h-[105px] rounded-2xl border border-white/20 bg-black/90 backdrop-blur-md p-3.5 shadow-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block font-mono-label text-[7.5px] text-[#14f884] uppercase font-bold tracking-wider">
                        CORE PHILOSOPHY
                      </span>
                      <span className="block text-[8px] text-white/50">COMMERCIAL LOGIC</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#14f884] flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#051f10] stroke-[3]" />
                    </div>
                  </div>
                  <p className="text-[11.5px] font-bold text-white leading-snug">
                    &ldquo;Why can&apos;t business do both?&rdquo;
                  </p>
                  <div className="flex items-end justify-between pt-1 border-t border-white/10">
                    <span className="font-mono-label text-[9px] font-bold text-[#14f884]">
                      2.4X VALUE
                    </span>
                    <div className="flex items-end gap-1 h-3.5">
                      <span className="w-1 h-2 rounded-sm bg-[#14f884]" />
                      <span className="w-1 h-3.5 rounded-sm bg-[#14f884]" />
                      <span className="w-1 h-2.5 rounded-sm bg-[#14f884]" />
                      <span className="w-1 h-3.5 rounded-sm bg-[#14f884]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. TOP-CENTER-RIGHT: Aerial photo card + Overlapping floating chart (Alethia style) */}
              <div
                ref={item3Ref}
                className="absolute left-[54%] top-[2%] z-10 will-change-transform"
              >
                <div className="relative">
                  {/* Base Photo Card */}
                  <div className="w-[195px] h-[220px] rounded-3xl overflow-hidden border border-white/20 bg-[#05221b] p-3 shadow-2xl relative flex flex-col justify-between">
                    <div className="relative h-28 w-full rounded-2xl overflow-hidden">
                      <Image
                        src="/images/art-01.jpg"
                        alt="Circularity"
                        fill
                        className="object-cover opacity-75"
                        sizes="195px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#05221b] via-transparent to-transparent" />
                      <span className="absolute top-2 right-2 font-mono-label text-[7px] font-bold px-1.5 py-0.5 rounded bg-black/85 text-[#14f884] border border-[#14f884]/35">
                        2020 • VALUE
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white leading-tight">Waste Into Scalable Value</p>
                      <p className="text-[9px] text-[#9cb5ad] leading-snug mt-0.5">
                        Turning discard into commercial treasure.
                      </p>
                    </div>
                  </div>

                  {/* Overlapping Floating Dark Bar Chart Card (Exact Alethia 8.3 chart layout!) */}
                  <div className="absolute -bottom-2.5 -right-12 w-[160px] h-[80px] rounded-2xl bg-black/92 border border-white/20 p-2.5 shadow-2xl backdrop-blur-md flex flex-col justify-between z-20">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-label text-[8px] text-[#14f884] font-bold">8.5x</span>
                      <span className="font-mono-label text-[7.5px] text-white/50">CIRCULAR VALUE</span>
                    </div>
                    <div className="flex items-end gap-1.5 h-6">
                      <span className="w-1.5 h-2.5 rounded-sm bg-[#14f884]" />
                      <span className="w-1.5 h-5 rounded-sm bg-[#14f884]" />
                      <span className="w-1.5 h-3.5 rounded-sm bg-[#14f884]" />
                      <span className="w-1.5 h-6 rounded-sm bg-[#14f884]" />
                      <span className="w-1.5 h-4.5 rounded-sm bg-[#14f884]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. TOP-FAR-RIGHT: Vertical Component Card (Alethia 3D ribbed cylinder style) */}
              <div
                ref={item4Ref}
                className="absolute right-[2.5%] top-[18%] z-10 will-change-transform"
              >
                <div className="w-[175px] h-[215px] rounded-3xl border border-white/20 bg-[#051d18]/95 p-3.5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
                  <span className="font-mono-label text-[8px] text-[#14f884] font-semibold">
                    [STUDIO FLOOR 2009]
                  </span>
                  {/* Fluted/ribbed cylinder graphic */}
                  <div className="relative h-24 w-full rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden my-1">
                    <svg viewBox="0 0 80 80" className="w-full h-full stroke-[#14f884] fill-none">
                      <ellipse cx="40" cy="18" rx="25" ry="8" strokeWidth="1.2" />
                      <line x1="15" y1="18" x2="15" y2="62" strokeWidth="1" />
                      <line x1="65" y1="18" x2="65" y2="62" strokeWidth="1" />
                      <ellipse cx="40" cy="30" rx="25" ry="8" strokeWidth="1" strokeOpacity="0.7" />
                      <ellipse cx="40" cy="42" rx="25" ry="8" strokeWidth="1" strokeOpacity="0.7" />
                      <ellipse cx="40" cy="54" rx="25" ry="8" strokeWidth="1" strokeOpacity="0.7" />
                      <ellipse cx="40" cy="62" rx="25" ry="8" strokeWidth="1.2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white leading-tight">Swept Floors to Full Shoots</p>
                    <p className="text-[9px] text-[#9cb5ad] leading-snug mt-0.5">7 months to master film cameras.</p>
                  </div>
                </div>
              </div>

              {/* 5. MID-FAR-LEFT: 3D Topographic Wireframe Contour (Alethia style) */}
              <div
                ref={item5Ref}
                className="absolute left-[1.5%] lg:left-[2.5%] top-[48%] z-10 will-change-transform"
              >
                <div className="w-[140px] lg:w-[165px] h-[155px] lg:h-[165px] rounded-3xl border border-white/20 bg-[#051c17]/95 p-3 shadow-2xl backdrop-blur-md flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-label text-[8px] text-[#14f884] font-bold uppercase">
                      [GROUND REALITY]
                    </span>
                    <span className="font-mono-label text-[7.5px] text-white/50">8 SECTORS</span>
                  </div>
                  <div className="relative w-full h-16 flex items-center justify-center my-0.5">
                    <svg viewBox="0 0 140 60" className="w-full h-full stroke-[#14f884] fill-none opacity-85">
                      <ellipse cx="70" cy="30" rx="60" ry="20" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" />
                      <ellipse cx="70" cy="29" rx="44" ry="15" strokeWidth="1" strokeOpacity="0.5" />
                      <ellipse cx="70" cy="28" rx="28" ry="10" strokeWidth="1.2" strokeOpacity="0.75" />
                      <ellipse cx="70" cy="26" rx="14" ry="5.5" strokeWidth="1.4" strokeOpacity="0.95" />
                      <ellipse cx="70" cy="24" rx="6" ry="2.5" fill="#14f884" fillOpacity="0.4" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <p className="text-[9.5px] text-[#c7d6d1] font-medium leading-snug">
                    Collections • Real Estate • BD • Risk
                  </p>
                </div>
              </div>

              {/* 6. BOTTOM-CENTER-LEFT: Foliage photo card + Overlapping Line Graph Card (Alethia style) */}
              <div
                ref={item6Ref}
                className="absolute left-[23%] bottom-[1%] z-10 will-change-transform"
              >
                <div className="relative">
                  {/* Floating Dark Line Graph Card (Alethia 4 tCO2e style overlapping on left) */}
                  <div className="absolute -top-3.5 -left-8 w-[155px] h-[72px] rounded-2xl bg-black/92 border border-white/20 p-2.5 shadow-2xl backdrop-blur-md flex flex-col justify-between z-20">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-label text-[7.5px] text-[#14f884] font-bold uppercase">+14 YRS</span>
                      <span className="font-mono-label text-[7px] text-white/50">REPUTATION</span>
                    </div>
                    {/* Line Graph with dots */}
                    <div className="relative w-full h-5 flex items-center">
                      <svg viewBox="0 0 120 20" className="w-full h-full overflow-visible">
                        <polyline
                          fill="none"
                          stroke="#14f884"
                          strokeWidth="1.5"
                          points="5,16 35,14 65,10 95,5 115,2"
                        />
                        <circle cx="5" cy="16" r="2" fill="#fff" />
                        <circle cx="35" cy="14" r="2" fill="#fff" />
                        <circle cx="65" cy="10" r="2" fill="#fff" />
                        <circle cx="95" cy="5" r="2.5" fill="#14f884" />
                        <circle cx="115" cy="2" r="3" fill="#14f884" />
                      </svg>
                    </div>
                  </div>

                  {/* Base Leaf Photo Card */}
                  <div className="w-[195px] h-[155px] rounded-3xl overflow-hidden border border-white/20 bg-[#05211b] p-3 shadow-2xl flex flex-col justify-between relative">
                    <div className="relative h-18 w-full rounded-2xl overflow-hidden">
                      <Image
                        src="/images/art-02.jpg"
                        alt="Ground reality"
                        fill
                        className="object-cover opacity-60"
                        sizes="195px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#05211b] via-transparent to-transparent" />
                    </div>
                    <div>
                      <span className="font-mono-label text-[7.5px] text-[#14f884] font-semibold">
                        THE SHARED PURPOSE
                      </span>
                      <p className="text-[10.5px] font-bold text-white leading-tight mt-0.5">
                        &ldquo;Help good businesses get seen.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. BOTTOM-CENTER-RIGHT: Solid Lime Badge peeking up (Alethia Carbon Balance style!)
                  CRITICAL: Positioned at left-[53%] bottom-[2%] - completely clear of center text! */}
              <div
                ref={item7Ref}
                className="absolute left-[53%] bottom-[2%] z-10 will-change-transform"
              >
                <div className="w-[210px] h-[110px] rounded-2xl bg-[#c6f19d] text-[#051f10] p-3.5 shadow-2xl border border-[#c6f19d] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-label text-[8px] font-bold uppercase tracking-wider text-[#051f10]/80">
                      BBA 2024 • RESILIENCE
                    </span>
                    <span className="font-mono-label text-[7.5px] font-black px-1.5 py-0.5 rounded bg-[#051f10] text-[#c6f19d]">
                      NO EXCUSES
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] font-black leading-tight text-[#051f10]">
                      Finish What You Started
                    </p>
                    <p className="text-[9.5px] text-[#051f10]/80 leading-snug mt-0.5">
                      Completing education because follow-through defines character.
                    </p>
                  </div>
                </div>
              </div>

              {/* 8. BOTTOM-FAR-RIGHT: Dark card with stat & 3D island element (Alethia 42.152 style) */}
              <div
                ref={item8Ref}
                className="absolute right-[2.5%] bottom-[4%] z-10 will-change-transform"
              >
                <div className="w-[185px] h-[160px] rounded-3xl border border-white/20 bg-[#051e17]/95 p-3.5 shadow-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-label text-[7.5px] text-[#14f884] uppercase">
                      [THE EDGE]
                    </span>
                    <span className="font-mono-label text-[7.5px] text-[#14f884] font-bold px-1.5 py-0.5 rounded bg-[#14f884]/15">
                      GRIT
                    </span>
                  </div>
                  <div className="my-1">
                    <span className="block text-[22px] font-black text-[#14f884] leading-none">
                      42+
                    </span>
                    <span className="block font-mono-label text-[8px] text-white/50">
                      FOUNDERS BACKED
                    </span>
                  </div>
                  <p className="text-[10.5px] font-bold text-white leading-tight">
                    &ldquo;Keep moving.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* MOBILE VIEW (<768px): Clean horizontal swipe pill carousel */}
            <div className="absolute bottom-4 inset-x-2 md:hidden z-20 flex gap-2.5 overflow-x-auto pb-2 pointer-events-auto">
              <div className="shrink-0 w-52 rounded-xl border border-white/20 bg-[#05211e]/90 p-3">
                <span className="font-mono-label text-[8px] text-[#14f884]">[AERONAUTICAL 2012]</span>
                <p className="text-xs font-bold text-white mt-1">Navigating Without a Map</p>
                <p className="text-[10px] text-[#9cb5ad]">Sudden medical detour built frontline logic.</p>
              </div>
              <div className="shrink-0 w-52 rounded-xl border border-white/20 bg-[#05211e]/90 p-3">
                <span className="font-mono-label text-[8px] text-[#14f884]">[STUDIO FLOOR 2009]</span>
                <p className="text-xs font-bold text-white mt-1">Swept Floors to Full Shoots</p>
                <p className="text-[10px] text-[#9cb5ad]">7 months to master film cameras.</p>
              </div>
              <div className="shrink-0 w-52 rounded-xl bg-[#c6f19d] text-[#051f10] p-3">
                <span className="font-mono-label text-[8px] font-bold">[BBA 2024]</span>
                <p className="text-xs font-black mt-1">Finish What You Started</p>
                <p className="text-[10px] text-[#051f10]/80">Follow-through defines character.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PART 3: INTERACTIVE FOUNDER CARDS (Alethia Style)
          - STRICT FIXED HEIGHT: h-[540px] sm:h-[580px] (ZERO height jump on hover!)
          - Crossfade container prevents any layout expansion
          - Smooth liquid circular wave expansion originating directly from the arrow button:
            clip-path: circle(...) centered at calc(100% - 56px) 56px
          - Duration calibrated to 700ms with easeOutQuint curve (luxurious & smooth, never too fast!)
          - Clean header without patronizing explanatory subtext
      ========================================================================= */}
      <div className="max-w-[1140px] mx-auto px-5 sm:px-10 py-10 sm:py-16">
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 font-mono-label text-[10px] text-[#14f884] mb-2 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE FOUNDERS — TWO JOURNEYS. ONE EDGE.</span>
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
                className="group relative rounded-[28px] border border-white/20 bg-[#051e17] overflow-hidden p-7 sm:p-9 h-[540px] sm:h-[580px] flex flex-col justify-between transition-all duration-500 shadow-2xl cursor-pointer select-none focus:outline-none"
              >
                {/* Visual Background Photography Layer */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    className="object-cover opacity-20 group-hover:opacity-10 scale-100 group-hover:scale-105 transition-all duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041d1a] via-[#051e17]/80 to-transparent" />
                </div>

                {/* THE GROWING CIRCLE ANIMATION (Exact match to Alethia reference)
                    - Originates directly at the center of the arrow button: calc(100% - 56px) 56px
                    - Smooth, luxurious liquid wave expansion (700ms easeOutQuint)
                    - Floods the entire card cleanly without any lag */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 bg-[#c6f19d] transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    clipPath: isHovered
                      ? "circle(160% at calc(100% - 56px) 56px)"
                      : "circle(0px at calc(100% - 56px) 56px)",
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

                  {/* Circular Arrow Button (Source of the growing circle wave) */}
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
                      className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 delay-100 ${
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
          PART 4: OUR VISION BANNER
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
