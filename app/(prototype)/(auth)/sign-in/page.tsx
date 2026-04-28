"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Fingerprint } from "lucide-react";
import { PinPad } from "@/components/domain/auth/PinPad";
import { BiometricModal } from "@/components/sheets/BiometricModal";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/lib/hooks/useToast";

const DEMO_PIN = "123456";

export default function SignInPage() {
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
          href="/onboarding"
          className="grid h-9 w-9 place-items-center rounded-[10px]"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1" />
        <div className="w-9" />
      </div>

      <div className="px-6 pt-2">
        <div
          className="grid h-14 w-14 place-items-center rounded-2xl text-[28px] font-extrabold text-white"
          style={{
            background: "linear-gradient(135deg, var(--primary), #6aa3ff)",
            boxShadow: "0 8px 24px rgba(31,95,255,.3)",
          }}
        >
          W
        </div>
        <h1 className="mt-3 text-[26px] font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          Enter your 6-digit PIN to unlock your account
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
        <span style={{ color: "var(--text-2)" }}> · </span>
        <Link
          href="/sign-up/phone"
          className="font-medium"
          style={{ color: "var(--primary)" }}
        >
          Create account
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
