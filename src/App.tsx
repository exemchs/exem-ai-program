import { useState } from "react";
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

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#1a2234] font-sans selection:bg-blue-200/50">
      <HeroSection />
      <WhyNowSection />
      <WhatWeLearnSection />
      <PrerequisitesSection os={os} onOsChange={setOs} />
      <CurriculumSection />
      <FAQSection />
    </div>
  );
}
