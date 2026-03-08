import { motion } from "motion/react";
import { ArrowLeft, ExternalLink, BookOpen } from "lucide-react";

const references = [
  {
    title: "Anthropic 해커톤 우승자가 공유한 Claude Code 실전 팁 70가지",
    source: "요즘IT",
    author: "요즘 프로덕트 메이커",
    date: "2026.02.13",
    desc: "Anthropic 해커톤 우승자와 DevRel 팀이 공유한 Claude Code 실전 팁 70가지. 컨텍스트 관리, 태스크 분해, 프롬프트 전략까지.",
    url: "https://yozm.wishket.com/magazine/detail/3607",
    tags: ["실전 팁", "프롬프트", "워크플로우"],
  },
  {
    title: "30가지 이상의 Claude Code 활용 팁 모음",
    source: "PyTorch 한국 커뮤니티",
    author: "박정환 (9bow)",
    date: "2025.12.08",
    desc: "환경 설정, 효과적인 소통법, 워크플로우 관리, Git/DevOps 자동화, 고급 기법까지 5개 카테고리로 정리된 Claude Code 팁 모음.",
    url: "https://discuss.pytorch.kr/t/30-claude-code-feat-ykdojo-claude-code-tips/8368",
    tags: ["팁 모음", "Git 자동화", "환경 설정"],
  },
  {
    title: "갓대희의 작은공간 - Claude Code 시리즈",
    source: "갓대희의 작은공간",
    author: "갓대희",
    date: "연재중",
    desc: "CLAUDE.md 활용법, Anthropic Academy 가이드, 메모리 시스템, Skills 사용법 등 Claude Code 기능별 심층 가이드 시리즈.",
    url: "https://goddaehee.tistory.com/category/AI/Claude",
    tags: ["CLAUDE.md", "메모리", "Skills"],
  },
  {
    title: "Claude Code 고수들은 이렇게 쓴다: 생산성 극대화 꿀팁 모음",
    source: "훈스로그",
    author: "박승훈",
    date: "연재중",
    desc: "Claude Code의 Command, Skill, Subagent, Hooks 등 고급 기능 활용법과 토큰 관리 노하우까지.",
    url: "https://blog.huns.site/blog/posts/ai/claude",
    tags: ["고급 기능", "Hooks", "토큰 관리"],
  },
];

export default function ReferencePage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#100d0a] text-[#fff3d7]/70 font-sans selection:bg-[#d0f100]/30">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[#fff3d7]/55 hover:text-[#fff3d7] transition-colors mb-12 cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>돌아가기</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={24} className="text-[#d0f100]" />
            <p className="text-[#d0f100] font-mono text-sm tracking-widest uppercase">
              Reference
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium text-[#fff3d7] tracking-tight mb-4">
            추천 레퍼런스
          </h1>
          <p className="text-lg text-[#fff3d7]/55 mb-16">
            Claude Code를 더 깊이 활용하고 싶다면, 아래 자료들을 참고하세요.
          </p>
        </motion.div>

        <div className="space-y-6">
          {references.map((ref, i) => (
            <motion.a
              key={i}
              href={ref.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="block p-6 md:p-8 rounded-2xl bg-[#fff3d7]/[0.04] border border-[#fff3d7]/[0.04] hover:border-[#d0f100]/30 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-xl font-medium text-[#fff3d7] group-hover:text-[#d0f100] transition-colors">
                  {ref.title}
                </h2>
                <ExternalLink
                  size={18}
                  className="text-[#fff3d7]/40 group-hover:text-[#d0f100] shrink-0 mt-1 transition-colors"
                />
              </div>

              <p className="text-[#fff3d7]/55 leading-relaxed mb-4">{ref.desc}</p>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-[#fff3d7]/40">
                  {ref.source} · {ref.author} · {ref.date}
                </span>
                <div className="flex gap-2">
                  {ref.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-[#fff3d7]/[0.08] text-[#fff3d7]/55 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
