"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/lib/hooks/useToast";

export default function SignUpPhonePage() {
  const router = useRouter();
  const toast = useToast();
  const [phone, setPhone] = useState("");

  const handleSend = () => {
    toast("OTP sent to +855 12 345 678", "info");
    router.push("/sign-up/otp");
  };

  return (
    <Screen>
      <NavHeader title="Create Account" />
      <ScreenBody>
        <h2 className="mb-1.5 text-[22px] font-semibold">
          What&apos;s your phone number?
        </h2>
        <p className="mb-4 text-sm" style={{ color: "var(--text-2)" }}>
          We&apos;ll send a one-time code to verify your number.
        </p>

        <Input
          label="Phone number"
          prefix={<span>🇰🇭 +855</span>}
          type="tel"
          placeholder="12 345 678"
          value={phone}
          maxLength={12}
          onChange={(e) => setPhone(e.target.value)}
        />

        <p className="mt-3 text-xs" style={{ color: "var(--text-2)" }}>
          By continuing, you agree to our <b>Terms of Service</b> and{" "}
          <b>Privacy Policy</b>.
        </p>
      </ScreenBody>
      <StickyFooter>
        <Button onClick={handleSend}>Send Code</Button>
      </StickyFooter>
    </Screen>
  );
}
