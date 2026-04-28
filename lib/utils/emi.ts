/**
 * Equated Monthly Installment (EMI) calculation using the standard formula.
 *
 * @param amount principal in currency units
 * @param months number of months
 * @param monthlyRate interest rate per month as a percentage (e.g. 1.2 for 1.2%)
 */
export function calculateEmi(
  amount: number,
  months: number,
  monthlyRate: number,
): { emi: number; total: number; interest: number } {
  const r = monthlyRate / 100;
  const n = months;
  const a = amount;
  const emi = (a * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  const interest = total - a;
  return { emi, total, interest };
}
