import { ArrowRight } from "lucide-react";
import SectionHeading from "../common/SectionHeading";

const faqs = [
  {
    q: "결제가 필요한가요?",
    a: "Cursor는 무료입니다. Claude Pro($20/월) 구독이 필요합니다.",
  },
  {
    q: "코딩을 전혀 모르는데 괜찮을까요?",
    a: "코딩 지식 없이, 한국어로 진행됩니다.",
  },
  {
    q: "중간에 막히면 어떻게 하나요?",
    a: "에러 메시지를 Claude에게 보여주면 됩니다. 그래도 어려우면 조현서 그룹장에게 문의하세요.",
  },
  {
    q: "Windows 환경에서도 똑같이 되나요?",
    a: "가능합니다. '사전 세팅'에서 Windows 탭을 확인해주세요.",
  },
];

export default function FAQSection({
  onNavigateReference,
}: {
  onNavigateReference: () => void;
}) {
  return (
    <section className="py-40 bg-[#fff3d7]/[0.03] border-y border-[#fff3d7]/[0.04]">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeading subtitle="FAQ" align="center">
          자주 묻는 질문
        </SectionHeading>

        <div className="space-y-4 mt-12">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group p-6 rounded-2xl bg-[#100d0a] border border-[#fff3d7]/[0.04] open:border-[#d0f100]/30 transition-colors cursor-pointer"
            >
              <summary className="text-lg font-medium text-[#fff3d7] flex justify-between items-center list-none outline-none">
                {faq.q}
                <span className="text-[#d0f100] group-open:rotate-45 transition-transform duration-300 text-2xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-4 text-[#fff3d7]/55 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onNavigateReference}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#fff3d7]/[0.06] border border-[#fff3d7]/[0.08] text-[#fff3d7]/70 hover:text-[#fff3d7] hover:border-[#fff3d7]/15 transition-all cursor-pointer"
          >
            추천 레퍼런스 보기 <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
