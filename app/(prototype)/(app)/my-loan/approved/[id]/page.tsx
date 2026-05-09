"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Calendar, ClipboardList, CreditCard, FileText, TrendingDown } from "lucide-react";
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
              <div className="list-title">Repayment schedule</div>
              <div className="list-sub">All installments — paid &amp; upcoming</div>
            </div>
          </Link>
          <Link
            href={`/my-loan/approved/${loan.id}/history`}
            className="list-row"
          >
            <div
              className="list-icon"
              style={{
                background: "rgba(0,196,140,.12)",
                color: "var(--accent)",
              }}
            >
              <ClipboardList className="h-[18px] w-[18px]" />
            </div>
            <div className="list-main">
              <div className="list-title">Payment history</div>
              <div className="list-sub">
                {loan.paidMonths} payment{loan.paidMonths === 1 ? "" : "s"} · receipts
              </div>
            </div>
          </Link>
          <ListRow
            icon={TrendingDown}
            iconBg="rgba(0,196,140,.12)"
            iconColor="#00a677"
            title="Settle early"
            sub="Save on interest"
            onClick={() => toast("Early settlement quote requested.", "info")}
          />
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
