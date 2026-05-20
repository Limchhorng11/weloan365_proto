"use client";

import {
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Send,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon } from "@/components/domain/loan/DynamicIcon";
import { SuccessSheet } from "@/components/sheets/SuccessSheet";
import { useSheet } from "@/lib/hooks/useSheet";
import { useToast } from "@/lib/hooks/useToast";
import { useAdvisorStore } from "@/stores/advisor";
import { branches, getStaffByCode, mockUser } from "@/lib/mock";
import type { LoanProduct } from "@/lib/types";
import { formatMoney } from "@/lib/utils/format";
import { calculateEmi } from "@/lib/utils/emi";

/**
 * Loan Inquiry — simplified 3-step flow used by all products EXCEPT MWL.
 *
 *   1. Personal Information — loan basics + customer profile + KYC fields
 *   2. Basic Document Upload — NID, income proof, collateral proof, etc.
 *   3. Submit Inquiry        — review summary + acknowledgement + send
 */
const STEPS = ["Personal info", "Documents", "Submit inquiry"] as const;
type Step = 0 | 1 | 2;

/** Products that typically require collateral proof at the inquiry stage. */
const REQUIRES_COLLATERAL = new Set(["p3", "p4"]); // SME, Housing

export function StandardRequestFlow({ product }: { product: LoanProduct }) {
  const router = useRouter();
  const { open, close } = useSheet();
  const toast = useToast();

  const [step, setStep] = useState<Step>(0);

  // Loan request basics
  const [amount, setAmount] = useState(
    Math.min(2000, Math.max(product.minAmount, 500)),
  );
  const [term, setTerm] = useState(
    Math.min(12, Math.max(product.minTerm, 6)),
  );
  const [purpose, setPurpose] = useState("");

  // About you
  const [income, setIncome] = useState(850);
  const [employer, setEmployer] = useState("");
  const [branchId, setBranchId] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const branch = branches.find((b) => b.id === branchId);

  // KYC / customer profile
  const [idType, setIdType] = useState<"national" | "passport" | "license">(
    "national",
  );
  const [idNumber, setIdNumber] = useState("");
  const [idExpiry, setIdExpiry] = useState("2030-12-31");
  const [dob, setDob] = useState("1992-06-15");
  const [occupation, setOccupation] = useState<
    "salaried" | "self-employed" | "business" | "other"
  >("salaried");

  // Documents (Step 2)
  const [docNid, setDocNid] = useState(false);
  const [docIncome, setDocIncome] = useState(false);
  const [docCollateral, setDocCollateral] = useState(false);
  const [docBiz, setDocBiz] = useState(false);

  // Acknowledgement (Step 3)
  const [acknowledge, setAcknowledge] = useState(false);

  const idTypeLabel = {
    national: "National ID",
    passport: "Passport",
    license: "Driving Licence",
  }[idType];
  const occupationLabel = {
    salaried: "Salaried",
    "self-employed": "Self-employed",
    business: "Business owner",
    other: "Other",
  }[occupation];

  // Advisor — the customer always types the referral number on this page.
  // Any existing advisor relationship from sign-up is still kept in the
  // store and used as a silent fallback for the review screen if the
  // customer leaves the field blank.
  const lockedAdvisorCode = useAdvisorStore((s) => s.code);
  const commitAdvisor = useAdvisorStore((s) => s.set);
  const lockedAdvisor = lockedAdvisorCode
    ? getStaffByCode(lockedAdvisorCode)
    : undefined;
  const typedAdvisor =
    referralCode.length === 5 ? getStaffByCode(referralCode) : undefined;
  const referralInvalid = referralCode.length === 5 && !typedAdvisor;
  // Typed value takes precedence so the customer can override their
  // existing advisor by entering a different code here.
  const effectiveAdvisor = typedAdvisor ?? lockedAdvisor;
  const effectiveAdvisorCode = typedAdvisor ? referralCode : lockedAdvisorCode;

  const collateralRequired = REQUIRES_COLLATERAL.has(product.id);

  const next = () => setStep((s) => (s < 2 ? ((s + 1) as Step) : s));
  const prev = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s));

  const canAdvance = (() => {
    if (step === 0) {
      return (
        amount >= product.minAmount &&
        amount <= product.maxAmount &&
        term >= product.minTerm &&
        term <= product.maxTerm &&
        purpose.trim().length > 0 &&
        income > 0 &&
        employer.trim().length > 0 &&
        branchId !== "" &&
        idNumber.trim().length >= 5 &&
        idExpiry !== "" &&
        dob !== "" &&
        !referralInvalid
      );
    }
    if (step === 1) {
      return docNid && docIncome && (!collateralRequired || docCollateral);
    }
    return acknowledge;
  })();

  const onSubmit = () => {
    open(
      <SuccessSheet
        title="Inquiry submitted"
        description="Your inquiry ID is INQ-2026-05-8812. A credit officer will follow up within 1 business day."
        primaryLabel="View My Loans"
        onPrimary={() => {
          close();
          router.push("/my-loan?tab=progress");
        }}
      />,
    );
  };

  const { emi } = calculateEmi(amount, term, Number(product.rate));

  return (
    <Screen>
      <NavHeader
        title="Loan Inquiry"
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

        {/* ───────── Step 1 — Personal Information ───────── */}
        {step === 0 && (
          <>
            <SectionTitle>Loan request</SectionTitle>
            <div className="flex flex-col gap-2.5">
              <Input
                label="Amount (USD)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={product.minAmount}
                max={product.maxAmount}
              />
              <p className="-mt-1 px-1 text-xs" style={{ color: "var(--text-3)" }}>
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
                label="Purpose of loan"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. shop renovation, school fees"
              />
            </div>

            <Card
              className="mt-3"
              style={{
                background: "rgba(31,95,255,.05)",
                border: "1px solid rgba(31,95,255,.15)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs" style={{ color: "var(--text-2)" }}>
                  Estimated monthly payment
                </div>
                <div
                  className="text-[18px] font-bold"
                  style={{ color: "var(--primary)" }}
                >
                  {formatMoney(emi)}
                </div>
              </div>
            </Card>

            <SectionTitle>About you</SectionTitle>
            <div className="flex flex-col gap-2.5">
              <Input label="Full name" defaultValue={mockUser.name} readOnly />
              <Input label="Phone" defaultValue={mockUser.phone} readOnly />
              <Input
                label="Date of birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
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
                placeholder="Company or business name"
              />
              <Textarea
                label="Address"
                rows={2}
                defaultValue="#12, St. 271, Phnom Penh"
              />

              {/* Preferred branch */}
              <Select
                label="Preferred branch"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                placeholder="Select a branch…"
                options={branches.map((b) => ({
                  value: b.id,
                  label: b.name,
                  hint: b.distance,
                }))}
              />
              {branch && (
                <p
                  className="-mt-1 px-1 text-[11px] leading-relaxed"
                  style={{ color: "var(--text-3)" }}
                >
                  {branch.address} · {branch.hours}
                </p>
              )}

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

            <SectionTitle>Identity</SectionTitle>
            <div className="flex flex-col gap-2.5">
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
            </div>

            <SectionTitle>Referral number</SectionTitle>
            <p
              className="-mt-1 mb-2 px-1 text-[12px] leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              Enter the 5-digit code from your Weloan365 Credit Officer or
              branch staff who referred you. Leave blank if no one referred
              you.
            </p>
            <Input
              label="Referral number (5 digits, optional)"
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
                  Your personal data is stored encrypted and only used by
                  approved loan officers to assess your inquiry.
                </div>
              </div>
            </Card>
          </>
        )}

        {/* ───────── Step 2 — Basic Document Upload ───────── */}
        {step === 1 && (
          <>
            <SectionTitle>Basic documents</SectionTitle>
            <p
              className="-mt-1 mb-3 px-1 text-[12px] leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              Upload clear photos or scans. Accepted formats: JPG, PNG, PDF
              (max 10 MB each).
            </p>

            {[
              {
                key: "nid",
                title: `${idTypeLabel} (front + back)`,
                hint: "Make sure all four corners are visible",
                required: true,
                checked: docNid,
                onCheck: () => setDocNid(true),
              },
              {
                key: "income",
                title: "Income proof",
                hint: "Recent payslip, bank statement, or business sales record",
                required: true,
                checked: docIncome,
                onCheck: () => setDocIncome(true),
              },
              {
                key: "collateral",
                title: "Collateral proof",
                hint:
                  product.id === "p4"
                    ? "Hard title or sale-purchase agreement"
                    : product.id === "p3"
                      ? "Title, equipment invoice or stock pledge"
                      : "Optional — speeds up high-value approvals",
                required: collateralRequired,
                checked: docCollateral,
                onCheck: () => setDocCollateral(true),
              },
              {
                key: "biz",
                title: "Business registration",
                hint: "Patent / commercial certificate (SBL & SME only)",
                required: false,
                checked: docBiz,
                onCheck: () => setDocBiz(true),
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
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    {d.title}
                    {d.required ? (
                      <span
                        className="rounded-full px-1.5 py-px text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          background: "rgba(255,77,94,.12)",
                          color: "var(--danger)",
                        }}
                      >
                        Required
                      </span>
                    ) : (
                      <span
                        className="rounded-full px-1.5 py-px text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          background: "var(--surface-2)",
                          color: "var(--text-3)",
                        }}
                      >
                        Optional
                      </span>
                    )}
                  </div>
                  <div
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--text-2)" }}
                  >
                    {d.checked ? "✓ Uploaded · 1 file" : d.hint}
                  </div>
                </div>
                <ChevronRight
                  className="h-[18px] w-[18px]"
                  style={{ color: "var(--text-3)" }}
                />
              </button>
            ))}

            <Card
              className="mt-3"
              style={{
                background: "rgba(255,159,28,.08)",
                border: "1px solid rgba(255,159,28,.2)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <ShieldCheck
                  className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
                  style={{ color: "var(--warn)" }}
                />
                <div className="text-xs leading-relaxed">
                  We may request additional documents during review. Files are
                  encrypted in transit and at rest.
                </div>
              </div>
            </Card>
          </>
        )}

        {/* ───────── Step 3 — Submit Inquiry ───────── */}
        {step === 2 && (
          <>
            <SectionTitle>Inquiry summary</SectionTitle>
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
                <span>Est. monthly payment</span>
                <span>{formatMoney(emi)}</span>
              </div>
              <div className="kv-row">
                <span>Purpose</span>
                <span className="max-w-[60%] truncate text-right">
                  {purpose || "—"}
                </span>
              </div>
            </Card>

            <SectionTitle>About you</SectionTitle>
            <Card>
              <div className="kv-row">
                <span>Name</span>
                <span>{mockUser.name}</span>
              </div>
              <div className="kv-row">
                <span>Date of birth</span>
                <span>{dob || "—"}</span>
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
                <span>Branch</span>
                <span>{branch ? branch.name : "—"}</span>
              </div>
              <div className="kv-row">
                <span>Occupation</span>
                <span>{occupationLabel}</span>
              </div>
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
                <span>Advisor</span>
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

            <SectionTitle>Documents</SectionTitle>
            <Card>
              <div className="kv-row">
                <span>{idTypeLabel}</span>
                <span style={{ color: "var(--accent)" }}>
                  {docNid ? "✓ Uploaded" : "Missing"}
                </span>
              </div>
              <div className="kv-row">
                <span>Income proof</span>
                <span style={{ color: "var(--accent)" }}>
                  {docIncome ? "✓ Uploaded" : "Missing"}
                </span>
              </div>
              <div className="kv-row">
                <span>Collateral proof</span>
                <span
                  style={{
                    color: docCollateral
                      ? "var(--accent)"
                      : collateralRequired
                        ? "var(--danger)"
                        : "var(--text-3)",
                  }}
                >
                  {docCollateral
                    ? "✓ Uploaded"
                    : collateralRequired
                      ? "Missing"
                      : "Not provided"}
                </span>
              </div>
              <div className="kv-row">
                <span>Business registration</span>
                <span
                  style={{
                    color: docBiz ? "var(--accent)" : "var(--text-3)",
                  }}
                >
                  {docBiz ? "✓ Uploaded" : "Not provided"}
                </span>
              </div>
            </Card>

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
                I confirm the information above is accurate and authorise
                Weloan365 to use it solely for assessing this loan inquiry.
                A credit officer will contact me to confirm next steps.
              </span>
            </label>

            <div
              className="mt-3 flex items-start gap-2.5 rounded-xl p-3"
              style={{
                background: "rgba(31,95,255,.05)",
                border: "1px solid rgba(31,95,255,.15)",
              }}
            >
              <CheckCircle2
                className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
                style={{ color: "var(--primary)" }}
              />
              <div className="text-[12px] leading-relaxed">
                <b>What happens next?</b> Your inquiry goes to a credit
                officer. They&apos;ll review your documents and contact you
                within 1 business day to confirm eligibility.
              </div>
            </div>
          </>
        )}
      </ScreenBody>

      <StickyFooter>
        {step < 2 ? (
          <Button onClick={next} disabled={!canAdvance}>
            Continue
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!canAdvance}
            leading={<Send className="h-[18px] w-[18px]" />}
          >
            Submit Inquiry
          </Button>
        )}
      </StickyFooter>
    </Screen>
  );
}
