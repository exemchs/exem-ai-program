import SectionHeading from "../common/SectionHeading";

const shortcuts = [
  { key: "Shift + Tab", desc: "플랜 모드, 실행 모드 등 모드 전환" },
  { key: "/", desc: "명령어 자동완성 및 커맨드별 설명 미리보기" },
  { key: "/clear", desc: "현재 대화 내용 지우기" },
  { key: "/compact", desc: "컨텍스트 압축하여 메모리 확보" },
  { key: "Ctrl + C", desc: "현재 진행 중인 작업 취소" },
  { key: "/usage", desc: "현재까지 사용한 토큰 비용 확인" },
];

export default function ShortcutsSection() {
  return (
    <section className="py-28">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading subtitle="Shortcuts" align="center">
          Claude Code 핵심 단축키
        </SectionHeading>

        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-4">
          {shortcuts.map((shortcut, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-6 rounded-2xl bg-white border border-[#E2E5EB] hover:border-[#3B82F6]/30 transition-colors"
            >
              <span className="text-[#6B7280]">{shortcut.desc}</span>
              <kbd className="px-3 py-1.5 rounded-lg bg-[#F0F3F9] border border-[#E2E5EB] text-[#3B82F6] font-mono text-sm shadow-sm">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
