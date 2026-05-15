"use client";

import Link from "next/link";
import { Moon, RotateCw } from "lucide-react";
import { useThemeStore } from "@/stores/theme";

interface QuickLink {
  label: string;
  href: string;
  flowRef?: string;
}

const QUICK_LINK_GROUPS: { title: string; links: QuickLink[] }[] = [
  {
    title: "Auth & Onboarding",
    links: [
      { label: "Splash → Onboarding", href: "/" },
      { label: "Welcome / Language", href: "/welcome", flowRef: "1.F1" },
      { label: "Sign In — Account (2 methods)", href: "/sign-in", flowRef: "1.F2" },
      { label: "Sign In — Phone (OTP step 1)", href: "/sign-in/phone", flowRef: "1.F2" },
      { label: "Sign In — OTP (step 2)", href: "/sign-in/otp", flowRef: "1.F2" },
      { label: "Sign In — QR scan", href: "/sign-in/qr", flowRef: "1.F2" },
      { label: "Sign In — PIN (legacy)", href: "/sign-in/pin", flowRef: "1.F2" },
      { label: "Sign Up — Phone", href: "/sign-up/phone", flowRef: "1.F1" },
      { label: "Sign Up — Biometric", href: "/sign-up/biometric", flowRef: "1.F1" },
      { label: "Sign Up — Referral code", href: "/sign-up/referral", flowRef: "1.F1" },
      { label: "Forgot PIN — Recovery", href: "/forgot-pin/phone", flowRef: "1.F3" },
    ],
  },
  {
    title: "Home & Loan Discovery",
    links: [
      { label: "Home", href: "/home", flowRef: "2.F1" },
      { label: "Loan Products", href: "/loan/products", flowRef: "2.F2" },
      { label: "Loan Detail", href: "/loan/products/p1" },
      { label: "Loan Request (5-step)", href: "/loan/products/p1/request", flowRef: "2.F5" },
      { label: "Calculator (USD/KHR · flat/declining)", href: "/loan/calculator", flowRef: "2.F3" },
      { label: "Consult — Step 1 (topic)", href: "/loan/consultation", flowRef: "2.F4" },
      { label: "Consult — Step 2 (branch)", href: "/loan/consultation/branch", flowRef: "2.F4" },
      { label: "Consult — Step 3 (time)", href: "/loan/consultation/time", flowRef: "2.F4" },
      { label: "Consult — Step 4 (confirmed)", href: "/loan/consultation/confirmed", flowRef: "2.F4" },
      { label: "Promo Detail", href: "/promo/edu-low-rate", flowRef: "2.F6" },
      { label: "News list", href: "/news" },
      { label: "News detail", href: "/news/n-2026-04-25" },
    ],
  },
  {
    title: "My Loans",
    links: [
      { label: "Active Loan (default)", href: "/my-loan", flowRef: "3.F2" },
      { label: "Progress · Progress", href: "/my-loan?tab=progress&sub=progress", flowRef: "3.F1" },
      { label: "Progress · Guarantor", href: "/my-loan?tab=progress&sub=guarantor", flowRef: "3.F3" },
      { label: "Progress · Rejected", href: "/my-loan?tab=progress&sub=rejected", flowRef: "3.F4" },
      { label: "Active loan detail", href: "/my-loan/approved/l3" },
      { label: "Schedule & History", href: "/my-loan/approved/l3/repayment", flowRef: "3.F2" },
      { label: "Overdue loan detail (l7)", href: "/my-loan/approved/l7", flowRef: "3.F2" },
      { label: "Overdue schedule + penalty board", href: "/my-loan/approved/l7/repayment", flowRef: "3.F2" },
      { label: "Progress loan detail", href: "/my-loan/progressing/l1" },
      { label: "Guarantor detail", href: "/my-loan/guarantor/l5" },
      { label: "Rejected detail", href: "/my-loan/rejected/l6" },
    ],
  },
  {
    title: "Chat & More",
    links: [
      { label: "Chat list", href: "/chat", flowRef: "3.F5" },
      { label: "Chat detail", href: "/chat/c1" },
      { label: "Notifications", href: "/more/notifications", flowRef: "3.F6" },
      { label: "Notification Settings", href: "/more/notifications/settings", flowRef: "3.F6" },
      { label: "Referral history", href: "/more/referrals", flowRef: "3.F7" },
      { label: "More menu", href: "/more", flowRef: "3.F7" },
      { label: "Credit & Insights", href: "/more/insights" },
      { label: "User Profile", href: "/more/profile" },
      { label: "Account Security", href: "/more/security" },
      { label: "App Settings", href: "/more/settings" },
      { label: "App Policy", href: "/more/policy" },
      { label: "About Company", href: "/more/about" },
      { label: "Branch Locator", href: "/more/branches" },
      { label: "Blogs list", href: "/more/blogs" },
      { label: "Blog Detail", href: "/more/blogs/bl2", flowRef: "3.F7" },
      { label: "Feedback & Rate", href: "/more/feedback" },
      { label: "Check CBC", href: "/more/cbc" },
    ],
  },
];

