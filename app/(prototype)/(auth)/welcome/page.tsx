"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";

type Lang = "km" | "en" | "ko";

const langs: { value: Lang; label: string; native: string; flag: string }[] = [
  { value: "km", label: "Khmer",   native: "ភាសាខ្មែរ", flag: "🇰🇭" },
  { value: "en", label: "English", native: "English",     flag: "🇬🇧" },
  { value: "ko", label: "Korean",  native: "한국어",      flag: "🇰🇷" },
];

/**
 * Welcome / Language Toggle (Workshop ref: Session 1.F1, screen 3).
 *
 * **First-time only screen.** Shown right after onboarding for new installs.
 * Returning users (already have an account on the device) bypass this screen
 * and go straight to /sign-in.
 *
 * Because only first-time users land here, the only CTA is "Get Started" →
 * sign-up. There is no "Sign In" button on this screen.
 */
export default function WelcomePage() {
  const [lang, setLang] = useState<Lang>("km");

  return (
    <Screen>
      <ScreenBody>
        <div className="px-2 pt-8 text-center">
          <div
            className="mx-auto mb-5 grid h-[88px] w-[88px] place-items-center rounded-2xl text-[40px] font-extrabold text-white"
            style={{
              background: "linear-gradient(135deg, var(--primary), #6aa3ff)",
              boxShadow: "0 8px 24px rgba(31,95,255,.25)",
            }}
          >
            W
          </div>
          <h1 className="text-[26px] font-bold tracking-tight">
            Welcome to Weloan365
          </h1>
          <p
            className="mx-2 mt-2 text-sm leading-relaxed"
            style={{ color: "var(--text-2)" }}
          >
            Let&apos;s get you set up. First, pick your language — you can
            change it later in App Settings.
          </p>
        </div>

        <h3 className="section-title mt-8">Choose your language</h3>
        <div className="flex flex-col gap-2.5">
          {langs.map((l) => {
            const active = l.value === lang;
            return (
              <button
                key={l.value}
                onClick={() => setLang(l.value)}
                className="flex items-center gap-3.5 rounded-2xl p-4 text-left transition"
                style={{
                  background: "var(--surface)",
                  border: active
                    ? "2px solid var(--primary)"
                    : "1.5px solid var(--border)",
                  boxShadow: active
                    ? "0 8px 24px rgba(31,95,255,.12)"
                    : "0 1px 2px rgba(16,24,40,.06)",
                }}
              >
                <span className="text-[28px]">{l.flag}</span>
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold">
                    {l.native}
                  </span>
                  {l.native !== l.label && (
                    <span
                      className="block text-xs"
                      style={{ color: "var(--text-2)" }}
                    >
                      {l.label}
                    </span>
                  )}
                </span>
                {active && (
                  <span
                    className="grid h-7 w-7 place-items-center rounded-full text-white"
                    style={{ background: "var(--primary)" }}
                  >
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <Card
          className="mt-6"
          style={{
            background: "rgba(31,95,255,.05)",
            border: "1px solid rgba(31,95,255,.15)",
          }}
        >
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--text-2)" }}
          >
            🇰🇭 ភាសាខ្មែរ and 🇰🇷 한국어 will be available at launch. The
            prototype itself is in English for the workshops.
          </p>
        </Card>
      </ScreenBody>
      <StickyFooter>
        <Link href="/sign-up/phone" className="btn btn-primary">
          Get Started
        </Link>
      </StickyFooter>
    </Screen>
  );
}
