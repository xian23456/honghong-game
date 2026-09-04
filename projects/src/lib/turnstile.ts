const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * 校验 Cloudflare Turnstile 的人机验证 token。
 * secret key 只存在服务端环境变量 TURNSTILE_SECRET_KEY，绝不下发到浏览器。
 * 返回 true 表示验证通过（人类），false 表示失败（可能为机器人）。
 */
export async function verifyTurnstileToken(token: string | undefined | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // 未配置密钥：关闭验证（本地开发方便调试；线上必须配置，否则放开）
  if (!secret) {
    return true;
  }

  // 前端没拿到 token 或为空，视为验证失败
  if (!token) {
    return false;
  }

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verify error:", err);
    return false;
  }
}