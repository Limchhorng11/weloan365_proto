"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  MapPin,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/lib/hooks/useToast";

type Category = "all" | "loans" | "repay" | "account" | "privacy" | "general";

interface Faq {
  id: string;
  category: Exclude<Category, "all">;
  question: string;
  answer: string;
}

const FAQS: Faq[] = [
  // Loans & Application
  {
    id: "f1",
    category: "loans",
    question: "How do I apply for a loan?",
    answer:
      "From Home, tap Apply Loan (or open the Loan Products list) and pick a product. Each application is a 6-step wizard: Loan terms → About you → KYC → Documents → CBC consent → Review. You'll get an Application ID by SMS after submission, and you can track the status under My Loan → Progress Loan.",
  },
  {
    id: "f2",
    category: "loans",
    question: "What documents will I need?",
    answer:
      "At minimum: a valid National ID (or Passport / Driving Licence) and a recent payslip or income proof. Some products require additional documents — for example, SBL & SME ask for business registration and recent sales records, Housing Loan asks for proof of property ownership, and Migrant Worker Loan asks for a signed overseas employment contract. The list is shown in the application wizard's Documents step.",
  },
  {
    id: "f3",
    category: "loans",
    question: "How long does approval take?",
    answer:
      "Most personal loans are reviewed within 24 hours. Business loans up to USD 10,000 are typically approved in 1–2 business days; larger amounts may require additional review. You'll get a push notification and SMS the moment a decision is made.",
  },
  {
    id: "f4",
    category: "loans",
    question: "Can I apply for multiple loans at once?",
    answer:
      "You can have multiple active loans, but you can only submit one new application at a time per product. Each product has a 3-rejections-per-month cap — if you're rejected three times for the same product in a calendar month, that product is locked until the next month. Other products stay open.",
  },

  // Repayment
  {
    id: "f5",
    category: "repay",
    question: "How do I pay my installment?",
    answer:
      "Open My Loan → Active Loan and tap Pay Now on the loan you want to pay. You can pay via Bakong KHQR, ABA Pay, ACLEDA Mobile, or Wing. Payments settle in under 30 seconds and a digital receipt is saved to your Payment History automatically.",
  },
  {
    id: "f6",
    category: "repay",
    question: "What happens if I miss a payment?",
    answer:
      "A 10% late-payment penalty is added to each overdue installment. After 3+ missed payments, your account is flagged as overdue and you'll see an alert on Home and on the loan detail. Pay overdue + penalty in one tap from the Account Overdue board. Continued non-payment can affect your CBC credit score.",
  },
  {
    id: "f7",
    category: "repay",
    question: "Can I pay off my loan early?",
    answer:
      "Yes — and there's no early-settlement penalty. The Settle Early card on your loan detail shows the exact savings (the interest you skip). Tap Get my settlement quote to request the final payoff figure.",
  },
  {
    id: "f8",
    category: "repay",
    question: "How is interest calculated?",
    answer:
      "Most products use declining-balance interest: each month's interest is calculated on the remaining principal, so as you pay down, the interest drops. A few short-term products use flat rate. The Loan Calculator lets you preview the EMI and total interest under either method before applying.",
  },

  // Account & Security
  {
    id: "f9",
    category: "account",
    question: "How do I change my PIN?",
    answer:
      "More → Account Security → Change PIN. You'll need to enter your current PIN, then the new one twice. If you forgot your PIN, use the Forgot PIN? link on the Sign In screen — it'll walk you through phone OTP + identity verification.",
  },
  {
    id: "f10",
    category: "account",
    question: "Is Face ID / Touch ID safe?",
    answer:
      "Yes. Biometric data is stored only on your device — never on our servers. Biometric login is an extra convenience layer on top of your PIN, which remains your account's master key. You can enable or disable biometric anytime in Account Security.",
  },
  {
    id: "f11",
    category: "account",
    question: "How do I change my advisor?",
    answer:
      "Each customer has exactly one personal advisor (linked via referral code). To change yours, please visit your nearest branch with valid ID. This is a deliberate friction point — your advisor is responsible for your account, so we make changes verified in person.",
  },

  // Privacy & Data
  {
    id: "f12",
    category: "privacy",
    question: "What is CBC and how do you use it?",
    answer:
      "CBC = Credit Bureau Cambodia. With your consent, we pull your credit history from CBC to assess your loan applications fairly. Your CBC report is only used for credit decisions and is never sold or shared outside of regulator-approved purposes. You can request your own CBC report from More → Check CBC.",
  },
  {
    id: "f13",
    category: "privacy",
    question: "Where is my data stored?",
    answer:
      "All customer data is stored in Cambodia in encrypted form, in compliance with NBC regulations. KYC documents are kept for 7 years after your last loan closes — required by law. You can request a copy or deletion of your data from More → App Policy → Privacy Policy.",
  },

  // General
  {
    id: "f14",
    category: "general",
    question: "Who is Weloan365?",
    answer:
      "Weloan365 is a Cambodian digital lender licensed by the National Bank of Cambodia. Our mission is to make borrowing simple, fair, and fast for every Cambodian — see More → About Company for our full vision.",
  },
  {
    id: "f15",
    category: "general",
    question: "Is there a fee to use the app?",
    answer:
      "No. The app is free to download and use. Standard loan fees (interest, late penalty if applicable) are clearly stated on each product. We never charge hidden fees, account-opening fees, or platform fees.",
  },
];

