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
  const journeyRef = useRef<HTMLDivElement | null>(null);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Interactive Journey Explorer State
  const [journeyFilter, setJourneyFilter] = useState<"all" | "anurag" | "faiyaz">("all");
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    FOUNDER_SPREAD_ITEMS[0].id
  );

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

    // Guarantee initial circle(0px) frame commits before triggering the slow 1.35s expansion
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

  // Cleanup pending timer on unmount
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

  // Clean one-way entrance animation for Journey Matrix (zero conflict, zero position snap!)
  useEffect(() => {
    const journeyEl = journeyRef.current;
    if (!journeyEl) return;

    const ctx = gsap.context(() => {
      const cards = journeyEl.querySelectorAll(".journey-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: journeyEl,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, journeyEl);

    return () => ctx.revert();
  }, []);

  // Close story overlay on Escape & lock background scroll cleanly
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

  const filteredMilestones = FOUNDER_SPREAD_ITEMS.filter((item) => {
    if (journeyFilter === "all") return true;
    return item.founderKey === journeyFilter || item.founderKey === "shared";
  });

  const activeMilestone =
    FOUNDER_SPREAD_ITEMS.find((m) => m.id === selectedMilestoneId) ||
    FOUNDER_SPREAD_ITEMS[0];

  const handleFilterChange = (filter: "all" | "anurag" | "faiyaz") => {
    setJourneyFilter(filter);
    const nextList = FOUNDER_SPREAD_ITEMS.filter(
      (item) => filter === "all" || item.founderKey === filter || item.founderKey === "shared"
    );
    if (nextList.length > 0 && !nextList.some((m) => m.id === selectedMilestoneId)) {
      setSelectedMilestoneId(nextList[0].id);
    }
  };

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
              className="rounded-[18px] liquid-glass py-5 sm:py-6 px-3 sm:px-4 text-center hover:border-[#14f884]/55 transition-colors"
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
          PART 2: MODERN INTERACTIVE "TWO JOURNEYS. ONE EDGE." TIMELINE STAGE
          - Clean architectural split manifesto + interactive milestone matrix
          - Zero overlapping absolute coordinates or scroll jitter!
          - Filterable by Founder (All / Anurag / Faiyaz) with live detail rail
      ========================================================================= */}
      <div
        ref={journeyRef}
        className="relative border-t border-white/10 bg-gradient-to-b from-[#031815] via-[#041d1a] to-[#041d1a] py-14 sm:py-20 overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 65% 45% at 50% 15%, rgba(20,248,132,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-[1140px] mx-auto px-5 sm:px-10">
          {/* Editorial Manifesto Header Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end mb-10 sm:mb-12">
            <div className="lg:col-span-6">
              <span className="inline-block rounded-full liquid-glass-pill px-3.5 py-1 font-mono-label text-[9.5px] text-[#14f884] mb-3.5">
                {ABOUT_CONTENT.badge}
              </span>

              <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black uppercase tracking-[-0.03em] leading-[1.02]">
                <span className="block text-white">{ABOUT_CONTENT.headlineWhite}</span>
                <span className="block text-[#14f884] neon-text-glow">
                  {ABOUT_CONTENT.headlineGreen}
                </span>
              </h2>

              <p className="mt-3 text-sm sm:text-base font-semibold text-[#c7f5dd]">
                {ABOUT_CONTENT.sublead}
              </p>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <p className="text-sm sm:text-[15px] text-[#cde0da] font-light leading-relaxed">
                {ABOUT_CONTENT.body}
              </p>

              <div className="rounded-2xl liquid-glass p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-[#a9bfb8] font-light">
                  {ABOUT_CONTENT.sharedIdeaLabel}
                </span>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {ABOUT_CONTENT.sharedIdeaPillars.map((pillar) => (
                    <span
                      key={pillar}
                      className="px-3 py-1 rounded-full bg-[#14f884]/15 border border-[#14f884]/40 font-mono-label text-[9px] font-bold text-[#14f884]"
                    >
                      {pillar}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Journey Filter Controls + Convergence Spotlight Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: "all" as const, label: "ALL MILESTONES" },
                { key: "anurag" as const, label: "ANURAG RAVIKUMAR" },
                { key: "faiyaz" as const, label: "FAIYAZ ANSARI" },
              ].map((tab) => {
                const active = journeyFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleFilterChange(tab.key)}
                    className={`px-4 py-1.5 rounded-full font-mono-label text-[9.5px] font-bold transition-all cursor-pointer ${
                      active
                        ? "bg-[#14f884] text-[#050b09] shadow-[0_0_16px_rgba(20,248,132,0.4)]"
                        : "liquid-glass-pill text-white/75 hover:text-[#14f884]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <span className="font-mono-label text-[9.5px] text-white/50">
              SELECT ANY DETOUR TO INSPECT · {filteredMilestones.length} NODES
            </span>
          </div>

          {/* Interactive Responsive Timeline Grid (Uniform, Clean, Zero Collision) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredMilestones.map((item) => {
              const isSelected = activeMilestone.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedMilestoneId(item.id)}
                  className={`journey-card group text-left rounded-[20px] p-5 min-h-[195px] flex flex-col justify-between transition-all duration-300 cursor-pointer focus:outline-none ${
                    isSelected
                      ? "border border-[#14f884]/75 bg-[#06241d]/90 shadow-[0_0_28px_rgba(20,248,132,0.16)] -translate-y-0.5"
                      : "liquid-glass hover:border-[#14f884]/40 hover:-translate-y-0.5"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`font-mono-label text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-[#14f884] text-[#050b09]"
                            : "bg-white/5 border border-white/15 text-[#14f884]"
                        }`}
                      >
                        {item.year}
                      </span>
                      <span className="font-mono-label text-[8px] text-white/45 truncate">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-white leading-snug group-hover:text-[#c6f19d] transition-colors">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs text-[#a9bfb8] font-light leading-relaxed line-clamp-3">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <span className="font-mono-label text-[8.5px] text-[#14f884]">
                      {item.founderName}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full transition-all ${
                        isSelected
                          ? "bg-[#14f884] shadow-[0_0_10px_#14f884] scale-110"
                          : "bg-white/20 group-hover:bg-[#14f884]/60"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Selected Milestone Convergence Strip */}
          <div className="mt-5 rounded-2xl border border-[#14f884]/30 bg-[#031512]/90 backdrop-blur-md px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <span className="shrink-0 w-9 h-9 rounded-full bg-[#14f884]/15 border border-[#14f884]/40 flex items-center justify-center font-mono-label text-[10px] font-bold text-[#14f884]">
                →
              </span>
              <div>
                <span className="block font-mono-label text-[9px] text-[#14f884] uppercase">
                  {activeMilestone.founderName} · {activeMilestone.year} · {activeMilestone.badge}
                </span>
                <p className="text-sm text-[#e1efe9] font-light leading-snug mt-0.5">
                  {activeMilestone.subtitle}
                </p>
              </div>
            </div>

            {activeMilestone.founderKey !== "shared" && (
              <button
                type="button"
                onClick={(e) => {
                  const targetFounder =
                    activeMilestone.founderKey === "anurag" ? FOUNDERS[0] : FOUNDERS[1];
                  openFounderOverlay(targetFounder, e);
                }}
                className="shrink-0 inline-flex items-center gap-2 rounded-full liquid-glass-pill px-4 py-2 font-mono-label text-[9.5px] font-bold text-[#14f884] hover:text-white cursor-pointer transition-colors"
              >
                READ {activeMilestone.founderName} STORY
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PART 3: INTERACTIVE FOUNDER CARDS
          - Slow, silky circular wave on hover (1200ms)
          - Responsive mobile auto-height + CSS Grid crossfade (zero clipping!)
          - Clicking launches slow, hypnotic 1.35s full-viewport circular-wave reveal
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

                {/* Card Top Row: Category tag + Arrow Button */}
                <div className="relative z-20 flex items-center justify-between mb-6 md:mb-0">
                  <span
                    className={`font-mono-label text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full border transition-colors duration-700 ${
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
                        : "bg-[#14f884] text-[#050b09] shadow-[0_0_16px_rgba(20,248,132,0.4)]"
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
                    className={`text-2xl sm:text-3xl font-black uppercase tracking-tight transition-colors duration-700 ${
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
                        <span className="font-mono-label text-[10px] text-[#14f884] flex items-center gap-1.5">
                          <span className="hidden md:inline">Hover or click for story</span>
                          <span className="md:hidden">Tap to read full journey</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                        <span className="font-mono-label text-[9px] text-white/45 uppercase">
                          OPEN BIO
                        </span>
                      </div>
                    </div>

                    {/* LAYER 2: Revealed Milestones */}
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
                        <span className="font-mono-label text-[10px] sm:text-[11px] font-bold text-[#051f10] uppercase tracking-wider underline underline-offset-4 inline-flex items-center gap-1.5">
                          READ FULL BIOGRAPHY
                          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                        </span>
                        <span className="font-mono-label text-[9px] text-[#051f10]/70 uppercase">
                          EXPAND
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
          {/* Ambient radial glow backdrop */}
          <div
            className="pointer-events-none fixed inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(20,248,132,0.22) 0%, transparent 55%), radial-gradient(circle at 85% 85%, rgba(198,241,157,0.12) 0%, transparent 50%)",
            }}
          />

          {/* Sticky Top Minimal Navigation Bar */}
          <div className="sticky top-0 z-30 flex items-center justify-between px-5 sm:px-10 py-4 bg-[#031612]/80 backdrop-blur-xl border-b border-white/10">
            <span className="font-mono-label text-[10px] sm:text-[11px] text-[#14f884] font-bold">
              [ {activeFounder.role} — {activeFounder.name} ]
            </span>

            <button
              type="button"
              onClick={closeFounderOverlay}
              aria-label="Close biography"
              className="inline-flex items-center gap-2 rounded-full liquid-glass-pill px-4 py-1.5 font-mono-label text-[10px] text-white hover:text-[#14f884] cursor-pointer transition-colors"
            >
              <span>CLOSE</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Editorial Split Canvas with smooth delayed content fade */}
          <div
            className={`relative z-10 max-w-6xl mx-auto px-5 sm:px-10 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start transition-opacity duration-700 ${
              isExpanded ? "opacity-100 delay-300" : "opacity-0"
            }`}
          >
            {/* Left Monograph Identity & Key Highlights */}
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
                <span className="absolute bottom-4 left-4 rounded-full bg-[#c6f19d] text-[#051f10] font-mono-label text-[9.5px] font-bold px-3 py-1">
                  {activeFounder.tag}
                </span>
              </div>

              <div>
                <h3 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none">
                  {activeFounder.name}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-[#c6f19d] italic font-medium leading-snug">
                  &ldquo;{activeFounder.hook}&rdquo;
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2.5">
                <span className="block font-mono-label text-[9px] text-[#14f884] uppercase tracking-widest">
                  KEY MILESTONES
                </span>
                {activeFounder.revealedHighlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#cde0da] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#14f884] shrink-0 mt-1.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Full Magazine Biography Narrative */}
            <div className="lg:col-span-7 space-y-6 pt-2">
              <div className="font-mono-label text-[10px] text-[#14f884] tracking-widest uppercase">
                THE JOURNEY IN FULL
              </div>
              <div className="space-y-5 text-base sm:text-lg text-[#d8e9e3] font-light leading-[1.78]">
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
              </div>

              <div className="pt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/15">
                {FOUNDERS.filter((f) => f.name !== activeFounder.name).map((other) => (
                  <button
                    key={other.name}
                    type="button"
                    onClick={() => setActiveFounder(other)}
                    className="inline-flex items-center gap-2 font-mono-label text-[10.5px] text-[#14f884] hover:underline cursor-pointer"
                  >
                    READ {other.name}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={closeFounderOverlay}
                  className="rounded-full bg-[#14f884] text-[#050b09] font-mono-label text-[10.5px] font-bold px-5 py-2.5 cursor-pointer hover:bg-[#c6f19d] transition-colors"
                >
                  BACK TO PAGE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
