"use client";

import Link from "next/link";
import {
  BadgeCheck,
  Check,
  Info,
  MapPin,
  MessageCircle,
  Phone,
  UserCircle2,
} from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/lib/hooks/useToast";
import { getStaffByCode } from "@/lib/mock";
import { useAdvisorStore } from "@/stores/advisor";

const SOURCE_LABEL = {
  signup: "Linked at sign-up",
  "loan-application": "Linked during loan application",
} as const;

/**
 * Referral History.
 *
 * Each customer has **one** advisor. This screen shows:
 *  • the staff member currently linked (or an empty state)
 *  • the single event that linked them (sign-up or loan application)
 *
 * To change the advisor, the customer must visit a branch — this is a
 * deliberate friction point in the business rule.
 */
export default function ReferralsPage() {
  const toast = useToast();
  const code = useAdvisorStore((s) => s.code);
  const source = useAdvisorStore((s) => s.source);
  const date = useAdvisorStore((s) => s.date);
  const advisor = code ? getStaffByCode(code) : undefined;

  return (
    <Screen>
      <NavHeader title="Referral History" />
      <ScreenBody>
        <p
          className="-mt-1 mb-1 text-sm leading-relaxed"
          style={{ color: "var(--text-2)" }}
        >
          You have one personal advisor at Weloan365 — the staff member whose
          referral code you used. They&apos;re your point of contact for
          everything on your account.
        </p>

        {advisor ? (
          <>
            <SectionTitle>Your advisor</SectionTitle>
            <Card>
              <div className="flex items-start gap-3.5">
                <Avatar
                  size="lg"
                  initials={advisor.initials}
                  bg={advisor.color}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[15px] font-semibold leading-tight">
                    {advisor.name}
                    <BadgeCheck
                      className="h-4 w-4 flex-shrink-0"
                      style={{ color: "var(--accent)" }}
                    />
                  </div>
                  <div
                    className="mt-1 text-[12px] font-medium"
                    style={{ color: "var(--primary)" }}
                  >
                    {advisor.role} · {advisor.roleShort}
                  </div>
                  <div
                    className="mt-0.5 inline-flex items-center gap-1 text-[11px]"
                    style={{ color: "var(--text-2)" }}
                  >
                    <MapPin className="h-3 w-3" />
                    {advisor.branchName}
                  </div>
                  <div
                    className="mt-2 text-[11px]"
                    style={{ color: "var(--text-3)" }}
                  >
                    Your advisor since <b>{date ?? "—"}</b>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/chat"
                  className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-semibold"
                  style={{
                    background: "var(--primary-50)",
                    color: "var(--primary)",
                  }}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Message
                </Link>
                <button
                  onClick={() => toast(`Calling ${advisor.name}…`, "info")}
                  className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-semibold"
                  style={{
                    background: "var(--surface-2)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call branch
                </button>
              </div>
            </Card>

            <SectionTitle>How you were linked</SectionTitle>
            <div
              className="overflow-hidden rounded-2xl shadow-sm"
              style={{ background: "var(--surface)" }}
            >
              <div className="flex items-start gap-3 px-4 py-3.5">
                <div
                  className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px]"
                  style={{
                    background: "rgba(0,196,140,.12)",
                    color: "var(--accent)",
                  }}
                >
                  <Check className="h-[18px] w-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold">
                    {source ? SOURCE_LABEL[source] : "Linked"}
                  </div>
                  <div
                    className="mt-1.5 flex items-center gap-1.5 text-[12px]"
                    style={{ color: "var(--text-2)" }}
                  >
                    <span
                      className="font-mono rounded-md px-1.5 py-px text-[10px] font-semibold"
                      style={{
                        background: `${advisor.color}15`,
                        color: advisor.color,
                      }}
                    >
                      {advisor.code}
                    </span>
                    → {advisor.name}{" "}
                    <span style={{ color: "var(--text-3)" }}>
                      ({advisor.roleShort})
                    </span>
                  </div>
                </div>
                <div
                  className="flex-shrink-0 text-right text-[11px]"
                  style={{ color: "var(--text-3)" }}
                >
                  {date ?? "—"}
                </div>
              </div>
            </div>

            <Card
              className="mt-4"
              style={{
                background: "rgba(31,95,255,.05)",
                border: "1px solid rgba(31,95,255,.15)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <Info
                  className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
                  style={{ color: "var(--primary)" }}
                />
                <div className="text-xs leading-relaxed">
                  <div className="font-medium">One advisor per account</div>
                  <div className="mt-1.5" style={{ color: "var(--text-2)" }}>
                    You can have only one advisor at a time. To change yours,
                    visit your nearest branch with valid ID and request a
                    transfer — the new advisor will be linked once approved.
                  </div>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <>
            <EmptyState
              icon={UserCircle2}
              title="No advisor yet"
              description="You haven't been linked to a Weloan365 staff member yet. On your next loan application, enter a 5-digit referral code from a Credit Officer or branch staff to link them as your permanent advisor."
            />
            <Card
              className="mt-2"
              style={{
                background: "rgba(31,95,255,.05)",
                border: "1px solid rgba(31,95,255,.15)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <Info
                  className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
                  style={{ color: "var(--primary)" }}
                />
                <div className="text-xs leading-relaxed">
                  <div className="font-medium">
                    Why does an advisor matter?
                  </div>
                  <div className="mt-1.5" style={{ color: "var(--text-2)" }}>
                    Your advisor handles your applications, answers questions
                    about your account, and is the consistent point of
                    contact at Weloan365 for everything you do.
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
      </ScreenBody>
    </Screen>
  );
}
