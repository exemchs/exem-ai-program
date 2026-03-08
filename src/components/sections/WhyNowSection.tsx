import { motion } from "motion/react";
import { Cpu, Layers, Clock } from "lucide-react";
import SectionHeading from "../common/SectionHeading";

export default function WhyNowSection() {
  const items = [
    {
      icon: <Cpu size={24} />,
      title: "매일 기술을 만드는 사람들",
      desc: "기술을 만드는 사람이, 도구를 가장 잘 압니다.",
    },
    {
      icon: <Layers size={24} />,
      title: "앱 채팅을 넘어서는 시점",
      desc: "채팅은 해봤습니다. 그 다음이 궁금한 시점입니다.",
    },
    {
      icon: <Clock size={24} />,
      title: "미루면 격차가 됩니다",
      desc: "도구는 미루는 순간, 거리가 됩니다.",
    },
  ];

  return (
    <section id="why-now" className="py-28 relative border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeading subtitle="Why Now">
          왜 지금이 엑셈에서 Claude Code를
          <br />
          활용하기 최적의 타이밍인가?
        </SectionHeading>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-zinc-900/50 border border-white/[0.04] hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(249,115,22,0.08)] hover:border-orange-500/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-4">
                {item.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
