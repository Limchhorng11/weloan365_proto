"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavHeader } from "@/components/ui/NavHeader";
import { PinPad } from "@/components/domain/auth/PinPad";
import { useToast } from "@/lib/hooks/useToast";

/**
 * Forgot PIN — Step 4: Set the new PIN, then confirm.
 * Two-stage entry handled within a single page (no extra route needed).
 */
export default function ForgotPinNewPinPage() {
  const router = useRouter();
  const toast = useToast();

  const [stage, setStage] = useState<"create" | "confirm">("create");
  const [created, setCreated] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (pin.length !== 6) return;
    if (stage === "create") {
      setCreated(pin);
      setPin("");
      setStage("confirm");
    } else {
      if (pin === created) {
        router.replace("/forgot-pin/success");
      } else {
        setError(true);
        toast("PINs don't match. Try again.", "error");
        const t = window.setTimeout(() => {
          setPin("");
          setError(false);
        }, 600);
        return () => window.clearTimeout(t);
      }
    }
  }, [pin, stage, created, router, toast]);

  return (
    <div className="flex h-full flex-col" style={{ background: "var(--bg)" }}>
      <NavHeader title="Reset PIN" back={false} />
      <div className="px-6 pt-4">
        <h3
          className="text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-3)" }}
        >
          {stage === "create" ? "Create" : "Confirm"} new PIN
        </h3>
        <h1 className="mt-1 text-[26px] font-bold tracking-tight">
          {stage === "create"
            ? "Set a new 6-digit PIN"
            : "Re-enter to confirm"}
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "var(--text-2)" }}>
          {stage === "create"
            ? "Choose a PIN you'll remember. Avoid sequences like 123456."
            : "Type the same PIN again to make sure it matches."}
        </p>
      </div>
      <PinPad value={pin} onChange={setPin} error={error} accessory={null} />
    </div>
  );
}
