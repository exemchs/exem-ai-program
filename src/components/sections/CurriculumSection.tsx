import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import SectionHeading from "../common/SectionHeading";

const curriculum = [
  {
    day: 1,
    title: "기본기 마스터",
    desc: "Claude Code와 인사하고, 첫 번째 자동화 스크립트를 만들어봅니다.",
    topics: ["AI에게 잘 시키는 법", "왜 Claude인가", "첫 번째 자동화 스크립트"],
  },
  {
    day: 2,
    title: "파일 다루기",
    desc: "여러 파일을 동시에 수정하고, 프로젝트 구조를 이해하는 방법을 배웁니다.",
    topics: ["프로젝트 구조 파악", "다중 파일 동시 수정", "코드 리팩토링 기초"],
  },
  {
    day: 3,
    title: "도구 연결하기",
    desc: "MCP를 활용해 외부 도구(Slack, Notion 등)와 연동하는 방법을 익힙니다.",
    topics: ["MCP 개념 이해", "외부 API 연동", "데이터 가져오기 및 가공"],
  },
  {
    day: 4,
    title: "나만의 Skill",
    desc: "자주 쓰는 명령어를 커스텀 Skill로 만들어 업무 효율을 극대화합니다.",
    topics: ["커스텀 Skill 제작", "반복 업무 자동화", "나만의 명령어 세팅"],
  },
  {
    day: 5,
    title: "실전 프로젝트",
    desc: "배운 내용을 종합하여 나만의 자동화 파이프라인을 완성합니다.",
    topics: ["실전 파이프라인 구축", "에러 핸들링", "과정 수료 및 졸업"],
  },
];

export default function CurriculumSection() {
  const [activeDay, setActiveDay] = useState(1);

  return (
    <section
      id="curriculum"
      className="py-28 bg-zinc-900/30 border-y border-white/5"
    >
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeading subtitle="Curriculum">
          하루 1시간씩,
          <br />딱 5일이면 충분합니다
        </SectionHeading>

        <div className="flex flex-col md:flex-row gap-4 h-[500px]">
          {curriculum.map((item) => (
            <div
              key={item.day}
              onMouseEnter={() => setActiveDay(item.day)}
              onClick={() => setActiveDay(item.day)}
              className={`relative overflow-hidden rounded-3xl border border-white/5 transition-all duration-500 ease-in-out cursor-pointer flex flex-col justify-end p-8 ${activeDay === item.day ? "flex-[3] bg-zinc-800" : "flex-[1] bg-black hover:bg-zinc-900"}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 ${activeDay === item.day ? "opacity-100" : "opacity-0"}`}
              ></div>
              {activeDay === item.day && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity duration-500"></div>
              )}

              <div className="relative z-20">
                <h3
                  className={`font-bold text-white transition-all duration-500 ${activeDay === item.day ? "text-5xl mb-6" : "text-3xl mb-2"}`}
                >
                  Day {item.day}
                </h3>
                <div
                  className={`overflow-hidden transition-all duration-500 ${activeDay === item.day ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <h4 className="font-semibold text-white text-xl mb-3">
                    {item.title}
                  </h4>
                  <p className="text-zinc-300 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <ul className="space-y-2">
                    {item.topics.map((topic, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-zinc-400"
                      >
                        <CheckCircle2 size={14} className="text-orange-400" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
