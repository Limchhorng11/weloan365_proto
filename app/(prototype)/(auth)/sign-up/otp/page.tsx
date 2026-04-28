"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { OtpBoxes } from "@/components/domain/auth/OtpBoxes";
import { useToast } from "@/lib/hooks/useToast";

const DEMO_OTP = "123456";

export default function SignUpOtpPage() {
  const router = useRouter();
  const toast = useToast();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (otp.length !== 6) return;
    if (otp === DEMO_OTP) {
      router.push("/sign-up/create-pin");
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
      <NavHeader title="Verify Number" />
      <ScreenBody>
        <h2 className="mb-1.5 text-[22px] font-semibold">Enter the code</h2>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          We sent a 6-digit code to <b>+855 12 345 678</b>
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
