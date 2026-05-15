"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Calculator, Check, CheckCircle, PhoneCall, Share2 } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoanSummary } from "@/components/domain/loan/LoanSummary";
import { useToast } from "@/lib/hooks/useToast";
import { getProductById } from "@/lib/mock";
import { formatMoneyShort } from "@/lib/utils/format";

export default function LoanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <Screen>
      <NavHeader
        title={product.name}
        right={
          <button
            className="grid h-9 w-9 place-items-center rounded-[10px]"
            onClick={() => toast("Share menu opened", "info")}
          >
            <Share2 className="h-5 w-5" />
          </button>
        }
      />
      <ScreenBody>
        <LoanSummary
          background={product.color}
          label="Interest rate from"
          amount={
            <>
              {product.rate}%
              <span className="text-base opacity-85"> / {product.rateUnit}</span>
            </>
          }
          stats={[
            { label: "Min amount", value: formatMoneyShort(product.minAmount) },
            { label: "Max amount", value: formatMoneyShort(product.maxAmount) },
            { label: "Term", value: `${product.minTerm}–${product.maxTerm} mo` },
          ]}
        />

        <p className="mb-4 text-sm" style={{ color: "var(--text-2)" }}>
          {product.tagline}
        </p>

        <SectionTitle>Benefits</SectionTitle>
        <Card>
          {product.features.map((f) => (
            <div key={f} className="mb-2.5 flex items-center gap-2.5">
              <CheckCircle
                className="h-[18px] w-[18px] flex-shrink-0"
                style={{ color: "var(--accent)" }}
              />
              <span className="text-sm">{f}</span>
            </div>
          ))}
        </Card>

        <SectionTitle>Eligibility &amp; Terms</SectionTitle>
        <Card>
          {product.terms.map((t) => (
            <div key={t} className="mb-2.5 flex items-center gap-2.5">
              <Check
                className="h-[18px] w-[18px] flex-shrink-0"
                style={{ color: "var(--primary)" }}
              />
              <span className="text-sm">{t}</span>
            </div>
          ))}
        </Card>

        {/* Pre-application helpers — two equal-weight secondary actions.
            Stacked on phone width so the long button labels never wrap. */}
        <div className="mt-4 flex flex-col gap-2">
          <Link href="/loan/calculator" className="btn btn-secondary">
            <Calculator className="h-[18px] w-[18px]" />
            Simulate monthly payment
          </Link>
          <Link href="/loan/consultation" className="btn btn-secondary">
            <PhoneCall className="h-[18px] w-[18px]" />
            Request a consultant
          </Link>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Link href={`/loan/products/${product.id}/request`} className="btn btn-primary">
          Apply for This Loan
        </Link>
      </StickyFooter>
    </Screen>
  );
}
