"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles, X, CheckCircle2, Copy, Check } from "lucide-react";
import { EDGE_NOTES } from "@/data/content";

const SERVICE_CHIPS = [
  "Brand Strategy",
  "Creative & 3D",
  "Digital Platform",
  "Performance Growth",
];

export default function InsightsContactFooter() {
  const insightsRef = useRef<HTMLElement | null>(null);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [activeNote, setActiveNote] = useState<(typeof EDGE_NOTES)[number] | null>(
    null
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brief, setBrief] = useState("");
  const [selectedService, setSelectedService] = useState<string>("Brand Strategy");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = insightsRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setCardsVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveNote(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitted(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@arkafedge.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="bg-[#041d1a] text-white">
      {/* SECTION 08 — INSIGHTS matching Screenshot 13 exact proportions */}
      <section
        id="insights"
        ref={insightsRef}
        className="py-12 sm:py-16 border-t border-white/25"
      >
        <div className="max-w-[1000px] mx-auto px-5 sm:px-10">
          <span className="inline-block rounded-full border border-[#14f884]/25 bg-[#072924] font-mono-label text-[10px] text-[#14f884] px-4 py-1.5 mb-4">
            08. INSIGHTS
          </span>

          {/* Single crisp line matching Screenshot 13 */}
          <h2 className="text-[clamp(1.65rem,3.3vw,3.15rem)] font-black tracking-[-0.025em] uppercase leading-[1.04] mb-7 sm:mb-9 md:whitespace-nowrap">
            <span className="text-white">IDEAS WORTH </span>
            <span className="text-[#14f884] neon-text-glow">
              THINKING ABOUT.
            </span>
          </h2>

          {/* 3-Column Card Grid matching Screenshot 13 exact geometry */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {EDGE_NOTES.map((note, idx) => (
              <article
                key={note.title}
                onClick={() => setActiveNote(note)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActiveNote(note)}
                style={{
                  transitionDelay: cardsVisible ? `${idx * 110}ms` : "0ms",
                }}
                className={`group cursor-pointer rounded-[16px] sm:rounded-[18px] border border-white/30 bg-[#041e1b] p-6 sm:p-7 flex flex-col justify-between min-h-0 md:min-h-[265px] hover:border-[#14f884]/70 hover:-translate-y-1 transition-all duration-700 ease-out focus:outline-none ${
                  cardsVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-[#2da675] mb-5">
                    <span>{note.category}</span>
                    <span>{note.readTime}</span>
                  </div>
                  <h3 className="text-[clamp(1.15rem,1.75vw,1.55rem)] font-bold text-white leading-[1.24] group-hover:text-[#14f884] transition-colors">
                    {note.title}
                  </h3>
                  <p className="mt-3.5 text-[clamp(0.8rem,1.08vw,0.94rem)] text-[#99b0aa] font-light leading-[1.58]">
                    {note.excerpt}
                  </p>
                </div>

                <div className="mt-7 inline-flex items-center gap-2 font-mono-label text-[10.5px] font-semibold text-[#14f884] group-hover:gap-3 transition-all">
                  READ ARTICLE
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Article Reader Modal with Lenis scroll isolation */}
      {activeNote && (
        <div
          className="fixed inset-0 z-[95] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveNote(null)}
        >
          <div
            data-lenis-prevent
            className="max-w-xl w-full max-h-[85vh] overflow-y-auto rounded-2xl border border-[#14f884]/40 bg-[#041d1a] p-7 sm:p-9 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveNote(null)}
              aria-label="Close article"
              className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/75 hover:text-[#14f884] hover:border-[#14f884] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="font-mono text-xs text-[#14f884] mb-3">
              {activeNote.category} · {activeNote.readTime}
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight pr-8">
              {activeNote.title}
            </h3>
            <p className="mt-5 text-sm sm:text-base text-[#c7d6d1] font-light leading-relaxed">
              {activeNote.excerpt}
            </p>
            <p className="mt-4 text-sm sm:text-base text-[#b8c7c2] font-light leading-relaxed pt-4 border-t border-white/10">
              {activeNote.fullText}
            </p>
          </div>
        </div>
      )}

      {/* SECTION 09 — FINAL CTA matching Screenshot 14 exact proportions & clean interactive form */}
      <section id="contact" className="pb-16 sm:pb-20 pt-2">
        <div className="max-w-[1000px] mx-auto px-5 sm:px-10">
          <div className="rounded-[20px] sm:rounded-[22px] border border-white/30 bg-[#04211d] p-6 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column matching Screenshot 14 */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#14f884]/40 bg-[#041d1a] px-4 py-1.5 mb-5 sm:mb-7">
                <Sparkles className="w-3 h-3 text-[#14f884]" />
                <span className="font-mono-label text-[10px] text-[#14f884]">
                  09. FINAL CTA
                </span>
              </div>

              {/* Tight 2-line uppercase Black locked against wrapping */}
              <h2 className="text-[clamp(1.95rem,3.5vw,3.25rem)] font-black tracking-[-0.03em] leading-[1.02] uppercase">
                <span className="block text-white sm:whitespace-nowrap">
                  READY TO FIND
                </span>
                <span className="block text-[#14f884] neon-text-glow sm:whitespace-nowrap">
                  YOUR EDGE?
                </span>
              </h2>

              <p className="mt-4 sm:mt-5 text-[clamp(0.875rem,1.25vw,1.1rem)] text-[#a8beb8] font-light leading-[1.58] max-w-md">
                Let&apos;s explore what&apos;s possible when strategy,
                creativity, and purpose come together.
              </p>

              {/* Email with copy button */}
              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/15 flex items-center gap-3">
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
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/15 bg-white/5 hover:border-[#14f884] text-[10px] font-mono text-[#a8beb8] hover:text-[#14f884] transition-colors cursor-pointer"
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

            {/* Right Nested Form Card matching Screenshot 14 */}
            <div className="lg:col-span-6 rounded-[16px] border border-white/10 bg-[#031a17] p-5 sm:p-8">
              <h3 className="text-[19px] font-bold text-white mb-4">
                Start a Conversation
              </h3>

              {submitted ? (
                <div className="py-10 text-center">
                  <CheckCircle2 className="w-11 h-11 text-[#14f884] mx-auto mb-3.5" />
                  <h4 className="text-xl font-extrabold text-white">
                    Sent to the Edge.
                  </h4>
                  <p className="mt-2 text-sm text-[#b8c7c2] font-light">
                    Thanks, {name}. We&apos;ll reply soon regarding your {selectedService} inquiry.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setBrief("");
                    }}
                    className="mt-5 font-mono-label text-[10px] text-[#14f884] underline cursor-pointer"
                  >
                    SEND ANOTHER NOTE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Selectable Service Chips */}
                  <div>
                    <label className="block font-mono-label text-[9.5px] text-[#2fb880] mb-2">
                      INTERESTED SERVICE
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {SERVICE_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setSelectedService(chip)}
                          className={`px-3 py-1 rounded-full font-mono-label text-[9px] font-medium transition-all cursor-pointer ${
                            selectedService === chip
                              ? "bg-[#14f884] text-[#050b09] shadow-[0_0_10px_#14f884]"
                              : "bg-[#051e1b] text-white/60 border border-white/10 hover:text-white"
                          }`}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono-label text-[9.5px] text-[#2fb880] mb-2">
                      NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full rounded-[10px] border border-white/12 bg-[#051e1b] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#14f884] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-label text-[9.5px] text-[#2fb880] mb-2">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full rounded-[10px] border border-white/12 bg-[#051e1b] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#14f884] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-label text-[9.5px] text-[#2fb880] mb-2">
                      PROJECT BRIEF
                    </label>
                    <textarea
                      rows={3}
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      placeholder="Tell us about your brand goals..."
                      className="w-full rounded-[10px] border border-white/12 bg-[#051e1b] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#14f884] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0ffa7f] text-[#050b09] font-mono-label text-[11px] font-bold px-7 py-3.5 neon-box-glow hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer"
                  >
                    SEND IT TO THE EDGE
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Clean Minimal Footer + .docx Easter Egg */}
      <footer className="border-t border-white/15 py-9">
        <div className="max-w-[1000px] mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8db5a8]">
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
            className="font-mono-label text-[10px] text-[#a8beb8] hover:text-[#14f884] transition-colors"
          >
            Still scrolling? We like curious people. →{" "}
            <span className="text-[#14f884]">Careers / Say Hello</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
