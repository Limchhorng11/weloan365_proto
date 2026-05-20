"use client";

import { notFound, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Download,
  MessageCircle,
} from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import { RepaymentTable } from "@/components/domain/loan/RepaymentTable";
import { PaymentSheet } from "@/components/sheets/PaymentSheet";
import { useSheet } from "@/lib/hooks/useSheet";
import { useToast } from "@/lib/hooks/useToast";
import { getApprovedLoan, paymentMethods } from "@/lib/mock";
import { formatMoney } from "@/lib/utils/format";
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
 * Renders a 5-column tabular view (Due Date · Principal · Interest ·
 * Fee/Penalty · Total) with three filter modes:
 *   • All       — full timeline
 *   • Paid      — paid installments only, newest first (history view)
 *   • Upcoming  — due + pending installments (forward schedule)
 *
 * Row click handlers:
 *   • Paid     → download receipt (toast w/ reference number)
 *   • Due      → open PaymentSheet
 *   • Overdue  → open PaymentSheet for that single installment
 *   • Pending  → info toast (read-only)
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
  const overdue = loan.schedule.filter((r) => r.status === "overdue");
  const totalPaid = paid.reduce((sum, r) => sum + Number(r.amount), 0);

  // Overdue totals (only meaningful when overdue.length > 0)
  const overduePrincipal = overdue.reduce(
    (s, r) => s + Number(r.principal),
    0,
  );
  const overdueInterest = overdue.reduce(
    (s, r) => s + Number(r.interest),
    0,
  );
  const overdueAmount = overduePrincipal + overdueInterest;
  const penaltyRate = loan.penaltyRate ?? 0.1;
  const penaltyTotal = overdueAmount * penaltyRate;
  const overdueGrandTotal = overdueAmount + penaltyTotal;
  const firstOverdueDate = overdue[0]?.date;
  const lastOverdueDate = overdue[overdue.length - 1]?.date;

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
        {/* Overdue Board — only when at least one installment is overdue */}
        {overdue.length > 0 && (
          <div className="p-4 pb-0">
            <div
              className="overflow-hidden rounded-2xl p-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,77,94,.10), rgba(255,77,94,.04))",
                border: "1.5px solid rgba(255,77,94,.3)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl"
                  style={{
                    background: "rgba(255,77,94,.15)",
                    color: "var(--danger)",
                  }}
                >
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: "var(--danger)" }}
                  >
                    Account overdue
                  </div>
                  <div className="mt-0.5 text-[15px] font-semibold leading-tight">
                    {overdue.length} missed payment
                    {overdue.length === 1 ? "" : "s"}
                  </div>
                  <div
                    className="mt-0.5 text-[12px]"
                    style={{ color: "var(--text-2)" }}
                  >
                    Since {firstOverdueDate} · last missed {lastOverdueDate}
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div
                className="mt-3 rounded-xl p-3"
                style={{ background: "var(--surface)" }}
              >
                <div className="kv-row">
                  <span>Overdue principal</span>
                  <span>{formatMoney(overduePrincipal)}</span>
                </div>
                <div className="kv-row">
                  <span>Overdue interest</span>
                  <span>{formatMoney(overdueInterest)}</span>
                </div>
                <div className="kv-row">
                  <span>
                    Late penalty ({Math.round(penaltyRate * 100)}%)
                  </span>
                  <span style={{ color: "var(--danger)" }}>
                    + {formatMoney(penaltyTotal)}
                  </span>
                </div>
                <div
                  className="mt-2 flex items-center justify-between border-t pt-2"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-[12px] font-bold uppercase tracking-wider">
                    Total to settle
                  </span>
                  <span
                    className="text-[20px] font-bold"
                    style={{ color: "var(--danger)" }}
                  >
                    {formatMoney(overdueGrandTotal)}
                  </span>
                </div>
              </div>

              {/* Primary action — 2-line gradient pill, matches the alert
                  on the Loan Detail page. */}
              <button
                type="button"
                onClick={() =>
                  open(
                    <PaymentSheet
                      dueAmount={overdueGrandTotal}
                      dueDate={`${overdue.length} months overdue`}
                    />,
                  )
                }
                className="mt-3 flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-3.5 text-left text-white transition active:scale-[.98]"
                style={{
                  background: "linear-gradient(135deg, #ff4d5e, #c2185b)",
                  boxShadow: "0 8px 20px rgba(255,77,94,.28)",
                }}
              >
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                    Pay all overdue now
                  </div>
                  <div className="mt-0.5 text-[22px] font-extrabold leading-none">
                    {formatMoney(overdueGrandTotal)}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 flex-shrink-0" />
              </button>

              {/* Secondary actions */}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    toast("Restructure request sent — officer will contact you", "info")
                  }
                  className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-semibold"
                  style={{
                    background: "var(--surface)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Restructure
                </button>
                <button
                  onClick={() =>
                    toast("Connecting to your loan officer", "info")
                  }
                  className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-semibold"
                  style={{
                    background: "var(--surface)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Talk to officer
                </button>
              </div>

              <p
                className="mt-3 text-[11px] leading-relaxed"
                style={{ color: "var(--text-3)" }}
              >
                Continued non-payment may affect your credit score and lead to
                legal action. We&apos;re here to help — talk to a loan officer
                to find a workable plan.
              </p>
            </div>
          </div>
        )}

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

        {/* Table — 5 columns: Due Date · Principal · Interest · Fee/Penalty · Total */}
        <div className="px-4 pb-1 pt-3">
          <h3
            className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider"
            style={{ color: "var(--text-3)" }}
          >
            Repayment table
          </h3>
          <RepaymentTable rows={visible} onRowClick={handleRow} />
        </div>

        <p
          className="px-4 pb-4 pt-2 text-center text-[11px] leading-relaxed"
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
