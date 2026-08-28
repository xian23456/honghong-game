import Link from "next/link";
import { getAllPosts } from "@/lib/blog-data";
import { GenerateButton } from "@/components/generate-button";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-rose-400 transition-colors hover:text-rose-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          <h1 className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-3xl font-bold text-transparent">
            恋爱攻略
          </h1>
          <p className="mt-2 text-sm text-stone-400">
            帮你少走弯路的恋爱沟通技巧
          </p>
        </div>

        {/* Generate Button */}
        <div className="mb-4">
          <GenerateButton />
        </div>

        {/* Articles */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group block rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-rose-100/50 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-rose-200/60"
            >
              <h2 className="text-lg font-semibold text-stone-800 transition-colors group-hover:text-rose-600">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                {post.summary}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs text-rose-400 transition-colors group-hover:text-rose-500">
                <span>阅读全文</span>
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-stone-400">还没有文章，快去生成一篇吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
