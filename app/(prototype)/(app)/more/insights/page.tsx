"use client";

import { Lightbulb } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { insights } from "@/lib/mock";
import { formatMoney } from "@/lib/utils/format";

export default function InsightsPage() {
  const pct = (insights.score - 300) / (850 - 300);
  const angle = 180 - pct * 180;
  const r = 90;
  const cx = 110;
  const cy = 110;
  const endX = cx + r * Math.cos((angle * Math.PI) / 180);
  const endY = cy - r * Math.sin((angle * Math.PI) / 180);
  const totalSpend = insights.spendingBreakdown.reduce((t, x) => t + x.value, 0);

  return (
    <Screen>
      <NavHeader title="Credit & Insights" />
      <ScreenBody>
        <Card className="text-center">
          <div className="text-sm" style={{ color: "var(--text-2)" }}>
            Your credit score
          </div>
          <div className="relative mx-auto h-[140px] w-[220px]">
            <svg viewBox="0 0 220 140" className="h-full w-full">
              <path
                d="M 20 110 A 90 90 0 0 1 200 110"
                stroke="#e5e7eb"
                strokeWidth={14}
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={`M 20 110 A 90 90 0 ${pct > 0.5 ? 1 : 0} 1 ${endX.toFixed(1)} ${endY.toFixed(1)}`}
                stroke="url(#grad)"
                strokeWidth={14}
                fill="none"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff4d5e" />
                  <stop offset="50%" stopColor="#ff9f1c" />
                  <stop offset="100%" stopColor="#00c48c" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-x-0 bottom-0 text-center">
              <div className="text-[34px] font-bold">{insights.score}</div>
              <div className="text-xs" style={{ color: "var(--text-2)" }}>
                {insights.grade} · Top 30%
              </div>
            </div>
          </div>
          <div
            className="flex justify-between px-3 text-xs"
            style={{ color: "var(--text-2)" }}
          >
            <span>300 Poor</span>
            <span>850 Excellent</span>
          </div>
        </Card>

        <SectionTitle>Your profile</SectionTitle>
        <Card>
          <div className="kv-row">
            <span>Eligible loan amount</span>
            <span>{formatMoney(insights.eligibleAmount)}</span>
          </div>
          <div className="kv-row">
            <span>Monthly obligation</span>
            <span>{formatMoney(insights.monthlyObligation)}</span>
          </div>
          <div className="kv-row">
            <span>Debt-to-income</span>
            <span>21%</span>
          </div>
          <div className="kv-row">
            <span>On-time payments</span>
            <span>100%</span>
          </div>
        </Card>

        <SectionTitle>Monthly outflow</SectionTitle>
        <Card>
          {insights.spendingBreakdown.map((b) => (
            <div key={b.label} className="mb-2 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded"
                  style={{ background: b.color }}
                />
                {b.label}
              </span>
              <b>{formatMoney(b.value)}</b>
            </div>
          ))}
          <div className="mt-3 flex h-1.5 overflow-hidden rounded-full">
            {insights.spendingBreakdown.map((b) => (
              <span
                key={b.label}
                style={{
                  width: `${(b.value / totalSpend) * 100}%`,
                  background: b.color,
                  height: "100%",
                }}
              />
            ))}
          </div>
        </Card>

        <SectionTitle>Insights</SectionTitle>
        <Card>
          {insights.tips.map((t) => (
            <div key={t} className="mb-2.5 flex items-start gap-2.5">
              <Lightbulb
                className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
                style={{ color: "var(--warn)" }}
              />
              <span className="text-sm">{t}</span>
            </div>
          ))}
        </Card>
      </ScreenBody>
    </Screen>
  );
}
