import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import type { Message, ReviewResponse } from '@/app/types';

function buildReviewPrompt(
  scenario: string,
  hiddenNeed: string,
  gameResult: string
): string {
  const resultText =
    gameResult === 'success'
      ? '挑战成功（愤怒值降到0）'
      : gameResult === 'failure'
        ? '挑战失败（愤怒值达到100）'
        : '本局结束（达到最大轮数或主动结束）';

  return `你是一个沟通教练，正在帮用户复盘一次"哄哄模拟器"游戏。

## 本局信息
- 场景：${scenario}
- 女朋友的隐藏诉求：${hiddenNeed}
- 结果：${resultText}

## 完整聊天记录
以下是用户和AI女朋友的完整对话。请仔细分析用户的每一句话。

## 你的任务
请根据完整聊天记录，给出详细的复盘分析：

1. **整体评价**（2-3句话概括用户表现）
2. **做得好的地方**（引用用户原话，说明为什么好，最多3条）
3. **做得不好的地方**（引用用户原话，说明为什么不好，最多3条）
4. **改进建议**（具体可操作的建议，2-3条）
5. **更好的说法**（针对用户说得不好的地方，提供1-2个更好的表达示例）
6. **隐藏诉求揭示**（揭示女朋友的真正诉求，并解释用户是否发现了）

注意：
- 引用用户原话时要准确
- 建议要具体实用，不要空泛
- 如果某个问题不能单纯靠"说好听的话"解决，要明确提醒
- 重点是帮用户理解沟通的本质：理解情绪→共情→解决问题

你必须严格以JSON格式输出：
{
  "summary": "整体评价",
  "good": [{"quote": "用户原话", "reason": "为什么做得好"}],
  "bad": [{"quote": "用户原话", "reason": "为什么做得不好"}],
  "suggestion": "改进建议",
  "betterExpressions": ["更好的说法1", "更好的说法2"],
  "hiddenNeed": "隐藏诉求揭示与分析"
}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      scenario,
      hiddenNeed,
      messages,
      gameResult,
    }: {
      scenario: string;
      hiddenNeed: string;
      messages: Message[];
      gameResult: string;
    } = body;

    if (!scenario || !messages || messages.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // Build conversation text for the prompt
    const conversationText = messages
      .map((msg) => {
        const role = msg.role === 'user' ? '用户' : '女朋友';
        return `${role}：${msg.content}`;
      })
      .join('\n');

    const llmMessages = [
      { role: 'system' as const, content: buildReviewPrompt(scenario, hiddenNeed, gameResult) },
      { role: 'user' as const, content: `以下是完整聊天记录：\n\n${conversationText}\n\n请给出复盘分析。` },
    ];

    const response = await client.invoke(llmMessages, {
      model: 'doubao-seed-2-0-lite-260215',
      temperature: 0.7,
    });

    const content = response.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse review from LLM response');
    }

    const reviewData = JSON.parse(jsonMatch[0]) as ReviewResponse;

    return NextResponse.json(reviewData);
  } catch (error) {
    console.error('Review API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate review' },
      { status: 500 }
    );
  }
}
