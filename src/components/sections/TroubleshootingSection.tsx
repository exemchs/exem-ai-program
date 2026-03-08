import { AlertCircle, Play } from "lucide-react";
import { OS_KEYS, type OsType } from "../../constants/os";

export default function TroubleshootingSection({ os }: { os: OsType }) {
  const keys = OS_KEYS[os];
  return (
    <section className="py-24 bg-[#d0f100]/5 border-y border-[#d0f100]/10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <AlertCircle className="text-[#d0f100]" size={32} />
          <h2 className="text-3xl font-medium text-[#fff3d7]">
            잠시 멈추고 싶다면
          </h2>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#100d0a]/50 border border-[#fff3d7]/[0.04]">
            <h3 className="text-lg font-medium text-[#fff3d7] mb-4 flex items-center gap-2">
              <Play size={18} className="text-green-400" /> 다시 시작할 때
            </h3>
            <ol className="list-decimal list-inside text-[#fff3d7]/55 space-y-2">
              <li>Cursor 실행</li>
              <li>
                File → Open Folder →{" "}
                <code className="text-[#d0f100] bg-[#d0f100]/10 px-1.5 py-0.5 rounded">
                  exem-claude-code-class
                </code>
              </li>
              <li>
                <code className="text-[#d0f100] bg-[#d0f100]/10 px-1.5 py-0.5 rounded">
                  {keys.openTerminal}
                </code>{" "}
                터미널 열기
              </li>
              <li>
                <code className="text-[#d0f100] bg-[#d0f100]/10 px-1.5 py-0.5 rounded">
                  claude
                </code>{" "}
                입력
              </li>
              <li>"이어서 해줘" 또는 /(원하는 day) 입력</li>
            </ol>
          </div>

          <div className="p-6 rounded-2xl bg-[#100d0a]/50 border border-[#fff3d7]/[0.04]">
            <h3 className="text-lg font-medium text-[#fff3d7] mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-red-400" /> 이어하기가 안
              될 때
            </h3>
            <p className="text-[#fff3d7]/55 mb-4">
              증상:{" "}
              <code className="text-red-300 bg-red-500/10 px-1.5 py-0.5 rounded">
                command not found: claude
              </code>
            </p>
            <p className="text-sm text-[#fff3d7]/40 mb-4">
              Cursor에서 새 터미널을 열면 발생할 수 있어요.
            </p>
            <ul className="list-disc list-inside text-[#fff3d7]/55 space-y-2">
              <li>
                방법 1: {keys.osLabel}라면{" "}
                <code className="text-[#d0f100] bg-[#d0f100]/10 px-1.5 py-0.5 rounded">
                  {keys.shellReload}
                </code>{" "}
                또는 터미널 재시작
              </li>
              <li>방법 2: Claude Code 재설치</li>
              <li>
                방법 3: Cursor를 완전히 종료(
                <code className="text-[#d0f100] bg-[#d0f100]/10 px-1.5 py-0.5 rounded">
                  {keys.quit}
                </code>
                ) 후 다시 실행
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
