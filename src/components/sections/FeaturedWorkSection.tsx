"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { FEATURED_WORK } from "@/data/content";

export default function FeaturedWorkSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.05 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-[#041d1a] text-white py-16 sm:py-28"
    >
      <div className="max-w-[1040px] mx-auto px-5 sm:px-10">
        {/* Exact 3-line Asymmetric Split Header matching Screenshot 9 */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-16">
          <div className="shrink-0">
            <span className="inline-block rounded-full border border-[#14f884]/25 bg-[#072924] font-mono-label text-[9.5px] sm:text-[10px] text-[#14f884] px-3.5 sm:px-4 py-1.5 mb-4 sm:mb-5">
              07. FEATURED WORK — SELECTED WORK
            </span>
            <h2 className="text-[clamp(2.35rem,5.3vw,4.85rem)] font-black tracking-[-0.03em] leading-[0.95] uppercase">
              <span className="block text-white sm:whitespace-nowrap">
                IDEAS THAT
              </span>
              <span className="block text-white">MAKE</span>
              <span className="block text-[#14f884] neon-text-glow sm:whitespace-nowrap">
                AN IMPACT.
              </span>
            </h2>
          </div>

          <p className="max-w-[330px] text-[clamp(0.875rem,1.15vw,1.02rem)] text-[#a8beb8] font-light leading-[1.58] lg:pb-1.5">
            A selection of projects where strategic insight, creative
            production, and digital craft combined to build competitive edge.
          </p>
        </div>

        {/* 3 Full-Width Split Horizontal Case Study Cards matching Screenshots 10, 11, 12 */}
        <div className="space-y-6 sm:space-y-9">
          {FEATURED_WORK.map((project, idx) => (
            <article
              key={project.title}
              style={{ transitionDelay: visible ? `${idx * 120}ms` : "0ms" }}
              className={`group rounded-[18px] sm:rounded-[20px] border border-white/30 bg-[#041e1b] overflow-hidden grid grid-cols-1 lg:grid-cols-12 hover:border-[#14f884]/65 transition-all duration-700 ease-out ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Left 56% Edge-to-Edge Image */}
              <div
                className={`relative lg:col-span-7 h-56 sm:h-80 lg:h-[375px] overflow-hidden bg-gradient-to-br ${project.fallbackGradient}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 sm:top-5 sm:left-5 rounded-full border border-white/20 bg-[#041d1a]/75 backdrop-blur-md font-mono-label text-[10px] font-semibold text-[#14f884] px-3 py-1">
                  {project.year}
                </span>
              </div>

              {/* Right 44% Minimal Deep Teal Panel matching Screenshots 10–12 */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-[#041e1b]">
                <div>
                  <p className="font-mono-label text-[9.5px] sm:text-[10px] text-[#2fb880] mb-2.5 sm:mb-3">
                    {project.tags}
                  </p>
                  <h3 className="text-[clamp(1.35rem,2.35vw,2.15rem)] font-black tracking-[-0.02em] uppercase text-white leading-[1.08]">
                    {project.title}
                  </h3>
                  <p className="mt-3 sm:mt-4 text-[clamp(0.85rem,1.18vw,1.02rem)] text-[#a8beb8] font-light leading-[1.58]">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 sm:mt-10">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 font-mono-label text-[10.5px] sm:text-[11px] font-semibold text-[#14f884] group-hover:gap-3.5 transition-all"
                  >
                    VIEW CASE STUDY
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
