export default function FooterSection({
  onNavigateReference,
}: {
  onNavigateReference: () => void;
}) {
  return (
    <footer className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#E2E5EB]/30 pointer-events-none"></div>
      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-2xl md:text-4xl font-normal text-[#1a2234] tracking-tight mb-8">
          엑셈의 내일은,
          <br />
          오늘 시작됩니다.
        </h2>
        <p className="text-base text-[#6B7280] mb-12 max-w-2xl mx-auto">
          처음이라 같이 합니다.
          <br />
          그래서 쉬워집니다.
        </p>
        <a
          href="#prerequisites"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1a2234] text-white font-normal text-lg hover:bg-[#1a2234]/90 transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          지금 바로 시작하기
        </a>

        <div className="mt-32 pt-8 border-t border-[#E2E5EB] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#9CA3AF]">
          <div>© 2026 Exem · Claude Code AI Training</div>
          <div className="flex items-center gap-6">
            <span>피드백/오류 보고 → 조현서 그룹장</span>
            <button
              onClick={onNavigateReference}
              className="hover:text-[#1a2234] transition-colors cursor-pointer"
            >
              추천 레퍼런스 →
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
