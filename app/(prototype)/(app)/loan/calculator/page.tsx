"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import { calculateEmi } from "@/lib/utils/emi";
import { useToast } from "@/lib/hooks/useToast";

type Currency = "USD" | "KHR";
type Method = "declining" | "flat";

const KHR_RATE = 4100; // mock USD→KHR conversion

const fmt = (n: number, c: Currency) => {
  const value = c === "KHR" ? n * KHR_RATE : n;
  const opts =
    c === "KHR"
      ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
      : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  const symbol = c === "KHR" ? "៛" : "$";
  return symbol + value.toLocaleString("en-US", opts);
};

const fmtShort = (n: number, c: Currency) => {
  const value = c === "KHR" ? n * KHR_RATE : n;
  const symbol = c === "KHR" ? "៛" : "$";
  return symbol + Math.round(value).toLocaleString("en-US");
};

/** Loan Calculator (Workshop ref: Session 2.F3 — currency + method). */
export default function LoanCalculatorPage() {
  const toast = useToast();
  const [amount, setAmount] = useState(2000);
  const [term, setTerm] = useState(12);
  const [rate, setRate] = useState(1.2);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [method, setMethod] = useState<Method>("declining");

  // Calculations
  const declining = calculateEmi(amount, term, rate);
  const flatInterestPerMonth = (amount * (rate / 100));
  const flatTotal = amount + flatInterestPerMonth * term;
  const flatEmi = flatTotal / term;

  const emi = method === "flat" ? flatEmi : declining.emi;
  const total = method === "flat" ? flatTotal : declining.total;
  const interest = method === "flat" ? flatInterestPerMonth * term : declining.interest;

  const preview = Array.from({ length: Math.min(6, term) }, (_, i) => {
    if (method === "flat") {
      const principalPart = amount / term;
      return {
        month: i + 1,
        principal: principalPart,
        interest: flatInterestPerMonth,
        pay: flatEmi,
      };
    }
    // declining: simple approximation per month
    const principalPart = amount / term;
    const interestPart = (amount - principalPart * i) * (rate / 100);
    return {
      month: i + 1,
      principal: principalPart,
      interest: interestPart,
      pay: principalPart + interestPart,
    };
  });

  return (
    <Screen>
      <NavHeader
        title="Loan Calculator"
        right={
          <div className="flex gap-1">
            <button
              className="grid h-9 w-9 place-items-center rounded-[10px]"
              onClick={() => toast("Share simulation link copied", "success")}
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              className="grid h-9 w-9 place-items-center rounded-[10px]"
              onClick={() => toast("Schedule exported as PDF", "success")}
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        }
      />
      <ScreenBody>
        <div className="mb-3 flex gap-2">
          <Segmented
            value={currency}
            onChange={setCurrency}
            options={[
              { value: "USD", label: "USD ($)" },
              { value: "KHR", label: "KHR (៛)" },
            ]}
          />
        </div>
        <div className="mb-4">
          <Segmented
            value={method}
            onChange={setMethod}
            options={[
              { value: "declining", label: "Declining" },
              { value: "flat", label: "Flat" },
            ]}
          />
        </div>

        <div
          className="mb-4 rounded-2xl p-5 text-white"
          style={{ background: "linear-gradient(135deg, var(--primary), #6aa3ff)" }}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs opacity-85">Estimated monthly payment</div>
            <span
              className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: "rgba(255,255,255,.2)" }}
            >
              {method}
            </span>
          </div>
          <div className="mt-1 text-[30px] font-bold">{fmt(emi, currency)}</div>
          <div
            className="mt-4 grid grid-cols-2 gap-3 border-t pt-4"
            style={{ borderColor: "rgba(255,255,255,.2)" }}
          >
            <div>
              <small className="block text-[11px] opacity-80">Total interest</small>
              <b className="text-[15px] font-semibold">{fmt(interest, currency)}</b>
            </div>
            <div>
              <small className="block text-[11px] opacity-80">Total payable</small>
              <b className="text-[15px] font-semibold">{fmt(total, currency)}</b>
            </div>
          </div>
        </div>

        <SectionTitle>Amount — {fmtShort(amount, currency)}</SectionTitle>
        <Card>
          <input
            type="range"
            min={500}
            max={50000}
            step={100}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-brand"
          />
          <div className="mt-2 flex justify-between text-xs" style={{ color: "var(--text-2)" }}>
            <span>{fmtShort(500, currency)}</span>
            <span>{fmtShort(50000, currency)}</span>
          </div>
        </Card>

        <SectionTitle>Term — {term} months</SectionTitle>
        <Card>
          <input
            type="range"
            min={3}
            max={60}
            step={1}
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="w-full accent-brand"
          />
          <div className="mt-2 flex justify-between text-xs" style={{ color: "var(--text-2)" }}>
            <span>3 mo</span>
            <span>60 mo</span>
          </div>
        </Card>

        <SectionTitle>Interest rate — {rate.toFixed(2)}% / mo</SectionTitle>
        <Card>
          <input
            type="range"
            min={0.5}
            max={2.5}
            step={0.05}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-brand"
          />
          <div className="mt-2 flex justify-between text-xs" style={{ color: "var(--text-2)" }}>
            <span>0.5%</span>
            <span>2.5%</span>
          </div>
        </Card>

        <Card className="mt-4">
          <h4 className="mb-2.5 text-sm font-semibold">
            Repayment preview (first 6 months)
          </h4>
          <div
            className="mb-1.5 grid grid-cols-[40px_1fr_1fr_1fr] gap-2 text-[11px] uppercase tracking-wider"
            style={{ color: "var(--text-3)" }}
          >
            <span>#</span>
            <span>Principal</span>
            <span>Interest</span>
            <span className="text-right">Pay</span>
          </div>
          {preview.map((r) => (
            <div
              key={r.month}
              className="grid grid-cols-[40px_1fr_1fr_1fr] gap-2 border-b border-dashed py-1.5 text-[13px] last:border-b-0"
              style={{ borderColor: "var(--border)" }}
            >
              <span style={{ color: "var(--text-2)" }}>{r.month}</span>
              <span>{fmt(r.principal, currency)}</span>
              <span style={{ color: "var(--text-2)" }}>{fmt(r.interest, currency)}</span>
              <span className="text-right font-semibold">{fmt(r.pay, currency)}</span>
            </div>
          ))}
        </Card>

        <p className="mt-3 text-xs" style={{ color: "var(--text-3)" }}>
          {method === "flat"
            ? "Flat-rate: interest is calculated once on the original amount and split equally."
            : "Declining-balance: interest is calculated on the remaining principal each month — usually cheaper overall."}
        </p>
      </ScreenBody>
      <StickyFooter>
        <Link href="/loan/products" className="btn btn-primary">
          Choose a Loan Product
        </Link>
      </StickyFooter>
    </Screen>
  );
}
