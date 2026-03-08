import ClaudeParticles from "../common/ClaudeParticles";

export default function HeroSection() {
  return (
    <section
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "#030201" }}
    >
      {/* Antimetal exact gradient */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #030201 0%, #1A130B 17%, #271A0D 32%, #563513 53%, #85531A 66%, #BD7922 79%, #D8973B 88%, #FFD683 100%)",
        }}
      />

      <ClaudeParticles />

      {/* Text — 모바일: 상하 배치, 데스크탑: 모래시계 양옆 */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* 모바일: 중앙 상하 배치 */}
        <div className="md:hidden absolute inset-x-0 flex flex-col items-center gap-1" style={{ top: "46%", transform: "translateY(-50%)" }}>
          <h1 className="text-2xl font-medium tracking-tighter text-[#fff3d7]">
            It's your time to
          </h1>
          <h1 className="text-2xl font-medium tracking-tighter text-[#fff3d7]">
            start Claude Code
          </h1>
        </div>

        {/* 데스크탑: 모래시계 양옆 */}
        <h1
          className="hidden md:block absolute text-4xl lg:text-5xl font-medium tracking-tighter text-[#fff3d7] whitespace-nowrap"
          style={{ top: "46%", right: "calc(50% + 100px)", transform: "translateY(-50%)" }}
        >
          It's your time to
        </h1>
        <h1
          className="hidden md:block absolute text-4xl lg:text-5xl font-medium tracking-tighter text-[#fff3d7] whitespace-nowrap"
          style={{ top: "46%", left: "calc(50% + 100px)", transform: "translateY(-50%)" }}
        >
          start Claude Code
        </h1>
      </div>

      {/* Bottom CTA button */}
      <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4">
        <a
          href="#prerequisites"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#d0f100] text-[#100d0a] font-medium text-lg hover:bg-[#e8ff6b] transition-colors shadow-[0_0_40px_rgba(208,241,0,0.3)] pointer-events-auto"
        >
          Start Now
        </a>
      </div>
    </section>
  );
}
