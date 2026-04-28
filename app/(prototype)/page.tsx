"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Splash screen — shown briefly on first load, then redirects to onboarding.
 */
export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const t = window.setTimeout(() => router.replace("/onboarding"), 1600);
    return () => window.clearTimeout(t);
  }, [router]);

  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-4 text-white"
      style={{
        background: "linear-gradient(160deg, #1f5fff 0%, #0a2f8a 100%)",
      }}
    >
      <div
        className="grid h-[100px] w-[100px] place-items-center rounded-[28px] text-5xl font-extrabold text-white backdrop-blur"
        style={{
          background: "rgba(255,255,255,.15)",
          animation: "pulse-device 2s ease-in-out infinite",
        }}
      >
        W
      </div>
      <div className="text-[28px] font-extrabold tracking-tight">Weloan365</div>
      <div className="text-sm opacity-80">Your financial partner, always on</div>
      <div
        className="mt-6 h-[3px] w-[120px] overflow-hidden rounded-full"
        style={{ background: "rgba(255,255,255,.2)" }}
      >
        <div
          className="h-full w-[40%] rounded-full"
          style={{ background: "#fff", animation: "loading 1.5s infinite" }}
        />
      </div>
    </div>
  );
}
