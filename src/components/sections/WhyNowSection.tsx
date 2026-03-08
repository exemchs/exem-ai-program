import { motion } from "motion/react";
import { Cpu, Layers, Clock } from "lucide-react";
import SectionHeading from "../common/SectionHeading";

export default function WhyNowSection() {
  const items = [
    {
      icon: <Cpu size={24} />,
      title: "매일 기술을 만드는 사람들",
      desc: "2001년부터 DB, APM, 인프라 모니터링 소프트웨어를 직접 만들어 온 기술 기업. 새로운 도구를 가장 빠르게 익힐 수 있는 DNA를 가지고 있습니다.",
    },
    {
      icon: <Layers size={24} />,
      title: "앱 채팅을 넘어서는 시점",
      desc: "ChatGPT, Claude 앱 — 많은 분들이 써봤죠. 하지만 파일을 직접 만들고, 도구를 연결하고, 자동화까지 하는 건 다른 차원의 이야기입니다.",
    },
    {
      icon: <Clock size={24} />,
      title: "미루면 격차가 됩니다",
      desc: "'나중에 해야지'가 6개월 뒤에는 따라잡기 어려운 차이가 됩니다. 같이 시작하면 훨씬 쉽습니다.",
    },
  ];

  return (
    <section id="why-now" className="py-32 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
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
              className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:border-orange-500/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
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
