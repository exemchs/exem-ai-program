import { useState, useEffect, useCallback, useRef } from "react";
import { ExternalLink, X } from "lucide-react";
import Typewriter from "../common/Typewriter";

type Line = { type: string; text: string | string[] };

const days: {
  day: number;
  label: string;
  title: string;
  command: string;
  lines: Line[];
}[] = [
  {
    day: 0,
    label: "Intro",
    title: "오리엔테이션",
    command: "안녕",
    lines: [
      { type: "ascii-line", text: "███████╗██╗  ██╗███████╗███╗   ███╗" },
      { type: "ascii-line", text: "██╔════╝╚██╗██╔╝██╔════╝████╗ ████║" },
      { type: "ascii-line", text: "█████╗   ╚███╔╝ █████╗  ██╔████╔██║" },
      { type: "ascii-line", text: "██╔══╝   ██╔██╗ ██╔══╝  ██║╚██╔╝██║" },
      { type: "ascii-line", text: "███████╗██╔╝ ██╗███████╗██║ ╚═╝ ██║" },
      { type: "ascii-line", text: "╚══════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝" },
      { type: "ascii-line", text: "  C l a u d e   C o d e   T r a i n i n g" },
      { type: "text", text: "" },
      { type: "dim", text: "이 프로그램은 EXEM 내부 구성원을 위해 설계된" },
      { type: "dim", text: "Claude Code 학습 커리큘럼입니다." },
      { type: "text", text: "" },
      { type: "meta", text: "설계: 조현서, CX그룹장 @ EXEM" },
      { type: "meta", text: "기준일: 2026.03.03" },
      { type: "text", text: "" },
      { type: "quote", text: "\"Claude Code 팀에서는 모두가 코딩합니다. PM도, 디자이너도, 매니저도.\"" },
      { type: "author", text: "— Boris Cherny, Claude Code 창시자" },
    ],
  },
  {
    day: 1,
    label: "Day 1",
    title: "AI를 잘 시키는 법",
    command: "/day1",
    lines: [
      { type: "banner", text: "D A Y  1 :  A I 에 게  잘  시 키 는  법" },
      { type: "text", text: "" },
      { type: "quote", text: "\"프롬프트 엔지니어링보다 '컨텍스트 엔지니어링'이라는 말이 더 정확합니다.\"" },
      { type: "author", text: "— Tobi Lutke, Shopify CEO" },
      { type: "text", text: "" },
      { type: "section", text: "[1] 왜 Claude Code인가" },
      { type: "divider", text: "" },
      { type: "text", text: "" },
      { type: "dim", text: "웹 AI도 MCP, 파일 업로드, 코드 실행 다 됩니다. 솔직히." },
      { type: "dim", text: "그럼에도 Claude Code를 쓰는 이유:" },
      { type: "text", text: "" },
      { type: "table-header", text: "  웹 AI                     Claude Code" },
      { type: "table-row", text: "  대화할 때만 똑똑함          세팅이 쌓일수록 똑똑해짐" },
      { type: "table-row", text: "  매번 비슷한 요청 반복       /명령어 한마디로 끝" },
      { type: "table-row", text: "  내 맥락을 매번 설명          CLAUDE.md에 저장해두면 기억" },
      { type: "table-row", text: "  다른 사람의 노하우 못 씀    플러그인으로 가져다 쓸 수 있음" },
      { type: "text", text: "" },
      { type: "dim", text: "🌐 웹 AI = 똑똑한 프리랜서 — 매번 새로 브리핑" },
      { type: "dim", text: "💻 Claude Code = 내 세팅이 된 AI — 내 규칙과 습관이 저장" },
      { type: "text", text: "" },
      { type: "highlight", text: "더 똑똑한 AI가 아니라, 내 맥락이 쌓이는 AI. 이것이 차이." },
      { type: "progress", text: "██░░░░░░░░ 20%" },
    ],
  },
  {
    day: 2,
    label: "Day 2",
    title: "내 업무를 AI로 해보기",
    command: "/day2",
    lines: [
      { type: "banner", text: "D A Y  2 :  내  업 무 를  A I 로  해 보 기" },
      { type: "text", text: "" },
      { type: "quote", text: "\"'좋은 결과'가 어떤 모습인지 알고, AI도 이해할 수 있을 만큼 명확하게" },
      { type: "quote", text: " 설명할 수 있는 사람이 살아남을 겁니다.\"" },
      { type: "author", text: "— Ethan Mollick, Wharton 교수" },
      { type: "text", text: "" },
      { type: "section", text: "[1] 위임의 기술" },
      { type: "divider", text: "" },
      { type: "text", text: "" },
      { type: "dim", text: "\"AI 시대에 결국 소프트 스킬이 하드 스킬이었다.\"" },
      { type: "dim", text: "업무를 맡기고, 확인하고, 피드백하는 능력이 핵심입니다." },
      { type: "text", text: "" },
      { type: "table-header", text: "  업무 3분류" },
      { type: "table-row", text: "  🙋 Just Me    — 나만 할 수 있는 것 (판단, 소통, 의사결정)" },
      { type: "table-row", text: "  🤝 Delegate   — AI에게 맡기고 내가 확인 (초안, 리서치, 요약)" },
      { type: "table-row", text: "  🤖 Automate   — AI가 알아서 반복 실행 (형식 변환, 템플릿)" },
      { type: "text", text: "" },
      { type: "highlight", text: "좋은 매니저 = 좋은 AI 사용자. 명확한 기대치, 적절한 배분, 결과 확인." },
      { type: "progress", text: "███░░░░░░░ 33%" },
    ],
  },
  {
    day: 3,
    label: "Day 3",
    title: "AI 확장하기",
    command: "/day3",
    lines: [
      { type: "banner", text: "D A Y  3 :  A I  확 장 하 기  —  M C P  +  생 태 계" },
      { type: "text", text: "" },
      { type: "quote", text: "\"아무리 뛰어난 AI도 데이터에서 고립되면 무력합니다.\"" },
      { type: "author", text: "— Anthropic, MCP 발표문" },
      { type: "text", text: "" },
      { type: "section", text: "[1] MCP 개념 + Skill & 플러그인" },
      { type: "divider", text: "" },
      { type: "text", text: "" },
      { type: "dim", text: "MCP = AI에 도구를 연결하는 표준 규격 (웹 AI에서도 지원)" },
      { type: "dim", text: "Skill = 반복 업무를 /명령어로 자동화" },
      { type: "dim", text: "플러그인 = 다른 사람이 만든 워크플로우를 가져다 쓰는 것" },
      { type: "text", text: "" },
      { type: "table-header", text: "  📱 앱스토어에서 앱 설치      🔌 Claude Code에 플러그인 설치" },
      { type: "table-row", text: "  다른 사람이 만든 앱           다른 사람이 만든 워크플로우" },
      { type: "table-row", text: "  설치하면 바로 사용            /명령어로 바로 사용" },
      { type: "table-row", text: "  내가 만들 필요 없음           내가 만들 필요 없음" },
      { type: "text", text: "" },
      { type: "highlight", text: "세팅이 쌓일수록 AI가 똑똑해진다. 이것이 웹 AI와의 차이." },
      { type: "progress", text: "███░░░░░░░ 33%" },
    ],
  },
  {
    day: 4,
    label: "Day 4",
    title: "자동화하기",
    command: "/day4",
    lines: [
      { type: "banner", text: "D A Y  4 :  자 동 화 하 기  —  S k i l l  +  검 증" },
      { type: "text", text: "" },
      { type: "quote", text: "\"Claude에게 스스로 검증할 수단을 주면 품질이 2~3배 올라갑니다.\"" },
      { type: "author", text: "— Boris Cherny, Claude Code 창시자" },
      { type: "text", text: "" },
      { type: "section", text: "[1] Skill이란" },
      { type: "divider", text: "" },
      { type: "text", text: "" },
      { type: "dim", text: "Skill은 반복 업무를 /명령어로 저장하는 것입니다." },
      { type: "text", text: "" },
      { type: "table-header", text: "  🍳 레시피 없을 때            📖 레시피 있을 때" },
      { type: "table-row", text: "  매번 처음부터 설명            한마디로 끝" },
      { type: "table-row", text: "  매번 형식을 지정              저장된 형식대로 자동" },
      { type: "table-row", text: "  사람마다 결과가 다름           누가 해도 같은 품질" },
      { type: "text", text: "" },
      { type: "dim", text: "사실 여러분은 이미 Skill을 체험하고 있습니다!" },
      { type: "dim", text: "/day4를 입력한 것 자체가 Skill 호출입니다." },
      { type: "text", text: "" },
      { type: "highlight", text: "매일 반복하는 워크플로우에 /명령어를 쓴다. — Boris Cherny" },
      { type: "progress", text: "███░░░░░░░ 33%" },
    ],
  },
  {
    day: 5,
    label: "Day 5",
    title: "졸업",
    command: "/day5",
    lines: [
      { type: "banner", text: "D A Y  5 :  졸  업" },
      { type: "text", text: "" },
      { type: "quote", text: "\"'소프트웨어 엔지니어'라는 직함은 사라지기 시작할 겁니다." },
      { type: "quote", text: " '빌더'로 대체될 거예요.\"" },
      { type: "author", text: "— Boris Cherny, Claude Code 창시자" },
      { type: "text", text: "" },
      { type: "section", text: "[1] 5일간 배운 것 정리" },
      { type: "divider", text: "" },
      { type: "text", text: "" },
      { type: "dim", text: "5일 동안 하나씩 쌓아온 시스템을 돌아봅시다." },
      { type: "text", text: "" },
      { type: "table-header", text: "  내가 만든 것들" },
      { type: "table-row", text: "  📄 CLAUDE.md     → 내 비서의 업무 매뉴얼 (영구 기억)" },
      { type: "table-row", text: "  🔗 MCP 연결       → AI에게 눈과 손 (외부 도구 접근)" },
      { type: "table-row", text: "  ⚡ Skill          → 반복 업무 자동화 (/명령어)" },
      { type: "table-row", text: "  🔍 검증 루프       → AI가 스스로 품질을 확인" },
      { type: "text", text: "" },
      { type: "highlight", text: "\"프롬프트를 잘 쓰는 사람\"이 아니라 \"컨텍스트를 설계하는 사람\"" },
      { type: "progress", text: "███░░░░░░░ 33%" },
    ],
  },
];

