"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldQuestion } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/lib/hooks/useToast";

/**
 * Forgot PIN — Step 1: Verify Phone Number
 * (Workshop ref: Session 1.F3)
 */
export default function ForgotPinPhonePage() {
  const router = useRouter();
  const toast = useToast();
  const [phone, setPhone] = useState("");

  const sendOtp = () => {
    toast("OTP sent to +855 12 345 678", "info");
    router.push("/forgot-pin/otp");
  };

  return (
    <Screen>
      <NavHeader title="Reset PIN" />
      <ScreenBody>
        <Card className="text-center" style={{ padding: "24px 16px" }}>
          <div
            className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-xl"
            style={{
              background: "rgba(255,159,28,.15)",
              color: "var(--warn)",
            }}
          >
            <ShieldQuestion className="h-7 w-7" />
          </div>
          <h2 className="mb-1 text-base font-semibold">Forgot your PIN?</h2>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            We&apos;ll guide you through resetting it. Step 1 of 3 — verify
            your registered phone number.
          </p>
        </Card>

        <h3 className="section-title">Step 1 — Verify your phone</h3>
        <Input
          label="Phone number"
          prefix={<span>🇰🇭 +855</span>}
          type="tel"
          placeholder="12 345 678"
          value={phone}
          maxLength={12}
          onChange={(e) => setPhone(e.target.value)}
        />

        <p
          className="mt-3 text-xs leading-relaxed"
          style={{ color: "var(--text-2)" }}
        >
          For your security, all active sessions on other devices will be
          signed out once your PIN is reset.
        </p>
      </ScreenBody>
      <StickyFooter>
        <Button onClick={sendOtp}>Send OTP</Button>
      </StickyFooter>
    </Screen>
  );
}
