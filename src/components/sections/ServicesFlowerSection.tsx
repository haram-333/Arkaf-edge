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
      { start: 0.10, end: 0.26 },
      { start: 0.28, end: 0.44 },
      { start: 0.46, end: 0.62 },
      { start: 0.64, end: 0.80 },
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
          if (p < 0.28) setMobileActive(0);
          else if (p < 0.52) setMobileActive(1);
          else if (p < 0.76) setMobileActive(2);
          else setMobileActive(3);

          // Desktop staggered 2x2 quadrants
          cardRefs.current.forEach((el, idx) => {
            if (!el) return;
            const { start, end } = thresholds[idx];
            const t = Math.max(0, Math.min(1, (p - start) / (end - start)));
            const eased = 1 - Math.pow(1 - t, 3);
            el.style.opacity = String(eased);
            el.style.transform = `translate3d(0, ${((1 - eased) * 22).toFixed(1)}px, 0)`;
          });
        },
      });

      return () => st.kill();
    }, wrapper);

    return () => ctx.revert();
  }, []);

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

        {/* MOBILE VIEW (<768px): Single clean docked glass card at bottom so flower blooms unobstructed above */}
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
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2, 3].map((d) => (
                        <span
                          key={d}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            mobileActive === d
                              ? "w-5 bg-[#14f884]"
                              : "w-1.5 bg-white/25"
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
                  style={{ opacity: 0, transform: "translate3d(0, 22px, 0)" }}
                  className={`will-change-transform max-w-[360px] ${
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

                  <h3 className="text-[clamp(1.45rem,2.55vw,2.3rem)] font-black tracking-[-0.02em] text-white uppercase leading-[1.06] whitespace-pre-line">
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