const faqItems = [
  {
    q: "이 프로그램은 왜 만들었나요?",
    a: "Claude Code가 어렵게만 느껴지는 엑셈 구성원(비전공자) 대상으로 난이도를 낮춰 구성했습니다.",
  },
  {
    q: "커리큘럼은 어떻게 만들어졌나요?",
    a: "Claude Code 교육 오픈소스를 참조하여 EXEM 업무 환경에 맞게 재구성했습니다.",
  },
  {
    q: "오류를 발견하면?",
    a: "조현서 그룹장에게 보고해 주세요.",
  },
];

const references = [
  {
    title: "Anthropic 해커톤 우승자가 공유한 Claude Code 실전 팁 70가지",
    source: "요즘IT",
    url: "https://yozm.wishket.com/magazine/detail/3607",
    tags: ["실전 팁", "프롬프트", "워크플로우"],
  },
  {
    title: "30가지 이상의 Claude Code 활용 팁 모음",
    source: "PyTorch 한국 커뮤니티",
    url: "https://discuss.pytorch.kr/t/30-claude-code-feat-ykdojo-claude-code-tips/8368",
    tags: ["팁 모음", "Git 자동화", "환경 설정"],
  },
  {
    title: "갓대희의 작은공간 - Claude Code 시리즈",
    source: "갓대희의 작은공간",
    url: "https://goddaehee.tistory.com/category/AI/Claude",
    tags: ["CLAUDE.md", "메모리", "Skills"],
  },
  {
    title: "Claude Code 고수들은 이렇게 쓴다: 생산성 극대화 꿀팁 모음",
    source: "훈스로그",
    url: "https://blog.huns.site/blog/posts/ai/claude",
    tags: ["고급 기능", "Hooks", "토큰 관리"],
  },
];

