"use client";

import { notFound, useParams } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import { Check, Download } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import { Badge } from "@/components/ui/Badge";
import { PaymentSheet } from "@/components/sheets/PaymentSheet";
import { useSheet } from "@/lib/hooks/useSheet";
import { useToast } from "@/lib/hooks/useToast";
import { getApprovedLoan, paymentMethods } from "@/lib/mock";
import { formatMoney } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { ScheduleRow as ScheduleRowType } from "@/lib/types";

type Filter = "all" | "paid" | "upcoming";

interface PaidMeta {
  methodName: string;
  methodColor: string;
  reference: string;
  paidAt: string;
}

/**
 * Unified Repayment Schedule + Payment History (Workshop ref: 3.F2).
 *
 * One screen, one row template, three views via filter:
 *   • All       — full timeline with "Paid / Upcoming" section dividers
 *   • Paid      — paid installments only, newest first (history view)
 *   • Upcoming  — due + pending installments (forward schedule)
 *
 * Each row adapts its right-side metadata to its status:
 *   • Paid     → method chip + reference number + "Paid" badge
 *   • Due      → P/I split + "Pay Now" (or "Due" pill)
 *   • Pending  → P/I split + "Scheduled" pill
 *   • Overdue  → P/I split + red "Overdue" pill
 */
export default function RepaymentSchedulePage() {
  const { id } = useParams<{ id: string }>();
  const { open } = useSheet();
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const loan = getApprovedLoan(id);
  if (!loan) notFound();

  // Generate paid-row metadata (method, reference, paid time) deterministically.
  const paidMetaByNo = useMemo(() => {
    const map = new Map<number, PaidMeta>();
    let i = 0;
    for (const r of loan.schedule) {
      if (r.status === "paid") {
        const m = paymentMethods[i % paymentMethods.length];
        map.set(r.no, {
          methodName: m.name,
          methodColor: m.color,
          reference: `TX-${id.toUpperCase()}-${String(r.no).padStart(3, "0")}`,
          paidAt: r.date + " · 9:42 AM",
        });
        i++;
      }
    }
    return map;
  }, [loan.schedule, id]);

  const paid = loan.schedule.filter((r) => r.status === "paid");
  const upcoming = loan.schedule.filter((r) => r.status !== "paid");
  const totalPaid = paid.reduce((sum, r) => sum + Number(r.amount), 0);

  const visible: ScheduleRowType[] =
    filter === "paid"
      ? [...paid].reverse() // newest first for history view
      : filter === "upcoming"
        ? upcoming
        : loan.schedule;

  const handleRow = (row: ScheduleRowType) => {
    if (row.status === "due" || row.status === "overdue") {
      open(
        <PaymentSheet
          dueAmount={Number(row.amount)}
          installmentNo={row.no}
          dueDate={row.date}
        />,
      );
    } else if (row.status === "paid") {
      const m = paidMetaByNo.get(row.no);
      toast(`Receipt ${m?.reference ?? ""} downloaded`, "success");
    } else {
      toast(`Installment #${row.no} · ${row.date}`, "info");
    }
  };

  return (
    <Screen>
      <NavHeader
        title="Repayment Schedule"
        right={
          <button
            className="grid h-9 w-9 place-items-center rounded-[10px]"
            onClick={() => toast("Statement exported as PDF", "success")}
            aria-label="Export statement"
          >
            <Download className="h-5 w-5" />
          </button>
        }
      />
      <ScreenBody noPad>
        {/* Summary card */}
        <div className="p-4 pb-0">
          <Card>
            <div className="grid grid-cols-3 gap-1 text-center">
              <SummaryCell
                label="Paid"
                value={formatMoney(totalPaid)}
                sub={`${paid.length} ${paid.length === 1 ? "payment" : "payments"}`}
              />
              <SummaryCell
                label="Remaining"
                value={formatMoney(loan.remainingBalance)}
                sub={`${upcoming.length} months`}
                bordered
              />
              <SummaryCell
                label="Monthly"
                value={formatMoney(Number(loan.schedule[0].amount))}
                sub="EMI"
              />
            </div>

          </Card>
        </div>

        {/* Filter tabs */}
        <div className="px-4 pt-4">
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: `All · ${loan.schedule.length}` },
              { value: "paid", label: `Paid · ${paid.length}` },
              { value: "upcoming", label: `Upcoming · ${upcoming.length}` },
            ]}
          />
        </div>

        {/* List */}
        <div
          className="mx-4 mb-4 mt-3 overflow-hidden rounded-2xl shadow-sm"
          style={{ background: "var(--surface)" }}
        >
          {visible.map((row, idx) => {
            const prev = idx > 0 ? visible[idx - 1] : null;
            // In "All" mode, show a Paid / Upcoming divider when the status
            // group transitions, plus a leading header.
            const showHeader =
              filter === "all" &&
              (idx === 0 ||
                (prev !== null &&
                  prev.status === "paid" &&
                  row.status !== "paid"));

            return (
              <Fragment key={row.no}>
                {showHeader && (
                  <SectionDivider
                    label={row.status === "paid" ? "Paid" : "Upcoming"}
                  />
                )}
                <Row
                  row={row}
                  meta={paidMetaByNo.get(row.no)}
                  onClick={() => handleRow(row)}
                />
              </Fragment>
            );
          })}
        </div>

        <p
          className="px-4 pb-4 text-center text-[11px] leading-relaxed"
          style={{ color: "var(--text-3)" }}
        >
          Tap a paid row to download its receipt · tap a due row to pay now
        </p>
      </ScreenBody>
    </Screen>
  );
}

