import type { LoanStep } from "@/lib/types";

export function Timeline({ steps }: { steps: LoanStep[] }) {
  return (
    <div className="timeline">
      {steps.map((s, i) => (
        <div key={i} className={`timeline-item ${s.status}`}>
          <div className="text-sm font-medium">{s.title}</div>
          <div className="mt-0.5 text-xs" style={{ color: "var(--text-2)" }}>
            {s.date}
          </div>
        </div>
      ))}
    </div>
  );
}
