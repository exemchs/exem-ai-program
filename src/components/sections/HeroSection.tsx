import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

// RGB color type
type RGB = [number, number, number];

// Keyframe gradient definition
interface GradientKeyframe {
  progress: number;
  colors: [RGB, RGB, RGB]; // 3 color stops
}

const GRADIENT_KEYFRAMES: GradientKeyframe[] = [
  {
    progress: 0,
    colors: [
      [61, 26, 0],    // #3d1a00
      [26, 10, 0],    // #1a0a00 (used for both mid and end at 70%)
      [26, 10, 0],    // #1a0a00
    ],
  },
  {
    progress: 0.5,
    colors: [
      [230, 126, 34], // #e67e22
      [139, 69, 19],  // #8b4513
      [45, 24, 16],   // #2d1810
    ],
  },
  {
    progress: 1,
    colors: [
      [254, 249, 240], // #fef9f0
      [244, 197, 122], // #f4c57a
      [230, 126, 34],  // #e67e22
    ],
  },
];

function lerpRGB(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function getGradient(progress: number): string {
  // Find the two keyframes to interpolate between
  let from = GRADIENT_KEYFRAMES[0];
  let to = GRADIENT_KEYFRAMES[1];
  let localT = 0;

  for (let i = 0; i < GRADIENT_KEYFRAMES.length - 1; i++) {
    if (progress >= GRADIENT_KEYFRAMES[i].progress && progress <= GRADIENT_KEYFRAMES[i + 1].progress) {
      from = GRADIENT_KEYFRAMES[i];
      to = GRADIENT_KEYFRAMES[i + 1];
      const range = to.progress - from.progress;
      localT = range === 0 ? 0 : (progress - from.progress) / range;
      break;
    }
  }

  const c0 = lerpRGB(from.colors[0], to.colors[0], localT);
  const c1 = lerpRGB(from.colors[1], to.colors[1], localT);
  const c2 = lerpRGB(from.colors[2], to.colors[2], localT);

  // Match the keyframe gradient stops
  // progress 0: 0%, 70% (2 stops)
  // progress 0.5: 0%, 50%, 100% (3 stops)
  // progress 1: 0%, 40%, 100% (3 stops)
  // Interpolate stop positions too
  const stopMid = 40 + (1 - progress) * 30; // 70% at p=0, 50% at p=0.5, 40% at p=1
  const rgb = (c: RGB) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;

  return `radial-gradient(ellipse 80% 60% at 50% 40%, ${rgb(c0)} 0%, ${rgb(c1)} ${stopMid}%, ${rgb(c2)} 100%)`;
}

function getTextOpacity(progress: number): number {
  if (progress <= 0.7) return 1;
  return 1 - (progress - 0.7) / 0.3;
}

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
        const rawProgress = (scrollY - offsetTop) / (offsetHeight - window.innerHeight);
        setProgress(Math.max(0, Math.min(1, rawProgress)));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial calculation
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const gradient = getGradient(progress);
  const textOpacity = getTextOpacity(progress);

  return (
    <section ref={sectionRef} className="h-[240vh] relative">
      {/* Sticky container */}
      <div className="h-screen w-full sticky top-0 flex items-center justify-center">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{ background: gradient }}
        />

        {/* Content */}
        <div
          className="relative z-10 max-w-3xl mx-auto px-6 w-full flex flex-col items-center text-center"
          style={{ opacity: textOpacity }}
        >
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-medium mb-8">
              <Sparkles size={14} />
              <span>Exem Claude Code Class</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter text-white leading-[1.1] mb-8">
              '나중에 해야지' 했던 <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-200">
                Claude Code,
              </span>
              <br />
              지금이 기회입니다.
            </h1>

            <p className="text-lg md:text-xl text-white/60 font-normal max-w-2xl mx-auto">
              Claude Code, 같이 시작하면 됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
