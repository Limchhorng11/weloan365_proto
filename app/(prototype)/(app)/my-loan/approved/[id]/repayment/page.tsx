"use client";

import { notFound, useParams } from "next/navigation";
import { Download } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { RepaymentRow } from "@/components/domain/loan/RepaymentRow";
import { PaymentSheet } from "@/components/sheets/PaymentSheet";
import { useSheet } from "@/lib/hooks/useSheet";
import { useToast } from "@/lib/hooks/useToast";
import { getApprovedLoan } from "@/lib/mock";
import { formatMoney } from "@/lib/utils/format";

export default function RepaymentSchedulePage() {
  const { id } = useParams<{ id: string }>();
  const { open } = useSheet();
  const toast = useToast();
  const loan = getApprovedLoan(id);
  if (!loan) notFound();

  const remaining = (loan.totalMonths - loan.paidMonths) * Number(loan.schedule[0].amount);

  const onRowClick = (noIdx: number) => {
    const row = loan.schedule[noIdx - 1];
    if (row.status === "due") {
      open(
        <PaymentSheet
          dueAmount={Number(row.amount)}
          installmentNo={row.no}
          dueDate={row.date}
        />,
      );
    } else {
      toast(`Installment #${row.no} details`, "info");
    }
  };

  return (
    <Screen>
      <NavHeader
        title="Repayment Schedule"
        right={
          <button
            className="grid h-9 w-9 place-items-center rounded-[10px]"
            onClick={() => toast("Export to PDF coming soon.", "info")}
          >
            <Download className="h-5 w-5" />
          </button>
        }
      />
      <ScreenBody noPad>
        <div className="p-4 pb-0">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs" style={{ color: "var(--text-2)" }}>
                  Total remaining
                </div>
                <div className="text-xl font-bold">{formatMoney(remaining)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--text-2)" }}>
                  Monthly
                </div>
                <div className="font-bold">
                  {formatMoney(Number(loan.schedule[0].amount))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div
          className="flex gap-3.5 px-4 pb-1 pt-3 text-xs"
          style={{ color: "var(--text-2)" }}
        >
          <span className="inline-flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            Paid
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--primary)" }}
            />
            Due
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--border-strong)" }}
            />
            Pending
          </span>
        </div>

        <div
          className="mx-4 mb-4 overflow-hidden rounded-2xl shadow-sm"
          style={{ background: "var(--surface)" }}
        >
          {loan.schedule.map((row) => (
            <RepaymentRow
              key={row.no}
              row={row}
              onClick={() => onRowClick(row.no)}
            />
          ))}
        </div>
      </ScreenBody>
    </Screen>
  );
}
