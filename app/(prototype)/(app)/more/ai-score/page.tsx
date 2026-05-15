"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  CreditCard,
  Home,
  Lightbulb,
  MapPin,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/hooks/useToast";
import { cn } from "@/lib/utils/cn";

type Stage = "input" | "analyzing" | "results";

// ─────────────────── Input options ───────────────────

const GOALS = [
  { value: "personal", label: "Personal need", icon: "💼" },
  { value: "business", label: "Grow my business", icon: "🏢" },
  { value: "education", label: "Education", icon: "🎓" },
  { value: "home", label: "Home improvement", icon: "🏠" },
  { value: "vehicle", label: "Vehicle", icon: "🛵" },
  { value: "emergency", label: "Emergency", icon: "⚡" },
] as const;

const EMPLOYMENT = [
  { value: "salaried", label: "Salaried" },
  { value: "business", label: "Business owner" },
  { value: "self", label: "Self-employed" },
  { value: "other", label: "Other" },
] as const;

const JOB_YEARS = [
  { value: "0", label: "< 1 year" },
  { value: "1-3", label: "1–3 yrs" },
  { value: "3-5", label: "3–5 yrs" },
  { value: "5+", label: "5+ yrs" },
] as const;

const INCOME = [
  { value: "<300", label: "< $300" },
  { value: "300-700", label: "$300–700" },
  { value: "700-1500", label: "$700–1,500" },
  { value: "1500-3000", label: "$1,500–3,000" },
  { value: "3000+", label: "$3,000+" },
] as const;

const BANKS = [
  { value: "aba", label: "ABA" },
  { value: "acleda", label: "ACLEDA" },
  { value: "wing", label: "Wing" },
  { value: "other", label: "Other" },
] as const;

const PROVINCES = [
  { value: "pp", label: "Phnom Penh" },
  { value: "sr", label: "Siem Reap" },
  { value: "bb", label: "Battambang" },
  { value: "kep", label: "Sihanoukville" },
  { value: "other", label: "Other" },
] as const;

const ADDR_YEARS = [
  { value: "0", label: "< 1 year" },
  { value: "1-3", label: "1–3 yrs" },
  { value: "3+", label: "3+ yrs" },
] as const;

const OBLIGATIONS = [
  { value: "none", label: "None" },
  { value: "1", label: "1 active" },
  { value: "2+", label: "2 or more" },
] as const;

const ANALYZE_STEPS = [
  "Reading your inputs…",
  "Analyzing financial behavior…",
  "Cross-referencing risk indicators…",
  "Calculating credit health score…",
  "Matching eligible products…",
];

// ─────────────────── Page ───────────────────

