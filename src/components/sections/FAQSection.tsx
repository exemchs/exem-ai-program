import { useState } from "react";
import SectionHeading from "../common/SectionHeading";

const items = [
  {
    q: "이 프로그램은 왜 만들었나요?",
    a: "Claude Code가 어렵게만 느껴지는 엑셈 구성원분들을 위해 난이도를 낮춰 구성했습니다.",
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

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-40" style={{ backgroundColor: "#020B1A" }}>
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeading subtitle="INFO" align="center" dark>
          추가 안내
        </SectionHeading>

        <div className="space-y-4 mt-12">
          {items.map((item, i) => (
            <div
              key={i}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className={`p-6 rounded-2xl transition-colors cursor-pointer ${openIdx === i ? "bg-white/10 border border-white/20" : "bg-white/5 border border-white/10"}`}
            >
              <div className="text-lg font-normal text-white/80 flex justify-between items-center">
                {item.q}
                <span className={`text-[#d0f100] transition-transform duration-300 text-2xl leading-none ${openIdx === i ? "rotate-45" : ""}`}>
                  +
                </span>
              </div>
              {openIdx === i && (
                <p className="mt-4 text-white/50 leading-relaxed">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
