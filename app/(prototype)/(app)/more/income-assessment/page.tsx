"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  Info,
  Repeat,
  Shuffle,
  Sparkles,
  TrendingUp,
  Upload,
  Wallet,
  X,
} from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/hooks/useToast";
import { formatMoney } from "@/lib/utils/format";

type Stage = "upload" | "analyzing" | "results";

interface UploadedFile {
  name: string;
  size: string;
  type: "pdf" | "image";
}

// ──────────────────── Mock analysis result ────────────────────
// In production this would come from an OCR + ML pipeline; here it's
// deterministic so the demo always tells the same story.
const ANALYSIS = {
  consistencyScore: 87,
  grade: "Good",
  monthsAnalyzed: 6,
  avgMonthlyIncome: 1350,
  avgMonthlyExpenses: 720,
  disposableIncome: 630,
  affordablePayment: 252, // 40% of disposable
  salary: {
    detected: 6,
    expected: 6,
    employer: "Cambodia Bank Ltd.",
    amount: 1200,
  },
  otherIncome: {
    count: 2,
    label: "Freelance deposits",
    avgPerMonth: 150,
  },
  recommendations: [
    {
      productId: "p1",
      name: "Quick Personal Loan",
      tagline: "Best fit for your income profile",
      icon: "zap",
      color: "linear-gradient(135deg, #1f5fff, #4578ff)",
      maxAmount: 5000,
      recommendedAmount: 3000,
      recommendedTerm: 12,
      estEmi: 278,
      isLocked: true, // demo: this product is locked from the per-product cap
      reasoning:
        "Your steady salary deposits qualify you for our fastest-track personal loan.",
    },
    {
      productId: "p4",
      name: "Education Loan",
      tagline: "Lowest rate · longest grace period",
      icon: "graduation-cap",
      color: "linear-gradient(135deg, #ff6b9d, #c2185b)",
      maxAmount: 15000,
      recommendedAmount: 5000,
      recommendedTerm: 24,
      estEmi: 240,
      isLocked: false,
      reasoning:
        "Your disposable income comfortably covers the monthly payment, plus you'll save on interest at 0.75%/mo.",
    },
    {
      productId: "p5",
      name: "Home Improvement",
      tagline: "Stretch the term for lower EMIs",
      icon: "home",
      color: "linear-gradient(135deg, #6a11cb, #2575fc)",
      maxAmount: 20000,
      recommendedAmount: 4000,
      recommendedTerm: 36,
      estEmi: 145,
      isLocked: false,
      reasoning:
        "Spread over 36 months your EMI drops to just 23% of your disposable income.",
    },
  ],
};

const ANALYZE_STEPS = [
  "Reading bank statement…",
  "Extracting transactions…",
  "Detecting salary deposits…",
  "Checking income consistency…",
  "Matching loan products…",
];

