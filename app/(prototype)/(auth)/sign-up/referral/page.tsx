"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { OtpBoxes } from "@/components/domain/auth/OtpBoxes";
import { StaffConfirmSheet } from "@/components/sheets/StaffConfirmSheet";
import { useSheet } from "@/lib/hooks/useSheet";
import { useToast } from "@/lib/hooks/useToast";
import { useAuthStore } from "@/stores/auth";
import { getStaffByCode, staff } from "@/lib/mock";

/**
 * Sign Up — Referral code (Workshop ref: Session 1.F1, "Reference Program").
 *
 * Optional final step of sign-up. Customer enters a 5-digit code their
 * Weloan365 advisor (Credit Officer / Branch Manager / etc.) gave them.
 * When all 5 digits are typed, a bottom sheet pops up with the matching
 * staff profile so the customer can verify before linking.
 *
 * Demo codes: 12345 (Lina) · 67890 (Dara) · 24680 (Sopheap) · 13579 (Bopha)
 */
export default function ReferralPage() {
  const router = useRouter();
  const { open, close } = useSheet();
  const toast = useToast();
  const signIn = useAuthStore((s) => s.signIn);

  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  // Watch for a full 5-digit code → resolve to staff → open confirmation sheet.
  useEffect(() => {
    if (code.length !== 5) return;
    const match = getStaffByCode(code);
    if (match) {
      open(
        <StaffConfirmSheet
          staff={match}
          onConfirm={() => {
            close();
            toast(`Linked to ${match.name} (${match.roleShort})`, "success");
            signIn();
            router.replace("/home");
          }}
          onReject={() => {
            close();
            setCode("");
          }}
        />,
      );
    } else {
      setError(true);
      toast("That code isn't recognised. Check with your advisor.", "error");
      const t = window.setTimeout(() => {
        setCode("");
        setError(false);
      }, 700);
      return () => window.clearTimeout(t);
    }
  }, [code, open, close, router, signIn, toast]);

  const skip = () => {
    toast("Welcome to Weloan365!", "success");
    signIn();
    router.replace("/home");
  };

  return (
    <Screen>
      <NavHeader
        title="Referral Code"
        back={false}
        right={
          <button
            onClick={skip}
            className="text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            Skip
          </button>
        }
      />
      <ScreenBody>
        <div className="px-2 pt-4 text-center">
          <div
            className="mx-auto mb-3 grid h-[64px] w-[64px] place-items-center rounded-2xl"
            style={{
              background: "linear-gradient(135deg, var(--primary-50), #d6e4ff)",
              color: "var(--primary)",
            }}
          >
            <UserPlus className="h-8 w-8" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight">
            Were you referred by our staff?
          </h1>
          <p
            className="mx-2 mt-1.5 text-sm leading-relaxed"
            style={{ color: "var(--text-2)" }}
          >
            Enter the <b>5-digit code</b> your Credit Officer or branch staff
            gave you. We&apos;ll link them as your personal advisor.
          </p>
        </div>

        <OtpBoxes
          length={5}
          value={code}
          onChange={setCode}
          error={error}
        />

        <Card
          className="mt-4"
          style={{
            background: "rgba(31,95,255,.05)",
            border: "1px solid rgba(31,95,255,.15)",
          }}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider"
               style={{ color: "var(--text-3)" }}>
            Prototype: try these codes
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
            {staff.map((s) => (
              <button
                key={s.code}
                onClick={() => setCode(s.code)}
                className="flex items-center gap-2 rounded-lg p-2 text-left transition active:scale-[.98]"
                style={{ background: "var(--surface)" }}
              >
                <span
                  className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: s.color }}
                >
                  {s.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono font-semibold">
                    {s.code}
                  </span>
                  <span
                    className="block truncate text-[10px]"
                    style={{ color: "var(--text-3)" }}
                  >
                    {s.name} · {s.roleShort}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Card>

        <p
          className="mt-3 text-center text-[11px] leading-relaxed"
          style={{ color: "var(--text-3)" }}
        >
          Don&apos;t have a code? Tap <b>Skip</b> — you can still sign up. We&apos;ll
          assign an advisor automatically.
        </p>
      </ScreenBody>
      <StickyFooter>
        <Button variant="ghost" onClick={skip}>
          Skip — I don&apos;t have a code
        </Button>
      </StickyFooter>
    </Screen>
  );
}
