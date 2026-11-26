"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FACTS_CONTENT } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export default function FactsUpcyclingSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reelWrapRef = useRef<HTMLDivElement | null>(null);
  const indiaPathRef = useRef<SVGPathElement | null>(null);
  const globalPathRef = useRef<SVGPathElement | null>(null);
  const [regionView, setRegionView] = useState<"compare" | "india" | "global">("compare");
  const [hoverPoint, setHoverPoint] = useState<number | null>(null);
  const [scrollReelIdx, setScrollReelIdx] = useState(0);
  const [hoveredReelIdx, setHoveredReelIdx] = useState<number | null>(null);

  const activeReelIdx = hoveredReelIdx !== null ? hoveredReelIdx : scrollReelIdx;

  useEffect(() => {
    const section = sectionRef.current;
    const reelWrap = reelWrapRef.current;
    const iPath = indiaPathRef.current;
    const gPath = globalPathRef.current;
    if (!section || !iPath || !gPath) return;

    const iLen = iPath.getTotalLength();
    const gLen = gPath.getTotalLength();
    gsap.set(iPath, { strokeDasharray: iLen, strokeDashoffset: iLen });
    gsap.set(gPath, { strokeDasharray: gLen, strokeDashoffset: gLen });

    const ctx = gsap.context(() => {
      gsap.to(iPath, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });
      gsap.to(gPath, {
        strokeDashoffset: 0,
        duration: 1.4,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });

      if (reelWrap) {
        ScrollTrigger.create({
          trigger: reelWrap,
          start: "top 88%",
          end: "bottom 22%",
          scrub: true,
          onUpdate: (self) => {
            const count = FACTS_CONTENT.reelImages.length;
            const next = Math.min(count - 1, Math.max(0, Math.floor(self.progress * count)));
            setScrollReelIdx(next);
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // SVG Chart coordinate mapping (viewBox 640 x 260)
  const W = 640;
  const H = 260;
  const padX = 48;
  const padTop = 28;
  const padBottom = 38;
  const plotW = W - padX * 2;
  const plotH = H - padTop - padBottom;

  const minVal = 90;
  const maxVal = 300;
  const toX = (i: number) => padX + (i / (FACTS_CONTENT.series.length - 1)) * plotW;
  const toY = (v: number) => padTop + plotH - ((v - minVal) / (maxVal - minVal)) * plotH;

  const buildSmoothPath = (vals: number[]) => {
    const pts = vals.map((v, i) => ({ x: toX(i), y: toY(v) }));
    return pts.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = pts[i - 1];
      const cx = (prev.x + pt.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
    }, "");
  };

  const indiaVals = FACTS_CONTENT.series.map((s) => s.india);
  const globalVals = FACTS_CONTENT.series.map((s) => s.global);
  const indiaD = buildSmoothPath(indiaVals);
  const globalD = buildSmoothPath(globalVals);
  const indiaAreaD = `${indiaD} L ${toX(indiaVals.length - 1)} ${H - padBottom} L ${toX(0)} ${H - padBottom} Z`;

  const showIndia = regionView === "compare" || regionView === "india";
  const showGlobal = regionView === "compare" || regionView === "global";

  const activeDatum =
    hoverPoint !== null
      ? FACTS_CONTENT.series[hoverPoint]
      : FACTS_CONTENT.series[FACTS_CONTENT.series.length - 1];

  return (
    <section
      id="facts"
      ref={sectionRef}
      className="relative z-30 bg-[#031613] text-white py-16 sm:py-24 border-t border-white/10 overflow-hidden"
    >
      {/* Ambient gradient easing down smoothly toward the light Phenomenon section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(241,245,244,0.06))",
        }}
      />

      <div className="relative z-10 max-w-[1220px] mx-auto px-5 sm:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <span className="inline-block rounded-full liquid-glass-pill px-4 py-1.5 font-mono-label text-[9.5px] text-[#14f884] mb-4">
              {FACTS_CONTENT.badge}
            </span>
            <h2 className="text-[clamp(2rem,4.5vw,3.8rem)] font-medium tracking-[-0.035em] leading-[0.98] uppercase">
              <span className="text-white">{FACTS_CONTENT.headlineWhite} </span>
              <span className="text-[#14f884] neon-text-glow">
                {FACTS_CONTENT.headlineGreen}
              </span>
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm text-[#a8beb8] font-light leading-relaxed">
            {FACTS_CONTENT.subtitle}
          </p>
        </div>

        {/* Modern 12-Col Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* BENTO CARD 1 (8 Cols): Interactive Dual-Curve Upcycling Growth Graph */}
          <div className="lg:col-span-8 rounded-[24px] liquid-glass p-5 sm:p-8 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <span className="font-mono-label text-[9px] text-[#14f884] block">
                  GROWTH INDEX TRAJECTORY (2020 = 100)
                </span>
                <p className="text-sm sm:text-base font-semibold text-white mt-0.5">
                  {activeDatum.year} · India {activeDatum.india} vs Global {activeDatum.global}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {[
                  { key: "compare" as const, label: "INDIA + GLOBAL" },
                  { key: "india" as const, label: "INDIA" },
                  { key: "global" as const, label: "GLOBAL" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setRegionView(tab.key)}
                    className={`px-3 py-1 rounded-full font-mono-label text-[9px] font-semibold transition-all cursor-pointer ${
                      regionView === tab.key
                        ? "bg-[#14f884] text-[#050b09]"
                        : "border border-white/15 bg-white/5 text-white/70 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Crisp Responsive Interactive SVG Chart */}
            <div className="relative w-full">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-auto overflow-visible select-none"
                role="img"
                aria-label="Upcycling growth graph comparing India and global trajectory from 2020 to 2030"
              >
                <defs>
                  <linearGradient id="indiaAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14f884" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#14f884" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Subtle Horizontal Grid Lines */}
                {[100, 150, 200, 250].map((val) => (
                  <g key={val}>
                    <line
                      x1={padX}
                      y1={toY(val)}
                      x2={W - padX}
                      y2={toY(val)}
                      stroke="rgba(255,255,255,0.08)"
                      strokeDasharray="3 5"
                    />
                    <text
                      x={padX - 10}
                      y={toY(val) + 3}
                      textAnchor="end"
                      className="fill-white/35 text-[10px] font-mono"
                    >
                      {val}
                    </text>
                  </g>
                ))}

                {/* India Area Shading */}
                <path
                  d={indiaAreaD}
                  fill="url(#indiaAreaGrad)"
                  className={`transition-opacity duration-500 ${
                    showIndia ? "opacity-100" : "opacity-10"
                  }`}
                />

                {/* Global Curve (Lime Dashed/Soft) */}
                <path
                  ref={globalPathRef}
                  d={globalD}
                  fill="none"
                  stroke="#a9f5cf"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className={`transition-opacity duration-500 ${
                    showGlobal ? "opacity-85" : "opacity-15"
                  }`}
                />

                {/* India Curve (Vibrant Neon Emerald) */}
                <path
                  ref={indiaPathRef}
                  d={indiaD}
                  fill="none"
                  stroke="#14f884"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  className={`transition-opacity duration-500 ${
                    showIndia ? "opacity-100" : "opacity-15"
                  }`}
                />

                {/* Interactive Year Nodes & Hover Hit Targets */}
                {FACTS_CONTENT.series.map((pt, i) => {
                  const cx = toX(i);
                  const iy = toY(pt.india);
                  const gy = toY(pt.global);
                  const isFocused = hoverPoint === i;

                  return (
                    <g
                      key={pt.year}
                      onMouseEnter={() => setHoverPoint(i)}
                      onMouseLeave={() => setHoverPoint(null)}
                      onClick={() => setHoverPoint(i)}
                      className="cursor-pointer"
                    >
                      {/* Vertical highlight hairline */}
                      {isFocused && (
                        <line
                          x1={cx}
                          y1={padTop}
                          x2={cx}
                          y2={H - padBottom}
                          stroke="rgba(20,248,132,0.35)"
                          strokeWidth="1"
                        />
                      )}

                      {showGlobal && (
                        <circle
                          cx={cx}
                          cy={gy}
                          r={isFocused ? 5.5 : 3.5}
                          fill="#031613"
                          stroke="#a9f5cf"
                          strokeWidth="2"
                        />
                      )}

                      {showIndia && (
                        <circle
                          cx={cx}
                          cy={iy}
                          r={isFocused ? 6.5 : 4.2}
                          fill="#14f884"
                          stroke="#031613"
                          strokeWidth="2"
                        />
                      )}

                      <text
                        x={cx}
                        y={H - 12}
                        textAnchor="middle"
                        className={`text-[11px] font-mono ${
                          isFocused ? "fill-[#14f884] font-semibold" : "fill-white/55"
                        }`}
                      >
                        {pt.year}
                      </text>

                      {/* Invisible wide touch hit strip */}
                      <rect
                        x={cx - 28}
                        y={padTop}
                        width={56}
                        height={plotH + 24}
                        fill="transparent"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Clean Legend Footer */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono-label">
              <div className="flex items-center gap-5">
                <span className="inline-flex items-center gap-2 text-[#14f884]">
                  <span className="w-3 h-[3px] rounded-full bg-[#14f884]" />
                  INDIA CIRCULAR VELOCITY
                </span>
                <span className="inline-flex items-center gap-2 text-[#a9f5cf]">
                  <span className="w-3 h-[2.5px] rounded-full bg-[#a9f5cf]" />
                  GLOBAL UPCYCLING INDEX
                </span>
              </div>
              <span className="text-white/50">{activeDatum.note}</span>
            </div>
          </div>

          {/* BENTO COLUMN 2 (4 Cols): Dual Stacked Data Bento Cards */}
          <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-5">
            {FACTS_CONTENT.metrics.map((m, idx) => (
              <div
                key={m.label}
                className="flex-1 rounded-[24px] liquid-glass p-6 sm:p-7 flex flex-col justify-between"
              >
                <span className="font-mono-label text-[9.5px] text-[#14f884]">
                  {m.label}
                </span>
                <div className="my-3">
                  <span
                    className={`block text-[clamp(2.2rem,4vw,3.4rem)] font-medium tracking-[-0.035em] leading-none ${
                      idx === 0 ? "text-[#14f884] neon-text-glow" : "text-[#c6f19d]"
                    }`}
                  >
                    {m.value}
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-[#c7d6d1] font-light leading-relaxed">
                  {m.detail}
                </p>
              </div>
            ))}
          </div>

          {/* BENTO ROW 3 (12 Cols): Scroll-Choreographed Expanding Architectural Film Deck */}
          <div
            ref={reelWrapRef}
            onMouseLeave={() => setHoveredReelIdx(null)}
            className="lg:col-span-12 min-w-0 w-full flex flex-col sm:flex-row gap-2.5 sm:gap-3 h-[340px] sm:h-[235px] md:h-[270px]"
          >
            {FACTS_CONTENT.reelImages.map((img, i) => {
              const isFocused = activeReelIdx === i;
              return (
                <button
                  key={img.label}
                  type="button"
                  onMouseEnter={() => setHoveredReelIdx(i)}
                  onClick={() => setHoveredReelIdx(i)}
                  aria-label={img.label}
                  className={`group relative overflow-hidden rounded-[20px] transition-[flex,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer focus:outline-none ${
                    isFocused
                      ? "flex-[3.4] border border-[#14f884]/55 shadow-[0_18px_45px_rgba(20,248,132,0.12)]"
                      : "flex-[0.65] sm:flex-[0.85] border border-white/12"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.label}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                      isFocused
                        ? "opacity-100 saturate-100 scale-100"
                        : "opacity-50 saturate-50 scale-110 group-hover:opacity-75"
                    }`}
                  />

                  <div
                    className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                      isFocused ? "opacity-25" : "opacity-65"
                    }`}
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(3,22,19,0.2) 0%, rgba(3,22,19,0.85) 100%)",
                    }}
                  />

                  <span
                    className={`absolute bottom-3 left-3 font-mono-label text-[9px] font-semibold px-2.5 py-0.5 rounded-full transition-all duration-500 ${
                      isFocused
                        ? "bg-[#14f884] text-[#050b09]"
                        : "bg-black/60 text-white/60 border border-white/15"
                    }`}
                  >
                    0{i + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
