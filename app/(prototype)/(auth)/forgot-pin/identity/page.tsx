"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/lib/hooks/useToast";

/**
 * Forgot PIN — Step 3: Identity verification.
 * Demo answer: last 4 of National ID = 6789, DOB = 1992-06-15
 * (Workshop ref: Session 1.F3 — prevents SIM-swap attacks)
 */
export default function ForgotPinIdentityPage() {
  const router = useRouter();
  const toast = useToast();
  const [last4, setLast4] = useState("");
  const [dob, setDob] = useState("1992-06-15");
  const [attempts, setAttempts] = useState(0);

  const verify = () => {
    if (last4.length !== 4) {
      toast("Please enter the last 4 digits of your National ID", "error");
      return;
    }
    // Demo logic: 6789 always passes
    if (last4 === "6789" && dob === "1992-06-15") {
      router.push("/forgot-pin/new-pin");
      return;
    }
    const next = attempts + 1;
    setAttempts(next);
    if (next >= 3) {
      toast(
        "3 failed attempts. Please visit a branch or contact support.",
        "error",
      );
    } else {
      toast(`Identity check failed. ${3 - next} attempt(s) left.`, "error");
    }
  };

  return (
    <Screen>
      <NavHeader title="Reset PIN" />
      <ScreenBody>
        <h3
          className="text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-3)" }}
        >
          Step 3 of 3
        </h3>
        <h2 className="mb-1.5 mt-1 text-[22px] font-semibold">
          Verify your identity
        </h2>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          Confirm a couple of details so we know it&apos;s really you.
        </p>

        <Card
          className="mt-4"
          style={{
            background: "rgba(255,159,28,.08)",
            border: "1px solid rgba(255,159,28,.2)",
          }}
        >
          <div className="flex items-start gap-2.5">
            <ShieldAlert
              className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
              style={{ color: "var(--warn)" }}
            />
            <div className="text-sm">
              <div className="font-medium">3 attempts only</div>
              <div className="mt-1.5" style={{ color: "var(--text-2)" }}>
                After 3 failed attempts you&apos;ll need to visit a branch or
                contact support to reset your PIN.
              </div>
            </div>
          </div>
        </Card>

        <h3 className="section-title">Identity check</h3>
        <div className="flex flex-col gap-2.5">
          <Input
            label="Last 4 digits of National ID"
            type="tel"
            inputMode="numeric"
            maxLength={4}
            placeholder="• • • •"
            value={last4}
            onChange={(e) =>
              setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
          />
          <Input
            label="Date of birth"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <p className="mt-3 text-xs" style={{ color: "var(--text-3)" }}>
          Demo: last 4 digits = <b>6789</b>, DOB = <b>1992-06-15</b>
        </p>
      </ScreenBody>
      <StickyFooter>
        <Button onClick={verify} disabled={attempts >= 3}>
          {attempts >= 3 ? "Locked — contact support" : "Verify Identity"}
        </Button>
      </StickyFooter>
    </Screen>
  );
}
