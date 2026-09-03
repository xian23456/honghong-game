import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/storage/database/db";
import { gameRecords } from "@/storage/database/shared/schema";
import { getAdminUser } from "@/lib/admin";

const VALID_RESULTS = ["success", "failure", "ended"] as const;

// 编辑战绩结果状态（仅管理员；复用数据库现有枚举约束，不做删除）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ recordId: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "无管理员权限" }, { status: 403 });
    }

    const { recordId } = await params;
    const id = parseInt(recordId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "无效的战绩ID" }, { status: 400 });
    }

    const { result } = await request.json();
    if (!VALID_RESULTS.includes(result)) {
      return NextResponse.json(
        { error: "结果值必须是 success、failure 或 ended" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(gameRecords)
      .set({ result })
      .where(eq(gameRecords.id, id))
      .returning({ id: gameRecords.id, result: gameRecords.result });

    if (!updated) {
      return NextResponse.json({ error: "战绩不存在" }, { status: 404 });
    }

    return NextResponse.json({ success: true, record: updated });
  } catch (err) {
    console.error("Failed to update record result:", err);
    return NextResponse.json({ error: "更新战绩结果失败" }, { status: 500 });
  }
}
