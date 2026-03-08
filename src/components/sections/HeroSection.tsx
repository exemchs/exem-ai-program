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

  // Text 1: visible immediately, fade out mid-scroll
  const text1Opacity = progress <= 0.25 ? 1 : progress >= 0.4 ? 0 : 1 - (progress - 0.25) / 0.15;
  // Text 2: fade in after text 1 gone
  const text2Opacity = progress <= 0.45 ? 0 : progress >= 0.6 ? 1 : (progress - 0.45) / 0.15;
  // Text 2 color: interpolate white → dark as background brightens
  const text2Color = progress <= 0.6
    ? "rgb(255,255,255)"
    : `rgb(${Math.round(255 - (progress - 0.6) / 0.4 * 225)},${Math.round(255 - (progress - 0.6) / 0.4 * 230)},${Math.round(255 - (progress - 0.6) / 0.4 * 220)})`;

  return (
    <section
      ref={sectionRef}
      className="h-[200vh] relative"
      style={{
        background: `linear-gradient(180deg,
          #1a0a00 0%,
          #3d1a00 20%,
          #8b4513 40%,
          #e67e22 60%,
          #f4c57a 80%,
          #fef9f0 100%)`,
      }}
    >
      {/* Sticky container */}
      <div className="h-screen w-full sticky top-0 flex items-center justify-center">

        {/* Text Group 1 */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
          style={{ opacity: text1Opacity }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tighter text-white leading-[1.1] text-center">
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
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
          style={{ opacity: text2Opacity }}
        >
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tighter leading-[1.1] text-center"
            style={{ color: text2Color }}
          >
            기술과 개발을 몰라도
            <br />
            누구나 할 수 있습니다.
          </h2>
        </div>

      </div>
    </section>
  );
}
