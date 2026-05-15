"use client";

import Link from "next/link";
import { Calendar, DollarSign, Lock } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { LoanProduct } from "@/lib/types";
import { formatMoneyShort } from "@/lib/utils/format";

function pickIcon(name: string): LucideIcon {
  const lookup = Icons as unknown as Record<string, LucideIcon>;
  const pascal = name
    .split("-")
    .map((p) => p[0]?.toUpperCase() + p.slice(1))
    .join("");
  return lookup[pascal] ?? Icons.Circle;
}

interface Props {
  product: LoanProduct;
  href: string;
  showTagline?: boolean;
  /**
   * When true, the card paints in a muted/locked style with a "Locked"
   * pill in the top-right. The link itself still routes to the product
   * detail so the customer can read the full lock explanation.
   */
  locked?: boolean;
  /** Subtitle shown under the product name when the card is locked. */
  lockedHint?: string;
}

export function ProductCard({
  product,
  href,
  showTagline,
  locked = false,
  lockedHint,
}: Props) {
  const Icon = pickIcon(product.icon);
  return (
    <Link
      href={href}
      className="relative mb-2.5 flex items-center gap-3 rounded-2xl p-3.5 shadow-sm transition active:scale-[.98]"
      style={{
        background: "var(--surface)",
        opacity: locked ? 0.78 : 1,
        border: locked ? "1.5px solid rgba(255,77,94,.3)" : undefined,
      }}
    >
      {locked && (
        <span
          className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          style={{
            background: "rgba(255,77,94,.12)",
            color: "var(--danger)",
          }}
        >
          <Lock className="h-2.5 w-2.5" />
          Locked
        </span>
      )}

      <div
        className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-xl text-white"
        style={{
          background: product.color,
          filter: locked ? "saturate(.5)" : undefined,
        }}
      >
        <Icon className="h-[26px] w-[26px]" />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-[15px] font-semibold">{product.name}</h4>
        <div className="flex gap-2.5 text-xs" style={{ color: "var(--text-2)" }}>
          <span className="inline-flex items-center gap-0.5">
            <DollarSign className="h-3 w-3" />
            {formatMoneyShort(product.minAmount)}–{formatMoneyShort(product.maxAmount)}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Calendar className="h-3 w-3" />
            {product.minTerm}–{product.maxTerm} mo
          </span>
        </div>
        {locked && lockedHint ? (
          <div
            className="mt-2 text-xs"
            style={{ color: "var(--danger)" }}
          >
            {lockedHint}
          </div>
        ) : (
          showTagline && (
            <div className="mt-2 text-xs" style={{ color: "var(--text-2)" }}>
              {product.tagline}
            </div>
          )
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="text-lg font-bold" style={{ color: "var(--primary)" }}>
          {product.rate}%
        </div>
        <div className="text-[10px]" style={{ color: "var(--text-3)" }}>
          per month
        </div>
      </div>
    </Link>
  );
}
