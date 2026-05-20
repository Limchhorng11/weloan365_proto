"use client";

import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  CalendarOff,
  CheckCircle2,
  Clock,
  HeartPulse,
  Info,
  Send,
  TimerReset,
  TrendingDown,
  Users,
} from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { SuccessSheet } from "@/components/sheets/SuccessSheet";
import { useSheet } from "@/lib/hooks/useSheet";
import { getApprovedLoan } from "@/lib/mock";
import { formatMoney } from "@/lib/utils/format";
import { calculateEmi } from "@/lib/utils/emi";

/**
 * Loan Restructuring
 * ------------------
 * Lets the borrower request changes to an active loan's repayment terms
 * when their situation changes (job loss, medical emergency, etc.).
 *
 * UX is a single-screen form so customers in distress aren't pushed
 * through a long wizard:
 *   • Reason picker     — chips
 *   • Restructure type  — 3 cards: Extend term · Payment holiday · Interest-only
 *   • Type-specific knob (months to extend / pause)
 *   • Live preview      — current EMI vs new EMI / months saved or added
 *   • Acknowledgement   — interest charges + reviewer confirmation
 *   • Submit            — opens SuccessSheet, routes back to loan detail
 *
 * The prototype assumes a 1.2%/mo implicit rate on the remaining balance
 * (typical for the catalog). Production would use the loan's actual rate.
 */
const IMPLIED_MONTHLY_RATE = 1.2;

type RestructureKind = "extend" | "holiday" | "interest-only";

const REASONS = [
  { v: "job", l: "Job loss / reduced income", icon: Briefcase },
  { v: "medical", l: "Medical emergency", icon: HeartPulse },
  { v: "family", l: "Family hardship", icon: Users },
  { v: "business", l: "Business downturn", icon: TrendingDown },
  { v: "other", l: "Other reason", icon: Info },
] as const;

type ReasonKey = (typeof REASONS)[number]["v"];

