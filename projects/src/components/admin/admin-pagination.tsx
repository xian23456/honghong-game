import Link from "next/link";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
  /** 需要保留的查询参数（如搜索词、筛选值） */
  params: Record<string, string | undefined>;
}

export function AdminPagination({ page, totalPages, basePath, params }: AdminPaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="mt-4 text-xs text-gray-400">
        共 {totalPages} 页
      </div>
    );
  }

  const buildHref = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) sp.set(k, v);
    });
    sp.set("page", String(p));
    return `${basePath}?${sp.toString()}`;
  };

  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-xs text-gray-500">
        第 {page} / {totalPages} 页
      </div>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={buildHref(page - 1)}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
          >
            上一页
          </Link>
        ) : (
          <span className="rounded-md border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs text-gray-300">
            上一页
          </span>
        )}
        {page < totalPages ? (
          <Link
            href={buildHref(page + 1)}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
          >
            下一页
          </Link>
        ) : (
          <span className="rounded-md border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs text-gray-300">
            下一页
          </span>
        )}
      </div>
    </div>
  );
}
