import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-rose-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          页面走丢了
        </h1>
        <p className="text-gray-500 mb-8">
          这里什么都没有，也许它被哄走了 🥺
        </p>

        <div className="flex items-center justify-center gap-3 mb-8">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold shadow-lg shadow-pink-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            回到首页
          </Link>
          <Link
            href="/leaderboard"
            className="px-5 py-2.5 rounded-full bg-white text-sm font-medium text-gray-600 border border-gray-200 hover:border-rose-300 hover:text-rose-500 transition-colors"
          >
            看看排行榜
          </Link>
        </div>

        <div className="text-sm text-gray-400">
          遇到问题？联系我们：
          <a
            href="mailto:805003705@qq.com"
            className="text-rose-500 hover:text-rose-600 transition-colors"
          >
            805003705@qq.com
          </a>
          <span className="mx-2 text-gray-300">|</span>
          <a
            href="https://discord.gg/qCmkpGHsB"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-500 hover:text-rose-600 transition-colors"
          >
            Discord 社群
          </a>
        </div>
      </div>
    </div>
  );
}
