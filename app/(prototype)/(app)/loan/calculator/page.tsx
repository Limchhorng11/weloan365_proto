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

  // Deterministic preview dates — anchored to today + N months so the
  // calculator shows realistic upcoming dates in the Due Date column.
  const previewStart = new Date();
  const fmtPreviewDate = (i: number) => {
    const d = new Date(previewStart);
    d.setMonth(d.getMonth() + i + 1);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const preview = Array.from({ length: Math.min(6, term) }, (_, i) => {
    const date = fmtPreviewDate(i);
    if (method === "flat") {
      const principalPart = amount / term;
      return {
        month: i + 1,
        date,
        principal: principalPart,
        interest: flatInterestPerMonth,
        fee: 0,
        pay: flatEmi,
      };
    }
    // declining: simple approximation per month
    const principalPart = amount / term;
    const interestPart = (amount - principalPart * i) * (rate / 100);
    return {
      month: i + 1,
      date,
      principal: principalPart,
      interest: interestPart,
      fee: 0,
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

        <h4 className="mb-2 mt-5 text-sm font-semibold">
          Repayment preview (first 6 months)
        </h4>

        {/* Column-layout matches the live Repayment Table on the loan
            detail screen: Due Date · Principal · Interest · Fee/Penalty ·
            Total. Fee/Penalty is always $0.00 on a forecast — included so
            the columns line up with the actual table customers see later. */}
        <div
          className="overflow-hidden rounded-2xl shadow-sm"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-[1.4fr_1fr_0.9fr_0.9fr_1.1fr] gap-1.5 px-2.5 py-2 text-[9.5px] font-bold uppercase tracking-wider"
            style={{
              background: "var(--surface-2)",
              color: "var(--text-2)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span>Due Date</span>
            <span className="text-right">Principal</span>
            <span className="text-right">Interest</span>
            <span className="text-right">Fee/Penalty</span>
            <span className="text-right">Total</span>
          </div>

          {/* Body */}
          {preview.map((r) => (
            <div
              key={r.month}
              className="relative grid grid-cols-[1.4fr_1fr_0.9fr_0.9fr_1.1fr] items-center gap-1.5 border-b px-2.5 py-2.5 text-[11.5px] last:border-b-0"
              style={{ borderColor: "var(--border)" }}
            >
              {/* Status stripe — muted gray for all forecast rows */}
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-1"
                style={{ background: "var(--border-strong)" }}
              />
              <div className="min-w-0 pl-1">
                <div
                  className="text-[9px] font-bold"
                  style={{ color: "var(--text-3)" }}
                >
                  #{r.month}
                </div>
                <div className="font-semibold leading-tight">{r.date}</div>
                <div
                  className="text-[9.5px] uppercase tracking-wider"
                  style={{ color: "var(--text-3)" }}
                >
                  Forecast
                </div>
              </div>
              <span className="text-right font-mono tabular-nums">
                {fmt(r.principal, currency)}
              </span>
              <span
                className="text-right font-mono tabular-nums"
                style={{ color: "var(--text-2)" }}
              >
                {fmt(r.interest, currency)}
              </span>
              <span
                className="text-right font-mono tabular-nums"
                style={{ color: "var(--text-3)" }}
              >
                {fmt(r.fee, currency)}
              </span>
              <span className="text-right font-mono font-bold tabular-nums">
                {fmt(r.pay, currency)}
              </span>
            </div>
          ))}
        </div>

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
