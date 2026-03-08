import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import SectionHeading from "../common/SectionHeading";

const curriculum = [
  {
    day: 1,
    title: "AI를 잘 시키는 법",
    desc: "프롬프트가 아닌 '컨텍스트 엔지니어링'으로 AI를 제대로 활용하는 법을 배웁니다.",
    topics: ["CO-STAR 프레임워크", "CRIT 역질문 기법", "CLAUDE.md 작성"],
  },
  {
    day: 2,
    title: "내 업무를 AI로 해보기",
    desc: "어떤 업무를 AI에게 맡기고, 어떤 업무는 직접 해야 하는지 판단하는 기준을 세웁니다.",
    topics: ["업무 위임 프레임워크", "AI에게 효과적으로 위임하기", "AI의 한계 이해"],
  },
  {
    day: 3,
    title: "도구 연결하기",
    desc: "MCP를 활용해 Notion, Google Calendar 등 외부 도구와 연동하는 방법을 익힙니다.",
    topics: ["MCP 개념 이해", "외부 도구 직접 연결", "연결된 도구로 업무 처리"],
  },
  {
    day: 4,
    title: "자동화하기",
    desc: "반복 업무를 커스텀 Skill로 만들어 자동화하고, 검증 루프로 품질을 보장합니다.",
    topics: ["커스텀 Skill 제작", "반복 업무 자동화", "검증 루프 설계"],
  },
  {
    day: 5,
    title: "졸업",
    desc: "배운 내용을 종합하여 나만의 자동화 워크플로를 완성하고 팀에 공유합니다.",
    topics: ["전체 과정 복습", "졸업 프로젝트", "팀 공유 및 확산"],
  },
];

export default function CurriculumSection() {
  const [activeDay, setActiveDay] = useState(1);

  return (
    <section id="curriculum" className="py-28">
      <div className="max-w-5xl mx-auto px-6">
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
              className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ease-in-out cursor-pointer flex flex-col justify-end p-8 ${activeDay === item.day ? "flex-[3] bg-[#1a2234] border-[#1a2234]" : "flex-[1] bg-white border-[#E2E5EB] hover:bg-[#F0F3F9]"}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-t from-[#1a2234]/80 via-[#1a2234]/20 to-transparent z-10 transition-opacity duration-500 ${activeDay === item.day ? "opacity-100" : "opacity-0"}`}
              ></div>
              {activeDay === item.day && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/15 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity duration-500"></div>
              )}

              <div className="relative z-20">
                <h3
                  className={`font-normal transition-all duration-500 ${activeDay === item.day ? "text-5xl mb-6 text-white" : "text-3xl mb-2 text-[#1a2234]"}`}
                >
                  Day {item.day}
                </h3>
                <div
                  className={`overflow-hidden transition-all duration-500 ${activeDay === item.day ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <h4 className="font-normal text-white text-xl mb-3">
                    {item.title}
                  </h4>
                  <p className="text-white/70 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <ul className="space-y-2">
                    {item.topics.map((topic, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-white/55"
                      >
                        <CheckCircle2 size={14} className="text-[#3B82F6]" />
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
