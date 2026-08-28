import type { ChatResponse } from '@/app/types';

// 内置的简单测试场景（LLM 不可用时的兜底）
export const FALLBACK_SCENARIO = {
  scenario: '你约会迟到了半个小时，她一个人在商场门口等了很久',
  hiddenNeed: '她觉得自己不被重视，担心在你心里不重要',
  openingMessage: '你现在才来？我在这站了半小时了，你心里到底有没有我？',
  angerLevel: 60,
  audioUrl: '',
};

// 简单规则引擎：根据关键词判断愤怒值变化并生成回复
export function generateFallbackReply(userMessage: string, angerLevel: number): {
  reply: string;
  angerChange: number;
  newAngerLevel: number;
  emotion: string;
  emotionIntensity: number;
} {
  const msg = userMessage.toLowerCase();
  let angerChange = 0;
  let reply: string;

  const hasAny = (...words: string[]) => words.some((w) => msg.includes(w));

  if (hasAny('对不起', '抱歉', '我错了', '原谅我', '是我的错')) {
    angerChange = -15;
  } else if (hasAny('辛苦了', '等急了吧', '让你久等', '心疼你', '我知道你')) {
    angerChange = -12;
  } else if (hasAny('爱', '在乎', '重要', '喜欢')) {
    angerChange = -10;
  } else if (hasAny('至于吗', '至于么', '无聊', '烦不烦', '能不能别', '你怎么这样')) {
    angerChange = 18;
  } else if (hasAny('但是', '可是', '其实是因为', '堵车', '加班', '忙')) {
    angerChange = 12;
  } else if (hasAny('哦', '嗯', '行吧', '随便')) {
    angerChange = 10;
  } else {
    angerChange = -3;
  }

  const newAngerLevel = Math.max(0, Math.min(100, angerLevel + angerChange));

  if (newAngerLevel >= 75) {
    reply = '哼，说这些有什么用，我不想听！';
  } else if (newAngerLevel >= 50) {
    reply = '……你说得倒是轻巧，我还是有点生气。';
  } else if (newAngerLevel >= 25) {
    reply = '好吧，看在你态度还不错的份上，勉强原谅你一点。';
  } else {
    reply = '嗯……其实听到你这么说，我心里好受多了。';
  }

  let emotion = '';
  if (newAngerLevel >= 75) emotion = '非常生气';
  else if (newAngerLevel >= 50) emotion = '生气但有所缓和';
  else if (newAngerLevel >= 25) emotion = '情绪缓和，愿意交流';
  else emotion = '基本消气，语气柔和';

  return {
    reply,
    angerChange,
    newAngerLevel,
    emotion,
    emotionIntensity: Math.min(1, newAngerLevel / 100),
  };
}

// 判断是否为规则模式可用的完整回合结果
export type FallbackRound = ReturnType<typeof generateFallbackReply> & {
  gameEnded: boolean;
  gameResult: ChatResponse['gameResult'];
};

export function resolveGameResult(newAngerLevel: number, newRound: number): {
  gameEnded: boolean;
  gameResult: ChatResponse['gameResult'];
} {
  if (newAngerLevel <= 0) return { gameEnded: true, gameResult: 'success' };
  if (newAngerLevel >= 100) return { gameEnded: true, gameResult: 'failure' };
  if (newRound >= 20) return { gameEnded: true, gameResult: 'timeout' };
  return { gameEnded: false, gameResult: null };
}
