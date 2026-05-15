import { rejectedLoans } from "@/lib/mock/loans";
import type { RejectedLoan } from "@/lib/types";

/**
 * Business rule: customers can have at most 3 rejected applications **for
 * the same product** in a calendar month. Once a single product hits 3
 * rejections, that product is locked for the rest of the month — but
 * other products remain applicable.
 */
export const REJECTION_LIMIT_PER_MONTH = 3;

/**
 * Fixed "today" for the prototype so the demo is deterministic and the
 * limit logic always lands on May 2026 (matching the mock-data dates).
 * In production this would be `new Date()`.
 */
const REFERENCE_DATE = new Date(2026, 4, 15); // May 15, 2026

function isInReferenceMonth(rejectedAt: string): boolean {
  const [y, m] = rejectedAt.split("-").map(Number);
  return (
    y === REFERENCE_DATE.getFullYear() && m === REFERENCE_DATE.getMonth() + 1
  );
}

/** Every rejection in this calendar month (across all products). */
export function rejectionsThisMonth(): RejectedLoan[] {
  return rejectedLoans
    .filter((l) => isInReferenceMonth(l.rejectedAt))
    .sort((a, b) => a.rejectedAt.localeCompare(b.rejectedAt));
}

/** Rejections this month for a specific product. */
export function productRejectionsThisMonth(
  productId: string,
): RejectedLoan[] {
  return rejectionsThisMonth().filter((l) => l.productId === productId);
}

/** Number of products that hit the cap this month. */
export function lockedProductIdsThisMonth(): string[] {
  const counts = new Map<string, number>();
  for (const r of rejectionsThisMonth()) {
    if (!r.productId) continue;
    counts.set(r.productId, (counts.get(r.productId) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, n]) => n >= REJECTION_LIMIT_PER_MONTH)
    .map(([id]) => id);
}

/** True when the given product is locked this month. */
export function isProductLockedThisMonth(productId: string): boolean {
  return (
    productRejectionsThisMonth(productId).length >= REJECTION_LIMIT_PER_MONTH
  );
}

/** Remaining applications allowed this month for a specific product. */
export function remainingForProductThisMonth(productId: string): number {
  return Math.max(
    0,
    REJECTION_LIMIT_PER_MONTH -
      productRejectionsThisMonth(productId).length,
  );
}

/**
 * Human-readable date on which the lock lifts (first day of the next
 * calendar month relative to REFERENCE_DATE).
 */
export function nextMonthResetLabel(): string {
  const d = new Date(REFERENCE_DATE);
  d.setMonth(d.getMonth() + 1, 1);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 1-indexed position of a given rejection within its product's
 * chronologically ordered rejections this month. Returns 0 if the
 * rejection isn't in the current month or has no productId.
 */
export function rejectionOrdinalThisMonth(loanId: string): number {
  const loan = rejectedLoans.find((l) => l.id === loanId);
  if (!loan || !loan.productId) return 0;
  const list = productRejectionsThisMonth(loan.productId);
  const idx = list.findIndex((l) => l.id === loanId);
  return idx >= 0 ? idx + 1 : 0;
}
