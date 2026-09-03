'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Message } from '@/app/types';
import Game from '@/components/game';
import Review from '@/components/review';

type GamePhase = 'home' | 'preview' | 'playing' | 'review';
type GameResult = 'success' | 'failure' | 'timeout' | 'quit';

const AVATAR_URLS = [
  '/avatar-1.jpeg',
  '/avatar-2.jpeg',
  '/avatar-3.jpeg',
  '/avatar-4.jpeg',
  '/avatar-5.jpeg',
  '/avatar-6.jpeg',
];

interface ReviewData {
  summary: string;
  good: Array<{ quote: string; reason: string }>;
  bad: Array<{ quote: string; reason: string }>;
  suggestion: string;
  betterExpressions: string[];
  hiddenNeed: string;
}

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  // Game data
  const [scenario, setScenario] = useState('');
  const [hiddenNeed, setHiddenNeed] = useState('');
  const [openingMessage, setOpeningMessage] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_URLS[0]);

  // Review data
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [finalMessages, setFinalMessages] = useState<Message[]>([]);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUsername(data.user.username);
          setUserId(data.user.id);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleStart = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/start', { method: 'POST' });
      const data = await res.json();
      setScenario(data.scenario);
      setHiddenNeed(data.hiddenNeed);
      setOpeningMessage(data.openingMessage);
      setAvatarUrl(AVATAR_URLS[Math.floor(Math.random() * AVATAR_URLS.length)]);
      setPhase('preview');
    } catch (error) {
      console.error('Failed to start game:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGameEnd = useCallback(async (result: GameResult, messages: Message[], _angerLevel: number) => {
    setGameResult(result);
    setFinalMessages(messages);
    setPhase('review');
    setIsReviewLoading(true);

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario,
          hiddenNeed,
          messages,
          gameResult: result,
        }),
      });
      const data = await res.json();
      setReviewData(data);
    } catch (error) {
      console.error('Failed to get review:', error);
    } finally {
      setIsReviewLoading(false);
    }

    // Save game record for logged-in users
    if (userId) {
      try {
        const recordResult = result === 'success' ? 'success' : result === 'failure' ? 'failure' : 'ended';
        // 轮数 = 用户发送的消息数
        const rounds = messages.filter((m) => m.role === 'user').length;
        await fetch('/api/records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenario,
            rounds,
            result: recordResult,
          }),
        });
        setNotification('您的游戏记录已经保存');
      } catch {
        // silently fail
      }
    } else {
      setNotification('登录后可保存你的游戏记录');
    }

    // Auto-dismiss notification after 4 seconds
    setTimeout(() => setNotification(null), 4000);
  }, [scenario, hiddenNeed, userId]);

  const handleRestart = useCallback(() => {
    setPhase('home');
    setScenario('');
    setHiddenNeed('');
    setOpeningMessage('');
    setGameResult(null);
    setFinalMessages([]);
    setReviewData(null);
  }, []);

  if (phase === 'home') {
    return <HomePage onStart={handleStart} isLoading={isLoading} username={username} onLogout={handleLogout} />;
  }

  if (phase === 'preview') {
    return (
      <PreviewPage
        avatarUrl={avatarUrl}
        scenario={scenario}
        openingMessage={openingMessage}
        onConfirm={() => setPhase('playing')}
        onCancel={handleStart}
      />
    );
  }

  if (phase === 'playing') {
    return (
      <Game
        scenario={scenario}
        hiddenNeed={hiddenNeed}
        openingMessage={openingMessage}
        avatarUrl={avatarUrl}
        onGameEnd={handleGameEnd}
      />
    );
  }

  return (
    <>
      {notification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-gray-800/90 text-white text-xs shadow-lg animate-fade-in">
          {notification}
        </div>
      )}
      <Review
        gameResult={gameResult!}
        scenario={scenario}
        messages={finalMessages}
        reviewData={reviewData}
        isLoading={isReviewLoading}
        onRestart={handleRestart}
        avatarUrl={avatarUrl}
      />
    </>
  );
}

