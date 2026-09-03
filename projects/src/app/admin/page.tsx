import { count, gte } from "drizzle-orm";
import { db } from "@/storage/database/db";
import { gameRecords, users } from "@/storage/database/shared/schema";

const RECENT_NOTE = "最近 7 天";

export default async function AdminDashboardPage() {
  // 时间戳列为 string 模式，需传 ISO 字符串
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [[userTotal], [newUsers], [recordTotal], [newRecords]] = await Promise.all([
    db.select({ total: count() }).from(users),
    db.select({ total: count() }).from(users).where(gte(users.createdAt, sevenDaysAgo)),
    db.select({ total: count() }).from(gameRecords),
    db.select({ total: count() }).from(gameRecords).where(gte(gameRecords.playedAt, sevenDaysAgo)),
  ]);

  // 说明：schema 中没有金额/支付字段，因此不展示成交额指标
  const cards = [
    { label: "用户总数", value: userTotal.total, note: "users 表全部用户" },
    { label: "最近新增用户", value: newUsers.total, note: RECENT_NOTE },
    { label: "战绩总数", value: recordTotal.total, note: "game_records 全部记录" },
    { label: "最近战绩数", value: newRecords.total, note: RECENT_NOTE },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="text-xs text-gray-500">{card.label}</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">{card.value}</div>
            <div className="mt-1 text-xs text-gray-400">{card.note}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 text-sm text-gray-500">
        <p className="font-medium text-gray-700">说明</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>项目当前没有订单/支付相关表，概览以用户与游戏战绩为核心指标。</li>
          <li>左侧导航可进入用户管理、战绩管理，支持搜索、筛选、分页与状态编辑。</li>
        </ul>
      </div>
    </div>
  );
}
