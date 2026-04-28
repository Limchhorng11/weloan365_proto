"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calculator, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

const slides = [
  {
    icon: Zap,
    title: "Fast loan approvals",
    desc: "Apply for a loan in minutes and receive funds within 24 hours. No paperwork hassle.",
  },
  {
    icon: Calculator,
    title: "Plan with EMI calculator",
    desc: "Simulate your loan, see your monthly payments, and pick a term that fits your budget.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & transparent",
    desc: "Your data is protected with bank-grade encryption and Face ID / Touch ID login.",
  },
];

export default function OnboardingPage() {
  const [idx, setIdx] = useState(0);
  const router = useRouter();
  const s = slides[idx];
  const Icon = s.icon;
  const isLast = idx === slides.length - 1;

  return (
    <div
      className="flex h-full flex-col animate-fade-in"
      style={{ background: "#fff" }}
    >
      <div className="px-6 pt-4 text-right">
        <button
          onClick={() => router.replace("/welcome")}
          className="font-medium"
          style={{ color: "var(--primary)" }}
        >
          Skip
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div
          className="mb-8 grid h-60 w-60 place-items-center rounded-full"
          style={{
            background: "linear-gradient(135deg, var(--primary-50), #d6e4ff)",
            color: "var(--primary)",
          }}
        >
          <Icon className="h-24 w-24" />
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight">{s.title}</h2>
        <p
          className="text-center text-sm leading-relaxed"
          style={{ color: "var(--text-2)" }}
        >
          {s.desc}
        </p>
      </div>

      <div className="my-6 flex justify-center gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all"
            style={{
              width: i === idx ? 24 : 8,
              background: i === idx ? "var(--primary)" : "var(--border-strong)",
            }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2.5 px-6 pb-8">
        {isLast ? (
          <Link href="/welcome" className="btn btn-primary">
            Get Started
          </Link>
        ) : (
          <Button onClick={() => setIdx(idx + 1)}>Next</Button>
        )}
        <Link href="/sign-up/phone" className="btn btn-ghost">
          Create an account
        </Link>
      </div>
    </div>
  );
}