function HomePage({ onStart, isLoading }: { onStart: () => void; isLoading: boolean; username: string; onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFE8EC] to-[#FDE2E8] flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center animate-fade-in">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-xl shadow-pink-200/50 animate-float">
            <span className="text-5xl">💕</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl text-gray-900 mb-3">
          <span className="highlight-rose">哄哄</span>模拟器
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-2 font-semibold">
          AI 情景练习小游戏
        </p>
        <p className="text-gray-400 text-xs leading-relaxed mb-10 max-w-xs mx-auto">
          模拟真实情侣聊天场景，练习如何理解对方情绪、进行有效沟通。
          让她的愤怒值降到 <span className="marker-rose px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600 font-semibold">0</span>，你能做到吗？
        </p>

        {/* Start button */}
        <button
          onClick={onStart}
          disabled={isLoading}
          className="w-full py-4 px-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-lg font-bold rounded-full shadow-lg shadow-pink-300/40 hover:shadow-xl hover:shadow-pink-300/60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              正在生成场景...
            </span>
          ) : (
            '开始挑战'
          )}
        </button>

        {/* Rules */}
        <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-pink-100">
          <h3 className="text-xs font-semibold text-gray-600 mb-3">游戏规则</h3>
          <div className="space-y-2 text-xs text-gray-500 text-left">
            <div className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5">●</span>
              <span>AI 女朋友会随机生气，你需要通过聊天哄好她</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5">●</span>
              <span>愤怒值初始 60，降到 0 即成功，到 100 则失败</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5">●</span>
              <span>最多 20 轮对话，每轮她会用语音回复你</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5">●</span>
              <span>结束后会有详细复盘，帮你提升沟通能力</span>
            </div>
          </div>
        </div>

        {/* Blog entry */}
        <Link
          href="/blog"
          className="mt-5 flex items-center justify-center gap-2 py-3 px-6 bg-white/70 backdrop-blur-sm text-rose-500 text-sm font-semibold rounded-full border border-rose-200/60 hover:bg-white hover:border-rose-300 hover:shadow-sm transition-all duration-200"
        >
          <span>📖</span>
          <span>恋爱攻略</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>

        {/* Leaderboard entry */}
        <Link
          href="/leaderboard"
          className="mt-3 flex items-center justify-center gap-2 py-3 px-6 bg-white/70 backdrop-blur-sm text-amber-600 text-sm font-medium rounded-2xl border border-amber-200/60 hover:bg-white hover:border-amber-300 hover:shadow-sm transition-all duration-200"
        >
          <span>🏆</span>
          <span>排行榜</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function PreviewPage({
  avatarUrl,
  scenario,
  openingMessage,
  onConfirm,
  onCancel,
}: {
  avatarUrl: string;
  scenario: string;
  openingMessage: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFE8EC] to-[#FDE2E8] flex items-center justify-center p-4">
      <div className="max-w-sm w-full animate-fade-in space-y-4">
        {/* Scenario background card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-pink-200/20 border border-pink-100/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
              <span className="text-xs">📖</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-700">场景背景</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed pl-8">
            {scenario}
          </p>
        </div>

        {/* Chat preview card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-pink-200/30 border border-pink-100/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/30 shadow-sm">
              <img src={avatarUrl} alt="女朋友" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm">女朋友</h3>
              <p className="text-white/70 text-xs">发来了一条消息</p>
            </div>
          </div>

          {/* Chat area */}
          <div className="p-5">
            <div className="flex items-start gap-2.5 animate-slide-in-left">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-pink-100">
                <img src={avatarUrl} alt="女朋友" className="w-full h-full object-cover" />
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl rounded-tl-md px-4 py-3 max-w-[75%] shadow-sm border border-pink-100/50">
                <p className="text-sm text-gray-700 leading-relaxed">{openingMessage}</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-5 pb-5 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              换一个
            </button>
            <button
              onClick={onConfirm}
              className="flex-[2] py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-pink-300/40 hover:shadow-xl hover:shadow-pink-300/60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              开始聊天
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
