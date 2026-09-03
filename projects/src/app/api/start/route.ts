import { NextRequest, NextResponse } from 'next/server';
import { arkChat } from '@/lib/ark-llm';
import { FALLBACK_SCENARIO } from '@/lib/fallback-game';
import type { StartResponse } from '@/app/types';

const SYSTEM_PROMPT = `你是一个情景生成器，用于"哄哄模拟器"游戏。

你的任务是随机生成一个普通日常情侣矛盾场景。

场景要求：
- 必须是日常生活中常见的普通情侣矛盾
- 例如：迟到、忘记重要事情、回复消息太敷衍、长时间没回消息、冷落对方、答应的事没做到、吃醋、说错话、没注意到对方情绪、忽视对方感受等
- 不能是过于极端的关系问题（如出轨、家暴等）
- 场景要具体，有细节

每个场景包含：
1. 场景描述：简要说明发生了什么（50字以内）
2. 隐藏诉求：女朋友真正在意的深层原因（用户需要慢慢发现）
3. 开场白：女朋友的第句话，要自然地带出问题，但不直接说明场景背景

开场白要求：
- 1-2句话，像正常微信聊天
- 要能传达生气的情绪
- 不能直接说出"场景背景"
- 最多50字

你必须以JSON格式输出，格式如下：
{
  "scenario": "场景描述",
  "hiddenNeed": "隐藏诉求",
  "openingMessage": "女朋友的开场白"
}`;

export async function POST(request: NextRequest) {
  try {
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      { role: 'user' as const, content: '请随机生成一个情侣矛盾场景，每次都要不一样。' },
    ];

    let scenarioData: StartResponse;
    try {
      const content = await arkChat(messages, { temperature: 1.0 });

      // Extract JSON from the response
      const jsonMatch = content.trim().match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse scenario from LLM response');
      }

      scenarioData = JSON.parse(jsonMatch[0]) as StartResponse;

      // Validate required fields
      if (!scenarioData.scenario || !scenarioData.hiddenNeed || !scenarioData.openingMessage) {
        throw new Error('Missing required fields in scenario');
      }
    } catch (llmError) {
      // LLM 不可用时使用内置简单场景（规则模式）
      console.error('LLM unavailable, using fallback scenario:', llmError);
      scenarioData = FALLBACK_SCENARIO;
    }

    return NextResponse.json({
      scenario: scenarioData.scenario,
      hiddenNeed: scenarioData.hiddenNeed,
      openingMessage: scenarioData.openingMessage,
      angerLevel: 60,
    });
  } catch (error) {
    console.error('Start API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate scenario' },
      { status: 500 }
    );
  }
}
