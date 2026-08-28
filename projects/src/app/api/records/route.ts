import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
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
    const { scenario, finalScore, result } = body;

    if (!scenario || finalScore === undefined || !result) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.from("game_records").insert({
      user_id: payload.userId,
      scenario,
      final_score: finalScore,
      result,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to save game record:", err);
    return NextResponse.json({ error: "保存记录失败" }, { status: 500 });
  }
}
