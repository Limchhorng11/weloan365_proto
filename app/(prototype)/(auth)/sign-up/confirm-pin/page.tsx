"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavHeader } from "@/components/ui/NavHeader";
import { PinPad } from "@/components/domain/auth/PinPad";
import { useToast } from "@/lib/hooks/useToast";

export default function ConfirmPinPage() {
  const router = useRouter();
  const toast = useToast();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (pin.length !== 6) return;
    const expected = sessionStorage.getItem("wl:new-pin");
    if (pin === expected) {
      sessionStorage.removeItem("wl:new-pin");
      router.push("/sign-up/biometric");
    } else {
      setError(true);
      toast("PINs don't match. Please try again.", "error");
      const t = window.setTimeout(() => {
        setPin("");
        setError(false);
      }, 600);
      return () => window.clearTimeout(t);
    }
  }, [pin, router, toast]);

  return (
    <div className="flex h-full flex-col" style={{ background: "var(--bg)" }}>
      <NavHeader title="Confirm PIN" />
      <div className="px-6 pt-4">
        <h1 className="text-[26px] font-bold tracking-tight">Confirm your PIN</h1>
        <p className="mt-1.5 text-sm" style={{ color: "var(--text-2)" }}>
          Please enter your 6-digit PIN again to confirm.
        </p>
      </div>
      <PinPad value={pin} onChange={setPin} error={error} accessory={null} />
    </div>
  );
}
