import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Terminal,
  GitBranch,
  Play,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  Clock,
  BookOpen,
  Layers,
  Cpu,
  Monitor,
  Key,
  Apple,
  Sun,
  Moon,
} from "lucide-react";

const Typewriter = ({
  text,
  delay = 50,
  startDelay = 0,
}: {
  text: string;
  delay?: number;
  startDelay?: number;
  key?: string | number;
}) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timeout);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text, started]);

  return <span>{currentText}</span>;
};

function UnicornEmbed() {
  useEffect(() => {
    // Add global style to hide unicorn studio badge
    const style = document.createElement("style");
    style.innerHTML = `
      a[href*="unicorn.studio"] {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);

    // Load Unicorn Studio script
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.1/dist/unicornStudio.umd.js";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.UnicornStudio) {
        // @ts-ignore
        window.UnicornStudio.init();
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-60">
      <div
        style={{ width: "100%", height: "100%" }}
        data-us-project="wR7neCzxMdk6sttaOSHc"
      ></div>
    </div>
  );
}

const SectionHeading = ({
  children,
  subtitle,
  align = "left",
}: {
  children: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
}) => (
  <div
    className={`mb-16 md:mb-24 ${align === "center" ? "text-center flex flex-col items-center" : ""}`}
  >
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-orange-400 font-mono text-sm tracking-widest uppercase mb-4"
      >
        {subtitle}
      </motion.p>
    )}
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight"
    >
      {children}
    </motion.h2>
  </div>
);

export default function App() {
  const [os, setOs] = useState<"mac" | "win">("mac");
  const [activeDay, setActiveDay] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove("light-theme");
    } else {
      document.documentElement.classList.add("light-theme");
    }
  }, [isDarkMode]);

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-orange-500/30">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <UnicornEmbed />

        {/* Watermark Cover - Forced to cover the Unicorn Studio badge */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-[#0a0a0a] z-[999] pointer-events-none"></div>

        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 rounded-full bg-zinc-900/80 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-all backdrop-blur-sm shadow-xl"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-medium mb-8">
              <SparklesIcon size={14} />
              <span>EXEM Claude Code Class</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[1.1] mb-8">
              '나중에 해야지' 했던 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
                Claude Code,
              </span>
              <br />
              지금이 기회입니다.
            </h1>

            <p className="text-xl md:text-2xl text-white font-medium leading-relaxed max-w-2xl mx-auto">
              바빠서 미루게 되는 Claude Code, <br />
              지금 같이 해봅시다.
              <br />
              앱에서 채팅하던 때와는 차원이 다른 <br />
              결과물, 자동화가 실제로 가능해집니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Now Section */}
      <section id="why-now" className="py-32 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading subtitle="Why Now">
            왜 지금이 엑셈에서 Claude Code를
            <br />
            활용하기 최적의 타이밍인가?
          </SectionHeading>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Cpu size={24} />,
                title: "매일 기술을 만드는 사람들",
                desc: "2001년부터 DB, APM, 인프라 모니터링 소프트웨어를 직접 만들어 온 기술 기업. 새로운 도구를 가장 빠르게 익힐 수 있는 DNA를 가지고 있습니다.",
              },
              {
                icon: <Layers size={24} />,
                title: "앱 채팅을 넘어서는 시점",
                desc: "ChatGPT, Claude 앱 — 많은 분들이 써봤죠. 하지만 파일을 직접 만들고, 도구를 연결하고, 자동화까지 하는 건 다른 차원의 이야기입니다.",
              },
              {
                icon: <Clock size={24} />,
                title: "미루면 격차가 됩니다",
                desc: "'나중에 해야지'가 6개월 뒤에는 따라잡기 어려운 차이가 됩니다. 같이 시작하면 훨씬 쉽습니다.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:border-orange-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Learn */}
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
                {[
                  { title: "회의록 → 자동 요약", icon: <BookOpen size={18} /> },
                  { title: "데이터 → 분석 리포트", icon: <Zap size={18} /> },
                  { title: "반복 업무 → 자동화", icon: <Layers size={18} /> },
                ].map((tab, idx) => (
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

      {/* Prerequisites */}
      <section id="prerequisites" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-16 md:mb-24 gap-8">
            <SectionHeading subtitle="Prerequisites" align="center">
              간단한 사전 세팅
              <br />
              <span className="text-zinc-500 text-3xl md:text-4xl mt-2 block font-normal">
                딱 4가지만 준비하면 됩니다
              </span>
            </SectionHeading>

            <div className="flex items-center gap-2 p-1.5 rounded-full bg-zinc-900 border border-white/10 w-fit">
              <button
                onClick={() => setOs("mac")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${os === "mac" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white"}`}
              >
                <Apple size={16} /> macOS
              </button>
              <button
                onClick={() => setOs("win")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${os === "win" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white"}`}
              >
                <Monitor size={16} /> Windows
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {[
              {
                step: "①",
                title: "Cursor",
                icon: <Monitor size={20} />,
                desc: "Claude Code를 실행할 에디터입니다.",
                link: "https://cursor.sh",
                linkText: "cursor.sh에서 다운로드",
              },
              {
                step: "②",
                title: "Git",
                icon: <GitBranch size={20} />,
                desc: "교육 자료를 다운받는 도구입니다.",
                link:
                  os === "mac"
                    ? "https://git-scm.com/download/mac"
                    : "https://git-scm.com/download/win",
                linkText: "git-scm.com에서 다운로드",
              },
              {
                step: "③",
                title: "Node.js",
                icon: <Terminal size={20} />,
                desc: "Claude Code가 돌아가는 엔진입니다. (LTS 권장)",
                link: "https://nodejs.org",
                linkText: "nodejs.org에서 다운로드",
              },
              {
                step: "④",
                title: "Claude 계정",
                icon: <Key size={20} />,
                desc: "Pro($20/월) 이상 구독이 필요합니다.",
                link: "https://claude.ai",
                linkText: "claude.ai에서 가입",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:border-orange-500/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-orange-400">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    {item.title}
                  </h3>
                </div>
                <p className="text-zinc-400 mb-6 grow">{item.desc}</p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
                  {item.linkText} <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-12 text-center">
              5분이면 준비 끝
            </h3>

            <div className="space-y-6">
              {[
                {
                  title: "Cursor 설치",
                  desc: "Claude Code를 실행할 에디터입니다. 다운로드 후 설치를 완료하세요.",
                  code: null,
                  tip: "✓ 유료 결제는 걱정하지 마세요. 무료 버전으로 충분합니다.",
                  image: null,
                },
                {
                  title: "터미널 열기",
                  desc:
                    os === "mac"
                      ? "Cursor 안에서 터미널을 엽니다. (Cmd+J)"
                      : "Cursor 안에서 터미널을 엽니다. (Ctrl+J)",
                  code: null,
                  tip: "✓ 화면 하단에 검은 배경의 터미널 창이 뜨면 성공입니다.",
                  image: "/imgs/installation/step2.png",
                },
                {
                  title: "Git 설치 확인",
                  desc: "터미널에 아래 명령어를 입력해 Git이 설치되어 있는지 확인하세요.",
                  code: "git --version",
                  tip: "✓ git version 2.x.x 형식의 버전 번호가 뜨면 성공입니다.",
                  image: "/imgs/installation/step3.png",
                  imageOverlay: [
                    { top: "61.5%", left: "0%", width: "27%", height: "4%" },
                    { top: "66.5%", left: "0%", width: "27%", height: "4%" },
                  ],
                },
                {
                  title: "Node.js 설치 확인",
                  desc: "터미널에 아래 명령어를 입력해 Node.js가 설치되어 있는지 확인하세요.",
                  code: "node --version",
                  tip: "✓ v18.x.x 이상의 버전 번호가 뜨면 성공입니다.",
                  image: "/imgs/installation/step4.png",
                  imageOverlay: [
                    { top: "61.5%", left: "0%", width: "27%", height: "4%" },
                    { top: "66.5%", left: "0%", width: "27%", height: "4%" },
                    { top: "71.5%", left: "0%", width: "27%", height: "4%" },
                  ],
                },
                {
                  title: "Claude Code 설치",
                  desc: "터미널에 아래 명령어를 복사하여 붙여넣고 실행하세요.",
                  code: "npm install -g @anthropic-ai/claude-code",
                  tip: "✓ 1~2분 걸릴 수 있습니다. 화면에 텍스트가 쭉 지나가는 건 정상이에요.",
                  image: null,
                },
                {
                  title: "Claude 로그인",
                  desc: "터미널에 claude를 입력하면 브라우저가 열리며 로그인 화면이 나타납니다.",
                  code: "claude",
                  tip: "✓ Pro 계정으로 로그인 후 터미널로 돌아오면 준비 완료!",
                  image: null,
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 md:p-8 rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col md:flex-row gap-6 items-start group hover:border-orange-500/30 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/10 text-orange-400 font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-grow w-full overflow-hidden">
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {step.title}
                    </h4>
                    <p className="text-zinc-400 mb-4">{step.desc}</p>

                    {step.image && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-white/10 bg-zinc-800/50 relative">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity"
                          referrerPolicy="no-referrer"
                        />
                        {/* @ts-ignore */}
                        {step.imageOverlay &&
                          step.imageOverlay.map((overlay, idx) => (
                            <div
                              key={idx}
                              className="absolute bg-[#181818] z-10"
                              style={{
                                top: overlay.top,
                                left: overlay.left,
                                width: overlay.width,
                                height: overlay.height,
                              }}
                            />
                          ))}
                      </div>
                    )}

                    {step.code && (
                      <div className="mb-4 rounded-xl bg-black border border-white/10 overflow-hidden">
                        <div className="flex items-center px-4 py-2 bg-zinc-900 border-b border-white/10 text-xs text-zinc-500 font-mono">
                          Terminal
                        </div>
                        <div className="p-4 font-mono text-sm text-zinc-300 flex items-center gap-3 overflow-x-auto">
                          <span className="text-orange-400 shrink-0">❯</span>
                          <code className="whitespace-nowrap">{step.code}</code>
                        </div>
                      </div>
                    )}

                    {step.tip && (
                      <div className="flex items-start gap-2 text-sm text-green-400 bg-green-400/10 px-4 py-3 rounded-lg">
                        <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                        <span>{step.tip}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-xl font-semibold text-white">
                설치 과정이 막막하거나, 어렵게 느껴진다면 Claude에게 물어보세요.
                <br />
                AI는 AI가 제일 잘 아니까요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section
        id="curriculum"
        className="py-32 bg-zinc-900/30 border-y border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading subtitle="Curriculum">
            하루 1시간씩,
            <br />딱 5일이면 충분합니다
          </SectionHeading>

          <div className="flex flex-col md:flex-row gap-4 h-[500px]">
            {[
              {
                day: 1,
                title: "기본기 마스터",
                desc: "Claude Code와 인사하고, 첫 번째 자동화 스크립트를 만들어봅니다.",
                topics: [
                  "AI에게 잘 시키는 법",
                  "왜 Claude인가",
                  "첫 번째 자동화 스크립트",
                ],
              },
              {
                day: 2,
                title: "파일 다루기",
                desc: "여러 파일을 동시에 수정하고, 프로젝트 구조를 이해하는 방법을 배웁니다.",
                topics: [
                  "프로젝트 구조 파악",
                  "다중 파일 동시 수정",
                  "코드 리팩토링 기초",
                ],
              },
              {
                day: 3,
                title: "도구 연결하기",
                desc: "MCP를 활용해 외부 도구(Slack, Notion 등)와 연동하는 방법을 익힙니다.",
                topics: [
                  "MCP 개념 이해",
                  "외부 API 연동",
                  "데이터 가져오기 및 가공",
                ],
              },
              {
                day: 4,
                title: "나만의 Skill",
                desc: "자주 쓰는 명령어를 커스텀 Skill로 만들어 업무 효율을 극대화합니다.",
                topics: [
                  "커스텀 Skill 제작",
                  "반복 업무 자동화",
                  "나만의 명령어 세팅",
                ],
              },
              {
                day: 5,
                title: "실전 프로젝트",
                desc: "배운 내용을 종합하여 나만의 자동화 파이프라인을 완성합니다.",
                topics: [
                  "실전 파이프라인 구축",
                  "에러 핸들링",
                  "과정 수료 및 졸업",
                ],
              },
            ].map((item) => (
              <div
                key={item.day}
                onMouseEnter={() => setActiveDay(item.day)}
                onClick={() => setActiveDay(item.day)}
                className={`relative overflow-hidden rounded-3xl border border-white/5 transition-all duration-500 ease-in-out cursor-pointer flex flex-col justify-end p-8 ${activeDay === item.day ? "flex-[3] bg-zinc-800" : "flex-[1] bg-black hover:bg-zinc-900"}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 ${activeDay === item.day ? "opacity-100" : "opacity-0"}`}
                ></div>
                {activeDay === item.day && (
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity duration-500"></div>
                )}

                <div className="relative z-20">
                  <h3
                    className={`font-bold text-white transition-all duration-500 ${activeDay === item.day ? "text-5xl mb-6" : "text-3xl mb-2"}`}
                  >
                    Day {item.day}
                  </h3>
                  <div
                    className={`overflow-hidden transition-all duration-500 ${activeDay === item.day ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <h4 className="font-semibold text-white text-xl mb-3">
                      {item.title}
                    </h4>
                    <p className="text-zinc-300 leading-relaxed mb-4">
                      {item.desc}
                    </p>
                    <ul className="space-y-2">
                      {item.topics.map((topic, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm text-zinc-400"
                        >
                          <CheckCircle2 size={14} className="text-orange-400" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shortcuts */}
      <section className="py-32 bg-zinc-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading subtitle="Shortcuts" align="center">
            Claude Code 핵심 단축키
          </SectionHeading>

          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-4">
            {[
              { key: "Shift + Tab", desc: "플랜 모드, 실행 모드 등 모드 전환" },
              { key: "/", desc: "명령어 자동완성 및 커맨드별 설명 미리보기" },
              { key: "/clear", desc: "현재 대화 내용 지우기" },
              { key: "/compact", desc: "컨텍스트 압축하여 메모리 확보" },
              { key: "Ctrl + C", desc: "현재 진행 중인 작업 취소" },
              { key: "/cost", desc: "현재까지 사용한 토큰 비용 확인" },
            ].map((shortcut, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-6 rounded-2xl bg-black border border-white/5 hover:border-orange-500/30 transition-colors"
              >
                <span className="text-zinc-400">{shortcut.desc}</span>
                <kbd className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-orange-400 font-mono text-sm shadow-sm">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One More Thing */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading subtitle="One More Thing">
            앞으로 이런 것들도
            <br />
            도전해보세요
          </SectionHeading>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-zinc-900 border border-white/5">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 mb-6">
                <Layers size={24} />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                에이전트 팀 만들기
              </h3>
              <p className="text-zinc-400 mb-6">
                Claude Code를 여러 개 동시에 실행해서 각각 다른 역할을 맡기세요.
                하나는 리서치, 하나는 문서 작성, 하나는 검증 — 마치 팀처럼
                협업합니다.
              </p>
              <div className="p-4 rounded-xl bg-black border border-white/5 font-mono text-sm text-zinc-300">
                <span className="text-zinc-500"># 팁: 각각 다른 규칙 설정</span>
                <br />
                CLAUDE.md
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900 border border-white/5">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                나만의 자동화 파이프라인
              </h3>
              <p className="text-zinc-400 mb-6">
                Skill + MCP + CLAUDE.md를 조합해서 완전 자동화 워크플로우를
                만드세요. 예: 매주 월요일 Notion에서 주간 업무 → 자동 보고서
                생성.
              </p>
              <a
                href="https://github.com/modelcontextprotocol/servers"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                MCP 서버 목록 보기 <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="py-24 bg-orange-500/5 border-y border-orange-500/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <AlertCircle className="text-orange-400" size={32} />
            <h2 className="text-3xl font-semibold text-white">
              잠시 멈추고 싶다면
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-black/50 border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Play size={18} className="text-green-400" /> 다시 시작할 때
              </h3>
              <ol className="list-decimal list-inside text-zinc-400 space-y-2">
                <li>Cursor 실행</li>
                <li>
                  File → Open Folder →{" "}
                  <code className="text-orange-300 bg-orange-500/10 px-1.5 py-0.5 rounded">
                    exem-ai-curriculum-program
                  </code>
                </li>
                <li>Cmd+J / Ctrl+J 터미널 열기</li>
                <li>
                  <code className="text-orange-300 bg-orange-500/10 px-1.5 py-0.5 rounded">
                    claude
                  </code>{" "}
                  입력
                </li>
                <li>"이어서 해줘" 또는 /(원하는 day) 입력</li>
              </ol>
            </div>

            <div className="p-6 rounded-2xl bg-black/50 border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-400" /> 이어하기가 안
                될 때
              </h3>
              <p className="text-zinc-400 mb-4">
                증상:{" "}
                <code className="text-red-300 bg-red-500/10 px-1.5 py-0.5 rounded">
                  command not found: claude
                </code>
              </p>
              <p className="text-sm text-zinc-500 mb-4">
                Cursor에서 새 터미널을 열면 발생할 수 있어요.
              </p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2">
                <li>
                  방법 1: {os === "mac" ? "macOS라면" : "Windows라면"}{" "}
                  <code className="text-orange-300 bg-orange-500/10 px-1.5 py-0.5 rounded">
                    {os === "mac" ? "source ~/.zshrc" : "source ~/.bashrc"}
                  </code>{" "}
                  또는 터미널 재시작
                </li>
                <li>방법 2: Claude Code 재설치</li>
                <li>
                  방법 3: Cursor를 완전히 종료(Cmd+Q / Alt+F4) 후 다시 실행
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-zinc-900/30 border-y border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeading subtitle="FAQ" align="center">
            자주 묻는 질문
          </SectionHeading>

          <div className="space-y-4 mt-12">
            {[
              {
                q: "결제가 필요한가요?",
                a: "Cursor 에디터는 무료 플랜으로 충분합니다. 단, Claude Code를 사용하기 위해서는 Claude Pro($20/월) 구독이 필수적으로 필요합니다.",
              },
              {
                q: "코딩을 전혀 모르는데 괜찮을까요?",
                a: "네, 코딩 지식이 없어도 한국어로 대화하며 진행할 수 있도록 커리큘럼이 구성되어 있습니다. AI가 코드를 작성하고 실행하는 과정을 자연스럽게 익히게 됩니다.",
              },
              {
                q: "중간에 막히면 어떻게 하나요?",
                a: "에러 메시지를 그대로 복사해서 Claude에게 물어보면 대부분 해결 방법을 알려줍니다. 그래도 해결이 어렵다면 조현서 그룹장에게 문의하시거나 추가 팁 블로그를 참고해주세요.",
              },
              {
                q: "Windows 환경에서도 똑같이 되나요?",
                a: "네, 가능합니다. 다만 터미널 환경이 조금 다를 수 있어, 본 페이지의 '간단한 사전 세팅'에서 Windows 탭을 선택하여 안내된 주의사항을 꼭 확인해주세요.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group p-6 rounded-2xl bg-black border border-white/5 open:border-orange-500/30 transition-colors cursor-pointer"
              >
                <summary className="text-lg font-semibold text-white flex justify-between items-center list-none outline-none">
                  {faq.q}
                  <span className="text-orange-400 group-open:rotate-45 transition-transform duration-300 text-2xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-zinc-400 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="https://blog.huns.site/blog/posts/ai/claude"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 transition-all"
            >
              더 많은 팁 보기 (blog.huns.site) <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-900/20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8">
            엑셈의 내일은,
            <br />
            오늘 시작됩니다.
          </h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            처음은 원래 어렵고 막막합니다.
            <br />
            하지만 일단 시작할 때 진짜 변화가 만들어집니다.
          </p>
          <a
            href="#prerequisites"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(249,115,22,0.3)]"
          >
            지금 바로 시작하기
          </a>

          <div className="mt-32 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <div>© 2026 EXEM · Claude Code AI Training</div>
            <div className="flex items-center gap-6">
              <span>피드백/오류 보고 → 조현서 그룹장</span>
              <a
                href="https://blog.huns.site/blog/posts/ai/claude"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                추가 팁 → blog.huns.site
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
