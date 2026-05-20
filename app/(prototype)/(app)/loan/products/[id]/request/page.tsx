"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { getProductById } from "@/lib/mock";
import {
  isProductLockedThisMonth,
  nextMonthResetLabel,
} from "@/lib/utils/rejection";
import { MWLRequestFlow } from "./MWLRequestFlow";
import { StandardRequestFlow } from "./StandardRequestFlow";

/**
 * Loan Inquiry router.
 *
 * Routes to a product-specific wizard:
 *   • MWL (p5) → MWLRequestFlow — 9-step end-to-end flow mirroring the NHFC
 *     "Platform-Based Loan Processing" flowchart (destination, agency, bank
 *     account, guarantor, etc.).
 *   • All other products → StandardRequestFlow — simplified 3-step inquiry.
 *
 * The per-product 3-rejections-per-month cap is enforced here so the lock
 * screen is shared by both flows.
 */
export default function LoanRequestPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);
  if (!product) notFound();

  // Shared per-product lock screen.
  if (isProductLockedThisMonth(product.id)) {
    return (
      <Screen>
        <NavHeader title="Loan Inquiry" />
        <ScreenBody>
          <div className="mt-8 text-center">
            <div
              className="mx-auto mb-4 grid h-[80px] w-[80px] place-items-center rounded-2xl"
              style={{
                background: "rgba(255,77,94,.12)",
                color: "var(--danger)",
              }}
            >
              <Lock className="h-10 w-10" />
            </div>
            <h1 className="text-[22px] font-bold tracking-tight">
              {product.name} is paused this month
            </h1>
            <p
              className="mt-2 px-6 text-sm leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              You&apos;ve reached the 3-rejection limit for{" "}
              <b>{product.name}</b> this month. To protect your credit
              profile, you can submit a new inquiry for this product
              starting <b>{nextMonthResetLabel()}</b>.
            </p>
            <p
              className="mt-2 px-6 text-sm leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              <b>Other loan products are still available</b> — browse the
              catalog to find one that fits.
            </p>
          </div>

          <Card
            className="mt-6"
            style={{
              background: "rgba(31,95,255,.05)",
              border: "1px solid rgba(31,95,255,.15)",
            }}
          >
            <div className="text-sm">
              <div className="font-medium">What to do in the meantime</div>
              <ul
                className="mt-2 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed"
                style={{ color: "var(--text-2)" }}
              >
                <li>Try a different loan product — most are still open.</li>
                <li>
                  Gather stronger income proof for next month&apos;s attempt
                  on {product.name}.
                </li>
                <li>
                  Talk to your advisor about which product fits your profile.
                </li>
              </ul>
            </div>
          </Card>
        </ScreenBody>
        <StickyFooter>
          <div className="flex flex-col gap-2">
            <Link href="/loan/products" className="btn btn-primary">
              Browse other products
            </Link>
            <Link href="/chat" className="btn btn-ghost">
              Talk to your officer
            </Link>
          </div>
        </StickyFooter>
      </Screen>
    );
  }

  // MWL uses its dedicated end-to-end flow; everything else uses the simple
  // 3-step inquiry. Both components own their own hooks.
  if (product.id === "p5") return <MWLRequestFlow product={product} />;
  return <StandardRequestFlow product={product} />;
}
