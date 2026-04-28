"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavHeader } from "@/components/ui/NavHeader";
import { PinPad } from "@/components/domain/auth/PinPad";

/**
 * The new PIN is stashed in sessionStorage so the confirm step can read it
 * without a shared store.
 */
export default function CreatePinPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (pin.length !== 6) return;
    sessionStorage.setItem("wl:new-pin", pin);
    router.push("/sign-up/confirm-pin");
  }, [pin, router]);

  return (
    <div className="flex h-full flex-col" style={{ background: "var(--bg)" }}>
      <NavHeader title="Create PIN" />
      <div className="px-6 pt-4">
        <h1 className="text-[26px] font-bold tracking-tight">
          Create a 6-digit PIN
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "var(--text-2)" }}>
          This PIN will be used to sign in to your account.
        </p>
      </div>
      <PinPad value={pin} onChange={setPin} accessory={null} />
    </div>
  );
}
