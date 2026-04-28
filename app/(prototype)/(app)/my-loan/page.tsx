"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  CheckCircle,
  FileText,
  UserCheck,
  XCircle,
} from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoanListCard } from "@/components/domain/loan/LoanListCard";
import {
  approvedLoans,
  guarantorLoans,
  progressingLoans,
  rejectedLoans,
} from "@/lib/mock";

/**
 * My Loans tab.
 *
 * Top-level tabs:
 *   - "active"   → Active Loan (default): approved loans ready for repayment
 *   - "progress" → Progress Loan: anything not in active repayment
 *
 * When "progress" is selected, a sub-tab row appears with three states:
 *   - "progress"  → applications still under review
 *   - "guarantor" → loans the user guarantees for someone else
 *   - "rejected"  → applications that were declined
 *
 * URL params: `?tab=active` or `?tab=progress&sub=guarantor`
 * Backward compat: legacy `?tab=progressing|approved|guarantor|rejected` works.
 */
type Segment = "active" | "progress";
type SubSegment = "progress" | "guarantor" | "rejected";

function normalizeTab(raw: string | null): {
  segment: Segment;
  sub?: SubSegment;
} {
  if (raw === "active" || raw === "approved") return { segment: "active" };
  if (raw === "guarantor") return { segment: "progress", sub: "guarantor" };
  if (raw === "rejected") return { segment: "progress", sub: "rejected" };
  if (raw === "progress" || raw === "progressing")
    return { segment: "progress", sub: "progress" };
  return { segment: "active" };
}

export default function MyLoanPage() {
  const router = useRouter();
  const params = useSearchParams();

  const { segment, sub: initialSub } = normalizeTab(params.get("tab"));
  const subFromUrl = (params.get("sub") as SubSegment | null) ?? initialSub;
  const sub: SubSegment = subFromUrl ?? "progress";

  const setSegment = (s: Segment) => {
    router.replace(s === "progress" ? "/my-loan?tab=progress&sub=progress" : "/my-loan?tab=active");
  };
  const setSub = (s: SubSegment) => {
    router.replace(`/my-loan?tab=progress&sub=${s}`);
  };

  // ---------- Active Loan view ----------
  if (segment === "active") {
    return (
      <Screen>
        <NavHeader
          title="My Loans"
          back={false}
          right={
            <Link
              href="/more/notifications"
              className="grid h-9 w-9 place-items-center rounded-[10px]"
            >
              <Bell className="h-5 w-5" />
            </Link>
          }
        />
        <ScreenBody hasTabBar>
          <Segmented
            value={segment}
            onChange={setSegment}
            options={[
              {
                value: "active",
                label: `Active Loan${approvedLoans.length ? ` (${approvedLoans.length})` : ""}`,
              },
              {
                value: "progress",
                label: `Progress Loan${progressingLoans.length + guarantorLoans.length + rejectedLoans.length ? ` (${progressingLoans.length + guarantorLoans.length + rejectedLoans.length})` : ""}`,
              },
            ]}
          />

          {approvedLoans.length > 0 && (
            <div
              className="mt-4 rounded-2xl p-4 text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), #6aa3ff)",
              }}
            >
              <div className="text-[11px] uppercase tracking-wider opacity-85">
                Next payment due
              </div>
              <div className="mt-1 flex items-end justify-between">
                <div>
                  <div className="text-[24px] font-bold leading-none">
                    ${approvedLoans[0].nextPayment.toFixed(2)}
                  </div>
                  <div className="mt-1 text-xs opacity-90">
                    {approvedLoans[0].productName} ·{" "}
                    {approvedLoans[0].nextPaymentDate}
                  </div>
                </div>
                <Link
                  href={`/my-loan/approved/${approvedLoans[0].id}`}
                  className="rounded-lg px-3 py-2 text-xs font-semibold"
                  style={{ background: "rgba(255,255,255,.2)" }}
                >
                  Pay now →
                </Link>
              </div>
            </div>
          )}

          <div className="mt-4">
            {approvedLoans.length === 0 ? (
              <EmptyState
                icon={CheckCircle}
                title="No active loans yet"
                description="Once an application is approved and disbursed, your loan will appear here ready for repayment."
                action={
                  <Link
                    href="/loan/products"
                    className="btn btn-secondary btn-sm mt-3"
                  >
                    Browse loans
                  </Link>
                }
              />
            ) : (
              approvedLoans.map((l) => (
                <LoanListCard
                  key={l.id}
                  loan={l}
                  kind="approved"
                  href={`/my-loan/approved/${l.id}`}
                />
              ))
            )}
          </div>
        </ScreenBody>
      </Screen>
    );
  }

  // ---------- Progress Loan view (with sub-tabs) ----------
  const subData =
    sub === "progress"
      ? progressingLoans
      : sub === "guarantor"
        ? guarantorLoans
        : rejectedLoans;

  const hrefFor = (id: string) =>
    sub === "progress"
      ? `/my-loan/progressing/${id}`
      : sub === "guarantor"
        ? `/my-loan/guarantor/${id}`
        : `/my-loan/rejected/${id}`;

  const empty =
    sub === "progress"
      ? {
          icon: FileText,
          title: "No applications in progress",
          description: "Submit an application and track its status here.",
        }
      : sub === "guarantor"
        ? {
            icon: UserCheck,
            title: "Not a guarantor",
            description: "Loans you guarantee for others will appear here.",
          }
        : {
            icon: XCircle,
            title: "No rejected applications",
            description: "Past rejected applications will be shown here.",
          };

  return (
    <Screen>
      <NavHeader
        title="My Loans"
        back={false}
        right={
          <Link
            href="/more/notifications"
            className="grid h-9 w-9 place-items-center rounded-[10px]"
          >
            <Bell className="h-5 w-5" />
          </Link>
        }
      />
      <ScreenBody hasTabBar>
        <Segmented
          value={segment}
          onChange={setSegment}
          options={[
            {
              value: "active",
              label: `Active Loan${approvedLoans.length ? ` (${approvedLoans.length})` : ""}`,
            },
            {
              value: "progress",
              label: `Progress Loan${progressingLoans.length + guarantorLoans.length + rejectedLoans.length ? ` (${progressingLoans.length + guarantorLoans.length + rejectedLoans.length})` : ""}`,
            },
          ]}
        />

        {/* Sub-tabs for Progress Loan */}
        <div className="mt-3">
          <Segmented
            value={sub}
            onChange={setSub}
            options={[
              {
                value: "progress",
                label: `Progress${progressingLoans.length ? ` · ${progressingLoans.length}` : ""}`,
              },
              {
                value: "guarantor",
                label: `Guarantor${guarantorLoans.length ? ` · ${guarantorLoans.length}` : ""}`,
              },
              {
                value: "rejected",
                label: `Rejected${rejectedLoans.length ? ` · ${rejectedLoans.length}` : ""}`,
              },
            ]}
          />
        </div>

        <div className="mt-4">
          {subData.length === 0 ? (
            <EmptyState
              icon={empty.icon}
              title={empty.title}
              description={empty.description}
              action={
                <Link
                  href="/loan/products"
                  className="btn btn-secondary btn-sm mt-3"
                >
                  Browse loans
                </Link>
              }
            />
          ) : (
            subData.map((l) => (
              <LoanListCard
                key={l.id}
                loan={l}
                kind={sub === "progress" ? "progressing" : sub}
                href={hrefFor(l.id)}
              />
            ))
          )}
        </div>
      </ScreenBody>
    </Screen>
  );
}
