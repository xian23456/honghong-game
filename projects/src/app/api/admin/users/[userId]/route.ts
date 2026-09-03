import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/storage/database/db";
import { users } from "@/storage/database/shared/schema";
import { getAdminUser } from "@/lib/admin";

// 编辑用户状态（仅管理员；不做删除）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "无管理员权限" }, { status: 403 });
    }

    const { userId } = await params;
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "无效的用户ID" }, { status: 400 });
    }

    const { status } = await request.json();
    if (status !== "active" && status !== "banned") {
      return NextResponse.json(
        { error: "状态值必须是 active 或 banned" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(users)
      .set({ status })
      .where(eq(users.id, id))
      .returning({ id: users.id, username: users.username, status: users.status });

    if (!updated) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error("Failed to update user status:", err);
    return NextResponse.json({ error: "更新用户状态失败" }, { status: 500 });
  }
}
