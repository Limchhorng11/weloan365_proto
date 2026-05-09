"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Fingerprint } from "lucide-react";
import { PinPad } from "@/components/domain/auth/PinPad";
import { BiometricModal } from "@/components/sheets/BiometricModal";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/lib/hooks/useToast";
import { mockUser } from "@/lib/mock";
import { initials } from "@/lib/utils/format";

const DEMO_PIN = "123456";

/**
 * Sign In — PIN entry (Workshop ref: Session 1.F2, screen 3).
 *
 * Reached from /sign-in (the account screen) via the "Continue with PIN"
 * button. The account context is shown at the top so the user is reminded
 * which account they are unlocking.
 */
export default function SignInPinPage() {
  const router = useRouter();
  const toast = useToast();
  const signIn = useAuthStore((s) => s.signIn);

  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);

  useEffect(() => {
    if (pin.length !== 6) return;
    if (pin === DEMO_PIN) {
      toast("Welcome back!", "success");
      signIn();
      router.replace("/home");
    } else {
      setError(true);
      const t = window.setTimeout(() => {
        setPin("");
        setError(false);
      }, 600);
      return () => window.clearTimeout(t);
    }
  }, [pin, router, signIn, toast]);

  const onBiometricSuccess = () => {
    setShowBiometric(false);
    toast("Welcome back!", "success");
    signIn();
    router.replace("/home");
  };

  return (
    <div
      className="flex h-full flex-col animate-fade-in"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="flex flex-shrink-0 items-center px-4"
        style={{ height: "var(--h-header)" }}
      >
        <Link
          href="/sign-in"
          className="grid h-9 w-9 place-items-center rounded-[10px]"
          aria-label="Back to account"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1" />
        <div className="w-9" />
      </div>

      {/* Account context strip — reminds user which account is being unlocked */}
      <div className="mx-6 flex items-center gap-3 rounded-2xl p-3 shadow-sm"
           style={{ background: "var(--surface)" }}>
        <Avatar
          initials={initials(mockUser.name)}
          bg="linear-gradient(135deg, var(--primary), #6aa3ff)"
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold leading-tight">
            {mockUser.name}
          </div>
          <div
            className="font-mono text-[11px]"
            style={{ color: "var(--text-2)" }}
          >
            {mockUser.phone.replace(/(\d{3})\s*$/, "***")}
          </div>
        </div>
        <Link
          href="/sign-in"
          className="text-[11px] font-medium"
          style={{ color: "var(--primary)" }}
        >
          Switch
        </Link>
      </div>

      <div className="px-6 pt-4 text-center">
        <h1 className="text-[20px] font-bold tracking-tight">Enter your PIN</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
          6 digits to unlock your account
        </p>
      </div>

      <PinPad
        value={pin}
        error={error}
        onChange={setPin}
        onAccessory={() => setShowBiometric(true)}
      />

      <button
        className="mx-auto mt-3 inline-flex items-center gap-1.5 text-sm font-medium"
        style={{ color: "var(--primary)" }}
        onClick={() => setShowBiometric(true)}
      >
        <Fingerprint className="h-[18px] w-[18px]" />
        Use Face ID / Touch ID
      </button>

      <div className="mb-6 mt-auto text-center">
        <Link
          href="/forgot-pin/phone"
          className="font-medium"
          style={{ color: "var(--primary)" }}
        >
          Forgot PIN?
        </Link>
      </div>

      <BiometricModal
        open={showBiometric}
        onCancel={() => setShowBiometric(false)}
        onSuccess={onBiometricSuccess}
      />
    </div>
  );
}
