"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Sparkles, X, CheckCircle2, Copy, Check } from "lucide-react";
import ContactNatureCanvas from "@/components/canvas/ContactNatureCanvas";
import { EDGE_NOTES, EDGE_NOTES_CONTENT } from "@/data/content";

const SERVICE_CHIPS = [
  "Brand Strategy",
  "Marketing & Growth",
  "Performance Marketing",
  "Creative Production",
  "Website & Digital",
  "Something Else",
];

export default function InsightsContactFooter() {
  const insightsRef = useRef<HTMLElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const noteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [cardsVisible, setCardsVisible] = useState(false);

  // Hover & Fullscreen Circular Wave Reader State for Edge Notes
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<(typeof EDGE_NOTES)[number] | null>(null);
  const [noteOrigin, setNoteOrigin] = useState<{ x: string; y: string }>({
    x: "50%",
    y: "50%",
  });
  const [noteExpanded, setNoteExpanded] = useState(false);

  // Contact Form State
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [company, setCompany] = useState("");
  const [brief, setBrief] = useState("");
  const [selectedService, setSelectedService] = useState<string>("Brand Strategy");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const openNoteOverlay = (
    note: (typeof EDGE_NOTES)[number],
    e?: React.MouseEvent<HTMLElement>
  ) => {
    if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
    if (e) {
      setNoteOrigin({ x: `${e.clientX}px`, y: `${e.clientY}px` });
    } else {
      setNoteOrigin({ x: "50%", y: "50%" });
    }
    setNoteExpanded(false);
    setActiveNote(note);
    noteTimerRef.current = setTimeout(() => {
      setNoteExpanded(true);
    }, 28);
  };

  const closeNoteOverlay = () => {
    if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
    setNoteExpanded(false);
    noteTimerRef.current = setTimeout(() => {
      setActiveNote(null);
    }, 980);
  };

  useEffect(() => {
    return () => {
      if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const el = insightsRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setCardsVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (activeNote) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeNote) closeNoteOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [activeNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactInfo.trim()) return;
    setSubmitted(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@arkafedge.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const focusForm = () => {
    nameInputRef.current?.focus();
    nameInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="bg-[#041d1a] text-white">
      {/* =========================================================================
          SECTION 08 — INSIGHTS / EDGE NOTES
          - Verified strictly against doc (removed non-doc readTime & metadata)
          - Circular-wave hover reveal + full-viewport circular-wave reader on click
      ========================================================================= */}
      <section
        id="insights"
        ref={insightsRef}
        className="py-14 sm:py-20 border-t border-white/20"
      >
        <div className="max-w-[1140px] mx-auto px-5 sm:px-10">
          <span className="inline-block rounded-full border border-[#14f884]/25 bg-[#072924] font-mono-label text-[10px] text-[#14f884] px-4 py-1.5 mb-4">
            {EDGE_NOTES_CONTENT.badge}
          </span>

          <h2 className="text-[clamp(1.65rem,3.3vw,3.15rem)] font-black tracking-[-0.025em] uppercase leading-[1.04] mb-3">
            <span className="text-white">{EDGE_NOTES_CONTENT.headlineWhite} </span>
            <span className="text-[#14f884] neon-text-glow">
              {EDGE_NOTES_CONTENT.headlineGreen}
            </span>
          </h2>

          <p className="max-w-xl text-xs sm:text-sm text-[#99b3ab] font-light mb-5">
            {EDGE_NOTES_CONTENT.subtitle}
          </p>

          {/* All 5 Doc Intersections displayed cleanly */}
          <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
            {EDGE_NOTES_CONTENT.intersections.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1 rounded-full liquid-glass-pill font-mono-label text-[9.5px] sm:text-[10px] text-[#c7f5dd] tracking-wider"
              >
                {topic}
              </span>
            ))}
          </div>

          {/* 3-Column Card Grid with Circular Hover Wave & Same Fullscreen Click Animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {EDGE_NOTES.map((note, idx) => {
              const isHovered = hoveredNote === note.title;
              return (
                <article
                  key={note.title}
                  onMouseEnter={() => setHoveredNote(note.title)}
                  onMouseLeave={() => setHoveredNote(null)}
                  onClick={(e) => openNoteOverlay(note, e)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && openNoteOverlay(note)}
                  style={{
                    transitionDelay: cardsVisible && !isHovered ? `${idx * 90}ms` : "0ms",
                  }}
                  className={`group relative cursor-pointer rounded-[22px] border border-white/25 bg-[#041e1b] overflow-hidden p-6 sm:p-7 flex flex-col justify-between min-h-[275px] transition-all duration-500 ease-out focus:outline-none select-none shadow-xl ${
                    cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  {/* Signature Slow Circular Wave Fill on Hover (1200ms) */}
                  <div
                    className="pointer-events-none absolute inset-0 z-10 bg-[#c6f19d] transition-[clip-path] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      clipPath: isHovered
                        ? "circle(165% at calc(100% - 40px) 40px)"
                        : "circle(0px at calc(100% - 40px) 40px)",
                    }}
                  />

                  <div className="relative z-20">
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <span
                        className={`font-mono-label text-[9.5px] px-2.5 py-1 rounded-full border transition-colors duration-500 ${
                          isHovered
                            ? "border-[#051f10]/25 bg-white/45 text-[#051f10] font-bold"
                            : "border-[#14f884]/35 bg-[#051a12]/80 text-[#14f884]"
                        }`}
                      >
                        {note.category}
                      </span>

                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 shrink-0 ${
                          isHovered
                            ? "bg-[#051f10] text-[#c6f19d] scale-105"
                            : "bg-[#14f884]/15 text-[#14f884]"
                        }`}
                      >
                        <ArrowRight
                          className={`w-3.5 h-3.5 stroke-[2.5] transition-transform duration-500 ${
                            isHovered ? "rotate-[-45deg]" : "rotate-0"
                          }`}
                        />
                      </div>
                    </div>

                    <h3
                      className={`text-[clamp(1.15rem,1.65vw,1.48rem)] font-bold leading-[1.24] transition-colors duration-500 ${
                        isHovered ? "text-[#051f10]" : "text-white"
                      }`}
                    >
                      {note.title}
                    </h3>

                    <p
                      className={`mt-3 text-[clamp(0.8rem,1vw,0.92rem)] font-light leading-[1.58] transition-colors duration-500 ${
                        isHovered ? "text-[#0b3322] font-normal" : "text-[#99b0aa]"
                      }`}
                    >
                      {note.excerpt}
                    </p>
                  </div>

                  <div
                    className={`relative z-20 mt-7 pt-3 border-t flex items-center justify-between transition-colors duration-500 ${
                      isHovered ? "border-[#051f10]/15" : "border-white/10"
                    }`}
                  >
                    <span
                      className={`font-mono-label text-[10px] font-bold inline-flex items-center gap-1.5 transition-colors duration-500 ${
                        isHovered ? "text-[#051f10]" : "text-[#14f884]"
                      }`}
                    >
                      EXPLORE NOTE
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FULL-VIEWPORT CIRCULAR-WAVE EDGE NOTE READER
          Matches the exact circular expansion interaction of Founder cards
      ========================================================================= */}
      {activeNote && (
        <div
          data-lenis-prevent
          style={{
            clipPath: noteExpanded
              ? `circle(165vmax at ${noteOrigin.x} ${noteOrigin.y})`
              : `circle(0px at ${noteOrigin.x} ${noteOrigin.y})`,
          }}
          className={`fixed inset-0 z-[110] w-screen h-[100dvh] overflow-y-auto bg-[#031612] text-white will-change-[clip-path] transition-[clip-path] ${
            noteExpanded
              ? "duration-[1350ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              : "duration-[950ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          }`}
        >
          <div
            className="pointer-events-none fixed inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 25% 20%, rgba(20,248,132,0.2) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(198,241,157,0.12) 0%, transparent 50%)",
            }}
          />

          <div className="sticky top-0 z-30 flex items-center justify-between px-5 sm:px-10 py-4 bg-[#031612]/80 backdrop-blur-xl border-b border-white/10">
            <span className="font-mono-label text-[10px] sm:text-[11px] text-[#14f884] font-bold">
              [ EDGE NOTES — {activeNote.category} ]
            </span>

            <button
              type="button"
              onClick={closeNoteOverlay}
              aria-label="Close note"
              className="inline-flex items-center gap-2 rounded-full liquid-glass-pill px-4 py-1.5 font-mono-label text-[10px] text-white hover:text-[#14f884] cursor-pointer transition-colors"
            >
              <span>CLOSE</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            className={`relative z-10 max-w-3xl mx-auto px-5 sm:px-10 py-14 sm:py-20 transition-opacity duration-700 ${
              noteExpanded ? "opacity-100 delay-300" : "opacity-0"
            }`}
          >
            <span className="inline-block rounded-full bg-[#c6f19d] text-[#051f10] font-mono-label text-[10px] font-bold px-3.5 py-1 mb-5">
              {activeNote.category}
            </span>

            <h3 className="text-3xl sm:text-5xl font-black text-white leading-[1.08] tracking-tight">
              {activeNote.title}
            </h3>

            <p className="mt-6 text-lg sm:text-xl text-[#c6f19d] font-normal leading-relaxed">
              {activeNote.excerpt}
            </p>

            <div className="mt-8 pt-8 border-t border-white/15 text-base sm:text-lg text-[#d8e9e3] font-light leading-[1.82]">
              <p>{activeNote.fullText}</p>
            </div>

            <div className="mt-12 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {EDGE_NOTES.filter((n) => n.title !== activeNote.title).map((other) => (
                  <button
                    key={other.title}
                    type="button"
                    onClick={() => setActiveNote(other)}
                    className="px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.03] hover:border-[#14f884]/60 font-mono-label text-[9.5px] text-[#c7f5dd] cursor-pointer transition-colors"
                  >
                    {other.category} →
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={closeNoteOverlay}
                className="rounded-full bg-[#14f884] text-[#050b09] font-mono-label text-[10.5px] font-bold px-5 py-2.5 cursor-pointer hover:bg-[#c6f19d] transition-colors"
              >
                BACK TO PAGE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 09 — MODERN LIQUID GLASS CONTACT SECTION + ANIMATED NATURE CANVAS
          - ContactNatureCanvas animates gently behind the whole section
          - Responsive 12-col open split (zero headline clipping on any viewport!)
          - True .liquid-glass translucent refractive form container
      ========================================================================= */}
      <section
        id="contact"
        className="relative overflow-hidden border-t border-white/15 bg-[#031714] py-16 sm:py-24"
      >
        {/* Realtime Animated Botanical Canopy & Bioluminescent Spores Canvas */}
        <ContactNatureCanvas />

        {/* Subtle Top & Bottom Atmospheric Scrims melting into adjacent sections */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,29,26,0.85) 0%, rgba(3,23,20,0.18) 25%, rgba(3,23,20,0.18) 78%, rgba(4,29,26,0.92) 100%)",
          }}
        />

        <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Open Editorial Column (Zero clipping, wraps gracefully across viewports) */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full liquid-glass-pill px-4 py-1.5 mb-5 sm:mb-6">
                <Sparkles className="w-3 h-3 text-[#14f884]" />
                <span className="font-mono-label text-[10px] text-[#14f884]">
                  09. CONTACT
                </span>
              </div>

              <h2 className="text-[clamp(2rem,3.6vw,3.35rem)] font-black tracking-[-0.03em] leading-[1.03] uppercase">
                <span className="block text-white">YOU BRING</span>
                <span className="block text-[#14f884] neon-text-glow">
                  THE AMBITION.
                </span>
                <span className="block text-white">WE&apos;LL FIND THE EDGE.</span>
              </h2>

              <p className="mt-5 text-sm sm:text-base text-[#cde0da] font-light leading-[1.65] max-w-md">
                Whether you&apos;re launching something new, rebuilding something old or trying to take a good business somewhere it has never been before:
              </p>

              <p className="mt-2.5 text-sm sm:text-base font-semibold text-white">
                Tell us what you&apos;re building.
              </p>

              {/* Doc Action Row: Start a Project or hello@arkafedge.com */}
              <div className="mt-7 pt-6 border-t border-white/15 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={focusForm}
                  className="inline-flex items-center gap-2 rounded-full bg-[#14f884] text-[#050b09] font-mono-label text-[10px] font-bold px-4 py-2 shadow-[0_0_18px_rgba(20,248,132,0.35)] hover:bg-[#c6f19d] cursor-pointer transition-colors"
                >
                  START A PROJECT
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                <span className="text-xs text-white/40 italic">or</span>

                <div className="flex items-center gap-2">
                  <a
                    href="mailto:hello@arkafedge.com"
                    className="font-mono-label text-[11px] text-[#14f884] hover:underline"
                  >
                    hello@arkafedge.com
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full liquid-glass-pill text-[9.5px] font-mono text-[#c7f5dd] hover:text-[#14f884] transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-[#14f884]" />
                        <span className="text-[#14f884]">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Liquid Glass Form Panel */}
            <div className="lg:col-span-7">
              <div className="rounded-[24px] sm:rounded-[28px] liquid-glass p-6 sm:p-9 lg:p-10 relative overflow-hidden">
                <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                  <div>
                    <span className="font-mono-label text-[9px] text-[#14f884] tracking-widest block mb-1">
                      DIRECT BRIEF
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Start a Conversation
                    </h3>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#14f884] shadow-[0_0_10px_#14f884] animate-pulse" />
                </div>

                {submitted ? (
                  <div className="py-12 text-center">
                    <CheckCircle2 className="w-12 h-12 text-[#14f884] mx-auto mb-4" />
                    <h4 className="text-2xl font-extrabold text-white">
                      Sent to the Edge.
                    </h4>
                    <p className="mt-2.5 text-sm sm:text-base text-[#cde0da] font-light max-w-md mx-auto">
                      Thanks, {name}. We&apos;ll reach out soon at {contactInfo} to explore your {selectedService} initiative.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setName("");
                        setContactInfo("");
                        setCompany("");
                        setBrief("");
                      }}
                      className="mt-6 rounded-full liquid-glass-pill px-5 py-2 font-mono-label text-[10px] text-[#14f884] cursor-pointer"
                    >
                      SEND ANOTHER NOTE
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Field 1 & 2 Responsive 2-Column Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-label text-[9.5px] text-[#a9f5cf] mb-1.5">
                          WHAT SHOULD WE CALL YOU?
                        </label>
                        <input
                          ref={nameInputRef}
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Name"
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-md px-4 py-3 text-sm text-white placeholder:text-white/35 hover:border-white/30 focus:border-[#14f884] focus:bg-[#04241c]/60 focus:outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-label text-[9.5px] text-[#a9f5cf] mb-1.5">
                          WHERE CAN WE REACH YOU?
                        </label>
                        <input
                          type="text"
                          required
                          value={contactInfo}
                          onChange={(e) => setContactInfo(e.target.value)}
                          placeholder="Email / Phone"
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-md px-4 py-3 text-sm text-white placeholder:text-white/35 hover:border-white/30 focus:border-[#14f884] focus:bg-[#04241c]/60 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Field 3: Company */}
                    <div>
                      <label className="block font-mono-label text-[9.5px] text-[#a9f5cf] mb-1.5">
                        TELL US ABOUT THE COMPANY.
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Company"
                        className="w-full rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-md px-4 py-3 text-sm text-white placeholder:text-white/35 hover:border-white/30 focus:border-[#14f884] focus:bg-[#04241c]/60 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Field 4: Service Chips */}
                    <div>
                      <label className="block font-mono-label text-[9.5px] text-[#a9f5cf] mb-2">
                        WHAT ARE WE BUILDING TOGETHER?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SERVICE_CHIPS.map((chip) => {
                          const active = selectedService === chip;
                          return (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => setSelectedService(chip)}
                              className={`px-3.5 py-1.5 rounded-full font-mono-label text-[9px] sm:text-[9.5px] font-medium transition-all cursor-pointer ${
                                active
                                  ? "bg-[#14f884] text-[#050b09] font-bold shadow-[0_0_14px_rgba(20,248,132,0.5)]"
                                  : "liquid-glass-pill text-white/75 hover:text-[#14f884]"
                              }`}
                            >
                              {chip}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Field 5: Problem to solve */}
                    <div>
                      <label className="block font-mono-label text-[9.5px] text-[#a9f5cf] mb-1.5">
                        FORGET THE FORMAL BRIEF. WHAT&apos;S THE PROBLEM YOU&apos;RE TRYING TO SOLVE?
                      </label>
                      <textarea
                        rows={3}
                        value={brief}
                        onChange={(e) => setBrief(e.target.value)}
                        placeholder="Tell us everything..."
                        className="w-full rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-md px-4 py-3 text-sm text-white placeholder:text-white/35 hover:border-white/30 focus:border-[#14f884] focus:bg-[#04241c]/60 focus:outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Specular Liquid Glass / Emerald Submit CTA */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0ffa7f] text-[#050b09] font-mono-label text-[11px] sm:text-xs font-bold px-7 py-4 neon-box-glow hover:bg-[#c6f19d] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                      >
                        <span>SEND IT TO THE EDGE</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Minimal Footer + .docx Easter Egg */}
      <footer className="border-t border-white/15 py-9 bg-[#041d1a]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8db5a8]">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-[#17f888] text-[#050b09] font-black text-xs flex items-center justify-center">
              A
            </span>
            <span className="font-black tracking-tight text-white">
              ARKAF<span className="text-[#14f884]">EDGE.</span>
            </span>
            <span className="text-white/30">·</span>
            <span>© {new Date().getFullYear()}</span>
          </div>

          <a
            href="mailto:hello@arkafedge.com?subject=Curious%20Explorer%20—%20Saying%20Hello"
            className="font-mono-label text-[10px] text-[#a8beb8] hover:text-[#14f884] transition-colors text-center sm:text-right"
          >
            Still scrolling? We like curious people. →{" "}
            <span className="text-[#14f884]">Careers / Say Hello</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
