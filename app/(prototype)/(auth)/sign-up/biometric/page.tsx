"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Fingerprint, ScanFace, Zap } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BiometricModal } from "@/components/sheets/BiometricModal";
import { useToast } from "@/lib/hooks/useToast";
import { useAuthStore } from "@/stores/auth";

/**
 * Biometric Setup (Workshop ref: Session 1.F1, screen 7).
 * Last step of sign-up — user enables Face ID / Touch ID, then lands on Home.
 */
export default function BiometricSetupPage() {
  const router = useRouter();
  const toast = useToast();
  const signIn = useAuthStore((s) => s.signIn);
  const [showModal, setShowModal] = useState(false);

  const finish = (msg: string) => {
    toast(msg, "success");
    signIn();
    router.replace("/home");
  };

  const onEnable = () => setShowModal(true);
  const onSuccess = () => {
    setShowModal(false);
    finish("Face ID enabled. Welcome to Weloan365!");
  };
  const onSkip = () => finish("Welcome to Weloan365!");

  return (
    <Screen>
      <NavHeader title="Faster Sign-In" back={false} />
      <ScreenBody>
        <div className="px-2 pt-6 text-center">
          <div
            className="mx-auto mb-5 grid h-[88px] w-[88px] place-items-center rounded-2xl"
            style={{
              background: "var(--primary-50)",
              color: "var(--primary)",
            }}
          >
            <ScanFace className="h-12 w-12" />
          </div>
          <h1 className="text-[24px] font-bold tracking-tight">
            Sign in with Face ID
          </h1>
          <p
            className="mx-2 mt-2 text-sm leading-relaxed"
            style={{ color: "var(--text-2)" }}
          >
            Use Face ID for a faster, more secure way to access Weloan365.
            Your PIN remains as a backup.
          </p>
        </div>

        <h3 className="section-title">Why enable biometric?</h3>
        <Card>
          {[
            {
              icon: Zap,
              title: "Faster access",
              desc: "Sign in in under a second — no PIN typing.",
            },
            {
              icon: Fingerprint,
              title: "More secure",
              desc: "Biometric data stays on your device, never on our servers.",
            },
            {
              icon: ScanFace,
              title: "PIN still works",
              desc: "If biometrics fail, your 6-digit PIN gets you in.",
            },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="mb-3 flex items-start gap-3 last:mb-0">
                <div
                  className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px]"
                  style={{
                    background: "var(--primary-50)",
                    color: "var(--primary)",
                  }}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <div className="text-sm">
                  <div className="font-medium">{b.title}</div>
                  <div className="mt-0.5" style={{ color: "var(--text-2)" }}>
                    {b.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </Card>

        <p className="mt-3 text-xs" style={{ color: "var(--text-3)" }}>
          You can change this anytime under <b>More → Account Security</b>.
        </p>
      </ScreenBody>
      <StickyFooter>
        <div className="flex flex-col gap-2">
          <Button
            onClick={onEnable}
            leading={<ScanFace className="h-[18px] w-[18px]" />}
          >
            Enable Face ID
          </Button>
          <Button variant="ghost" onClick={onSkip}>
            Skip for now
          </Button>
        </div>
      </StickyFooter>

      <BiometricModal
        open={showModal}
        onCancel={() => setShowModal(false)}
        onSuccess={onSuccess}
      />
    </Screen>
  );
}
