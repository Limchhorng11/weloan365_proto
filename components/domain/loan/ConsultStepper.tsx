import { Check } from "lucide-react";

const STEPS = [
  { key: "consult", label: "Consult" },
  { key: "branch", label: "Branch" },
  { key: "time", label: "Time" },
  { key: "confirmed", label: "Confirmed" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

/**
 * Shared 4-step progress header for the consultation flow:
 *   Consult → Choose Branch → Pick Time Slot → Booking Confirmed
 */
export function ConsultStepper({ current }: { current: StepKey }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="mb-4">
      <div className="mb-1.5 flex items-center gap-1">
        {STEPS.map((s, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <div key={s.key} className="flex flex-1 items-center gap-1">
              <div
                className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full text-[10px] font-semibold"
                style={{
                  background:
                    done || active ? "var(--primary)" : "var(--border-strong)",
                  color: done || active ? "#fff" : "var(--text-3)",
                  boxShadow: active
                    ? "0 0 0 4px rgba(31,95,255,.18)"
                    : undefined,
                }}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="h-[2px] flex-1 rounded-full"
                  style={{
                    background:
                      i < currentIdx
                        ? "var(--primary)"
                        : "var(--border-strong)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div
        className="flex items-center justify-between text-[11px] font-medium"
        style={{ color: "var(--text-2)" }}
      >
        <span>
          Step {currentIdx + 1} of {STEPS.length}
        </span>
        <span style={{ color: "var(--primary)" }}>{STEPS[currentIdx].label}</span>
      </div>
    </div>
  );
}
