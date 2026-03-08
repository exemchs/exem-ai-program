import { useState } from "react";
import { BookOpen, Zap, Layers } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import Typewriter from "../common/Typewriter";

const terminalContent = [
  {
    user: "어제 회의록 파일들 전부 읽고, 결정된 사항이랑 오늘 할 일만 뽑아서 markdown으로 정리해줘.",
    claude: [
      "네, 회의록을 분석하여 요약하겠습니다.",
      "Reading files...",
      "회의록 요약이 완료되었습니다. 결정 사항과 할 일을 markdown 파일로 저장했습니다.",
    ],
  },
  {
    user: "이번 주 주간 보고서 데이터를 분석해서 요약해줘.",
    claude: [
      "네, 주간 보고서 데이터를 분석하겠습니다.",
      "Analyzing data...",
      "분석이 완료되었습니다. 주요 지표 변화와 인사이트를 요약했습니다.",
    ],
  },
  {
    user: "매주 월요일마다 팀원들 주간보고를 수집해서, 부서별로 묶고 요약본을 만들어주는 자동화를 세팅해줘.",
    claude: [
      "네, 주간보고 자동화 파이프라인을 구성하겠습니다.",
      "Creating automation script...",
      "완료했습니다. 매주 월요일 팀원 보고서를 수집 → 부서별 분류 → 요약본 생성까지 자동 실행됩니다.",
    ],
  },
];

const tabs = [
  { title: "회의록 → 자동 요약", icon: <BookOpen size={18} /> },
  { title: "데이터 → 분석 리포트", icon: <Zap size={18} /> },
  { title: "반복 업무 → 자동화", icon: <Layers size={18} /> },
];

export default function WhatWeLearnSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-28 bg-[#fff3d7]/[0.03] border-y border-[#fff3d7]/[0.04]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading subtitle="What We Learn">
              우리가 배우는 건<br />
              코딩이 아닙니다
            </SectionHeading>
            <div className="space-y-6 mb-12">
              <p className="text-base text-[#fff3d7]/55 leading-relaxed">
                코드가 아니라, 일하는 방식을 바꾸는 겁니다.
              </p>
              <p className="text-base text-[#fff3d7]/55 leading-relaxed">
                하고 싶은 일을 말로 전하면 됩니다.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all text-left ${activeTab === idx ? "bg-[#d0f100]/10 border-[#d0f100]/30 text-[#d0f100]" : "bg-[#fff3d7]/[0.04] border-[#fff3d7]/[0.04] text-[#fff3d7]/55 hover:bg-[#fff3d7]/[0.06] hover:text-[#fff3d7]/70"}`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#d0f100]/20 to-transparent blur-3xl rounded-full"></div>
            <div className="relative rounded-2xl border border-[#fff3d7]/[0.08] bg-[#100d0a] overflow-hidden shadow-2xl h-[400px] flex flex-col terminal-window">
              <div className="h-10 border-b border-[#fff3d7]/[0.08] bg-[#fff3d7]/[0.06] flex items-center px-4 gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <div className="ml-4 text-xs font-mono text-[#fff3d7]/40">
                  claude-code
                </div>
              </div>
              <div className="p-6 font-mono text-sm overflow-y-auto flex-grow">
                <div className="flex gap-4 mb-4">
                  <span className="text-[#d0f100]">❯</span>
                  <span className="text-[#fff3d7]">claude</span>
                </div>
                <div className="text-[#fff3d7]/55 mb-6">
                  Welcome to Claude Code! I can help you write code, analyze
                  data, and automate tasks.
                </div>
                <div className="flex gap-4 mb-6">
                  <span className="text-blue-400 shrink-0">You:</span>
                  <span className="text-[#fff3d7]/70">
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
                  <div className="text-[#fff3d7]/70 space-y-2">
                    <p>
                      <Typewriter
                        key={`claude-1-${activeTab}`}
                        text={terminalContent[activeTab].claude[0]}
                        delay={20}
                        startDelay={1500}
                      />
                    </p>
                    <p className="text-[#fff3d7]/40 italic">
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
