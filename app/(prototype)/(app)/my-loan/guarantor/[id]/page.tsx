"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  Calendar,
  CalendarClock,
  Check,
  Info,
  ShieldCheck,
  X,
} from "lucide-react";
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

  // ---------- Dashboard stats ----------
  // Computed live from the borrower's schedule so guarantor sees real numbers.
  const paidRows = loan.schedule.filter((r) => r.status === "paid");
  const overdueRows = loan.schedule.filter((r) => r.status === "overdue");
  const onTimePaid = paidRows.length; // mock: all paid rows assumed on-time
  const onTimeRate =
    paidRows.length === 0
      ? 100
      : Math.round((onTimePaid / paidRows.length) * 100);
  const totalPaidAmount = paidRows.reduce((s, r) => s + Number(r.amount), 0);
  const remainingExposure = loan.amount - totalPaidAmount;
  const monthsLeft = loan.totalMonths - loan.paidMonths;
  const progressPct = Math.round(
    (loan.paidMonths / loan.totalMonths) * 100,
  );
  // 12-month strip for the activity chart — anchor around the current period.
  const chartStart = Math.max(0, loan.paidMonths - 4);
  const chartRows = loan.schedule.slice(chartStart, chartStart + 12);

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

        {/* ────────── GUARANTOR DASHBOARD ──────────
            Gives the guarantor an at-a-glance read of:
              • exposure (what you'd owe if borrower defaulted today)
              • borrower's track record (on-time %, overdue count)
              • timeline (months left, visual paid-vs-pending chart)
            Privacy: no PII or borrower financials beyond the loan terms. */}
        <SectionTitle>Borrower track record</SectionTitle>

        {/* Hero exposure card */}
        <div
          className="rounded-2xl p-4 text-white"
          style={{
            background: "linear-gradient(135deg, var(--primary), #6aa3ff)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider opacity-85">
                Your max exposure today
              </div>
              <div className="mt-1 text-[26px] font-bold leading-none">
                {formatMoney(remainingExposure)}
              </div>
              <div className="mt-1 text-[11px] opacity-90">
                Down from {formatMoney(loan.amount)} originally
              </div>
            </div>
            <div
              className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl"
              style={{ background: "rgba(255,255,255,.2)" }}
            >
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="mt-4 h-2 overflow-hidden rounded-full"
            style={{ background: "rgba(255,255,255,.2)" }}
          >
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] opacity-90">
            <span>
              {loan.paidMonths}/{loan.totalMonths} months repaid
            </span>
            <span>{progressPct}%</span>
          </div>
        </div>

        {/* 3 stat cards */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div
            className="rounded-2xl p-3 text-center shadow-sm"
            style={{ background: "var(--surface)" }}
          >
            <CalendarClock
              className="mx-auto h-5 w-5"
              style={{ color: "var(--primary)" }}
            />
            <div className="mt-1.5 text-[18px] font-bold leading-none">
              {monthsLeft}
            </div>
            <div
              className="mt-1 text-[10px] uppercase tracking-wider"
              style={{ color: "var(--text-3)" }}
            >
              Months left
            </div>
          </div>
          <div
            className="rounded-2xl p-3 text-center shadow-sm"
            style={{ background: "var(--surface)" }}
          >
            <Check
              className="mx-auto h-5 w-5"
              style={{ color: "var(--accent)" }}
            />
            <div
              className="mt-1.5 text-[18px] font-bold leading-none"
              style={{ color: overdueRows.length === 0 ? "var(--accent)" : "var(--text)" }}
            >
              {onTimeRate}%
            </div>
            <div
              className="mt-1 text-[10px] uppercase tracking-wider"
              style={{ color: "var(--text-3)" }}
            >
              On-time
            </div>
          </div>
          <div
            className="rounded-2xl p-3 text-center shadow-sm"
            style={{ background: "var(--surface)" }}
          >
            <AlertCircle
              className="mx-auto h-5 w-5"
              style={{
                color:
                  overdueRows.length > 0 ? "var(--danger)" : "var(--text-3)",
              }}
            />
            <div
              className="mt-1.5 text-[18px] font-bold leading-none"
              style={{
                color:
                  overdueRows.length > 0 ? "var(--danger)" : "var(--text)",
              }}
            >
              {overdueRows.length}
            </div>
            <div
              className="mt-1 text-[10px] uppercase tracking-wider"
              style={{ color: "var(--text-3)" }}
            >
              Missed
            </div>
          </div>
        </div>

        {/* 12-month activity chart */}
        <div
          className="mt-3 rounded-2xl p-4 shadow-sm"
          style={{ background: "var(--surface)" }}
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wider"
                 style={{ color: "var(--text-3)" }}>
              Payment activity (12-month window)
            </div>
            <div className="flex items-center gap-2 text-[10px]"
                 style={{ color: "var(--text-2)" }}>
              <span className="inline-flex items-center gap-1">
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ background: "var(--accent)" }}
                />
                Paid
              </span>
              <span className="inline-flex items-center gap-1">
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ background: "var(--primary)" }}
                />
                Due
              </span>
              <span className="inline-flex items-center gap-1">
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ background: "var(--border-strong)" }}
                />
                Upcoming
              </span>
            </div>
          </div>

          {/* Bars */}
          <div className="mt-3 flex h-16 items-end gap-1">
            {chartRows.map((r) => {
              const bg =
                r.status === "paid"
                  ? "var(--accent)"
                  : r.status === "overdue"
                    ? "var(--danger)"
                    : r.status === "due"
                      ? "var(--primary)"
                      : "var(--border-strong)";
              const opacity =
                r.status === "pending" ? 0.4 : 1;
              return (
                <div
                  key={r.no}
                  className="flex-1 rounded-t-md"
                  style={{
                    background: bg,
                    opacity,
                    height: r.status === "pending" ? "55%" : "100%",
                  }}
                  title={`#${r.no} · ${r.date} · ${r.status}`}
                />
              );
            })}
          </div>

          {/* Month labels - first and last only to keep it clean */}
          <div className="mt-1.5 flex justify-between text-[10px]"
               style={{ color: "var(--text-3)" }}>
            <span>{chartRows[0]?.date.split(",")[0] ?? ""}</span>
            <span>{chartRows[chartRows.length - 1]?.date.split(",")[0] ?? ""}</span>
          </div>

          <div
            className="mt-3 flex items-center gap-2 rounded-lg p-2.5 text-[11px]"
            style={{
              background:
                overdueRows.length > 0
                  ? "rgba(255,77,94,.08)"
                  : "rgba(0,196,140,.08)",
              color:
                overdueRows.length > 0 ? "var(--danger)" : "var(--accent)",
            }}
          >
            {overdueRows.length > 0 ? (
              <>
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>
                  <b>{overdueRows.length}</b>{" "}
                  {overdueRows.length === 1 ? "payment" : "payments"} missed —
                  consider this carefully before accepting.
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
                <span>
                  {paidRows.length === 0
                    ? "Loan just disbursed — no history yet."
                    : `${onTimePaid} consecutive on-time payment${onTimePaid === 1 ? "" : "s"}. Strong track record.`}
                </span>
              </>
            )}
          </div>
        </div>

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
