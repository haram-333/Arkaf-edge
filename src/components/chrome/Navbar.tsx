"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, X, ArrowUpRight, Sparkles, Sun, Moon } from "lucide-react";

const NAV_LINKS = [
  { num: "01", label: "Home", href: "#hero" },
  { num: "02", label: "Who We Are", href: "#who-we-are" },
  { num: "03", label: "Services", href: "#services" },
  { num: "04", label: "The ARKAF Edge", href: "#phenomenon" },
  { num: "05", label: "Our Approach", href: "#approach" },
  { num: "06", label: "Impact & Numbers", href: "#impact" },
  { num: "07", label: "Featured Work", href: "#work" },
  { num: "08", label: "Edge Notes", href: "#insights" },
  { num: "09", label: "Start a Project", href: "#contact" },
];

export default function Navbar() {
  const barRef = useRef<HTMLDivElement | null>(null);
  const [isLight, setIsLight] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");

  // Close menu on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    if (next === "light") {
      // Smoothly navigate to light section
      const phen = document.querySelector("#phenomenon") as HTMLElement | null;
      if (phen) {
        (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement, opts?: object) => void } }).__lenis?.scrollTo(phen, { duration: 1.2 });
      }
    } else {
      // Smoothly navigate to dark hero
      const hero = document.querySelector("#hero") as HTMLElement | null;
      if (hero) {
        (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement, opts?: object) => void } }).__lenis?.scrollTo(hero, { duration: 1.2 });
      }
    }
  };

  useEffect(() => {
    let lastIsLight = false;
    let lastScrolled = false;
    let frameCounter = 0;

    // GPU-composited scaleX synced directly to GSAP ticker (same frame as Lenis, zero React re-renders)
    const tick = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct =
        docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${pct})`;
      }

      const scrolled = window.scrollY > 20;
      if (scrolled !== lastScrolled) {
        lastScrolled = scrolled;
        setIsScrolled(scrolled);
      }

      frameCounter++;
      if (frameCounter % 4 === 0) {
        const lightSections =
          document.querySelectorAll<HTMLElement>('[data-theme="light"]');
        let overLight = false;
        lightSections.forEach((sec) => {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= 64 && rect.bottom >= 32) {
            overLight = true;
          }
        });
        if (overLight !== lastIsLight) {
          lastIsLight = overLight;
          setIsLight(overLight);
        }
      }
    };

    tick();
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <>
      {/* Top 3px GPU-composited neon emerald scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[70] h-[3px] pointer-events-none bg-transparent">
        <div
          ref={barRef}
          className="w-full h-full origin-left bg-[#14f884] will-change-transform"
          style={{
            transform: "scaleX(0)",
            boxShadow:
              "0 0 14px rgba(20, 248, 132, 0.85), 0 0 4px rgba(20, 248, 132, 1)",
          }}
        />
      </div>

      {/* Liquid Glass Navbar with chromatic dispersion & caustic depth */}
      <header
        className={`fixed top-0 left-0 right-0 z-[60] px-4 sm:px-9 py-3 sm:py-3.5 flex items-center justify-between transition-all duration-300 ${
          isLight ? "liquid-glass-nav-light" : "liquid-glass-nav"
        }`}
      >
        {/* Brand Mark: tight ARKAFEDGE. lockup + glowing #17f888 A box */}
        <a
          href="#hero"
          className="inline-flex items-center gap-2.5 group focus:outline-none"
        >
          <span className="w-8 h-8 rounded-[8px] bg-[#17f888] text-[#050b09] font-semibold text-[15px] flex items-center justify-center neon-logo-glow transition-transform duration-300 group-hover:scale-105">
            A
          </span>
          <span className="font-semibold tracking-[-0.03em] text-[17px] leading-none">
            <span
              className={`transition-colors duration-300 ${
                isLight ? "text-[#091412]" : "text-white"
              }`}
            >
              ARKAF
            </span>
            <span className={isLight ? "text-[#06a65a]" : "text-[#14f884]"}>
              EDGE.
            </span>
          </span>
        </a>

        {/* Right Controls with Liquid Glass styling */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:inline-flex liquid-glass-btn-wrap">
            <a
              href="#contact"
              className="liquid-glass-btn px-4 py-1.5 font-mono-label text-[9.5px] font-semibold text-[#14f884]"
            >
              <span className="liquid-glass-btn-shine" />
              <Sparkles className="w-3 h-3 text-[#14f884] shrink-0" />
              <span className="relative z-10">START A PROJECT</span>
            </a>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme / light section"
            className="w-8 h-8 rounded-full hidden sm:flex items-center justify-center liquid-glass-pill text-[#14f884] transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
          >
            {isLight || themeMode === "light" ? (
              <Moon className="w-3.5 h-3.5" />
            ) : (
              <Sun className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="w-8 h-8 rounded-full flex items-center justify-center liquid-glass-pill text-white transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
          >
            {menuOpen ? (
              <X className="w-3.5 h-3.5 text-[#14f884]" />
            ) : (
              <Menu className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </header>

      {/* Fullscreen Navigation Drawer */}
      <div
        className={`fixed inset-0 z-[55] bg-[#04120f]/95 backdrop-blur-xl transition-all duration-500 flex flex-col justify-between px-5 sm:px-14 pt-24 sm:pt-28 pb-8 sm:pb-10 overflow-y-auto ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="max-w-5xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-2 sm:gap-y-4">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="group flex items-baseline gap-4 py-2.5 sm:py-3 border-b border-white/10 hover:border-[#14f884] transition-colors"
            >
              <span className="font-mono-label text-[10px] sm:text-[11px] text-[#14f884]">
                {item.num}
              </span>
              <span className="text-xl sm:text-3xl font-medium tracking-[-0.03em] text-white group-hover:text-[#14f884] transition-colors">
                {item.label}
              </span>
              <ArrowUpRight className="w-4 h-4 ml-auto text-white/30 group-hover:text-[#14f884] transition-colors" />
            </a>
          ))}
        </nav>

        <div className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs text-[#b8c7c2]">
          <p className="font-mono-label text-[11px]">
            GROWTH SHOULD LEAVE SOMETHING GOOD BEHIND.
          </p>
          <a
            href="mailto:hello@arkafedge.com"
            className="font-mono-label text-[11px] text-[#14f884] hover:underline"
          >
            hello@arkafedge.com
          </a>
        </div>
      </div>
    </>
  );
}
