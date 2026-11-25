"use client";

import { useState } from "react";
import { CLIENT_APPROACH_CONTENT } from "@/data/content";

export default function ClientApproachSection() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <section
      id="client-approach"
      className="relative bg-[#041d1a] text-white py-16 sm:py-24 border-t border-white/15"
    >
      <div className="max-w-[1140px] mx-auto px-5 sm:px-10">
        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <span className="inline-block rounded-full border border-[#14f884]/25 bg-[#072924] font-mono-label text-[9.5px] sm:text-[10px] text-[#14f884] px-3.5 py-1.5 mb-4">
            {CLIENT_APPROACH_CONTENT.badge}
          </span>
          <h2 className="text-[clamp(2rem,4.5vw,3.9rem)] font-black tracking-[-0.03em] leading-[0.98] uppercase">
            <span className="block text-white">
              {CLIENT_APPROACH_CONTENT.headlineWhite}
            </span>
            <span className="block text-[#14f884] neon-text-glow">
              {CLIENT_APPROACH_CONTENT.headlineGreen}
            </span>
          </h2>
        </div>

        {/* Contrast Bento Architecture: Old Agency Loop vs Deeper Partnership */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Left Bento: Traditional Relationship */}
          <div className="lg:col-span-5 rounded-[24px] border border-white/10 bg-[#031310]/95 p-6 sm:p-8 flex flex-col justify-between">
            <p className="text-base sm:text-lg text-[#9bb3ab] font-light leading-relaxed mb-8">
              {CLIENT_APPROACH_CONTENT.traditionalLead}
            </p>

            <div className="space-y-3">
              {CLIENT_APPROACH_CONTENT.traditionalSteps.map((step, i) => (
                <div
                  key={step}
                  className="flex items-center justify-between py-2.5 border-b border-white/10 last:border-b-0"
                >
                  <span className="font-mono-label text-[10px] text-white/30">
                    0{i + 1}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-white/35 line-through decoration-white/25 tracking-tight">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Bento: Deeper Partnership Commitments */}
          <div className="lg:col-span-7 rounded-[24px] liquid-glass p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-[#14f884] mb-6">
              {CLIENT_APPROACH_CONTENT.deeperLead}
            </h3>

            <div
              onMouseLeave={() => setHoveredRow(null)}
              className="space-y-1"
            >
              {CLIENT_APPROACH_CONTENT.commitments.map((line, idx) => {
                const isLit = hoveredRow === idx;
                return (
                  <div
                    key={line}
                    onMouseEnter={() => setHoveredRow(idx)}
                    className={`group flex items-start gap-3.5 py-2.5 px-3 -mx-3 rounded-xl transition-all duration-300 ${
                      isLit ? "bg-[#14f884]/10" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <span
                      className={`mt-2 w-2 h-2 rounded-full shrink-0 transition-all duration-300 ${
                        isLit
                          ? "bg-[#14f884] shadow-[0_0_10px_#14f884] scale-125"
                          : "bg-[#14f884]/45"
                      }`}
                    />
                    <p
                      className={`text-sm sm:text-base leading-relaxed transition-colors duration-300 ${
                        isLit ? "text-white font-medium" : "text-[#d4e4df] font-light"
                      }`}
                    >
                      {line}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom 3-Column Bento Contrast Triad */}
        <div className="mt-5 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {CLIENT_APPROACH_CONTENT.triad.map((pair) => (
            <div
              key={pair.primary}
              className="rounded-[20px] liquid-glass p-6 sm:p-7 hover:border-[#14f884]/55 transition-colors"
            >
              <span className="block text-2xl sm:text-[26px] font-black text-white tracking-tight leading-tight">
                {pair.primary}
              </span>
              <span className="mt-1 block text-lg sm:text-xl font-light text-[#8cb1a5]">
                {pair.secondary}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