export default function IncomeAssessmentPage() {
  const toast = useToast();
  const [stage, setStage] = useState<Stage>("upload");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [analyzeStepIdx, setAnalyzeStepIdx] = useState(0);

  // Mock upload — in a real app this would open the file picker.
  const onMockUpload = (type: "pdf" | "image") => {
    const newFile: UploadedFile = {
      name:
        type === "pdf"
          ? `bank_statement_${files.length + 1}.pdf`
          : `IMG_${1000 + files.length}.jpg`,
      size: type === "pdf" ? "1.4 MB" : "2.1 MB",
      type,
    };
    setFiles((f) => [...f, newFile]);
    toast(`${newFile.name} uploaded`, "success");
  };

  const removeFile = (i: number) =>
    setFiles((f) => f.filter((_, idx) => idx !== i));

  const startAnalysis = () => {
    setStage("analyzing");
    setAnalyzeStepIdx(0);
  };

  // Animate through the analyze-step copy while pretending to process.
  useEffect(() => {
    if (stage !== "analyzing") return;
    const stepInterval = window.setInterval(() => {
      setAnalyzeStepIdx((i) =>
        i < ANALYZE_STEPS.length - 1 ? i + 1 : i,
      );
    }, 500);
    const done = window.setTimeout(() => {
      setStage("results");
      toast("Analysis complete", "success");
    }, 2800);
    return () => {
      window.clearInterval(stepInterval);
      window.clearTimeout(done);
    };
  }, [stage, toast]);

  // ─────────────────────────── UPLOAD ───────────────────────────
  if (stage === "upload") {
    return (
      <Screen>
        <NavHeader title="Income Assessment" />
        <ScreenBody>
          {/* Hero */}
          <div className="px-2 pt-2 text-center">
            <div
              className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary-50), #d6e4ff)",
                color: "var(--primary)",
              }}
            >
              <TrendingUp className="h-7 w-7" />
            </div>
            <h1 className="text-[22px] font-bold tracking-tight">
              Know your loan-readiness
            </h1>
            <p
              className="mx-2 mt-1.5 text-sm leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              Upload a recent bank statement and we&apos;ll analyze your
              salary, expenses, and income consistency — then recommend the
              loan products you&apos;re most likely to qualify for.
            </p>
          </div>

          {/* What we look at */}
          <SectionTitle>What we analyze</SectionTitle>
          <Card>
            {[
              {
                icon: Repeat,
                title: "Income consistency",
                desc: "Are your salary deposits regular and on time each month?",
              },
              {
                icon: Wallet,
                title: "Monthly cashflow",
                desc: "Average income vs. expenses to estimate disposable income.",
              },
              {
                icon: Shuffle,
                title: "Recurring deposits",
                desc: "Detected salary employer, plus any side income.",
              },
              {
                icon: Sparkles,
                title: "Product fit",
                desc: "Match you with loan products your profile supports.",
              },
            ].map((item) => {
              const I = item.icon;
              return (
                <div
                  key={item.title}
                  className="mb-3 flex items-start gap-3 last:mb-0"
                >
                  <div
                    className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px]"
                    style={{
                      background: "var(--primary-50)",
                      color: "var(--primary)",
                    }}
                  >
                    <I className="h-[18px] w-[18px]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold">
                      {item.title}
                    </div>
                    <div
                      className="mt-0.5 text-[12px]"
                      style={{ color: "var(--text-2)" }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>

          {/* Upload zone */}
          <SectionTitle>Upload bank statement</SectionTitle>
          <button
            type="button"
            onClick={() => onMockUpload("pdf")}
            className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition active:scale-[.99]"
            style={{
              background: "var(--surface)",
              borderColor: "var(--primary)",
            }}
          >
            <div
              className="grid h-12 w-12 place-items-center rounded-xl"
              style={{
                background: "var(--primary-50)",
                color: "var(--primary)",
              }}
            >
              <Upload className="h-6 w-6" />
            </div>
            <div className="text-[14px] font-semibold">
              Tap to upload a statement
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-3)" }}>
              PDF or photo · Last 3–6 months recommended · Max 10 MB
            </div>
          </button>

          {/* Uploaded files list */}
          {files.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-xl p-3 shadow-sm"
                  style={{ background: "var(--surface)" }}
                >
                  <div
                    className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px]"
                    style={{
                      background: "rgba(0,196,140,.12)",
                      color: "var(--accent)",
                    }}
                  >
                    <FileText className="h-[18px] w-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold">
                      {f.name}
                    </div>
                    <div
                      className="text-[11px]"
                      style={{ color: "var(--text-3)" }}
                    >
                      {f.size} · Ready to analyze
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full"
                    style={{
                      background: "var(--surface-2)",
                      color: "var(--text-3)",
                    }}
                    aria-label="Remove file"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Card
            className="mt-3"
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
              <div className="text-[11px] leading-relaxed"
                   style={{ color: "var(--text-2)" }}>
                Your statement is processed on-device with encrypted upload.
                We never share raw bank data with third parties. Used only
                for this assessment.
              </div>
            </div>
          </Card>
        </ScreenBody>

        <StickyFooter>
          <Button onClick={startAnalysis} disabled={files.length === 0}>
            {files.length === 0
              ? "Upload a statement to analyze"
              : `Analyze ${files.length} file${files.length === 1 ? "" : "s"}`}
          </Button>
        </StickyFooter>
      </Screen>
    );
  }

  // ───────────────────────── ANALYZING ─────────────────────────
  if (stage === "analyzing") {
    return (
      <Screen>
        <NavHeader title="Income Assessment" back={false} />
        <ScreenBody>
          <div className="mt-10 text-center">
            <div
              className="mx-auto mb-5 grid h-[88px] w-[88px] place-items-center rounded-2xl"
              style={{
                background: "var(--primary-50)",
                color: "var(--primary)",
              }}
            >
              <TrendingUp
                className="h-12 w-12"
                style={{ animation: "pulse-device 1.4s ease-in-out infinite" }}
              />
            </div>
            <h2 className="text-[20px] font-bold tracking-tight">
              Analyzing your statement
            </h2>
            <p
              className="mt-2 px-2 text-sm"
              style={{ color: "var(--text-2)" }}
            >
              This usually takes under 3 seconds.
            </p>

            {/* Step indicator */}
            <div className="mt-8 flex flex-col gap-2 px-2 text-left">
              {ANALYZE_STEPS.map((label, i) => {
                const done = i < analyzeStepIdx;
                const active = i === analyzeStepIdx;
                return (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 rounded-xl p-2.5"
                    style={{
                      background:
                        done || active ? "var(--surface)" : "var(--surface-2)",
                      opacity: done || active ? 1 : 0.5,
                      transition: "opacity .3s, background .3s",
                    }}
                  >
                    <div
                      className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full"
                      style={{
                        background: done
                          ? "rgba(0,196,140,.15)"
                          : active
                            ? "var(--primary-50)"
                            : "var(--surface-2)",
                        color: done
                          ? "var(--accent)"
                          : active
                            ? "var(--primary)"
                            : "var(--text-3)",
                      }}
                    >
                      {done ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <span className="text-[11px] font-bold">{i + 1}</span>
                      )}
                    </div>
                    <span
                      className="text-[13px]"
                      style={{
                        fontWeight: active ? 600 : 400,
                        color: done
                          ? "var(--text-2)"
                          : active
                            ? "var(--text)"
                            : "var(--text-3)",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Indeterminate progress bar */}
            <div
              className="mx-auto mt-6 h-1 w-full max-w-[260px] overflow-hidden rounded-full"
              style={{ background: "var(--surface-2)" }}
            >
              <div
                className="h-full w-[40%] rounded-full"
                style={{
                  background: "var(--primary)",
                  animation: "loading 1.5s infinite",
                }}
              />
            </div>
          </div>
        </ScreenBody>
      </Screen>
    );
  }

  // ────────────────────────── RESULTS ──────────────────────────
  const scoreColor =
    ANALYSIS.consistencyScore >= 80
      ? "var(--accent)"
      : ANALYSIS.consistencyScore >= 60
        ? "var(--warn)"
        : "var(--danger)";
  const scoreBg =
    ANALYSIS.consistencyScore >= 80
      ? "rgba(0,196,140,.12)"
      : ANALYSIS.consistencyScore >= 60
        ? "rgba(255,159,28,.15)"
        : "rgba(255,77,94,.12)";

  return (
    <Screen>
      <NavHeader
        title="Income Assessment"
        back={false}
        right={
          <button
            onClick={() => {
              setStage("upload");
              setFiles([]);
            }}
            className="text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            Redo
          </button>
        }
      />
      <ScreenBody>
        {/* Consistency score hero */}
        <div
          className="rounded-2xl p-5 text-center"
          style={{ background: scoreBg }}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider"
               style={{ color: scoreColor }}>
            Income consistency
          </div>
          <div
            className="mt-2 text-[44px] font-extrabold leading-none"
            style={{ color: scoreColor }}
          >
            {ANALYSIS.consistencyScore}
            <span className="text-[18px] opacity-70"> / 100</span>
          </div>
          <div className="mt-1 text-[14px] font-semibold">
            {ANALYSIS.grade}
          </div>
          <div className="mt-2 text-[11px]" style={{ color: "var(--text-2)" }}>
            Based on {ANALYSIS.monthsAnalyzed} months of bank data
          </div>
        </div>

        {/* Cashflow stat row */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div
            className="rounded-2xl p-3 text-center shadow-sm"
            style={{ background: "var(--surface)" }}
          >
            <div
              className="text-[10px] uppercase tracking-wider"
              style={{ color: "var(--text-3)" }}
            >
              Avg income
            </div>
            <div className="mt-0.5 text-[15px] font-bold leading-tight"
                 style={{ color: "var(--accent)" }}>
              {formatMoney(ANALYSIS.avgMonthlyIncome)}
            </div>
            <div
              className="text-[10px]"
              style={{ color: "var(--text-3)" }}
            >
              per month
            </div>
          </div>
          <div
            className="rounded-2xl p-3 text-center shadow-sm"
            style={{ background: "var(--surface)" }}
          >
            <div
              className="text-[10px] uppercase tracking-wider"
              style={{ color: "var(--text-3)" }}
            >
              Avg expenses
            </div>
            <div className="mt-0.5 text-[15px] font-bold leading-tight"
                 style={{ color: "var(--danger)" }}>
              {formatMoney(ANALYSIS.avgMonthlyExpenses)}
            </div>
            <div
              className="text-[10px]"
              style={{ color: "var(--text-3)" }}
            >
              per month
            </div>
          </div>
          <div
            className="rounded-2xl p-3 text-center shadow-sm"
            style={{ background: "var(--surface)" }}
          >
            <div
              className="text-[10px] uppercase tracking-wider"
              style={{ color: "var(--text-3)" }}
            >
              Disposable
            </div>
            <div className="mt-0.5 text-[15px] font-bold leading-tight"
                 style={{ color: "var(--primary)" }}>
              {formatMoney(ANALYSIS.disposableIncome)}
            </div>
            <div
              className="text-[10px]"
              style={{ color: "var(--text-3)" }}
            >
              per month
            </div>
          </div>
        </div>

        {/* Detected deposits */}
        <SectionTitle>What we detected</SectionTitle>
        <Card>
          <div className="flex items-start gap-3">
            <div
              className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl"
              style={{
                background: "rgba(0,196,140,.12)",
                color: "var(--accent)",
              }}
            >
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold">
                  Salary deposits
                </span>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                  style={{
                    background: "rgba(0,196,140,.15)",
                    color: "var(--accent)",
                  }}
                >
                  {ANALYSIS.salary.detected}/{ANALYSIS.salary.expected}
                </span>
              </div>
              <div
                className="mt-0.5 text-[12px]"
                style={{ color: "var(--text-2)" }}
              >
                <b>{formatMoney(ANALYSIS.salary.amount)}</b> on the same day
                each month from <b>{ANALYSIS.salary.employer}</b>
              </div>
            </div>
          </div>

          <div
            className="my-3 h-px"
            style={{ background: "var(--border)" }}
          />

          <div className="flex items-start gap-3">
            <div
              className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl"
              style={{
                background: "var(--primary-50)",
                color: "var(--primary)",
              }}
            >
              <Shuffle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold">
                {ANALYSIS.otherIncome.label}
              </div>
              <div
                className="mt-0.5 text-[12px]"
                style={{ color: "var(--text-2)" }}
              >
                {ANALYSIS.otherIncome.count} non-salary deposits averaging{" "}
                <b>{formatMoney(ANALYSIS.otherIncome.avgPerMonth)}</b>/month
              </div>
            </div>
          </div>
        </Card>

        {/* Recommended products */}
        <SectionTitle>Recommended for you</SectionTitle>
        <p
          className="-mt-1 mb-3 text-[12px] leading-relaxed"
          style={{ color: "var(--text-2)" }}
        >
          Based on your <b>{formatMoney(ANALYSIS.disposableIncome)}</b>/month
          disposable income, a safe monthly payment is around{" "}
          <b>{formatMoney(ANALYSIS.affordablePayment)}</b>.
        </p>

        <div className="flex flex-col gap-3">
          {ANALYSIS.recommendations.map((rec, idx) => (
            <Link
              key={rec.productId}
              href={`/loan/products/${rec.productId}`}
              className="block rounded-2xl p-4 shadow-sm transition active:scale-[.99]"
              style={{
                background: "var(--surface)",
                border:
                  idx === 0
                    ? "1.5px solid var(--primary)"
                    : "1.5px solid var(--border)",
                opacity: rec.isLocked ? 0.85 : 1,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl text-white"
                  style={{ background: rec.color }}
                >
                  <Sparkles className="h-[22px] w-[22px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold">
                      {rec.name}
                    </span>
                    {idx === 0 && !rec.isLocked && (
                      <span
                        className="rounded-full px-1.5 py-px text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          background: "var(--primary-50)",
                          color: "var(--primary)",
                        }}
                      >
                        Best fit
                      </span>
                    )}
                    {rec.isLocked && (
                      <span
                        className="rounded-full px-1.5 py-px text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          background: "rgba(255,77,94,.12)",
                          color: "var(--danger)",
                        }}
                      >
                        Locked
                      </span>
                    )}
                  </div>
                  <div
                    className="mt-0.5 text-[11px]"
                    style={{ color: "var(--text-3)" }}
                  >
                    {rec.tagline}
                  </div>
                  <div
                    className="mt-2 text-[12px] leading-relaxed"
                    style={{ color: "var(--text-2)" }}
                  >
                    {rec.reasoning}
                  </div>
                </div>
              </div>

              <div
                className="my-3 h-px"
                style={{ background: "var(--border)" }}
              />

              <div className="grid grid-cols-3 gap-1 text-center text-[11px]">
                <div>
                  <div style={{ color: "var(--text-3)" }}>Amount</div>
                  <div className="mt-0.5 font-bold">
                    {formatMoney(rec.recommendedAmount)}
                  </div>
                </div>
                <div
                  style={{
                    borderLeft: "1px solid var(--border)",
                    borderRight: "1px solid var(--border)",
                  }}
                >
                  <div style={{ color: "var(--text-3)" }}>Term</div>
                  <div className="mt-0.5 font-bold">
                    {rec.recommendedTerm} mo
                  </div>
                </div>
                <div>
                  <div style={{ color: "var(--text-3)" }}>Est. EMI</div>
                  <div
                    className="mt-0.5 font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    {formatMoney(rec.estEmi)}
                  </div>
                </div>
              </div>

              <div
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[13px] font-semibold"
                style={{
                  background: rec.isLocked
                    ? "var(--surface-2)"
                    : "var(--primary)",
                  color: rec.isLocked ? "var(--text-3)" : "#fff",
                }}
              >
                {rec.isLocked ? "Product locked this month" : "Apply with this assessment"}
                {!rec.isLocked && <ArrowRight className="h-3.5 w-3.5" />}
              </div>
            </Link>
          ))}
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
            <div className="text-[11px] leading-relaxed"
                 style={{ color: "var(--text-2)" }}>
              These recommendations are estimates based on your bank
              statement analysis. Final approval and terms are determined
              after credit assessment and document verification.
            </div>
          </div>
        </Card>
      </ScreenBody>
    </Screen>
  );
}
