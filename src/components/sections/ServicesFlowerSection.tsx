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
      className="relative z-30 h-[290vh] md:h-[340vh] bg-black"
    >
      <div className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden bg-black flex flex-col justify-between">
        {/* Centered 3D Translucent Emerald Glass Gerbera Daisy */}
        <GlassFlowerCanvas progressRef={progressRef} />

        {/* Subtle radial dark edge fade */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 52%, transparent 20%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0.88) 100%)",
          }}
        />

        {/* Top-Center Section Intro */}
        <div className="relative z-20 w-full max-w-2xl mx-auto px-4 pt-18 sm:pt-20 md:pt-22 text-center pointer-events-none">
          <div className="inline-flex items-center gap-2 font-mono-label text-[8.5px] sm:text-[10px] text-[#14f884] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14f884] animate-pulse" />
            <span>{SERVICES_CONTENT.eyebrow}</span>
          </div>
          <h2 className="text-[clamp(1.3rem,2.5vw,2.2rem)] font-black tracking-[-0.025em] uppercase leading-tight text-white">
            One partner.{" "}
            <span className="text-[#14f884] neon-text-glow">Many edges.</span>
          </h2>
          <p className="mt-1 text-[10.5px] sm:text-xs text-[#b8c7c2] font-light leading-snug max-w-xl mx-auto">
            {SERVICES_CONTENT.subtitle}
          </p>
        </div>

        {/* MOBILE VIEW (<768px): 5-Tab Liquid Glass Strip + Clean Bottom Editorial Sheet */}
        <div className="relative z-20 w-full px-3 sm:px-4 pb-4 md:hidden mt-auto">
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
                      : "liquid-glass-pill text-white/75"
                  }`}
                >
                  {item.num} {item.label}
                </button>
              );
            })}
          </div>

          <div
            data-lenis-prevent
            className="rounded-2xl liquid-glass p-4 max-h-[43dvh] overflow-y-auto"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-mono-label text-[9px] text-[#14f884] font-bold">
                {activeDiscipline.num} // 05 — {activeDiscipline.label}
              </span>
            </div>
            <p className="text-xs font-bold text-white mb-1">
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
                    className="px-2.5 py-0.5 rounded-full border border-white/15 bg-white/5 font-mono-label text-[8.5px] text-[#d4ede4]"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP VIEW (md+): Frameless High-Fashion Editorial Layout around Open Flower */}
        <div className="hidden md:flex relative z-20 w-full max-w-[1400px] mx-auto px-8 lg:px-14 flex-1 items-center justify-between gap-6 pointer-events-none">
          {/* LEFT: Weightless Optical Vertical Chapter Index (NO clunky rectangular dashboard boxes!) */}
          <div
            onMouseLeave={() => setHoveredIdx(null)}
            className="relative pl-6 py-2 flex flex-col gap-5 pointer-events-auto"
          >
            {/* Vertical subtle optical rail + animated laser indicator */}
            <div className="absolute left-0 top-2 bottom-2 w-[1.5px] bg-white/12 rounded-full">
              <div
                className="w-[3px] -ml-[0.75px] h-8 rounded-full bg-[#14f884] shadow-[0_0_16px_#14f884] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateY(${activeIdx * 52}px)` }}
              />
            </div>

            {SERVICES_DISCIPLINES.map((item, idx) => {
              const isSelected = activeIdx === idx;
              return (
                <button
                  key={item.num}
                  type="button"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onClick={() => scrollToDiscipline(idx)}
                  className="group text-left h-[32px] flex items-center gap-3.5 cursor-pointer focus:outline-none transition-all duration-300"
                >
                  <span
                    className={`font-mono-label text-[10px] font-bold transition-colors duration-300 ${
                      isSelected
                        ? "text-[#14f884]"
                        : "text-white/30 group-hover:text-[#14f884]/75"
                    }`}
                  >
                    {item.num}
                  </span>
                  <span
                    className={`font-black uppercase tracking-[-0.02em] transition-all duration-300 origin-left ${
                      isSelected
                        ? "text-white text-[clamp(1.05rem,1.45vw,1.35rem)] translate-x-1.5 drop-shadow-[0_0_18px_rgba(20,248,132,0.28)]"
                        : "text-white/35 text-xs lg:text-sm group-hover:text-white/80 group-hover:translate-x-1"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* RIGHT: Frameless Floating Editorial Manifesto + Liquid Glass Capability Constellation */}
          <div className="w-[330px] lg:w-[410px] xl:w-[440px] pointer-events-auto">
            <div
              key={activeDiscipline.num}
              data-lenis-prevent
              className="animate-fade-slide-up relative pl-5 lg:pl-6 py-2 border-l border-[#14f884]/45 bg-gradient-to-r from-black/55 via-black/35 to-transparent backdrop-blur-[2px] rounded-r-2xl max-h-[62dvh] overflow-y-auto"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono-label text-[9.5px] font-bold text-[#14f884] tracking-[0.16em]">
                  [ {activeDiscipline.num} // {activeDiscipline.label} ]
                </span>
              </div>

              <h3 className="text-[clamp(1.35rem,2.1vw,2rem)] font-black text-white leading-[1.12] tracking-[-0.02em]">
                {activeDiscipline.tagline}
              </h3>

              <div className="mt-3 space-y-2 text-xs lg:text-[13.5px] text-[#c7d6d1] font-light leading-[1.58]">
                {activeDiscipline.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <span className="block font-mono-label text-[8.5px] text-white/45 uppercase tracking-widest mb-2">
                  Capabilities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeDiscipline.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="px-2.5 py-1 rounded-full liquid-glass-pill font-mono-label text-[8.5px] lg:text-[9px] text-[#d4ede4]"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Optical Sequence Bar (Desktop) */}
        <div className="hidden md:flex relative z-20 w-full max-w-[1400px] mx-auto px-8 lg:px-14 pb-5 items-center justify-between text-[9px] font-mono-label text-white/40 pointer-events-auto">
          <span>DISCIPLINE 0{activeIdx + 1} / 05</span>
          <div className="flex items-center gap-2">
            {SERVICES_DISCIPLINES.map((d, i) => (
              <button
                key={d.num}
                type="button"
                onClick={() => scrollToDiscipline(i)}
                aria-label={`Jump to ${d.label}`}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIdx === i ? "w-8 bg-[#14f884]" : "w-3 bg-white/20 hover:bg-white/45"
                }`}
              />
            ))}
          </div>
          <span>SCROLL OR SELECT TO EXPLORE</span>
        </div>
      </div>
    </section>
  );
}
