"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Sparkles, X } from "lucide-react";
import {
  ABOUT_CONTENT,
  IMPACT_STATS,
  FOUNDERS,
  FOUNDER_SPREAD_ITEMS,
  VISION_CONTENT,
} from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export default function ImpactFoundersSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timelineWrapRef = useRef<HTMLDivElement | null>(null);
  const spineProgressRef = useRef<HTMLDivElement | null>(null);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Active Milestone Focus on Hover
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Hover & Slow Full-Viewport Circular Expand Overlay State
  const [hoveredFounder, setHoveredFounder] = useState<string | null>(null);
  const [activeFounder, setActiveFounder] = useState<(typeof FOUNDERS)[number] | null>(null);
  const [expandOrigin, setExpandOrigin] = useState<{ x: string; y: string }>({
    x: "50%",
    y: "50%",
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const openFounderOverlay = (
    founder: (typeof FOUNDERS)[number],
    e?: React.MouseEvent<HTMLElement>
  ) => {
    if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    if (e) {
      setExpandOrigin({ x: `${e.clientX}px`, y: `${e.clientY}px` });
    } else {
      setExpandOrigin({ x: "50%", y: "50%" });
    }
    setIsExpanded(false);
    setActiveFounder(founder);

    overlayTimerRef.current = setTimeout(() => {
      setIsExpanded(true);
    }, 28);
  };

  const closeFounderOverlay = () => {
    if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    setIsExpanded(false);
    overlayTimerRef.current = setTimeout(() => {
      setActiveFounder(null);
    }, 980);
  };

  useEffect(() => {
    return () => {
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    };
  }, []);

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

  // Scroll-scrubbed Central Luminous Convergence Spine + Node Reveal
  useEffect(() => {
    const wrap = timelineWrapRef.current;
    const spine = spineProgressRef.current;
    if (!wrap) return;

    const ctx = gsap.context(() => {
      if (spine) {
        gsap.fromTo(
          spine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top 70%",
              end: "bottom 75%",
              scrub: true,
            },
          }
        );
      }

      const beats = wrap.querySelectorAll(".convergence-beat");
      beats.forEach((beat) => {
        gsap.fromTo(
          beat,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: beat,
              start: "top 86%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  // Lock page scroll while fullscreen monograph is active
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (activeFounder) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeFounder) closeFounderOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [activeFounder]);

  // Separate timeline beats cleanly while preserving chronological interplay
  const timelineBeats = FOUNDER_SPREAD_ITEMS.filter((item) => item.founderKey !== "shared");
  const convergenceBeat = FOUNDER_SPREAD_ITEMS.find((item) => item.founderKey === "shared");

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="relative bg-[#041d1a] text-white border-t border-b border-white/20"
    >
      {/* =========================================================================
          PART 1: IMPACT & NUMBERS COUNTER
      ========================================================================= */}
      <div className="max-w-[1140px] mx-auto px-5 sm:px-10 pt-12 sm:pt-16 pb-10 sm:pb-12">
        <div className="text-center mb-7 sm:mb-9">
          <p className="font-mono-label text-[10px] sm:text-[11px] text-[#14f884] mb-1.5 sm:mb-2">
            06. IMPACT &amp; NUMBERS
          </p>
          <h2 className="text-[clamp(1.75rem,3.4vw,2.9rem)] font-medium tracking-[-0.035em] uppercase leading-tight">
            <span className="text-white">MEASURED BY </span>
            <span className="text-[#14f884] neon-text-glow">RESULTS.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {IMPACT_STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className="rounded-[18px] liquid-glass py-5 sm:py-6 px-3 sm:px-4 text-center hover:border-[#14f884]/55 transition-colors"
            >
              <span
                ref={(el) => {
                  numberRefs.current[idx] = el;
                }}
                className="block text-[clamp(1.85rem,3.6vw,3.1rem)] font-medium text-[#14f884] neon-text-glow tracking-[-0.03em] leading-none"
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
          PART 3: INTERACTIVE FOUNDER CARDS
          - Exact doc heading (NO patronizing hover guide text!)
          - Slow, silky circular wave on hover (1200ms)
          - Responsive mobile auto-height + CSS Grid crossfade (zero clipping!)
          - Clicking launches slow 1.35s full-viewport circular-wave monograph
      ========================================================================= */}
      <div className="max-w-[1140px] mx-auto px-5 sm:px-10 py-10 sm:py-16">
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 font-mono-label text-[10px] text-[#14f884] mb-2 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE FOUNDERS</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-medium uppercase tracking-[-0.035em]">
            <span className="text-white">TWO JOURNEYS. </span>
            <span className="text-[#14f884] neon-text-glow">ONE EDGE.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {FOUNDERS.map((founder) => {
            const isHovered = hoveredFounder === founder.name;

            return (
              <div
                key={founder.name}
                onMouseEnter={() => setHoveredFounder(founder.name)}
                onMouseLeave={() => setHoveredFounder(null)}
                onClick={(e) => openFounderOverlay(founder, e)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openFounderOverlay(founder)}
                className="group relative rounded-[24px] sm:rounded-[28px] border border-white/20 bg-[#051e17] overflow-hidden p-6 sm:p-8 lg:p-9 min-h-[430px] h-auto md:h-[600px] lg:h-[615px] flex flex-col justify-between transition-all duration-700 shadow-2xl cursor-pointer select-none focus:outline-none"
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

                {/* Slow & Smooth Circular Wave Fill on Hover (1200ms) */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 bg-[#c6f19d] transition-[clip-path] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    clipPath: isHovered
                      ? "circle(165% at calc(100% - 56px) 56px)"
                      : "circle(0px at calc(100% - 56px) 56px)",
                  }}
                />

                {/* Card Top Row: Role tag + Arrow Button */}
                <div className="relative z-20 flex items-center justify-between mb-6 md:mb-0">
                  <span
                    className={`font-mono-label text-[10px] sm:text-[11px] font-semibold px-3 py-1 rounded-full border transition-colors duration-700 ${
                      isHovered
                        ? "border-[#051f10]/30 bg-white/45 text-[#051f10]"
                        : "border-[#14f884]/40 bg-[#051a12]/80 text-[#14f884]"
                    }`}
                  >
                    {founder.tag}
                  </span>

                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-700 shadow-md ${
                      isHovered
                        ? "bg-[#051f10] text-[#c6f19d] scale-105"
                        : "bg-[#55b886] text-[#04140d] shadow-[0_4px_14px_rgba(72,168,118,0.25)]"
                    }`}
                  >
                    <ArrowRight
                      className={`w-4 h-4 stroke-[2.5] transition-transform duration-700 ${
                        isHovered ? "rotate-[-45deg]" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>

                {/* Card Bottom: CSS Grid stacking prevents clipping at any viewport width */}
                <div className="relative z-20 mt-auto">
                  <h4
                    className={`text-2xl sm:text-3xl font-medium uppercase tracking-[-0.03em] transition-colors duration-700 ${
                      isHovered ? "text-[#051f10]" : "text-white"
                    }`}
                  >
                    {founder.name}
                  </h4>

                  <p
                    className={`mt-1 font-mono-label text-[11px] sm:text-[12px] italic transition-colors duration-700 ${
                      isHovered ? "text-[#0b3322] font-semibold" : "text-[#c7f5dd]/90"
                    }`}
                  >
                    &ldquo;{founder.hook}&rdquo;
                  </p>

                  {/* Auto-sizing CSS Grid crossfade on mobile, clean fixed slot on desktop */}
                  <div className="grid grid-cols-1 md:h-[280px] mt-3">
                    {/* LAYER 1: Excerpt Preview */}
                    <div
                      className={`col-start-1 row-start-1 flex flex-col justify-between transition-all duration-700 ${
                        isHovered
                          ? "opacity-0 -translate-y-3 pointer-events-none"
                          : "opacity-100 translate-y-0 pointer-events-auto"
                      }`}
                    >
                      <p className="text-xs sm:text-sm font-light leading-relaxed text-[#a8beb8]">
                        {founder.preview}
                      </p>
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <span className="font-mono-label text-[9.5px] text-white/50">
                          {founder.role}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-[#14f884]" />
                      </div>
                    </div>

                    {/* LAYER 2: Revealed Highlights */}
                    <div
                      className={`col-start-1 row-start-1 flex flex-col justify-between transition-all duration-700 delay-150 ${
                        isHovered
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 translate-y-3 pointer-events-none"
                      }`}
                    >
                      <div className="space-y-1.5 text-[11px] sm:text-[12px] text-[#051f10] font-medium leading-snug sm:leading-relaxed">
                        {founder.revealedHighlights.map((hl, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#051f10] shrink-0 mt-1.5" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#051f10]/15 flex items-center justify-between gap-2">
                        <span className="font-mono-label text-[9.5px] text-[#051f10]/70">
                          {founder.role}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-[#051f10] stroke-[2.5]" />
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
          PART 2: ABOUT — OPEN ARCHITECTURAL PROSE + LUMINOUS CONVERGENCE SPINE
          - Frameless sculptural typography (zero admin filter boxes or truncated text!)
          - Scroll-drawn central emerald spine tracing two paths merging into one edge
      ========================================================================= */}
      <div className="relative border-t border-white/10 bg-gradient-to-b from-[#031613] via-[#041d1a] to-[#041d1a] py-16 sm:py-24 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            background:
              "radial-gradient(ellipse 65% 40% at 50% 10%, rgba(20,248,132,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-[1140px] mx-auto px-5 sm:px-10">
          {/* Open Manifesto Header — Zero boxed clutter */}
          <div className="max-w-4xl">
            <span className="inline-block font-mono-label text-[10px] text-[#14f884] tracking-[0.2em] mb-4">
              ABOUT
            </span>

            <h2 className="text-[clamp(1.85rem,4.2vw,3.75rem)] font-medium uppercase tracking-[-0.038em] leading-[1.03]">
              <span className="block text-white">{ABOUT_CONTENT.sublead.split(".")[0]}.</span>
              <span className="block text-[#14f884] neon-text-glow">
                We were built through detours.
              </span>
            </h2>
          </div>

          {/* Spacious 2-Column Editorial Narrative (ZERO crushed boxes) */}
          <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pb-14 sm:pb-16 border-b border-white/10">
            <p className="lg:col-span-6 text-base sm:text-lg text-[#cde0da] font-light leading-[1.72]">
              {ABOUT_CONTENT.body}
            </p>

            <div className="lg:col-span-6 lg:border-l lg:border-[#14f884]/30 lg:pl-8 space-y-2.5">
              <p className="text-sm sm:text-base text-[#9abbb0] font-light">
                {ABOUT_CONTENT.sharedIdeaLabel}
              </p>
              <div className="space-y-1">
                <p className="text-xl sm:text-2xl font-semibold text-white tracking-[-0.025em]">
                  {ABOUT_CONTENT.sharedIdeaPillars[0]}
                </p>
                <p className="text-xl sm:text-2xl font-semibold text-[#14f884] tracking-[-0.025em]">
                  {ABOUT_CONTENT.sharedIdeaPillars[1]}
                </p>
              </div>
            </div>
          </div>

          {/* Scroll-Animated Central Luminous Convergence Timeline */}
          <div ref={timelineWrapRef} className="relative pt-14 sm:pt-18">
            {/* Top Track Legend Labels */}
            <div className="hidden md:grid grid-cols-2 gap-16 mb-10 text-xs font-mono-label">
              <div className="text-right pr-6 text-[#8eb6a8]">ANURAG RAVIKUMAR</div>
              <div className="text-left pl-6 text-[#8eb6a8]">FAIYAZ ANSARI</div>
            </div>

            {/* Vertical Spine Conduit capped above Convergence Keystone */}
            <div className="relative">
              {/* Background static track */}
              <div className="absolute left-3 md:left-1/2 top-2 bottom-0 w-[1.5px] bg-white/10 -translate-x-1/2" />
              {/* Active scroll-drawn emerald laser line */}
              <div
                ref={spineProgressRef}
                style={{ transformOrigin: "top center" }}
                className="absolute left-3 md:left-1/2 top-2 bottom-0 w-[2px] bg-gradient-to-b from-[#14f884] via-[#14f884] to-[#c6f19d] shadow-[0_0_14px_rgba(20,248,132,0.85)] -translate-x-1/2 will-change-transform"
              />
              {/* Terminal convergence node anchored right at spine end */}
              <span
                aria-hidden="true"
                className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10 w-3.5 h-3.5 rounded-full bg-[#14f884] border-2 border-[#041d1a] shadow-[0_0_16px_rgba(20,248,132,0.9)]"
              />

              <div className="space-y-10 sm:space-y-12 pb-10 sm:pb-14">
                {timelineBeats.map((item) => {
                  const isLeft = item.founderKey === "anurag";
                  const isActive = hoveredNodeId === item.id;
                  const targetFounder = isLeft ? FOUNDERS[0] : FOUNDERS[1];

                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoveredNodeId(item.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      onClick={(e) => openFounderOverlay(targetFounder, e)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && openFounderOverlay(targetFounder)}
                      className="convergence-beat group relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 items-start pl-10 md:pl-0 cursor-pointer focus:outline-none"
                    >
                      {/* Spine Node Indicator */}
                      <div
                        className={`absolute left-3 md:left-1/2 top-2 -translate-x-1/2 z-10 w-3 h-3 rounded-full border transition-all duration-500 ${
                          isActive
                            ? "bg-[#14f884] border-white scale-125 shadow-[0_0_16px_#14f884]"
                            : "bg-[#041d1a] border-[#14f884]/75 group-hover:bg-[#14f884]"
                        }`}
                      />

                      {/* Left Slot (Anurag) */}
                      <div
                        className={`md:pr-8 ${
                          isLeft ? "md:text-right block" : "hidden md:block"
                        }`}
                      >
                        {isLeft && (
                          <div className="relative transition-transform duration-500 group-hover:-translate-x-1">
                            {/* Subtle horizontal connector line on desktop */}
                            <div
                              className={`hidden md:block absolute top-3.5 -right-8 w-8 h-[1px] transition-colors duration-500 ${
                                isActive ? "bg-[#14f884]" : "bg-white/15 group-hover:bg-[#14f884]/60"
                              }`}
                            />
                            <div className="flex flex-wrap items-center md:justify-end gap-2.5 mb-1.5">
                              <span className="font-mono-label text-[10px] text-white/45 md:hidden">
                                {item.founderName} ·
                              </span>
                              <span className="font-mono-label text-[10px] text-white/50">
                                {item.badge}
                              </span>
                              <span className="font-mono-label text-[10.5px] font-semibold text-[#14f884]">
                                {item.year}
                              </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-medium text-white group-hover:text-[#c6f19d] transition-colors leading-tight tracking-[-0.025em]">
                              {item.title}
                            </h3>
                            <p className="mt-2 text-sm sm:text-[15px] text-[#b8cec6] font-light leading-relaxed md:ml-auto max-w-md">
                              {item.subtitle}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right Slot (Faiyaz) */}
                      <div
                        className={`md:pl-8 ${
                          !isLeft ? "md:text-left block" : "hidden md:block"
                        }`}
                      >
                        {!isLeft && (
                          <div className="relative transition-transform duration-500 group-hover:translate-x-1">
                            <div
                              className={`hidden md:block absolute top-3.5 -left-8 w-8 h-[1px] transition-colors duration-500 ${
                                isActive ? "bg-[#14f884]" : "bg-white/15 group-hover:bg-[#14f884]/60"
                              }`}
                            />
                            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                              <span className="font-mono-label text-[10.5px] font-semibold text-[#14f884]">
                                {item.year}
                              </span>
                              <span className="font-mono-label text-[10px] text-white/50">
                                {item.badge}
                              </span>
                              <span className="font-mono-label text-[10px] text-white/45 md:hidden">
                                · {item.founderName}
                              </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-medium text-white group-hover:text-[#c6f19d] transition-colors leading-tight tracking-[-0.025em]">
                              {item.title}
                            </h3>
                            <p className="mt-2 text-sm sm:text-[15px] text-[#b8cec6] font-light leading-relaxed max-w-md">
                              {item.subtitle}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Luminous Convergence Keystone — Spacious architectural glass card below spine */}
            {convergenceBeat && (
              <div className="convergence-beat relative pt-12 sm:pt-16 flex justify-center">
                <div className="w-full max-w-2xl rounded-2xl sm:rounded-[24px] liquid-glass px-6 sm:px-10 py-6 sm:py-8 text-left sm:text-center">
                  <span className="inline-block font-mono-label text-[10px] text-[#14f884] tracking-[0.2em] mb-2">
                    {convergenceBeat.badge}
                  </span>
                  <p className="text-lg sm:text-2xl font-semibold text-white tracking-[-0.025em] leading-snug">
                    {convergenceBeat.title}
                  </p>
                  <p className="mt-2.5 text-sm sm:text-[15px] text-[#c7d6d1] font-light leading-relaxed max-w-xl sm:mx-auto">
                    {convergenceBeat.subtitle}
                  </p>
                </div>
              </div>
            )}
          </div>
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
            <h4 className="text-xl sm:text-3xl font-medium tracking-[-0.03em] text-white uppercase leading-snug">
              {VISION_CONTENT.headline}
            </h4>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-5 font-mono-label text-[10.5px] sm:text-xs text-[#a9f5cf]">
              {VISION_CONTENT.pillars.map((p) => (
                <span
                  key={p}
                  className="flex items-center gap-1.5 bg-[#05261f]/80 px-3 py-1 rounded-full border border-[#14f884]/25"
                >
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
          PART 5: SLOW, SILKY FULL-VIEWPORT CIRCULAR-WAVE BIOGRAPHY OVERLAY
          1.35s smooth circular flood from exact click coordinates
      ========================================================================= */}
      {activeFounder && (
        <div
          data-lenis-prevent
          style={{
            clipPath: isExpanded
              ? `circle(165vmax at ${expandOrigin.x} ${expandOrigin.y})`
              : `circle(0px at ${expandOrigin.x} ${expandOrigin.y})`,
          }}
          className={`fixed inset-0 z-[110] w-screen h-[100dvh] overflow-y-auto bg-[#031612] text-white will-change-[clip-path] transition-[clip-path] ${
            isExpanded
              ? "duration-[1350ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              : "duration-[950ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          }`}
        >
          <div
            className="pointer-events-none fixed inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(20,248,132,0.22) 0%, transparent 55%), radial-gradient(circle at 85% 85%, rgba(198,241,157,0.12) 0%, transparent 50%)",
            }}
          />

          <div className="sticky top-0 z-30 flex items-center justify-between px-5 sm:px-10 py-4 bg-[#031612]/80 backdrop-blur-xl border-b border-white/10">
            <span className="font-mono-label text-[10px] sm:text-[11px] text-[#14f884] font-semibold">
              [ {activeFounder.role} — {activeFounder.name} ]
            </span>

            <button
              type="button"
              onClick={closeFounderOverlay}
              aria-label="Close biography"
              className="inline-flex items-center gap-2 rounded-full liquid-glass-pill px-4 py-1.5 font-mono-label text-[10px] text-white hover:text-[#14f884] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            className={`relative z-10 max-w-6xl mx-auto px-5 sm:px-10 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start transition-opacity duration-700 ${
              isExpanded ? "opacity-100 delay-300" : "opacity-0"
            }`}
          >
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <div className="relative h-56 sm:h-64 w-full rounded-3xl overflow-hidden border border-white/15">
                <Image
                  src={activeFounder.image}
                  alt={activeFounder.name}
                  fill
                  className="object-cover opacity-80"
                  sizes="(max-width: 1024px) 100vw, 420px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#031612] via-[#031612]/30 to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full bg-[#c6f19d] text-[#051f10] font-mono-label text-[9.5px] font-semibold px-3 py-1">
                  {activeFounder.tag}
                </span>
              </div>

              <div>
                <h3 className="text-3xl sm:text-5xl font-medium text-white uppercase tracking-[-0.035em] leading-none">
                  {activeFounder.name}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-[#c6f19d] italic font-medium leading-snug">
                  &ldquo;{activeFounder.hook}&rdquo;
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 text-base sm:text-lg text-[#d8e9e3] font-light leading-[1.78]">
              {activeFounder.bio.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-white font-normal text-lg sm:text-xl leading-relaxed"
                      : i === activeFounder.bio.length - 1
                      ? "text-[#c6f19d] font-medium pt-4 border-t border-white/10"
                      : ""
                  }
                >
                  {paragraph}
                </p>
              ))}

              <div className="pt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/15">
                {FOUNDERS.filter((f) => f.name !== activeFounder.name).map((other) => (
                  <button
                    key={other.name}
                    type="button"
                    onClick={() => setActiveFounder(other)}
                    className="inline-flex items-center gap-2 font-mono-label text-[10.5px] text-[#14f884] hover:underline cursor-pointer"
                  >
                    {other.name}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