/**
 * Dev-only side panel that lets you jump directly to any screen.
 * Hidden on widths below 860px so a real mobile viewport isn't obstructed.
 */
export function SidePanel() {
  const toggleTheme = useThemeStore((s) => s.toggle);

  return (
    <aside
      className="hidden max-h-screen overflow-y-auto border-r px-6 py-7 backdrop-blur md:block"
      style={{
        width: 320,
        background: "rgba(255,255,255,.7)",
        borderColor: "rgba(0,0,0,.06)",
      }}
    >
      <div className="mb-7 flex items-center gap-3">
        <div
          className="grid h-11 w-11 place-items-center rounded-xl text-[22px] font-extrabold text-white shadow-lg"
          style={{
            background: "linear-gradient(135deg, #1f5fff 0%, #6aa3ff 100%)",
          }}
        >
          W
        </div>
        <div>
          <h1 className="text-[17px] font-bold leading-tight">Weloan365</h1>
          <p className="mt-0.5 text-xs text-ink-2">Mobile Prototype · Next.js</p>
        </div>
      </div>

      <section className="mb-6">
        <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-3">
          Jump to screen
        </h3>
        <div className="flex flex-col gap-3">
          {QUICK_LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wider text-ink-3/80">
                {group.title}
              </div>
              <div className="flex flex-col gap-px">
                {group.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-[12.5px] text-ink transition-colors hover:bg-brand/10"
                  >
                    <span className="truncate">{l.label}</span>
                    {l.flowRef && (
                      <span className="ml-2 flex-shrink-0 rounded-sm bg-black/5 px-1 py-px font-mono text-[10px] text-ink-3">
                        {l.flowRef}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-3">
          Device
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 rounded-lg border border-border-strong bg-white px-3 py-2 text-xs hover:bg-surface-2"
          >
            <RotateCw className="h-3.5 w-3.5" /> Restart
          </button>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 rounded-lg border border-border-strong bg-white px-3 py-2 text-xs hover:bg-surface-2"
          >
            <Moon className="h-3.5 w-3.5" /> Theme
          </button>
        </div>
      </section>

      <section>
        <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-3">
          Demo credentials
        </h3>
        <ul className="list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-ink-2">
          <li>Sign-in PIN: <b>123456</b></li>
          <li>OTP (sign-up &amp; reset): <b>123456</b></li>
          <li>Forgot-PIN identity: ID last 4 = <b>6789</b>, DOB = <b>1992-06-15</b></li>
        </ul>

        <h3 className="mb-2.5 mt-4 text-[11px] font-semibold uppercase tracking-wider text-ink-3">
          Tips
        </h3>
        <ul className="list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-ink-2">
          <li>Tap anywhere — every screen is interactive</li>
          <li>Tags like <code className="font-mono">2.F3</code> map to the workshop pack flow IDs</li>
          <li>All data is mocked; no backend calls</li>
        </ul>
      </section>
    </aside>
  );
}
