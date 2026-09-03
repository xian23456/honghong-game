"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface GameRecord {
  id: number;
  scenario: string;
  rounds: number;
  result: string;
  played_at: string;
}

interface UserProfile {
  id: number;
  username: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("未登录");
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          return fetch(`/api/records/${data.user.id}`);
        }
        throw new Error("未登录");
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.records) setRecords(data.records);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getResultLabel = (result: string) => {
    if (result === "success") return { text: "通关", color: "text-emerald-500 bg-emerald-50" };
    if (result === "failure") return { text: "失败", color: "text-rose-500 bg-rose-50" };
    return { text: "结束", color: "text-gray-500 bg-gray-50" };
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-rose-50 to-pink-50 flex items-center justify-center">
        <div className="text-sm text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-rose-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-3">请先登录</p>
          <Link href="/login" className="text-sm text-rose-500 hover:text-rose-600">去登录</Link>
        </div>
      </div>
    );
  }

  const successCount = records.filter((r) => r.result === "success").length;
  const bestRounds = records.filter((r) => r.result === "success").reduce((min, r) => Math.min(min, r.rounds), Infinity);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-rose-50 to-pink-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold">
            {user.username[0].toUpperCase()}
          </div>
          <h1 className="text-lg font-bold text-gray-800">{user.username}</h1>
          <p className="text-xs text-gray-400 mt-1">
            注册于 {formatDate(user.createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/60 rounded-2xl p-3 text-center">
            <div className="text-lg font-bold text-gray-700">{records.length}</div>
            <div className="text-[10px] text-gray-400">总场次</div>
          </div>
          <div className="bg-white/60 rounded-2xl p-3 text-center">
            <div className="text-lg font-bold text-emerald-500">{successCount}</div>
            <div className="text-[10px] text-gray-400">通关次数</div>
          </div>
          <div className="bg-white/60 rounded-2xl p-3 text-center">
            <div className="text-lg font-bold text-amber-500">{successCount > 0 ? `${bestRounds} 轮` : "-"}</div>
            <div className="text-[10px] text-gray-400">最少轮数通关</div>
          </div>
        </div>

        <h2 className="text-sm font-semibold text-gray-700 mb-3">游戏记录</h2>

        {records.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-3xl mb-2">🎮</div>
            <p className="text-sm text-gray-400">还没有游戏记录</p>
            <Link
              href="/"
              className="inline-block mt-3 px-4 py-2 rounded-full bg-rose-500 text-white text-sm hover:bg-rose-600 transition-colors"
            >
              去挑战
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {records.map((record) => {
              const resultInfo = getResultLabel(record.result);
              return (
                <div key={record.id} className="bg-white/60 rounded-2xl p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-700 truncate">{record.scenario}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{formatDate(record.played_at)}</div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${resultInfo.color}`}>
                      {resultInfo.text}
                    </span>
                    <span className="text-sm font-bold text-gray-600">{record.rounds} 轮</span>
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
