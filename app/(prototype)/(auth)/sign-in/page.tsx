"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, QrCode, ShieldCheck, Smartphone, UserPlus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { mockUser } from "@/lib/mock";
import { initials } from "@/lib/utils/format";

/**
 * Sign In — Account screen (Workshop ref: Session 1.F2).
 *
 * Two sign-in methods, both leading back to /home on success:
 *   1. Phone + OTP  → /sign-in/phone → /sign-in/otp → /home
 *   2. QR sign-in   → /sign-in/qr  (camera scans QR shown on a paired device)
 *
 * The saved account card at the top confirms which identity will be used.
 * "Sign in to a different account" routes through fresh sign-up.
 */
export default function SignInAccountPage() {
  const maskedPhone = mockUser.phone.replace(/(\d{3})\s*$/, "***");

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
        <div className="px-4 pt-4 text-center">
          <div
            className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl text-[28px] font-extrabold text-white"
            style={{
              background: "linear-gradient(135deg, var(--primary), #6aa3ff)",
              boxShadow: "0 8px 24px rgba(31,95,255,.25)",
            }}
          >
            W
          </div>
          <h1 className="text-[22px] font-bold tracking-tight">Welcome back</h1>
          <p
            className="mx-2 mt-1 text-sm leading-relaxed"
            style={{ color: "var(--text-2)" }}
          >
            Choose how you&apos;d like to sign in.
          </p>
        </div>

        {/* Saved account card */}
        <div
          className="mx-4 mt-5 rounded-2xl p-4 shadow-sm"
          style={{ background: "var(--surface)" }}
        >
          <div className="flex items-center gap-3">
            <Avatar
              size="md"
              initials={initials(mockUser.name)}
              bg="linear-gradient(135deg, var(--primary), #6aa3ff)"
            />
            <div className="min-w-0 flex-1">
              <div
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)" }}
              >
                Signing in as
              </div>
              <div className="truncate text-[15px] font-semibold leading-tight">
                {mockUser.name}
              </div>
              <div
                className="mt-0.5 font-mono text-[11px]"
                style={{ color: "var(--text-2)" }}
              >
                {maskedPhone}
              </div>
            </div>
            <ShieldCheck
              className="h-5 w-5 flex-shrink-0"
              style={{ color: "var(--accent)" }}
            />
          </div>
        </div>

        {/* Method chooser */}
        <h3
          className="mx-4 mt-6 mb-2 text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-3)" }}
        >
          Choose sign-in method
        </h3>

        <div className="mx-4 flex flex-col gap-2.5">
          {/* Option 1 — Phone + OTP */}
          <Link
            href="/sign-in/phone"
            className="flex items-center gap-3.5 rounded-2xl p-4 shadow-sm transition active:scale-[.99]"
            style={{
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
            }}
          >
            <div
              className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl"
              style={{
                background: "var(--primary-50)",
                color: "var(--primary)",
              }}
            >
              <Smartphone className="h-[22px] w-[22px]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold">Phone &amp; OTP</div>
              <div
                className="mt-0.5 text-[12px] leading-snug"
                style={{ color: "var(--text-2)" }}
              >
                We&apos;ll send a 6-digit code to your phone.
              </div>
            </div>
            <ChevronRight
              className="h-5 w-5 flex-shrink-0"
              style={{ color: "var(--text-3)" }}
            />
          </Link>

          {/* Option 2 — QR sign-in */}
          <Link
            href="/sign-in/qr"
            className="flex items-center gap-3.5 rounded-2xl p-4 shadow-sm transition active:scale-[.99]"
            style={{
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
            }}
          >
            <div
              className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl"
              style={{
                background: "rgba(0,196,140,.12)",
                color: "var(--accent)",
              }}
            >
              <QrCode className="h-[22px] w-[22px]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-semibold">QR sign-in</span>
                <span
                  className="rounded-full px-1.5 py-px text-[9px] font-bold"
                  style={{
                    background: "rgba(0,196,140,.15)",
                    color: "var(--accent)",
                  }}
                >
                  FAST
                </span>
              </div>
              <div
                className="mt-0.5 text-[12px] leading-snug"
                style={{ color: "var(--text-2)" }}
              >
                Scan a QR shown on weloan365.com or another trusted device.
              </div>
            </div>
            <ChevronRight
              className="h-5 w-5 flex-shrink-0"
              style={{ color: "var(--text-3)" }}
            />
          </Link>
        </div>

        {/* Switch account */}
        <div className="mx-4 mt-5">
          <Link
            href="/sign-up/phone"
            className="flex items-center gap-3 rounded-2xl p-3.5 shadow-sm"
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
        </div>

        <p
          className="mt-5 px-6 text-center text-[11px] leading-relaxed"
          style={{ color: "var(--text-3)" }}
        >
          By signing in you agree to Weloan365&apos;s Terms of Service and
          Privacy Policy.
        </p>
      </ScreenBody>
    </Screen>
  );
}
