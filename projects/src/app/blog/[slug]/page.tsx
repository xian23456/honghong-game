import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/blog-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const id = parseInt(slug, 10);
  if (isNaN(id)) notFound();

  const post = await getPostById(id);
  if (!post) notFound();

  const paragraphs = post.content.split("\n").filter((p: string) => p.trim());

  const formattedDate = new Date(post.created_at).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Back */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-rose-400 transition-colors hover:text-rose-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回列表
        </Link>

        {/* Article */}
        <article className="rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-rose-100/50 backdrop-blur-sm sm:p-8">
          <h1 className="text-2xl font-bold text-stone-800 sm:text-3xl">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-stone-400">{formattedDate}</p>

          <div className="mt-6 space-y-4">
            {paragraphs.map((paragraph: string, i: number) => (
              <p
                key={i}
                className="text-[15px] leading-7 text-stone-600"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Back to home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            去练习哄人
          </Link>
        </div>
      </div>
    </div>
  );
}
