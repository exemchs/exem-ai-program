import { motion } from "motion/react";
import { Cpu, Terminal, Clock } from "lucide-react";
import SectionHeading from "../common/SectionHeading";

export default function WhyNowSection() {
  const items = [
    {
      icon: <Cpu size={24} />,
      title: "매일 기술을 다루는 엑셈",
      desc: "기술을 만드는 엑셈이,\n도구를 가장 잘 활용합니다.",
    },
    {
      icon: <Terminal size={24} />,
      title: "복붙이 아닌 즉각 수정",
      desc: "매번 복사했던 채팅 결과,\n이 도구는 내 파일에 직접 반영합니다.",
    },
    {
      icon: <Clock size={24} />,
      title: "빠르게 변화하는 AI 트렌드",
      desc: "매주 쏟아지는 새로운 기능,\n미루면 그만큼 뒤처집니다.",
    },
  ];

  return (
    <section id="why-now" className="py-16 md:py-28 relative">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading subtitle="Why Now">
          AI 적용 타이밍,
          <br />
          왜 지금일까요?
        </SectionHeading>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white border border-[#E2E5EB] hover:-translate-y-2 hover:shadow-lg hover:border-[#3B82F6]/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#3B82F6] mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-normal text-[#1a2234] mb-4">
                {item.title}
              </h3>
              <p className="text-[#6B7280] leading-relaxed whitespace-pre-line">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
