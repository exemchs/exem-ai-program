import { useState, useCallback } from "react";
import { FolderOpen, Plug, Repeat } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import Typewriter from "../common/Typewriter";

const terminalContent = [
  {
    user: "다운로드 폴더에 고객문의 엑셀 파일들 전부 읽고, 제품별로 분류해서 요약 정리해줘.",
    claude: [
      "네, 다운로드 폴더의 엑셀 파일에 접근하겠습니다.",
      "Reading 12 files from ~/Downloads/고객문의/...",
      "제품별 요약본을 생성했습니다. MaxGauge 28건, InterMax 15건, exemONE 9건으로 정리 완료.",
    ],
  },
  {
    user: "Notion에 있는 이번 주 회의록 가져와서, 결정사항만 뽑아 정리해줘.",
    claude: [
      "네, Notion MCP에 연결하여 회의록을 가져오겠습니다.",
      "Fetching from Notion → Extracting decisions...",
      "완료했습니다. 결정사항 5건을 정리하여 decisions.md 파일로 저장했습니다.",
    ],
  },
  {
    user: "Figma에서 이번 스프린트 디자인 변경사항 가져와서 컴포넌트별로 정리해줘.",
    claude: [
      "네, Figma MCP에 연결하여 디자인 파일을 분석하겠습니다.",
      "Reading Figma file → Comparing component changes...",
      "완료했습니다. 변경된 컴포넌트 8개를 design-changes.md로 정리했습니다.",
    ],
  },
];

const tabs = [
  { title: "내 컴퓨터 파일 접근", icon: <FolderOpen size={18} /> },
  { title: "외부 서비스 연결", icon: <Plug size={18} /> },
  { title: "디자인 협업 자동화", icon: <Repeat size={18} /> },
];

export default function WhatWeLearnSection() {
  const [activeTab, setActiveTab] = useState(0);

  const handleComplete = useCallback(() => {
    setTimeout(() => {
      setActiveTab((prev) => (prev + 1) % terminalContent.length);
    }, 2000);
  }, []);

  return (
    <section className="py-16 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <SectionHeading subtitle="What We Learn">
              우리가 배우는 건<br />
              기술이 아닌 새로운 관점입니다
            </SectionHeading>

            <div className="flex flex-col gap-3">
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all text-left ${activeTab === idx ? "bg-[#EFF6FF] border-[#3B82F6]/30 text-[#3B82F6]" : "bg-white border-[#E2E5EB] text-[#6B7280] hover:bg-[#F0F3F9] hover:text-[#1a2234]"}`}
                >
                  {tab.icon}
                  <span className="font-normal">{tab.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/10 to-transparent blur-3xl rounded-full"></div>
            <div className="relative rounded-2xl border border-[#E2E5EB] bg-[#1a1a2e] overflow-hidden shadow-2xl min-h-[320px] md:min-h-[400px] flex flex-col terminal-window">
              <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <div className="ml-4 text-xs font-mono text-white/40">
                  claude-code
                </div>
              </div>
              <div className="p-6 font-mono text-sm flex-grow">
                <div className="flex gap-4 mb-4">
                  <span className="text-[#d0f100]">❯</span>
                  <span className="text-white">claude</span>
                </div>
                <div className="text-white/55 mb-6">
                  Welcome to Claude Code! I can help you write code, analyze
                  data, and automate tasks.
                </div>
                <div className="flex gap-4 mb-6">
                  <span className="text-blue-400 shrink-0">You:</span>
                  <span className="text-white/70">
                    <Typewriter
                      key={`user-${activeTab}`}
                      text={terminalContent[activeTab].user}
                      delay={30}
                      startDelay={100}
                    />
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="text-[#d0f100] shrink-0">Claude:</span>
                  <div className="text-white/70 space-y-2">
                    <p>
                      <Typewriter
                        key={`claude-1-${activeTab}`}
                        text={terminalContent[activeTab].claude[0]}
                        delay={20}
                        startDelay={1500}
                      />
                    </p>
                    <p className="text-white/40 italic">
                      <Typewriter
                        key={`claude-2-${activeTab}`}
                        text={terminalContent[activeTab].claude[1]}
                        delay={20}
                        startDelay={2500}
                      />
                    </p>
                    <p>
                      <Typewriter
                        key={`claude-3-${activeTab}`}
                        text={terminalContent[activeTab].claude[2]}
                        delay={20}
                        startDelay={3500}
                        onComplete={handleComplete}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
