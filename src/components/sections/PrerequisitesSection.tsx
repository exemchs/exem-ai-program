import { motion } from "motion/react";
import {
  Terminal,
  GitBranch,
  Monitor,
  Key,
  Apple,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import { OS_KEYS, type OsType } from "../../constants/os";

export default function PrerequisitesSection({
  os,
  onOsChange,
}: {
  os: OsType;
  onOsChange: (os: OsType) => void;
}) {
  const keys = OS_KEYS[os];
  const cards = [
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
  ];

  const steps = [
    {
      title: "Cursor 설치",
      desc: "Claude Code를 실행할 에디터입니다. 다운로드 후 설치를 완료하세요.",
      code: null,
      tip: "✓ 유료 결제는 걱정하지 마세요. 무료 버전으로 충분합니다.",
      image: null,
    },
    {
      title: "터미널 열기",
      desc: `Cursor 안에서 터미널을 엽니다.`,
      shortcut: keys.openTerminal,
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
  ];

  return (
    <section id="prerequisites" className="py-28 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 md:mb-24 gap-8">
          <SectionHeading subtitle="Prerequisites" align="center">
            간단한 사전 세팅
            <br />
            <span className="text-[#fff3d7]/40 text-3xl md:text-4xl mt-2 block font-normal">
              딱 4가지만 준비하면 됩니다
            </span>
          </SectionHeading>

          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#fff3d7]/[0.06] border border-[#fff3d7]/[0.08] w-fit">
            <button
              onClick={() => onOsChange("mac")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${os === "mac" ? "bg-[#fff3d7] text-[#100d0a] shadow-sm" : "text-[#fff3d7]/55 hover:text-[#fff3d7]"}`}
            >
              <Apple size={16} /> macOS
            </button>
            <button
              onClick={() => onOsChange("win")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${os === "win" ? "bg-[#fff3d7] text-[#100d0a] shadow-sm" : "text-[#fff3d7]/55 hover:text-[#fff3d7]"}`}
            >
              <Monitor size={16} /> Windows
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {cards.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#fff3d7]/[0.04] border border-[#fff3d7]/[0.04] flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(208,241,0,0.15)] hover:border-[#d0f100]/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-medium text-[#d0f100]">
                  {item.step}
                </span>
                <h3 className="text-xl font-medium text-[#fff3d7] flex items-center gap-2">
                  {item.title}
                </h3>
              </div>
              <p className="text-[#fff3d7]/55 mb-6 grow">{item.desc}</p>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#d0f100] hover:text-[#e8ff6b] transition-colors"
              >
                {item.linkText} <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-medium text-[#fff3d7] mb-12 text-center">
            5분이면 준비 끝
          </h3>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1 }}
                className="p-6 md:p-8 rounded-3xl bg-[#fff3d7]/[0.04] border border-[#fff3d7]/[0.04] flex flex-col md:flex-row gap-6 items-start group hover:border-[#d0f100]/30 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#d0f100]/10 text-[#d0f100] font-medium shrink-0">
                  {i + 1}
                </div>
                <div className="flex-grow w-full overflow-hidden">
                  <h4 className="text-xl font-medium text-[#fff3d7] mb-2">
                    {step.title}
                  </h4>
                  <p className="text-[#fff3d7]/55 mb-4">
                    {step.desc}
                    {/* @ts-ignore */}
                    {step.shortcut && (
                      <>
                        {" ("}
                        <code className="text-[#d0f100] bg-[#d0f100]/10 px-1.5 py-0.5 rounded">
                          {/* @ts-ignore */}
                          {step.shortcut}
                        </code>
                        {")"}
                      </>
                    )}
                  </p>

                  {step.image && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-[#fff3d7]/[0.08] bg-[#fff3d7]/[0.08] relative">
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
                    <div className="mb-4 rounded-xl bg-[#100d0a] border border-[#fff3d7]/[0.08] overflow-hidden">
                      <div className="flex items-center px-4 py-2 bg-[#fff3d7]/[0.06] border-b border-[#fff3d7]/[0.08] text-xs text-[#fff3d7]/40 font-mono">
                        Terminal
                      </div>
                      <div className="p-4 font-mono text-sm text-[#fff3d7]/70 flex items-center gap-3 overflow-x-auto">
                        <span className="text-[#d0f100] shrink-0">❯</span>
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
            <p className="text-xl font-medium text-[#fff3d7]">
              설치 과정이 막막하거나, 어렵게 느껴진다면 Claude에게 물어보세요.
              <br />
              AI는 AI가 제일 잘 아니까요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
