"use client";

import { ArrowRight } from "lucide-react";
import { BRAND_STATEMENT } from "@/data/content";

export default function BrandStatementSection() {
  return (
    <section
      id="brand-statement"
      className="relative bg-[#041d1a] text-white border-t border-b border-white/15 py-20 sm:py-28 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 25% 40%, rgba(20,248,132,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-[1160px] mx-auto px-5 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Manifesto Headline */}
          <div className="lg:col-span-5">
            <span className="inline-block rounded-[5px] bg-[#a9f5cf] text-[#051a12] font-mono-label text-[9.5px] font-semibold px-3 py-1 mb-4 shadow-[0_0_20px_rgba(169,245,207,0.3)]">
              BRAND STATEMENT
            </span>

            <h2 className="text-[clamp(2rem,4.4vw,3.8rem)] font-medium tracking-[-0.038em] leading-[1.03] uppercase">
              <span className="block text-white">{BRAND_STATEMENT.headlineWhite}</span>
              <span className="block text-[#14f884] neon-text-glow">
                {BRAND_STATEMENT.headlineGreen}
              </span>
            </h2>
          </div>

          {/* Right Editorial Paragraphs */}
          <div className="lg:col-span-7 rounded-2xl sm:rounded-[26px] liquid-glass p-6 sm:p-9 space-y-5">
            {BRAND_STATEMENT.paragraphs.map((para, idx) => (
              <p
                key={idx}
                className={
                  idx === BRAND_STATEMENT.paragraphs.length - 1
                    ? "pt-4 border-t border-white/15 text-lg sm:text-xl font-semibold text-[#14f884] leading-snug"
                    : "text-sm sm:text-base text-[#cde0da] font-light leading-[1.72]"
                }
              >
                {para}
              </p>
            ))}

            <div className="pt-2">
              <a
                href="#services"
                className="inline-flex items-center gap-2 font-mono-label text-[10.5px] font-semibold text-[#c6f19d] hover:text-[#14f884] transition-colors"
              >
                <span>WHAT WE DO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
