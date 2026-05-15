import type {
  ApprovedLoan,
  GuarantorLoan,
  ProgressingLoan,
  RejectedLoan,
} from "@/lib/types";
import { buildSchedule } from "@/lib/utils/schedule";

export const progressingLoans: ProgressingLoan[] = [
  {
    id: "l1",
    productName: "Quick Personal Loan",
    amount: 2000,
    status: "Under Review",
    requestedAt: "2026-04-18",
    progress: 2,
    totalSteps: 4,
    icon: "zap",
    color: "linear-gradient(135deg,#1f5fff,#4578ff)",
    steps: [
      { title: "Application Submitted", date: "2026-04-18 09:32", status: "done" },
      { title: "Document Verification", date: "2026-04-19 14:10", status: "done" },
      { title: "Credit Assessment", date: "In progress", status: "active" },
      { title: "Final Approval", date: "Pending", status: "pending" },
    ],
  },
  {
    id: "l2",
    productName: "Business Capital Loan",
    amount: 15000,
    status: "Document Needed",
    requestedAt: "2026-04-20",
    progress: 1,
    totalSteps: 4,
    icon: "briefcase",
    color: "linear-gradient(135deg,#00c48c,#00796b)",
    steps: [
      { title: "Application Submitted", date: "2026-04-20 11:05", status: "done" },
      { title: "Document Verification", date: "Missing business permit", status: "active" },
      { title: "Credit Assessment", date: "Pending", status: "pending" },
      { title: "Final Approval", date: "Pending", status: "pending" },
    ],
  },
];

export const approvedLoans: ApprovedLoan[] = [
  {
    id: "l3",
    productName: "Motorbike Loan",
    amount: 3000,
    status: "Active",
    approvedAt: "2025-10-15",
    term: 24,
    paidMonths: 6,
    totalMonths: 24,
    nextPayment: 162.5,
    nextPaymentDate: "2026-05-15",
    totalPaid: 975,
    remainingBalance: 2250,
    icon: "bike",
    color: "linear-gradient(135deg,#ff9f1c,#cc7a00)",
    schedule: buildSchedule(24, 6, 162.5, 2026, 5),
  },
  {
    id: "l4",
    productName: "Education Loan",
    amount: 8000,
    status: "Active",
    approvedAt: "2025-01-10",
    term: 36,
    paidMonths: 15,
    totalMonths: 36,
    nextPayment: 240,
    nextPaymentDate: "2026-05-10",
    totalPaid: 3600,
    remainingBalance: 5040,
    icon: "graduation-cap",
    color: "linear-gradient(135deg,#ff6b9d,#c2185b)",
    schedule: buildSchedule(36, 15, 240, 2026, 5),
  },
  /**
   * Demo OVERDUE loan — borrower missed the last 4 monthly payments.
   * Used to demonstrate the "Account overdue" board (Repayment screen)
   * with a 10% late-fee penalty applied to each overdue installment.
   */
  {
    id: "l7",
    productName: "Home Improvement Loan",
    amount: 4000,
    status: "Active",
    approvedAt: "2025-08-01",
    term: 24,
    paidMonths: 3,
    totalMonths: 24,
    nextPayment: 195,
    nextPaymentDate: "2026-02-15", // earliest overdue date
    totalPaid: 585,
    remainingBalance: 4095,
    icon: "home",
    color: "linear-gradient(135deg,#ff4d5e,#c2185b)",
    overdueMonths: 4,
    penaltyRate: 0.1,
    schedule: buildSchedule(24, 3, 195, 2026, 5, 4),
  },
];

export const guarantorLoans: GuarantorLoan[] = [
  {
    id: "l5",
    productName: "Personal Loan — Dara Kim",
    borrowerName: "Dara Kim",
    amount: 1500,
    status: "Active",
    term: 18,
    paidMonths: 4,
    totalMonths: 18,
    nextPaymentDate: "2026-05-20",
    icon: "user-check",
    color: "linear-gradient(135deg,#6a11cb,#2575fc)",
    schedule: buildSchedule(18, 4, 92.5, 2026, 5),
  },
];

export const rejectedLoans: RejectedLoan[] = [
  {
    id: "l6",
    productName: "Business Capital Loan",
    amount: 30000,
    status: "Rejected",
    rejectedAt: "2025-08-22",
    reason:
      "Insufficient credit history and annual turnover below eligibility threshold",
    icon: "briefcase",
    color: "linear-gradient(135deg,#888,#555)",
    suggestions: [
      "Try a smaller loan amount",
      "Build 6+ months of credit history first",
      "Apply again after submitting updated financials",
    ],
  },
];

export const getProgressingLoan = (id: string) =>
  progressingLoans.find((l) => l.id === id);
export const getApprovedLoan = (id: string) =>
  approvedLoans.find((l) => l.id === id);
export const getGuarantorLoan = (id: string) =>
  guarantorLoans.find((l) => l.id === id);
export const getRejectedLoan = (id: string) =>
  rejectedLoans.find((l) => l.id === id);
