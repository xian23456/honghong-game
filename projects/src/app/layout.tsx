import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
  title: '哄哄模拟器 - AI 情景练习小游戏',
  description: '通过模拟真实情侣聊天，练习如何理解对方情绪、进行沟通和安慰。让愤怒值降到 0，你能做到吗？',
  keywords: ['哄哄模拟器', 'AI聊天', '情景练习', '沟通技巧', '情绪管理'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body className="antialiased">
        <Navbar />
        <main className="pt-12">
          {children}
        </main>
      </body>
    </html>
  );
}
