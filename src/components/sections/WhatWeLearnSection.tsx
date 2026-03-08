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
    user: "src 폴더 안에 있는 모든 컴포넌트 파일에 주석 달아주고, 테스트 코드도 짜줘.",
    claude: [
      "네, 반복 업무 자동화를 시작하겠습니다.",
      "Modifying files...",
      "작업이 완료되었습니다. 모든 컴포넌트에 주석을 추가하고 테스트 코드를 생성했습니다.",
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
    <section className="py-32 bg-zinc-900/30 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading subtitle="What We Learn">
              우리가 배우는 건<br />
              코딩이 아닙니다
            </SectionHeading>
            <div className="space-y-6 mb-12">
              <p className="text-xl text-zinc-400 leading-relaxed">
                AI가{" "}
                <strong className="text-orange-500 font-bold">
                  내 생각대로
                </strong>{" "}
                계획을 세우고, 자료를 분석하고, 일할 수 있도록 시스템을 만드는
                법을 배웁니다.
              </p>
              <p className="text-xl text-zinc-400 leading-relaxed">
                코드를 직접 작성하는 게 아닙니다. 한국어로 원하는 걸 말하면,
                Claude Code가 계획을 세우고 실행합니다.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all text-left ${activeTab === idx ? "bg-orange-500/10 border-orange-500/30 text-orange-400" : "bg-zinc-900/50 border-white/5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300"}`}
                >
                  {tab.icon}
                  <span className="font-semibold">{tab.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent blur-3xl rounded-full"></div>
            <div className="relative rounded-2xl border border-white/10 bg-black overflow-hidden shadow-2xl h-[400px] flex flex-col terminal-window">
              <div className="h-10 border-b border-white/10 bg-zinc-900 flex items-center px-4 gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <div className="ml-4 text-xs font-mono text-zinc-500">
                  claude-code
                </div>
              </div>
              <div className="p-6 font-mono text-sm overflow-y-auto flex-grow">
                <div className="flex gap-4 mb-4">
                  <span className="text-orange-400">❯</span>
                  <span className="text-white">claude</span>
                </div>
                <div className="text-zinc-400 mb-6">
                  Welcome to Claude Code! I can help you write code, analyze
                  data, and automate tasks.
                </div>
                <div className="flex gap-4 mb-6">
                  <span className="text-blue-400 shrink-0">You:</span>
                  <span className="text-zinc-300">
                    <Typewriter
                      key={`user-${activeTab}`}
                      text={terminalContent[activeTab].user}
                      delay={30}
                      startDelay={100}
                    />
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="text-orange-400 shrink-0">Claude:</span>
                  <div className="text-zinc-300 space-y-2">
                    <p>
                      <Typewriter
                        key={`claude-1-${activeTab}`}
                        text={terminalContent[activeTab].claude[0]}
                        delay={20}
                        startDelay={1500}
                      />
                    </p>
                    <p className="text-zinc-500 italic">
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
