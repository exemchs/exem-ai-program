import ClaudeParticles from "../common/ClaudeParticles";

export default function HeroSection() {
  return (
    <section
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "#020B1A" }}
    >
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #020B1A 0%, #031027 12%, #041838 25%, #052454 38%, #0545A0 55%, #0B6BD4 68%, #1A8FE8 78%, #4DB4F0 88%, #C8E4FA 93%, #F8F9FC 100%)",
        }}
      />

      <ClaudeParticles />

      {/* Text — 모바일: 상하 배치, 데스크탑: 모래시계 양옆 */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* 모바일: 중앙 상하 배치 */}
        <div className="md:hidden absolute inset-x-0 flex flex-col items-center gap-2" style={{ top: "46%", transform: "translateY(-50%)" }}>
          <h1 className="text-4xl font-normal tracking-tight text-[#fff3d7]">
            클로드 코드
          </h1>
          <h1 className="text-4xl font-normal tracking-tight text-[#fff3d7]">
            지금 시작하세요
          </h1>
        </div>

        {/* 데스크탑: 모래시계 양옆 */}
        <h1
          className="hidden md:block absolute text-4xl lg:text-5xl font-normal tracking-tight text-[#fff3d7] whitespace-nowrap"
          style={{ top: "46%", right: "calc(50% + 94px)", transform: "translateY(-50%)" }}
        >
          클로드 코드
        </h1>
        <h1
          className="hidden md:block absolute text-4xl lg:text-5xl font-normal tracking-tight text-[#fff3d7] whitespace-nowrap"
          style={{ top: "46%", left: "calc(50% + 94px)", transform: "translateY(-50%)" }}
        >
          지금 시작하세요
        </h1>
      </div>

      {/* Bottom CTA button */}
      <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4">
        <a
          href="#why-now"
          className="inline-flex items-center gap-2 px-10 py-3 rounded-full bg-[#d0f100] text-[#100d0a] font-normal text-base hover:bg-[#e8ff6b] transition-colors shadow-[0_0_40px_rgba(208,241,0,0.3)] pointer-events-auto"
        >
          Start Now
        </a>
      </div>
    </section>
  );
}
