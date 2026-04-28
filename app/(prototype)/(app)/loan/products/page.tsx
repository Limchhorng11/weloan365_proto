"use client";

import { Search } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { ProductCard } from "@/components/domain/loan/ProductCard";
import { loanProducts } from "@/lib/mock";

export default function LoanProductsPage() {
  return (
    <Screen>
      <NavHeader title="Loan Products" />
      <ScreenBody hasTabBar>
        <div className="input-wrap with-prefix" style={{ padding: "10px 14px" }}>
          <Search className="h-[18px] w-[18px]" style={{ color: "var(--text-3)" }} />
          <input
            type="text"
            placeholder="Search products…"
            className="flex-1 border-none bg-transparent text-sm outline-none"
          />
        </div>

        <div className="mt-4">
          {loanProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              href={`/loan/products/${p.id}`}
              showTagline
            />
          ))}
        </div>
      </ScreenBody>
    </Screen>
  );
}
