"use client";

import React, { useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, Check, ChevronRight, Copy } from "lucide-react";

const COLUMN_PRIMARY = [
  { label: "Home", href: "#hero" },
  { label: "Sustainability", href: "#sustainability" },
  { label: "Who We Are", href: "#who-we-are" },
  { label: "What We Do", href: "#services" },
];

const COLUMN_METHOD = [
  { label: "Philosophy", href: "#phenomenon" },
  { label: "The ARKAF Method", href: "#approach" },
  { label: "Client Approach", href: "#client-approach" },
];

const COLUMN_DISCIPLINES = [
  { label: "Strategy & Brand", href: "#services" },
  { label: "Organic Growth", href: "#services" },
  { label: "Performance", href: "#services" },
  { label: "Creative Production", href: "#services" },
  { label: "Digital & Technology", href: "#services" },
];

const COLUMN_PERSPECTIVES = [
  { label: "Founders & Story", href: "#impact" },
  { label: "Featured Work", href: "#work" },
  { label: "Client Ecosystem", href: "#ecosystem" },
  { label: "Edge Notes", href: "#insights" },
];

function scrollToTarget(selector: string) {
  const win = window as unknown as {
    __lenis?: { scrollTo: (t: string | number, opts?: { duration?: number }) => void };
  };
  if (win.__lenis) {
    win.__lenis.scrollTo(selector, { duration: 1.25 });
    return;
  }
  const el = document.querySelector(selector);
  el?.scrollIntoView({ behavior: "smooth" });
}

