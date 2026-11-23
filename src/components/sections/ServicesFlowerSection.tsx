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

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const thresholds = [
      { start: 0.00, end: 0.24 },
      { start: 0.25, end: 0.46 },
      { start: 0.48, end: 0.68 },
      { start: 0.70, end: 0.88 },
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

          // Mobile active step 0..3
          if (p < 0.25) setMobileActive(0);
          else if (p < 0.50) setMobileActive(1);
          else if (p < 0.75) setMobileActive(2);
          else setMobileActive(3);

          // Desktop staggered 2x2 quadrants - Quadrant 0 stays comfortably visible from top
          cardRefs.current.forEach((el, idx) => {
            if (!el) return;
            const { start, end } = thresholds[idx];
            let eased = 0;
            if (idx === 0) {
              eased = p < 0.25 ? 1 : Math.max(0.2, 1 - (p - 0.25) / 0.22);
            } else {
              const t = Math.max(0, Math.min(1, (p - start) / (end - start)));
              eased = 1 - Math.pow(1 - t, 3);
            }
            el.style.opacity = String(eased);
            el.style.transform = `translate3d(0, ${((1 - eased) * 22).toFixed(1)}px, 0)`;
          });
        },
      });

      return () => st.kill();
    }, wrapper);

    return () => ctx.revert();
  }, []);

  const scrollToQuadrant = (idx: number) => {
    setMobileActive(idx);
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const progressTargets = [0.05, 0.35, 0.58, 0.82];
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
      className="relative h-[320vh] md:h-[380vh] bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-end md:items-center">
        {/* Centered 3D Translucent Emerald Glass Gerbera Daisy */}
        <GlassFlowerCanvas progressRef={progressRef} />

        {/* Subtle radial edge vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, transparent 22%, rgba(0,0,0,0.42) 56%, rgba(0,0,0,0.82) 100%)",
          }}
        />

        {/* MOBILE VIEW (<768px): Single clean docked glass card at bottom with clickable dots */}
        <div className="relative z-10 w-full px-4 pb-6 md:hidden">
          <div className="relative min-h-[168px]">
            {SERVICES_QUADRANTS.map((item, idx) => {
              const active = mobileActive === idx;
              return (
                <div
                  key={item.num}
                  className={`absolute inset-x-0 bottom-0 rounded-2xl border border-white/15 bg-black/78 backdrop-blur-md p-5 transition-all duration-400 ease-out ${
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
                  <h3 className="text-xl font-black tracking-[-0.02em] text-white uppercase leading-[1.08]">
                    {item.title.replace("\n", " ")}
                  </h3>
                  <p className="mt-2 text-xs text-[#b8c7c2] font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* DESKTOP VIEW (md+): Exact 2x2 Quadrant Grid matching Screenshot 3 */}
        <div className="hidden md:block relative z-10 w-full max-w-[1380px] mx-auto px-10 lg:px-16 py-20">
          <div className="grid grid-cols-2 gap-y-24 lg:gap-y-28 gap-x-[36%] lg:gap-x-[40%]">
            {SERVICES_QUADRANTS.map((item, idx) => {
              const isRight = item.align === "right";
              return (
                <div
                  key={item.num}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onClick={() => scrollToQuadrant(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && scrollToQuadrant(idx)}
                  style={{ opacity: idx === 0 ? 1 : 0, transform: "translate3d(0, 0, 0)" }}
                  className={`will-change-transform max-w-[360px] cursor-pointer group transition-transform duration-300 hover:scale-[1.02] ${
                    isRight ? "ml-auto text-right" : "mr-auto text-left"
                  }`}
                >
                  <div
                    className={`inline-flex items-center gap-2 font-mono-label text-[10px] sm:text-[11px] text-[#14f884] mb-2.5 ${
                      isRight ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#14f884] shadow-[0_0_8px_#14f884]" />
                    <span>
                      {item.num} — {item.label}
                    </span>
                  </div>

                  <h3 className="text-[clamp(1.45rem,2.55vw,2.3rem)] font-black tracking-[-0.02em] text-white uppercase leading-[1.06] whitespace-pre-line group-hover:text-[#14f884] transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-[clamp(0.85rem,1.25vw,1.1rem)] text-[#b8c7c2] font-light leading-[1.52]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
