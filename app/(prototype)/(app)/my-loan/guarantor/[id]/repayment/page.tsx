"use client";

import { notFound, useParams } from "next/navigation";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { RepaymentRow } from "@/components/domain/loan/RepaymentRow";
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
        <div
          className="mx-4 my-4 overflow-hidden rounded-2xl shadow-sm"
          style={{ background: "var(--surface)" }}
        >
          {loan.schedule.map((row) => (
            <RepaymentRow
              key={row.no}
              row={row}
              onClick={() => toast(`Installment #${row.no}`, "info")}
            />
          ))}
        </div>
      </ScreenBody>
    </Screen>
  );
}
