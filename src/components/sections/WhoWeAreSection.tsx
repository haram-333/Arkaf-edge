"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { BRAND_STATEMENT } from "@/data/content";

const FRAGMENTED_DISCIPLINES = [
  { num: "01", copy: "There are agencies that run advertisements." },
  { num: "02", copy: "Studios that make things beautiful." },
  { num: "03", copy: "Consultants that build strategies." },
  { num: "04", copy: "Developers that build technology." },
];

export default function WhoWeAreSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section
      id="who-we-are"
      className="relative z-30 overflow-hidden bg-gradient-to-b from-[#031513] via-[#040f0d] to-black text-white border-t border-white/15 py-20 sm:py-28 lg:py-32"
    >
      {/* Ambient Emerald Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 72% 45%, rgba(20,248,132,0.09) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 18% 78%, rgba(198,241,157,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-[1220px] mx-auto px-5 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* LEFT: Editorial Brand Statement Headline & Bridge Resolution */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <span className="inline-block rounded-[6px] bg-[#a9f5cf] text-[#051a12] font-mono-label text-[9.5px] sm:text-[10.5px] font-semibold px-3.5 py-1.5 mb-5 shadow-[0_0_24px_rgba(169,245,207,0.32)]">
              {BRAND_STATEMENT.badge}
            </span>

            <h2 className="text-[clamp(2.05rem,4.3vw,3.8rem)] font-medium tracking-[-0.038em] leading-[1.03] uppercase">
              <span className="block text-white">{BRAND_STATEMENT.headlineWhite}</span>
              <span className="block text-[#14f884] neon-text-glow mt-0.5">
                {BRAND_STATEMENT.headlineGreen}
              </span>
            </h2>

            <p className="mt-6 sm:mt-8 text-lg sm:text-xl font-medium text-[#14f884] leading-[1.45] tracking-[-0.02em] max-w-md">
              {BRAND_STATEMENT.paragraphs[2]}
            </p>

            <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[#14f884] bg-[#14f884] px-6 sm:px-7 py-3.5 font-mono-label text-[10.5px] sm:text-[11px] font-semibold text-[#050b09] shadow-[0_0_24px_rgba(20,248,132,0.4)] hover:bg-[#a9f5cf] hover:shadow-[0_0_32px_rgba(20,248,132,0.65)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>WHAT WE DO</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </a>

              <div className="liquid-glass-btn-wrap">
                <a
                  href="#facts"
                  className="liquid-glass-btn text-[#c7f5dd] hover:text-[#14f884] font-mono-label text-[10px] sm:text-[11px] font-semibold px-5 sm:px-6 py-3.5"
                >
                  <span className="liquid-glass-btn-shine" />
                  <span className="relative z-10 flex items-center gap-2">
                    DISCOVER US
                    <ArrowRight className="w-3.5 h-3.5 text-[#14f884]" />
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Interactive Bento Convergence Grid + Core Thesis */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* 2x2 Matrix of Separate Industry Silos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {FRAGMENTED_DISCIPLINES.map((item, idx) => {
                const isLit = hoveredIdx === idx;
                return (
                  <div
                    key={item.num}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className={`group rounded-[20px] liquid-glass p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between min-h-[122px] ${
                      isLit
                        ? "border-[#14f884]/70 -translate-y-0.5 bg-[#06241c]/90 shadow-[0_12px_32px_rgba(20,248,132,0.16)]"
                        : "hover:border-[#14f884]/45"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-label text-[10px] font-semibold text-[#14f884]">
                        {item.num}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          isLit
                            ? "bg-[#14f884] shadow-[0_0_10px_#14f884]"
                            : "bg-white/20"
                        }`}
                      />
                    </div>
                    <p className="mt-4 text-sm sm:text-base font-normal text-[#e3efe9] leading-snug group-hover:text-white transition-colors">
                      {item.copy}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Convergence Synthesis Bar */}
            <div className="rounded-[20px] border border-[#14f884]/45 bg-[#05231b]/80 backdrop-blur-md px-6 sm:px-8 py-5 flex items-center justify-between gap-4 shadow-[0_0_28px_rgba(20,248,132,0.14)]">
              <span className="text-lg sm:text-2xl font-semibold text-white tracking-[-0.025em]">
                We connect{" "}
                <span className="text-[#14f884] neon-text-glow">all of it.</span>
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#14f884] animate-pulse-dot shrink-0" />
            </div>

            {/* Problem & Question Glass Panel */}
            <div className="rounded-[24px] liquid-glass p-6 sm:p-8 lg:p-9 space-y-4">
              <p className="text-sm sm:text-base text-[#cde0da] font-light leading-[1.68]">
                ARKAF Edge works across strategy, branding, marketing, creative production and technology to solve the bigger problem:
              </p>
              <p className="pt-4 border-t border-white/10 text-xl sm:text-2xl lg:text-[26px] font-medium text-[#c6f19d] tracking-[-0.03em] leading-[1.24]">
                How does a good business become a great brand?
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
