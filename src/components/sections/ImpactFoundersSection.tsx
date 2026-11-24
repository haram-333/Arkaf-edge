"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Sparkles, X, UserCheck, Compass, Camera, Lightbulb } from "lucide-react";
import { IMPACT_STATS, FOUNDERS, FOUNDER_SPREAD_ITEMS, VISION_CONTENT } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

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

  // GSAP ScrollTrigger: Spread-Out Images & Tiles Animation (Alethia Solves: Trust style)
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
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;

          // As user scrolls from 0 to 0.85, tiles spread outward dynamically
          const spreadFactor = Math.min(Math.max((p - 0.05) / 0.8, 0), 1);
          const easeSpread = gsap.parseEase("power2.out")(spreadFactor);

          tileRefs.current.forEach((el, idx) => {
            if (!el) return;
            const item = FOUNDER_SPREAD_ITEMS[idx];
            if (!item) return;

            // Target coordinates relative to viewport bounds (spread out radially)
            const targetX = item.spreadX * 8.5; // pixel displacement multiplier
            const targetY = item.spreadY * 6.5;

            // Inward clustered start -> Outward spread on scroll
            const currentX = targetX * (0.18 + 0.82 * easeSpread);
            const currentY = targetY * (0.18 + 0.82 * easeSpread);
            const currentScale = 0.82 + 0.18 * easeSpread;
            const currentRot = item.rotation * easeSpread;
            const currentOpacity = 0.35 + 0.65 * easeSpread;

            el.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) scale(${currentScale.toFixed(2)}) rotate(${currentRot.toFixed(1)}deg)`;
            el.style.opacity = String(currentOpacity);
          });

          // Subtle breathing effect on center text
          if (centerText) {
            const textScale = 1 + easeSpread * 0.03;
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
      className="relative bg-[#041d1a] text-white border-t border-b border-white/20 overflow-hidden"
    >
      {/* =========================================================================
          PART 1: IMPACT & NUMBERS COUNTER
      ========================================================================= */}
      <div className="max-w-[1140px] mx-auto px-5 sm:px-10 pt-16 sm:pt-24 pb-12 sm:pb-16">
        <div className="text-center mb-9 sm:mb-12">
          <p className="font-mono-label text-[10px] sm:text-[11px] text-[#14f884] mb-2.5 sm:mb-3">
            06. IMPACT &amp; NUMBERS
          </p>
          <h2 className="text-[clamp(1.75rem,3.5vw,3.15rem)] font-black tracking-[-0.025em] uppercase leading-tight">
            <span className="text-white">MEASURED BY </span>
            <span className="text-[#14f884] neon-text-glow">RESULTS.</span>
          </h2>
        </div>

        {/* 4-Column Wide Stat Boxes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {IMPACT_STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className="rounded-[16px] border border-white/25 bg-[#05211e]/90 backdrop-blur-sm py-6 sm:py-8 px-3 sm:px-4 text-center hover:border-[#14f884]/70 transition-colors shadow-lg"
            >
              <span
                ref={(el) => {
                  numberRefs.current[idx] = el;
                }}
                className="block text-[clamp(2rem,4vw,3.5rem)] font-black text-[#14f884] neon-text-glow tracking-tight leading-none"
              >
                {stat.display}
              </span>
              <span className="mt-2.5 sm:mt-3 block font-mono-label text-[8.5px] sm:text-[10px] text-[#c7d6d1]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          PART 2: SCROLL-DRIVEN SPREAD-OUT FOUNDERS SHOWCASE (Alethia Solves: Trust)
          As user scrolls, surrounding cards spread outwards from behind center!
      ========================================================================= */}
      <div
        ref={spreadTrackRef}
        className="relative h-[220vh] w-full border-t border-white/10"
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
                "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(20,248,132,0.06) 0%, transparent 75%)",
            }}
          />

          {/* Centered Primary Headline & Subtitle */}
          <div
            ref={centerTextRef}
            className="relative z-20 max-w-2xl mx-auto px-6 text-center select-none pointer-events-none transition-transform duration-300"
          >
            <span className="inline-block rounded-full border border-[#14f884]/35 bg-[#072924]/90 px-3.5 py-1 font-mono-label text-[9.5px] sm:text-[10.5px] text-[#14f884] mb-3.5 shadow-[0_0_16px_rgba(20,248,132,0.2)]">
              ABOUT &amp; LEADERSHIP
            </span>
            <h2 className="text-[clamp(1.9rem,4.4vw,3.6rem)] font-black uppercase tracking-tight leading-[1.05]">
              <span className="block text-white">TWO JOURNEYS.</span>
              <span className="block text-[#14f884] neon-text-glow">ONE EDGE.</span>
            </h2>
            <p className="mt-4 text-[clamp(0.85rem,1.15vw,1.05rem)] text-[#d4e4df] font-light leading-relaxed max-w-xl mx-auto">
              We weren&apos;t born in a boardroom. We were built through detours. Two different journeys arrived at one shared idea: build something meaningful and help others build theirs.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 font-mono-label text-[9.5px] text-[#14f884]/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14f884] animate-pulse" />
              <span>SCROLL TO SPREAD DETOURS &amp; INSIGHTS</span>
            </div>
          </div>

          {/* DESKTOP/TABLET (hidden on small mobile): 8 FLOATING SPREAD TILES */}
          <div className="absolute inset-0 z-10 pointer-events-none hidden md:flex items-center justify-center">
            {FOUNDER_SPREAD_ITEMS.map((item, idx) => {
              const isLime = item.theme === "lime";
              const isEmerald = item.theme === "emerald";

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    tileRefs.current[idx] = el;
                  }}
                  className={`absolute w-64 sm:w-72 rounded-[18px] p-4 sm:p-5 shadow-2xl backdrop-blur-md will-change-transform border transition-colors ${
                    isLime
                      ? "bg-[#c6f19d] text-[#051f10] border-[#c6f19d]"
                      : isEmerald
                      ? "bg-[#062c23]/95 text-[#e5f5ee] border-[#14f884]/40"
                      : "bg-[#051c19]/92 text-[#dbe8e4] border-white/20"
                  }`}
                  style={{
                    transform: `translate3d(0px, 0px, 0) scale(0.85)`,
                    opacity: 0.4,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-mono-label text-[8.5px] uppercase tracking-wider font-semibold ${
                        isLime ? "text-[#051f10]/80" : "text-[#14f884]"
                      }`}
                    >
                      {item.badge}
                    </span>
                    <span
                      className={`font-mono-label text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isLime
                          ? "bg-[#051f10] text-[#c6f19d]"
                          : "bg-[#14f884]/20 text-[#14f884] border border-[#14f884]/30"
                      }`}
                    >
                      {item.metric}
                    </span>
                  </div>
                  <h4
                    className={`font-black tracking-tight text-[13px] sm:text-[14px] leading-snug ${
                      isLime ? "text-[#051f10]" : "text-white"
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p
                    className={`mt-1.5 text-[10.5px] sm:text-[11px] leading-relaxed line-clamp-2 ${
                      isLime ? "text-[#051f10]/80" : "text-[#9cb5ad]"
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* MOBILE VIEW (<768px): Responsive horizontal swipe pill list */}
          <div className="absolute bottom-6 inset-x-4 md:hidden z-20 flex gap-2.5 overflow-x-auto pb-2 pointer-events-auto">
            {FOUNDER_SPREAD_ITEMS.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="shrink-0 w-56 rounded-xl border border-white/20 bg-[#05211e]/90 p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono-label text-[8px] text-[#14f884]">
                    {item.badge}
                  </span>
                  <span className="font-mono-label text-[8.5px] text-[#a9f5cf]">
                    {item.metric}
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
          Hover effect: Vibrant color grows in a circle from the arrow button,
          covers the entire card, flips text to dark, and REVEALS EXTENDED STORY!
      ========================================================================= */}
      <div className="max-w-[1140px] mx-auto px-5 sm:px-10 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
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
            Notice how the color originates directly from the arrow button, floods the card, and surfaces the ground-level grit behind each founder.
          </p>
        </div>

        {/* 2 Wide Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {FOUNDERS.map((founder, fIdx) => {
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
                className="group relative rounded-[24px] border border-white/20 bg-[#051e17] overflow-hidden p-7 sm:p-9 flex flex-col justify-between min-h-[460px] sm:min-h-[520px] transition-all duration-300 shadow-2xl cursor-pointer select-none focus:outline-none"
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

                {/* THE GROWING CIRCLE ANIMATION (Exact match to Images 2, 4, 3)
                    Originates at top-right (center of the arrow button: calc(100% - 38px) 38px),
                    expands smoothly to 150% radius, covering the full card! */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 bg-[#c6f19d] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    clipPath: isHovered
                      ? "circle(150% at calc(100% - 38px) 38px)"
                      : "circle(0px at calc(100% - 38px) 38px)",
                  }}
                />

                {/* Card Top Row: Category tag + Arrow Button */}
                <div className="relative z-20 flex items-center justify-between">
                  <span
                    className={`font-mono-label text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full border transition-colors duration-400 ${
                      isHovered
                        ? "border-[#051f10]/30 bg-white/45 text-[#051f10]"
                        : "border-[#14f884]/40 bg-[#051a12]/80 text-[#14f884]"
                    }`}
                  >
                    {founder.tag}
                  </span>

                  {/* Circular Arrow Button (Source of the growing circle) */}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-400 shadow-md ${
                      isHovered
                        ? "bg-[#051f10] text-[#c6f19d] scale-105"
                        : "bg-[#14f884] text-[#050b09] shadow-[0_0_16px_rgba(20,248,132,0.4)]"
                    }`}
                  >
                    <ArrowRight
                      className={`w-4 h-4 stroke-[2.5] transition-transform duration-400 ${
                        isHovered ? "rotate-[-45deg]" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>

                {/* Card Bottom: Names, Hook & REVEALED EXTENDED CONTENT */}
                <div className="relative z-20 mt-auto pt-6">
                  <h4
                    className={`text-2xl sm:text-3xl font-black uppercase tracking-tight transition-colors duration-400 ${
                      isHovered ? "text-[#051f10]" : "text-white"
                    }`}
                  >
                    {founder.name}
                  </h4>

                  <p
                    className={`mt-1 font-mono-label text-[11px] sm:text-[12px] italic transition-colors duration-400 ${
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
                      Smoothly slides down and reveals 4 grounded milestones from docx! */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-out ${
                      isHovered
                        ? "max-h-[360px] opacity-100 mt-4 pt-4 border-t border-[#051f10]/20"
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
      <div className="max-w-[1140px] mx-auto px-5 sm:px-10 pb-16 sm:pb-24">
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
