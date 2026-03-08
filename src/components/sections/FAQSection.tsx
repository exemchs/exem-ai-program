import { useState } from "react";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../common/SectionHeading";

const items = [
  {
    q: "이 프로그램은 왜 만들었나요?",
    a: "Claude Code가 어렵게만 느껴지는 비전공자를 위해 난이도를 낮춰 구성했습니다.",
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

export default function FAQSection({
  onNavigateReference,
}: {
  onNavigateReference: () => void;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-40">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeading subtitle="INFO" align="center">
          추가 안내
        </SectionHeading>

        <div className="space-y-4 mt-12">
          {items.map((item, i) => (
            <div
              key={i}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className={`p-6 rounded-2xl bg-white border transition-colors cursor-pointer ${openIdx === i ? "border-[#3B82F6]/30" : "border-[#E2E5EB]"}`}
            >
              <div className="text-lg font-normal text-[#1a2234] flex justify-between items-center">
                {item.q}
                <span className={`text-[#3B82F6] transition-transform duration-300 text-2xl leading-none ${openIdx === i ? "rotate-45" : ""}`}>
                  +
                </span>
              </div>
              {openIdx === i && (
                <p className="mt-4 text-[#6B7280] leading-relaxed">{item.a}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onNavigateReference}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#E2E5EB] text-[#6B7280] hover:text-[#1a2234] hover:border-[#1a2234]/20 transition-all cursor-pointer"
          >
            추천 레퍼런스 보기 <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
