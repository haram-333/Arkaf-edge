"use client";

import { ArrowRight } from "lucide-react";
import { WHO_WE_BUILD_WITH_CONTENT } from "@/data/content";

export default function WhoWeBuildWithSection() {
  return (
    <section
      id="build-with"
      className="relative bg-[#041d1a] text-white py-16 sm:py-24 border-t border-white/15"
    >
      <div className="max-w-[1140px] mx-auto px-5 sm:px-10">
        {/* Badge + Dual Scale Polarity Dichotomy */}
        <span className="inline-block rounded-full border border-[#14f884]/25 bg-[#072924] font-mono-label text-[9.5px] sm:text-[10px] text-[#14f884] px-3.5 py-1.5 mb-5">
          {WHO_WE_BUILD_WITH_CONTENT.badge}
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 pb-6 border-b border-white/10">
          <p className="text-lg sm:text-2xl font-light text-[#9abbb0] leading-snug">
            {WHO_WE_BUILD_WITH_CONTENT.polarityLeft}
          </p>
          <p className="text-lg sm:text-2xl font-medium text-white md:text-right leading-snug tracking-[-0.025em]">
            {WHO_WE_BUILD_WITH_CONTENT.polarityRight}
          </p>
        </div>

        {/* Core Qualification Statement */}
        <div className="mt-7 sm:mt-9 flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-10 sm:mb-12">
          <h2 className="text-[clamp(1.85rem,4vw,3.4rem)] font-medium tracking-[-0.038em] leading-[1.03] uppercase">
            <span className="block text-white">
              {WHO_WE_BUILD_WITH_CONTENT.qualWhite}
            </span>
            <span className="block text-[#14f884] neon-text-glow">
              {WHO_WE_BUILD_WITH_CONTENT.qualGreen}
            </span>
          </h2>

          <p className="max-w-md text-sm sm:text-base text-[#cde0da] font-light leading-relaxed">
            {WHO_WE_BUILD_WITH_CONTENT.intro}
          </p>
        </div>

        {/* Asymmetric 3 + 2 Modern Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 sm:gap-5">
          {WHO_WE_BUILD_WITH_CONTENT.archetypes.map((item, idx) => {
            const spanClass = idx < 3 ? "md:col-span-2" : "md:col-span-3";
            return (
              <div
                key={item.num}
                className={`group rounded-[22px] liquid-glass p-6 sm:p-7 min-h-[165px] sm:min-h-[185px] flex flex-col justify-between hover:border-[#14f884]/60 hover:-translate-y-0.5 transition-all duration-300 ${spanClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-label text-[10px] font-semibold text-[#14f884]">
                    {item.num}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#14f884]/35 group-hover:bg-[#14f884] group-hover:shadow-[0_0_10px_#14f884] transition-all" />
                </div>
                <p className="mt-6 text-lg sm:text-xl font-medium text-white leading-snug group-hover:text-[#c6f19d] transition-colors">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Full-Width Closing Manifesto Strip */}
        <div className="mt-6 rounded-[22px] border border-[#14f884]/35 bg-gradient-to-r from-[#06261e] via-[#041c17] to-[#031512] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <p className="text-base sm:text-xl font-semibold text-white leading-snug max-w-2xl">
            {WHO_WE_BUILD_WITH_CONTENT.closing}
          </p>
          <a
            href="#contact"
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-[#14f884] text-[#050b09] font-mono-label text-[10.5px] font-semibold px-6 py-3.5 neon-box-glow hover:bg-[#c6f19d] hover:scale-[1.03] active:scale-[0.98] transition-all"
          >
            <span>START A PROJECT</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>
        </div>
      </div>
    </section>
  );
}
