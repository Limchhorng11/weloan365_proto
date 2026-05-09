"use client";

import { notFound, useParams } from "next/navigation";
import { CheckCircle2, ClipboardList, Download } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/lib/hooks/useToast";
import { getApprovedLoan, paymentMethods } from "@/lib/mock";
import { formatMoney } from "@/lib/utils/format";

/**
 * Payment History (Workshop ref: Session 3.F2 / User Flows v1.2 — "Payment History").
 *
 * Read-only list of paid installments with method + reference number.
 * Source data: the schedule rows with status === "paid".
 */
export default function PaymentHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const loan = getApprovedLoan(id);
  if (!loan) notFound();

  // Derive paid records from the schedule. Method rotates through the mock
  // payment methods; reference number is deterministic per row.
  const paid = loan.schedule
    .filter((s) => s.status === "paid")
    .map((s, i) => {
      const method = paymentMethods[i % paymentMethods.length];
      return {
        ...s,
        method,
        reference: `TX-${id.toUpperCase()}-${String(s.no).padStart(3, "0")}`,
        paidAt: s.date.replace(",", "") + " · 09:42 AM",
      };
    })
    .reverse(); // most recent first

  const totalPaid = paid.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <Screen>
      <NavHeader
        title="Payment History"
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
        <div className="px-4 pt-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs" style={{ color: "var(--text-2)" }}>
                  Total paid so far
                </div>
                <div className="text-xl font-bold">{formatMoney(totalPaid)}</div>
                <div className="text-xs" style={{ color: "var(--text-2)" }}>
                  Across {paid.length} payment{paid.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--text-2)" }}>
                  Remaining
                </div>
                <div className="font-bold">{formatMoney(loan.remainingBalance)}</div>
              </div>
            </div>
          </Card>
        </div>

        {paid.length === 0 ? (
          <div className="px-4">
            <EmptyState
              icon={ClipboardList}
              title="No payments yet"
              description="Your first payment will appear here as soon as it clears."
            />
          </div>
        ) : (
          <>
            <h3 className="section-title px-4">Receipts</h3>
            <div
              className="mx-4 overflow-hidden rounded-2xl shadow-sm"
              style={{ background: "var(--surface)" }}
            >
              {paid.map((p) => (
                <button
                  key={p.no}
                  type="button"
                  onClick={() =>
                    toast(`Receipt ${p.reference} downloaded`, "success")
                  }
                  className="flex w-full items-start gap-3 border-b px-4 py-3 text-left last:border-b-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px]"
                    style={{
                      background: `${p.method.color}22`,
                      color: p.method.color,
                    }}
                  >
                    <CheckCircle2 className="h-[18px] w-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[14px] font-semibold leading-tight">
                          Installment #{p.no}
                        </div>
                        <div
                          className="mt-0.5 text-[11px]"
                          style={{ color: "var(--text-3)" }}
                        >
                          {p.paidAt}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[14px] font-bold">
                          {formatMoney(Number(p.amount))}
                        </div>
                        <span
                          className="badge success mt-0.5 inline-flex"
                          style={{ fontSize: 10 }}
                        >
                          Paid
                        </span>
                      </div>
                    </div>
                    <div
                      className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]"
                      style={{ color: "var(--text-2)" }}
                    >
                      <span
                        className="inline-flex items-center gap-1 rounded-md px-1.5 py-px font-medium"
                        style={{
                          background: `${p.method.color}15`,
                          color: p.method.color,
                        }}
                      >
                        {p.method.name}
                      </span>
                      <span className="font-mono">{p.reference}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <p
              className="px-4 pt-3 text-[11px] leading-relaxed"
              style={{ color: "var(--text-3)" }}
            >
              Tap any receipt to download a PDF copy. Statements are kept for
              7 years per NBC requirements.
            </p>
          </>
        )}
      </ScreenBody>
    </Screen>
  );
}
