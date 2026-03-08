import { motion } from "motion/react";
import { Sun, Moon, Sparkles } from "lucide-react";
import UnicornEmbed from "../common/UnicornEmbed";

export default function HeroSection({
  isDarkMode,
  onToggleTheme,
}: {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <UnicornEmbed />

      {/* Watermark Cover - Forced to cover the Unicorn Studio badge */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-[#0a0a0a] z-[999] pointer-events-none"></div>

      <div className="absolute top-6 right-6 z-50">
        <motion.button
          onClick={onToggleTheme}
          className="relative w-10 h-10 rounded-xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md text-zinc-400 hover:text-white hover:border-white/20 hover:bg-zinc-800/80 transition-colors duration-200 cursor-pointer overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle theme"
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={false}
            animate={{
              y: isDarkMode ? 0 : -40,
              opacity: isDarkMode ? 1 : 0,
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Sun size={18} />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={false}
            animate={{
              y: isDarkMode ? 40 : 0,
              opacity: isDarkMode ? 0 : 1,
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Moon size={18} />
          </motion.div>
        </motion.button>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-medium mb-8">
            <Sparkles size={14} />
            <span>EXEM Claude Code Class</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[1.1] mb-8">
            '나중에 해야지' 했던 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
              Claude Code,
            </span>
            <br />
            지금이 기회입니다.
          </h1>

          <p className="text-xl md:text-2xl text-white font-medium leading-relaxed max-w-2xl mx-auto">
            바빠서 미루게 되는 Claude Code, <br />
            지금 같이 해봅시다.
            <br />
            앱에서 채팅하던 때와는 차원이 다른 <br />
            결과물, 자동화가 실제로 가능해집니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
