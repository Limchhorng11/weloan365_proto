import type { Currency } from "@/stores/currency";

/** Mock conversion rate USD → KHR. Real rate would come from FX API. */
export const KHR_PER_USD = 4100;

/**
 * Format an amount that is denominated in USD for display in the user's
 * chosen currency. KHR amounts are shown without decimals (riel is rarely
 * quoted in fractional units in Cambodia).
 */
export function formatCurrency(amountInUsd: number, currency: Currency): string {
  if (currency === "KHR") {
    const khr = Math.round(amountInUsd * KHR_PER_USD);
    return "៛" + khr.toLocaleString("en-US");
  }
  return (
    "$" +
    amountInUsd.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
