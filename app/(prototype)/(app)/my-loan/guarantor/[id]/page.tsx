"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { Calendar, Check, Info, X } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { useSheet } from "@/lib/hooks/useSheet";
import { useToast } from "@/lib/hooks/useToast";
import { getGuarantorLoan } from "@/lib/mock";
import { formatMoney } from "@/lib/utils/format";

type Decision = "pending" | "accepted" | "declined";

/**
 * Guarantor Review (Workshop ref: Session 3.F3).
 * Read-only loan preview with Accept / Decline (reason) actions.
 */
export default function GuarantorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { open, close } = useSheet();
  const toast = useToast();
  const loan = getGuarantorLoan(id);
  if (!loan) notFound();

  const [decision, setDecision] = useState<Decision>("pending");

  const onAccept = () => {
    setDecision("accepted");
    toast("Guarantee accepted", "success");
  };

  const onDecline = () => {
    let reason = "Cannot commit financially";
    open(
      <>
        <h3 className="mb-1 text-[17px] font-semibold">Decline guarantee</h3>
        <p className="mb-4 text-[13px]" style={{ color: "var(--text-2)" }}>
          Tell us why so the loan officer knows what to do next.
        </p>

        <div className="flex flex-col gap-2">
          {[
            "Cannot commit financially",
            "Don't know the borrower well",
            "Already a guarantor for someone else",
            "Other",
          ].map((r, i) => (
            <button
              key={r}
              onClick={() => {
                reason = r;
                document
                  .querySelectorAll<HTMLButtonElement>("[data-reason]")
                  .forEach((b) => {
                    b.dataset.checked = b.dataset.reason === r ? "1" : "";
                  });
              }}
              data-reason={r}
              data-checked={i === 0 ? "1" : ""}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm transition data-[checked='1']:border-[var(--primary)]"
              style={{
                background: "var(--surface)",
                border: "1.5px solid var(--border)",
              }}
            >
              <span>{r}</span>
              <Check
                className="h-4 w-4 opacity-0 transition-opacity"
                style={{ color: "var(--primary)" }}
              />
            </button>
          ))}
        </div>

        <Textarea
          className="mt-3"
          rows={3}
          placeholder="Add any additional notes (optional)"
        />

        <Button
          variant="danger"
          className="mt-4"
          onClick={() => {
            close();
            setDecision("declined");
            toast(`Declined: ${reason}`, "info");
          }}
        >
          Confirm Decline
        </Button>
      </>,
    );
  };

  if (decision === "accepted") {
    return (
      <Screen>
        <NavHeader title="Guarantor" back={false} />
        <ScreenBody>
          <div className="mt-8 text-center">
            <div
              className="mx-auto mb-4 grid h-[80px] w-[80px] place-items-center rounded-2xl"
              style={{ background: "rgba(0,196,140,.12)", color: "var(--accent)" }}
            >
              <Check className="h-10 w-10" />
            </div>
            <h1 className="text-[22px] font-bold tracking-tight">
              Thank you, {loan.borrowerName}&apos;s guarantee is confirmed
            </h1>
            <p
              className="mt-2 px-6 text-sm"
              style={{ color: "var(--text-2)" }}
            >
              Your decision has been logged. The borrower and loan officer
              will be notified.
            </p>
          </div>

          <Card className="mt-6">
            <div className="kv-row">
              <span>Borrower</span>
              <span>{loan.borrowerName}</span>
            </div>
            <div className="kv-row">
              <span>Loan amount</span>
              <span>{formatMoney(loan.amount)}</span>
            </div>
            <div className="kv-row">
              <span>Accepted at</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
          </Card>
        </ScreenBody>
        <StickyFooter>
          <Link href="/my-loan" className="btn btn-primary">
            Back to My Loans
          </Link>
        </StickyFooter>
      </Screen>
    );
  }

  if (decision === "declined") {
    return (
      <Screen>
        <NavHeader title="Guarantor" back={false} />
        <ScreenBody>
          <div className="mt-8 text-center">
            <div
              className="mx-auto mb-4 grid h-[80px] w-[80px] place-items-center rounded-2xl"
              style={{ background: "rgba(255,77,94,.12)", color: "var(--danger)" }}
            >
              <X className="h-10 w-10" />
            </div>
            <h1 className="text-[22px] font-bold tracking-tight">
              Guarantee declined
            </h1>
            <p
              className="mt-2 px-6 text-sm"
              style={{ color: "var(--text-2)" }}
            >
              The borrower will be notified to find another guarantor.
            </p>
          </div>
        </ScreenBody>
        <StickyFooter>
          <Link href="/my-loan" className="btn btn-primary">
            Back to My Loans
          </Link>
        </StickyFooter>
      </Screen>
    );
  }

  return (
    <Screen>
      <NavHeader title={`Guarantor — ${loan.borrowerName}`} />
      <ScreenBody>
        <Card
          style={{
            background: "rgba(255,159,28,.08)",
            border: "1px solid rgba(255,159,28,.2)",
          }}
        >
          <div className="flex items-start gap-2.5">
            <Info
              className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
              style={{ color: "var(--warn)" }}
            />
            <div className="text-sm">
              <div className="font-medium">Guarantor request — please review</div>
              <div className="mt-2" style={{ color: "var(--text-2)" }}>
                {loan.borrowerName} has invited you to guarantee this loan. If
                they fail to repay, you are legally responsible. Please respond
                within <b>72 hours</b>.
              </div>
            </div>
          </div>
        </Card>

        <SectionTitle>Loan you would guarantee</SectionTitle>
        <Card>
          <div className="kv-row">
            <span>Borrower</span>
            <span>{loan.borrowerName}</span>
          </div>
          <div className="kv-row">
            <span>Product</span>
            <span>{loan.productName.split("—")[0].trim()}</span>
          </div>
          <div className="kv-row">
            <span>Amount</span>
            <span>{formatMoney(loan.amount)}</span>
          </div>
          <div className="kv-row">
            <span>Term</span>
            <span>{loan.term} months</span>
          </div>
          <div className="kv-row">
            <span>Next payment</span>
            <span>{loan.nextPaymentDate}</span>
          </div>
          <div className="kv-row">
            <span>Status</span>
            <span>
              <Badge tone="success">{loan.status}</Badge>
            </span>
          </div>
        </Card>

        <p
          className="mt-3 text-xs leading-relaxed"
          style={{ color: "var(--text-3)" }}
        >
          For privacy, you cannot see the borrower&apos;s personal financial
          details — only the repayment terms shown above.
        </p>

        <Link
          href={`/my-loan/guarantor/${loan.id}/repayment`}
          className="btn btn-secondary mt-4"
        >
          <Calendar className="h-[18px] w-[18px]" />
          Preview repayment schedule
        </Link>
      </ScreenBody>
      <StickyFooter>
        <div className="flex flex-col gap-2">
          <Button onClick={onAccept}>Accept</Button>
          <Button variant="outline" onClick={onDecline}>
            Decline
          </Button>
        </div>
      </StickyFooter>
    </Screen>
  );
}
