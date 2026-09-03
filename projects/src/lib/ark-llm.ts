const ARK_BASE_URL = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3';
const ARK_MODEL = process.env.ARK_MODEL || 'deepseek-v4-flash-ga-260731';

export interface ArkMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ArkChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

/**
 * 调用火山方舟（Ark）的 OpenAI 兼容 chat/completions 接口。
 * 密钥来自 .env.local 的 ARK_API_KEY，只应在服务端使用。
 */
export async function arkChat(
  messages: ArkMessage[],
  options?: { temperature?: number }
): Promise<string> {
  const apiKey = process.env.ARK_API_KEY;
  if (!apiKey) {
    throw new Error('ARK_API_KEY is not set');
  }

  const res = await fetch(`${ARK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: ARK_MODEL,
      messages,
      temperature: options?.temperature,
      // 推理模型会先输出思考内容，给足 token 避免正文被截断为空
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Ark API error ${res.status}: ${errorText}`);
  }

  const data = (await res.json()) as ArkChatResponse;
  const content = data.choices?.[0]?.message?.content;

  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('Ark API returned empty content');
  }

  return content;
}
