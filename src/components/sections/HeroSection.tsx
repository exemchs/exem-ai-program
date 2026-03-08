import { Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="h-[240vh] relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg,
          #1a0a00 0%,
          #2d1810 15%,
          #8b4513 30%,
          #c4692e 45%,
          #e67e22 58%,
          #f4c57a 75%,
          #fef9f0 100%)`,
      }}
    >
      {/* Sticky content — stays centered while scrolling through gradient */}
      <div className="h-screen w-full sticky top-0 flex items-center justify-center">
        <div className="relative z-10 max-w-3xl mx-auto px-6 w-full flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-white/70 text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles size={14} />
            <span>Exem Claude Code Class</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter text-white leading-[1.15] mb-6">
            '나중에 해야지' 했던 <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-300 to-amber-100">
              Claude Code,
            </span>
            <br />
            지금이 기회입니다.
          </h1>

          <p className="text-lg md:text-xl text-white/60 font-normal">
            Claude Code, 같이 시작하면 됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}
