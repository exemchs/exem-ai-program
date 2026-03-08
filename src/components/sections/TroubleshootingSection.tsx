import { AlertCircle, Play } from "lucide-react";

export default function TroubleshootingSection({ os }: { os: "mac" | "win" }) {
  return (
    <section className="py-24 bg-orange-500/5 border-y border-orange-500/10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <AlertCircle className="text-orange-400" size={32} />
          <h2 className="text-3xl font-semibold text-white">
            잠시 멈추고 싶다면
          </h2>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-black/50 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Play size={18} className="text-green-400" /> 다시 시작할 때
            </h3>
            <ol className="list-decimal list-inside text-zinc-400 space-y-2">
              <li>Cursor 실행</li>
              <li>
                File → Open Folder →{" "}
                <code className="text-orange-300 bg-orange-500/10 px-1.5 py-0.5 rounded">
                  exem-ai-curriculum-program
                </code>
              </li>
              <li>Cmd+J / Ctrl+J 터미널 열기</li>
              <li>
                <code className="text-orange-300 bg-orange-500/10 px-1.5 py-0.5 rounded">
                  claude
                </code>{" "}
                입력
              </li>
              <li>"이어서 해줘" 또는 /(원하는 day) 입력</li>
            </ol>
          </div>

          <div className="p-6 rounded-2xl bg-black/50 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-red-400" /> 이어하기가 안
              될 때
            </h3>
            <p className="text-zinc-400 mb-4">
              증상:{" "}
              <code className="text-red-300 bg-red-500/10 px-1.5 py-0.5 rounded">
                command not found: claude
              </code>
            </p>
            <p className="text-sm text-zinc-500 mb-4">
              Cursor에서 새 터미널을 열면 발생할 수 있어요.
            </p>
            <ul className="list-disc list-inside text-zinc-400 space-y-2">
              <li>
                방법 1: {os === "mac" ? "macOS라면" : "Windows라면"}{" "}
                <code className="text-orange-300 bg-orange-500/10 px-1.5 py-0.5 rounded">
                  {os === "mac" ? "source ~/.zshrc" : "source ~/.bashrc"}
                </code>{" "}
                또는 터미널 재시작
              </li>
              <li>방법 2: Claude Code 재설치</li>
              <li>방법 3: Cursor를 완전히 종료(Cmd+Q / Alt+F4) 후 다시 실행</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
