"use client";

import { Delete, ScanFace } from "lucide-react";
import type { ComponentType } from "react";

interface Props {
  length?: number;
  value: string;
  error?: boolean;
  onChange: (value: string) => void;
  /** Bottom-left accessory button (default: Face ID). Pass null to hide. */
  accessory?: ComponentType<{ onClick?: () => void }> | null;
  onAccessory?: () => void;
}

/**
 * Numeric PIN pad + dots display. Used for sign-in, new PIN, and confirm PIN.
 */
export function PinPad({
  length = 6,
  value,
  error,
  onChange,
  accessory: Accessory,
  onAccessory,
}: Props) {
  const tap = (k: string) => {
    if (value.length < length) onChange(value + k);
  };
  const del = () => onChange(value.slice(0, -1));

  const dots = Array.from({ length }, (_, i) => i < value.length);
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <div className="flex gap-3.5">
        {dots.map((f, i) => (
          <div
            key={i}
            className={`pin-dot ${f ? "filled" : ""} ${error ? "error" : ""}`}
          />
        ))}
      </div>

      <div className="grid w-full max-w-[280px] grid-cols-3 gap-3.5">
        {keys.map((k) => (
          <button key={k} type="button" className="pin-key" onClick={() => tap(k)}>
            {k}
          </button>
        ))}

        {Accessory !== null ? (
          Accessory ? (
            <button type="button" className="pin-key" onClick={onAccessory}>
              <Accessory />
            </button>
          ) : (
            <button type="button" className="pin-key" onClick={onAccessory}>
              <ScanFace className="h-5 w-5" style={{ color: "var(--text-2)" }} />
            </button>
          )
        ) : (
          <div className="pin-key empty" />
        )}

        <button type="button" className="pin-key" onClick={() => tap("0")}>
          0
        </button>
        <button type="button" className="pin-key" onClick={del}>
          <Delete className="h-5 w-5" style={{ color: "var(--text-2)" }} />
        </button>
      </div>
    </div>
  );
}
