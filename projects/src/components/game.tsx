'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Message } from '@/app/types';

interface GameProps {
  scenario: string;
  hiddenNeed: string;
  openingMessage: string;
  avatarUrl: string;
  onGameEnd: (result: 'success' | 'failure' | 'timeout' | 'quit', messages: Message[], angerLevel: number) => void;
}

export default function Game({ scenario, hiddenNeed, openingMessage, avatarUrl, onGameEnd }: GameProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: openingMessage },
  ]);
  const [angerLevel, setAngerLevel] = useState(60);
  const [angerChange, setAngerChange] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [emotion, setEmotion] = useState('生气');
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Clear anger change indicator after animation
  useEffect(() => {
    if (angerChange !== null) {
      const timer = setTimeout(() => setAngerChange(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [angerChange]);

  const playAudio = useCallback(async (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    try {
      const audio = new Audio(url);
      audioRef.current = audio;
      setIsPlayingAudio(true);
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
      await audio.play();
    } catch {
      setIsPlayingAudio(false);
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    const updatedMessages: Message[] = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(updatedMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario,
          hiddenNeed,
          messages,
          angerLevel,
          round,
          userMessage,
        }),
      });

      const data = await response.json();

      const newMessages: Message[] = [
        ...updatedMessages,
        { role: 'assistant' as const, content: data.reply },
      ];
      setMessages(newMessages);
      setAngerLevel(data.newAngerLevel);
      setAngerChange(data.angerChange);
      setRound(data.round);
      setEmotion(data.emotion);

      // Play audio
      if (data.audioUrl) {
        playAudio(data.audioUrl);
      }

      // Check game end
      if (data.gameEnded) {
        setTimeout(() => {
          onGameEnd(data.gameResult, newMessages, data.newAngerLevel);
        }, 2500);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, angerLevel, round, scenario, hiddenNeed, onGameEnd, playAudio]);

  const handleQuit = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onGameEnd('quit', messages, angerLevel);
  }, [messages, angerLevel, onGameEnd]);

  const getAngerColor = (level: number): string => {
    if (level <= 25) return '#34D399';
    if (level <= 50) return '#FBBF24';
    if (level <= 75) return '#FB923C';
    return '#F43F5E';
  };

  const getAngerGradient = (level: number): string => {
    if (level <= 25) return 'linear-gradient(90deg, #6EE7B7, #34D399)';
    if (level <= 50) return 'linear-gradient(90deg, #FCD34D, #FBBF24)';
    if (level <= 75) return 'linear-gradient(90deg, #FB923C, #F97316)';
    return 'linear-gradient(90deg, #F43F5E, #E11D48)';
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-[#FFF5F5] to-[#FFE8EC]">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3 bg-white/70 backdrop-blur-md border-b border-pink-100/50">
        <div className="max-w-lg mx-auto">
          {/* Top row: avatar + quit */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 shadow-md shadow-pink-200/50">
                  <img src={avatarUrl} alt="女朋友" className="w-full h-full object-cover" />
                </div>
                {isPlayingAudio && (
                  <div className="absolute inset-0 rounded-full border-2 border-pink-400 animate-pulse-ring" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700">女朋友</div>
                <div className="text-xs text-gray-400">{emotion}</div>
              </div>
            </div>
            <button
              onClick={() => setShowQuitConfirm(true)}
              className="text-xs text-gray-400 hover:text-rose-500 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-rose-200 hover:bg-rose-50 transition-all"
            >
              结束本局
            </button>
          </div>

          {/* Anger meter */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-12">愤怒值</span>
            <div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full anger-bar-fill ${angerLevel >= 75 ? 'animate-shake' : ''}`}
                style={{
                  width: `${angerLevel}%`,
                  background: getAngerGradient(angerLevel),
                }}
              />
            </div>
            <div className="flex items-center gap-1 min-w-[4rem] justify-end">
              {angerChange !== null && (
                <span
                  className={`text-xs font-bold animate-fade-in ${angerChange < 0 ? 'text-emerald-500' : angerChange > 0 ? 'text-rose-500' : 'text-gray-400'}`}
                >
                  {angerChange > 0 ? '+' : ''}{angerChange}
                </span>
              )}
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: getAngerColor(angerLevel) }}
              >
                {angerLevel}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-1.5 text-right">
            第 {round}/20 轮
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
        <div className="max-w-lg mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} chat-bubble`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 shadow-sm border border-pink-100">
                  <img src={avatarUrl} alt="女朋友" className="w-full h-full object-cover" />
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl rounded-br-sm shadow-md shadow-pink-200/30'
                    : 'bg-white text-gray-700 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100/50'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start chat-bubble">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 shadow-sm border border-pink-100">
                <img src={avatarUrl} alt="女朋友" className="w-full h-full object-cover" />
              </div>
              <div className="bg-white px-5 py-3.5 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100/50">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-4 pb-4 pt-3 bg-white/70 backdrop-blur-md border-t border-pink-100/50">
        <div className="max-w-lg mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="说点什么来哄哄她..."
              maxLength={300}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-white rounded-2xl text-sm outline-none border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all disabled:opacity-50 placeholder:text-gray-300"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl text-sm font-medium hover:shadow-lg hover:shadow-pink-200/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              发送
            </button>
          </div>
          <div className="flex justify-between mt-1.5 px-1">
            <span className="text-xs text-gray-300">按 Enter 发送</span>
            <span className="text-xs text-gray-300">{input.length}/300</span>
          </div>
        </div>
      </div>

      {/* Quit confirmation modal */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 mx-4 max-w-xs w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">结束本局？</h3>
            <p className="text-sm text-gray-500 mb-6">确定要结束当前挑战吗？结束后将进入复盘环节。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                继续挑战
              </button>
              <button
                onClick={handleQuit}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium hover:shadow-md transition-all"
              >
                结束本局
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
