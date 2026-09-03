import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/storage/database/db";
import { gameRecords, users } from "@/storage/database/shared/schema";

export async function GET() {
  try {
    const rows = await db
      .select({
        userId: gameRecords.userId,
        username: users.username,
        scenario: gameRecords.scenario,
        rounds: gameRecords.rounds,
        result: gameRecords.result,
        playedAt: gameRecords.playedAt,
      })
      .from(gameRecords)
      .innerJoin(users, eq(gameRecords.userId, users.id))
      .where(eq(gameRecords.result, "success"))
      // 轮数越少排名越靠前；轮数相同时先通关的排前面
      .orderBy(asc(gameRecords.rounds), asc(gameRecords.playedAt))
      .limit(20);

    const leaderboard = rows.map((record, index) => ({
      rank: index + 1,
      userId: record.userId,
      username: record.username ?? "匿名",
      scenario: record.scenario,
      rounds: record.rounds,
      result: record.result,
      playedAt: record.playedAt,
    }));

    return NextResponse.json({ leaderboard });
  } catch (err) {
    console.error("Failed to fetch leaderboard:", err);
    return NextResponse.json({ error: "获取排行榜失败" }, { status: 500 });
  }
}
