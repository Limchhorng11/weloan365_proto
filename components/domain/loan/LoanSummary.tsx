import type { ReactNode } from "react";

interface Stat {
  label: string;
  value: ReactNode;
}

interface Props {
  label: string;
  amount: ReactNode;
  stats?: Stat[];
  background: string;
}

/** Gradient hero card used on loan details and product detail. */
export function LoanSummary({ label, amount, stats, background }: Props) {
  return (
    <div
      className="mb-4 rounded-[22px] p-5 text-white"
      style={{ background }}
    >
      <div className="text-xs uppercase tracking-wider opacity-85">{label}</div>
      <div className="my-1.5 text-[32px] font-bold leading-tight">{amount}</div>
      {stats && stats.length > 0 && (
        <div
          className="mt-4 flex justify-between border-t pt-4"
          style={{ borderColor: "rgba(255,255,255,.2)" }}
        >
          {stats.map((s, i) => (
            <div key={i}>
              <small className="block text-[11px] opacity-80">{s.label}</small>
              <b className="text-[13px] font-semibold">{s.value}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