function scrollToTop() {
  const win = window as unknown as {
    __lenis?: { scrollTo: (t: string | number, opts?: { duration?: number }) => void };
  };
  if (win.__lenis) {
    win.__lenis.scrollTo(0, { duration: 1.45 });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function FooterSection() {
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!footerRef.current || e.pointerType === "touch") return;
    const rect = footerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    footerRef.current.style.setProperty("--fx", `${xPct.toFixed(2)}%`);
    footerRef.current.style.setProperty("--fy", `${yPct.toFixed(2)}%`);

    const nx = (xPct / 100 - 0.5) * 2;
    const ny = (yPct / 100 - 0.5) * 2;
    if (videoWrapRef.current) {
      videoWrapRef.current.style.transform = `translate3d(${(-nx * 10).toFixed(1)}px, ${(-ny * 8).toFixed(1)}px, 0) scale(1.03)`;
    }
    if (wordmarkRef.current) {
      wordmarkRef.current.style.setProperty("--wx", `${xPct.toFixed(2)}%`);
      wordmarkRef.current.style.setProperty("--wy", `${yPct.toFixed(2)}%`);
    }
  };

  const handlePointerLeave = () => {
    if (videoWrapRef.current) {
      videoWrapRef.current.style.transform = "translate3d(0px, 0px, 0) scale(1)";
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@arkafedge.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = "mailto:hello@arkafedge.com";
    }
  };

  return (
    <footer
      ref={footerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative overflow-hidden bg-[#041d1a] text-[#d5eebc] select-none"
      style={
        {
          "--fx": "50%",
          "--fy": "48%",
        } as React.CSSProperties
      }
    >
      {/* Nature Video Backdrop Layer (cropped into lush swaying moss & foliage) */}
      <div
        ref={videoWrapRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden transition-transform duration-700 ease-out will-change-transform"
      >
        <video
          src="/videos/loop2.webm"
          poster="/images/sustainability-landscape.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-x-0 bottom-0 w-full h-[200%] max-w-none object-cover object-[50%_92%] brightness-[0.58] contrast-[1.16] saturate-[1.32]"
        />
        <video
          src="/videos/clouds-fog.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="hidden sm:block absolute inset-0 w-full h-full object-cover opacity-[0.14] mix-blend-screen [filter:hue-rotate(110deg)_saturate(1.6)]"
        />
      </div>

      {/* Atmospheric Forest Vignettes & Top Transition From Contact Section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#041d1a_0%,rgba(4,29,26,0.94)_18%,rgba(5,26,18,0.84)_36%,rgba(8,31,20,0.48)_58%,rgba(6,22,15,0.72)_78%,rgba(3,14,10,0.96)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(680px circle at var(--fx) var(--fy), rgba(198, 241, 157, 0.14), rgba(20, 248, 132, 0.05) 38%, transparent 72%)",
        }}
      />

      {/* Foreground Editorial Architecture */}
      <div className="relative z-10 flex flex-col justify-between pt-20 sm:pt-28 lg:pt-32 pb-8 sm:pb-10">
        {/* Top Centered Hook & Tactile CTA Pill */}
        <div className="max-w-[780px] mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-[clamp(1.85rem,4.1vw,3.1rem)] font-medium tracking-[-0.04em] leading-[1.02] text-[#c6f19d]">
            Growth Should Leave
            <br />
            Something Better Behind.
          </h2>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#c6f19d]/85 max-w-[460px] mx-auto leading-[1.45] tracking-[-0.015em]">
            The next generation of great companies won&apos;t be measured only by how
            much they grow — but by what grows because they existed.
          </p>

          <div className="mt-8 sm:mt-9 flex justify-center">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("#contact");
              }}
              className="group inline-flex items-center gap-4 rounded-[8px] bg-[#c6f19d] text-[#071c12] pl-5 pr-2 py-2 font-mono-label text-[11px] font-semibold tracking-[0.14em] shadow-[0_14px_40px_rgba(0,0,0,0.45)] hover:bg-[#d8f8b8] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>LET&apos;S TALK</span>
              <span className="w-7 h-7 rounded-[5px] bg-[#071c12] text-[#c6f19d] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </span>
            </a>
          </div>
        </div>

        {/* Monumental Edge-to-Edge Wordmark */}
        <div
          ref={wordmarkRef}
          className="group/brand relative w-full overflow-x-clip py-3 sm:py-5 mt-12 sm:mt-16 lg:mt-20 mb-6 sm:mb-10 px-4 sm:px-6 lg:px-10"
        >
          <div
            onClick={scrollToTop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                scrollToTop();
              }
            }}
            aria-label="Scroll back to top"
            className="cursor-pointer w-full text-center transition-transform duration-700 ease-out group-hover/brand:scale-[1.008]"
          >
            <span className="inline-block text-[clamp(2.8rem,15.2vw,14.2rem)] font-medium leading-[1.12] pb-[0.08em] tracking-[-0.055em] lowercase whitespace-nowrap text-[#c6f19d] drop-shadow-[0_12px_36px_rgba(2,14,10,0.55)] transition-colors duration-500 group-hover/brand:text-[#d6f9b0]">
              arkafedge
              <span className="text-[#14f884] transition-transform duration-500 inline-block group-hover/brand:scale-110">
                .
              </span>
            </span>
          </div>
        </div>

        {/* Full-Width Hairline Divider & Responsive Navigation Matrix */}
        <div className="max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12">
          <div className="border-t border-[#c6f19d]/25 pt-8 sm:pt-10 pb-12 sm:pb-16 grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-8">
            {/* Left Statement & Interactive Direct Email */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-6">
              <div>
                <p className="text-xl sm:text-2xl font-medium tracking-[-0.03em] leading-[1.18] text-[#d5eebc]">
                  You bring the ambition.
                  <br />
                  We&apos;ll find the edge.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-2 rounded-full border border-[#c6f19d]/25 bg-[#041610]/70 backdrop-blur-md px-3.5 py-2 font-mono-label text-[10px] tracking-[0.12em] text-[#d5eebc] hover:border-[#c6f19d]/60 hover:bg-[#c6f19d]/15 transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#14f884]" />
                        <span className="text-[#14f884]">COPIED EMAIL</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#c6f19d]/75" />
                        <span>HELLO@ARKAFEDGE.COM</span>
                      </>
                    )}
                  </button>
                  <a
                    href="mailto:hello@arkafedge.com"
                    aria-label="Open mail client for hello@arkafedge.com"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#c6f19d]/25 bg-[#041610]/70 text-[#d5eebc] hover:border-[#14f884] hover:text-[#14f884] transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Multi-Column Links Matrix (stacked like editorial index) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-9">
              {/* Col 1: ARKAF EDGE + METHOD stacked */}
              <div className="flex flex-col gap-7">
                <div>
                  <div className="font-mono-label text-[10px] tracking-[0.14em] text-[#c6f19d]/45 mb-2.5">
                    ARKAF EDGE
                  </div>
                  <ul className="space-y-1.5">
                    {COLUMN_PRIMARY.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToTarget(item.href);
                          }}
                          className="group/link inline-flex items-center gap-1.5 font-mono-label text-[11px] tracking-[0.1em] text-[#d5eebc]/90 hover:text-[#14f884] transition-colors"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#14f884] opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          <span>{item.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="font-mono-label text-[10px] tracking-[0.14em] text-[#c6f19d]/45 mb-2.5">
                    METHOD
                  </div>
                  <ul className="space-y-1.5">
                    {COLUMN_METHOD.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToTarget(item.href);
                          }}
                          className="group/link inline-flex items-center gap-1.5 font-mono-label text-[11px] tracking-[0.1em] text-[#d5eebc]/90 hover:text-[#14f884] transition-colors"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#14f884] opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          <span>{item.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Col 2: DISCIPLINES */}
              <div>
                <div className="font-mono-label text-[10px] tracking-[0.14em] text-[#c6f19d]/45 mb-2.5">
                  DISCIPLINES
                </div>
                <ul className="space-y-1.5">
                  {COLUMN_DISCIPLINES.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToTarget(item.href);
                        }}
                        className="group/link inline-flex items-center gap-1.5 font-mono-label text-[11px] tracking-[0.1em] text-[#d5eebc]/90 hover:text-[#14f884] transition-colors"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#14f884] opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        <span>{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: WORK & NOTES */}
              <div>
                <div className="font-mono-label text-[10px] tracking-[0.14em] text-[#c6f19d]/45 mb-2.5">
                  WORK &amp; NOTES
                </div>
                <ul className="space-y-1.5">
                  {COLUMN_PERSPECTIVES.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToTarget(item.href);
                        }}
                        className="group/link inline-flex items-center gap-1.5 font-mono-label text-[11px] tracking-[0.1em] text-[#d5eebc]/90 hover:text-[#14f884] transition-colors"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#14f884] opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        <span>{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 4: CONNECT */}
              <div>
                <div className="font-mono-label text-[10px] tracking-[0.14em] text-[#c6f19d]/45 mb-2.5">
                  CONNECT
                </div>
                <ul className="space-y-1.5">
                  <li>
                    <a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToTarget("#contact");
                      }}
                      className="group/link inline-flex items-center gap-1.5 font-mono-label text-[11px] tracking-[0.1em] text-[#d5eebc]/90 hover:text-[#14f884] transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#14f884] opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      <span>Start a Project</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:hello@arkafedge.com?subject=Curious%20Explorer%20—%20Careers"
                      className="group/link inline-flex items-center gap-1.5 font-mono-label text-[11px] tracking-[0.1em] text-[#d5eebc]/90 hover:text-[#14f884] transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#14f884] opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      <span>Careers</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:hello@arkafedge.com"
                      className="group/link inline-flex items-center gap-1.5 font-mono-label text-[11px] tracking-[0.1em] text-[#d5eebc]/90 hover:text-[#14f884] transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#14f884] opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      <span>Say Hello</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Copyright, Doc Easter Egg & Interactive Back-to-Top */}
          <div className="pt-4 border-t border-[#c6f19d]/12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#d5eebc]/80">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-[4px] bg-[#c6f19d] text-[#041d1a] font-semibold text-[11px] flex items-center justify-center">
                A
              </span>
              <span className="tracking-[-0.02em]">
                © {new Date().getFullYear()} ARKAF Edge
              </span>
            </div>

            <a
              href="mailto:hello@arkafedge.com?subject=Curious%20Explorer%20—%20Saying%20Hello"
              className="font-mono-label text-[10px] tracking-[0.1em] text-[#c6f19d]/75 hover:text-[#14f884] transition-colors text-center"
            >
              Still scrolling? We like curious people. →{" "}
              <span className="text-[#c6f19d] underline decoration-[#14f884]/50 underline-offset-4">
                Careers / Say Hello
              </span>
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1.5 tracking-[-0.02em] text-[#d5eebc]/85 hover:text-[#c6f19d] transition-colors cursor-pointer py-1"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 text-[#c6f19d]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
