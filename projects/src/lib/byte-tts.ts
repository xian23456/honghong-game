const TTS_URL = 'https://openspeech.bytedance.com/api/v3/tts/create';
const TTS_MODEL = 'seed-audio-1.0';

export interface ByteTtsOptions {
  speechRate?: number;
  loudnessRate?: number;
  /** 语气描述，会拼进 text_prompt 指导音色与情绪，例如"愤怒""温柔平静" */
  tone?: string;
}

interface ByteTtsResponse {
  audio?: string;
  duration?: number;
  url?: string;
}

/**
 * 调用火山 OpenSpeech seed-audio TTS，返回可直接播放的 data URI。
 * 密钥来自 .env.local 的 BYTED_TTS_API_KEY，只应在服务端使用。
 */
export async function byteTts(text: string, options?: ByteTtsOptions): Promise<string> {
  const apiKey = process.env.BYTED_TTS_API_KEY;
  if (!apiKey) {
    throw new Error('BYTED_TTS_API_KEY is not set');
  }

  const tone = options?.tone || '自然';
  // seed-audio 通过 text_prompt 中的描述控制音色，被朗读的内容放在引号内
  const textPrompt = `年轻女性（声音清亮，富有情绪）用${tone}的语气说道："${text}"`;

  const res = await fetch(TTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    },
    body: JSON.stringify({
      model: TTS_MODEL,
      text_prompt: textPrompt,
      audio_config: {
        format: 'mp3',
        sample_rate: 24000,
        pitch_rate: 0,
        speech_rate: options?.speechRate ?? 0,
        loudness_rate: options?.loudnessRate ?? 0,
      },
      watermark: {},
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`TTS API error ${res.status}: ${errorText}`);
  }

  const data = (await res.json()) as ByteTtsResponse;
  if (!data.audio) {
    throw new Error('TTS response missing audio data');
  }

  return `data:audio/mpeg;base64,${data.audio}`;
}
