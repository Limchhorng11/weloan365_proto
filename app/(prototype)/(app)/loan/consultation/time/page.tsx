"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConsultStepper } from "@/components/domain/loan/ConsultStepper";
import { branches } from "@/lib/mock";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Build a 7-day picker starting from today. */
function nextSevenDays() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      iso: d.toISOString().slice(0, 10),
      day: d.getDate(),
      month: MONTHS[d.getMonth()],
      dow: i === 0 ? "Today" : i === 1 ? "Tomorrow" : DOW[d.getDay()],
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    };
  });
}

/** Mock unavailability — reproducible per (date, time). */
function isUnavailable(date: string, time: string) {
  // simple hash → bool
  const h = (date + time).split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return h % 5 === 0;
}

/** Step 3 of 4 — Pick Time Slot. */
export default function TimeSlotPage() {
  const router = useRouter();
  const days = useMemo(nextSevenDays, []);
  const [date, setDate] = useState(days[1].iso); // default tomorrow
  const [slot, setSlot] = useState<string | null>(null);
  const [branchId, setBranchId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof sessionStorage === "undefined") return;
    const raw = sessionStorage.getItem("wl:consult");
    if (raw) {
      try {
        const s = JSON.parse(raw) as { branchId?: string };
        setBranchId(s.branchId ?? null);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const branch = branches.find((b) => b.id === branchId) ?? branches[0];

  const next = () => {
    if (!slot) return;
    if (typeof sessionStorage !== "undefined") {
      const prev = JSON.parse(sessionStorage.getItem("wl:consult") || "{}");
      sessionStorage.setItem(
        "wl:consult",
        JSON.stringify({ ...prev, date, time: slot }),
      );
    }
    router.push("/loan/consultation/confirmed");
  };

  return (
    <Screen>
      <NavHeader title="Pick Time Slot" />
      <ScreenBody>
        <ConsultStepper current="time" />

        {/* Selected branch summary */}
        <Card className="flex items-start gap-3">
          <div
            className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-[10px]"
            style={{ background: "var(--primary-50)", color: "var(--primary)" }}
          >
            <MapPin className="h-[18px] w-[18px]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold leading-tight">
              {branch.name}
            </div>
            <div
              className="mt-0.5 truncate text-[11px]"
              style={{ color: "var(--text-2)" }}
            >
              {branch.address}
            </div>
          </div>
        </Card>

        {/* 7-day chip selector */}
        <h3 className="section-title">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Choose a date
          </span>
        </h3>
        <div
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {days.map((d) => {
            const active = d.iso === date;
            return (
              <button
                key={d.iso}
                onClick={() => {
                  setDate(d.iso);
                  setSlot(null);
                }}
                className="flex min-w-[64px] flex-col items-center gap-0.5 rounded-2xl px-3 py-2.5 text-center transition"
                style={{
                  background: active ? "var(--primary)" : "var(--surface)",
                  color: active ? "#fff" : "var(--text)",
                  border: active
                    ? "1.5px solid var(--primary)"
                    : "1.5px solid var(--border)",
                  opacity: d.isWeekend ? 0.5 : 1,
                }}
                disabled={d.isWeekend}
              >
                <span className="text-[10px] font-medium opacity-80">
                  {d.dow}
                </span>
                <span className="text-[20px] font-bold leading-none">
                  {d.day}
                </span>
                <span className="text-[10px] font-medium opacity-80">
                  {d.month}
                </span>
              </button>
            );
          })}
        </div>

        {/* Time slot grid */}
        <h3 className="section-title">Available time slots</h3>
        <div className="grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((t) => {
            const unavailable = isUnavailable(date, t);
            const active = slot === t;
            return (
              <button
                key={t}
                disabled={unavailable}
                onClick={() => setSlot(t)}
                className="rounded-xl py-2.5 text-center text-[13px] font-medium transition"
                style={{
                  background: active
                    ? "var(--primary)"
                    : unavailable
                      ? "var(--surface-2)"
                      : "var(--surface)",
                  color: active
                    ? "#fff"
                    : unavailable
                      ? "var(--text-3)"
                      : "var(--text)",
                  border: active
                    ? "1.5px solid var(--primary)"
                    : "1.5px solid var(--border)",
                  textDecoration: unavailable ? "line-through" : "none",
                  opacity: unavailable ? 0.6 : 1,
                  cursor: unavailable ? "not-allowed" : "pointer",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-xs" style={{ color: "var(--text-3)" }}>
          Branch hours: {branch.hours} · Lunch break: 12:00 – 13:30
        </p>
      </ScreenBody>
      <StickyFooter>
        <Button onClick={next} disabled={!slot}>
          {slot ? `Confirm ${slot}` : "Pick a time slot"}
        </Button>
      </StickyFooter>
    </Screen>
  );
}
