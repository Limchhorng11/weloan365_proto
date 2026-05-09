"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Clock, MapPin, Navigation, Phone } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Button } from "@/components/ui/Button";
import { ConsultStepper } from "@/components/domain/loan/ConsultStepper";
import { branches } from "@/lib/mock";

/** Step 2 of 4 — Choose Branch. */
export default function BranchPickerPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(branches[0].id);

  const next = () => {
    if (!selected) return;
    if (typeof sessionStorage !== "undefined") {
      const prev = JSON.parse(sessionStorage.getItem("wl:consult") || "{}");
      sessionStorage.setItem(
        "wl:consult",
        JSON.stringify({ ...prev, branchId: selected }),
      );
    }
    router.push("/loan/consultation/time");
  };

  return (
    <Screen>
      <NavHeader title="Choose Branch" />
      <ScreenBody>
        <ConsultStepper current="branch" />

        {/* Mock map preview */}
        <div
          className="relative mb-4 grid h-[180px] place-items-center overflow-hidden rounded-2xl"
          style={{ background: "linear-gradient(135deg, #d6e4ff, #eef3ff)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(31,95,255,.1) 1px, transparent 1px), linear-gradient(rgba(31,95,255,.1) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          {[
            { top: "30%", left: "25%", id: "b1" },
            { top: "55%", left: "60%", id: "b4" },
            { top: "20%", left: "70%", id: "b2" },
            { top: "60%", left: "30%", id: "b3" },
          ].map((p) => {
            const isSelected = p.id === selected;
            return (
              <div
                key={p.id}
                className="absolute"
                style={{
                  top: p.top,
                  left: p.left,
                  color: isSelected ? "var(--primary)" : "var(--text-3)",
                  transform: isSelected ? "scale(1.4)" : "scale(1)",
                  transition: "transform .2s",
                  zIndex: isSelected ? 2 : 1,
                  filter: isSelected
                    ? "drop-shadow(0 4px 8px rgba(31,95,255,.4))"
                    : "none",
                }}
              >
                <MapPin className="h-7 w-7" />
              </div>
            );
          })}
          <button
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl shadow-md"
            style={{ background: "var(--surface)", color: "var(--primary)" }}
            aria-label="Use my location"
          >
            <Navigation className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {branches.map((b) => {
            const active = b.id === selected;
            return (
              <button
                key={b.id}
                onClick={() => setSelected(b.id)}
                className="flex w-full items-start gap-3 rounded-2xl p-3.5 text-left shadow-sm transition"
                style={{
                  background: "var(--surface)",
                  border: active
                    ? "2px solid var(--primary)"
                    : "1.5px solid var(--border)",
                }}
              >
                <div
                  className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px]"
                  style={{
                    background: "var(--primary-50)",
                    color: "var(--primary)",
                  }}
                >
                  <MapPin className="h-[18px] w-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[14px] font-semibold leading-tight">
                      {b.name}
                    </div>
                    <span
                      className="flex-shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                      style={{
                        background: "var(--surface-2)",
                        color: "var(--text-2)",
                      }}
                    >
                      {b.distance}
                    </span>
                  </div>
                  <div
                    className="mt-1 text-xs leading-snug"
                    style={{ color: "var(--text-2)" }}
                  >
                    {b.address}
                  </div>
                  <div
                    className="mt-2 flex flex-wrap items-center gap-3 text-[11px]"
                    style={{ color: "var(--text-3)" }}
                  >
                    <span className="inline-flex items-center gap-0.5">
                      <Clock className="h-3 w-3" /> {b.hours}
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <Phone className="h-3 w-3" /> {b.phone}
                    </span>
                  </div>
                </div>
                {active && (
                  <span
                    className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full text-white"
                    style={{ background: "var(--primary)" }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </ScreenBody>
      <StickyFooter>
        <Button onClick={next} disabled={!selected}>
          Continue
        </Button>
      </StickyFooter>
    </Screen>
  );
}
