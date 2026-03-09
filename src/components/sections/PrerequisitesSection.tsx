import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Terminal,
  GitBranch,
  Key,
  Download,
  ExternalLink,
  Circle,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  X,
} from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import { OS_KEYS, type OsType } from "../../constants/os";

type PopupGuide =
  | { type: "video"; videoId: string; videoStart: number; timeline: string }
  | { type: "screenshot"; image: string };

function PopupOverlay({
  link,
  guide,
  onClose,
}: {
  link: string;
  guide: PopupGuide;
  onClose: () => void;
}) {
  const [contentOpen, setContentOpen] = useState(false);
  const isVideo = guide.type === "video";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white rounded-2xl p-6 max-w-lg w-full mx-6 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#1a2234] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
        <p className="text-lg font-normal text-[#1a2234] mb-1">
          설치가 어려우신 분들은
        </p>
        <p className="text-lg font-normal text-[#1a2234] mb-5">
          {isVideo ? "영상을 확인하세요" : "스크린샷을 확인하세요"}
        </p>

        <button
          onClick={() => setContentOpen(!contentOpen)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#F0F3F9] border border-[#E2E5EB] text-sm text-[#1a2234] mb-4 transition-colors hover:bg-[#E8ECF4]"
        >
          <span className="flex items-center gap-2">
            {isVideo ? (
              <>
                <span className="text-[#3B82F6]">▶</span>
                설치 가이드 영상
                <span className="text-xs text-[#3B82F6] bg-[#EFF6FF] px-2 py-0.5 rounded-full">{guide.timeline}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm10-2h6a2 2 0 012 2v8a2 2 0 01-2 2h-6a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>
                설치 스크린샷 안내
              </>
            )}
          </span>
          <svg
            className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${contentOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {contentOpen && (
          isVideo ? (
            <div className="rounded-xl overflow-hidden mb-4 aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${guide.videoId}?start=${guide.videoStart}`}
                title="설치 가이드"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden mb-4 border border-[#E2E5EB]">
              <img src={guide.image} alt="설치 안내" className="w-full h-auto" />
            </div>
          )
        )}

        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
          className="inline-flex items-center justify-center w-full px-6 py-3 rounded-2xl bg-[#3B82F6] text-white text-sm font-normal hover:bg-[#2563EB] transition-colors no-underline"
        >
          다운로드 페이지로 이동
        </a>
      </div>
    </div>
  );
}

export default function PrerequisitesSection({
  os,
  onOsChange,
}: {
  os: OsType;
  onOsChange: (os: OsType) => void;
}) {
  const keys = OS_KEYS[os];
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);
  const [imgSlide, setImgSlide] = useState(0);
  const [popupData, setPopupData] = useState<{ link: string; guide: PopupGuide } | null>(null);

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(key);
    setTimeout(() => setCopiedIdx(null), 2000);
  };
  const cards = [
    {
      title: "Cursor",
      icon: <Terminal size={20} />,
      desc: "Claude Code를 실행할 에디터입니다.",
      link: "https://cursor.sh",
      linkText: "다운로드",
      linkIcon: <Download size={14} />,
    },
    {
      title: "Node.js",
      icon: <Terminal size={20} />,
      desc: "Claude Code 설치에 필요한 실행 환경입니다.",
      link: "https://nodejs.org/ko/download",
      linkText: "다운로드",
      linkIcon: <Download size={14} />,
      showPopup: true,
      guide: {
        mac: { type: "screenshot" as const, image: "/imgs/installation/nodejs-mac.png" },
        win: { type: "video" as const, videoId: "CYEPaefPXwg", videoStart: 396, timeline: "6:36 ~ 7:07" },
      },
    },
    {
      title: "Git",
      icon: <GitBranch size={20} />,
      desc: "Claude Code가 코드 변경을 추적하는 데 사용합니다.",
      link: "https://git-scm.com/downloads",
      linkText: "다운로드",
      linkIcon: <Download size={14} />,
      showPopup: true,
      guide: {
        mac: { type: "video" as const, videoId: "1hgRMPvyofY", videoStart: 332, timeline: "5:32 ~ 9:45" },
        win: { type: "video" as const, videoId: "CYEPaefPXwg", videoStart: 457, timeline: "7:37 ~ 7:56" },
      },
    },
    {
      title: "Claude 계정",
      icon: <Key size={20} />,
      desc: "Pro($20/월) 이상 구독이 필요합니다.",
      link: "https://claude.ai",
      linkText: "유료 결제",
      linkIcon: <ExternalLink size={14} />,
    },
  ];

  const steps = [
    {
      title: "Cursor 열기 및 로그인",
      desc: "Cursor를 열고 로그인을 진행하세요.",
      code: null,
      tip: null,
      warning: "Cursor 유료 결제는 불필요합니다.",
      warning2: os === "win" ? "추후 단계에서 에러 발생 시, 기기 재부팅을 권장합니다." : null,
      image: null,
    },
    {
      title: "터미널 열기",
      desc: `Cursor 안에서 터미널을 엽니다.`,
      shortcut: keys.openTerminal,
      code: null,
      tip: "화면 하단에 검은 배경의 터미널 창이 뜨면 성공입니다.",
      image: "/imgs/installation/step2.png",
    },
    {
      title: "Git / Node.js 설치 확인",
      desc: "터미널에 아래 명령어를 각각 입력해 설치 여부를 확인하세요.",
      codes: [
        { label: "Git", code: "git --version", tip: "git version 2.x.x 형식이 뜨면 성공" },
        { label: "Node.js", code: "node --version", tip: "v18.x.x 이상이 뜨면 성공" },
      ],
      images: [
        { label: "Git", src: "/imgs/installation/step3.png" },
        { label: "Node.js", src: "/imgs/installation/step4.png" },
      ],
      code: null,
      tip: null,
      image: null,
    },
    {
      title: "Claude Code 설치",
      desc: "터미널에 아래 명령어를 복사하여 붙여넣고 실행하세요.",
      code: os === "mac" ? "sudo npm install -g @anthropic-ai/claude-code" : "npm install -g @anthropic-ai/claude-code",
      tip: "1~2분 걸릴 수 있습니다.",
      warning: os === "win" ? "에러 발생 시, Cursor를 '관리자 권한으로 실행'으로 재실행" : null,
      image: null,
    },
    {
      title: "Claude 로그인",
      desc: "터미널에 claude를 입력하면 브라우저가 열리며 로그인 화면이 나타납니다.",
      code: "claude",
      tip: "Pro 이상 계정으로 로그인 후, 터미널로 돌아오면 준비 완료!",
      image: null,
    },
  ];

  return (
    <>
    <section id="prerequisites" className="py-16 md:py-28 relative">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading subtitle="Prerequisites" align="center">
          사전 세팅,
          <br />
          <span className="text-[#9CA3AF] text-3xl md:text-4xl mt-2 block font-normal">
            4가지만 준비하면 됩니다
          </span>
        </SectionHeading>

        <div className="flex justify-center mb-12">
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-white border border-[#E2E5EB] w-fit shadow-sm">
              <button
                onClick={() => onOsChange("mac")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-normal transition-all ${os === "mac" ? "bg-[#1a2234] text-white shadow-sm" : "text-[#6B7280] hover:text-[#1a2234]"}`}
              >
                <img src="/imgs/apple-logo.png" alt="Apple" className="w-4 h-4 object-contain" style={os === "mac" ? { filter: "brightness(0) invert(1)" } : { filter: "brightness(0)" }} /> macOS
              </button>
              <button
                onClick={() => onOsChange("win")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-normal transition-all ${os === "win" ? "bg-[#1a2234] text-white shadow-sm" : "text-[#6B7280] hover:text-[#1a2234]"}`}
              >
                <img src="/imgs/windows-logo.png" alt="Windows" className="w-4 h-4 object-contain" style={os === "win" ? { filter: "brightness(0) invert(1)" } : { filter: "brightness(0)" }} /> Windows
              </button>
            </div>
          </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              onClick={item.showPopup ? (e) => { e.preventDefault(); setPopupData({ link: item.link, guide: item.guide![os] }); } : undefined}
              className="p-6 rounded-2xl bg-white border border-[#E2E5EB] flex flex-col h-full hover:-translate-y-2 hover:shadow-lg hover:border-[#3B82F6]/30 transition-all duration-300 group cursor-pointer no-underline"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#3B82F6] relative w-6 h-6 flex-shrink-0">
                  <Circle size={24} className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-0" />
                  <CheckCircle2 size={24} fill="currentColor" stroke="white" className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </span>
                <h3 className="text-xl font-normal text-[#1a2234]">
                  {item.title}
                </h3>
              </div>
              <p className="text-[#6B7280] mb-6 grow">{item.desc}</p>
              <span className="inline-flex items-center gap-2 text-sm text-[#3B82F6] group-hover:text-[#2563EB] transition-colors">
                {item.linkText} {item.linkIcon}
              </span>
            </a>
          ))}
        </div>
      </div>

      {popupData && (
        <PopupOverlay
          link={popupData.link}
          guide={popupData.guide}
          onClose={() => setPopupData(null)}
        />
      )}
    </section>

    <section className="py-16 md:py-28 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <SectionHeading subtitle="Installation" align="center">
            클로드 코드,
            <br />
            <span className="text-[#9CA3AF] text-3xl md:text-4xl mt-2 block font-normal">
              5분이면 준비 끝
            </span>
          </SectionHeading>

          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-white border border-[#E2E5EB] w-fit shadow-sm">
              <button
                onClick={() => onOsChange("mac")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-normal transition-all ${os === "mac" ? "bg-[#1a2234] text-white shadow-sm" : "text-[#6B7280] hover:text-[#1a2234]"}`}
              >
                <img src="/imgs/apple-logo.png" alt="Apple" className="w-4 h-4 object-contain" style={os === "mac" ? { filter: "brightness(0) invert(1)" } : { filter: "brightness(0)" }} /> macOS
              </button>
              <button
                onClick={() => onOsChange("win")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-normal transition-all ${os === "win" ? "bg-[#1a2234] text-white shadow-sm" : "text-[#6B7280] hover:text-[#1a2234]"}`}
              >
                <img src="/imgs/windows-logo.png" alt="Windows" className="w-4 h-4 object-contain" style={os === "win" ? { filter: "brightness(0) invert(1)" } : { filter: "brightness(0)" }} /> Windows
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1 }}
                className="p-6 md:p-8 rounded-3xl bg-white border border-[#E2E5EB] flex flex-col md:flex-row gap-6 items-start group hover:border-[#3B82F6]/30 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#EFF6FF] text-[#3B82F6] font-normal shrink-0">
                  {i + 1}
                </div>
                <div className="flex-grow w-full overflow-hidden">
                  <h4 className="text-xl font-normal text-[#1a2234] mb-2">
                    {step.title}
                  </h4>
                  <p className="text-[#6B7280] mb-4">
                    {step.desc}
                    {/* @ts-ignore */}
                    {step.shortcut && (
                      <>
                        {" ("}
                        <code className="text-[#3B82F6] bg-[#EFF6FF] px-1.5 py-0.5 rounded">
                          {/* @ts-ignore */}
                          {step.shortcut}
                        </code>
                        {")"}
                      </>
                    )}
                  </p>

                  {step.image && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-[#E2E5EB] bg-[#F0F3F9] relative">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* @ts-ignore */}
                  {step.images && (
                    <div className="mb-4">
                      <div className="flex gap-2 mb-3">
                        {/* @ts-ignore */}
                        {step.images.map((img: { label: string; src: string }, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setImgSlide(idx)}
                            className={`px-4 py-1.5 rounded-full text-sm transition-all ${imgSlide === idx ? "bg-[#1a2234] text-white" : "bg-[#F0F3F9] text-[#6B7280] hover:text-[#1a2234]"}`}
                          >
                            {img.label}
                          </button>
                        ))}
                      </div>
                      <div className="rounded-xl overflow-hidden border border-[#E2E5EB] bg-[#F0F3F9]">
                        <img
                          src={(step as any).images[imgSlide].src}
                          alt={(step as any).images[imgSlide].label}
                          className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  )}

                  {/* @ts-ignore */}
                  {step.codes && (
                    <div className="space-y-3 mb-4">
                      {/* @ts-ignore */}
                      {step.codes.map((c: { label: string; code: string; tip: string }, idx: number) => (
                        <div key={idx}>
                          <div className="rounded-xl bg-[#1a1a2e] border border-[#E2E5EB] overflow-hidden">
                            <div className="flex items-center px-4 py-2 bg-white/5 border-b border-white/10 text-xs text-white/40 font-mono">
                              {c.label}
                            </div>
                            <div
                              onClick={() => handleCopy(c.code, `${i}-${idx}`)}
                              className="p-4 font-mono text-sm text-white/70 flex items-center gap-3 overflow-x-auto cursor-pointer hover:bg-white/5 transition-colors"
                            >
                              <span className="text-[#d0f100] shrink-0">❯</span>
                              <code className="whitespace-nowrap flex-grow">{c.code}</code>
                              <span className="shrink-0">
                                {copiedIdx === `${i}-${idx}` ? <Check size={14} className="text-blue-400" /> : <Copy size={14} className="text-white/40" />}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-[#3B82F6] bg-[#EFF6FF] px-4 py-3 rounded-lg mt-2">
                            <CheckCircle2 size={16} fill="currentColor" stroke="white" className="shrink-0 mt-0.5" />
                            <span>{c.tip}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {step.code && (
                    <div className="mb-4 rounded-xl bg-[#1a1a2e] border border-[#E2E5EB] overflow-hidden">
                      <div className="flex items-center px-4 py-2 bg-white/5 border-b border-white/10 text-xs text-white/40 font-mono">
                        Terminal
                      </div>
                      <div
                        onClick={() => handleCopy(step.code!, `${i}`)}
                        className="p-4 font-mono text-sm text-white/70 flex items-center gap-3 overflow-x-auto cursor-pointer hover:bg-white/5 transition-colors"
                      >
                        <span className="text-[#d0f100] shrink-0">❯</span>
                        <code className="whitespace-nowrap flex-grow">{step.code}</code>
                        <span className="shrink-0">
                          {copiedIdx === `${i}` ? <Check size={14} className="text-blue-400" /> : <Copy size={14} className="text-white/40" />}
                        </span>
                      </div>
                    </div>
                  )}

                  {step.tip && (
                    <div className="flex items-start gap-2 text-sm text-[#3B82F6] bg-[#EFF6FF] px-4 py-3 rounded-lg">
                      <CheckCircle2 size={16} fill="currentColor" stroke="white" className="shrink-0 mt-0.5" />
                      <span>{step.tip}</span>
                    </div>
                  )}
                  {/* @ts-ignore */}
                  {step.warning && (
                    <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg mt-2">
                      <AlertCircle size={16} fill="currentColor" stroke="white" className="shrink-0 mt-0.5" />
                      {/* @ts-ignore */}
                      <span>{step.warning}</span>
                    </div>
                  )}
                  {/* @ts-ignore */}
                  {step.warning2 && (
                    <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg mt-2">
                      <AlertCircle size={16} fill="currentColor" stroke="white" className="shrink-0 mt-0.5" />
                      {/* @ts-ignore */}
                      <span>{step.warning2}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl font-normal text-[#1a2234]">
              설치 과정이 어렵다면,
              <br />
              Claude에 질문을 던져보세요.
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