const CATEGORY_LABELS: Record<Category, string> = {
  all: "All",
  loans: "Loans",
  repay: "Repayment",
  account: "Account",
  privacy: "Privacy",
  general: "General",
};

export default function FaqPage() {
  const toast = useToast();
  const [category, setCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((f) => {
      if (category !== "all" && f.category !== category) return false;
      if (q && !`${f.question} ${f.answer}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [category, query]);

  return (
    <Screen>
      <NavHeader title="FAQ Center" />
      <ScreenBody>
        {/* Hero */}
        <div className="mb-4 text-center">
          <div
            className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-xl"
            style={{ background: "var(--primary-50)", color: "var(--primary)" }}
          >
            <HelpCircle className="h-6 w-6" />
          </div>
          <h2 className="text-[18px] font-bold tracking-tight">
            How can we help?
          </h2>
          <p className="mt-1 text-[12px]" style={{ color: "var(--text-2)" }}>
            Quick answers to common questions about loans, payments, and your
            account.
          </p>
        </div>

        {/* Search */}
        <div className="input-wrap with-prefix" style={{ padding: "10px 14px" }}>
          <Search
            className="h-[18px] w-[18px]"
            style={{ color: "var(--text-3)" }}
          />
          <input
            type="text"
            placeholder="Search FAQs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-none bg-transparent text-sm outline-none"
          />
        </div>

        {/* Category filter */}
        <div className="mt-3">
          <Segmented
            value={category}
            onChange={setCategory}
            options={[
              { value: "all", label: CATEGORY_LABELS.all },
              { value: "loans", label: CATEGORY_LABELS.loans },
              { value: "repay", label: CATEGORY_LABELS.repay },
              { value: "account", label: CATEGORY_LABELS.account },
            ]}
          />
        </div>

        {/* Q&A list */}
        <div className="mt-4 flex flex-col gap-2">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matches"
              description="Try different keywords or browse a different category."
            />
          ) : (
            filtered.map((f) => {
              const isOpen = open === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setOpen(isOpen ? null : f.id)}
                  className="rounded-2xl p-3.5 text-left shadow-sm transition"
                  style={{
                    background: "var(--surface)",
                    border: isOpen
                      ? "1.5px solid var(--primary)"
                      : "1.5px solid var(--border)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-2.5">
                      <span
                        className="rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          background: "var(--surface-2)",
                          color: "var(--text-3)",
                        }}
                      >
                        {CATEGORY_LABELS[f.category]}
                      </span>
                      <span className="text-[14px] font-semibold leading-snug">
                        {f.question}
                      </span>
                    </div>
                    <ChevronDown
                      className="h-[18px] w-[18px] flex-shrink-0 transition-transform"
                      style={{
                        color: "var(--text-3)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                      }}
                    />
                  </div>
                  {isOpen && (
                    <div
                      className="mt-3 border-t pt-3 text-[13px] leading-relaxed"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text-2)",
                      }}
                    >
                      {f.answer}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Still need help */}
        <Card
          className="mt-6"
          style={{
            background: "linear-gradient(135deg, var(--primary-50), #d6e4ff)",
            border: "none",
          }}
        >
          <div className="text-center">
            <div className="text-[13px] font-bold">
              Couldn&apos;t find your answer?
            </div>
            <p
              className="mt-1 text-[12px]"
              style={{ color: "var(--text-2)" }}
            >
              Reach out — we usually reply in under 5 minutes during business
              hours.
            </p>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <Link
              href="/chat"
              className="flex flex-col items-center gap-1 rounded-xl p-2 shadow-sm"
              style={{ background: "var(--surface)" }}
            >
              <MessageCircle
                className="h-5 w-5"
                style={{ color: "var(--primary)" }}
              />
              <span className="text-[11px] font-semibold">Chat</span>
            </Link>
            <button
              onClick={() => toast("Calling +855 23 987 654…", "info")}
              className="flex flex-col items-center gap-1 rounded-xl p-2 shadow-sm"
              style={{ background: "var(--surface)" }}
            >
              <Phone
                className="h-5 w-5"
                style={{ color: "var(--primary)" }}
              />
              <span className="text-[11px] font-semibold">Call</span>
            </button>
            <Link
              href="/more/branches"
              className="flex flex-col items-center gap-1 rounded-xl p-2 shadow-sm"
              style={{ background: "var(--surface)" }}
            >
              <MapPin
                className="h-5 w-5"
                style={{ color: "var(--primary)" }}
              />
              <span className="text-[11px] font-semibold">Branch</span>
            </Link>
          </div>
        </Card>

        <p
          className="mt-3 text-center text-[11px]"
          style={{ color: "var(--text-3)" }}
        >
          {FAQS.length} answers · Updated April 2026
        </p>
      </ScreenBody>
    </Screen>
  );
}
