import { useEffect, useState } from "react";
import type { OsType } from "./constants/os";
import HeroSection from "./components/sections/HeroSection";
import WhyNowSection from "./components/sections/WhyNowSection";
import WhatWeLearnSection from "./components/sections/WhatWeLearnSection";
import PrerequisitesSection from "./components/sections/PrerequisitesSection";
import CurriculumSection from "./components/sections/CurriculumSection";
import ShortcutsSection from "./components/sections/ShortcutsSection";
import OneMoreThingSection from "./components/sections/OneMoreThingSection";
import TroubleshootingSection from "./components/sections/TroubleshootingSection";
import FAQSection from "./components/sections/FAQSection";
import FooterSection from "./components/sections/FooterSection";
import ReferencePage from "./components/pages/ReferencePage";

export default function App() {
  const [os, setOs] = useState<OsType>("mac");
  const [page, setPage] = useState<"home" | "reference">("home");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (page === "reference") {
    return <ReferencePage onBack={() => setPage("home")} />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-orange-500/30">
      <HeroSection />
      <WhyNowSection />
      <WhatWeLearnSection />
      <PrerequisitesSection os={os} onOsChange={setOs} />
      <CurriculumSection />
      <ShortcutsSection />
      <OneMoreThingSection />
      <TroubleshootingSection os={os} />
      <FAQSection onNavigateReference={() => setPage("reference")} />
      <FooterSection onNavigateReference={() => setPage("reference")} />
    </div>
  );
}
