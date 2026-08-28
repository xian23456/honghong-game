import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "用户名和密码不能为空" },
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

    const supabase = getSupabaseClient();

    // Check if username already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "用户名已存在" },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({ username, password: hashedPassword })
      .select("id, username")
      .single();

    if (error || !newUser) {
      console.error("Register insert error:", error);
      return NextResponse.json(
        { error: "注册失败，请稍后重试" },
        { status: 500 }
      );
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
