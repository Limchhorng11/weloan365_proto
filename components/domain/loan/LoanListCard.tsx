"use client";

import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { DynamicIcon } from "./DynamicIcon";
import { formatMoney } from "@/lib/utils/format";
import type {
  ApprovedLoan,
  GuarantorLoan,
  LoanStatus,
  ProgressingLoan,
  RejectedLoan,
} from "@/lib/types";

type AnyLoan = ProgressingLoan | ApprovedLoan | GuarantorLoan | RejectedLoan;
type Kind = "progressing" | "approved" | "guarantor" | "rejected";

const tone: Record<LoanStatus, "info" | "warn" | "success" | "danger"> = {
  "Under Review": "info",
  "Document Needed": "warn",
  Active: "success",
  Rejected: "danger",
};

export function LoanListCard({
  loan,
  kind,
  href,
}: {
  loan: AnyLoan;
  kind: Kind;
  href: string;
}) {
  let progressPct = 0;
  if (kind === "progressing") {
    const l = loan as ProgressingLoan;
    progressPct = (l.progress / l.totalSteps) * 100;
  } else if (kind === "approved" || kind === "guarantor") {
    const l = loan as ApprovedLoan | GuarantorLoan;
    progressPct = (l.paidMonths / l.totalMonths) * 100;
  }

  return (
    <Link
      href={href}
      className="mb-3 block rounded-2xl p-3.5 shadow-sm"
      style={{ background: "var(--surface)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl text-white"
          style={{ background: loan.color }}
        >
          <DynamicIcon name={loan.icon} className="h-[22px] w-[22px]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="truncate font-medium">{loan.productName}</div>
            <Badge tone={tone[loan.status]}>{loan.status}</Badge>
          </div>
          <div className="mt-1 flex justify-between text-sm" style={{ color: "var(--text-2)" }}>
            <span>{formatMoney(loan.amount)}</span>
            {kind === "progressing" && (
              <span>{(loan as ProgressingLoan).requestedAt}</span>
            )}
            {kind === "approved" && (
              <span>Next · {(loan as ApprovedLoan).nextPaymentDate}</span>
            )}
            {kind === "guarantor" && (
              <span>For {(loan as GuarantorLoan).borrowerName}</span>
            )}
            {kind === "rejected" && (
              <span>{(loan as RejectedLoan).rejectedAt}</span>
            )}
          </div>
        </div>
      </div>

      {kind !== "rejected" && (
        <>
          <div className="mt-3">
            <ProgressBar value={progressPct} />
          </div>
          <div className="mt-2 flex justify-between text-xs" style={{ color: "var(--text-2)" }}>
            {kind === "progressing" && (
              <>
                <span>
                  Step {(loan as ProgressingLoan).progress}/
                  {(loan as ProgressingLoan).totalSteps}
                </span>
                <span>{loan.status}</span>
              </>
            )}
            {(kind === "approved" || kind === "guarantor") && (
              <>
                <span>
                  {(loan as ApprovedLoan | GuarantorLoan).paidMonths}/
                  {(loan as ApprovedLoan | GuarantorLoan).totalMonths} months paid
                </span>
                <span>{progressPct.toFixed(0)}%</span>
              </>
            )}
          </div>
        </>
      )}
    </Link>
  );
}
