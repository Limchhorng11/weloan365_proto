"use client";

import { Check } from "lucide-react";
import type { ScheduleRow } from "@/lib/types";
import { formatMoney } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface Props {
  rows: ScheduleRow[];
  onRowClick?: (row: ScheduleRow) => void;
}

/**
 * Tabular repayment view (5 columns):
 *   Due Date · Principal · Interest · Fee/Penalty · Total
 *
 * Renders a sticky header row followed by one row per installment. Status
 * is communicated by a thin left-edge color bar (green=paid, red=overdue,
 * blue=due, gray=pending) so the column widths can stay tight.
 *
 * Rows are clickable — the parent decides what each click means (open
 * PaymentSheet, download receipt, etc.).
 */
export function RepaymentTable({ rows, onRowClick }: Props) {
  return (
    <div
      className="overflow-hidden rounded-2xl shadow-sm"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div
        className="grid grid-cols-[1.4fr_1fr_0.9fr_0.9fr_1.1fr] gap-1.5 px-2.5 py-2 text-[9.5px] font-bold uppercase tracking-wider"
        style={{
          background: "var(--surface-2)",
          color: "var(--text-2)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span>Due Date</span>
        <span className="text-right">Principal</span>
        <span className="text-right">Interest</span>
        <span className="text-right">Fee/Penalty</span>
        <span className="text-right">Total</span>
      </div>

      {/* Body */}
      {rows.length === 0 ? (
        <div
          className="px-4 py-6 text-center text-[12px]"
          style={{ color: "var(--text-3)" }}
        >
          No installments to show.
        </div>
      ) : (
        rows.map((row) => (
          <TableRow
            key={row.no}
            row={row}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          />
        ))
      )}
    </div>
  );
}

function TableRow({
  row,
  onClick,
}: {
  row: ScheduleRow;
  onClick?: () => void;
}) {
  const isPaid = row.status === "paid";
  const isOverdue = row.status === "overdue";
  const isDue = row.status === "due";
  const hasFee = Number(row.fee) > 0;

  // Left edge color stripe matches the row status.
  const stripeColor = isPaid
    ? "var(--accent)"
    : isOverdue
      ? "var(--danger)"
      : isDue
        ? "var(--primary)"
        : "var(--border-strong)";

  // Optional row tint for overdue / due so they stand out from the
  // dense paid history.
  const rowBg = isOverdue
    ? "rgba(255,77,94,.04)"
    : isDue
      ? "rgba(31,95,255,.04)"
      : "transparent";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "relative grid w-full grid-cols-[1.4fr_1fr_0.9fr_0.9fr_1.1fr] items-center gap-1.5 border-b px-2.5 py-2.5 text-left text-[11.5px] last:border-b-0",
        onClick && "transition active:bg-[var(--surface-2)]",
      )}
      style={{
        borderColor: "var(--border)",
        background: rowBg,
      }}
    >
      {/* Left status stripe */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-1"
        style={{ background: stripeColor }}
      />

      {/* Date cell — includes the installment number + tiny status icon */}
      <div className="min-w-0 pl-1">
        <div className="flex items-center gap-1">
          {isPaid ? (
            <Check
              className="h-3 w-3 flex-shrink-0"
              style={{ color: "var(--accent)" }}
            />
          ) : (
            <span
              className="text-[9px] font-bold"
              style={{
                color: isOverdue
                  ? "var(--danger)"
                  : isDue
                    ? "var(--primary)"
                    : "var(--text-3)",
              }}
            >
              #{row.no}
            </span>
          )}
        </div>
        <div className="font-semibold leading-tight">{row.date}</div>
        <div
          className="text-[9.5px] uppercase tracking-wider"
          style={{
            color: isOverdue
              ? "var(--danger)"
              : isDue
                ? "var(--primary)"
                : "var(--text-3)",
          }}
        >
          {isPaid
            ? "Paid"
            : isOverdue
              ? "Overdue"
              : isDue
                ? "Due"
                : "Scheduled"}
        </div>
      </div>

      <div className="text-right font-mono tabular-nums">
        {formatMoney(Number(row.principal))}
      </div>
      <div className="text-right font-mono tabular-nums">
        {formatMoney(Number(row.interest))}
      </div>
      <div
        className="text-right font-mono tabular-nums"
        style={{
          color: hasFee ? "var(--danger)" : "var(--text-3)",
          fontWeight: hasFee ? 600 : 400,
        }}
      >
        {hasFee ? `+${formatMoney(Number(row.fee))}` : formatMoney(0)}
      </div>
      <div
        className="text-right font-mono font-bold tabular-nums"
        style={{ color: isOverdue ? "var(--danger)" : "var(--text)" }}
      >
        {formatMoney(Number(row.amount))}
      </div>
    </button>
  );
}
