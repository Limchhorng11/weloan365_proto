"use client";

import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  Globe,
  Landmark,
  MapPin,
  MessageSquare,
  Send,
  ShieldCheck,
  Ticket,
  Upload,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
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
 * MWL (Migrant Worker Loan) — dedicated 9-step inquiry wizard.
 *
 * Mirrors the institution's "MWL Platform-Based Loan Processing" end-to-end
 * flow (16 swimlane boxes). The borrower fills steps 1–9 here; the
 * post-submit timeline (Guarantor SMS → Verification → Branch/LOS →
 * Clarification → CBC → Approval → Accept → Disbursement) is shown as a
 * read-only timeline on the Submit Inquiry step and continues on
 * /my-loan/progressing afterwards.
 *
 * Wizard steps map to flowchart numbers:
 *   1. Select MWL Destination     → flow #1
 *   2. Personal Information       → flow #3
 *   3. Employment (Overseas)      → flow #4
 *   4. MWL Agency                 → flow #4A (NEW)
 *   5. Loan Request               → flow #5
 *   6. Bank Account (Disbursal)   → flow #5A (NEW)
 *   7. Guarantor                  → flow #6
 *   8. Required Documents         → flow #9
 *   9. Submit Inquiry             → flow #6→16 preview
 */
const STEP_LABELS = [
  "Destination",
  "Personal",
  "Employment",
  "Agency",
  "Loan",
  "Bank",
  "Guarantor",
  "Docs",
  "Submit",
] as const;
type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const DESTINATIONS = [
  {
    code: "KR",
    name: "Korea",
    flag: "🇰🇷",
    currency: "KRW",
    salaryHint: "Typical: $2,000–$3,500 / mo",
    gradient: "linear-gradient(135deg, #1a4fd4, #6a11cb)",
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    currency: "JPY",
    salaryHint: "Typical: $1,800–$3,000 / mo",
    gradient: "linear-gradient(135deg, #c2185b, #ff4d5e)",
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    currency: "SGD",
    salaryHint: "Typical: $1,200–$2,500 / mo",
    gradient: "linear-gradient(135deg, #00796b, #00c48c)",
  },
] as const;

type DestCode = (typeof DESTINATIONS)[number]["code"];

