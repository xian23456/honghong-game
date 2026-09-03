import { NextRequest, NextResponse } from "next/server";
import { db } from "@/storage/database/db";
import { gameRecords } from "@/storage/database/shared/schema";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "登录已过期" }, { status: 401 });
    }

    const body = await request.json();
    const { scenario, rounds, result } = body;

    if (!scenario || typeof rounds !== 'number' || rounds < 1 || !result) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 });
    }

    await db.insert(gameRecords).values({
      userId: payload.userId,
      scenario,
      rounds,
      result,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to save game record:", err);
    return NextResponse.json({ error: "保存记录失败" }, { status: 500 });
  }
}
