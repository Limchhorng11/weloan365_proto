"use client";

import { create } from "zustand";

export type AdvisorSource = "signup" | "loan-application";

interface AdvisorStore {
  /** Currently-linked staff member's 5-digit referral code (null = none). */
  code: string | null;
  /** Where the advisor was originally captured. */
  source: AdvisorSource | null;
  /** Human-readable date the advisor was linked, e.g. "Jan 15, 2024". */
  date: string | null;
  set: (code: string, source: AdvisorSource, date?: string) => void;
  clear: () => void;
}

/**
 * Each customer has **one** advisor at a time. The first time a referral
 * code is used (sign-up or loan application), the corresponding staff is
 * locked in as the customer's personal advisor. Subsequent loan applications
 * pre-fill that advisor as read-only — they cannot be silently overridden
 * by typing a different code.
 *
 * Prototype default: Sokha was referred by Lina Sok (code 12345) during
 * sign-up, so the demo starts with an advisor already set. To demo the
 * "no advisor yet" state, go through the sign-up flow and tap **Skip** on
 * the referral step.
 */
export const useAdvisorStore = create<AdvisorStore>((set) => ({
  code: "12345",
  source: "signup",
  date: "Jan 15, 2024",
  set: (code, source, date) =>
    set({
      code,
      source,
      date:
        date ??
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    }),
  clear: () => set({ code: null, source: null, date: null }),
}));
