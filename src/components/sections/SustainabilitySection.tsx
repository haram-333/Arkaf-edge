"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { SUSTAINABILITY_CONTENT } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export default function SustainabilitySection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fixedStageRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const fogVideoRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subtextRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const fixedStage = fixedStageRef.current;
    const bgImage = bgImageRef.current;
    const fogVideo = fogVideoRef.current;
    const eyebrow = eyebrowRef.current;
    const headline = headlineRef.current;
    const subtext = subtextRef.current;
    const rightPanel = rightPanelRef.current;

    if (!container || !fixedStage || !bgImage) return;

    // Tracks #services top so fixedStage slides out seamlessly with zero gap
    const updateSlide = () => {
      const nextSection = document.getElementById("services");
      if (!nextSection || !fixedStage) return;
      const rect = nextSection.getBoundingClientRect();
      const h = window.innerHeight;

      if (rect.top < h) {
        const offset = rect.top - h;
        fixedStage.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
        fixedStage.style.visibility = rect.top <= 0 ? "hidden" : "visible";
      } else {
        fixedStage.style.transform = "translate3d(0, 0, 0)";
      }
    };

    gsap.ticker.add(updateSlide);

    const ctx = gsap.context(() => {
      const headlineLines = headline ? headline.querySelectorAll(".reveal-line") : [];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.45,
          onUpdate: (self) => {
            const p = self.progress;
            const nextSection = document.getElementById("services");
            const rect = nextSection ? nextSection.getBoundingClientRect() : null;
            const h = window.innerHeight;

            if (p <= 0.01 || (rect && rect.top <= 0)) {
              fixedStage.style.visibility = "hidden";
              fixedStage.style.pointerEvents = "none";
            } else {
              fixedStage.style.visibility = "visible";
              fixedStage.style.pointerEvents =
                p >= 0.14 && (!rect || rect.top >= h) ? "auto" : "none";
            }
          },
        },
      });

      // Stage fades cleanly in right as hero dissolves
      tl.fromTo(
        fixedStage,
        { opacity: 0 },
        { opacity: 1, ease: "power2.out", duration: 0.12 },
        0
      );

      // Terrarium zoom out & sharpen
      tl.fromTo(
        bgImage,
        { scale: 1.28, filter: "blur(10px)" },
        { scale: 1.0, filter: "blur(0px)", ease: "power2.out", duration: 0.2 },
        0.04
      );

      // Drifting organic mist roll-in
      if (fogVideo) {
        tl.fromTo(
          fogVideo,
          { opacity: 0, y: 60, scale: 1.12, filter: "blur(10px)" },
          {
            opacity: 0.72,
            y: 0,
            scale: 1.0,
            filter: "blur(0px)",
            ease: "power2.out",
            duration: 0.18,
          },
          0.1
        );
      }

      // Sequential doc text reveal completes cleanly by p = 0.34
      if (eyebrow) {
        tl.fromTo(
          eyebrow,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, ease: "power3.out", duration: 0.07 },
          0.14
        );
      }

      if (headlineLines.length > 0) {
        tl.fromTo(
          headlineLines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.02,
            ease: "power3.out",
            duration: 0.09,
          },
          0.17
        );
      }

      if (subtext) {
        tl.fromTo(
          subtext,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.08 },
          0.22
        );
      }

      if (rightPanel) {
        tl.fromTo(
          rightPanel,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.09 },
          0.25
        );
      }

      tl.to({}, { duration: 0.66 }, 0.34);
    }, container);

    return () => {
      gsap.ticker.remove(updateSlide);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="sustainability"
      ref={containerRef}
      className="relative z-20 w-full h-[185vh] bg-transparent"
    >
      {/* Anchor positioned where scroll reveal is complete */}
      <div id="who-we-are" className="absolute top-[52vh] inset-x-0 pointer-events-none" />

      <div
        ref={fixedStageRef}
        style={{ opacity: 0, visibility: "hidden", transform: "translate3d(0, 0, 0)" }}
        className="fixed inset-0 top-0 left-0 w-full h-full z-20 pointer-events-none overflow-hidden bg-[#031513] text-white will-change-[transform,opacity,visibility]"
      >
        {/* Terrarium Background */}
        <div
          ref={bgImageRef}
          className="absolute inset-0 will-change-transform origin-center"
        >
          <Image
            src="/images/sustainability-landscape.jpg"
            alt="Nature landscape and organic moss ecosystem"
            fill
            priority
            quality={95}
            className="object-cover object-[50%_75%] sm:object-bottom"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(3,21,19,0.92) 0%, rgba(3,21,19,0.72) 48%, rgba(3,21,19,0.28) 78%, rgba(2,14,12,0.78) 100%)",
            }}
          />
        </div>

        {/* Creeping Atmosphere Mist */}
        <div
          ref={fogVideoRef}
          style={{ opacity: 0 }}
          className="hidden sm:block absolute inset-0 z-[5] pointer-events-none mix-blend-screen will-change-transform overflow-hidden"
        >
          <video
            src="/videos/clouds-fog.webm"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        {/* Bottom Vignette */}
        <div
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(3,21,19,0) 0%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        {/* Editorial Content Matching Exact Website Written Content (1).docx Sequence */}
        <div
          data-lenis-prevent
          className="relative z-20 w-full max-w-[1340px] mx-auto px-5 sm:px-10 lg:px-12 h-full overflow-y-auto no-scrollbar pt-20 sm:pt-24 pb-8 pointer-events-auto flex flex-col justify-start lg:justify-center"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* LEFT COLUMN: [P11–P18] Headline, Purpose & Earliest Ambition */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5">
              <div ref={eyebrowRef}>
                <span className="inline-block rounded-[5px] bg-[#a9f5cf] text-[#051a12] font-mono-label text-[9px] sm:text-[10px] font-semibold px-3 py-1 shadow-[0_0_20px_rgba(169,245,207,0.3)]">
                  {SUSTAINABILITY_CONTENT.badge}
                </span>
              </div>

              <h2
                ref={headlineRef}
                className="text-[clamp(1.4rem,2.75vw,2.65rem)] font-medium tracking-[-0.035em] leading-[1.08]"
              >
                <span className="block overflow-hidden py-0.5">
                  <span className="reveal-line block text-white will-change-transform">
                    {SUSTAINABILITY_CONTENT.headlineWhite}
                  </span>
                </span>
                <span className="block overflow-hidden py-0.5 mt-0.5">
                  <span className="reveal-line block text-[#14f884] neon-text-glow will-change-transform">
                    {SUSTAINABILITY_CONTENT.headlineGreen}
                  </span>
                </span>
              </h2>

              <div ref={subtextRef} className="space-y-3 sm:space-y-4 max-w-xl">
                <p className="text-sm sm:text-[15.5px] text-[#e2efe9] font-light leading-relaxed">
                  {SUSTAINABILITY_CONTENT.lead}{" "}
                  <span className="text-white font-medium">
                    {SUSTAINABILITY_CONTENT.leadHighlight}
                  </span>
                </p>

                <div className="pl-3.5 sm:pl-4 border-l border-[#14f884]/55 space-y-1.5">
                  <p className="text-xs sm:text-sm text-[#c7d6d1] font-light leading-relaxed">
                    {SUSTAINABILITY_CONTENT.storyLead}
                  </p>
                  <p className="text-sm sm:text-[15px] font-semibold text-[#c6f19d] leading-snug">
                    {SUSTAINABILITY_CONTENT.storyQuestion}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: [P19–P24] Affection, 9 Focus Sectors, Closing Mission & Discover CTA */}
            <div
              ref={rightPanelRef}
              className="lg:col-span-6 rounded-2xl sm:rounded-[24px] liquid-glass p-5 sm:p-7 space-y-4 sm:space-y-5"
            >
              <p className="text-xs sm:text-sm text-[#d4ede4] font-light leading-relaxed">
                {SUSTAINABILITY_CONTENT.affection}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {SUSTAINABILITY_CONTENT.industries.map((ind) => (
                  <span
                    key={ind}
                    className="px-2.5 sm:px-3 py-1 rounded-full liquid-glass-pill font-mono-label text-[8.5px] sm:text-[9.5px] text-[#e2efe9] hover:text-[#14f884] transition-colors"
                  >
                    {ind}
                  </span>
                ))}
              </div>

              <p className="pt-3 border-t border-white/15 text-xs sm:text-sm text-[#d4e4df] font-light leading-relaxed">
                {SUSTAINABILITY_CONTENT.closing}
              </p>

              <div className="pt-1">
                <a
                  href="#discover-us"
                  className="inline-flex items-center gap-2 rounded-full bg-[#14f884] text-[#050b09] px-5 sm:px-6 py-2.5 sm:py-3 font-mono-label text-[10px] sm:text-[11px] font-semibold shadow-[0_0_20px_rgba(20,248,132,0.38)] hover:bg-[#c6f19d] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>{SUSTAINABILITY_CONTENT.cta}</span>
                  <span className="text-[9px] opacity-75 font-medium hidden sm:inline">
                    ({SUSTAINABILITY_CONTENT.ctaKicker})
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
