"use client";

import Link from "next/link";
import { Calculator, HandCoins, PhoneCall, QrCode } from "lucide-react";
import type { ComponentType } from "react";

interface Item {
  label: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
  bg?: string;
  color?: string;
}

/**
 * Home quick actions. "Pay Now" routes to Active Loan rather than opening
 * the payment sheet directly — the user picks the loan they want to pay
 * from the list. This avoids ambiguity when multiple loans are active.
 */
export function QuickActions() {
  const items: Item[] = [
    {
      label: "Apply Loan",
      icon: HandCoins,
      href: "/loan/products",
    },
    {
      label: "Calculator",
      icon: Calculator,
      href: "/loan/calculator",
      bg: "rgba(0,196,140,.12)",
      color: "#00a677",
    },
    {
      label: "Pay Now",
      icon: QrCode,
      href: "/my-loan?tab=active",
      bg: "rgba(255,159,28,.15)",
      color: "#cc7a00",
    },
    {
      label: "Consult",
      icon: PhoneCall,
      href: "/loan/consultation",
      bg: "rgba(255,107,157,.15)",
      color: "#c2185b",
    },
  ];

  return (
    <div
      className="relative z-[5] mx-4 -mt-7 grid grid-cols-4 gap-2 rounded-2xl p-3.5 shadow-md"
      style={{ background: "var(--surface)" }}
    >
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <Link
            key={it.label}
            href={it.href}
            className="flex flex-col items-center gap-1.5 rounded-[10px] px-1 py-2 transition-colors"
          >
            <div
              className="grid h-11 w-11 place-items-center rounded-xl"
              style={{
                background: it.bg ?? "var(--primary-50)",
                color: it.color ?? "var(--primary)",
              }}
            >
              <Icon className="h-[22px] w-[22px]" />
            </div>
            <div
              className="text-center text-[11px] font-medium"
              style={{ color: "var(--text)" }}
            >
              {it.label}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
