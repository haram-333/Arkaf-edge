"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, Sparkles, X, UserCheck } from "lucide-react";
import { IMPACT_STATS, FOUNDERS, VISION_CONTENT } from "@/data/content";

export default function ImpactFoundersSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [activeFounder, setActiveFounder] = useState<(typeof FOUNDERS)[number] | null>(null);

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

  // Close modal on Escape
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
      className="relative bg-[#041d1a] text-white py-14 sm:py-24 border-t border-b border-white/25"
    >
      <div className="max-w-[1040px] mx-auto px-5 sm:px-10">
        {/* Centered Impact Header */}
        <div className="text-center mb-9 sm:mb-12">
          <p className="font-mono-label text-[10px] sm:text-[11px] text-[#14f884] mb-2.5 sm:mb-3">
            06. IMPACT &amp; NUMBERS
          </p>
          <h2 className="text-[clamp(1.75rem,3.5vw,3.15rem)] font-black tracking-[-0.025em] uppercase leading-tight">
            <span className="text-white">MEASURED BY </span>
            <span className="text-[#14f884] neon-text-glow">RESULTS.</span>
          </h2>
        </div>

        {/* 4-Column Wide Stat Boxes matching Screenshot 8 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-16 sm:mb-20">
          {IMPACT_STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className="rounded-[14px] border border-white/30 bg-[#05211e] py-6 sm:py-9 px-3 sm:px-4 text-center hover:border-[#14f884]/70 transition-colors"
            >
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

        {/* THE FOUNDERS: Two Journeys. One Edge. from revised docx */}
        <div className="pt-8 border-t border-white/15">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <span className="inline-block rounded-full border border-[#14f884]/25 bg-[#072924] font-mono-label text-[9.5px] text-[#14f884] px-3.5 py-1.5 mb-3">
                ABOUT &amp; LEADERSHIP
              </span>
              <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
                <span className="text-white">TWO JOURNEYS. </span>
                <span className="text-[#14f884] neon-text-glow">ONE EDGE.</span>
              </h3>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-[#a8beb8] font-light">
              We weren&apos;t born in a boardroom. We were built through detours. Two different journeys arrived at one shared idea: build something meaningful and help others build theirs.
            </p>
          </div>

          {/* Founder Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {FOUNDERS.map((founder) => (
              <div
                key={founder.name}
                onClick={() => setActiveFounder(founder)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActiveFounder(founder)}
                className="group cursor-pointer rounded-[18px] border border-white/20 bg-[#052320] p-6 sm:p-8 flex flex-col justify-between hover:border-[#14f884]/70 hover:-translate-y-1 transition-all focus:outline-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono-label text-[10px] text-[#14f884]">
                      {founder.role}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#14f884] shadow-[0_0_8px_#14f884]" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-white uppercase group-hover:text-[#14f884] transition-colors">
                    {founder.name}
                  </h4>
                  <p className="mt-2 font-mono-label text-[10.5px] text-[#c7f5dd]/90 italic">
                    &ldquo;{founder.hook}&rdquo;
                  </p>
                  <p className="mt-4 text-xs sm:text-sm text-[#a8beb8] font-light leading-relaxed line-clamp-3">
                    {founder.bio[0]}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono-label text-[10px] text-[#14f884] group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                    READ FULL STORY
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs text-white/30">Founder Profile</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OUR VISION BANNER from revised docx */}
        <div className="mt-14 sm:mt-18 rounded-[20px] border border-[#14f884]/35 bg-[#031c19] p-7 sm:p-10 text-center relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(20,248,132,0.35) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block rounded-full border border-[#14f884]/40 bg-[#051a12] px-3.5 py-1 font-mono-label text-[9.5px] text-[#14f884] mb-3">
              OUR VISION
            </span>
            <h4 className="text-lg sm:text-2xl font-black tracking-tight text-white uppercase leading-snug">
              {VISION_CONTENT.headline}
            </h4>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono-label text-[10px] sm:text-xs text-[#a9f5cf]">
              {VISION_CONTENT.pillars.map((p) => (
                <span key={p} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14f884]" />
                  {p}
                </span>
              ))}
            </div>

            <p className="mt-5 pt-4 border-t border-white/10 text-xs sm:text-sm text-[#b8c7c2] font-light leading-relaxed italic">
              &ldquo;{VISION_CONTENT.quote}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Founder Story Modal */}
      {activeFounder && (
        <div
          className="fixed inset-0 z-[95] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveFounder(null)}
        >
          <div
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            className="max-w-xl w-full max-h-[85vh] overflow-y-auto rounded-2xl border border-[#14f884]/40 bg-[#041d1a] p-7 sm:p-9 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setActiveFounder(null)}
              aria-label="Close story"
              className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/75 hover:text-[#14f884] hover:border-[#14f884] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs text-[#14f884] mb-1 block">
              {activeFounder.role}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight pr-8">
              {activeFounder.name}
            </h3>
            <p className="mt-2 font-mono-label text-xs text-[#a9f5cf] italic">
              &ldquo;{activeFounder.hook}&rdquo;
            </p>

            <div className="mt-6 space-y-4 text-sm sm:text-base text-[#c7d6d1] font-light leading-relaxed">
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
