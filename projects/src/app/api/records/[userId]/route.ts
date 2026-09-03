import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/storage/database/db";
import { gameRecords, users } from "@/storage/database/shared/schema";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;
    const uid = parseInt(userId, 10);
    if (isNaN(uid)) {
      return NextResponse.json({ error: "无效的用户ID" }, { status: 400 });
    }

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, uid));

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const records = await db
      .select({
        id: gameRecords.id,
        scenario: gameRecords.scenario,
        rounds: gameRecords.rounds,
        result: gameRecords.result,
        playedAt: gameRecords.playedAt,
      })
      .from(gameRecords)
      .where(eq(gameRecords.userId, uid))
      .orderBy(desc(gameRecords.playedAt));

    return NextResponse.json({
      user: { id: user.id, username: user.username, createdAt: user.createdAt },
      records,
    });
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    return NextResponse.json({ error: "获取用户信息失败" }, { status: 500 });
  }
}
