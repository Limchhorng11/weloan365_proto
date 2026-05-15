"use client";

import { create } from "zustand";

export type Currency = "USD" | "KHR";

interface CurrencyStore {
  /** Currently selected display currency (defaults to USD). */
  currency: Currency;
  toggle: () => void;
  set: (currency: Currency) => void;
}

/**
 * Global currency preference. Pages that show monetary amounts read this
 * store + the `formatCurrency` helper to render in the user's chosen
 * currency. First introduced on the Home outstanding card; designed so any
 * future screen (My Loans summary, Loan Detail, Calculator) can use the
 * same toggle.
 */
export const useCurrencyStore = create<CurrencyStore>((set) => ({
  currency: "USD",
  toggle: () =>
    set((s) => ({ currency: s.currency === "USD" ? "KHR" : "USD" })),
  set: (currency) => set({ currency }),
}));
