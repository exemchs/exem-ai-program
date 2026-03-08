import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const section = sectionRef.current;
        if (!section) return;
        const { offsetTop, offsetHeight } = section;
        const scrollY = window.scrollY;
        const p = (scrollY - offsetTop) / (offsetHeight - window.innerHeight);
        setProgress(Math.max(0, Math.min(1, p)));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Text 1 visible: progress 0~0.35, fade out 0.35~0.5
  const text1Opacity = progress <= 0.35 ? 1 : progress >= 0.5 ? 0 : 1 - (progress - 0.35) / 0.15;
  // Text 2 visible: fade in 0.5~0.65, stay 0.65~1
  const text2Opacity = progress <= 0.5 ? 0 : progress >= 0.65 ? 1 : (progress - 0.5) / 0.15;

  return (
    <section
      ref={sectionRef}
      className="h-[300vh] relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg,
          #1a0a00 0%,
          #2d1810 12%,
          #6b3410 25%,
          #8b4513 35%,
          #c4692e 48%,
          #e67e22 60%,
          #f4c57a 78%,
          #fef9f0 100%)`,
      }}
    >
      {/* Sticky container */}
      <div className="h-screen w-full sticky top-0 flex items-center justify-center">
        <div className="relative z-10 max-w-4xl mx-auto px-6 w-full flex flex-col items-center text-center">

          {/* Text Group 1 */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-100"
            style={{ opacity: text1Opacity, pointerEvents: text1Opacity === 0 ? "none" : "auto" }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tighter text-white leading-[1.1]">
              AI,{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-300 to-amber-100">
                클로드 코드
              </span>
              로
              <br />
              시작하세요.
            </h1>
          </div>

          {/* Text Group 2 */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-100"
            style={{ opacity: text2Opacity, pointerEvents: text2Opacity === 0 ? "none" : "auto" }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tighter text-white leading-[1.1]">
              기술과 개발을 몰라도
              <br />
              누구나 할 수 있습니다.
            </h2>
          </div>

        </div>
      </div>
    </section>
  );
}
