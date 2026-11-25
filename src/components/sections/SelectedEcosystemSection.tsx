"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SELECTED_ECOSYSTEM_CONTENT } from "@/data/content";

export default function SelectedEcosystemSection() {
  return (
    <section
      id="ecosystem"
      className="relative bg-[#041d1a] text-white py-14 sm:py-22 border-t border-white/15"
    >
      <div className="max-w-[1140px] mx-auto px-5 sm:px-10">
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <span className="inline-block rounded-full border border-[#14f884]/25 bg-[#072924] font-mono-label text-[9.5px] sm:text-[10px] text-[#14f884] px-3.5 py-1.5 mb-4">
            {SELECTED_ECOSYSTEM_CONTENT.badge}
          </span>
          <h2 className="text-[clamp(1.85rem,4vw,3.4rem)] font-black tracking-[-0.03em] leading-[1.02] uppercase">
            <span className="block text-white">
              {SELECTED_ECOSYSTEM_CONTENT.headlineWhite}
            </span>
            <span className="block text-[#14f884] neon-text-glow">
              {SELECTED_ECOSYSTEM_CONTENT.headlineGreen}
            </span>
          </h2>
        </div>

        {/* Modern 6-Col Interactive Bento Grid (3 + 2 Asymmetric Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5">
          {SELECTED_ECOSYSTEM_CONTENT.items.map((item, idx) => {
            const isHeroTile = idx === 4;
            const spanClass =
              idx < 3
                ? "lg:col-span-2"
                : idx === 3
                ? "lg:col-span-3"
                : "sm:col-span-2 lg:col-span-3";

            return (
              <a
                key={item.num}
                href={item.href}
                className={`group relative rounded-[22px] overflow-hidden p-6 sm:p-8 min-h-[210px] sm:min-h-[235px] flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 ${spanClass} ${
                  isHeroTile
                    ? "bg-[#c6f19d] text-[#051f10] border border-[#c6f19d] shadow-[0_20px_50px_rgba(198,241,157,0.18)]"
                    : "liquid-glass text-white hover:border-[#14f884]/60"
                }`}
              >
                {/* Decorative Architectural Corner Graphic */}
                {idx === 2 && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/art-03.jpg?v=2"
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#031613] via-[#031613]/75 to-transparent" />
                  </>
                )}

                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className={`font-mono-label text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isHeroTile
                        ? "border-[#051f10]/25 bg-white/40 text-[#051f10]"
                        : "border-[#14f884]/35 bg-[#14f884]/10 text-[#14f884]"
                    }`}
                  >
                    {item.num}
                  </span>

                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                      isHeroTile
                        ? "bg-[#051f10] text-[#c6f19d]"
                        : "bg-white/5 text-[#14f884] group-hover:bg-[#14f884] group-hover:text-[#050b09]"
                    }`}
                  >
                    {isHeroTile ? (
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                </div>

                <p
                  className={`relative z-10 font-black tracking-[-0.02em] leading-[1.15] mt-8 ${
                    isHeroTile
                      ? "text-xl sm:text-2xl lg:text-[26px] text-[#051f10]"
                      : "text-xl sm:text-2xl text-white group-hover:text-[#c6f19d] transition-colors"
                  }`}
                >
                  {item.line}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
