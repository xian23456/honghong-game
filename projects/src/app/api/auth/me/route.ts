import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  // 与 login/register 返回格式保持一致：{ user: { id, username } }
  return NextResponse.json({ user: { id: user.userId, username: user.username } });
}
