import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Terminal,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Monitor,
  Server,
  Database,
  FileText,
  Shield,
  Activity,
  Bug,
  BarChart3,
  Settings,
  Zap,
} from "lucide-react";

type Tab = "linux" | "wsl";

function CodeBlock({
  label,
  code,
  prompt = "$",
}: {
  label?: string;
  code: string;
  prompt?: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-xl bg-[#1a1a2e] border border-[#E2E5EB] overflow-hidden">
      {label && (
        <div className="flex items-center px-4 py-2 bg-white/5 border-b border-white/10 text-xs text-white/40 font-mono">
          {label}
        </div>
      )}
      <div
        onClick={handleCopy}
        className="p-4 font-mono text-sm text-white/70 flex items-center gap-3 overflow-x-auto cursor-pointer hover:bg-white/5 transition-colors"
      >
        <span className="text-[#d0f100] shrink-0">{prompt}</span>
        <code className="whitespace-nowrap flex-grow">{code}</code>
        <span className="shrink-0">
          {copied ? (
            <Check size={14} className="text-blue-400" />
          ) : (
            <Copy size={14} className="text-white/40" />
          )}
        </span>
      </div>
    </div>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#E2E5EB] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-[#F8F9FC] transition-colors"
      >
        <span className="text-[#1a2234] font-normal">{title}</span>
        {open ? (
          <ChevronDown size={18} className="text-[#6B7280]" />
        ) : (
          <ChevronRight size={18} className="text-[#6B7280]" />
        )}
      </button>
      {open && <div className="px-5 pb-5 bg-white">{children}</div>}
    </div>
  );
}

function TipBox({
  children,
  variant = "info",
}: {
  children: ReactNode;
  variant?: "info" | "warning" | "success";
}) {
  const styles = {
    info: "text-[#3B82F6] bg-[#EFF6FF]",
    warning: "text-red-600 bg-red-50",
    success: "text-emerald-600 bg-emerald-50",
  };
  const icons = {
    info: <CheckCircle2 size={16} fill="currentColor" stroke="white" className="shrink-0 mt-0.5" />,
    warning: <AlertTriangle size={16} className="shrink-0 mt-0.5" />,
    success: <CheckCircle2 size={16} fill="currentColor" stroke="white" className="shrink-0 mt-0.5" />,
  };
  return (
    <div className={`flex items-start gap-2 text-sm px-4 py-3 rounded-lg ${styles[variant]}`}>
      {icons[variant]}
      <span>{children}</span>
    </div>
  );
}

const useCases = [
  {
    icon: <FileText size={20} />,
    tag: "Log Analysis",
    tagColor: "bg-emerald-50 text-emerald-600",
    title: "로그 분석 자동화",
    prompts: [
      "이 alert 로그에서 ORA-에러만 추출해서 시간순 정리하고, 발생 빈도 Top 10 보여줘",
      "WAS 로그에서 응답시간 3초 초과 트랜잭션만 뽑아서 원인 패턴 분석해줘",
    ],
    who: ["DBA", "APM Engineer", "Infra"],
  },
  {
    icon: <Terminal size={20} />,
    tag: "Shell Scripting",
    tagColor: "bg-blue-50 text-blue-600",
    title: "모니터링 스크립트 생성",
    prompts: [
      "서버 10대의 디스크/메모리 사용률을 SSH로 일괄 조회해서 CSV로 저장하는 bash 스크립트",
      "테이블스페이스 사용량 90% 초과 시 Slack 알림 보내는 cron 스크립트",
    ],
    who: ["Infra Engineer", "SRE", "SysAdmin"],
  },
  {
    icon: <Database size={20} />,
    tag: "DB Performance",
    tagColor: "bg-amber-50 text-amber-600",
    title: "Slow Query 분석 & 튜닝",
    prompts: [
      "PostgreSQL slow query 로그 분석해서 상위 10개 쿼리 뽑고, 인덱스 추천해줘",
      "이 Oracle SQL 실행 계획 분석해서 병목 구간과 개선안 알려줘",
    ],
    who: ["DBA", "DB Monitoring"],
  },
  {
    icon: <Settings size={20} />,
    tag: "Configuration",
    tagColor: "bg-sky-50 text-sky-600",
    title: "설정 파일 관리",
    prompts: [
      "Prometheus alerting rules에 CPU 90% 5분 지속 알림 조건 추가해줘",
      "nginx.conf에 /api/* 경로 초당 100 요청 rate limiting 추가해줘",
    ],
    who: ["DevOps", "SRE", "Platform"],
  },
  {
    icon: <Bug size={20} />,
    tag: "Debugging",
    tagColor: "bg-rose-50 text-rose-600",
    title: "코드 디버깅 & 성능 분석",
    prompts: [
      "이 Java agent 코드에서 메모리 누수 의심 부분 찾아서 수정안 제시해줘",
      "thread dump 분석해서 deadlock 발생 지점 찾아줘",
    ],
    who: ["APM Developer", "Backend"],
  },
  {
    icon: <Activity size={20} />,
    tag: "Incident Response",
    tagColor: "bg-red-50 text-red-600",
    title: "장애 대응 & RCA",
    prompts: [
      "지금 서버 CPU 100%인데, top과 strace 결과 보고 원인 분석해줘",
      "이 장애 타임라인 정리해서 RCA 보고서 초안 작성해줘",
    ],
    who: ["On-Call", "SRE", "NOC"],
  },
  {
    icon: <BarChart3 size={20} />,
    tag: "Reporting",
    tagColor: "bg-violet-50 text-violet-600",
    title: "성능 리포트 자동 생성",
    prompts: [
      "vmstat, iostat 결과 파싱해서 주간 서버 성능 리포트 CSV 만들어줘",
      "지난주 알림 히스토리에서 False Positive 비율 계산해줘",
    ],
    who: ["Monitoring", "Team Lead"],
  },
  {
    icon: <Shield size={20} />,
    tag: "Security",
    tagColor: "bg-orange-50 text-orange-600",
    title: "보안 점검 & 취약점 분석",
    prompts: [
      "이 서버의 sshd_config 보안 점검해줘. CIS Benchmark 기준으로.",
      "firewall rules 검토해서 불필요하게 열린 포트 목록 만들어줘",
    ],
    who: ["Security", "SysAdmin"],
  },
];

export default function LinuxGuidePage() {
  const [tab, setTab] = useState<Tab>("linux");
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);
  const [showBetaNotice, setShowBetaNotice] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setShowBetaNotice(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(key);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#1a2234] font-sans selection:bg-blue-200/50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E2E5EB]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = "";
              window.location.reload();
            }}
            className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1a2234] transition-colors no-underline"
          >
            <ArrowLeft size={16} />
            메인 페이지
          </a>
          <img src="/imgs/exem-logo.svg" alt="EXEM" className="h-4 opacity-40" />
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-16 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-sm text-[#3B82F6] font-normal">
                Engineer Guide
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 font-normal">
                Beta
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-normal text-[#1a2234] mb-4 tracking-tight">
              Linux / WSL 환경
              <br />
              <span className="text-[#3B82F6]">Claude Code</span> 설치 가이드
            </h1>
            <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
              터미널에서 바로 사용하는 AI 코딩 도구.
              <br />
              GUI 에디터 없이, 서버에서 곧바로.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
              <AlertTriangle size={14} />
              현재 설치 가이드만 제공됩니다. 교육 프로그램은 준비 중입니다.
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tab Toggle */}
      <div className="sticky top-14 z-30 bg-[#F8F9FC]/80 backdrop-blur-md py-4">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-white border border-[#E2E5EB] w-fit shadow-sm">
            <button
              onClick={() => setTab("linux")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-normal transition-all ${tab === "linux" ? "bg-[#1a2234] text-white shadow-sm" : "text-[#6B7280] hover:text-[#1a2234]"}`}
            >
              <Server size={14} /> Linux (Native)
            </button>
            <button
              onClick={() => setTab("wsl")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-normal transition-all ${tab === "wsl" ? "bg-[#1a2234] text-white shadow-sm" : "text-[#6B7280] hover:text-[#1a2234]"}`}
            >
              <Monitor size={14} /> Windows + WSL
            </button>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-normal text-[#1a2234] mb-8">
            시스템 요구사항
          </h2>

          {tab === "linux" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "OS", value: "Ubuntu 20.04+\nDebian 10+\nAlpine 3.19+" },
                { label: "RAM", value: "4GB+" },
                { label: "Shell", value: "Bash / Zsh" },
                { label: "Network", value: "Internet\n필수" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-5 rounded-2xl bg-white border border-[#E2E5EB] text-center"
                >
                  <p className="text-xs text-[#9CA3AF] mb-2">{item.label}</p>
                  <p className="text-sm text-[#1a2234] font-normal whitespace-pre-line">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Windows", value: "10 (1809+)\nor 11" },
                { label: "WSL", value: "WSL 2\n(권장)" },
                { label: "RAM", value: "4GB+" },
                { label: "BIOS", value: "가상화\n(VT-x/AMD-V)" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-5 rounded-2xl bg-white border border-[#E2E5EB] text-center"
                >
                  <p className="text-xs text-[#9CA3AF] mb-2">{item.label}</p>
                  <p className="text-sm text-[#1a2234] font-normal whitespace-pre-line">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          <TipBox variant="info">
            네이티브 인스톨러 사용 시 Node.js 설치가 <strong>불필요</strong>합니다. npm 설치 방식은 deprecated.
          </TipBox>
        </div>
      </section>

      {/* Installation Steps */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-normal text-[#1a2234] mb-8">
            {tab === "linux" ? "설치 (3단계)" : "설치 (4단계)"}
          </h2>

          {tab === "linux" ? (
            <div className="space-y-6">
              <StepCard num={1} title="Claude Code 설치">
                <p className="text-[#6B7280] mb-4">
                  네이티브 인스톨러 한 줄로 설치합니다.
                </p>
                <CodeBlock
                  label="Terminal"
                  code="curl -fsSL https://claude.ai/install.sh | bash"
                />
                <div className="mt-3">
                  <TipBox variant="success">
                    설치 경로: ~/.local/bin/claude / 자동 업데이트 내장
                  </TipBox>
                </div>
              </StepCard>

              <StepCard num={2} title="PATH 설정 (필요 시)">
                <p className="text-[#6B7280] mb-4">
                  <code className="text-[#3B82F6] bg-[#EFF6FF] px-1.5 py-0.5 rounded text-xs">
                    command not found: claude
                  </code>{" "}
                  에러가 뜨면 PATH를 추가하세요.
                </p>
                <div className="space-y-3">
                  <CodeBlock
                    label="Bash (Linux 기본)"
                    code={`echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc`}
                  />
                  <CodeBlock
                    label="Zsh"
                    code={`echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc`}
                  />
                </div>
              </StepCard>

              <StepCard num={3} title="실행 & 로그인">
                <p className="text-[#6B7280] mb-4">
                  claude를 실행하면 브라우저에서 로그인할 수 있습니다.
                </p>
                <div className="space-y-3">
                  <CodeBlock label="설치 확인" code="claude --version" />
                  <CodeBlock label="진단" code="claude doctor" />
                  <CodeBlock label="실행" code="claude" />
                </div>
                <div className="mt-3">
                  <TipBox>
                    Pro, Max, Teams, Enterprise, 또는 Console 계정 필요. 무료 플랜은 미지원.
                  </TipBox>
                </div>
              </StepCard>
            </div>
          ) : (
            <div className="space-y-6">
              <StepCard num={1} title="WSL 설치">
                <p className="text-[#6B7280] mb-4">
                  PowerShell을 <strong>관리자 모드</strong>로 열고 실행합니다. WSL2 + Ubuntu가 기본 설치됩니다.
                </p>
                <CodeBlock
                  label="PowerShell (Admin)"
                  code="wsl --install"
                  prompt="PS>"
                />
                <div className="mt-3 space-y-2">
                  <TipBox>실행 후 PC 재시작이 필요합니다.</TipBox>
                  <TipBox variant="warning">
                    설치가 0%에서 멈추면: <code className="text-xs">wsl --install --web-download -d Ubuntu</code>
                  </TipBox>
                </div>
              </StepCard>

              <StepCard num={2} title="Ubuntu 초기 설정">
                <p className="text-[#6B7280] mb-4">
                  재시작 후 Ubuntu 터미널이 자동 실행됩니다. 사용자명/비밀번호 설정 후:
                </p>
                <CodeBlock
                  label="Ubuntu (WSL)"
                  code="sudo apt update && sudo apt upgrade -y"
                />
              </StepCard>

              <StepCard num={3} title="Claude Code 설치">
                <p className="text-[#6B7280] mb-4">
                  Linux와 동일한 네이티브 인스톨러를 사용합니다.
                </p>
                <CodeBlock
                  label="Ubuntu (WSL)"
                  code="curl -fsSL https://claude.ai/install.sh | bash"
                />
              </StepCard>

              <StepCard num={4} title="실행 & 로그인">
                <p className="text-[#6B7280] mb-4">
                  WSL에서 브라우저가 자동으로 열리지 않을 수 있습니다.
                </p>
                <div className="space-y-3">
                  <CodeBlock label="실행" code="claude" />
                  <CodeBlock
                    label="브라우저 안 열릴 때"
                    code={`export BROWSER="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"`}
                  />
                </div>
                <div className="mt-3">
                  <TipBox>
                    또는 터미널에서 <code className="font-mono text-xs bg-blue-100 px-1 rounded">c</code> 키를 눌러 OAuth URL을 복사한 뒤, Windows 브라우저에 붙여넣기
                  </TipBox>
                </div>
              </StepCard>
            </div>
          )}
        </div>
      </section>

      {/* Important Notes (WSL only) */}
      {tab === "wsl" && (
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-2xl font-normal text-[#1a2234] mb-8">
              WSL 핵심 주의사항
            </h2>
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white border-2 border-red-200">
                <h3 className="text-lg font-normal text-[#1a2234] mb-3 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-500" />
                  파일시스템 성능 (가장 중요)
                </h3>
                <p className="text-[#6B7280] text-sm mb-3">
                  프로젝트 파일은 <strong>반드시 Linux 파일시스템</strong>에 저장하세요.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
                    <p className="font-normal mb-1">~/projects/</p>
                    <p className="text-xs opacity-70">Linux 파일시스템 (빠름)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-red-50 text-red-700">
                    <p className="font-normal mb-1">/mnt/c/Users/...</p>
                    <p className="text-xs opacity-70">Windows 드라이브 (느림)</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E2E5EB]">
                <h3 className="font-normal text-[#1a2234] mb-3">VS Code 연동</h3>
                <p className="text-[#6B7280] text-sm">
                  Windows에 VS Code 설치 → <strong>Remote - WSL</strong> 확장 설치 →
                  WSL 터미널에서 <code className="text-[#3B82F6] bg-[#EFF6FF] px-1 rounded text-xs">code .</code>로 열기
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E2E5EB]">
                <h3 className="font-normal text-[#1a2234] mb-3">WSL2 샌드박싱</h3>
                <p className="text-[#6B7280] text-sm mb-3">
                  WSL2에서 샌드박싱을 사용하려면 추가 패키지가 필요합니다. WSL1은 샌드박싱 미지원.
                </p>
                <CodeBlock code="sudo apt-get install bubblewrap socat" />
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E2E5EB]">
                <h3 className="font-normal text-[#1a2234] mb-3">리소스 제한 설정</h3>
                <p className="text-[#6B7280] text-sm mb-3">
                  Windows 사용자 폴더에 <code className="text-[#3B82F6] bg-[#EFF6FF] px-1 rounded text-xs">.wslconfig</code> 파일을 생성하여 메모리/CPU를 제한할 수 있습니다.
                </p>
                <div className="rounded-xl bg-[#1a1a2e] p-4 font-mono text-sm text-white/70">
                  <div className="text-white/40 text-xs mb-2"># %USERPROFILE%\.wslconfig</div>
                  <div>[wsl2]</div>
                  <div>memory=6GB</div>
                  <div>processors=4</div>
                  <div>swap=2GB</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Troubleshooting */}
      <section className={`py-12 ${tab === "wsl" ? "bg-white" : ""}`}>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-normal text-[#1a2234] mb-8">
            트러블슈팅
          </h2>

          <div className="space-y-3">
            {tab === "linux" ? (
              <>
                <Accordion title="command not found: claude">
                  <p className="text-[#6B7280] text-sm mb-3">
                    ~/.local/bin이 PATH에 없는 경우입니다.
                  </p>
                  <CodeBlock code={`echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc`} />
                </Accordion>
                <Accordion title="설치 중 Killed (RAM 부족)">
                  <p className="text-[#6B7280] text-sm mb-3">
                    4GB 미만 서버에서 OOM으로 종료될 수 있습니다. swap을 추가하세요.
                  </p>
                  <CodeBlock code="sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile" />
                </Accordion>
                <Accordion title="TLS/SSL 에러">
                  <p className="text-[#6B7280] text-sm mb-3">
                    CA 인증서가 없거나 만료된 경우입니다.
                  </p>
                  <CodeBlock code="sudo apt-get update && sudo apt-get install ca-certificates" />
                </Accordion>
                <Accordion title="기업 프록시 / 사내 인증서">
                  <p className="text-[#6B7280] text-sm mb-3">
                    프록시 뒤에서 설치할 때는 환경변수를 설정하세요.
                  </p>
                  <div className="space-y-3">
                    <CodeBlock
                      label="프록시 설정"
                      code="export HTTPS_PROXY=http://proxy.example.com:8080"
                    />
                    <CodeBlock
                      label="사내 인증서"
                      code="export NODE_EXTRA_CA_CERTS=/path/to/corporate-ca.pem"
                    />
                  </div>
                </Accordion>
                <Accordion title="검색 기능 미작동">
                  <p className="text-[#6B7280] text-sm mb-3">
                    ripgrep이 없으면 검색이 동작하지 않습니다.
                  </p>
                  <CodeBlock code="sudo apt install ripgrep" />
                </Accordion>
                <Accordion title="Alpine Linux (musl 기반)">
                  <p className="text-[#6B7280] text-sm mb-3">
                    Alpine에서는 추가 패키지가 필요합니다.
                  </p>
                  <CodeBlock code="apk add libgcc libstdc++ ripgrep" />
                  <p className="text-[#6B7280] text-sm mt-2">
                    그리고 settings.json에 <code className="text-[#3B82F6] bg-[#EFF6FF] px-1 rounded text-xs">"USE_BUILTIN_RIPGREP": "0"</code> 추가
                  </p>
                </Accordion>
              </>
            ) : (
              <>
                <Accordion title="브라우저 로그인이 안 열림">
                  <p className="text-[#6B7280] text-sm mb-3">
                    WSL에서 Windows 브라우저를 찾지 못하는 경우입니다.
                  </p>
                  <CodeBlock code={`export BROWSER="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"`} />
                  <p className="text-[#6B7280] text-sm mt-2">
                    또는 터미널에서 c 키를 눌러 URL을 복사, Windows 브라우저에 붙여넣기
                  </p>
                </Accordion>
                <Accordion title="node: not found">
                  <p className="text-[#6B7280] text-sm mb-3">
                    Windows의 Node.js를 가리키고 있을 수 있습니다. <code className="text-xs">which node</code>가 /home/ 경로를 가리키는지 확인하세요.
                  </p>
                  <CodeBlock code="which node && which npm" />
                </Accordion>
                <Accordion title="PATH 충돌 (Windows Node.js)">
                  <p className="text-[#6B7280] text-sm mb-3">
                    WSL이 Windows PATH를 가져오면서 Windows Node.js를 사용하게 되는 문제입니다.
                    nvm이 제대로 로딩되는지 확인하세요.
                  </p>
                  <div className="rounded-xl bg-[#1a1a2e] p-4 font-mono text-sm text-white/70">
                    <div className="text-white/40 text-xs mb-2"># ~/.bashrc에 추가</div>
                    <div>export NVM_DIR="$HOME/.nvm"</div>
                    <div>[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"</div>
                    <div>[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"</div>
                  </div>
                </Accordion>
                <Accordion title="WSL1 → WSL2 업그레이드">
                  <p className="text-[#6B7280] text-sm mb-3">
                    WSL1은 샌드박싱 미지원입니다. WSL2로 전환하세요.
                  </p>
                  <CodeBlock code="wsl --set-version Ubuntu 2" prompt="PS>" />
                </Accordion>
                <Accordion title="검색 결과가 적게 나옴">
                  <p className="text-[#6B7280] text-sm">
                    /mnt/c/ 경로의 프로젝트에서 발생합니다. 프로젝트를 Linux 파일시스템(~/projects/)으로 이동하면 해결됩니다.
                  </p>
                </Accordion>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-[#020B1A]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm text-[#3B82F6] font-normal mb-3">
              Use Cases
            </p>
            <h2 className="text-2xl md:text-3xl font-normal text-white mb-3">
              IT 모니터링 엔지니어를 위한 활용 사례
            </h2>
            <p className="text-[#6B7280] text-sm">
              터미널에서 자연어로 요청하면, 코드 생성부터 실행/검증까지 한 번에.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {useCases.map((uc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#3B82F6]">{uc.icon}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${uc.tagColor}`}>
                    {uc.tag}
                  </span>
                </div>
                <h3 className="text-white font-normal mb-3">{uc.title}</h3>
                <div className="space-y-2 mb-3">
                  {uc.prompts.map((p, j) => (
                    <div
                      key={j}
                      className="rounded-lg bg-black/30 px-3 py-2 font-mono text-xs text-white/60"
                    >
                      <span className="text-[#d0f100]">claude&gt; </span>
                      "{p}"
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {uc.who.map((w) => (
                    <span
                      key={w}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/40"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-white/80 text-sm">
              <Zap size={14} className="inline mr-1 text-[#d0f100]" />
              핵심: SSH 접속 서버에서 GUI 없이 바로 사용 가능.
              "만들고 → 실행 → 검증"까지 터미널 안에서 완결.
            </p>
          </div>

        </div>
      </section>

      {/* Sources */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-normal text-[#1a2234] mb-8">
            정보 출처
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { type: "Official", label: "Claude Code Setup", url: "https://code.claude.com/docs/en/setup" },
              { type: "Official", label: "Claude Code Troubleshooting", url: "https://code.claude.com/docs/en/troubleshooting" },
              { type: "Microsoft", label: "WSL Installation Guide", url: "https://learn.microsoft.com/en-us/windows/wsl/install" },
              { type: "Microsoft", label: "Node.js on WSL", url: "https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#E2E5EB] hover:border-[#3B82F6]/30 transition-colors no-underline"
              >
                <span
                  className={`text-[10px] font-normal px-2 py-0.5 rounded ${
                    s.type === "Official"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {s.type}
                </span>
                <span className="text-sm text-[#6B7280]">{s.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#E2E5EB] text-center">
        <p className="text-xs text-[#9CA3AF]">
          EXEM CX Group - Claude Code Engineer Guide
        </p>
      </footer>

      {showBetaNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowBetaNotice(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-6 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <img src="/imgs/exem-logo.svg" alt="EXEM" className="h-5" />
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 font-normal">Beta</span>
            </div>
            <p className="text-[#1a2234] text-sm leading-relaxed mb-2">
              본 설치 가이드는 <strong>베타 버전</strong>으로
            </p>
            <p className="text-[#1a2234] text-sm leading-relaxed mb-5">
              내용에 오류가 있을 수 있습니다.
            </p>
            <div className="border-t border-gray-100 pt-5 mb-6">
              <p className="text-[#6B7280] text-sm leading-relaxed">
                교육 프로그램은 실무에서 더 활용하실 수 있도록
                <br />
                별도로 준비 중입니다.
              </p>
            </div>
            <button
              onClick={() => setShowBetaNotice(false)}
              className="w-full py-2.5 rounded-lg bg-[#1a2234] text-white text-sm hover:bg-[#2a3344] transition-colors cursor-pointer"
            >
              확인
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function StepCard({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: num * 0.08 }}
      className="p-6 md:p-8 rounded-3xl bg-[#F8F9FC] border border-[#E2E5EB] flex flex-col md:flex-row gap-6 items-start"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#EFF6FF] text-[#3B82F6] font-normal shrink-0">
        {num}
      </div>
      <div className="flex-grow w-full overflow-hidden">
        <h4 className="text-xl font-normal text-[#1a2234] mb-3">{title}</h4>
        {children}
      </div>
    </motion.div>
  );
}
