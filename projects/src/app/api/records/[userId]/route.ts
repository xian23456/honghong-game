import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;
    const uid = parseInt(userId, 10);
    if (isNaN(uid)) {
      return NextResponse.json({ error: "无效的用户ID" }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, username, created_at")
      .eq("id", uid)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const { data: records, error: recordsError } = await supabase
      .from("game_records")
      .select("id, scenario, final_score, result, played_at")
      .eq("user_id", uid)
      .order("played_at", { ascending: false });

    if (recordsError) throw recordsError;

    return NextResponse.json({
      user: { id: user.id, username: user.username, createdAt: user.created_at },
      records: records ?? [],
    });
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    return NextResponse.json({ error: "获取用户信息失败" }, { status: 500 });
  }
}
