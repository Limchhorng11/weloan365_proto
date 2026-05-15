"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CreditCard,
  FileText,
  PiggyBank,
  Sparkles,
} from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoanSummary } from "@/components/domain/loan/LoanSummary";
import { PaymentSheet } from "@/components/sheets/PaymentSheet";
import { useSheet } from "@/lib/hooks/useSheet";
import { useToast } from "@/lib/hooks/useToast";
import { getApprovedLoan } from "@/lib/mock";
import { formatMoney } from "@/lib/utils/format";

export default function ApprovedDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { open } = useSheet();
  const toast = useToast();
  const loan = getApprovedLoan(id);
  if (!loan) notFound();

  const pct = Math.round((loan.paidMonths / loan.totalMonths) * 100);

  // Overdue summary — only used when overdueMonths > 0. Keeps the math
  // local to this card so the same numbers appear here and on the full
  // Repayment Schedule overdue board.
  const overdueRows = loan.schedule.filter((r) => r.status === "overdue");
  const overdueAmount = overdueRows.reduce((s, r) => s + Number(r.amount), 0);
  const penaltyRate = loan.penaltyRate ?? 0.1;
  const penaltyTotal = overdueAmount * penaltyRate;
  const overdueGrandTotal = overdueAmount + penaltyTotal;
  const firstOverdueDate = overdueRows[0]?.date;
  const isOverdue = (loan.overdueMonths ?? 0) > 0;

  // Settle Early savings — sum the interest column of every unpaid row.
  // That's exactly what the customer would skip by paying off today.
  const remainingMonths = loan.totalMonths - loan.paidMonths;
  const potentialSavings = loan.schedule
    .filter((r) => r.status !== "paid")
    .reduce((sum, r) => sum + Number(r.interest), 0);

  return (
    <Screen>
      <NavHeader title="Loan Details" />
      <ScreenBody>
        <LoanSummary
          background={loan.color}
          label="Remaining balance"
          amount={formatMoney(loan.remainingBalance)}
          stats={[
            { label: "Original amount", value: formatMoney(loan.amount) },
            { label: "Paid", value: formatMoney(loan.totalPaid) },
            { label: "Term", value: `${loan.term} mo` },
          ]}
        />

        {/* Overdue alert — surfaces before the regular "next payment" card,
            with its own Pay Now button so the customer can settle the full
            overdue + penalty without leaving this screen. */}
        {(loan.overdueMonths ?? 0) > 0 && (
          <div
            className="mb-3 rounded-2xl p-3.5"
            style={{
              background: "rgba(255,77,94,.08)",
              border: "1.5px solid rgba(255,77,94,.3)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl"
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
                <div className="mt-0.5 text-[14px] font-semibold">
                  {loan.overdueMonths} missed payment
                  {loan.overdueMonths === 1 ? "" : "s"}{" "}
                  {firstOverdueDate ? `since ${firstOverdueDate}` : ""}
                </div>
                <div
                  className="mt-0.5 text-[12px]"
                  style={{ color: "var(--text-2)" }}
                >
                  Total to settle (incl. {Math.round(penaltyRate * 100)}%
                  penalty){" "}
                  <b style={{ color: "var(--danger)" }}>
                    {formatMoney(overdueGrandTotal)}
                  </b>
                </div>
              </div>
            </div>

            {/* Pay Now — settles the FULL overdue including penalty.
                Custom 2-line pill (not the standard Button) so the amount
                gets visual priority. */}
            <button
              type="button"
              onClick={() =>
                open(
                  <PaymentSheet
                    dueAmount={overdueGrandTotal}
                    dueDate={`${loan.overdueMonths} months overdue`}
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

            <Link
              href={`/my-loan/approved/${loan.id}/repayment`}
              className="mt-2 block text-center text-[12px] font-semibold"
              style={{ color: "var(--danger)" }}
            >
              See full breakdown →
            </Link>
          </div>
        )}

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs" style={{ color: "var(--text-2)" }}>
                Next payment
              </div>
              <div className="text-xl font-bold">
                {formatMoney(loan.nextPayment)}
              </div>
              <div className="text-xs" style={{ color: "var(--text-2)" }}>
                Due {loan.nextPaymentDate}
              </div>
            </div>
            <Button
              size="sm"
              className="w-auto"
              leading={<CreditCard className="h-4 w-4" />}
              onClick={() =>
                open(
                  <PaymentSheet
                    dueAmount={loan.nextPayment}
                    dueDate={loan.nextPaymentDate}
                  />,
                )
              }
            >
              Pay Now
            </Button>
          </div>
          <div className="mt-4">
            <ProgressBar value={pct} />
          </div>
          <div
            className="mt-2 flex justify-between text-xs"
            style={{ color: "var(--text-2)" }}
          >
            <span>
              {loan.paidMonths}/{loan.totalMonths} months paid
            </span>
            <span>{pct}%</span>
          </div>
        </Card>

        <SectionTitle>Loan info</SectionTitle>
        <Card>
          <div className="kv-row">
            <span>Product</span>
            <span>{loan.productName}</span>
          </div>
          <div className="kv-row">
            <span>Approved on</span>
            <span>{loan.approvedAt}</span>
          </div>
          <div className="kv-row">
            <span>Monthly payment</span>
            <span>{formatMoney(loan.nextPayment)}</span>
          </div>
          <div className="kv-row">
            <span>Status</span>
            <span>
              <Badge tone="success">{loan.status}</Badge>
            </span>
          </div>
        </Card>

        {/* Settle Early — promoted out of Quick Actions into its own hero
            card. Hidden for overdue loans. Headline calls out both the
            interest savings AND the time saved, with a stats row that
            mirrors the standard loan summary so it feels native. */}
        {!isOverdue && potentialSavings > 0 && (
          <button
            type="button"
            onClick={() =>
              toast(
                `Quote sent: pay ${formatMoney(loan.remainingBalance)} today, save ${formatMoney(potentialSavings)}`,
                "success",
              )
            }
            className="relative mt-5 block w-full overflow-hidden rounded-2xl p-5 text-left text-white transition active:scale-[.99]"
            style={{
              background: "linear-gradient(135deg, #00c48c 0%, #00796b 100%)",
              boxShadow: "0 10px 24px rgba(0,196,140,.25)",
            }}
          >
            {/* Decorative piggy bank in the corner */}
            <PiggyBank
              className="absolute -right-4 -top-2 h-28 w-28 opacity-10"
              strokeWidth={1.5}
            />

            <div className="relative">
              <div
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{ background: "rgba(255,255,255,.2)" }}
              >
                <Sparkles className="h-3 w-3" /> Settle early — no penalty
              </div>

              <h3 className="mt-3 text-[22px] font-extrabold leading-tight">
                Skip {remainingMonths} months.<br />
                Save{" "}
                <span
                  className="rounded-md px-1.5 py-0.5"
                  style={{ background: "rgba(255,255,255,.18)" }}
                >
                  {formatMoney(potentialSavings)}
                </span>
                .
              </h3>

              {/* Stats row */}
              <div
                className="mt-4 grid grid-cols-2 gap-3 border-t pt-3"
                style={{ borderColor: "rgba(255,255,255,.2)" }}
              >
                <div>
                  <div className="text-[10px] uppercase tracking-wider opacity-80">
                    Pay today
                  </div>
                  <div className="mt-0.5 text-[15px] font-bold leading-none">
                    {formatMoney(loan.remainingBalance)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider opacity-80">
                    You save
                  </div>
                  <div className="mt-0.5 text-[15px] font-bold leading-none">
                    {formatMoney(potentialSavings)}
                  </div>
                </div>
              </div>

              <div
                className="mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold"
                style={{ background: "#fff", color: "#00796b" }}
              >
                Get my settlement quote
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </button>
        )}

        <SectionTitle>Quick actions</SectionTitle>
        <ListGroup>
          <Link
            href={`/my-loan/approved/${loan.id}/repayment`}
            className="list-row"
          >
            <div className="list-icon">
              <Calendar className="h-[18px] w-[18px]" />
            </div>
            <div className="list-main">
              <div className="list-title">Schedule &amp; history</div>
              <div className="list-sub">
                {loan.paidMonths} paid · {loan.totalMonths - loan.paidMonths} upcoming · receipts
              </div>
            </div>
          </Link>
          <ListRow
            icon={FileText}
            iconBg="rgba(255,159,28,.15)"
            iconColor="#cc7a00"
            title="Loan contract"
            sub="PDF · 240 KB"
            onClick={() => toast("Downloading loan contract PDF…", "info")}
          />
        </ListGroup>
      </ScreenBody>
    </Screen>
  );
}
