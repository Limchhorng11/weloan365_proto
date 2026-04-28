"use client";

import { Delete } from "lucide-react";

interface Props {
  length?: number;
  value: string;
  error?: boolean;
  onChange: (value: string) => void;
}

/** 6-box OTP display + numeric keypad for entry. */
export function OtpBoxes({ length = 6, value, error, onChange }: Props) {
  const digits = Array.from({ length }, (_, i) => value[i] || "");
  const tap = (k: string) => {
    if (value.length < length) onChange(value + k);
  };
  const del = () => onChange(value.slice(0, -1));

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div>
      <div className="my-6 flex justify-center gap-2.5">
        {digits.map((d, i) => (
          <div
            key={i}
            className={`otp-box ${d ? "filled" : ""} ${error ? "error" : ""}`}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="mx-auto grid max-w-[280px] grid-cols-3 gap-3.5">
        {keys.map((k) => (
          <button key={k} type="button" className="pin-key" onClick={() => tap(k)}>
            {k}
          </button>
        ))}
        <div className="pin-key empty" />
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
