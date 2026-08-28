'use client';

import type { Message } from '@/app/types';

interface ReviewData {
  summary: string;
  good: Array<{ quote: string; reason: string }>;
  bad: Array<{ quote: string; reason: string }>;
  suggestion: string;
  betterExpressions: string[];
  hiddenNeed: string;
}

interface ReviewProps {
  gameResult: 'success' | 'failure' | 'timeout' | 'quit';
  scenario: string;
  messages: Message[];
  reviewData: ReviewData | null;
  isLoading: boolean;
  onRestart: () => void;
  avatarUrl: string;
}

export default function Review({
  gameResult,
  scenario,
  messages,
  reviewData,
  isLoading,
  onRestart,
  avatarUrl,
}: ReviewProps) {

  const getResultInfo = () => {
    switch (gameResult) {
      case 'success':
        return { emoji: '🎉', title: '挑战成功！', subtitle: '你成功哄好了女朋友' };
      case 'failure':
        return { emoji: '💔', title: '挑战失败', subtitle: '女朋友彻底爆发了...' };
      case 'timeout':
        return { emoji: '⏰', title: '本局结束', subtitle: '达到了最大对话轮数' };
      case 'quit':
        return { emoji: '🏳️', title: '主动结束', subtitle: '你选择了结束本局挑战' };
    }
  };

  const resultInfo = getResultInfo();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F5] to-[#FFE8EC] overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Result header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-4">{resultInfo.emoji}</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{resultInfo.title}</h1>
          <p className="text-gray-500 text-sm">{resultInfo.subtitle}</p>
        </div>

        {/* Scenario recap */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-4 border border-pink-100/50 shadow-sm animate-slide-up">
          <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-xs">📋</span>
            本局场景
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{scenario}</p>
        </div>

        {/* Chat history summary */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-4 border border-pink-100/50 shadow-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-xs">💬</span>
            对话回顾
          </h3>
          <div className="space-y-2.5 max-h-52 overflow-y-auto custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full overflow-hidden mr-2 flex-shrink-0 shadow-sm border border-pink-100">
                    <img src={avatarUrl} alt="女朋友" className="w-full h-full object-cover" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-pink-50 text-pink-700 rounded-br-sm'
                      : 'bg-gray-50 text-gray-600 rounded-bl-sm'
                  }`}
                >
                  <span className="text-[10px] text-gray-400 block mb-0.5">
                    {msg.role === 'user' ? '你' : '女朋友'}
                  </span>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-10 h-10 mx-auto mb-3 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">正在生成复盘分析...</p>
          </div>
        )}

        {/* Review content */}
        {reviewData && !isLoading && (
          <div className="space-y-4 animate-fade-in">
            {/* Overall summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-pink-100/50 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-xs">📝</span>
                整体评价
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{reviewData.summary}</p>
            </div>

            {/* Good points */}
            {reviewData.good.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-emerald-100/50 shadow-sm">
                <h3 className="text-sm font-semibold text-emerald-600 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✅</span>
                  做得好的地方
                </h3>
                <div className="space-y-4">
                  {reviewData.good.map((item, i) => (
                    <div key={i} className="space-y-2">
                      {/* User quote - visually distinct */}
                      <div className="relative pl-4 border-l-3 border-emerald-300">
                        <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-emerald-400 flex items-center justify-center">
                          <span className="text-[6px] text-white font-bold">你</span>
                        </div>
                        <p className="text-sm text-emerald-800 font-medium leading-relaxed bg-emerald-50/70 rounded-lg px-3 py-2">
                          &ldquo;{item.quote}&rdquo;
                        </p>
                      </div>
                      {/* Analysis */}
                      <div className="pl-4 ml-1">
                        <p className="text-xs text-gray-500 leading-relaxed">
                          <span className="text-emerald-500 font-semibold">分析：</span>{item.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bad points */}
            {reviewData.bad.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-rose-100/50 shadow-sm">
                <h3 className="text-sm font-semibold text-rose-600 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-xs">⚠️</span>
                  可以改进的地方
                </h3>
                <div className="space-y-4">
                  {reviewData.bad.map((item, i) => (
                    <div key={i} className="space-y-2">
                      {/* User quote - visually distinct */}
                      <div className="relative pl-4 border-l-3 border-rose-300">
                        <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-rose-400 flex items-center justify-center">
                          <span className="text-[6px] text-white font-bold">你</span>
                        </div>
                        <p className="text-sm text-rose-800 font-medium leading-relaxed bg-rose-50/70 rounded-lg px-3 py-2">
                          &ldquo;{item.quote}&rdquo;
                        </p>
                      </div>
                      {/* Analysis */}
                      <div className="pl-4 ml-1">
                        <p className="text-xs text-gray-500 leading-relaxed">
                          <span className="text-rose-500 font-semibold">分析：</span>{item.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestion */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-blue-100/50 shadow-sm">
              <h3 className="text-sm font-semibold text-blue-600 mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs">💡</span>
                改进建议
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{reviewData.suggestion}</p>
            </div>

            {/* Better expressions */}
            {reviewData.betterExpressions.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-violet-100/50 shadow-sm">
                <h3 className="text-sm font-semibold text-violet-600 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-xs">✨</span>
                  更好的说法
                </h3>
                <div className="space-y-2">
                  {reviewData.betterExpressions.map((expr, i) => (
                    <div key={i} className="px-4 py-3 bg-gradient-to-r from-violet-50/80 to-purple-50/50 rounded-xl text-sm text-violet-800 leading-relaxed border border-violet-100/50">
                      <span className="text-violet-400 mr-1.5">💬</span>{expr}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden need reveal */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-5 border border-pink-200/50 shadow-sm">
              <h3 className="text-sm font-semibold text-pink-600 mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-200 flex items-center justify-center text-xs">🔍</span>
                她的隐藏诉求
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{reviewData.hiddenNeed}</p>
            </div>
          </div>
        )}

        {/* Restart button */}
        {!isLoading && reviewData && (
          <div className="mt-8 mb-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={onRestart}
              className="w-full py-4 px-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-pink-300/40 hover:shadow-xl hover:shadow-pink-300/60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              再来一局
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
