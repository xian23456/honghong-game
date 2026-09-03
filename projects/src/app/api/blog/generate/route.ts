import { NextResponse } from "next/server";
import { arkChat } from "@/lib/ark-llm";
import { insertPost } from "@/lib/blog-data";

export const runtime = "nodejs";

const TOPICS = [
  "如何正确表达想念对方",
  "对方说'随便'的时候到底在想什么",
  "为什么翻旧账会让感情越来越差",
  "吵架时如何做到不伤人",
  "怎么让对方觉得你在认真听",
  "约会总是你主动怎么办",
  "对方突然冷淡了该怎么处理",
  "如何在平淡期保持感情新鲜感",
  "为什么'我都道歉了'会让对方更生气",
  "怎么开口谈敏感话题不伤感情",
  "对方总是逃避沟通怎么办",
  "如何优雅地表达不满而不吵架",
  "为什么说'你变了'是最伤人的话",
  "怎么在忙碌中让对方感受到被在乎",
  "对方生气时最不该说的五句话",
];

export async function POST() {
  try {
    // Pick a random topic
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];

    const systemPrompt = `你是一位恋爱沟通博主，风格轻松幽默、接地气，偶尔带点毒舌但本质温暖。
你写的文章要有共鸣感，让读者觉得"这说的不就是我吗"。
文章结构：开头用一个小场景引入 → 分析常见误区 → 给出实用建议 → 温暖收尾。
每篇300-500字，用中文。不要输出markdown格式标记（如#、**等），直接用纯文本和换行分段。`;

    const content = await arkChat(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: `请写一篇关于「${topic}」的恋爱攻略文章。文章标题要有吸引力，可以用问句或者反转式表达。` },
      ],
      { temperature: 0.85 }
    );

    // Extract title from first line or generate one
    const lines = content.split("\n").filter((l: string) => l.trim());
    let title = topic;
    let bodyContent = content;

    // If first line looks like a title (short, no punctuation ending)
    if (lines.length > 1 && lines[0].length < 30 && !lines[0].endsWith("。") && !lines[0].endsWith("！")) {
      title = lines[0].replace(/^#+\s*/, "").replace(/[「」]/g, "").trim();
      bodyContent = lines.slice(1).join("\n");
    }

    // Generate summary from first paragraph
    const summary = bodyContent.split("\n").find((l: string) => l.trim().length > 20)?.trim().slice(0, 60) + "..." || topic;

    // Save to database
    const post = await insertPost(title, summary, bodyContent);

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        summary: post.summary,
        created_at: post.created_at,
      },
    });
  } catch (error) {
    console.error("Generate article error:", error);
    return NextResponse.json(
      { error: "生成文章失败" },
      { status: 500 }
    );
  }
}
