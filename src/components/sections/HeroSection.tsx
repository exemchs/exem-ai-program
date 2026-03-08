import ClaudeParticles from "../common/ClaudeParticles";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#110f0d" }}
    >
      {/* Antimetal exact gradient extracted from reference */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #110f0d 0%, #12100e 20%, #191510 30%, #211911 40%, #2b1f14 50%, #3d2918 60%, #55381d 70%, #7c5229 80%, #c58d46 90%, #ddb162 95%, #f9dc91 100%)",
        }}
      />

      <ClaudeParticles />

      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-[#fff3d7] leading-[1.1] mb-6">
          클로드 코드,
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#d0f100] to-[#e8ff6b]">
            지금 시작하세요
          </span>
        </h1>

        <p className="text-lg md:text-xl text-[#fff3d7]/55 font-light leading-relaxed">
          기술과 개발을 몰라도
          <br />
          누구나 할 수 있습니다
        </p>
      </div>
    </section>
  );
}