export default function AiScorePage() {
  const toast = useToast();
  const [stage, setStage] = useState<Stage>("input");
  const [analyzeIdx, setAnalyzeIdx] = useState(0);

  // Input state
  const [goal, setGoal] = useState<string>("");
  const [employment, setEmployment] = useState<string>("");
  const [jobYears, setJobYears] = useState<string>("");
  const [income, setIncome] = useState<string>("");
  const [bank, setBank] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [addrYears, setAddrYears] = useState<string>("");
  const [obligations, setObligations] = useState<string>("");

  const canGenerate =
    !!goal && !!employment && !!jobYears && !!income && !!bank && !!province;

  const startAnalysis = () => {
    setStage("analyzing");
    setAnalyzeIdx(0);
  };

  useEffect(() => {
    if (stage !== "analyzing") return;
    const tick = window.setInterval(() => {
      setAnalyzeIdx((i) =>
        i < ANALYZE_STEPS.length - 1 ? i + 1 : i,
      );
    }, 500);
    const done = window.setTimeout(() => {
      setStage("results");
      toast("AI score generated", "success");
    }, 2800);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(done);
    };
  }, [stage, toast]);

  // ─────────────────── INPUT ───────────────────
  if (stage === "input") {
    return (
      <Screen>
        <NavHeader title="AI Loan Health Scoring" />
        <ScreenBody>
          {/* Hero */}
          <div className="px-2 pt-2 text-center">
            <div
              className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                color: "#fff",
                boxShadow: "0 8px 24px rgba(106,17,203,.25)",
              }}
            >
              <Sparkles className="h-7 w-7" />
            </div>
            <h1 className="text-[22px] font-bold tracking-tight">
              Get your AI loan health score
            </h1>
            <p
              className="mx-2 mt-1.5 text-sm leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              Tell us about your situation and our AI will estimate your loan
              health, eligibility tier, and the products you&apos;re likely
              to qualify for.
            </p>
          </div>

          {/* Goal */}
          <ChipSection
            icon={Target}
            title="What's this loan for?"
            options={GOALS}
            value={goal}
            onChange={setGoal}
            columns={2}
          />

          {/* Employment */}
          <ChipSection
            icon={Briefcase}
            title="Employment status"
            options={EMPLOYMENT}
            value={employment}
            onChange={setEmployment}
            columns={2}
          />

          {/* Job stability */}
          <ChipSection
            icon={Building2}
            title="Years at current job / business"
            options={JOB_YEARS}
            value={jobYears}
            onChange={setJobYears}
            columns={4}
          />

          {/* Income */}
          <ChipSection
            icon={Wallet}
            title="Monthly income"
            options={INCOME}
            value={income}
            onChange={setIncome}
            columns={3}
          />

          {/* Salary bank */}
          <ChipSection
            icon={CreditCard}
            title="Where do you bank?"
            options={BANKS}
            value={bank}
            onChange={setBank}
            columns={4}
          />

          {/* Province */}
          <ChipSection
            icon={MapPin}
            title="Province"
            options={PROVINCES}
            value={province}
            onChange={setProvince}
            columns={3}
          />

          {/* Years at address */}
          <ChipSection
            icon={Home}
            title="Years at current address"
            options={ADDR_YEARS}
            value={addrYears}
            onChange={setAddrYears}
            columns={3}
          />

          {/* Obligations */}
          <ChipSection
            icon={CreditCard}
            title="Other active loans"
            options={OBLIGATIONS}
            value={obligations}
            onChange={setObligations}
            columns={3}
          />

          <Card
            className="mt-4"
            style={{
              background: "rgba(106,17,203,.05)",
              border: "1px solid rgba(106,17,203,.2)",
            }}
          >
            <div className="flex items-start gap-2.5">
              <Sparkles
                className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
                style={{ color: "#6a11cb" }}
              />
              <div className="text-[11px] leading-relaxed"
                   style={{ color: "var(--text-2)" }}>
                Your inputs feed an AI model trained on Cambodia-specific
                lending patterns. No data leaves your device until you
                explicitly apply for a loan.
              </div>
            </div>
          </Card>
        </ScreenBody>

        <StickyFooter>
          <Button
            onClick={startAnalysis}
            disabled={!canGenerate}
            leading={<Sparkles className="h-[18px] w-[18px]" />}
          >
            {canGenerate ? "Generate AI Score" : "Fill in the questions above"}
          </Button>
        </StickyFooter>
      </Screen>
    );
  }

  // ─────────────────── ANALYZING ───────────────────
  if (stage === "analyzing") {
    return (
      <Screen>
        <NavHeader title="AI Loan Health Scoring" back={false} />
        <ScreenBody>
          <div className="mt-12 text-center">
            <div
              className="mx-auto mb-5 grid h-[100px] w-[100px] place-items-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                color: "#fff",
                boxShadow: "0 12px 32px rgba(106,17,203,.35)",
              }}
            >
              <Sparkles
                className="h-14 w-14"
                style={{ animation: "pulse-device 1.4s ease-in-out infinite" }}
              />
            </div>
            <h2 className="text-[20px] font-bold tracking-tight">
              AI is computing your score
            </h2>
            <p
              className="mt-2 px-2 text-sm"
              style={{ color: "var(--text-2)" }}
            >
              Cross-referencing your profile against thousands of patterns.
            </p>

            <div className="mt-8 flex flex-col gap-2 px-2 text-left">
              {ANALYZE_STEPS.map((label, i) => {
                const done = i < analyzeIdx;
                const active = i === analyzeIdx;
                return (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 rounded-xl p-2.5 transition-all"
                    style={{
                      background:
                        done || active
                          ? "var(--surface)"
                          : "var(--surface-2)",
                      opacity: done || active ? 1 : 0.45,
                    }}
                  >
                    <div
                      className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full"
                      style={{
                        background: done
                          ? "rgba(0,196,140,.15)"
                          : active
                            ? "rgba(106,17,203,.15)"
                            : "var(--surface-2)",
                        color: done
                          ? "var(--accent)"
                          : active
                            ? "#6a11cb"
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

            <div
              className="mx-auto mt-6 h-1 w-full max-w-[280px] overflow-hidden rounded-full"
              style={{ background: "var(--surface-2)" }}
            >
              <div
                className="h-full w-[40%] rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #6a11cb, #2575fc)",
                  animation: "loading 1.5s infinite",
                }}
              />
            </div>
          </div>
        </ScreenBody>
      </Screen>
    );
  }

  // ─────────────────── RESULTS ───────────────────
  return <ResultsView onRedo={() => setStage("input")} />;
}

// ──────────────────── Helper components ────────────────────

interface ChipOption {
  value: string;
  label: string;
  icon?: string;
}

interface ChipSectionProps {
  icon: typeof Target;
  title: string;
  options: readonly ChipOption[];
  value: string;
  onChange: (v: string) => void;
  columns: 2 | 3 | 4;
}

function ChipSection({
  icon: Icon,
  title,
  options,
  value,
  onChange,
  columns,
}: ChipSectionProps) {
  return (
    <>
      <SectionTitle>
        <span className="inline-flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5" />
          {title}
        </span>
      </SectionTitle>
      <div
        className={cn(
          "grid gap-2",
          columns === 2 && "grid-cols-2",
          columns === 3 && "grid-cols-3",
          columns === 4 && "grid-cols-4",
        )}
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className="flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-center text-[12px] font-medium transition"
              style={{
                background: active ? "var(--primary)" : "var(--surface)",
                color: active ? "#fff" : "var(--text)",
                border: active
                  ? "1.5px solid var(--primary)"
                  : "1.5px solid var(--border)",
              }}
            >
              {opt.icon && <span>{opt.icon}</span>}
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

// ────────────────────── Results dashboard ──────────────────────

const SCORE = 740;
const SCORE_MAX = 850;
const PREVIOUS_DELTA = +18;
const TIER = 2;
const TIER_MAX = 5;

const GRADES = [
  { label: "Poor", color: "#ff4d5e" },
  { label: "Fair", color: "#ff9f1c" },
  { label: "Good", color: "#facc15" },
  { label: "V.Good", color: "#84cc16" },
  { label: "Excellent", color: "#00c48c" },
];

const BREAKDOWN = [
  {
    icon: Wallet,
    label: "Income & employment",
    value: 95,
    rating: "Excellent",
    color: "#00c48c",
  },
  {
    icon: Briefcase,
    label: "Job stability",
    value: 82,
    rating: "Strong",
    color: "#00c48c",
  },
  {
    icon: Home,
    label: "Residence stability",
    value: 68,
    rating: "Good",
    color: "#84cc16",
  },
  {
    icon: User,
    label: "Profile completeness",
    value: 92,
    rating: "Excellent",
    color: "#00c48c",
  },
  {
    icon: CreditCard,
    label: "Existing obligations",
    value: 52,
    rating: "Fair",
    color: "#ff9f1c",
  },
];

function ResultsView({ onRedo }: { onRedo: () => void }) {
  // Gauge math — semi-circle from 180° → 0°
  const pct = Math.max(0, Math.min(1, SCORE / SCORE_MAX));
  const angle = 180 - pct * 180;
  const cx = 110;
  const cy = 110;
  const r = 84;
  const endX = cx + r * Math.cos((angle * Math.PI) / 180);
  const endY = cy - r * Math.sin((angle * Math.PI) / 180);
  const largeArc = pct > 0.5 ? 1 : 0;

  // Position of the marker dot on the grade bar (0..1 → 0..100% across)
  const markerPct = (SCORE / SCORE_MAX) * 100;

  return (
    <Screen>
      <NavHeader
        title="AI Loan Health Scoring"
        back={false}
        right={
          <button
            onClick={onRedo}
            className="text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            Redo
          </button>
        }
      />
      <ScreenBody>
        {/* Score gauge card */}
        <Card>
          <div
            className="flex items-center justify-between text-[11px]"
            style={{ color: "var(--text-3)" }}
          >
            <span className="font-semibold uppercase tracking-wider">
              Credit score
            </span>
            <span>Updated today</span>
          </div>

          <div className="relative mx-auto mt-2 h-[140px] w-[220px]">
            <svg viewBox="0 0 220 140" className="h-full w-full">
              <defs>
                <linearGradient id="ai-gauge" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff4d5e" />
                  <stop offset="25%" stopColor="#ff9f1c" />
                  <stop offset="50%" stopColor="#facc15" />
                  <stop offset="75%" stopColor="#84cc16" />
                  <stop offset="100%" stopColor="#00c48c" />
                </linearGradient>
              </defs>
              <path
                d="M 26 110 A 84 84 0 0 1 194 110"
                stroke="#e5e7eb"
                strokeWidth={14}
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={`M 26 110 A 84 84 0 ${largeArc} 1 ${endX.toFixed(1)} ${endY.toFixed(1)}`}
                stroke="url(#ai-gauge)"
                strokeWidth={14}
                fill="none"
                strokeLinecap="round"
              />
              {/* End-of-arc marker dot */}
              <circle
                cx={endX}
                cy={endY}
                r={7}
                fill="#fff"
                stroke="#00c48c"
                strokeWidth={3}
              />
            </svg>
            <div className="absolute inset-x-0 bottom-2 text-center">
              <div className="text-[34px] font-extrabold leading-none">
                {SCORE}
              </div>
              <div
                className="text-[11px]"
                style={{ color: "var(--text-3)" }}
              >
                of {SCORE_MAX}
              </div>
              <div
                className="mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold"
                style={{
                  background: "rgba(0,196,140,.12)",
                  color: "#00a677",
                }}
              >
                Very good
              </div>
            </div>
          </div>

          {/* Grade strip */}
          <div className="mt-3 flex justify-between text-[10px] font-semibold uppercase tracking-wider"
               style={{ color: "var(--text-3)" }}>
            {GRADES.map((g) => (
              <span key={g.label}>{g.label}</span>
            ))}
          </div>
          <div className="relative mt-1">
            <div className="flex h-1.5 overflow-hidden rounded-full">
              {GRADES.map((g) => (
                <span
                  key={g.label}
                  className="flex-1"
                  style={{ background: g.color }}
                />
              ))}
            </div>
            <div
              className="absolute -top-1 h-3.5 w-0.5 rounded-full"
              style={{
                left: `${markerPct}%`,
                background: "var(--text)",
                transform: "translateX(-50%)",
              }}
            />
          </div>

          {/* Delta + tier */}
          <div
            className="mt-4 flex items-center justify-between text-[12px]"
            style={{ color: "var(--text-2)" }}
          >
            <span className="inline-flex items-center gap-1 font-semibold"
                  style={{ color: "var(--accent)" }}>
              <TrendingUp className="h-3.5 w-3.5" />+{PREVIOUS_DELTA} from last
              check
            </span>
            <span>
              <b>Tier:</b> Tier {TIER} / {TIER_MAX}
            </span>
          </div>
        </Card>

        {/* Profile tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[
            { icon: "💼", label: "Branch Manager" },
            { icon: "🏦", label: "ABA Bank · 4 yrs" },
            { icon: "📍", label: "Phnom Penh" },
          ].map((t) => (
            <span
              key={t.label}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-2)",
              }}
            >
              <span>{t.icon}</span>
              {t.label}
            </span>
          ))}
        </div>

        {/* What this unlocks */}
        <div
          className="mt-3 rounded-2xl p-4 text-white"
          style={{
            background: "linear-gradient(135deg, #1e3a8a, #1f5fff)",
          }}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-85">
            What this unlocks
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] opacity-80">Max amount</div>
              <div className="mt-0.5 text-[20px] font-extrabold leading-none">
                $80K
              </div>
            </div>
            <div
              style={{
                borderLeft: "1px solid rgba(255,255,255,.2)",
                borderRight: "1px solid rgba(255,255,255,.2)",
              }}
            >
              <div className="text-[10px] opacity-80">Best rate</div>
              <div className="mt-0.5 text-[20px] font-extrabold leading-none">
                7.5%
              </div>
            </div>
            <div>
              <div className="text-[10px] opacity-80">Products</div>
              <div className="mt-0.5 text-[20px] font-extrabold leading-none">
                4 / 5
              </div>
            </div>
          </div>
        </div>

        {/* Score breakdown */}
        <SectionTitle>Score breakdown</SectionTitle>
        <div className="flex flex-col gap-2">
          {BREAKDOWN.map((b) => {
            const I = b.icon;
            return (
              <div
                key={b.label}
                className="rounded-2xl p-3.5 shadow-sm"
                style={{ background: "var(--surface)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-[10px]"
                    style={{
                      background: `${b.color}1f`,
                      color: b.color,
                    }}
                  >
                    <I className="h-[16px] w-[16px]" />
                  </div>
                  <span className="flex-1 text-[13px] font-medium">
                    {b.label}
                  </span>
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: b.color }}
                  >
                    {b.rating}
                  </span>
                </div>
                <div
                  className="mt-2 h-1.5 overflow-hidden rounded-full"
                  style={{ background: "var(--surface-2)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${b.value}%`,
                      background: b.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Lift score tip */}
        <Card
          className="mt-3"
          style={{
            background: "rgba(106,17,203,.06)",
            border: "1px solid rgba(106,17,203,.2)",
          }}
        >
          <div className="flex items-start gap-2.5">
            <Lightbulb
              className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
              style={{ color: "#6a11cb" }}
            />
            <div className="text-[12px] leading-relaxed">
              <div className="font-semibold">Lift your score to 800+</div>
              <div className="mt-1" style={{ color: "var(--text-2)" }}>
                Close one similar obligation to unlock the Excellent tier and
                lower rates by ~0.5%.
              </div>
            </div>
          </div>
        </Card>

        {/* Disclaimer */}
        <p
          className="mt-3 text-[11px] leading-relaxed"
          style={{ color: "var(--text-3)" }}
        >
          Score is an estimate based on the profile data you provided. Final
          terms depend on full credit review.
        </p>
      </ScreenBody>

      <StickyFooter>
        <Link
          href="/loan/products"
          className="btn btn-primary"
        >
          See eligible loans
          <ArrowRight className="h-4 w-4" />
        </Link>
      </StickyFooter>
    </Screen>
  );
}
