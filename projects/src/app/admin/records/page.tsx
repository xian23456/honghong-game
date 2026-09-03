import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/storage/database/db";
import { gameRecords, users } from "@/storage/database/shared/schema";
import { RecordDetailEditor } from "@/components/admin/record-detail-editor";
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

const RESULT_FILTERS = [
  { value: "success", label: "通关" },
  { value: "failure", label: "失败" },
  { value: "ended", label: "结束" },
] as const;

interface AdminRecordsPageProps {
  searchParams: Promise<{ q?: string; result?: string; page?: string }>;
}

function resultBadge(result: string) {
  if (result === "success") {
    return <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50">通关</Badge>;
  }
  if (result === "failure") {
    return <Badge className="bg-rose-50 text-rose-600 hover:bg-rose-50">失败</Badge>;
  }
  return <Badge variant="secondary">结束</Badge>;
}

/**
 * 战绩管理（对应老师的"订单管理"）：
 * schema 中无 orders 表，以 game_records 为"订单"；无金额字段，展示 final_score 分数。
 */
export default async function AdminRecordsPage({ searchParams }: AdminRecordsPageProps) {
  const { q, result: resultFilter, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  // 搜索：场景名 或 用户名（关联查询 users）；筛选：result
  const conditions = [];
  if (q) {
    conditions.push(or(ilike(gameRecords.scenario, `%${q}%`), ilike(users.username, `%${q}%`)));
  }
  if (resultFilter === "success" || resultFilter === "failure" || resultFilter === "ended") {
    conditions.push(eq(gameRecords.result, resultFilter));
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: gameRecords.id,
        username: users.username,
        scenario: gameRecords.scenario,
        rounds: gameRecords.rounds,
        result: gameRecords.result,
        playedAt: gameRecords.playedAt,
      })
      .from(gameRecords)
      .innerJoin(users, eq(gameRecords.userId, users.id))
      .where(where)
      .orderBy(desc(gameRecords.playedAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({ total: count() })
      .from(gameRecords)
      .innerJoin(users, eq(gameRecords.userId, users.id))
      .where(where),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      {/* 搜索与筛选区域 */}
      <form method="get" action="/admin/records" className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          name="q"
          defaultValue={q}
          placeholder="搜索场景或用户名"
          className="h-9 w-56 text-sm"
        />
        <Select name="result" defaultValue={resultFilter ?? "all"}>
          <SelectTrigger className="h-9 w-32 text-sm">
            <SelectValue placeholder="结果筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部结果</SelectItem>
            {RESULT_FILTERS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" size="sm" className="h-9">
          查询
        </Button>
        {(q || resultFilter) && (
          <a
            href="/admin/records"
            className="text-xs text-gray-400 underline-offset-2 hover:underline"
          >
            清空条件
          </a>
        )}
      </form>

      {/* 战绩表格 */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs text-gray-500">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">用户</th>
              <th className="px-4 py-3 font-medium">场景</th>
              <th className="px-4 py-3 font-medium">轮数</th>
              <th className="px-4 py-3 font-medium">结果</th>
              <th className="px-4 py-3 font-medium">游戏时间</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                  没有符合条件的战绩
                </td>
              </tr>
            ) : (
              rows.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-gray-500">{record.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{record.username}</td>
                  <td className="max-w-52 truncate px-4 py-3 text-gray-600">{record.scenario}</td>
                  <td className="px-4 py-3 text-gray-500">{record.rounds} 轮</td>
                  <td className="px-4 py-3">{resultBadge(record.result)}</td>
                  <td className="px-4 py-3 text-gray-500">{record.playedAt}</td>
                  <td className="px-4 py-3">
                    <RecordDetailEditor record={record} />
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
        basePath="/admin/records"
        params={{ q, result: resultFilter }}
      />
    </div>
  );
}
