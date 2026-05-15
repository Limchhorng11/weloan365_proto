"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageSquare, Smartphone } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/lib/hooks/useToast";
import { mockUser } from "@/lib/mock";

/**
 * Sign In — Phone & OTP, Step 1 (Workshop ref: Session 1.F2 / new method 1).
 *
 * The saved phone is pre-selected for the saved account; user can either
 * accept it or override with a different number. Tapping "Send OTP" routes
 * to /sign-in/otp.
 */
export default function SignInPhonePage() {
  const router = useRouter();
  const toast = useToast();
  const [useDifferent, setUseDifferent] = useState(false);
  const [phone, setPhone] = useState("12 345 678");

  const send = () => {
    toast(`Code sent to ${mockUser.phone}`, "info");
    router.push("/sign-in/otp");
  };

  return (
    <Screen>
      <NavHeader title="Sign in with phone" />
      <ScreenBody>
        <div className="px-2 pt-4 text-center">
          <div
            className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl"
            style={{
              background: "var(--primary-50)",
              color: "var(--primary)",
            }}
          >
            <Smartphone className="h-7 w-7" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight">
            Send a code to your phone
          </h1>
          <p
            className="mx-2 mt-1.5 text-sm leading-relaxed"
            style={{ color: "var(--text-2)" }}
          >
            We&apos;ll text a 6-digit code. Enter it on the next screen to
            sign in.
          </p>
        </div>

        {!useDifferent ? (
          <>
            <Card className="mt-6">
              <div
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)" }}
              >
                Send code to
              </div>
              <div className="mt-1.5 flex items-center gap-2.5">
                <span className="text-[22px]">🇰🇭</span>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[16px] font-semibold leading-tight">
                    {mockUser.phone}
                  </div>
                  <div
                    className="text-[11px]"
                    style={{ color: "var(--text-2)" }}
                  >
                    Saved number for {mockUser.name}
                  </div>
                </div>
                <span
                  className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                  style={{
                    background: "rgba(0,196,140,.12)",
                    color: "var(--accent)",
                  }}
                >
                  Verified
                </span>
              </div>
            </Card>

            <button
              onClick={() => setUseDifferent(true)}
              className="mt-3 text-[13px] font-medium"
              style={{ color: "var(--primary)" }}
            >
              Use a different phone number
            </button>
          </>
        ) : (
          <>
            <div className="mt-6">
              <Input
                label="Phone number"
                prefix={<span>🇰🇭 +855</span>}
                type="tel"
                inputMode="numeric"
                placeholder="12 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button
              onClick={() => setUseDifferent(false)}
              className="mt-3 text-[13px] font-medium"
              style={{ color: "var(--primary)" }}
            >
              ← Use saved number instead
            </button>
          </>
        )}

        <Card
          className="mt-4"
          style={{
            background: "rgba(31,95,255,.05)",
            border: "1px solid rgba(31,95,255,.15)",
          }}
        >
          <div className="flex items-start gap-2.5">
            <MessageSquare
              className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
              style={{ color: "var(--primary)" }}
            />
            <div className="text-xs leading-relaxed">
              Standard SMS rates may apply. The code expires after 5 minutes —
              if it doesn&apos;t arrive, you can resend on the next screen.
            </div>
          </div>
        </Card>
      </ScreenBody>
      <StickyFooter>
        <Button onClick={send}>Send OTP</Button>
      </StickyFooter>
    </Screen>
  );
}
