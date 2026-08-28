"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUsername(data.user.username);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100">
      <div className="max-w-lg mx-auto px-4 h-12 flex items-center justify-between">
        <Link href="/" className="text-base font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
          哄哄模拟器
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/leaderboard" className="text-xs text-gray-500 hover:text-rose-500 transition-colors">
            排行榜
          </Link>
          {loading ? null : username ? (
            <>
              <Link href="/profile" className="text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors">
                {username}
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-xs text-gray-500 hover:text-rose-500 transition-colors">
                登录
              </Link>
              <Link
                href="/register"
                className="text-xs px-2.5 py-1 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
