import { ArrowRight } from "lucide-react";
import SectionHeading from "../common/SectionHeading";

const faqs = [
  {
    q: "결제가 필요한가요?",
    a: "Cursor 에디터는 무료 플랜으로 충분합니다. 단, Claude Code를 사용하기 위해서는 Claude Pro($20/월) 구독이 필수적으로 필요합니다.",
  },
  {
    q: "코딩을 전혀 모르는데 괜찮을까요?",
    a: "네, 코딩 지식이 없어도 한국어로 대화하며 진행할 수 있도록 커리큘럼이 구성되어 있습니다. AI가 코드를 작성하고 실행하는 과정을 자연스럽게 익히게 됩니다.",
  },
  {
    q: "중간에 막히면 어떻게 하나요?",
    a: "에러 메시지를 그대로 복사해서 Claude에게 물어보면 대부분 해결 방법을 알려줍니다. 그래도 해결이 어렵다면 조현서 그룹장에게 문의하시거나 추가 팁 블로그를 참고해주세요.",
  },
  {
    q: "Windows 환경에서도 똑같이 되나요?",
    a: "네, 가능합니다. 다만 터미널 환경이 조금 다를 수 있어, 본 페이지의 '간단한 사전 세팅'에서 Windows 탭을 선택하여 안내된 주의사항을 꼭 확인해주세요.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-32 bg-zinc-900/30 border-y border-white/5">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeading subtitle="FAQ" align="center">
          자주 묻는 질문
        </SectionHeading>

        <div className="space-y-4 mt-12">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group p-6 rounded-2xl bg-black border border-white/5 open:border-orange-500/30 transition-colors cursor-pointer"
            >
              <summary className="text-lg font-semibold text-white flex justify-between items-center list-none outline-none">
                {faq.q}
                <span className="text-orange-400 group-open:rotate-45 transition-transform duration-300 text-2xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-4 text-zinc-400 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://blog.huns.site/blog/posts/ai/claude"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 transition-all"
          >
            더 많은 팁 보기 (blog.huns.site) <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
