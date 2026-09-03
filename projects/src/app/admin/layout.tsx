import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata = { title: "管理后台" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 登录态 + 管理员身份校验（middleware 已校验登录，这里校验管理员角色）
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/login?redirect=/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* 左侧导航 */}
        <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-4">
            <div className="text-sm font-semibold text-gray-900">管理后台</div>
            <div className="mt-0.5 text-xs text-gray-400">哄哄模拟器 · Admin</div>
          </div>
          <AdminNav />
          <div className="mt-auto border-t border-gray-200 p-3">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              ← 返回前台首页
            </Link>
          </div>
        </aside>

        {/* 主内容区 */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* 顶部标题区 */}
          <header className="border-b border-gray-200 bg-white px-6 py-4">
            <h1 className="text-base font-semibold text-gray-900">运营管理</h1>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
