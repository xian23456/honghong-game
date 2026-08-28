"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GenerateButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog/generate", { method: "POST" });
      if (!res.ok) throw new Error("生成失败");
      router.refresh();
    } catch {
      alert("生成失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="w-full rounded-2xl border-2 border-dashed border-rose-200 bg-white/40 p-4 text-sm font-medium text-rose-400 transition-all hover:border-rose-300 hover:bg-white/60 hover:text-rose-500 disabled:opacity-50"
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          AI 正在创作中...
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          AI 生成一篇新攻略
        </span>
      )}
    </button>
  );
}
