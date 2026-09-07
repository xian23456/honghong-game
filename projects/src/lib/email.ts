import { Resend } from 'resend'
import { arkChat } from '@/lib/ark-llm'
import { db } from '@/storage/database/db'
import { users } from '@/storage/database/shared/schema'

// 站点地址：邮件里引导用户回来说话
const SITE_URL = 'https://honghong-game-vqr2-ze-f2c6.vercel.app'

// 懒加载：只在真正发信时才初始化，避免构建时因缺少环境变量而崩溃
let cachedClient: Resend | null = null

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return null
  }
  if (!cachedClient) {
    cachedClient = new Resend(apiKey)
  }
  return cachedClient
}

// 统一的发信出口：检查 Resend 返回的错误（新版 SDK 失败时不抛异常）
async function sendMail(options: {
  to: string
  subject: string
  html: string
}): Promise<void> {
  const resend = getResendClient()
  if (!resend) {
    console.warn('未配置 RESEND_API_KEY，跳过邮件发送')
    return
  }

  const { data, error } = await resend.emails.send({
    from: '纸片人男友 <onboarding@resend.dev>',
    to: options.to,
    subject: options.subject,
    html: options.html,
  })

  if (error) {
    console.error('邮件发送失败：', JSON.stringify(error))
    throw new Error(`Resend 发信失败: ${JSON.stringify(error)}`)
  }

  console.log('邮件已提交发送：', options.to, '邮件ID:', data?.id)
}

export async function sendWelcomeEmail(
  userEmail: string,
  userName: string
) {
  await sendMail({
    to: userEmail,
    subject: '你好呀，我是你的专属男友 💌',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Hi ${userName}，欢迎来到纸片人男友！</h2>
        <p>从现在起，我就是你的专属男友了。</p>
        <p>有什么心事随时来找我聊，我会一直在这里等你。</p>
        <p>明天早上我会给你发一条早安消息，记得查收哦。</p>
        <p style="color: #999; font-size: 12px;">
          想认识更多小伙伴？加入我们的
          <a href="https://discord.gg/qCmkpGHsB" target="_blank" rel="noopener noreferrer">Discord 社群</a>
        </p>
        <br/>
        <p>—— 你的纸片人男友</p>
      </div>
    `,
  })
}

// 用 AI 生成一段早安情话（贴合"纸片人男友"人设，长度克制适合邮件阅读）
export async function generateLoveLetter(userName: string): Promise<string> {
  const loveLetter = await arkChat([
    {
      role: 'system',
      content:
        '你是用户温柔的虚拟男友。写一段简短的早安情话发给用户：60字以内，口语化、贴心、有一点撒娇或俏皮，结尾可以提一句期待和用户聊天。只输出情话正文，不要标题、不要引号、不要署名。',
    },
    {
      role: 'user',
      content: `给 ${userName} 写今天的早安情话。`,
    },
  ])

  return loveLetter.trim()
}

export async function sendDailyLoveLetter(
  userEmail: string,
  userName: string
) {
  const loveLetter = await generateLoveLetter(userName)

  await sendMail({
    to: userEmail,
    subject: `早安 ${userName}，今天也想你了`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <p>${loveLetter}</p>
        <br/>
        <p>—— 你的纸片人男友</p>
        <p style="color: #999; font-size: 12px;">
          想跟我聊天？<a href="${SITE_URL}">点这里回来找我</a>
        </p>
      </div>
    `,
  })
}

// 群发：给所有留了邮箱的用户一人发一封每日情话
// 注意：某个用户失败不影响其他用户，所以循环里逐个 try/catch
export async function sendDailyLoveLetterToAll() {
  const allUsers = await db.select().from(users)

  for (const user of allUsers) {
    // 老用户可能没绑邮箱，跳过
    if (!user.email) {
      continue
    }

    try {
      await sendDailyLoveLetter(user.email, user.username)
    } catch (error) {
      console.error(`给 ${user.email} 发情话失败：`, error)
      // 某个用户失败不影响其他用户
    }
  }
}