export default function RestructurePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { open, close } = useSheet();
  const loan = getApprovedLoan(id);
  if (!loan) notFound();

  const remainingMonths = loan.totalMonths - loan.paidMonths;
  const currentEmi = loan.nextPayment;

  const [reason, setReason] = useState<ReasonKey | null>(null);
  const [reasonNote, setReasonNote] = useState("");
  const [kind, setKind] = useState<RestructureKind>("extend");
  const [extraMonths, setExtraMonths] = useState(6);
  const [holidayMonths, setHolidayMonths] = useState(2);
  const [interestOnlyMonths, setInterestOnlyMonths] = useState(3);
  const [acknowledge, setAcknowledge] = useState(false);

  // Recalculated preview values per restructure type. All math is local
  // to keep this page self-contained; production would call a quote API.
  const preview = (() => {
    const r = IMPLIED_MONTHLY_RATE / 100;
    const balance = loan.remainingBalance;

    if (kind === "extend") {
      const newMonths = remainingMonths + extraMonths;
      const { emi: newEmi } = calculateEmi(
        balance,
        newMonths,
        IMPLIED_MONTHLY_RATE,
      );
      return {
        newEmi,
        newTotalMonths: loan.totalMonths + extraMonths,
        emiDelta: newEmi - currentEmi,
        monthsDelta: extraMonths,
        note: `Term extended by ${extraMonths} months · lower monthly`,
      };
    }

    if (kind === "holiday") {
      // Skip N installments — interest accrues during the holiday and the
      // term shifts by N months. EMI stays the same after holiday.
      const accruedInterest = balance * r * holidayMonths;
      const newBalance = balance + accruedInterest;
      const { emi: newEmi } = calculateEmi(
        newBalance,
        remainingMonths,
        IMPLIED_MONTHLY_RATE,
      );
      return {
        newEmi,
        newTotalMonths: loan.totalMonths + holidayMonths,
        emiDelta: newEmi - currentEmi,
        monthsDelta: holidayMonths,
        note: `${holidayMonths}-month payment pause · interest still accrues`,
      };
    }

    // interest-only: pay only interest for N months, then resume full EMI
    const interestOnlyEmi = balance * r;
    return {
      newEmi: interestOnlyEmi,
      newTotalMonths: loan.totalMonths + interestOnlyMonths,
      emiDelta: interestOnlyEmi - currentEmi,
      monthsDelta: interestOnlyMonths,
      note: `Interest-only for ${interestOnlyMonths} months · resume full EMI after`,
    };
  })();

  const canSubmit = reason !== null && acknowledge;

  const onSubmit = () => {
    open(
      <SuccessSheet
        title="Restructure request sent"
        description={`Request RST-2026-05-${Math.floor(Math.random() * 9000) + 1000}. A credit officer will review and contact you within 2 business days to confirm the new terms.`}
        primaryLabel="Back to loan details"
        onPrimary={() => {
          close();
          router.push(`/my-loan/approved/${loan.id}`);
        }}
      />,
    );
  };

  return (
    <Screen>
      <NavHeader title="Restructure payment" />
      <ScreenBody>
        {/* Current loan snapshot */}
        <Card className="mb-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="text-xs" style={{ color: "var(--text-2)" }}>
                {loan.productName}
              </div>
              <div className="mt-0.5 text-[15px] font-semibold">
                Outstanding {formatMoney(loan.remainingBalance)}
              </div>
              <div className="text-[11px]" style={{ color: "var(--text-3)" }}>
                {remainingMonths} months left · {formatMoney(currentEmi)} / mo
              </div>
            </div>
            <div
              className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl text-white"
              style={{ background: loan.color }}
            >
              <TimerReset className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card
          className="mb-3"
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
              Restructuring helps you stay on track when your situation
              changes. A credit officer reviews every request — final terms
              are confirmed in writing before they take effect.
            </div>
          </div>
        </Card>

        {/* ── Reason ───────────────────────────────────────── */}
        <SectionTitle>Why do you need to restructure?</SectionTitle>
        <div className="grid grid-cols-1 gap-2">
          {REASONS.map((r) => {
            const I = r.icon;
            const active = r.v === reason;
            return (
              <button
                key={r.v}
                type="button"
                onClick={() => setReason(r.v)}
                className="flex items-center gap-3 rounded-xl p-3 text-left transition active:scale-[.99]"
                style={{
                  background: "var(--surface)",
                  border: active
                    ? "1.5px solid var(--primary)"
                    : "1.5px solid var(--border)",
                }}
              >
                <div
                  className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg"
                  style={{
                    background: active
                      ? "var(--primary-50)"
                      : "var(--surface-2)",
                    color: active ? "var(--primary)" : "var(--text-2)",
                  }}
                >
                  <I className="h-4 w-4" />
                </div>
                <span
                  className="flex-1 text-[13px] font-medium"
                  style={{
                    color: active ? "var(--primary)" : "var(--text)",
                  }}
                >
                  {r.l}
                </span>
                {active && (
                  <CheckCircle2
                    className="h-4 w-4 flex-shrink-0"
                    style={{ color: "var(--primary)" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {reason === "other" && (
          <div className="mt-2">
            <Textarea
              label="Tell us more (optional)"
              rows={2}
              value={reasonNote}
              onChange={(e) => setReasonNote(e.target.value)}
              placeholder="Briefly describe your situation"
            />
          </div>
        )}

        {/* ── Restructure type ─────────────────────────────── */}
        <SectionTitle>Choose a restructure option</SectionTitle>
        <div className="flex flex-col gap-2">
          <KindCard
            active={kind === "extend"}
            onSelect={() => setKind("extend")}
            icon={<CalendarDays className="h-5 w-5" />}
            title="Extend the loan term"
            hint="Add more months to reduce your monthly payment."
            tone="primary"
          />
          <KindCard
            active={kind === "holiday"}
            onSelect={() => setKind("holiday")}
            icon={<CalendarOff className="h-5 w-5" />}
            title="Payment holiday"
            hint="Pause repayments for 1–3 months. Interest still accrues."
            tone="warn"
          />
          <KindCard
            active={kind === "interest-only"}
            onSelect={() => setKind("interest-only")}
            icon={<Clock className="h-5 w-5" />}
            title="Interest-only period"
            hint="Pay just the interest portion temporarily, then resume full payments."
            tone="accent"
          />
        </div>

        {/* ── Knob ─────────────────────────────────────────── */}
        <SectionTitle>
          {kind === "extend"
            ? "How many extra months?"
            : kind === "holiday"
              ? "Pause duration"
              : "Interest-only duration"}
        </SectionTitle>
        <Stepper
          min={kind === "extend" ? 3 : 1}
          max={kind === "extend" ? 24 : 3}
          step={kind === "extend" ? 3 : 1}
          unit="months"
          value={
            kind === "extend"
              ? extraMonths
              : kind === "holiday"
                ? holidayMonths
                : interestOnlyMonths
          }
          onChange={(v) => {
            if (kind === "extend") setExtraMonths(v);
            else if (kind === "holiday") setHolidayMonths(v);
            else setInterestOnlyMonths(v);
          }}
        />

        {/* ── Preview ─────────────────────────────────────── */}
        <SectionTitle>Preview new terms</SectionTitle>
        <Card>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div
                className="text-[10px] uppercase tracking-wider"
                style={{ color: "var(--text-3)" }}
              >
                Current
              </div>
              <div className="mt-0.5 text-[17px] font-bold leading-none">
                {formatMoney(currentEmi)}
              </div>
              <div
                className="mt-1 text-[11px]"
                style={{ color: "var(--text-2)" }}
              >
                {loan.totalMonths} months
              </div>
            </div>
            <div
              className="rounded-xl p-2.5"
              style={{
                background:
                  preview.emiDelta < 0
                    ? "rgba(0,196,140,.08)"
                    : "rgba(255,159,28,.08)",
                border:
                  preview.emiDelta < 0
                    ? "1px solid rgba(0,196,140,.25)"
                    : "1px solid rgba(255,159,28,.25)",
              }}
            >
              <div
                className="text-[10px] uppercase tracking-wider"
                style={{
                  color:
                    preview.emiDelta < 0 ? "var(--accent)" : "var(--warn)",
                }}
              >
                After restructure
              </div>
              <div
                className="mt-0.5 text-[17px] font-bold leading-none"
                style={{
                  color:
                    preview.emiDelta < 0 ? "var(--accent)" : "var(--text)",
                }}
              >
                {formatMoney(preview.newEmi)}
              </div>
              <div
                className="mt-1 text-[11px]"
                style={{ color: "var(--text-2)" }}
              >
                {preview.newTotalMonths} months
              </div>
            </div>
          </div>

          <div className="mt-3 h-px" style={{ background: "var(--border)" }} />

          <div className="kv-row pt-3">
            <span>Monthly change</span>
            <span
              style={{
                color:
                  preview.emiDelta < 0 ? "var(--accent)" : "var(--warn)",
                fontWeight: 600,
              }}
            >
              {preview.emiDelta < 0 ? "−" : "+"}
              {formatMoney(Math.abs(preview.emiDelta))} / mo
            </span>
          </div>
          <div className="kv-row">
            <span>Term change</span>
            <span style={{ fontWeight: 600 }}>
              +{preview.monthsDelta} months
            </span>
          </div>
          <p
            className="mt-2 text-[11px] leading-relaxed"
            style={{ color: "var(--text-3)" }}
          >
            {preview.note}
          </p>
        </Card>

        {/* ── Acknowledgement ─────────────────────────────── */}
        <label
          className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl p-4 shadow-sm"
          style={{
            background: "var(--surface)",
            border: acknowledge
              ? "1.5px solid var(--accent)"
              : "1.5px solid var(--border)",
          }}
        >
          <input
            type="checkbox"
            checked={acknowledge}
            onChange={(e) => setAcknowledge(e.target.checked)}
            className="mt-0.5 h-5 w-5 flex-shrink-0 accent-brand"
          />
          <span className="text-[13px] leading-relaxed">
            I understand restructuring may extend my total repayment period
            and increase the overall interest paid. New terms only take
            effect after a credit officer confirms them in writing.
          </span>
        </label>
      </ScreenBody>

      <StickyFooter>
        <Button
          onClick={onSubmit}
          disabled={!canSubmit}
          leading={<Send className="h-[18px] w-[18px]" />}
        >
          Submit restructure request
        </Button>
      </StickyFooter>
    </Screen>
  );
}

/* ───────── Helpers ───────── */

function KindCard({
  active,
  onSelect,
  icon,
  title,
  hint,
  tone,
}: {
  active: boolean;
  onSelect: () => void;
  icon: ReactNode;
  title: string;
  hint: string;
  tone: "primary" | "warn" | "accent";
}) {
  const color =
    tone === "warn"
      ? "var(--warn)"
      : tone === "accent"
        ? "var(--accent)"
        : "var(--primary)";
  const bg =
    tone === "warn"
      ? "rgba(255,159,28,.12)"
      : tone === "accent"
        ? "rgba(0,196,140,.12)"
        : "rgba(31,95,255,.08)";

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex items-center gap-3 rounded-2xl p-3.5 text-left shadow-sm transition active:scale-[.99]"
      style={{
        background: "var(--surface)",
        border: active ? `1.5px solid ${color}` : "1.5px solid var(--border)",
      }}
    >
      <div
        className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl"
        style={{ background: bg, color }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold">{title}</div>
        <div
          className="mt-0.5 text-[11px] leading-relaxed"
          style={{ color: "var(--text-2)" }}
        >
          {hint}
        </div>
      </div>
      {active ? (
        <CheckCircle2
          className="h-5 w-5 flex-shrink-0"
          style={{ color }}
        />
      ) : (
        <ArrowRight
          className="h-4 w-4 flex-shrink-0"
          style={{ color: "var(--text-3)" }}
        />
      )}
    </button>
  );
}

function Stepper({
  value,
  onChange,
  min,
  max,
  step,
  unit,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  return (
    <div className="flex items-center justify-between rounded-2xl p-2 shadow-sm"
         style={{
           background: "var(--surface)",
           border: "1.5px solid var(--border)",
         }}>
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        className="grid h-10 w-10 place-items-center rounded-xl text-xl font-bold"
        style={{
          background: "var(--surface-2)",
          color: "var(--text-2)",
          opacity: value <= min ? 0.4 : 1,
        }}
      >
        −
      </button>
      <div className="text-center">
        <div className="text-[22px] font-extrabold leading-none">{value}</div>
        <div
          className="mt-0.5 text-[10px] uppercase tracking-wider"
          style={{ color: "var(--text-3)" }}
        >
          {unit}
        </div>
      </div>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        className="grid h-10 w-10 place-items-center rounded-xl text-xl font-bold text-white"
        style={{
          background: "var(--primary)",
          opacity: value >= max ? 0.4 : 1,
        }}
      >
        +
      </button>
    </div>
  );
}
