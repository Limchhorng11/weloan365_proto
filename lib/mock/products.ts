import type { LoanProduct } from "@/lib/types";

/**
 * Weloan365 catalog — 5 core retail loan products.
 *
 * Naming convention follows the institution's product codes:
 *   ML  — Micro Loan
 *   SBL — Small Business Loan
 *   SME — Small & Medium Enterprise loan
 *   HL  — Housing Loan
 *   MWL — Migrant Worker Loan
 */
export const loanProducts: LoanProduct[] = [
  {
    id: "p1",
    name: "Micro Loan (ML)",
    rate: "1.2",
    rateUnit: "%/mo",
    minAmount: 200,
    maxAmount: 3000,
    minTerm: 3,
    maxTerm: 24,
    color: "linear-gradient(135deg,#1f5fff,#4578ff)",
    icon: "zap",
    tagline: "Small, fast loans for everyday needs",
    features: [
      "Disburse within 24 hours",
      "No collateral required",
      "Flexible repayment from 3 to 24 months",
      "Early settlement without penalty",
    ],
    terms: [
      "Borrower must be 18–60 years old",
      "Cambodian citizen with valid National ID",
      "Stable monthly income of USD 150+",
      "Mobile number registered under your name",
    ],
  },
  {
    id: "p2",
    name: "Small Business Loan (SBL)",
    rate: "0.95",
    rateUnit: "%/mo",
    minAmount: 1000,
    maxAmount: 20000,
    minTerm: 6,
    maxTerm: 48,
    color: "linear-gradient(135deg,#00c48c,#00796b)",
    icon: "briefcase",
    tagline: "Working capital for shopkeepers & traders",
    features: [
      "Loan amount up to USD 20,000",
      "Repayment up to 48 months",
      "Dedicated business advisor",
      "Flexible grace period on principal",
    ],
    terms: [
      "Business or trade in operation 6+ months",
      "Patent / commercial certificate (or letter from village chief)",
      "Recent sales record or stock photos",
      "Collateral may be required above USD 5,000",
    ],
  },
  {
    id: "p3",
    name: "Small & Medium Enterprise (SME)",
    rate: "0.85",
    rateUnit: "%/mo",
    minAmount: 10000,
    maxAmount: 150000,
    minTerm: 12,
    maxTerm: 84,
    color: "linear-gradient(135deg,#ff9f1c,#cc7a00)",
    icon: "building-2",
    tagline: "Scale your enterprise with structured financing",
    features: [
      "High loan amount up to USD 150,000",
      "Longer repayment up to 84 months",
      "Tailored repayment for seasonal cash flow",
      "Site visit & restructuring support",
    ],
    terms: [
      "Registered enterprise with 1+ year operating history",
      "Audited or management financial statements",
      "Tax patent & VAT registration",
      "Collateral required (property, equipment, or stock pledge)",
    ],
  },
  {
    id: "p4",
    name: "Housing Loan (HL)",
    rate: "0.75",
    rateUnit: "%/mo",
    minAmount: 5000,
    maxAmount: 200000,
    minTerm: 12,
    maxTerm: 240,
    color: "linear-gradient(135deg,#ff6b9d,#c2185b)",
    icon: "home",
    tagline: "Buy, build, or renovate your home",
    features: [
      "Lowest interest rate in the catalog",
      "Repayment up to 20 years",
      "Up to 70% loan-to-value",
      "Free property valuation",
    ],
    terms: [
      "Proof of property ownership or sale-purchase agreement",
      "Building permit (for new construction)",
      "Stable household income required",
      "Age 21–65 at maturity",
    ],
  },
  {
    id: "p5",
    name: "Migrant Worker Loan (MWL)",
    rate: "1.1",
    rateUnit: "%/mo",
    minAmount: 500,
    maxAmount: 8000,
    minTerm: 6,
    maxTerm: 36,
    color: "linear-gradient(135deg,#6a11cb,#2575fc)",
    icon: "plane",
    tagline: "Pre-departure financing for overseas workers",
    features: [
      "Covers placement fees, visa, flight & training",
      "Disbursement aligned with departure date",
      "Repayment up to 36 months from overseas income",
      "Family-in-Cambodia repayment option",
    ],
    terms: [
      "Signed overseas employment contract or MOU",
      "Valid passport (12+ months to expiry)",
      "Co-borrower or family guarantor in Cambodia",
      "Age 18–55",
    ],
  },
];

export const getProductById = (id: string) =>
  loanProducts.find((p) => p.id === id);
