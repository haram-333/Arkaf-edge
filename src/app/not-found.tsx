import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#050b09] text-white flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(20,248,132,0.18), transparent 55%)",
        }}
      />
      <span className="font-mono-label text-[11px] px-4 py-1.5 rounded-full border border-[#14f884]/40 text-[#14f884] bg-[#072624]/60 mb-8 relative z-10">
        404 — OFF THE MAP
      </span>
      <h1 className="text-4xl sm:text-6xl font-medium tracking-[-0.035em] max-w-2xl leading-[1.05] relative z-10">
        You&apos;ve wandered{" "}
        <span className="text-[#14f884] neon-text-glow">off the edge.</span>
      </h1>
      <p className="mt-5 text-[#b8c7c2] text-base sm:text-lg max-w-md font-light relative z-10">
        Apparently even good explorers take a wrong turn.
      </p>
      <Link
        href="/"
        className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#55b886] hover:bg-[#6bc999] text-[#04140d] font-mono-label text-xs font-semibold px-7 py-3.5 neon-box-glow hover:scale-[1.03] transition-all relative z-10"
      >
        BACK TO ARKAF EDGE →
      </Link>
    </main>
  );
}
