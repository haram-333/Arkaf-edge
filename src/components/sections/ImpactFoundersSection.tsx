"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { IMPACT_STATS } from "@/data/content";

export default function ImpactFoundersSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

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

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="relative bg-[#041d1a] text-white py-14 sm:py-24 border-t border-b border-white/25"
    >
      <div className="max-w-[1000px] mx-auto px-5 sm:px-10">
        {/* Centered Header matching Screenshot 8 exact proportions */}
        <div className="text-center mb-9 sm:mb-12">
          <p className="font-mono-label text-[10px] sm:text-[11px] text-[#14f884] mb-2.5 sm:mb-3">
            06. IMPACT &amp; NUMBERS
          </p>
          {/* Measured ~3.5vw (~50px @ 1440px) */}
          <h2 className="text-[clamp(1.75rem,3.5vw,3.15rem)] font-black tracking-[-0.025em] uppercase leading-tight">
            <span className="text-white">MEASURED BY </span>
            <span className="text-[#14f884] neon-text-glow">RESULTS.</span>
          </h2>
        </div>

        {/* 4-Column Wide Stat Boxes matching Screenshot 8 exact geometry */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {IMPACT_STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className="rounded-[14px] border border-white/30 bg-[#05211e] py-6 sm:py-9 px-3 sm:px-4 text-center hover:border-[#14f884]/70 transition-colors"
            >
              {/* Measured ~4.0vw (~58px @ 1440px) */}
              <span
                ref={(el) => {
                  numberRefs.current[idx] = el;
                }}
                className="block text-[clamp(2rem,4vw,3.65rem)] font-black text-[#14f884] neon-text-glow tracking-tight leading-none"
              >
                {stat.display}
              </span>
              <span className="mt-2.5 sm:mt-3.5 block font-mono-label text-[8.5px] sm:text-[10.5px] text-[#c7d6d1]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
