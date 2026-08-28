"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  scenario: string;
  score: number;
  result: string;
  playedAt: string;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUserId(data.user.id);
      })
      .catch(() => {});

    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) setEntries(data.leaderboard);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `${rank}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-rose-50 to-pink-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <div className="text-3xl mb-1">🏆</div>
          <h1 className="text-xl font-bold text-gray-800">排行榜</h1>
          <p className="text-xs text-gray-400 mt-1">通关成功 · 按好感度分数排名 · 前20名</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">加载中...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🏅</div>
            <p className="text-sm text-gray-400">还没有人通关上榜</p>
            <p className="text-xs text-gray-300 mt-1">成为第一个上榜的人吧！</p>
            <Link
              href="/"
              className="inline-block mt-4 px-4 py-2 rounded-full bg-rose-500 text-white text-sm hover:bg-rose-600 transition-colors"
            >
              去挑战
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => {
              const isCurrentUser = currentUserId === entry.userId;
              const isTop3 = entry.rank <= 3;
              return (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                    isCurrentUser
                      ? "bg-rose-100/80 ring-2 ring-rose-300 shadow-sm"
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                >
                  <div className={`w-8 text-center text-sm font-bold ${isTop3 ? "text-lg" : "text-gray-400"}`}>
                    {getMedalEmoji(entry.rank)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-medium truncate ${isCurrentUser ? "text-rose-600" : "text-gray-700"}`}>
                        {entry.username}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white">我</span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 truncate mt-0.5">{entry.scenario}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${isTop3 ? "text-amber-500" : "text-gray-600"}`}>
                      {entry.score}
                    </div>
                    <div className="text-[10px] text-gray-300">{formatTime(entry.playedAt)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
