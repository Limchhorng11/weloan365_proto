"use client";

import Link from "next/link";
import { Info, Search } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { ProductCard } from "@/components/domain/loan/ProductCard";
import { loanProducts } from "@/lib/mock";
import {
  isProductLockedThisMonth,
  lockedProductIdsThisMonth,
  nextMonthResetLabel,
  REJECTION_LIMIT_PER_MONTH,
} from "@/lib/utils/rejection";

export default function LoanProductsPage() {
  const lockedIds = lockedProductIdsThisMonth();
  const hasLocks = lockedIds.length > 0;

  return (
    <Screen>
      <NavHeader title="Loan Products" />
      <ScreenBody hasTabBar>
        {/* Per-product lock notice — only when at least one product is
            locked. Sits as a soft info banner; other products stay open. */}
        {hasLocks && (
          <div
            className="mb-4 flex items-start gap-3 rounded-2xl p-3"
            style={{
              background: "rgba(255,159,28,.08)",
              border: "1px solid rgba(255,159,28,.25)",
            }}
          >
            <Info
              className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
              style={{ color: "var(--warn)" }}
            />
            <div className="min-w-0 flex-1 text-[12px] leading-relaxed">
              <span className="font-semibold">
                {lockedIds.length === 1
                  ? "1 product is locked this month"
                  : `${lockedIds.length} products are locked this month`}
              </span>{" "}
              after reaching the {REJECTION_LIMIT_PER_MONTH}-rejection cap.
              You can still apply for the others. Locks lift on{" "}
              <b>{nextMonthResetLabel()}</b>.
            </div>
          </div>
        )}

        <div className="input-wrap with-prefix" style={{ padding: "10px 14px" }}>
          <Search className="h-[18px] w-[18px]" style={{ color: "var(--text-3)" }} />
          <input
            type="text"
            placeholder="Search products…"
            className="flex-1 border-none bg-transparent text-sm outline-none"
          />
        </div>

        <div className="mt-4">
          {loanProducts.map((p) => {
            const locked = isProductLockedThisMonth(p.id);
            return (
              <ProductCard
                key={p.id}
                product={p}
                href={`/loan/products/${p.id}`}
                showTagline
                locked={locked}
                lockedHint={
                  locked
                    ? `Locked — re-apply on ${nextMonthResetLabel()}`
                    : undefined
                }
              />
            );
          })}
        </div>

        {hasLocks && (
          <p
            className="mt-4 text-center text-[11px]"
            style={{ color: "var(--text-3)" }}
          >
            Need help on a locked product?{" "}
            <Link href="/chat" style={{ color: "var(--primary)" }}>
              Talk to your officer →
            </Link>
          </p>
        )}
      </ScreenBody>
    </Screen>
  );
}
