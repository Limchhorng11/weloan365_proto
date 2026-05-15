"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { QuickActions } from "@/components/domain/home/QuickActions";
import { PromoCarousel } from "@/components/domain/home/PromoCarousel";
import { NewsSection } from "@/components/domain/home/NewsSection";
import { ProductCard } from "@/components/domain/loan/ProductCard";
import { mockUser, loanProducts } from "@/lib/mock";
import { useCurrencyStore, type Currency } from "@/stores/currency";
import { formatCurrency } from "@/lib/utils/currency";

// Outstanding figures are stored in USD; rendering switches via the
// currency toggle below.
const OUTSTANDING_USD = 7290;
const NEXT_PAYMENT_USD = 162.5;

/**
 * Home screen.
 *
 * The whole page is one scroll container so QuickActions can visually
 * "float up" over the blue balance card via negative top margin (`-mt-5`).
 * If we used a separate inner overflow-y-auto, that container would clip
 * the negative margin and the overlap effect would disappear.
 */
export default function HomePage() {
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.set);

  return (
    <div className="h-full overflow-y-auto pb-24 animate-fade-in">
      <div
        className="rounded-b-[28px] px-5 pb-8 pt-5 text-white"
        style={{
          background:
            "linear-gradient(180deg, var(--primary) 0%, #4578ff 100%)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar name={mockUser.name} bg="rgba(255,255,255,.2)" />
            <div>
              <small className="text-[11px] opacity-80">Welcome back,</small>
              <div className="text-sm font-semibold">{mockUser.name}</div>
            </div>
          </div>
          <Link
            href="/more/notifications"
            className="relative grid h-10 w-10 place-items-center rounded-xl"
            style={{ background: "rgba(255,255,255,.15)" }}
          >
            <Bell className="h-5 w-5" />
            <span
              className="absolute right-2 top-2 h-2 w-2 rounded-full"
              style={{
                background: "var(--warn)",
                border: "2px solid var(--primary)",
              }}
            />
          </Link>
        </div>

        <Link
          href="/my-loan?tab=active"
          className="mt-4 block rounded-2xl p-4 backdrop-blur transition active:scale-[.99]"
          style={{ background: "rgba(255,255,255,.15)" }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] uppercase tracking-wider opacity-80">
              Total Outstanding
            </span>
            {/* Currency toggle — sits inside the Link but its clicks are
                stopped so they don't navigate. */}
            <div
              className="flex items-center rounded-full p-0.5 text-[10px] font-semibold"
              style={{ background: "rgba(255,255,255,.2)" }}
            >
              {(["USD", "KHR"] as const).map((c) => {
                const active = c === currency;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrency(c as Currency);
                    }}
                    aria-pressed={active}
                    aria-label={`Show amounts in ${c}`}
                    className="rounded-full px-2.5 py-1 transition"
                    style={{
                      background: active ? "#fff" : "transparent",
                      color: active ? "var(--primary)" : "#fff",
                      boxShadow: active
                        ? "0 1px 3px rgba(0,0,0,.15)"
                        : undefined,
                    }}
                  >
                    {c === "USD" ? "$ USD" : "៛ KHR"}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-1 text-[28px] font-bold">
            {formatCurrency(OUTSTANDING_USD, currency)}
          </div>
          <div className="mt-3 flex justify-between text-xs opacity-90">
            <span>Next payment · May 15</span>
            <span>{formatCurrency(NEXT_PAYMENT_USD, currency)}</span>
          </div>
        </Link>
      </div>

      {/* QuickActions sits outside the gradient container and uses -mt-7
          to overlap. Because we no longer have a clipping scroll boundary
          between them, the float-up effect renders correctly. */}
      <QuickActions />

      <h3 className="section-title px-4">Promotions</h3>
      <PromoCarousel />

      <div className="px-4">
        <div className="my-2.5 flex items-center justify-between">
          <h3 className="section-title m-0">Popular loan products</h3>
          <Link
            href="/loan/products"
            className="text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            See all
          </Link>
        </div>
        {loanProducts.slice(0, 3).map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            href={`/loan/products/${p.id}`}
          />
        ))}
      </div>

      <NewsSection />
    </div>
  );
}
