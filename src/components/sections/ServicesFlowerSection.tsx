"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassFlowerCanvas from "@/components/canvas/GlassFlowerCanvas";
import { SERVICES_CONTENT, SERVICES_DISCIPLINES } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesFlowerSection() {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<number>(0);
  const [scrollActive, setScrollActive] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mobileActive, setMobileActive] = useState(0);

  const activeIdx = hoveredIdx !== null ? hoveredIdx : scrollActive;
  const activeDiscipline = SERVICES_DISCIPLINES[activeIdx] || SERVICES_DISCIPLINES[0];

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;

          const idx = Math.min(
            SERVICES_DISCIPLINES.length - 1,
            Math.max(0, Math.floor(p * SERVICES_DISCIPLINES.length))
          );
          setScrollActive(idx);
          setMobileActive(idx);
        },
      });

      return () => st.kill();
    }, wrapper);

    return () => ctx.revert();
  }, []);

  const scrollToDiscipline = (idx: number) => {
    setMobileActive(idx);
    setScrollActive(idx);
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const progressTargets = [0.10, 0.30, 0.50, 0.70, 0.90];
    const targetScroll =
      wrapper.offsetTop + progressTargets[idx] * (wrapper.offsetHeight - window.innerHeight);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: object) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 1.0 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  return (
    <section
      id="services"
      ref={wrapperRef}
      className="relative z-30 h-[280vh] md:h-[340vh] bg-black"
    >
      <div className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden bg-black flex flex-col justify-between">
        {/* Centered 3D Translucent Emerald Glass Gerbera Daisy */}
        <GlassFlowerCanvas progressRef={progressRef} />

        {/* Subtle radial edge vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 22%, rgba(0,0,0,0.45) 56%, rgba(0,0,0,0.88) 100%)",
          }}
        />

        {/* Top-Center Section Intro: One partner. Many edges. (Compact & Clear of Flower) */}
        <div className="relative z-20 w-full max-w-2xl mx-auto px-4 pt-18 sm:pt-20 md:pt-22 text-center pointer-events-none">
          <div className="inline-flex items-center gap-2 font-mono-label text-[8.5px] sm:text-[10px] text-[#14f884] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14f884]" />
            <span>{SERVICES_CONTENT.eyebrow}</span>
          </div>
          <h2 className="text-[clamp(1.25rem,2.4vw,2.15rem)] font-black tracking-[-0.025em] uppercase leading-tight text-white">
            One partner.{" "}
            <span className="text-[#14f884] neon-text-glow">Many edges.</span>
          </h2>
          <p className="mt-1 text-[10.5px] sm:text-xs text-[#b8c7c2] font-light leading-snug max-w-xl mx-auto">
            {SERVICES_CONTENT.subtitle}
          </p>
        </div>

        {/* MOBILE VIEW (<768px): 5-Tab Switcher + Full Active Spotlight Card Docked at Bottom */}
        <div className="relative z-20 w-full px-4 pb-5 md:hidden mt-auto">
          {/* 5 Horizontal Scrollable Discipline Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 no-scrollbar">
            {SERVICES_DISCIPLINES.map((item, idx) => {
              const active = mobileActive === idx;
              return (
                <button
                  key={item.num}
                  type="button"
                  onClick={() => scrollToDiscipline(idx)}
                  className={`shrink-0 px-3 py-1.5 rounded-full font-mono-label text-[9px] font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-[#14f884] text-[#050b09] shadow-[0_0_12px_rgba(20,248,132,0.5)]"
                      : "liquid-glass-pill text-white/70"
                  }`}
                >
                  {item.num} {item.label}
                </button>
              );
            })}
          </div>

          {/* Active Mobile Card (with max-h overflow guard so short screens never clip) */}
          <div
            data-lenis-prevent
            className="rounded-2xl border border-[#14f884]/30 bg-black/85 backdrop-blur-xl p-4 max-h-[43dvh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-mono-label text-[9px] text-[#14f884] font-bold">
                {activeDiscipline.num} / 05 — {activeDiscipline.label}
              </span>
            </div>
            <p className="text-xs font-bold text-[#a9f5cf] mb-1">
              {activeDiscipline.tagline}
            </p>
            <div className="space-y-1.5 text-[11.5px] text-[#c7d6d1] font-light leading-relaxed">
              {activeDiscipline.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/10">
              <span className="block font-mono-label text-[8px] text-white/45 uppercase mb-1.5">
                Capabilities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeDiscipline.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="px-2 py-0.5 rounded-full border border-white/15 bg-white/5 font-mono-label text-[8.5px] text-[#d4ede4]"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP VIEW (md+): Left 5-Discipline Selector Rail | Open Center Flower | Right Active Spotlight Panel */}
        <div className="hidden md:flex relative z-20 w-full max-w-[1400px] mx-auto px-6 lg:px-10 flex-1 items-center justify-between gap-6 pb-6 pointer-events-none">
          {/* LEFT RAIL: All 5 Disciplines (Compact, Interactive, Uncluttered) */}
          <div
            onMouseLeave={() => setHoveredIdx(null)}
            className="w-[270px] lg:w-[325px] flex flex-col gap-2 pointer-events-auto"
          >
            {SERVICES_DISCIPLINES.map((item, idx) => {
              const isSelected = activeIdx === idx;
              return (
                <button
                  key={item.num}
                  type="button"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onClick={() => scrollToDiscipline(idx)}
                  className={`group w-full text-left rounded-[14px] px-3.5 py-2.5 lg:px-4 lg:py-3 border transition-all duration-300 cursor-pointer focus:outline-none ${
                    isSelected
                      ? "border-[#14f884]/75 bg-[#051d17]/90 shadow-[0_0_24px_rgba(20,248,132,0.16)] translate-x-1.5"
                      : "border-white/10 bg-black/55 backdrop-blur-md hover:border-white/30 hover:bg-[#051410]/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono-label text-[9.5px] font-bold transition-colors ${
                          isSelected ? "text-[#14f884]" : "text-white/45 group-hover:text-[#14f884]/80"
                        }`}
                      >
                        {item.num}
                      </span>
                      <span
                        className={`text-xs lg:text-[13px] font-extrabold uppercase tracking-tight transition-colors ${
                          isSelected ? "text-white" : "text-white/75 group-hover:text-white"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        isSelected
                          ? "bg-[#14f884] shadow-[0_0_8px_#14f884] scale-110"
                          : "bg-white/15 scale-75"
                      }`}
                    />
                  </div>
                  <p
                    className={`mt-0.5 text-[10.5px] lg:text-[11px] font-light leading-snug line-clamp-1 transition-colors ${
                      isSelected ? "text-[#a9f5cf]" : "text-[#8fa8a0]"
                    }`}
                  >
                    {item.tagline}
                  </p>
                </button>
              );
            })}
          </div>

          {/* RIGHT SPOTLIGHT PANEL: Full Verbatim Copy & ALL Capabilities of Active Discipline */}
          <div className="w-[320px] lg:w-[400px] xl:w-[430px] pointer-events-auto">
            <div
              data-lenis-prevent
              className="rounded-[20px] border border-[#14f884]/35 bg-[#041410]/88 backdrop-blur-xl p-5 lg:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.75)] max-h-[65dvh] overflow-y-auto transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#14f884]/12 border border-[#14f884]/35 px-2.5 py-0.5 font-mono-label text-[9px] font-bold text-[#14f884]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14f884]" />
                  {activeDiscipline.num} / 05
                </span>

                <div className="flex items-center gap-1.5">
                  {SERVICES_DISCIPLINES.map((d, i) => (
                    <button
                      key={d.num}
                      type="button"
                      onClick={() => scrollToDiscipline(i)}
                      aria-label={`Select ${d.label}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeIdx === i
                          ? "w-5 bg-[#14f884]"
                          : "w-1.5 bg-white/25 hover:bg-white/55"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-xl lg:text-2xl font-black uppercase tracking-tight text-white leading-tight">
                {activeDiscipline.label}
              </h3>

              <p className="mt-1 font-mono-label text-[10px] lg:text-[11px] font-semibold text-[#14f884] leading-snug">
                {activeDiscipline.tagline}
              </p>

              <div className="mt-3 space-y-2 text-xs lg:text-[13px] text-[#cde0da] font-light leading-[1.52]">
                {activeDiscipline.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <span className="block font-mono-label text-[8.5px] text-white/50 uppercase tracking-wider mb-2">
                  Capabilities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeDiscipline.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="px-2.5 py-1 rounded-full liquid-glass-pill font-mono-label text-[8.5px] lg:text-[9px] text-[#c7f5dd]"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
