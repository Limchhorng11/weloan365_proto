"use client";

import { Signal, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

/** iPhone-style status bar that ticks every minute. */
export function StatusBar() {
  const [time, setTime] = useState("9:41");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = d.getHours() % 12 || 12;
      const m = String(d.getMinutes()).padStart(2, "0");
      setTime(`${h}:${m}`);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="relative z-40 flex flex-shrink-0 items-end justify-between px-7 pb-1.5 text-[15px] font-semibold"
      style={{ height: "var(--h-statusbar)", color: "var(--text)" }}
    >
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-4 w-4" />
        <Wifi className="h-4 w-4" />
        <span
          className="relative h-[11px] w-6 rounded-[3px] p-[1px]"
          style={{ border: "1.2px solid var(--text)" }}
        >
          <span
            className="block h-full w-[90%] rounded-[1px]"
            style={{ background: "var(--text)" }}
          />
          <span
            className="absolute -right-[3px] top-[3px] h-1 w-[2px] rounded-sm"
            style={{ background: "var(--text)" }}
          />
        </span>
      </div>
    </div>
  );
}
