"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, X, CheckCircle2 } from "lucide-react";
import { FEATURED_WORK, FEATURED_WORK_CONTENT } from "@/data/content";

export default function FeaturedWorkSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [activeProject, setActiveProject] = useState<(typeof FEATURED_WORK)[number] | null>(
    null
  );

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

  // Close case study modal on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleStartSimilarProject = () => {
    setActiveProject(null);
    const contactEl = document.querySelector("#contact") as HTMLElement | null;
    if (contactEl) {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement, opts?: object) => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo(contactEl, { duration: 1.2 });
      } else {
        contactEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-[#041d1a] text-white py-16 sm:py-28"
    >
      <div className="max-w-[1040px] mx-auto px-5 sm:px-10">
        {/* Exact Split Header from revised docx */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-16">
          <div className="shrink-0 max-w-xl">
            <span className="inline-block rounded-full border border-[#14f884]/25 bg-[#072924] font-mono-label text-[9.5px] sm:text-[10px] text-[#14f884] px-3.5 sm:px-4 py-1.5 mb-4 sm:mb-5">
              {FEATURED_WORK_CONTENT.badge}
            </span>
            <h2 className="text-[clamp(2.35rem,5.3vw,4.85rem)] font-black tracking-[-0.03em] leading-[0.95] uppercase">
              {FEATURED_WORK_CONTENT.headlineLines.map((line) => (
                <span key={line} className="block text-white sm:whitespace-nowrap">
                  {line}
                </span>
              ))}
              <span className="block text-[#14f884] neon-text-glow sm:whitespace-nowrap">
                {FEATURED_WORK_CONTENT.headlineAccent}
              </span>
            </h2>
          </div>

          <div className="max-w-[460px] space-y-2.5 lg:pb-1.5">
            <p className="text-[clamp(0.85rem,1.08vw,0.98rem)] text-[#d0ded9] font-light leading-[1.58]">
              {FEATURED_WORK_CONTENT.intro}
            </p>
            <p className="text-[clamp(0.8rem,0.98vw,0.9rem)] text-[#97b8ad] font-light leading-[1.55]">
              {FEATURED_WORK_CONTENT.clientsHighlight}
            </p>
          </div>
        </div>

        {/* 3 Full-Width Split Horizontal Case Study Cards */}
        <div className="space-y-6 sm:space-y-9">
          {FEATURED_WORK.map((project, idx) => (
            <article
              key={project.title}
              onClick={() => setActiveProject(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setActiveProject(project)}
              style={{ transitionDelay: visible ? `${idx * 120}ms` : "0ms" }}
              className={`group cursor-pointer rounded-[18px] sm:rounded-[20px] border border-white/30 bg-[#041e1b] overflow-hidden grid grid-cols-1 lg:grid-cols-12 hover:border-[#14f884]/65 transition-all duration-700 ease-out focus:outline-none ${
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

              {/* Right 44% Minimal Deep Teal Panel */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-[#041e1b]">
                <div>
                  <p className="font-mono-label text-[9.5px] sm:text-[10px] text-[#2fb880] mb-2.5 sm:mb-3">
                    {project.tags}
                  </p>
                  <h3 className="text-[clamp(1.35rem,2.35vw,2.15rem)] font-black tracking-[-0.02em] uppercase text-white leading-[1.08] group-hover:text-[#14f884] transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-3 sm:mt-4 text-[clamp(0.85rem,1.18vw,1.02rem)] text-[#a8beb8] font-light leading-[1.58]">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 sm:mt-10">
                  <span className="inline-flex items-center gap-2 font-mono-label text-[10.5px] sm:text-[11px] font-semibold text-[#14f884] group-hover:gap-3.5 transition-all">
                    VIEW CASE STUDY
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Closing Client Callout Strip (Exact doc copy, clean modern architectural frame) */}
        <div className="mt-10 sm:mt-14 rounded-[18px] sm:rounded-[20px] liquid-glass p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <p className="max-w-2xl text-sm sm:text-base text-[#d4ede4] font-light leading-relaxed">
            {FEATURED_WORK_CONTENT.closing}
          </p>
          <button
            type="button"
            onClick={handleStartSimilarProject}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-[#14f884] text-[#050b09] font-mono-label text-[10px] sm:text-[11px] font-bold px-6 py-3.5 neon-box-glow hover:scale-[1.03] active:scale-[0.98] transition-transform cursor-pointer"
          >
            PARTNER WITH US
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Case Study Modal with Complete Architectural Overview & Metrics */}
      {activeProject && (
        <div
          className="fixed inset-0 z-[95] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveProject(null)}
        >
          <div
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full max-h-[88vh] overflow-y-auto rounded-[20px] border border-[#14f884]/40 bg-[#041d1a] p-6 sm:p-9 shadow-2xl relative"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveProject(null)}
              aria-label="Close case study"
              className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/75 hover:text-[#14f884] hover:border-[#14f884] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Tags */}
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-full bg-[#14f884]/15 border border-[#14f884]/30 px-3 py-1 font-mono-label text-[9.5px] font-bold text-[#14f884]">
                {activeProject.year}
              </span>
              <span className="font-mono-label text-[9.5px] text-[#2fb880]">
                {activeProject.tags}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight pr-8">
              {activeProject.title}
            </h3>

            {/* Image Preview */}
            <div className="mt-5 rounded-[14px] overflow-hidden border border-white/10 h-52 sm:h-64">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overview */}
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="font-mono-label text-[10px] text-[#14f884] uppercase mb-1">
                  The Overview
                </h4>
                <p className="text-sm sm:text-base text-[#c7d6d1] font-light leading-relaxed">
                  {activeProject.overview}
                </p>
              </div>

              <div>
                <h4 className="font-mono-label text-[10px] text-[#14f884] uppercase mb-1">
                  The Strategic Challenge
                </h4>
                <p className="text-sm sm:text-base text-[#a8beb8] font-light leading-relaxed">
                  {activeProject.challenge}
                </p>
              </div>

              <div>
                <h4 className="font-mono-label text-[10px] text-[#14f884] uppercase mb-1">
                  The Creative &amp; Technical Solution
                </h4>
                <p className="text-sm sm:text-base text-[#a8beb8] font-light leading-relaxed">
                  {activeProject.solution}
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="mt-6 grid grid-cols-3 gap-3 pt-5 border-t border-white/12">
              {activeProject.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/10 bg-[#031513] p-3 text-center"
                >
                  <span className="block text-lg sm:text-xl font-black text-[#14f884] neon-text-glow leading-none">
                    {s.val}
                  </span>
                  <span className="mt-1 block font-mono-label text-[8px] sm:text-[9px] text-[#8db5a8]">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Modal Bottom CTA */}
            <div className="mt-7 pt-4 border-t border-white/12 flex items-center justify-between gap-4">
              <span className="font-mono-label text-[10px] text-[#8db5a8]">
                READY FOR SIMILAR MEASURABLE IMPACT?
              </span>
              <button
                type="button"
                onClick={handleStartSimilarProject}
                className="inline-flex items-center gap-2 rounded-full bg-[#0ffa7f] text-[#050b09] font-mono-label text-[10.5px] font-bold px-5 py-2.5 neon-box-glow hover:scale-[1.02] cursor-pointer transition-transform"
              >
                START A PROJECT
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
