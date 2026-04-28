"use client";

import { ChevronRight, CheckCircle } from "lucide-react";
import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { paymentMethods } from "@/lib/mock";
import { useSheet } from "@/lib/hooks/useSheet";
import type { PaymentMethod } from "@/lib/types";

function pickIcon(name: string): LucideIcon {
  const lookup = (Icons as unknown as Record<string, LucideIcon>);
  const pascal = name
    .split("-")
    .map((p) => p[0]?.toUpperCase() + p.slice(1))
    .join("");
  return lookup[pascal] ?? Icons.CreditCard;
}

type Step = "choose" | "processing" | "success";

interface Props {
  dueAmount?: number;
  installmentNo?: number;
  dueDate?: string;
}

/**
 * Mock payment flow: choose method → redirect simulation → success receipt.
 * This is a single sheet body that owns its own internal step state.
 */
export function PaymentSheet({
  dueAmount = 162.5,
  installmentNo,
  dueDate = "May 15",
}: Props) {
  const { close } = useSheet();
  const [step, setStep] = useState<Step>("choose");
  const [selected, setSelected] = useState<PaymentMethod | null>(null);

  const formatted = useMemo(
    () =>
      "$" +
      dueAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    [dueAmount],
  );

  if (step === "choose") {
    return (
      <>
        <h3 className="mb-1 text-[17px] font-semibold">Choose payment method</h3>
        <p className="mb-3 text-[13px]" style={{ color: "var(--text-2)" }}>
          {installmentNo ? `Installment #${installmentNo} · ` : ""}
          {formatted} due {dueDate}
        </p>
        <div className="list-group">
          {paymentMethods.map((pm) => {
            const Icon = pickIcon(pm.icon);
            return (
              <button
                key={pm.id}
                type="button"
                className="list-row w-full text-left"
                onClick={() => {
                  setSelected(pm);
                  setStep("processing");
                  setTimeout(() => setStep("success"), 1800);
                }}
              >
                <div
                  className="list-icon"
                  style={{ background: `${pm.color}22`, color: pm.color }}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <div className="list-main">
                  <div className="list-title">{pm.name}</div>
                  <div className="list-sub">{pm.subtitle}</div>
                </div>
                <div className="list-chev">
                  <ChevronRight className="h-[18px] w-[18px]" />
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-center text-[11px]" style={{ color: "var(--text-3)" }}>
          Payment deeplinks are mocked in this prototype
        </p>
      </>
    );
  }

  if (step === "processing" && selected) {
    const Icon = pickIcon(selected.icon);
    return (
      <div className="py-5 text-center">
        <div
          className="mx-auto mb-4 grid h-[60px] w-[60px] place-items-center rounded-xl"
          style={{ background: `${selected.color}22`, color: selected.color }}
        >
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="mb-1 text-[17px] font-semibold">
          Redirecting to {selected.name}…
        </h3>
        <p className="text-[13px]" style={{ color: "var(--text-2)" }}>
          Complete the payment in the {selected.name} app and return here.
        </p>
        <div
          className="mx-auto mt-5 h-[3px] w-[120px] overflow-hidden rounded-full"
          style={{ background: `${selected.color}22` }}
        >
          <div
            className="h-full w-[40%] rounded-full"
            style={{ background: selected.color, animation: "loading 1.5s infinite" }}
          />
        </div>
      </div>
    );
  }

  if (step === "success" && selected) {
    return (
      <div className="py-5">
        <div className="text-center">
          <div
            className="mx-auto mb-4 grid h-[72px] w-[72px] place-items-center rounded-xl"
            style={{ background: "rgba(0,196,140,.12)", color: "var(--accent)" }}
          >
            <CheckCircle className="h-9 w-9" />
          </div>
          <h3 className="mb-1 text-[17px] font-semibold">Payment Successful</h3>
          <p className="mb-5 text-[13px]" style={{ color: "var(--text-2)" }}>
            {formatted} paid via {selected.name}
          </p>
        </div>
        <div className="card mb-5">
          <div className="kv-row">
            <span>Reference #</span>
            <span>TX-20260423-8812</span>
          </div>
          <div className="kv-row">
            <span>Method</span>
            <span>{selected.name}</span>
          </div>
          <div className="kv-row">
            <span>Amount</span>
            <span>{formatted}</span>
          </div>
          <div className="kv-row">
            <span>Date</span>
            <span>Apr 23, 2026 · 9:42 AM</span>
          </div>
        </div>
        <Button onClick={close}>Done</Button>
      </div>
    );
  }

  return null;
}
