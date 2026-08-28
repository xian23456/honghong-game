import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, TTSClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import { generateFallbackReply, resolveGameResult } from '@/lib/fallback-game';
import type { Message, ChatResponse } from '@/app/types';

function buildGamePrompt(
  scenario: string,
  hiddenNeed: string,
  angerLevel: number,
  emotion: string
): string {
  return `你是一个正在生气的男朋友的女朋友。你在玩一个叫"哄哄模拟器"的游戏。

## 当前场景
${scenario}

## 你真正在意的（隐藏诉求，不要直接说出来）
${hiddenNeed}

## 当前状态
- 愤怒值：${angerLevel}/100（初始60，0=完全消气，100=彻底爆发）
- 当前情绪：${emotion}

## 你的回复规则
1. 回复1-2句话，像正常微信聊天
2. 不要写成长篇解释
3. 每次最多100字
4. 根据当前愤怒值调整语气：
   - 愤怒值>75：非常生气、冷淡、强硬、不耐烦
   - 愤怒值50-75：生气但开始有所缓和
   - 愤怒值25-50：明显缓和，愿意交流
   - 愤怒值<25：基本消气，语气柔和
5. 必须保持角色一致性，不能突然改变矛盾原因
6. 如果用户说完全无关的话，不要顺着聊，保持当前情绪和矛盾
7. 不要直接透露"隐藏诉求"，但可以通过暗示让用户自己去发现

## 愤怒值变化规则
- 根据用户说的话判断愤怒值变化
- 有效安慰（真诚共情、承认错误、理解感受）：-5到-25
- 激怒（敷衍、辩解、否定感受、讲大道理）：+5到+25
- 没明显效果：-3到+3
- 单轮变化范围：-30到+30

你必须严格以JSON格式输出，不要输出任何其他内容：
{
  "reply": "女朋友的回复内容",
  "angerChange": 愤怒值变化数字,
  "newAngerLevel": 新的愤怒值数字,
  "emotion": "当前情绪状态描述（简短）",
  "emotionIntensity": 情绪强度0到1之间的数字
}`;
}

function getTTSParams(angerLevel: number): { speechRate: number; loudnessRate: number } {
  if (angerLevel >= 75) {
    return { speechRate: 25, loudnessRate: 20 };
  } else if (angerLevel >= 50) {
    return { speechRate: 10, loudnessRate: 10 };
  } else if (angerLevel >= 25) {
    return { speechRate: -5, loudnessRate: 0 };
  } else {
    return { speechRate: -20, loudnessRate: -10 };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      scenario,
      hiddenNeed,
      messages,
      angerLevel,
      round,
      userMessage,
    }: {
      scenario: string;
      hiddenNeed: string;
      messages: Message[];
      angerLevel: number;
      round: number;
      userMessage: string;
    } = body;

    if (!scenario || !userMessage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();

    // Determine current emotion based on anger level
    let currentEmotion = '';
    if (angerLevel >= 75) currentEmotion = '非常生气';
    else if (angerLevel >= 50) currentEmotion = '生气但有所缓和';
    else if (angerLevel >= 25) currentEmotion = '情绪缓和，愿意交流';
    else currentEmotion = '基本消气，语气柔和';

    // Build conversation history for LLM
    const llmMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system' as const, content: buildGamePrompt(scenario, hiddenNeed, angerLevel, currentEmotion) },
    ];

    // Add conversation history
    for (const msg of messages) {
      llmMessages.push({
        role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content,
      });
    }

    // Add current user message
    llmMessages.push({ role: 'user' as const, content: userMessage });

    // Call LLM；失败时使用简单规则模式兜底
    let chatData: Pick<ChatResponse, 'reply' | 'angerChange' | 'newAngerLevel' | 'emotion' | 'emotionIntensity'>;
    let llmAvailable = true;
    try {
      const llmClient = new LLMClient(config, customHeaders);
      const llmResponse = await llmClient.invoke(llmMessages, {
        model: 'doubao-seed-2-0-lite-260215',
        temperature: 0.85,
      });

      const content = llmResponse.content.trim();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse chat response from LLM');
      }

      chatData = JSON.parse(jsonMatch[0]) as ChatResponse;
    } catch (llmError) {
      console.error('LLM unavailable, using rule-based fallback:', llmError);
      chatData = generateFallbackReply(userMessage, angerLevel);
      llmAvailable = false;
    }

    // Clamp anger level
    const newAngerLevel = Math.max(0, Math.min(100, chatData.newAngerLevel));

    // Determine game result
    const newRound = round + 1;
    const { gameEnded, gameResult } = resolveGameResult(newAngerLevel, newRound);

    // Generate TTS（规则模式下跳过）
    let audioUrl = '';
    if (llmAvailable) {
      try {
        const ttsClient = new TTSClient(config, customHeaders);
        const { speechRate, loudnessRate } = getTTSParams(newAngerLevel);
        const ttsResponse = await ttsClient.synthesize({
          uid: `game-${Date.now()}`,
          text: chatData.reply,
          speaker: 'zh_female_meilinvyou_saturn_bigtts',
          audioFormat: 'mp3',
          sampleRate: 24000,
          speechRate,
          loudnessRate,
        });
        audioUrl = ttsResponse.audioUri;
      } catch (ttsError) {
        console.error('TTS generation failed:', ttsError);
        // Continue without audio - it's not critical
      }
    }

    return NextResponse.json({
      reply: chatData.reply,
      angerChange: chatData.angerChange,
      newAngerLevel,
      emotion: chatData.emotion,
      emotionIntensity: chatData.emotionIntensity,
      audioUrl,
      gameEnded,
      gameResult,
      round: newRound,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
