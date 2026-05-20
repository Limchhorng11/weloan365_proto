// ============ Domain Types ============

export type ID = string;

export interface User {
  id: ID;
  name: string;
  phone: string;
  email: string;
  memberSince: string;
  creditScore: number;
}

export interface LoanProduct {
  id: ID;
  name: string;
  rate: string;        // e.g. "1.2"
  rateUnit: string;    // e.g. "%/mo"
  minAmount: number;
  maxAmount: number;
  minTerm: number;     // months
  maxTerm: number;     // months
  color: string;       // CSS gradient
  icon: string;        // lucide icon name
  tagline: string;
  features: string[];
  terms: string[];
}

export type LoanStatus = "Under Review" | "Document Needed" | "Active" | "Rejected";

export interface LoanStep {
  title: string;
  date: string;
  status: "done" | "active" | "pending";
}

export interface ScheduleRow {
  no: number;
  date: string;
  principal: string;
  interest: string;
  /**
   * Late fee or penalty applied to this installment, as a string for
   * display parity with principal/interest. `"0.00"` for installments
   * that haven't accrued a fee; overdue installments carry the loan's
   * `penaltyRate` × principal+interest.
   */
  fee: string;
  /** Total amount due = principal + interest + fee. */
  amount: string;
  status: "paid" | "due" | "pending" | "overdue";
}

export interface BaseLoan {
  id: ID;
  productName: string;
  amount: number;
  status: LoanStatus;
  icon: string;
  color: string;
}

export interface ProgressingLoan extends BaseLoan {
  requestedAt: string;
  progress: number;
  totalSteps: number;
  steps: LoanStep[];
}

export interface ApprovedLoan extends BaseLoan {
  approvedAt: string;
  term: number;
  paidMonths: number;
  totalMonths: number;
  nextPayment: number;
  nextPaymentDate: string;
  totalPaid: number;
  remainingBalance: number;
  schedule: ScheduleRow[];
  /**
   * Number of installments past their due date but unpaid. When > 0 the
   * Loan Detail + Repayment screens render an "Account overdue" board
   * with the late-payment penalty summed in.
   */
  overdueMonths?: number;
  /** Late-fee percentage applied to each overdue installment (e.g. 0.1 = 10%). */
  penaltyRate?: number;
}

export interface GuarantorLoan extends BaseLoan {
  borrowerName: string;
  term: number;
  paidMonths: number;
  totalMonths: number;
  nextPaymentDate: string;
  schedule: ScheduleRow[];
}

export interface RejectedLoan extends BaseLoan {
  rejectedAt: string;
  reason: string;
  suggestions: string[];
  /** The product that was rejected — used to enforce the per-product
   *  3-rejections-per-month cap. */
  productId?: ID;
}

// ============ Chat ============

export type ChatMessage =
  | { type: "date"; text: string }
  | { type: "text"; dir: "in" | "out"; text: string; time: string }
  | { type: "voice"; dir: "in" | "out"; duration: string; time: string }
  | { type: "file"; dir: "in" | "out"; filename: string; size: string; time: string }
  | { type: "video"; dir: "in" | "out"; duration: string; time: string };

export interface Chat {
  id: ID;
  name: string;
  subtitle: string;
  avatar: string;
  color: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  messages: ChatMessage[];
}

// ============ Misc ============

/**
 * Notification taxonomy — three buckets surfaced as tabs in the app:
 *   • reminder      — due dates, document upload requests, action-needed nudges
 *   • transaction   — payment posted, loan disbursed, approval/rejection events
 *   • announcement  — news, features, branch closures, security alerts
 */
export type NotificationCategory = "reminder" | "transaction" | "announcement";

export interface NotificationItem {
  id: ID;
  icon: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  category: NotificationCategory;
}

export interface Branch {
  id: ID;
  name: string;
  address: string;
  phone: string;
  distance: string;
  hours: string;
}

export interface Blog {
  id: ID;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  cover: "a" | "b" | "c" | "d";
  icon: string;
}

export type NewsCategory = "announcement" | "news" | "alert" | "system";

export interface NewsItem {
  id: ID;
  category: NewsCategory;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  /** Short relative time, e.g. "2h ago" */
  relativeTime: string;
  /** Lucide icon name in kebab-case. */
  icon: string;
  /** Optional: pinned items appear first regardless of date. */
  pinned?: boolean;
}

export interface PaymentMethod {
  id: ID;
  name: string;
  icon: string;
  subtitle: string;
  color: string;
}

export interface Insights {
  score: number;
  grade: string;
  eligibleAmount: number;
  monthlyObligation: number;
  spendingBreakdown: { label: string; value: number; color: string }[];
  tips: string[];
}

// ============ UI ============

export type ToastKind = "info" | "success" | "error";
export interface Toast {
  id: ID;
  message: string;
  kind: ToastKind;
}

export type Tab = "home" | "myloan" | "chat" | "more";
