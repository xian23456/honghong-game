"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RESULT_OPTIONS = [
  { value: "success", label: "通关" },
  { value: "failure", label: "失败" },
  { value: "ended", label: "结束" },
] as const;

function resultLabel(result: string) {
  return RESULT_OPTIONS.find((o) => o.value === result)?.label ?? result;
}

export interface AdminRecordData {
  id: number;
  username: string;
  scenario: string;
  rounds: number;
  result: string;
  playedAt: string;
}

interface RecordDetailEditorProps {
  record: AdminRecordData;
}

/** 战绩详情弹窗 + 状态编辑（对应老师的"订单详情 + 编辑状态"） */
export function RecordDetailEditor({ record }: RecordDetailEditorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(record.result);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/records/${record.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "保存失败");
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setError(null);
        setSaved(false);
        setValue(record.result);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
          详情
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>战绩详情</DialogTitle>
          <DialogDescription>记录 ID: {record.id}</DialogDescription>
        </DialogHeader>

        {/* 基本信息（schema 中真实存在的字段） */}
        <dl className="space-y-2 rounded-md border border-gray-100 bg-gray-50 p-4 text-sm">
          <div className="flex">
            <dt className="w-20 shrink-0 text-gray-500">关联用户</dt>
            <dd className="font-medium text-gray-900">{record.username}</dd>
          </div>
          <div className="flex">
            <dt className="w-20 shrink-0 text-gray-500">场景</dt>
            <dd className="text-gray-900">{record.scenario}</dd>
          </div>
          <div className="flex">
            <dt className="w-20 shrink-0 text-gray-500">通关轮数</dt>
            <dd className="text-gray-900">{record.rounds} 轮</dd>
          </div>
          <div className="flex">
            <dt className="w-20 shrink-0 text-gray-500">游戏时间</dt>
            <dd className="text-gray-900">{record.playedAt}</dd>
          </div>
        </dl>

        {/* 状态编辑 */}
        <div className="py-1">
          <div className="mb-1.5 text-xs text-gray-500">结果状态（复用现有枚举：success / failure / ended）</div>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择结果" />
            </SelectTrigger>
            <SelectContent>
              {RESULT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
          {saved && !error && <p className="mt-2 text-xs text-emerald-600">已保存</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            关闭
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving || (value === record.result && saved)}>
            {saving ? "保存中..." : "保存修改"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
