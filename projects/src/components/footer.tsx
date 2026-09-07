export function Footer() {
  return (
    <footer className="max-w-lg mx-auto px-4 pb-10 text-center">
      <p className="text-xs text-gray-400">
        联系我们：
        <a
          href="mailto:805003705@qq.com"
          className="hover:text-rose-500 transition-colors"
        >
          805003705@qq.com
        </a>
        <span className="mx-2 text-gray-300">|</span>
        <a
          href="https://discord.gg/qCmkpGHsB"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-rose-500 transition-colors"
        >
          Discord 社群
        </a>
      </p>
      <p className="text-[11px] text-gray-300 mt-1">
        哄哄模拟器 · AI 情景练习小游戏
      </p>
    </footer>
  );
}
