import type { ScheduleRow } from "@/lib/types";

/** Build a mock amortization schedule for the prototype. */
export function buildSchedule(
  totalMonths: number,
  paidMonths: number,
  monthlyAmount: number,
  currentYear: number,
  currentMonth: number,
): ScheduleRow[] {
  const schedule: ScheduleRow[] = [];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const startYear = currentYear;
  const startMonth = currentMonth - paidMonths;
  for (let i = 0; i < totalMonths; i++) {
    const y = startYear + Math.floor((startMonth - 1 + i) / 12);
    const m = (((startMonth - 1 + i) % 12) + 12) % 12;
    const status: ScheduleRow["status"] =
      i < paidMonths ? "paid" : i === paidMonths ? "due" : "pending";
    schedule.push({
      no: i + 1,
      date: `${months[m]} ${String((i % 28) + 1).padStart(2, "0")}, ${y}`,
      principal: (monthlyAmount * 0.8).toFixed(2),
      interest: (monthlyAmount * 0.2).toFixed(2),
      amount: monthlyAmount.toFixed(2),
      status,
    });
  }
  return schedule;
}