// ============ small helpers ============

function SummaryCell({
  label,
  value,
  sub,
  bordered,
}: {
  label: string;
  value: string;
  sub: string;
  bordered?: boolean;
}) {
  return (
    <div
      style={
        bordered
          ? {
              borderLeft: "1px solid var(--border)",
              borderRight: "1px solid var(--border)",
            }
          : undefined
      }
    >
      <div className="text-[10px]" style={{ color: "var(--text-3)" }}>
        {label}
      </div>
      <div className="mt-0.5 text-[14px] font-bold leading-tight">{value}</div>
      <div className="text-[10px]" style={{ color: "var(--text-3)" }}>
        {sub}
      </div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div
      className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider"
      style={{
        background: "var(--surface-2)",
        color: "var(--text-3)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {label}
    </div>
  );
}

function Row({
  row,
  meta,
  onClick,
}: {
  row: ScheduleRowType;
  meta: PaidMeta | undefined;
  onClick: () => void;
}) {
  const isPaid = row.status === "paid";
  const isDue = row.status === "due";
  const isOverdue = row.status === "overdue";

  // Left badge — green check for paid, brand-blue # for due, red # for
  // overdue, muted # for pending.
  const badgeBg = isPaid
    ? "rgba(0,196,140,.12)"
    : isOverdue
      ? "rgba(255,77,94,.12)"
      : isDue
        ? "var(--primary-50)"
        : "var(--surface-2)";
  const badgeColor = isPaid
    ? "var(--accent)"
    : isOverdue
      ? "var(--danger)"
      : isDue
        ? "var(--primary)"
        : "var(--text-3)";

  return (
    <button
      onClick={onClick}
      className="grid w-full grid-cols-[40px_1fr_auto] items-start gap-3 border-b px-4 py-3.5 text-left transition active:bg-[var(--surface-2)] last:border-b-0"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="grid h-10 w-10 place-items-center rounded-xl text-[13px] font-semibold"
        style={{ background: badgeBg, color: badgeColor }}
      >
        {isPaid ? <Check className="h-[18px] w-[18px]" /> : row.no}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold">#{row.no}</span>
          <span className="text-[11px]" style={{ color: "var(--text-3)" }}>
            {isPaid && meta ? meta.paidAt : row.date}
          </span>
        </div>
        {isPaid && meta ? (
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
            <span
              className="inline-flex items-center rounded-md px-1.5 py-px font-medium"
              style={{
                background: `${meta.methodColor}15`,
                color: meta.methodColor,
              }}
            >
              {meta.methodName}
            </span>
            <span
              className="font-mono"
              style={{ color: "var(--text-2)" }}
            >
              {meta.reference}
            </span>
          </div>
        ) : (
          <div className="mt-1 text-[11px]" style={{ color: "var(--text-2)" }}>
            P: {formatMoney(Number(row.principal))} · I:{" "}
            {formatMoney(Number(row.interest))}
          </div>
        )}
      </div>

      <div className="text-right">
        <div className="text-[14px] font-bold">
          {formatMoney(Number(row.amount))}
        </div>
        <div className="mt-1">
          {isPaid && <Badge tone="success">Paid</Badge>}
          {isOverdue && <Badge tone="danger">Overdue</Badge>}
          {isDue && <Badge tone="info">Due</Badge>}
          {row.status === "pending" && (
            <span
              className={cn(
                "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
              )}
              style={{
                background: "var(--surface-2)",
                color: "var(--text-3)",
              }}
            >
              Scheduled
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