export function MWLRequestFlow({ product }: { product: LoanProduct }) {
  const router = useRouter();
  const { open, close } = useSheet();
  const toast = useToast();

  const [step, setStep] = useState<Step>(0);

  // 1 — Destination
  const [dest, setDest] = useState<DestCode | null>(null);
  const destination = DESTINATIONS.find((d) => d.code === dest);

  // 2 — Personal info
  const [fullName, setFullName] = useState(mockUser.name);
  const [dob, setDob] = useState("1992-06-15");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [nationality, setNationality] = useState("Cambodian");
  const [idNumber, setIdNumber] = useState("");
  const [branchId, setBranchId] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const branch = branches.find((b) => b.id === branchId);

  // 3 — Employment (overseas)
  const [jobPosition, setJobPosition] = useState("");
  const [employer, setEmployer] = useState("");
  const [employmentMonths, setEmploymentMonths] = useState(36);
  const [salary, setSalary] = useState(2200);

  // 4 — MWL Agency
  const [agencyName, setAgencyName] = useState("");
  const [agencyCode, setAgencyCode] = useState("");
  const [agencyContact, setAgencyContact] = useState("");
  const [agencyPhone, setAgencyPhone] = useState("");
  const [agencyAddress, setAgencyAddress] = useState("");
  const [agreementUploaded, setAgreementUploaded] = useState(false);

  // 5 — Loan request
  const [amount, setAmount] = useState(3000);
  const [purpose, setPurpose] = useState("");
  const [tenure, setTenure] = useState(24);
  const [repaymentType, setRepaymentType] = useState<
    "principal-interest" | "interest-only"
  >("principal-interest");
  const [graceEnabled, setGraceEnabled] = useState(true);
  const [graceMonths, setGraceMonths] = useState(6);

  // 6 — Bank account (for disbursement)
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState(mockUser.name);
  const [accountNumber, setAccountNumber] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [swiftCode, setSwiftCode] = useState("");

  // 7 — Guarantor
  const [gName, setGName] = useState("");
  const [gRelation, setGRelation] = useState<
    "parent" | "spouse" | "sibling" | "other"
  >("parent");
  const [gPhone, setGPhone] = useState("");
  const [gIdNumber, setGIdNumber] = useState("");

  // 8 — Documents
  const [docId, setDocId] = useState(false);
  const [docPassport, setDocPassport] = useState(false);
  const [docContract, setDocContract] = useState(false);
  const [docVisa, setDocVisa] = useState(false);
  const [docMedical, setDocMedical] = useState(false);
  const [docOther, setDocOther] = useState(false);

  // 9 — Submit ack
  const [acknowledge, setAcknowledge] = useState(false);

  // Advisor — the customer always types the referral number on this page.
  // Any existing advisor relationship is still kept in the store and used
  // as a silent fallback for the review screen if the field is left blank.
  const lockedAdvisorCode = useAdvisorStore((s) => s.code);
  const commitAdvisor = useAdvisorStore((s) => s.set);
  const lockedAdvisor = lockedAdvisorCode
    ? getStaffByCode(lockedAdvisorCode)
    : undefined;
  const typedAdvisor =
    referralCode.length === 5 ? getStaffByCode(referralCode) : undefined;
  const referralInvalid = referralCode.length === 5 && !typedAdvisor;
  // Typed value takes precedence so the customer can override an existing
  // advisor by entering a different code here.
  const effectiveAdvisor = typedAdvisor ?? lockedAdvisor;
  const effectiveAdvisorCode = typedAdvisor ? referralCode : lockedAdvisorCode;

  const { emi } = calculateEmi(amount, tenure, Number(product.rate));

  const next = () => setStep((s) => (s < 8 ? ((s + 1) as Step) : s));
  const prev = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s));

  const canAdvance = (() => {
    if (step === 0) return dest !== null;
    if (step === 1)
      return (
        fullName.trim().length > 1 &&
        dob !== "" &&
        nationality.trim().length > 0 &&
        idNumber.trim().length >= 5 &&
        branchId !== "" &&
        !referralInvalid
      );
    if (step === 2)
      return (
        jobPosition.trim().length > 0 &&
        employer.trim().length > 0 &&
        employmentMonths >= 1 &&
        salary > 0
      );
    if (step === 3)
      return (
        agencyName.trim().length > 0 &&
        agencyContact.trim().length > 0 &&
        agencyPhone.trim().length >= 6
      );
    if (step === 4)
      return (
        amount >= product.minAmount &&
        amount <= product.maxAmount &&
        tenure >= product.minTerm &&
        tenure <= product.maxTerm &&
        purpose.trim().length > 0
      );
    if (step === 5)
      return (
        bankName.trim().length > 0 &&
        accountHolder.trim().length > 0 &&
        accountNumber.trim().length >= 6 &&
        bankBranch.trim().length > 0
      );
    if (step === 6)
      return (
        gName.trim().length > 1 &&
        gPhone.trim().length >= 6 &&
        gIdNumber.trim().length >= 5
      );
    if (step === 7)
      return docId && docPassport && docContract && docVisa && docMedical;
    return acknowledge;
  })();

  const onSubmit = () => {
    open(
      <SuccessSheet
        title="MWL inquiry submitted"
        description={`Inquiry ID MWL-2026-05-${Math.floor(Math.random() * 9000) + 1000}. We've sent your guarantor a secure SMS link. We'll follow up within 1 business day.`}
        primaryLabel="Track in My Loans"
        onPrimary={() => {
          close();
          router.push("/my-loan?tab=progress");
        }}
      />,
    );
  };

  return (
    <Screen>
      <NavHeader
        title={
          destination
            ? `MWL · ${destination.flag} ${destination.name}`
            : "MWL Inquiry"
        }
        back={step === 0 ? true : prev}
      />
      <ScreenBody>
        {/* Stepper — compact pills */}
        <div className="mb-2 flex items-center gap-1">
          {STEP_LABELS.map((label, i) => (
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
            Step {step + 1} of {STEP_LABELS.length}
          </span>
          <span style={{ color: "var(--primary)" }}>{STEP_LABELS[step]}</span>
        </div>

        {/* Product context card */}
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
              {product.rate}%/mo · {product.minTerm}–{product.maxTerm} months · 1 guarantor required
            </div>
          </div>
        </Card>

        {/* ───────── Step 1 — Select Destination ───────── */}
        {step === 0 && (
          <>
            <SectionTitle>Select your destination</SectionTitle>
            <p
              className="-mt-1 mb-3 px-1 text-[12px] leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              Where are you heading for overseas work? This helps us match the
              right MWL agency and product terms.
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {DESTINATIONS.map((d) => {
                const active = d.code === dest;
                return (
                  <button
                    key={d.code}
                    type="button"
                    onClick={() => setDest(d.code)}
                    className="flex items-center gap-3 rounded-2xl p-4 text-left shadow-sm transition active:scale-[.99]"
                    style={{
                      background: "var(--surface)",
                      border: active
                        ? "2px solid var(--primary)"
                        : "1.5px solid var(--border)",
                    }}
                  >
                    <div
                      className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl text-2xl text-white"
                      style={{ background: d.gradient }}
                    >
                      {d.flag}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">{d.name}</div>
                      <div
                        className="mt-0.5 text-[11px]"
                        style={{ color: "var(--text-2)" }}
                      >
                        {d.salaryHint}
                      </div>
                    </div>
                    {active && (
                      <CheckCircle2
                        className="h-5 w-5 flex-shrink-0"
                        style={{ color: "var(--primary)" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <Card
              className="mt-4"
              style={{
                background: "rgba(31,95,255,.05)",
                border: "1px solid rgba(31,95,255,.15)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <Globe
                  className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
                  style={{ color: "var(--primary)" }}
                />
                <div className="text-xs leading-relaxed">
                  MWL covers placement fees, visa, flight, training and
                  pre-departure costs. Repayments start after your grace
                  period — typically once you receive your first overseas
                  salary.
                </div>
              </div>
            </Card>
          </>
        )}

        {/* ───────── Step 2 — Personal Information ───────── */}
        {step === 1 && (
          <>
            <SectionTitle>Basic personal information</SectionTitle>
            <div className="flex flex-col gap-2.5">
              <Input
                label="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                label="Date of birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />

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

              <Input
                label="Nationality"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
              />
              <Input
                label="National ID number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="123 456 789"
              />
            </div>

            {/* Preferred branch */}
            <SectionTitle>Preferred branch</SectionTitle>
            <p
              className="-mt-1 mb-2 px-1 text-[12px] leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              Choose the branch that will handle your file. We&apos;ll
              prioritise an officer based at this location.
            </p>
            <Select
              label="Branch"
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
              <div
                className="mt-2 flex items-start gap-2 rounded-xl p-2.5 text-[11px] leading-relaxed"
                style={{
                  background: "var(--surface-2)",
                  color: "var(--text-2)",
                }}
              >
                <MapPin
                  className="mt-px h-3.5 w-3.5 flex-shrink-0"
                  style={{ color: "var(--primary)" }}
                />
                <div>
                  <div>{branch.address}</div>
                  <div style={{ color: "var(--text-3)" }}>
                    {branch.phone} · {branch.hours}
                  </div>
                </div>
              </div>
            )}

            {/* Referral number */}
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
              prefix={
                <Ticket
                  className="h-4 w-4"
                  style={{ color: "var(--text-3)" }}
                />
              }
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
          </>
        )}

        {/* ───────── Step 3 — Employment (Overseas) ───────── */}
        {step === 2 && (
          <>
            <SectionTitle>Overseas job details</SectionTitle>
            {destination && (
              <Card
                className="mb-2"
                style={{
                  background: "rgba(31,95,255,.05)",
                  border: "1px solid rgba(31,95,255,.15)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{destination.flag}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-semibold">
                      Destination: {destination.name}
                    </div>
                    <div
                      className="text-[11px]"
                      style={{ color: "var(--text-2)" }}
                    >
                      {destination.salaryHint}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex flex-col gap-2.5">
              <Input
                label="Job position"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                placeholder="e.g. Factory worker, Caregiver"
              />
              <Input
                label="Employer / Company"
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
                placeholder="Company name in destination country"
              />
              <Input
                label="Employment period (months)"
                type="number"
                value={employmentMonths}
                onChange={(e) => setEmploymentMonths(Number(e.target.value))}
                min={1}
                max={120}
              />
              <p className="-mt-1 px-1 text-xs" style={{ color: "var(--text-3)" }}>
                Total contract length agreed with your employer.
              </p>
              <Input
                label="Monthly salary (USD)"
                type="number"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
              />
            </div>
          </>
        )}

        {/* ───────── Step 4 — MWL Agency Information (NEW) ───────── */}
        {step === 3 && (
          <>
            <SectionTitle>MWL agency information</SectionTitle>
            <p
              className="-mt-1 mb-3 px-1 text-[12px] leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              The recruitment agency handling your overseas placement. Agency
              records are managed by NHFC for effective MWL oversight.
            </p>

            <div className="flex flex-col gap-2.5">
              <Input
                label="Agency name"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="Recruitment agency name"
              />
              <Input
                label="Agency code (if any)"
                value={agencyCode}
                onChange={(e) => setAgencyCode(e.target.value)}
                placeholder="MOLVT registration code"
              />
              <Input
                label="Contact person"
                value={agencyContact}
                onChange={(e) => setAgencyContact(e.target.value)}
                placeholder="Name of your assigned officer"
              />
              <Input
                label="Phone number"
                type="tel"
                value={agencyPhone}
                onChange={(e) => setAgencyPhone(e.target.value)}
                placeholder="+855 …"
              />
              <Textarea
                label="Business address"
                rows={2}
                value={agencyAddress}
                onChange={(e) => setAgencyAddress(e.target.value)}
                placeholder="Agency office address in Cambodia"
              />

              {/* Agreement upload */}
              <button
                type="button"
                onClick={() => {
                  setAgreementUploaded(true);
                  toast("Agency agreement uploaded", "success");
                }}
                className="flex items-center gap-3 rounded-2xl p-4 text-left shadow-sm"
                style={{
                  background: "var(--surface)",
                  border: agreementUploaded
                    ? "2px solid var(--accent)"
                    : "1.5px solid var(--border)",
                }}
              >
                <div
                  className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-[10px]"
                  style={{
                    background: agreementUploaded
                      ? "rgba(0,196,140,.12)"
                      : "var(--primary-50)",
                    color: agreementUploaded
                      ? "var(--accent)"
                      : "var(--primary)",
                  }}
                >
                  <FileText className="h-[18px] w-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    Agreement upload
                    <span
                      className="rounded-full px-1.5 py-px text-[9px] font-bold uppercase tracking-wider"
                      style={{
                        background: "var(--surface-2)",
                        color: "var(--text-3)",
                      }}
                    >
                      Optional
                    </span>
                  </div>
                  <div
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--text-2)" }}
                  >
                    {agreementUploaded
                      ? "✓ Uploaded · 1 file"
                      : "Service agreement signed with the agency"}
                  </div>
                </div>
                <ChevronRight
                  className="h-[18px] w-[18px]"
                  style={{ color: "var(--text-3)" }}
                />
              </button>
            </div>

            <Card
              className="mt-4"
              style={{
                background: "rgba(0,196,140,.05)",
                border: "1px solid rgba(0,196,140,.2)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <ShieldCheck
                  className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
                  style={{ color: "var(--accent)" }}
                />
                <div className="text-xs leading-relaxed">
                  Agency will be managed by NHFC for effective MWL oversight
                  and borrower protection.
                </div>
              </div>
            </Card>
          </>
        )}

        {/* ───────── Step 5 — Loan Request ───────── */}
        {step === 4 && (
          <>
            <SectionTitle>Loan request information</SectionTitle>
            <div className="flex flex-col gap-2.5">
              <Input
                label="Loan amount (USD)"
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
                label="Purpose of loan"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. placement fee, training, flight ticket"
              />
              <Input
                label="Loan tenure (months)"
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                min={product.minTerm}
                max={product.maxTerm}
              />

              <div>
                <div
                  className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-3)" }}
                >
                  Repayment type
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { v: "principal-interest", l: "Principal + Interest" },
                      { v: "interest-only", l: "Interest only" },
                    ] as const
                  ).map((opt) => {
                    const active = opt.v === repaymentType;
                    return (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setRepaymentType(opt.v)}
                        className="rounded-xl px-3 py-2.5 text-left text-[12px] font-medium transition"
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

              {/* Grace period */}
              <Card style={{ background: "var(--surface-2)" }}>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={graceEnabled}
                    onChange={(e) => setGraceEnabled(e.target.checked)}
                    className="mt-0.5 h-5 w-5 flex-shrink-0 accent-brand"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">
                      Grace period (interest only)
                    </div>
                    <div
                      className="mt-0.5 text-[11px] leading-relaxed"
                      style={{ color: "var(--text-2)" }}
                    >
                      Pay interest only during your pre-departure / settle-in
                      months. Principal repayment starts after the grace
                      period.
                    </div>
                  </div>
                </label>
                {graceEnabled && (
                  <div className="mt-3">
                    <Input
                      label="Grace period (months)"
                      type="number"
                      value={graceMonths}
                      onChange={(e) =>
                        setGraceMonths(Math.max(1, Number(e.target.value)))
                      }
                      min={1}
                      max={12}
                    />
                  </div>
                )}
              </Card>

              <Card
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
            </div>
          </>
        )}

        {/* ───────── Step 6 — Bank Account (NEW) ───────── */}
        {step === 5 && (
          <>
            <SectionTitle>Disbursement bank account</SectionTitle>
            <p
              className="-mt-1 mb-3 px-1 text-[12px] leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              The loan amount will be disbursed directly to this account once
              approved.
            </p>

            <div className="flex flex-col gap-2.5">
              <Input
                label="Bank name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. ACLEDA, ABA, Vattanac"
              />
              <Input
                label="Account holder name"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
              />
              <Input
                label="Account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="00 000 0000 0000"
              />
              <Input
                label="Branch name"
                value={bankBranch}
                onChange={(e) => setBankBranch(e.target.value)}
                placeholder="Branch of the issuing bank"
              />
              <Input
                label="SWIFT / Code (if any)"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
                placeholder="Optional, for international wires"
              />
            </div>

            <Card
              className="mt-4"
              style={{
                background: "rgba(255,159,28,.08)",
                border: "1px solid rgba(255,159,28,.2)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <Landmark
                  className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
                  style={{ color: "var(--warn)" }}
                />
                <div className="text-xs leading-relaxed">
                  Account holder name must match the borrower&apos;s name on
                  the National ID. Mismatched accounts will delay disbursement.
                </div>
              </div>
            </Card>
          </>
        )}

        {/* ───────── Step 7 — Guarantor ───────── */}
        {step === 6 && (
          <>
            <SectionTitle>Guarantor information</SectionTitle>
            <p
              className="-mt-1 mb-3 px-1 text-[12px] leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              MWL requires <b>1 guarantor</b> based in Cambodia. They&apos;ll
              receive an SMS link to review your loan details and confirm
              their guarantee.
            </p>

            <div className="flex flex-col gap-2.5">
              <Input
                label="Full name"
                value={gName}
                onChange={(e) => setGName(e.target.value)}
                placeholder="Guarantor's legal name"
              />

              <div>
                <div
                  className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-3)" }}
                >
                  Relationship
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { v: "parent", l: "Parent" },
                      { v: "spouse", l: "Spouse" },
                      { v: "sibling", l: "Sibling" },
                      { v: "other", l: "Other family" },
                    ] as const
                  ).map((opt) => {
                    const active = opt.v === gRelation;
                    return (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setGRelation(opt.v)}
                        className="rounded-xl px-3 py-2.5 text-left text-[12px] font-medium transition"
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

              <Input
                label="Phone number"
                type="tel"
                value={gPhone}
                onChange={(e) => setGPhone(e.target.value)}
                placeholder="Guarantor's mobile (for SMS link)"
              />
              <Input
                label="ID card number"
                value={gIdNumber}
                onChange={(e) => setGIdNumber(e.target.value)}
                placeholder="Guarantor's NID"
              />
            </div>

            <Card
              className="mt-4"
              style={{
                background: "rgba(106,17,203,.05)",
                border: "1px solid rgba(106,17,203,.2)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <Users
                  className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
                  style={{ color: "#6a11cb" }}
                />
                <div className="text-xs leading-relaxed">
                  <b>Next:</b> after you submit this inquiry, your guarantor
                  receives an SMS with a secure link (valid for 24 hours) to
                  review the loan and confirm.
                </div>
              </div>
            </Card>
          </>
        )}

        {/* ───────── Step 8 — Documents ───────── */}
        {step === 7 && (
          <>
            <SectionTitle>Required documents</SectionTitle>
            <p
              className="-mt-1 mb-3 px-1 text-[12px] leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              Upload clear photos or scans. Accepted formats: JPG, PNG, PDF
              (max 10 MB each).
            </p>

            {[
              {
                key: "id",
                title: "ID Card (Front & Back)",
                hint: "All four corners visible",
                required: true,
                checked: docId,
                onCheck: () => setDocId(true),
              },
              {
                key: "passport",
                title: "Passport",
                hint: "Valid for 12+ months",
                required: true,
                checked: docPassport,
                onCheck: () => setDocPassport(true),
              },
              {
                key: "contract",
                title: "Employment contract",
                hint: "Signed overseas job offer or MOU",
                required: true,
                checked: docContract,
                onCheck: () => setDocContract(true),
              },
              {
                key: "visa",
                title: "Work permit / Visa",
                hint: "EPS, COE, or equivalent",
                required: true,
                checked: docVisa,
                onCheck: () => setDocVisa(true),
              },
              {
                key: "medical",
                title: "Medical certificate",
                hint: "Health clearance for overseas work",
                required: true,
                checked: docMedical,
                onCheck: () => setDocMedical(true),
              },
              {
                key: "other",
                title: "Other supporting documents",
                hint: "Training certs, language scores, etc.",
                required: false,
                checked: docOther,
                onCheck: () => setDocOther(true),
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
          </>
        )}

        {/* ───────── Step 9 — Submit Inquiry ───────── */}
        {step === 8 && (
          <>
            <SectionTitle>Review &amp; submit</SectionTitle>

            <Card>
              <SummaryRow
                icon={<Globe className="h-4 w-4" />}
                label="Destination"
                value={`${destination?.flag ?? ""} ${destination?.name ?? "—"}`}
              />
              <SummaryRow
                icon={<UserCheck className="h-4 w-4" />}
                label="Borrower"
                value={`${fullName} · ${nationality}`}
              />
              <SummaryRow
                icon={<Building2 className="h-4 w-4" />}
                label="Employer"
                value={`${employer || "—"} (${jobPosition || "—"})`}
              />
              <SummaryRow
                icon={<Users className="h-4 w-4" />}
                label="Agency"
                value={agencyName || "—"}
              />
              <SummaryRow
                icon={<Landmark className="h-4 w-4" />}
                label="Loan"
                value={`${formatMoney(amount)} · ${tenure} mo · ${formatMoney(emi)}/mo`}
              />
              <SummaryRow
                icon={<CreditCard className="h-4 w-4" />}
                label="Disburse to"
                value={
                  bankName
                    ? `${bankName} · •••${accountNumber.slice(-4)}`
                    : "—"
                }
              />
              <SummaryRow
                icon={<UserCheck className="h-4 w-4" />}
                label="Guarantor"
                value={gName ? `${gName} (${gRelation})` : "—"}
              />
              <SummaryRow
                icon={<MapPin className="h-4 w-4" />}
                label="Branch"
                value={branch ? branch.name : "—"}
              />
              <SummaryRow
                icon={<Ticket className="h-4 w-4" />}
                label="Referral"
                value={
                  effectiveAdvisor
                    ? `${effectiveAdvisor.name} · ${effectiveAdvisorCode}`
                    : "—"
                }
              />
            </Card>

            {/* What happens next — flowchart-style mini timeline */}
            <SectionTitle>What happens next</SectionTitle>
            <Card>
              <TimelineRow
                num={1}
                title="Guarantor SMS link sent"
                hint="Secure link · valid 24h"
                tone="primary"
              />
              <TimelineRow
                num={2}
                title="Guarantor reviews & confirms"
                hint="They upload ID proof & accept"
                tone="primary"
              />
              <TimelineRow
                num={3}
                title="Preliminary verification"
                hint="Identity, document authenticity, blacklist screening"
                tone="primary"
              />
              <TimelineRow
                num={4}
                title="Branch / LOS assessment"
                hint="Credit, risk, repayment capacity"
                tone="primary"
              />
              <TimelineRow
                num={5}
                title="Digital CBC consent (both)"
                hint="You + your guarantor authorise CBC check"
                tone="primary"
              />
              <TimelineRow
                num={6}
                title="Credit assessment & approval"
                hint="Loan offer prepared by NHFC"
                tone="accent"
              />
              <TimelineRow
                num={7}
                title="Accept loan offer"
                hint="Sign agreement in-app"
                tone="accent"
              />
              <TimelineRow
                num={8}
                title="Disbursement & loan released"
                hint="Funds wired to your bank account"
                tone="accent"
                last
              />
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
                Weloan365 (on behalf of NHFC) to use it for assessing my MWL
                inquiry. I understand my guarantor will receive an SMS link.
              </span>
            </label>

            <div
              className="mt-3 flex items-start gap-2.5 rounded-xl p-3"
              style={{
                background: "rgba(31,95,255,.05)",
                border: "1px solid rgba(31,95,255,.15)",
              }}
            >
              <MessageSquare
                className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
                style={{ color: "var(--primary)" }}
              />
              <div className="text-[12px] leading-relaxed">
                Need help during review? Tap{" "}
                <b>Chat with us</b> or call{" "}
                <span className="font-mono">023 999 888</span>{" "}
                (Mon–Fri · 8:00 AM – 5:00 PM).
              </div>
            </div>
          </>
        )}
      </ScreenBody>

      <StickyFooter>
        {step < 8 ? (
          <Button onClick={next} disabled={!canAdvance}>
            Continue
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!canAdvance}
            leading={<Send className="h-[18px] w-[18px]" />}
          >
            Submit MWL Inquiry
          </Button>
        )}
      </StickyFooter>
    </Screen>
  );
}

/* ────────────────────── Small presentational helpers ────────────────────── */

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="mb-2 flex items-center gap-2.5 last:mb-0">
      <div
        className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg"
        style={{
          background: "var(--surface-2)",
          color: "var(--text-2)",
        }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
          {label}
        </div>
        <div className="truncate text-[13px] font-medium">{value}</div>
      </div>
    </div>
  );
}

function TimelineRow({
  num,
  title,
  hint,
  tone,
  last,
}: {
  num: number;
  title: string;
  hint: string;
  tone: "primary" | "accent";
  last?: boolean;
}) {
  const color = tone === "accent" ? "var(--accent)" : "var(--primary)";
  return (
    <div className="relative flex gap-3 pb-3 last:pb-0">
      {!last && (
        <span
          aria-hidden
          className="absolute left-[15px] top-7 h-[calc(100%-12px)] w-px"
          style={{ background: "var(--border-strong)" }}
        />
      )}
      <div
        className="z-10 grid h-8 w-8 flex-shrink-0 place-items-center rounded-full text-[12px] font-bold text-white"
        style={{ background: color }}
      >
        {num}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium">{title}</div>
        <div className="text-[11px]" style={{ color: "var(--text-2)" }}>
          {hint}
        </div>
      </div>
    </div>
  );
}
