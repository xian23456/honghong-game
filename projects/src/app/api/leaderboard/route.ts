import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("game_records")
      .select("id, user_id, scenario, final_score, result, played_at, users(username)")
      .eq("result", "success")
      .order("final_score", { ascending: true })
      .limit(20);

    if (error) throw error;

    const leaderboard = (data ?? []).map((record: Record<string, unknown>, index: number) => ({
      rank: index + 1,
      userId: record.user_id,
      username: (record.users as Record<string, unknown>)?.username ?? "匿名",
      scenario: record.scenario,
      score: record.final_score,
      result: record.result,
      playedAt: record.played_at,
    }));

    return NextResponse.json({ leaderboard });
  } catch (err) {
    console.error("Failed to fetch leaderboard:", err);
    return NextResponse.json({ error: "获取排行榜失败" }, { status: 500 });
  }
}
