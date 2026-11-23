"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
          return Math.max(getScrollAmount() * 1.85, window.innerHeight * 2.4);
        }
        return Math.max(getScrollAmount() * 4.6, window.innerHeight * 4.4);
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
        <span className="text-[30vh] font-black tracking-[-0.04em] text-[#091412]/[0.055] uppercase">
          ARKAF EDGE · STRATEGIC INSIGHT
        </span>
      </div>

      {/* Top Eyebrow positioned cleanly below fixed navbar */}
      <div className="relative z-10 px-4 sm:px-10 pt-16 sm:pt-20 pb-3 sm:pb-4">
        <div className="inline-flex items-center gap-2 font-mono-label text-[10px] sm:text-[10.5px] font-semibold text-[#091412]/80">
          <span className="w-2 h-2 rounded-full bg-[#14f884]" />
          <span>04. THE ARKAF EDGE — PHENOMENON</span>
        </div>
      </div>

      {/* Horizontal Card Track matching Screenshot 4 exact proportions */}
      <div className="relative z-10 flex-1 flex items-center overflow-visible pb-6">
        <div
          ref={trackRef}
          className="flex items-stretch gap-4 sm:gap-6 pl-4 sm:pl-10 pr-8 sm:pr-16 will-change-transform"
        >
          {/* Card 00: Dark Lead Manifesto Card (#0b0f0e) — balanced typography so it never clips */}
          <div className="shrink-0 w-[86vw] sm:w-[430px] lg:w-[460px] h-[60vh] sm:h-[68vh] min-h-[370px] sm:min-h-[410px] max-h-[470px] sm:max-h-[540px] rounded-[20px] sm:rounded-[22px] bg-[#0b0f0e] text-white p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-[0_24px_60px_rgba(9,20,18,0.14)]">
            <div>
              <span className="inline-block rounded-[5px] bg-[#14f884] text-[#051a12] font-mono-label text-[9.5px] font-bold px-3 py-1 mb-4 sm:mb-5">
                {PHENOMENON_LEAD.badge}
              </span>

              <h2 className="text-[clamp(1.55rem,2.65vw,2.6rem)] font-black tracking-[-0.03em] leading-[0.99] uppercase">
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

          {/* Cards 01–04: Pure Clean Edge-to-Edge Artwork + Top-Left Number Pill ONLY */}
          {PHENOMENON_CARDS.map((card) => (
            <div
              key={card.num}
              className={`group shrink-0 relative w-[84vw] sm:w-[420px] lg:w-[450px] h-[60vh] sm:h-[68vh] min-h-[370px] sm:min-h-[410px] max-h-[470px] sm:max-h-[540px] rounded-[20px] sm:rounded-[22px] overflow-hidden bg-gradient-to-br ${card.fallbackGradient} shadow-[0_24px_60px_rgba(9,20,18,0.13)]`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt={card.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Top-left compact dark pill badge matching Screenshot 4 */}
              <span className="absolute top-5 left-5 inline-flex items-center justify-center rounded-full bg-[#0b1311]/90 text-[#14f884] font-mono-label text-[10.5px] font-bold px-3.5 py-1.5">
                {card.num}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
