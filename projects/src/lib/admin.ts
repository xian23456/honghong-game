import { eq } from "drizzle-orm";
import { db } from "@/storage/database/db";
import { users } from "@/storage/database/shared/schema";
import { getCurrentUser, type TokenPayload } from "@/lib/auth";

export interface AdminUser extends TokenPayload {
  role: string;
}

/**
 * 获取当前登录的管理员用户。
 * 复用现有 JWT Cookie 认证（lib/auth.ts），在此基础上校验 users.role === 'admin'。
 * 非管理员返回 null。所有 /admin 页面与管理接口都必须经过此校验。
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const current = await getCurrentUser();
  if (!current) return null;

  const [row] = await db
    .select({ role: users.role, status: users.status })
    .from(users)
    .where(eq(users.id, current.userId));

  if (!row || row.role !== "admin" || row.status !== "active") {
    return null;
  }

  return { ...current, role: row.role };
}
