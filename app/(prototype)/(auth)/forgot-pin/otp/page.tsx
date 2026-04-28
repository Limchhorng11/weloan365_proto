"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { OtpBoxes } from "@/components/domain/auth/OtpBoxes";
import { useToast } from "@/lib/hooks/useToast";

const DEMO_OTP = "123456";

/** Forgot PIN — Step 2: OTP verification (Workshop ref: Session 1.F3) */
export default function ForgotPinOtpPage() {
  const router = useRouter();
  const toast = useToast();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (otp.length !== 6) return;
    if (otp === DEMO_OTP) {
      router.push("/forgot-pin/identity");
    } else {
      setError(true);
      const t = window.setTimeout(() => {
        setOtp("");
        setError(false);
      }, 600);
      return () => window.clearTimeout(t);
    }
  }, [otp, router]);

  return (
    <Screen>
      <NavHeader title="Reset PIN" />
      <ScreenBody>
        <h3
          className="text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-3)" }}
        >
          Step 2 of 3
        </h3>
        <h2 className="mb-1.5 mt-1 text-[22px] font-semibold">
          Enter the code we sent
        </h2>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          We sent a 6-digit code to <b>+855 12 345 678</b>. Enter <b>123456</b> for
          this prototype.
        </p>

        <OtpBoxes value={otp} onChange={setOtp} error={error} />

        <div
          className="mt-4 text-center text-[13px]"
          style={{ color: "var(--text-2)" }}
        >
          Didn&apos;t receive the code?{" "}
          <button
            onClick={() => toast("OTP resent", "success")}
            className="font-medium"
            style={{ color: "var(--primary)" }}
          >
            Resend
          </button>
        </div>
      </ScreenBody>
    </Screen>
  );
}
