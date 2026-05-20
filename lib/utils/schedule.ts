import type { ScheduleRow } from "@/lib/types";

/**
 * Build a mock amortization schedule.
 *
 *   paidMonths      installments already paid (status = "paid")
 *   overdueMonths   installments past due date but unpaid (status = "overdue")
 *   then 1          installment is the current "due"
 *   remainder       installments are "pending"
 *
 * Each row is split into Principal / Interest / Fee — the prototype uses
 * an 80/20 P:I split and adds a 10% late-fee on overdue installments so
 * the Fee/Penalty column has data to render.
 */
export function buildSchedule(
  totalMonths: number,
  paidMonths: number,
  monthlyAmount: number,
  currentYear: number,
  currentMonth: number,
  overdueMonths: number = 0,
  penaltyRate: number = 0.1,
): ScheduleRow[] {
  const schedule: ScheduleRow[] = [];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const startYear = currentYear;
  // Shift start so paid + overdue installments are in the past relative to now.
  const startMonth = currentMonth - paidMonths - overdueMonths;

  const principal = monthlyAmount * 0.8;
  const interest = monthlyAmount * 0.2;

  for (let i = 0; i < totalMonths; i++) {
    const y = startYear + Math.floor((startMonth - 1 + i) / 12);
    const m = (((startMonth - 1 + i) % 12) + 12) % 12;

    let status: ScheduleRow["status"];
    if (i < paidMonths) status = "paid";
    else if (i < paidMonths + overdueMonths) status = "overdue";
    else if (i === paidMonths + overdueMonths) status = "due";
    else status = "pending";

    // Only overdue installments carry a late fee in this prototype.
    const fee = status === "overdue" ? monthlyAmount * penaltyRate : 0;
    const total = principal + interest + fee;

    schedule.push({
      no: i + 1,
      date: `${months[m]} ${String((i % 28) + 1).padStart(2, "0")}, ${y}`,
      principal: principal.toFixed(2),
      interest: interest.toFixed(2),
      fee: fee.toFixed(2),
      amount: total.toFixed(2),
      status,
    });
  }
  return schedule;
}
