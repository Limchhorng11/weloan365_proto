"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";

/**
 * Forgot PIN — Success screen.
 * All other sessions invalidated; user signs in fresh.
 */
export default function ForgotPinSuccessPage() {
  return (
    <Screen>
      <ScreenBody>
        <div className="mt-8 text-center">
          <div
            className="mx-auto mb-5 grid h-[88px] w-[88px] place-items-center rounded-2xl"
            style={{
              background: "rgba(0,196,140,.12)",
              color: "var(--accent)",
            }}
          >
            <CheckCircle className="h-12 w-12" />
          </div>
          <h1 className="text-[24px] font-bold tracking-tight">
            PIN reset successfully
          </h1>
          <p className="mt-2 px-6 text-sm" style={{ color: "var(--text-2)" }}>
            You can now sign in with your new PIN. For your security, all
            previous sessions on other devices have been signed out.
          </p>
        </div>

        <Card
          className="mt-6"
          style={{
            background: "rgba(31,95,255,.05)",
            border: "1px solid rgba(31,95,255,.2)",
          }}
        >
          <div className="text-sm">
            <div className="font-medium">What happens next</div>
            <ul
              className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              <li>Your old PIN no longer works on any device.</li>
              <li>
                Biometric login is preserved — you can still use Face ID / Touch
                ID after one full PIN sign-in.
              </li>
              <li>
                If anything looks wrong, contact support from More → Feedback.
              </li>
            </ul>
          </div>
        </Card>
      </ScreenBody>
      <StickyFooter>
        <Link href="/sign-in" className="btn btn-primary" replace>
          Sign In with New PIN
        </Link>
      </StickyFooter>
    </Screen>
  );
}
