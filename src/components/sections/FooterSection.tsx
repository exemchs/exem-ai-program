export default function FooterSection({
  onNavigateReference,
}: {
  onNavigateReference: () => void;
}) {
  return (
    <footer className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#d0f100]/10 pointer-events-none"></div>
      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-2xl md:text-4xl font-medium text-[#fff3d7] tracking-tight mb-8">
          엑셈의 내일은,
          <br />
          오늘 시작됩니다.
        </h2>
        <p className="text-base text-[#fff3d7]/55 mb-12 max-w-2xl mx-auto">
          처음이라 같이 합니다.
          <br />
          그래서 쉬워집니다.
        </p>
        <a
          href="#prerequisites"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#d0f100] text-[#100d0a] font-medium text-lg hover:bg-[#d0f100]/80 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(208,241,0,0.2)]"
        >
          지금 바로 시작하기
        </a>

        <div className="mt-32 pt-8 border-t border-[#fff3d7]/[0.08] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#fff3d7]/40">
          <div>© 2026 Exem · Claude Code AI Training</div>
          <div className="flex items-center gap-6">
            <span>피드백/오류 보고 → 조현서 그룹장</span>
            <button
              onClick={onNavigateReference}
              className="hover:text-[#fff3d7] transition-colors cursor-pointer"
            >
              추천 레퍼런스 →
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
