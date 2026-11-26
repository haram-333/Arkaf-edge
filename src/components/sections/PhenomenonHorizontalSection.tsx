"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PHENOMENON_LEAD, PHENOMENON_CARDS } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export default function PhenomenonHorizontalSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const watermarkRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const watermark = watermarkRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        const pad = window.innerWidth < 640 ? 24 : 80;
        const overflow = track.scrollWidth - window.innerWidth + pad;
        return Math.max(0, overflow);
      };

      const getPinDistance = () => {
        if (window.innerWidth < 768) {
          return Math.max(getScrollAmount() * 1.65, window.innerHeight * 2.5);
        }
        return Math.max(getScrollAmount() * 3.1, window.innerHeight * 4.4);
      };

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getPinDistance()}`,
          pin: true,
          scrub: 1.5,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      if (watermark) {
        gsap.fromTo(
          watermark,
          { xPercent: 8 },
          {
            xPercent: -34,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${getPinDistance()}`,
              scrub: 1.5,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const stepTrack = (direction: 1 | -1) => {
    const step = window.innerWidth < 640 ? 320 : 480;
    const target = window.scrollY + direction * step * 1.6;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: object) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(target, { duration: 0.9 });
    } else {
      window.scrollBy({ top: direction * step * 1.6, behavior: "smooth" });
    }
  };

  return (
    <section
      id="phenomenon"
      ref={sectionRef}
      data-theme="light"
      className="relative h-screen w-full overflow-hidden bg-[#f1f5f4] text-[#091412] flex flex-col justify-center"
    >
      {/* Oversized faint parallax background typography behind the cards */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-y-0 left-0 flex items-center whitespace-nowrap will-change-transform"
      >
        <span className="text-[30vh] font-medium tracking-[-0.04em] text-[#091412]/[0.055] uppercase">
          ARKAF EDGE · STRATEGIC INSIGHT
        </span>
      </div>

      {/* Top Header Row with Eyebrow and Slider Navigation Controls */}
      <div className="relative z-10 px-4 sm:px-10 pt-16 sm:pt-20 pb-3 sm:pb-4 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 font-mono-label text-[10px] sm:text-[10.5px] font-semibold text-[#091412]/80">
          <span className="w-2 h-2 rounded-full bg-[#14f884]" />
          <span>04. THE ARKAF EDGE — PHENOMENON</span>
        </div>

        {/* Prev / Next Track Stepper Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => stepTrack(-1)}
            aria-label="Previous artwork"
            className="w-8 h-8 rounded-full border border-[#091412]/20 bg-white/80 hover:bg-[#091412] hover:text-[#14f884] flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => stepTrack(1)}
            aria-label="Next artwork"
            className="w-8 h-8 rounded-full border border-[#091412]/20 bg-white/80 hover:bg-[#091412] hover:text-[#14f884] flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Card Track matching Screenshot 4 exact proportions */}
      <div className="relative z-10 flex-1 flex items-center overflow-visible pb-6">
        <div
          ref={trackRef}
          className="flex items-stretch gap-4 sm:gap-6 pl-4 sm:pl-10 pr-8 sm:pr-16 will-change-transform"
        >
          {/* Card 00: Dark Lead Manifesto Card (#0b0f0e) — exact unified height across all cards */}
          <div className="shrink-0 w-[84vw] sm:w-[400px] lg:w-[435px] h-[58vh] sm:h-[65vh] min-h-[385px] sm:min-h-[410px] max-h-[480px] sm:max-h-[520px] rounded-[20px] sm:rounded-[22px] bg-[#0b0f0e] text-white p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-[0_24px_60px_rgba(9,20,18,0.14)]">
            <div>
              <span className="inline-block rounded-[5px] bg-[#14f884] text-[#051a12] font-mono-label text-[9.5px] font-semibold px-3 py-1 mb-4 sm:mb-5">
                {PHENOMENON_LEAD.badge}
              </span>

              <h2 className="text-[clamp(1.55rem,2.65vw,2.6rem)] font-medium tracking-[-0.035em] leading-[0.99] uppercase">
                {PHENOMENON_LEAD.whiteLines.map((line) => (
                  <span key={line} className="block text-white">
                    {line}
                  </span>
                ))}
                {PHENOMENON_LEAD.greenLines.map((line) => (
                  <span
                    key={line}
                    className="block text-[#14f884] neon-text-glow"
                  >
                    {line}
                  </span>
                ))}
              </h2>
            </div>

            <p className="mt-3 sm:mt-4 text-[clamp(0.75rem,0.95vw,0.92rem)] text-[#a8beb8] font-light leading-[1.52]">
              {PHENOMENON_LEAD.body}
            </p>
          </div>

          {/* Cards 01–06: Curated Visual Frames + Architectural Principle Plaques (exact same dimensions!) */}
          {PHENOMENON_CARDS.map((card, idx) => (
            <div
              key={card.num}
              className={`group shrink-0 relative w-[84vw] sm:w-[400px] lg:w-[435px] h-[58vh] sm:h-[65vh] min-h-[385px] sm:min-h-[410px] max-h-[480px] sm:max-h-[520px] rounded-[20px] sm:rounded-[22px] overflow-hidden bg-gradient-to-br ${card.fallbackGradient} shadow-[0_24px_60px_rgba(9,20,18,0.13)]`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt={card.title}
                loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                  idx === 5 ? "scale-x-[-1] hue-rotate-[-16deg] brightness-90" : ""
                }`}
              />

              {/* Dark gradient scrim keeping top art vibrant and bottom copy crystal clear */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(6,17,14,0.12) 0%, rgba(6,17,14,0.10) 42%, rgba(4,16,13,0.88) 78%, rgba(3,12,10,0.97) 100%)",
                }}
              />

              {/* Top-left compact dark pill badge */}
              <span className="absolute top-5 left-5 inline-flex items-center justify-center rounded-full bg-[#0b1311]/90 text-[#14f884] font-mono-label text-[10.5px] font-semibold px-3.5 py-1.5 border border-[#14f884]/25">
                {card.num}
              </span>

              {/* Bottom Minimal Editorial Principle Plaque */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <span className="block font-mono-label text-[10px] sm:text-[11px] font-semibold text-[#14f884] tracking-[0.12em] uppercase mb-1.5">
                  {card.num} — {card.title}
                </span>
                <p className="text-[clamp(0.9rem,1.2vw,1.1rem)] text-[#f1f6f4] font-medium leading-[1.45]">
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
