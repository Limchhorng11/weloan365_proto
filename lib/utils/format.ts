/** USD currency formatter with 2 decimals. */
export function formatMoney(n: number): string {
  return (
    "$" +
    Number(n).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/** USD currency formatter with no decimals (compact). */
export function formatMoneyShort(n: number): string {
  return "$" + Math.round(Number(n)).toLocaleString("en-US");
}

/** Initials from full name — up to 2 letters. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((x) => x[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
