"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassFlowerCanvas from "@/components/canvas/GlassFlowerCanvas";
import { SERVICES_QUADRANTS } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesFlowerSection() {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<number>(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mobileActive, setMobileActive] = useState(0);
  const [mobileVisible, setMobileVisible] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Sequence:
    // 0.00 -> 0.20: Flower blooms into full glory in center (all boxes hidden)
    // 0.20 -> 0.36: Box 01 appears & stays
    // 0.36 -> 0.52: Box 02 appears & stays
    // 0.52 -> 0.68: Box 03 appears & stays
    // 0.68 -> 0.84: Box 04 appears & stays
    // 0.84 -> 1.00: All 4 boxes fully visible (opacity 1.0, none faded!)
    const thresholds = [
      { start: 0.20, end: 0.36 },
      { start: 0.36, end: 0.52 },
      { start: 0.52, end: 0.68 },
      { start: 0.68, end: 0.84 },
    ];

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;

          // Mobile view: flower appears first, then cards step through
          if (p < 0.20) {
            setMobileVisible(false);
          } else {
            setMobileVisible(true);
            if (p < 0.38) setMobileActive(0);
            else if (p < 0.56) setMobileActive(1);
            else if (p < 0.74) setMobileActive(2);
            else setMobileActive(3);
          }

          // Desktop: Flower blooms first, then boxes appear sequentially.
          // Once a box is revealed, it STAYS at opacity 1.0 and NEVER fades out!
          cardRefs.current.forEach((el, idx) => {
            if (!el) return;
            const { start, end } = thresholds[idx];
            let eased = 0;
            if (p >= end) {
              eased = 1; // Locked fully visible!
            } else if (p > start) {
              const t = (p - start) / (end - start);
              eased = 1 - Math.pow(1 - t, 3);
            } else {
              eased = 0;
            }
            el.style.opacity = String(eased);
            el.style.transform = `translate3d(0, ${((1 - eased) * 16).toFixed(1)}px, 0)`;
            el.style.pointerEvents = eased > 0.4 ? "auto" : "none";
          });
        },
      });

      return () => st.kill();
    }, wrapper);

    return () => ctx.revert();
  }, []);

  const scrollToQuadrant = (idx: number) => {
    setMobileActive(idx);
    setMobileVisible(true);
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const progressTargets = [0.28, 0.45, 0.62, 0.88];
    const targetScroll =
      wrapper.offsetTop + progressTargets[idx] * (wrapper.offsetHeight - window.innerHeight);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: object) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 1.1 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  return (
    <section
      id="services"
      ref={wrapperRef}
      className="relative h-[340vh] md:h-[400vh] bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex flex-col justify-between">
        {/* Centered 3D Translucent Emerald Glass Gerbera Daisy */}
        <GlassFlowerCanvas progressRef={progressRef} />

        {/* Subtle radial edge vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 26%, rgba(0,0,0,0.48) 58%, rgba(0,0,0,0.88) 100%)",
          }}
        />

        {/* MOBILE VIEW (<768px): Docked glass card at bottom with flower blooming above */}
        <div className="relative z-10 w-full px-4 pb-6 md:hidden mt-auto">
          <div className="relative min-h-[160px]">
            {SERVICES_QUADRANTS.map((item, idx) => {
              const active = mobileVisible && mobileActive === idx;
              return (
                <div
                  key={item.num}
                  className={`absolute inset-x-0 bottom-0 rounded-2xl border border-white/15 bg-black/82 backdrop-blur-md p-4 transition-all duration-400 ease-out ${
                    active
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-4 pointer-events-none"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="inline-flex items-center gap-2 font-mono-label text-[10px] text-[#14f884]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#14f884] shadow-[0_0_8px_#14f884]" />
                      <span>
                        {item.num} — {item.label}
                      </span>
                    </div>
                    {/* Clickable pagination dots */}
                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 3].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => scrollToQuadrant(d)}
                          aria-label={`Show service 0${d + 1}`}
                          className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            mobileActive === d
                              ? "w-6 bg-[#14f884]"
                              : "w-2 bg-white/30 hover:bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="font-mono-label text-[9px] text-[#14f884] mb-0.5">
                    {item.tagline}
                  </p>
                  <h3 className="text-lg font-black tracking-[-0.02em] text-white uppercase leading-snug">
                    {item.title.replace("\n", " ")}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#b8c7c2] font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* DESKTOP VIEW (md+):
            Two clean horizontal rows (Top: 01 & 02, Bottom: 03 & 04)
            - Top row is placed at pt-24 sm:pt-28 (100px+ from top) so it is NEVER behind the navbar!
            - Bottom row is placed at pb-8 sm:pb-10 so it NEVER touches the bottom screen edge!
            - The flower blooms freely in the center clearing.
        */}
        <div className="hidden md:flex relative z-10 w-full max-w-[1360px] mx-auto px-8 lg:px-14 h-full flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-10 pointer-events-none">
          {/* Top Row: Box 01 (Strategy & Brand) & Box 02 (Organic & Performance) */}
          <div className="grid grid-cols-2 gap-x-[36%] lg:gap-x-[40%]">
            {/* Box 01: Top Left */}
            <div
              ref={(el) => {
                cardRefs.current[0] = el;
              }}
              onClick={() => scrollToQuadrant(0)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && scrollToQuadrant(0)}
              style={{ opacity: 0, transform: "translate3d(0, 16px, 0)" }}
              className="will-change-transform max-w-[360px] mr-auto text-left cursor-pointer group transition-transform duration-300 hover:scale-[1.02] focus:outline-none"
            >
              <div className="inline-flex items-center gap-2 font-mono-label text-[9.5px] sm:text-[10.5px] text-[#14f884] mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14f884] shadow-[0_0_8px_#14f884]" />
                <span>
                  {SERVICES_QUADRANTS[0].num} — {SERVICES_QUADRANTS[0].label}
                </span>
              </div>

              <p className="font-mono-label text-[9.5px] sm:text-[10px] text-[#14f884]/90 mb-0.5">
                {SERVICES_QUADRANTS[0].tagline}
              </p>

              <h3 className="text-[clamp(1.25rem,2.1vw,1.95rem)] font-black tracking-[-0.02em] text-white uppercase leading-[1.06] whitespace-pre-line group-hover:text-[#14f884] transition-colors">
                {SERVICES_QUADRANTS[0].title}
              </h3>

              <p className="mt-2 text-[clamp(0.78rem,0.98vw,0.88rem)] text-[#b8c7c2] font-light leading-[1.46]">
                {SERVICES_QUADRANTS[0].description}
              </p>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {SERVICES_QUADRANTS[0].capabilities.slice(0, 4).map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 font-mono-label text-[8px] sm:text-[8.5px] text-[#9dbcb0]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Box 02: Top Right */}
            <div
              ref={(el) => {
                cardRefs.current[1] = el;
              }}
              onClick={() => scrollToQuadrant(1)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && scrollToQuadrant(1)}
              style={{ opacity: 0, transform: "translate3d(0, 16px, 0)" }}
              className="will-change-transform max-w-[360px] ml-auto text-right cursor-pointer group transition-transform duration-300 hover:scale-[1.02] focus:outline-none"
            >
              <div className="inline-flex items-center gap-2 font-mono-label text-[9.5px] sm:text-[10.5px] text-[#14f884] mb-1.5 flex-row-reverse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14f884] shadow-[0_0_8px_#14f884]" />
                <span>
                  {SERVICES_QUADRANTS[1].num} — {SERVICES_QUADRANTS[1].label}
                </span>
              </div>

              <p className="font-mono-label text-[9.5px] sm:text-[10px] text-[#14f884]/90 mb-0.5">
                {SERVICES_QUADRANTS[1].tagline}
              </p>

              <h3 className="text-[clamp(1.25rem,2.1vw,1.95rem)] font-black tracking-[-0.02em] text-white uppercase leading-[1.06] whitespace-pre-line group-hover:text-[#14f884] transition-colors">
                {SERVICES_QUADRANTS[1].title}
              </h3>

              <p className="mt-2 text-[clamp(0.78rem,0.98vw,0.88rem)] text-[#b8c7c2] font-light leading-[1.46]">
                {SERVICES_QUADRANTS[1].description}
              </p>

              <div className="mt-2.5 flex flex-wrap gap-1.5 justify-end">
                {SERVICES_QUADRANTS[1].capabilities.slice(0, 4).map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 font-mono-label text-[8px] sm:text-[8.5px] text-[#9dbcb0]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: Box 03 (Creative Production) & Box 04 (Digital & Technology) */}
          <div className="grid grid-cols-2 gap-x-[36%] lg:gap-x-[40%]">
            {/* Box 03: Bottom Left */}
            <div
              ref={(el) => {
                cardRefs.current[2] = el;
              }}
              onClick={() => scrollToQuadrant(2)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && scrollToQuadrant(2)}
              style={{ opacity: 0, transform: "translate3d(0, 16px, 0)" }}
              className="will-change-transform max-w-[360px] mr-auto text-left cursor-pointer group transition-transform duration-300 hover:scale-[1.02] focus:outline-none"
            >
              <div className="inline-flex items-center gap-2 font-mono-label text-[9.5px] sm:text-[10.5px] text-[#14f884] mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14f884] shadow-[0_0_8px_#14f884]" />
                <span>
                  {SERVICES_QUADRANTS[2].num} — {SERVICES_QUADRANTS[2].label}
                </span>
              </div>

              <p className="font-mono-label text-[9.5px] sm:text-[10px] text-[#14f884]/90 mb-0.5">
                {SERVICES_QUADRANTS[2].tagline}
              </p>

              <h3 className="text-[clamp(1.25rem,2.1vw,1.95rem)] font-black tracking-[-0.02em] text-white uppercase leading-[1.06] whitespace-pre-line group-hover:text-[#14f884] transition-colors">
                {SERVICES_QUADRANTS[2].title}
              </h3>

              <p className="mt-2 text-[clamp(0.78rem,0.98vw,0.88rem)] text-[#b8c7c2] font-light leading-[1.46]">
                {SERVICES_QUADRANTS[2].description}
              </p>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {SERVICES_QUADRANTS[2].capabilities.slice(0, 4).map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 font-mono-label text-[8px] sm:text-[8.5px] text-[#9dbcb0]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Box 04: Bottom Right */}
            <div
              ref={(el) => {
                cardRefs.current[3] = el;
              }}
              onClick={() => scrollToQuadrant(3)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && scrollToQuadrant(3)}
              style={{ opacity: 0, transform: "translate3d(0, 16px, 0)" }}
              className="will-change-transform max-w-[360px] ml-auto text-right cursor-pointer group transition-transform duration-300 hover:scale-[1.02] focus:outline-none"
            >
              <div className="inline-flex items-center gap-2 font-mono-label text-[9.5px] sm:text-[10.5px] text-[#14f884] mb-1.5 flex-row-reverse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14f884] shadow-[0_0_8px_#14f884]" />
                <span>
                  {SERVICES_QUADRANTS[3].num} — {SERVICES_QUADRANTS[3].label}
                </span>
              </div>

              <p className="font-mono-label text-[9.5px] sm:text-[10px] text-[#14f884]/90 mb-0.5">
                {SERVICES_QUADRANTS[3].tagline}
              </p>

              <h3 className="text-[clamp(1.25rem,2.1vw,1.95rem)] font-black tracking-[-0.02em] text-white uppercase leading-[1.06] whitespace-pre-line group-hover:text-[#14f884] transition-colors">
                {SERVICES_QUADRANTS[3].title}
              </h3>

              <p className="mt-2 text-[clamp(0.78rem,0.98vw,0.88rem)] text-[#b8c7c2] font-light leading-[1.46]">
                {SERVICES_QUADRANTS[3].description}
              </p>

              <div className="mt-2.5 flex flex-wrap gap-1.5 justify-end">
                {SERVICES_QUADRANTS[3].capabilities.slice(0, 4).map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 font-mono-label text-[8px] sm:text-[8.5px] text-[#9dbcb0]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
