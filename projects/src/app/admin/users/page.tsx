import { and, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "@/storage/database/db";
import { users } from "@/storage/database/shared/schema";
import { UserStatusEditor } from "@/components/admin/user-status-editor";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

interface AdminUsersPageProps {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}

function statusBadge(status: string) {
  if (status === "active") {
    return <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50">正常</Badge>;
  }
  if (status === "banned") {
    return <Badge className="bg-rose-50 text-rose-600 hover:bg-rose-50">封禁</Badge>;
  }
  return <Badge variant="secondary">{status}</Badge>;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const { q, status: statusFilter, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  // 搜索 + 状态筛选（schema 中无 email 字段，仅支持用户名搜索）
  const conditions = [];
  if (q) conditions.push(ilike(users.username, `%${q}%`));
  if (statusFilter === "active" || statusFilter === "banned") {
    conditions.push(eq(users.status, statusFilter));
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: users.id,
        username: users.username,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(where)
      .orderBy(desc(users.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(users).where(where),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      {/* 搜索与筛选区域 */}
      <form method="get" action="/admin/users" className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          name="q"
          defaultValue={q}
          placeholder="搜索用户名"
          className="h-9 w-56 text-sm"
        />
        <Select name="status" defaultValue={statusFilter ?? "all"}>
          <SelectTrigger className="h-9 w-32 text-sm">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="active">正常</SelectItem>
            <SelectItem value="banned">封禁</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" size="sm" className="h-9">
          查询
        </Button>
        {(q || statusFilter) && (
          <a
            href="/admin/users"
            className="text-xs text-gray-400 underline-offset-2 hover:underline"
          >
            清空条件
          </a>
        )}
      </form>

      {/* 用户表格 */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs text-gray-500">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">用户名</th>
              <th className="px-4 py-3 font-medium">角色</th>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium">注册时间</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                  没有符合条件的用户
                </td>
              </tr>
            ) : (
              rows.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-gray-500">{user.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{user.username}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {user.role === "admin" ? "管理员" : "用户"}
                  </td>
                  <td className="px-4 py-3">{statusBadge(user.status)}</td>
                  <td className="px-4 py-3 text-gray-500">{user.createdAt}</td>
                  <td className="px-4 py-3">
                    <UserStatusEditor userId={user.id} username={user.username} status={user.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        basePath="/admin/users"
        params={{ q, status: statusFilter }}
      />
    </div>
  );
}
