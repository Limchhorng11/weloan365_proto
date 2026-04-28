"use client";

import { Check, ChevronRight } from "lucide-react";
import type { ScheduleRow } from "@/lib/types";
import { formatMoney } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface Props {
  row: ScheduleRow;
  onClick?: () => void;
}

export function RepaymentRow({ row, onClick }: Props) {
  const paid = row.status === "paid";
  const overdue = row.status === "overdue";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "grid w-full cursor-pointer grid-cols-[36px_1fr_90px_28px] items-center gap-2.5 border-b px-4 py-3.5 text-left text-[13px] last:border-b-0",
      )}
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className={cn(
          "grid h-8 w-8 place-items-center rounded-lg font-semibold",
          paid && "bg-[rgba(0,196,140,.12)] text-[var(--accent)]",
          overdue && "bg-[rgba(255,77,94,.12)] text-[var(--danger)]",
          !paid && !overdue && "bg-[var(--primary-50)] text-[var(--primary)]",
        )}
      >
        {paid ? <Check className="h-3.5 w-3.5" /> : row.no}
      </div>
      <div className="min-w-0">
        <h5 className="text-[13px] font-semibold">{row.date}</h5>
        <small className="text-[11px]" style={{ color: "var(--text-2)" }}>
          P: {formatMoney(Number(row.principal))} · I:{" "}
          {formatMoney(Number(row.interest))}
        </small>
      </div>
      <div className="text-right font-semibold">
        {formatMoney(Number(row.amount))}
      </div>
      <div style={{ color: "var(--text-3)" }}>
        <ChevronRight className="h-4 w-4" />
      </div>
    </button>
  );
}
