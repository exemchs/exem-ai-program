import { useState, useEffect } from "react";
import type { OsType } from "./constants/os";
import HeroSection from "./components/sections/HeroSection";
import WhyNowSection from "./components/sections/WhyNowSection";
import WhatWeLearnSection from "./components/sections/WhatWeLearnSection";
import PrerequisitesSection from "./components/sections/PrerequisitesSection";
import CurriculumSection from "./components/sections/CurriculumSection";

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


      {showNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowNotice(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-6 shadow-2xl text-center">
            <img src="/imgs/exem-logo.svg" alt="EXEM" className="h-6 mx-auto mb-8" />
            <p className="text-[#4B5563] text-sm leading-relaxed mb-2">
              본 프로그램은 CX그룹(비전공자) 대상으로 설계되었습니다.
            </p>
            <p className="text-[#4B5563] text-sm leading-relaxed mb-6">
              AI 활용 중급자 이상은 Anthropic 공식 프로그램 <a href="https://anthropic.skilljar.com/" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 underline">Skilljar</a>를 추천합니다.
            </p>
            <div className="border-t border-gray-100 pt-4 mb-8">
              <p className="text-[#9CA3AF] text-xs">추후 업데이트 예정 — Linux / WSL 환경 지원</p>
            </div>
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
