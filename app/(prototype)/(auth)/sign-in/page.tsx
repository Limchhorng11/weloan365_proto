"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ScanFace, ShieldCheck, UserPlus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { BiometricModal } from "@/components/sheets/BiometricModal";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/lib/hooks/useToast";
import { mockUser } from "@/lib/mock";
import { initials } from "@/lib/utils/format";

/**
 * Sign In — Account screen (Workshop ref: Session 1.F2, screen 2-3).
 *
 * Returning users land here after splash. They see the saved account
 * (avatar + masked phone) and can either:
 *   • Continue with PIN          → /sign-in/pin
 *   • Use Face ID / Touch ID     → biometric modal → /home
 *   • Sign in to a different account → /sign-up/phone (re-onboard)
 *
 * Showing the account up front confirms which device/identity is signing in
 * and reduces accidental wrong-account PIN entries.
 */
export default function SignInAccountPage() {
  const router = useRouter();
  const toast = useToast();
  const signIn = useAuthStore((s) => s.signIn);
  const [showBiometric, setShowBiometric] = useState(false);

  // Mask the phone number: +855 12 345 *** (hide last 3 digits)
  const maskedPhone = mockUser.phone.replace(/(\d{3})\s*$/, "***");

  const onBiometricSuccess = () => {
    setShowBiometric(false);
    toast("Welcome back!", "success");
    signIn();
    router.replace("/home");
  };

  return (
    <Screen>
      <div
        className="flex flex-shrink-0 items-center px-4"
        style={{ height: "var(--h-header)" }}
      >
        <Link
          href="/welcome"
          className="grid h-9 w-9 place-items-center rounded-[10px]"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1" />
        <div className="w-9" />
      </div>

      <ScreenBody>
        <div className="px-4 pt-6 text-center">
          <div
            className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl text-[28px] font-extrabold text-white"
            style={{
              background: "linear-gradient(135deg, var(--primary), #6aa3ff)",
              boxShadow: "0 8px 24px rgba(31,95,255,.25)",
            }}
          >
            W
          </div>
          <h1 className="text-[24px] font-bold tracking-tight">
            Welcome back
          </h1>
          <p
            className="mx-2 mt-1.5 text-sm leading-relaxed"
            style={{ color: "var(--text-2)" }}
          >
            Sign in to continue to your loans, repayments, and chat.
          </p>
        </div>

        {/* Saved account card */}
        <div
          className="mx-4 mt-8 rounded-2xl p-5 shadow-sm"
          style={{ background: "var(--surface)" }}
        >
          <div className="flex items-center gap-3.5">
            <Avatar
              size="lg"
              initials={initials(mockUser.name)}
              bg="linear-gradient(135deg, var(--primary), #6aa3ff)"
            />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider"
                   style={{ color: "var(--text-3)" }}>
                Signing in as
              </div>
              <div className="mt-0.5 truncate text-[16px] font-semibold leading-tight">
                {mockUser.name}
              </div>
              <div
                className="mt-0.5 font-mono text-[12px]"
                style={{ color: "var(--text-2)" }}
              >
                {maskedPhone}
              </div>
            </div>
          </div>

          <div
            className="mt-4 flex items-center gap-2 rounded-lg p-2.5"
            style={{ background: "var(--surface-2)" }}
          >
            <ShieldCheck
              className="h-[14px] w-[14px] flex-shrink-0"
              style={{ color: "var(--accent)" }}
            />
            <span className="text-[11px]" style={{ color: "var(--text-2)" }}>
              Last signed in <b>Apr 23, 2026 · 9:14 PM</b>
            </span>
          </div>
        </div>

        {/* Biometric quick-action */}
        <button
          onClick={() => setShowBiometric(true)}
          className="mx-4 mt-3 flex w-[calc(100%-2rem)] items-center gap-3 rounded-2xl p-4 text-left shadow-sm transition active:scale-[.99]"
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--primary)",
          }}
        >
          <div
            className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl"
            style={{ background: "var(--primary-50)", color: "var(--primary)" }}
          >
            <ScanFace className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div
              className="text-[14px] font-semibold"
              style={{ color: "var(--primary)" }}
            >
              Sign in with Face ID
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-2)" }}>
              Tap to scan — fastest way in
            </div>
          </div>
        </button>

        {/* Switch account */}
        <Link
          href="/sign-up/phone"
          className="mx-4 mt-4 flex items-center gap-3 rounded-2xl p-3.5 shadow-sm"
          style={{ background: "var(--surface)" }}
        >
          <div
            className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px]"
            style={{
              background: "var(--surface-2)",
              color: "var(--text-2)",
            }}
          >
            <UserPlus className="h-[18px] w-[18px]" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-medium">
              Sign in to a different account
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-3)" }}>
              Verify a new phone number
            </div>
          </div>
        </Link>
      </ScreenBody>

      <StickyFooter>
        <Button onClick={() => router.push("/sign-in/pin")}>
          Continue with PIN
        </Button>
        <div className="mt-2 text-center">
          <Link
            href="/forgot-pin/phone"
            className="text-[13px] font-medium"
            style={{ color: "var(--primary)" }}
          >
            Forgot PIN?
          </Link>
        </div>
      </StickyFooter>

      <BiometricModal
        open={showBiometric}
        onCancel={() => setShowBiometric(false)}
        onSuccess={onBiometricSuccess}
      />
    </Screen>
  );
}
