"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Lightbulb, XCircle } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getRejectedLoan } from "@/lib/mock";
import { formatMoney } from "@/lib/utils/format";

export default function RejectedDetailPage() {
  const { id } = useParams<{ id: string }>();
  const loan = getRejectedLoan(id);
  if (!loan) notFound();

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
        </Card>

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
        <Link href="/loan/products" className="btn btn-primary">
          Try Another Loan
        </Link>
      </StickyFooter>
    </Screen>
  );
}