function TerminalLine({ line }: { line: Line }) {
  switch (line.type) {
    case "ascii-line":
      return (
        <pre className="text-[#3B82F6] text-[9px] sm:text-[10px] md:text-xs leading-none text-center select-none m-0">
          {line.text as string}
        </pre>
      );
    case "banner":
      return (
        <div className="text-center py-1">
          <p className="text-[#3B82F6] text-[10px] md:text-xs tracking-[0.2em] overflow-hidden">{"═".repeat(48)}</p>
          <p className="text-white text-[10px] md:text-sm tracking-widest my-1.5">{line.text as string}</p>
          <p className="text-[#3B82F6] text-[10px] md:text-xs tracking-[0.2em] overflow-hidden">{"═".repeat(48)}</p>
        </div>
      );
    case "quote":
      return <p className="text-white/50 text-xs md:text-sm italic leading-relaxed">{line.text as string}</p>;
    case "author":
      return <p className="text-white/30 text-xs mb-1">{line.text as string}</p>;
    case "dim":
      return <p className="text-white/40 text-xs md:text-sm">{line.text as string}</p>;
    case "meta":
      return <p className="text-[#d0f100]/60 text-xs">{line.text as string}</p>;
    case "section":
      return <p className="text-[#d0f100] text-xs md:text-sm font-bold">{line.text as string}</p>;
    case "divider":
      return <p className="text-[#3B82F6]/40 text-[10px] md:text-xs overflow-hidden">{"═".repeat(36)}</p>;
    case "table-header":
      return <p className="text-white/60 text-[10px] md:text-xs font-mono whitespace-pre">{line.text as string}</p>;
    case "table-row":
      return <p className="text-white/35 text-[10px] md:text-xs font-mono whitespace-pre">{line.text as string}</p>;
    case "highlight":
      return <p className="text-[#d0f100]/80 text-xs md:text-sm">{line.text as string}</p>;
    case "block":
      return <p className="text-white/50 text-xs md:text-sm pl-2">{line.text as string}</p>;
    case "progress":
      return <p className="text-white/20 text-xs font-mono">{line.text as string}</p>;
    case "text":
      return <div className="h-2" />;
    default:
      return null;
  }
}

