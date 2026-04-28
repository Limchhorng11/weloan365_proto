export interface Promo {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  cta: string;
  ctaHref: string;
  gradient: string;
  highlight: string;
  validUntil: string;
  terms: string[];
}

export const promos: Promo[] = [
  {
    id: "edu-low-rate",
    title: "Education Loan 0.75%",
    shortDesc: "Lowest rate this semester",
    longDesc:
      "Invest in your future without breaking the bank. For a limited time, our Education Loan rate drops to just 0.75% per month — the lowest we've ever offered.",
    cta: "Apply for Education Loan",
    ctaHref: "/loan/products/p4/request",
    gradient: "linear-gradient(135deg, #ff6b9d, #c2185b)",
    highlight: "0.75% / mo",
    validUntil: "Jun 30, 2026",
    terms: [
      "Available for full-time enrolled students",
      "Loan amount up to $15,000",
      "Term up to 48 months with grace period",
      "Guarantor required",
    ],
  },
  {
    id: "biz-fast-track",
    title: "Business loan fast-track",
    shortDesc: "Approval in 24 hours",
    longDesc:
      "For verified small businesses, our Business Capital Loan can be reviewed and disbursed within 24 hours. Get the working capital you need without the wait.",
    cta: "Apply for Business Loan",
    ctaHref: "/loan/products/p2/request",
    gradient: "linear-gradient(135deg, #1f5fff, #0a2f8a)",
    highlight: "24h approval",
    validUntil: "Sep 30, 2026",
    terms: [
      "Available for registered businesses with 1+ year of history",
      "Loan amount up to $50,000",
      "Standard documentation required",
      "Subject to credit assessment",
    ],
  },
  {
    id: "bakong-instant",
    title: "Bakong KHQR payment",
    shortDesc: "Instant repayment in-app",
    longDesc:
      "Pay your loan installments directly through Bakong KHQR — no need to leave the app. Reconciliation is instant and you get a digital receipt right away.",
    cta: "Try a payment",
    ctaHref: "/my-loan?tab=active",
    gradient: "linear-gradient(135deg, #00c48c, #00796b)",
    highlight: "0 fees",
    validUntil: "Always available",
    terms: [
      "Works with any KHQR-enabled banking app",
      "Settlement within 30 seconds",
      "Receipt auto-saved to Payment History",
    ],
  },
];

export const getPromoById = (id: string) => promos.find((p) => p.id === id);
