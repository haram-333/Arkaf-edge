"use client";

import { ArrowRight } from "lucide-react";
import { BRAND_STATEMENT } from "@/data/content";

export default function WhoWeAreSection() {
  return (
    <section
      id="who-we-are"
      className="relative z-30 min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-8 py-24 sm:py-32 bg-[#050b09] text-white overflow-hidden"
    >
      {/* Subtle dark emerald radial atmosphere matching original Who We Are stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 65% at 50% 50%, rgba(20,248,132,0.09) 0%, rgba(5,11,9,0.35) 55%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center justify-center">
        <span className="inline-block rounded-[5px] bg-[#a9f5cf] text-[#051a12] font-mono-label text-[9px] sm:text-[10px] font-semibold px-3 py-1 mb-2.5 sm:mb-3 shadow-[0_0_24px_rgba(169,245,207,0.38)]">
          {BRAND_STATEMENT.badge}
        </span>

        <h2 className="text-[clamp(1.75rem,3.8vw,3.2rem)] font-medium tracking-[-0.035em] leading-[1.08] max-w-3xl uppercase">
          <span className="block text-white">{BRAND_STATEMENT.headlineWhite}</span>
          <span className="block text-[#14f884] neon-text-glow">
            {BRAND_STATEMENT.headlineGreen}
          </span>
        </h2>

        <div className="mt-4 sm:mt-5 max-w-2xl space-y-2.5 text-center">
          {BRAND_STATEMENT.paragraphs.map((para, i) => (
            <p
              key={i}
              className={`text-[clamp(0.85rem,1.15vw,1.02rem)] leading-relaxed ${
                i === BRAND_STATEMENT.paragraphs.length - 1
                  ? "text-[#14f884] font-semibold text-[clamp(0.92rem,1.25vw,1.08rem)]"
                  : "text-[#c7d6d1] font-light"
              }`}
            >
              {para}
            </p>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 flex items-center gap-3">
          <a
            href="#impact"
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[#6bc999]/40 bg-[#55b886] px-6 sm:px-8 py-3.5 sm:py-4 font-mono-label text-[10.5px] sm:text-[11.5px] font-semibold text-[#04140d] shadow-[0_6px_18px_rgba(72,168,118,0.22)] hover:bg-[#6bc999] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>OUR COMMITMENT TO IMPACT</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>
        </div>
      </div>
    </section>
  );
}
