"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { OtpBoxes } from "@/components/domain/auth/OtpBoxes";
import { useToast } from "@/lib/hooks/useToast";
import { useAuthStore } from "@/stores/auth";
import { mockUser } from "@/lib/mock";

const DEMO_OTP = "123456";
const COOLDOWN_SECS = 30;

/**
 * Sign In — Phone & OTP, Step 2.
 *
 * 6-digit code (demo: 123456). On success the user is signed in and routed
 * to /home. After cool-down, the resend timer becomes a tap-to-resend
 * button.
 */
export default function SignInOtpPage() {
  const router = useRouter();
  const toast = useToast();
  const signIn = useAuthStore((s) => s.signIn);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const [cooldown, setCooldown] = useState(COOLDOWN_SECS);

  // Auto-submit when 6 digits typed
  useEffect(() => {
    if (otp.length !== 6) return;
    if (otp === DEMO_OTP) {
      toast("Welcome back!", "success");
      signIn();
      router.replace("/home");
    } else {
      setError(true);
      const t = window.setTimeout(() => {
        setOtp("");
        setError(false);
      }, 600);
      return () => window.clearTimeout(t);
    }
  }, [otp, router, signIn, toast]);

  // Resend cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  const resend = () => {
    setCooldown(COOLDOWN_SECS);
    toast("New code sent", "success");
  };

  const masked = mockUser.phone.replace(/(\d{3})\s*$/, "***");

  return (
    <Screen>
      <NavHeader title="Verify code" />
      <ScreenBody>
        <h2 className="mt-2 text-[22px] font-semibold tracking-tight">
          Enter the 6-digit code
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
          We texted it to <b>{masked}</b>. Demo code: <b>123456</b>
        </p>

        <OtpBoxes value={otp} onChange={setOtp} error={error} />

        <div
          className="mt-4 text-center text-[13px]"
          style={{ color: "var(--text-2)" }}
        >
          Didn&apos;t get it?{" "}
          {cooldown > 0 ? (
            <span style={{ color: "var(--text-3)" }}>
              Resend in 0:{String(cooldown).padStart(2, "0")}
            </span>
          ) : (
            <button
              onClick={resend}
              className="font-semibold"
              style={{ color: "var(--primary)" }}
            >
              Resend code
            </button>
          )}
        </div>
      </ScreenBody>
    </Screen>
  );
}
