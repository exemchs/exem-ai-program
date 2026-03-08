import { ArrowRight } from "lucide-react";

export default function FooterSection() {
  return (
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
  );
}
