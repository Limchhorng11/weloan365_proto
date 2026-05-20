"use client";

import { notFound, useParams } from "next/navigation";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { RepaymentTable } from "@/components/domain/loan/RepaymentTable";
import { getGuarantorLoan } from "@/lib/mock";
import { useToast } from "@/lib/hooks/useToast";

export default function GuarantorRepaymentPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const loan = getGuarantorLoan(id);
  if (!loan) notFound();

  return (
    <Screen>
      <NavHeader title="Repayment Schedule (Guarantor)" />
      <ScreenBody noPad>
        <div className="px-4 pt-4">
          <h3
            className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider"
            style={{ color: "var(--text-3)" }}
          >
            Repayment table
          </h3>
          <RepaymentTable
            rows={loan.schedule}
            onRowClick={(row) =>
              toast(`Installment #${row.no} · ${row.date}`, "info")
            }
          />
        </div>
        <p
          className="px-4 pb-4 pt-2 text-center text-[11px] leading-relaxed"
          style={{ color: "var(--text-3)" }}
        >
          You&apos;re the guarantor — repayment is the borrower&apos;s
          responsibility. Tap a row to see details.
        </p>
      </ScreenBody>
    </Screen>
  );
}
