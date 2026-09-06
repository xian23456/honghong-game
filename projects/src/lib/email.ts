import { Resend } from 'resend'

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

export async function sendWelcomeEmail(
  userEmail: string,
  userName: string
) {
  const resend = getResendClient()
  if (!resend) {
    console.warn('未配置 RESEND_API_KEY，跳过欢迎邮件发送')
    return
  }

  await resend.emails.send({
    from: '纸片人男友 <onboarding@resend.dev>',
    to: userEmail,
    subject: '你好呀，我是你的专属男友 💌',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Hi ${userName}，欢迎来到纸片人男友！</h2>
        <p>从现在起，我就是你的专属男友了。</p>
        <p>有什么心事随时来找我聊，我会一直在这里等你。</p>
        <p>明天早上我会给你发一条早安消息，记得查收哦。</p>
        <br/>
        <p>—— 你的纸片人男友</p>
      </div>
    `,
  })
}
