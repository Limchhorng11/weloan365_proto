"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { CalendarClock, Lightbulb, Lock, XCircle } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getRejectedLoan } from "@/lib/mock";
import { formatMoney } from "@/lib/utils/format";
import {
  REJECTION_LIMIT_PER_MONTH,
  isProductLockedThisMonth,
  nextMonthResetLabel,
  productRejectionsThisMonth,
  rejectionOrdinalThisMonth,
  remainingForProductThisMonth,
} from "@/lib/utils/rejection";

/**
 * Rejected loan detail.
 *
 * Surfaces the **3-rejections-per-month** policy:
 *   • A counter chip ("Rejection 2 of 3 this month") sits next to the date.
 *   • When the customer is at the cap, a red Lock card replaces the
 *     "Try another loan" CTA with a wait-until-next-month message.
 *   • A green capacity card otherwise tells them how many attempts are
 *     left so they can pace themselves.
 */
export default function RejectedDetailPage() {
  const { id } = useParams<{ id: string }>();
  const loan = getRejectedLoan(id);
  if (!loan) notFound();

  const ordinal = rejectionOrdinalThisMonth(loan.id);
  const productId = loan.productId ?? "";
  const totalForProduct = productId
    ? productRejectionsThisMonth(productId).length
    : 0;
  const remaining = productId
    ? remainingForProductThisMonth(productId)
    : REJECTION_LIMIT_PER_MONTH;
  const locked = productId ? isProductLockedThisMonth(productId) : false;
  const isThisMonth = ordinal > 0;

  return (
    <Screen>
      <NavHeader title="Application Rejected" />
      <ScreenBody>
        <Card className="px-4 py-6 text-center">
          <div
            className="mx-auto mb-3 grid h-[60px] w-[60px] place-items-center rounded-xl"
            style={{
              background: "rgba(255,77,94,.12)",
              color: "var(--danger)",
            }}
          >
            <XCircle className="h-7 w-7" />
          </div>
          <h3 className="mb-1 text-base font-semibold">
            Your application was not approved
          </h3>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            Submitted on {loan.rejectedAt}
          </p>

          {/* Counter chip — present on every rejected detail in current month */}
          {isThisMonth && (
            <span
              className="mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{
                background: locked
                  ? "rgba(255,77,94,.12)"
                  : "rgba(255,159,28,.15)",
                color: locked ? "var(--danger)" : "#cc7a00",
              }}
            >
              <CalendarClock className="h-3 w-3" />
              Rejection {ordinal} of {REJECTION_LIMIT_PER_MONTH} for{" "}
              {loan.productName} this month
            </span>
          )}
        </Card>

        {/* Monthly-limit notice — varies by state */}
        {locked ? (
          <Card
            className="mt-3"
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
                <Lock className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--danger)" }}
                >
                  {loan.productName} locked this month
                </div>
                <div className="mt-0.5 text-[14px] font-semibold">
                  {totalForProduct} of {REJECTION_LIMIT_PER_MONTH} rejections
                  for {loan.productName}
                </div>
                <div
                  className="mt-1 text-[12px] leading-relaxed"
                  style={{ color: "var(--text-2)" }}
                >
                  You can re-apply for <b>{loan.productName}</b> starting{" "}
                  <b>{nextMonthResetLabel()}</b>. Other loan products are
                  still available right now.
                </div>
              </div>
            </div>
          </Card>
        ) : (
          remaining < REJECTION_LIMIT_PER_MONTH && (
            <Card
              className="mt-3"
              style={{
                background: "rgba(255,159,28,.08)",
                border: "1px solid rgba(255,159,28,.25)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <CalendarClock
                  className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
                  style={{ color: "var(--warn)" }}
                />
                <div className="text-[12px] leading-relaxed">
                  <span className="font-semibold">
                    {remaining} application
                    {remaining === 1 ? "" : "s"} left for {loan.productName}{" "}
                    this month.
                  </span>{" "}
                  Each product has a {REJECTION_LIMIT_PER_MONTH}-rejection
                  cap per calendar month — be sure your next submission is
                  your best.
                </div>
              </div>
            </Card>
          )
        )}

        <SectionTitle>Reason</SectionTitle>
        <Card>
          <p className="text-sm leading-relaxed">{loan.reason}</p>
        </Card>

        <SectionTitle>What you can do next</SectionTitle>
        <Card>
          {loan.suggestions.map((s) => (
            <div key={s} className="mb-2.5 flex items-start gap-2.5">
              <Lightbulb
                className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
                style={{ color: "var(--warn)" }}
              />
              <span className="text-sm">{s}</span>
            </div>
          ))}
        </Card>

        <SectionTitle>Your application</SectionTitle>
        <Card>
          <div className="kv-row">
            <span>Product</span>
            <span>{loan.productName}</span>
          </div>
          <div className="kv-row">
            <span>Amount requested</span>
            <span>{formatMoney(loan.amount)}</span>
          </div>
          <div className="kv-row">
            <span>Status</span>
            <span>
              <Badge tone="danger">{loan.status}</Badge>
            </span>
          </div>
        </Card>
      </ScreenBody>
      <StickyFooter>
        {locked ? (
          <div className="flex flex-col gap-2">
            <Link href="/loan/products" className="btn btn-primary">
              Browse other products
            </Link>
            <div
              className="flex items-center gap-2.5 rounded-xl p-2.5 text-[11px]"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--text-2)",
              }}
            >
              <Lock
                className="h-3.5 w-3.5 flex-shrink-0"
                style={{ color: "var(--text-3)" }}
              />
              <span>
                {loan.productName} re-opens on{" "}
                <b>{nextMonthResetLabel()}</b>
              </span>
            </div>
          </div>
        ) : (
          <Link href="/loan/products" className="btn btn-primary">
            Try Another Loan
          </Link>
        )}
      </StickyFooter>
    </Screen>
  );
}
