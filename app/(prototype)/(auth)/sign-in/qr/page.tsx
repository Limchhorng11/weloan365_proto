"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Image as ImageIcon, QrCode, Zap } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/hooks/useToast";
import { useAuthStore } from "@/stores/auth";

/**
 * Sign In — QR sign-in (Workshop ref: Session 1.F2 / new method 2).
 *
 * Pure visual mockup: a "viewfinder" with corner markers and a swept
 * scan line. The user taps **Simulate scan** to fake a successful
 * detection — in real life the camera would auto-detect.
 *
 * Flow:
 *   Open weloan365.com → "Sign in with mobile" → website shows a QR →
 *   user scans here → website is signed in AND this device is signed in.
 */
export default function SignInQrPage() {
  const router = useRouter();
  const toast = useToast();
  const signIn = useAuthStore((s) => s.signIn);

  const [status, setStatus] = useState<"scanning" | "detected">("scanning");
  const timerRef = useRef<number | null>(null);

  const simulate = () => {
    if (status !== "scanning") return;
    setStatus("detected");
    timerRef.current = window.setTimeout(() => {
      toast("Signed in via QR", "success");
      signIn();
      router.replace("/home");
    }, 900);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <Screen>
      <NavHeader title="QR sign-in" />
      <ScreenBody>
        <p
          className="mb-3 mt-1 text-sm leading-relaxed"
          style={{ color: "var(--text-2)" }}
        >
          Point your camera at the QR code shown on{" "}
          <b>weloan365.com/sign-in</b> (or on a trusted device).
        </p>

        {/* Viewfinder */}
        <div
          className="relative mx-auto aspect-square w-full max-w-[300px] overflow-hidden rounded-3xl"
          style={{
            background:
              "linear-gradient(135deg, #1b1f2b 0%, #2d3241 50%, #1b1f2b 100%)",
          }}
        >
          {/* Faint grid to suggest a viewfinder */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* Centered QR target zone */}
          <div className="absolute inset-12 grid place-items-center">
            {status === "scanning" ? (
              <div className="relative h-full w-full">
                {/* Corner brackets */}
                {[
                  { t: 0, l: 0, br: "0 12px 0 0" }, // top-left
                  { t: 0, r: 0, br: "12px 0 0 0" }, // top-right
                  { b: 0, l: 0, br: "0 0 0 12px" }, // bottom-left
                  { b: 0, r: 0, br: "0 0 12px 0" }, // bottom-right
                ].map((c, i) => (
                  <span
                    key={i}
                    className="absolute h-7 w-7 border-white"
                    style={{
                      top: c.t,
                      left: c.l,
                      right: c.r,
                      bottom: c.b,
                      borderRadius: c.br,
                      borderTopWidth: c.t === 0 ? 3 : 0,
                      borderBottomWidth: c.b === 0 ? 3 : 0,
                      borderLeftWidth: c.l === 0 ? 3 : 0,
                      borderRightWidth: c.r === 0 ? 3 : 0,
                      borderStyle: "solid",
                    }}
                  />
                ))}

                {/* Sweeping scan line */}
                <span
                  className="absolute left-2 right-2 h-[3px] rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, var(--primary), transparent)",
                    boxShadow: "0 0 12px var(--primary)",
                    animation: "qr-sweep 2s ease-in-out infinite",
                  }}
                />

                <QrCode
                  className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 opacity-40 text-white"
                />
              </div>
            ) : (
              <div className="grid h-full w-full place-items-center">
                <div
                  className="grid h-16 w-16 place-items-center rounded-full"
                  style={{
                    background: "rgba(0,196,140,.2)",
                    color: "var(--accent)",
                  }}
                >
                  <CheckCircle2 className="h-9 w-9" />
                </div>
              </div>
            )}
          </div>

          {/* Status caption inside viewfinder */}
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
              style={{
                background:
                  status === "scanning"
                    ? "rgba(255,255,255,.15)"
                    : "rgba(0,196,140,.4)",
                backdropFilter: "blur(8px)",
              }}
            >
              {status === "scanning" ? (
                <>
                  <Zap className="h-3 w-3" /> Scanning…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3" /> QR detected — signing in
                </>
              )}
            </span>
          </div>
        </div>

        {/* Helper */}
        <div className="mt-4 flex flex-col gap-2">
          <Button onClick={simulate} disabled={status !== "scanning"}>
            <QrCode className="h-[18px] w-[18px]" />
            {status === "scanning"
              ? "Simulate scan (demo)"
              : "Detected — signing in…"}
          </Button>
          <button
            onClick={() => toast("Photo library opened (mock)", "info")}
            className="flex items-center justify-center gap-1.5 text-[13px] font-medium"
            style={{ color: "var(--primary)" }}
          >
            <ImageIcon className="h-[14px] w-[14px]" />
            Choose from photos instead
          </button>
        </div>

        <Card
          className="mt-5"
          style={{
            background: "rgba(31,95,255,.05)",
            border: "1px solid rgba(31,95,255,.15)",
          }}
        >
          <div className="text-sm">
            <div className="font-medium">How QR sign-in works</div>
            <ol
              className="mt-2 list-decimal space-y-1.5 pl-5 text-[12px] leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              <li>
                Open <b>weloan365.com/sign-in</b> on a computer or trusted
                device.
              </li>
              <li>The site will show a QR code valid for 60 seconds.</li>
              <li>
                Scan it here — both devices sign in to your saved account
                instantly.
              </li>
            </ol>
          </div>
        </Card>

        <p
          className="mt-3 text-center text-[11px] leading-relaxed"
          style={{ color: "var(--text-3)" }}
        >
          Never scan a QR you didn&apos;t request. Weloan365 will never ask
          for your PIN over the phone or via QR.
        </p>
      </ScreenBody>

      <style jsx>{`
        @keyframes qr-sweep {
          0%,
          100% {
            top: 8%;
            opacity: 0.4;
          }
          50% {
            top: 90%;
            opacity: 1;
          }
        }
      `}</style>
    </Screen>
  );
}
