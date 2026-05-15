"use client";

import {
  BadgeCheck,
  ChevronRight,
  FileSignature,
  Lock,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon } from "@/components/domain/loan/DynamicIcon";
import { SuccessSheet } from "@/components/sheets/SuccessSheet";
import { useSheet } from "@/lib/hooks/useSheet";
import { useToast } from "@/lib/hooks/useToast";
import { useAdvisorStore } from "@/stores/advisor";
import { getProductById, getStaffByCode, mockUser } from "@/lib/mock";
import { formatMoney } from "@/lib/utils/format";
import { calculateEmi } from "@/lib/utils/emi";
import {
  isProductLockedThisMonth,
  nextMonthResetLabel,
} from "@/lib/utils/rejection";

const STEPS = [
  "Loan",
  "About you",
  "Profile (KYC)",
  "Documents",
  "CBC consent",
  "Review",
] as const;
type Step = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Multi-step Loan Request (Workshop ref: Session 2.F5).
 * Steps: Loan → About you → Profile (KYC) → Documents → CBC consent → Review
 *
 * The KYC step captures identity-verification details that the back-office
 * Customer Information tab (Session 5.F3) expects: ID type, ID number +
 * expiry, DOB, gender, marital status, and primary occupation.
 */
export default function LoanRequestPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { open, close } = useSheet();
  const toast = useToast();
  const product = getProductById(id);
  if (!product) notFound();

  const [step, setStep] = useState<Step>(0);

  const [amount, setAmount] = useState(2000);
  const [term, setTerm] = useState(12);
  const [purpose, setPurpose] = useState("Home renovation");
  const [income, setIncome] = useState(850);
  const [employer, setEmployer] = useState("");
  const [docId, setDocId] = useState(false);
  const [docPay, setDocPay] = useState(false);
  const [cbcConsent, setCbcConsent] = useState(false);
  const [signed, setSigned] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  // KYC fields (Step 2 — Customer profile)
  const [idType, setIdType] = useState<"national" | "passport" | "license">(
    "national",
  );
  const [idNumber, setIdNumber] = useState("");
  const [idExpiry, setIdExpiry] = useState("2030-12-31");
  const [dob, setDob] = useState("1992-06-15");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [marital, setMarital] = useState<"single" | "married" | "other">(
    "single",
  );
  const [dependents, setDependents] = useState(0);
  const [occupation, setOccupation] = useState<
    "salaried" | "self-employed" | "business" | "other"
  >("salaried");

  const idTypeLabel = {
    national: "National ID",
    passport: "Passport",
    license: "Driving Licence",
  }[idType];
  const genderLabel = { male: "Male", female: "Female", other: "Other" }[
    gender
  ];
  const maritalLabel = {
    single: "Single",
    married: "Married",
    other: "Other",
  }[marital];
  const occupationLabel = {
    salaried: "Salaried",
    "self-employed": "Self-employed",
    business: "Business owner",
    other: "Other",
  }[occupation];

  // Single source of truth for the customer's advisor. If they already have
  // one (captured at sign-up), the loan form pre-fills it as read-only. If
  // not, the customer can type a code here — it becomes their permanent
  // advisor the moment a valid code is entered.
  const lockedAdvisorCode = useAdvisorStore((s) => s.code);
  const lockedAdvisorSource = useAdvisorStore((s) => s.source);
  const lockedAdvisorDate = useAdvisorStore((s) => s.date);
  const commitAdvisor = useAdvisorStore((s) => s.set);
  const lockedAdvisor = lockedAdvisorCode
    ? getStaffByCode(lockedAdvisorCode)
    : undefined;

  // Local input — only used when no advisor is locked in.
  const typedAdvisor =
    referralCode.length === 5 ? getStaffByCode(referralCode) : undefined;
  const referralInvalid = referralCode.length === 5 && !typedAdvisor;

  // Resolved advisor used by the Review step + submit payload.
  const effectiveAdvisor = lockedAdvisor ?? typedAdvisor;
  const effectiveAdvisorCode = lockedAdvisorCode ?? referralCode;

  const next = () => setStep((s) => (s < 5 ? ((s + 1) as Step) : s));
  const prev = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s));

  const canAdvance = (() => {
    if (step === 0)
      return (
        amount >= product.minAmount &&
        amount <= product.maxAmount &&
        term >= product.minTerm &&
        term <= product.maxTerm
      );
    if (step === 1)
      return income > 0 && employer.length > 0 && !referralInvalid;
    if (step === 2)
      return idNumber.trim().length >= 5 && idExpiry !== "" && dob !== "";
    if (step === 3) return docId && docPay;
    if (step === 4) return cbcConsent && signed;
    return true;
  })();

  const onSubmit = () => {
    open(
      <SuccessSheet
        title="Application Submitted"
        description="Your application ID is APP-2026-04-8812. We'll text you status updates."
        primaryLabel="View My Loans"
        onPrimary={() => {
          close();
          router.push("/my-loan?tab=progress");
        }}
      />,
    );
  };

  const { emi } = calculateEmi(amount, term, Number(product.rate));

  // Enforce the 3-rejections-per-month rule **for this product**. If the
  // customer lands here while this specific product is locked, they see a
  // friendly lock screen instead of the multi-step wizard. Other products
  // are unaffected.
  if (isProductLockedThisMonth(product.id)) {
    return (
      <Screen>
        <NavHeader title="Loan Application" />
        <ScreenBody>
          <div className="mt-8 text-center">
            <div
              className="mx-auto mb-4 grid h-[80px] w-[80px] place-items-center rounded-2xl"
              style={{
                background: "rgba(255,77,94,.12)",
                color: "var(--danger)",
              }}
            >
              <Lock className="h-10 w-10" />
            </div>
            <h1 className="text-[22px] font-bold tracking-tight">
              {product.name} is paused this month
            </h1>
            <p
              className="mt-2 px-6 text-sm leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              You&apos;ve reached the 3-rejection limit for{" "}
              <b>{product.name}</b> this month. To protect your credit
              profile, you can submit a new application for this product
              starting <b>{nextMonthResetLabel()}</b>.
            </p>
            <p
              className="mt-2 px-6 text-sm leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              <b>Other loan products are still available</b> — browse the
              catalog to find one that fits.
            </p>
          </div>

          <Card
            className="mt-6"
            style={{
              background: "rgba(31,95,255,.05)",
              border: "1px solid rgba(31,95,255,.15)",
            }}
          >
            <div className="text-sm">
              <div className="font-medium">What to do in the meantime</div>
              <ul
                className="mt-2 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed"
                style={{ color: "var(--text-2)" }}
              >
                <li>Try a different loan product — most are still open.</li>
                <li>
                  Gather stronger income proof for next month&apos;s attempt
                  on {product.name}.
                </li>
                <li>
                  Talk to your advisor about which product fits your profile.
                </li>
              </ul>
            </div>
          </Card>
        </ScreenBody>
        <StickyFooter>
          <div className="flex flex-col gap-2">
            <Link href="/loan/products" className="btn btn-primary">
              Browse other products
            </Link>
            <Link href="/chat" className="btn btn-ghost">
              Talk to your officer
            </Link>
          </div>
        </StickyFooter>
      </Screen>
    );
  }

  return (
    <Screen>
      <NavHeader
        title="Loan Application"
        back={step === 0 ? true : prev}
      />
      <ScreenBody>
        {/* Stepper */}
        <div className="mb-3 flex items-center gap-1">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className="h-1.5 flex-1 rounded-full"
              style={{
                background:
                  i <= step ? "var(--primary)" : "var(--border-strong)",
              }}
            />
          ))}
        </div>
        <div
          className="mb-3 flex items-center justify-between text-[11px] font-medium"
          style={{ color: "var(--text-2)" }}
        >
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span style={{ color: "var(--primary)" }}>{STEPS[step]}</span>
        </div>

        <Card className="mb-3 flex items-center gap-3">
          <div
            className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl text-white"
            style={{ background: product.color }}
          >
            <DynamicIcon name={product.icon} className="h-[22px] w-[22px]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">{product.name}</div>
            <div className="text-xs" style={{ color: "var(--text-2)" }}>
              {product.rate}%/mo · {product.minTerm}–{product.maxTerm} months
            </div>
          </div>
        </Card>

        {step === 0 && (
          <>
            <SectionTitle>Loan details</SectionTitle>
            <div className="flex flex-col gap-2.5">
              <Input
                label="Amount (USD)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={product.minAmount}
                max={product.maxAmount}
              />
              <p className="text-xs" style={{ color: "var(--text-3)" }}>
                Range: {formatMoney(product.minAmount)} –{" "}
                {formatMoney(product.maxAmount)}
              </p>
              <Input
                label="Term (months)"
                type="number"
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                min={product.minTerm}
                max={product.maxTerm}
              />
              <Input
                label="Purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <Card
              className="mt-4"
              style={{
                background: "rgba(31,95,255,.05)",
                border: "1px solid rgba(31,95,255,.15)",
              }}
            >
              <div className="text-sm">
                <div className="font-medium">Estimated monthly payment</div>
                <div
                  className="mt-1 text-[24px] font-bold"
                  style={{ color: "var(--primary)" }}
                >
                  {formatMoney(emi)}
                </div>
                <div
                  className="mt-1 text-xs"
                  style={{ color: "var(--text-2)" }}
                >
                  Final rate may vary after credit assessment.
                </div>
              </div>
            </Card>
          </>
        )}

        {step === 1 && (
          <>
            <SectionTitle>Personal information</SectionTitle>
            <div className="flex flex-col gap-2.5">
              <Input label="Full name" defaultValue={mockUser.name} readOnly />
              <Input
                label="Monthly income (USD)"
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
              />
              <Input
                label="Employer / Business"
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
                placeholder="Company name"
              />
              <Textarea
                label="Address"
                rows={2}
                defaultValue="#12, St. 271, Phnom Penh"
              />

              {/* Referral code — two modes:
                  A) Customer already has an advisor (signed up with a code) →
                     show a locked read-only chip; this is their ONE person
                     in charge and cannot be silently overridden.
                  B) No advisor yet → input field as before. A valid code
                     locks the advisor for future loan applications too. */}
              {lockedAdvisor ? (
                <div>
                  <div
                    className="mb-1.5 flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-3)" }}
                  >
                    <span>Your advisor</span>
                    <span
                      className="rounded-full px-1.5 py-px text-[9px]"
                      style={{
                        background: "var(--surface-2)",
                        color: "var(--text-2)",
                        letterSpacing: 0,
                      }}
                    >
                      🔒 auto-filled
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2.5 rounded-xl p-3"
                    style={{
                      background: "rgba(0,196,140,.06)",
                      border: "1px solid rgba(0,196,140,.25)",
                    }}
                  >
                    <Avatar
                      size="sm"
                      initials={lockedAdvisor.initials}
                      bg={lockedAdvisor.color}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 text-[13px] font-semibold">
                        <BadgeCheck
                          className="h-3.5 w-3.5"
                          style={{ color: "var(--accent)" }}
                        />
                        {lockedAdvisor.name}
                      </div>
                      <div
                        className="mt-0.5 text-[11px]"
                        style={{ color: "var(--text-2)" }}
                      >
                        {lockedAdvisor.role} ({lockedAdvisor.roleShort}) ·{" "}
                        <span className="font-mono">
                          {lockedAdvisor.code}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p
                    className="mt-1.5 px-1 text-[11px] leading-relaxed"
                    style={{ color: "var(--text-3)" }}
                  >
                    Linked{" "}
                    {lockedAdvisorSource === "signup"
                      ? "at sign-up"
                      : "during a previous loan application"}
                    {lockedAdvisorDate ? ` · ${lockedAdvisorDate}` : ""}. To
                    change your advisor, visit a branch.
                  </p>
                </div>
              ) : (
                <div>
                  <Input
                    label="Referral code (5 digits, optional)"
                    type="tel"
                    inputMode="numeric"
                    maxLength={5}
                    placeholder="• • • • •"
                    value={referralCode}
                    onChange={(e) =>
                      setReferralCode(
                        e.target.value.replace(/\D/g, "").slice(0, 5),
                      )
                    }
                    className="font-mono tracking-[0.4em]"
                  />

                  {/* Valid → staff confirmation chip + commit to store */}
                  {typedAdvisor && (
                    <div
                      className="mt-2 flex items-center gap-2.5 rounded-xl p-2.5"
                      style={{
                        background: "rgba(0,196,140,.08)",
                        border: "1px solid rgba(0,196,140,.25)",
                      }}
                    >
                      <Avatar
                        size="sm"
                        initials={typedAdvisor.initials}
                        bg={typedAdvisor.color}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 text-[12px] font-semibold">
                          <BadgeCheck
                            className="h-3.5 w-3.5"
                            style={{ color: "var(--accent)" }}
                          />
                          {typedAdvisor.name}
                        </div>
                        <div
                          className="text-[11px]"
                          style={{ color: "var(--text-2)" }}
                        >
                          {typedAdvisor.role} ({typedAdvisor.roleShort}) ·{" "}
                          {typedAdvisor.branchName}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          commitAdvisor(typedAdvisor.code, "loan-application");
                          toast(
                            `${typedAdvisor.name} is now your advisor`,
                            "success",
                          );
                        }}
                        className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                        style={{ background: "var(--accent)" }}
                      >
                        Link
                      </button>
                    </div>
                  )}

                  {/* Invalid 5-digit → error message */}
                  {referralInvalid && (
                    <div
                      className="mt-2 flex items-center gap-2 rounded-xl p-2.5 text-[12px]"
                      style={{
                        background: "rgba(255,77,94,.08)",
                        border: "1px solid rgba(255,77,94,.25)",
                        color: "var(--danger)",
                      }}
                    >
                      <XCircle className="h-4 w-4 flex-shrink-0" />
                      <span>
                        We don&apos;t recognise that code. Check with your
                        advisor, or leave it blank.
                      </span>
                    </div>
                  )}

                  {/* Helper hint when empty */}
                  {!referralCode && (
                    <p
                      className="mt-1.5 text-[11px] leading-relaxed"
                      style={{ color: "var(--text-3)" }}
                    >
                      If a Weloan365 Credit Officer or branch staff referred
                      you, enter the 5-digit code they gave you. Once linked
                      they become your permanent advisor for future
                      applications.
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <SectionTitle>Customer profile (KYC)</SectionTitle>
            <p
              className="-mt-1 mb-3 text-xs leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              These details verify your identity and help us assess your
              application. We store them securely and never share with third
              parties.
            </p>

            <div className="flex flex-col gap-2.5">
              {/* ID type */}
              <div>
                <div
                  className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-3)" }}
                >
                  ID type
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { v: "national", l: "National ID" },
                      { v: "passport", l: "Passport" },
                      { v: "license", l: "Driving Licence" },
                    ] as const
                  ).map((opt) => {
                    const active = opt.v === idType;
                    return (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setIdType(opt.v)}
                        className="rounded-xl px-2 py-2.5 text-[12px] font-medium transition"
                        style={{
                          background: active ? "var(--primary)" : "var(--surface)",
                          color: active ? "#fff" : "var(--text)",
                          border: active
                            ? "1.5px solid var(--primary)"
                            : "1.5px solid var(--border)",
                        }}
                      >
                        {opt.l}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Input
                label={`${idTypeLabel} number`}
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="123 456 789"
              />
              <Input
                label={`${idTypeLabel} expiry`}
                type="date"
                value={idExpiry}
                onChange={(e) => setIdExpiry(e.target.value)}
              />

              <Input
                label="Date of birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />

              {/* Gender */}
              <div>
                <div
                  className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-3)" }}
                >
                  Gender
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { v: "male", l: "Male" },
                      { v: "female", l: "Female" },
                      { v: "other", l: "Other" },
                    ] as const
                  ).map((opt) => {
                    const active = opt.v === gender;
                    return (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setGender(opt.v)}
                        className="rounded-xl px-2 py-2.5 text-[12px] font-medium transition"
                        style={{
                          background: active ? "var(--primary)" : "var(--surface)",
                          color: active ? "#fff" : "var(--text)",
                          border: active
                            ? "1.5px solid var(--primary)"
                            : "1.5px solid var(--border)",
                        }}
                      >
                        {opt.l}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Marital status */}
              <div>
                <div
                  className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-3)" }}
                >
                  Marital status
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { v: "single", l: "Single" },
                      { v: "married", l: "Married" },
                      { v: "other", l: "Other" },
                    ] as const
                  ).map((opt) => {
                    const active = opt.v === marital;
                    return (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setMarital(opt.v)}
                        className="rounded-xl px-2 py-2.5 text-[12px] font-medium transition"
                        style={{
                          background: active ? "var(--primary)" : "var(--surface)",
                          color: active ? "#fff" : "var(--text)",
                          border: active
                            ? "1.5px solid var(--primary)"
                            : "1.5px solid var(--border)",
                        }}
                      >
                        {opt.l}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Input
                label="Number of dependents"
                type="number"
                min={0}
                max={20}
                value={dependents}
                onChange={(e) => setDependents(Math.max(0, Number(e.target.value)))}
              />

              {/* Occupation */}
              <div>
                <div
                  className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-3)" }}
                >
                  Primary occupation
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { v: "salaried", l: "Salaried" },
                      { v: "self-employed", l: "Self-employed" },
                      { v: "business", l: "Business owner" },
                      { v: "other", l: "Other" },
                    ] as const
                  ).map((opt) => {
                    const active = opt.v === occupation;
                    return (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setOccupation(opt.v)}
                        className="rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition"
                        style={{
                          background: active ? "var(--primary-50)" : "var(--surface)",
                          color: active ? "var(--primary)" : "var(--text)",
                          border: active
                            ? "1.5px solid var(--primary)"
                            : "1.5px solid var(--border)",
                        }}
                      >
                        {opt.l}
                      </button>
                    );
                  })}
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
                <ShieldCheck
                  className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
                  style={{ color: "var(--primary)" }}
                />
                <div className="text-xs leading-relaxed">
                  Your KYC data is stored encrypted and only used by approved
                  loan officers to assess your application.
                </div>
              </div>
            </Card>
          </>
        )}

        {step === 3 && (
          <>
            <SectionTitle>Documents</SectionTitle>
            {[
              {
                key: "id",
                title: "National ID (front + back)",
                checked: docId,
                onCheck: () => setDocId(true),
              },
              {
                key: "pay",
                title: "Payslip / income proof",
                checked: docPay,
                onCheck: () => setDocPay(true),
              },
              {
                key: "biz",
                title: "Business registration (if applicable)",
                checked: false,
                optional: true,
                onCheck: () =>
                  toast("Optional document uploaded", "success"),
              },
            ].map((d) => (
              <button
                key={d.key}
                onClick={() => {
                  d.onCheck();
                  toast(`${d.title} uploaded`, "success");
                }}
                className="mb-2.5 flex w-full items-center gap-3 rounded-2xl p-4 text-left shadow-sm"
                style={{
                  background: "var(--surface)",
                  border: d.checked
                    ? "2px solid var(--accent)"
                    : "1.5px solid var(--border)",
                }}
              >
                <div
                  className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-[10px]"
                  style={{
                    background: d.checked
                      ? "rgba(0,196,140,.12)"
                      : "var(--primary-50)",
                    color: d.checked ? "var(--accent)" : "var(--primary)",
                  }}
                >
                  <Upload className="h-[18px] w-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">
                    {d.title}{" "}
                    {d.optional && (
                      <span
                        className="ml-1 text-[11px] font-normal"
                        style={{ color: "var(--text-3)" }}
                      >
                        (optional)
                      </span>
                    )}
                  </div>
                  <div
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--text-2)" }}
                  >
                    {d.checked
                      ? "✓ Uploaded · 1 file"
                      : "JPG, PNG or PDF — max 10 MB"}
                  </div>
                </div>
                <ChevronRight
                  className="h-[18px] w-[18px]"
                  style={{ color: "var(--text-3)" }}
                />
              </button>
            ))}
          </>
        )}

        {step === 4 && (
          <>
            <SectionTitle>CBC credit consent</SectionTitle>
            <Card
              style={{
                background: "rgba(255,159,28,.08)",
                border: "1px solid rgba(255,159,28,.2)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <ShieldCheck
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  style={{ color: "var(--warn)" }}
                />
                <div className="text-sm">
                  <div className="font-medium">Credit Bureau Cambodia (CBC)</div>
                  <div
                    className="mt-1.5 leading-relaxed"
                    style={{ color: "var(--text-2)" }}
                  >
                    To process your application we need to check your credit
                    history with CBC. This helps us offer you a fair rate based
                    on your repayment record.
                  </div>
                </div>
              </div>
            </Card>

            <label
              className="mt-3 flex cursor-pointer items-start gap-3 rounded-2xl p-4 shadow-sm"
              style={{ background: "var(--surface)" }}
            >
              <input
                type="checkbox"
                checked={cbcConsent}
                onChange={(e) => setCbcConsent(e.target.checked)}
                className="mt-0.5 h-5 w-5 flex-shrink-0 accent-brand"
              />
              <span className="text-sm leading-relaxed">
                I consent to Weloan365 enquiring my credit record from CBC and
                using it solely for assessing this loan application.
              </span>
            </label>

            <SectionTitle>Digital signature</SectionTitle>
            <button
              onClick={() => {
                setSigned(true);
                toast("Signature captured", "success");
              }}
              className="flex w-full items-center gap-3 rounded-2xl p-4 text-left shadow-sm"
              style={{
                background: "var(--surface)",
                border: signed
                  ? "2px solid var(--accent)"
                  : "1.5px solid var(--border)",
              }}
            >
              <div
                className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-[10px]"
                style={{
                  background: signed
                    ? "rgba(0,196,140,.12)"
                    : "var(--primary-50)",
                  color: signed ? "var(--accent)" : "var(--primary)",
                }}
              >
                <FileSignature className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">
                  {signed ? "✓ Signed" : "Tap to sign"}
                </div>
                <div
                  className="mt-0.5 text-xs"
                  style={{ color: "var(--text-2)" }}
                >
                  {signed
                    ? "Captured · " + new Date().toLocaleTimeString()
                    : "Use your finger to draw your signature"}
                </div>
              </div>
              {signed && (
                <span
                  className="text-2xl italic"
                  style={{ color: "var(--text-2)" }}
                >
                  Sokha
                </span>
              )}
            </button>
          </>
        )}

        {step === 5 && (
          <>
            <SectionTitle>Review &amp; submit</SectionTitle>
            <Card>
              <div className="kv-row">
                <span>Product</span>
                <span>{product.name}</span>
              </div>
              <div className="kv-row">
                <span>Amount</span>
                <span>{formatMoney(amount)}</span>
              </div>
              <div className="kv-row">
                <span>Term</span>
                <span>{term} months</span>
              </div>
              <div className="kv-row">
                <span>Estimated monthly payment</span>
                <span>{formatMoney(emi)}</span>
              </div>
              <div className="kv-row">
                <span>Purpose</span>
                <span>{purpose}</span>
              </div>
            </Card>

            <SectionTitle>About you</SectionTitle>
            <Card>
              <div className="kv-row">
                <span>Name</span>
                <span>{mockUser.name}</span>
              </div>
              <div className="kv-row">
                <span>Income / mo</span>
                <span>{formatMoney(income)}</span>
              </div>
              <div className="kv-row">
                <span>Employer</span>
                <span>{employer || "—"}</span>
              </div>
              <div className="kv-row">
                <span>Referred by</span>
                <span>
                  {effectiveAdvisor ? (
                    <>
                      {effectiveAdvisor.name}{" "}
                      <span style={{ color: "var(--text-3)" }}>
                        ({effectiveAdvisor.roleShort} · {effectiveAdvisorCode})
                      </span>
                    </>
                  ) : (
                    "—"
                  )}
                </span>
              </div>
            </Card>

            <SectionTitle>Customer profile (KYC)</SectionTitle>
            <Card>
              <div className="kv-row">
                <span>{idTypeLabel}</span>
                <span>
                  {idNumber || "—"}
                  {idExpiry && (
                    <span style={{ color: "var(--text-3)" }}> · exp {idExpiry}</span>
                  )}
                </span>
              </div>
              <div className="kv-row">
                <span>Date of birth</span>
                <span>{dob || "—"}</span>
              </div>
              <div className="kv-row">
                <span>Gender</span>
                <span>{genderLabel}</span>
              </div>
              <div className="kv-row">
                <span>Marital status</span>
                <span>{maritalLabel}</span>
              </div>
              <div className="kv-row">
                <span>Dependents</span>
                <span>{dependents}</span>
              </div>
              <div className="kv-row">
                <span>Occupation</span>
                <span>{occupationLabel}</span>
              </div>
            </Card>

            <SectionTitle>Documents &amp; consent</SectionTitle>
            <Card>
              <div className="kv-row">
                <span>National ID</span>
                <span>✓ Uploaded</span>
              </div>
              <div className="kv-row">
                <span>Payslip</span>
                <span>✓ Uploaded</span>
              </div>
              <div className="kv-row">
                <span>CBC consent</span>
                <span>✓ Granted</span>
              </div>
              <div className="kv-row">
                <span>Signature</span>
                <span>✓ Captured</span>
              </div>
            </Card>

            <p
              className="mt-4 text-xs leading-relaxed"
              style={{ color: "var(--text-3)" }}
            >
              By submitting you agree that the information above is accurate.
              Misrepresentation may result in rejection or legal action.
            </p>
          </>
        )}
      </ScreenBody>

      <StickyFooter>
        {step < 5 ? (
          <Button onClick={next} disabled={!canAdvance}>
            Continue
          </Button>
        ) : (
          <Button onClick={onSubmit}>Submit Application</Button>
        )}
      </StickyFooter>
    </Screen>
  );
}