export default function CurriculumSection() {
  const [activeDay, setActiveDay] = useState(0);
  const [phase, setPhase] = useState<"idle" | "typing" | "streaming" | "done">("idle");
  const [visibleLines, setVisibleLines] = useState(0);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [guideTab, setGuideTab] = useState<"beginner" | "tips" | "faq">("beginner");
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const current = days[activeDay];

  // Start animation when terminal enters viewport
  useEffect(() => {
    const el = terminalRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasEnteredView) {
          setHasEnteredView(true);
          setPhase("typing");
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasEnteredView]);

  const handleCommandDone = useCallback(() => {
    setPhase("streaming");
  }, []);

  // Stream lines one by one
  useEffect(() => {
    if (phase !== "streaming") return;
    if (visibleLines >= current.lines.length) {
      setPhase("done");
      return;
    }
    const lineType = current.lines[visibleLines]?.type;
    const delay =
      lineType === "text" ? 60 :
      lineType === "ascii-line" ? 100 :
      lineType === "table-row" ? 150 :
      lineType === "divider" ? 80 :
      lineType === "highlight" ? 200 : 120;
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), delay);
    return () => clearTimeout(timer);
  }, [phase, visibleLines, current.lines]);

  // Auto-advance to next day after done
  useEffect(() => {
    if (phase !== "done") return;
    const timer = setTimeout(() => {
      setActiveDay((prev) => (prev + 1) % days.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Reset on day tab change (but only trigger if already viewed)
  useEffect(() => {
    if (!hasEnteredView) return;
    setPhase("typing");
    setVisibleLines(0);
  }, [activeDay]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      id="curriculum"
      style={{
        background:
          "linear-gradient(180deg, #F8F9FC 0%, #C8E4FA 5%, #4DB4F0 12%, #1A8FE8 18%, #0B6BD4 25%, #0545A0 33%, #052454 42%, #041838 52%, #031027 65%, #020B1A 80%, #020B1A 100%)",
      }}
    >
      <div className="pt-16 md:pt-28 pb-12 md:pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-white/70 mb-2">
              엑셈 구성원을 위한
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white tracking-tight">
              클로드 코드 기초 교육
            </h2>
          </div>

          {/* Day tabs */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 overflow-x-auto">
              {days.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setActiveDay(d.day)}
                  className={`px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm font-normal whitespace-nowrap transition-all cursor-pointer ${
                    activeDay === d.day
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-white/35 hover:text-white/60"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal mockup */}
          <div className="max-w-3xl mx-auto" ref={terminalRef}>
            <div className="rounded-2xl border border-white/10 bg-[#0d0d1a] overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.08)] cursor-pointer" onClick={() => setShowGuide(true)}>
              <div className="h-10 md:h-11 border-b border-white/10 bg-white/[0.03] flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                <span className="ml-3 text-xs font-mono text-white/30">claude-code</span>
              </div>

              <div className="p-5 md:p-8 font-mono text-sm min-h-[400px] md:min-h-[480px]">
                {/* Command input with typewriter */}
                <div className="flex gap-3 mb-4">
                  <span className="text-[#d0f100] shrink-0">{"❯"}</span>
                  {phase !== "idle" && (
                    <span className="text-white/70">
                      <Typewriter
                        key={`cmd-${activeDay}`}
                        text={current.command}
                        delay={80}
                        startDelay={300}
                        onComplete={handleCommandDone}
                      />
                    </span>
                  )}
                  {(phase === "idle" || phase === "typing") && (
                    <span className="inline-block w-2 h-4 bg-white/50 animate-pulse self-center"></span>
                  )}
                </div>

                {/* Streamed output lines */}
                <div className="space-y-0.5">
                  {current.lines.slice(0, visibleLines).map((line, idx) => (
                    <div
                      key={`${activeDay}-${idx}`}
                      className="animate-[fadeSlideIn_0.15s_ease-out]"
                    >
                      <TerminalLine line={line} />
                    </div>
                  ))}
                </div>

                {/* Blinking cursor */}
                {phase !== "typing" && (
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-[#d0f100] text-xs">{"❯"}</span>
                    <span className="inline-block w-2 h-4 bg-white/50 animate-pulse"></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-16 text-center">
            <button
              onClick={() => setShowGuide(true)}
              className="inline-flex items-center gap-2 px-10 py-3 rounded-full bg-[#d0f100] text-[#100d0a] font-normal text-base hover:bg-[#e8ff6b] transition-colors shadow-[0_0_40px_rgba(208,241,0,0.3)] cursor-pointer"
            >
              교육 시작하기
            </button>
          </div>

          {showGuide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowGuide(false)}>
              <div className="relative bg-[#0A1628] rounded-2xl p-8 max-w-lg w-full mx-6 shadow-2xl border border-white/10 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowGuide(false)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
                <h3 className="text-xl font-normal text-white text-center mb-6">교육 시작하기</h3>

                <div className="flex justify-center mb-6">
                  <div className="flex p-1 rounded-lg bg-white/5 border border-white/10">
                    <button
                      onClick={() => setGuideTab("beginner")}
                      className={`px-5 py-2 rounded-md text-sm transition-all ${guideTab === "beginner" ? "bg-white/15 text-white shadow-sm" : "text-white/40 hover:text-white/70"}`}
                    >
                      설치 방법
                    </button>
                    <button
                      onClick={() => setGuideTab("tips")}
                      className={`px-5 py-2 rounded-md text-sm transition-all ${guideTab === "tips" ? "bg-white/15 text-white shadow-sm" : "text-white/40 hover:text-white/70"}`}
                    >
                      추가 팁
                    </button>
                    <button
                      onClick={() => setGuideTab("faq")}
                      className={`px-5 py-2 rounded-md text-sm transition-all ${guideTab === "faq" ? "bg-white/15 text-white shadow-sm" : "text-white/40 hover:text-white/70"}`}
                    >
                      FAQ
                    </button>
                  </div>
                </div>

                {guideTab === "beginner" ? (
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#d0f100] text-[#100d0a] text-sm font-normal shrink-0 mt-0.5">1</span>
                      <div>
                        <p className="text-white/80 text-sm mb-2">아래 버튼을 눌러 GitHub 페이지에 접속합니다</p>
                        <a
                          href="https://github.com/exemchs/exem-ai-curriculum-program"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-colors no-underline"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                          GitHub 페이지 열기
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#d0f100] text-[#100d0a] text-sm font-normal shrink-0 mt-0.5">2</span>
                      <div>
                        <p className="text-white/80 text-sm">초록색 <code className="text-[#d0f100] bg-white/10 px-1.5 py-0.5 rounded text-xs">&lt;&gt; Code</code> 버튼 → <code className="text-[#d0f100] bg-white/10 px-1.5 py-0.5 rounded text-xs">Download ZIP</code> 클릭</p>
                        <p className="text-white/40 text-xs mt-1">다운로드된 ZIP 파일의 압축을 해제합니다</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#d0f100] text-[#100d0a] text-sm font-normal shrink-0 mt-0.5">3</span>
                      <p className="text-white/80 text-sm">Cursor에서 <code className="text-[#d0f100] bg-white/10 px-1.5 py-0.5 rounded text-xs">File → Open Folder</code> → 압축 해제한 폴더 선택</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#d0f100] text-[#100d0a] text-sm font-normal shrink-0 mt-0.5">4</span>
                      <p className="text-white/80 text-sm">터미널을 열고 <code className="text-[#d0f100] bg-white/10 px-1.5 py-0.5 rounded text-xs">claude</code> 입력 후, <code className="text-[#d0f100] bg-white/10 px-1.5 py-0.5 rounded text-xs">안녕</code> 또는 <code className="text-[#d0f100] bg-white/10 px-1.5 py-0.5 rounded text-xs">/day0</code> 입력하면 시작!</p>
                    </div>
                  </div>
                ) : guideTab === "tips" ? (
                  <div className="space-y-3">
                    {references.map((ref, i) => (
                      <a
                        key={i}
                        href={ref.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all no-underline"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="text-white/80 text-sm font-normal">{ref.title}</p>
                          <ExternalLink size={14} className="text-white/30 shrink-0 mt-0.5" />
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-white/30 text-xs mr-1">{ref.source}</span>
                          {ref.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-white/30 text-xs whitespace-nowrap">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {faqItems.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => setFaqOpenIdx(faqOpenIdx === i ? null : i)}
                        className={`p-4 rounded-xl transition-colors cursor-pointer ${faqOpenIdx === i ? "bg-white/10 border border-white/20" : "bg-white/5 border border-white/10"}`}
                      >
                        <div className="text-sm font-normal text-white/80 flex justify-between items-center">
                          {item.q}
                          <span className={`text-[#d0f100] transition-transform duration-300 text-xl leading-none ml-3 shrink-0 ${faqOpenIdx === i ? "rotate-45" : ""}`}>
                            +
                          </span>
                        </div>
                        {faqOpenIdx === i && (
                          <p className="mt-3 text-white/50 text-sm leading-relaxed">{item.a}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
