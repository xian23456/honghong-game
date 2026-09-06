import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/storage/database/db";
import { users } from "@/storage/database/shared/schema";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { sendWelcomeEmail } from "@/lib/email";

// 简单的邮箱格式校验
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { username, password, email, turnstileToken } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "用户名和密码不能为空" },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "请输入有效的邮箱地址" },
        { status: 400 }
      );
    }

    // 人机验证：通过后才继续，防止机器批量注册
    const isHuman = await verifyTurnstileToken(turnstileToken);
    if (!isHuman) {
      return NextResponse.json(
        { error: "人机验证未通过，请刷新后重试" },
        { status: 400 }
      );
    }

    if (username.length < 2 || username.length > 20) {
      return NextResponse.json(
        { error: "用户名长度需在2-20个字符之间" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码长度不能少于6位" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "用户名已存在" },
        { status: 409 }
      );
    }

    // Check if email already exists
    const [existingEmail] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingEmail) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({ username, password: hashedPassword, email })
      .returning({ id: users.id, username: users.username });

    if (!newUser) {
      return NextResponse.json(
        { error: "注册失败，请稍后重试" },
        { status: 500 }
      );
    }

    // 注册成功后，发送欢迎邮件（失败不影响注册）
    try {
      await sendWelcomeEmail(email, newUser.username);
    } catch (emailError) {
      console.error("欢迎邮件发送失败：", emailError);
    }

    // Generate JWT and set cookie
    const token = generateToken({ userId: newUser.id, username: newUser.username });
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    );
  }
}
