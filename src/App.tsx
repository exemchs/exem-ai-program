import { useState, useEffect } from "react";
import type { OsType } from "./constants/os";
import HeroSection from "./components/sections/HeroSection";
import WhyNowSection from "./components/sections/WhyNowSection";
import WhatWeLearnSection from "./components/sections/WhatWeLearnSection";
import PrerequisitesSection from "./components/sections/PrerequisitesSection";
import CurriculumSection from "./components/sections/CurriculumSection";
import FAQSection from "./components/sections/FAQSection";

export default function App() {
  const [os, setOs] = useState<OsType>(() => {
    const p = navigator.platform.toLowerCase();
    return p.includes("win") ? "win" : "mac";
  });
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowNotice(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#1a2234] font-sans selection:bg-blue-200/50">
      <HeroSection />
      <WhyNowSection />
      <WhatWeLearnSection />
      <PrerequisitesSection os={os} onOsChange={setOs} />
      <CurriculumSection />
      <FAQSection />

      {showNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowNotice(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-6 shadow-2xl">
            <h3 className="text-lg font-medium text-[#1a2234] mb-4">참조사항</h3>
            <p className="text-[#4B5563] text-sm leading-relaxed mb-3">
              이 프로그램은 CLI를 다뤄본 적 없는 엑셈 구성원분들을 위한 난이도로 설계되었습니다.
            </p>
            <p className="text-[#4B5563] text-sm leading-relaxed mb-6">
              중급자 이상은 Anthropic 공식 교육 프로그램 : <a href="https://anthropic.skilljar.com/" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 underline">Skilljar</a>를 추천드립니다.
            </p>
            <button
              onClick={() => setShowNotice(false)}
              className="w-full py-2.5 rounded-lg bg-[#1a2234] text-white text-sm hover:bg-[#2a3344] transition-colors cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
