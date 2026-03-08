import { Layers, Zap, ArrowRight } from "lucide-react";
import SectionHeading from "../common/SectionHeading";

export default function OneMoreThingSection() {
  return (
    <section className="py-28 relative">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading subtitle="One More Thing">
          하나를 익히면,
          <br />
          그 다음은 스스로 찾게 됩니다.
        </SectionHeading>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-zinc-900 border border-white/[0.04]">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 mb-6">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-medium text-white mb-4">
              에이전트 팀 만들기
            </h3>
            <p className="text-zinc-400 mb-6">
              여러 Claude Code를 동시에 띄워, 각각 다른 역할을 맡깁니다.
            </p>
            <div className="p-4 rounded-xl bg-black border border-white/[0.04] font-mono text-sm text-zinc-300">
              <span className="text-zinc-500"># 팁: 각각 다른 규칙 설정</span>
              <br />
              CLAUDE.md
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900 border border-white/[0.04]">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-medium text-white mb-4">
              나만의 자동화 파이프라인
            </h3>
            <p className="text-zinc-400 mb-6">
              Skill, MCP, CLAUDE.md를 조합해 반복 업무를 자동화합니다.
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
  );
}
