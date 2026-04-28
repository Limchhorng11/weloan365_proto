import type { ReactNode } from "react";
import { StatusBar } from "./StatusBar";

/**
 * Simulated iPhone frame that wraps the whole app.
 *
 * On ≥ md (768px) the frame renders as a fixed 390×844 device with notch,
 * bezel shadow, and home indicator — so you can demo on desktop.
 *
 * Below md the frame fills the viewport (no bezel, no notch) so real
 * phones don't end up with a phone-in-phone effect.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative flex h-dvh w-full flex-col overflow-hidden md:h-[844px] md:w-[390px] md:rounded-[54px]"
      style={{
        background: "var(--bg)",
      }}
    >
      {/* Bezel shadow — desktop only */}
      <div
        className="pointer-events-none absolute inset-0 hidden rounded-[54px] md:block"
        style={{
          boxShadow:
            "0 0 0 12px #1b1f2b, 0 0 0 13px #2d3241, 0 40px 80px rgba(0,0,0,.35)",
        }}
      />

      {/* Notch — desktop only */}
      <div
        className="absolute left-1/2 top-[10px] z-50 hidden h-8 w-[120px] -translate-x-1/2 rounded-[20px] md:block"
        style={{ background: "#1b1f2b" }}
      />

      <StatusBar />

      <div
        className="relative flex-1 overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        {children}
      </div>

      {/* Home indicator — desktop only */}
      <div
        className="absolute bottom-2 left-1/2 z-[60] hidden h-[5px] w-[134px] -translate-x-1/2 rounded-[3px] opacity-50 md:block"
        style={{ background: "#000" }}
      />
    </div>
  );
}
