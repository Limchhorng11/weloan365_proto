"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Calendar, Check, Share2, Sparkles } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { useToast } from "@/lib/hooks/useToast";
import { getPromoById } from "@/lib/mock";

/** Promo detail (Workshop ref: Session 2.F6, screen 2). */
export default function PromoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const promo = getPromoById(id);
  if (!promo) notFound();

  return (
    <Screen>
      <NavHeader
        title="Promotion"
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
        <div
          className="mb-4 flex flex-col justify-end rounded-[22px] p-5 text-white"
          style={{ background: promo.gradient, minHeight: 180 }}
        >
          <div className="text-xs uppercase tracking-wider opacity-85">
            Limited offer
          </div>
          <h1 className="mt-1 text-[26px] font-bold leading-tight">
            {promo.title}
          </h1>
          <p className="mt-2 text-sm opacity-90">{promo.shortDesc}</p>
          <div
            className="mt-4 inline-flex items-center gap-1.5 self-start rounded-lg px-3 py-1.5 text-sm font-semibold"
            style={{ background: "rgba(255,255,255,.2)" }}
          >
            <Sparkles className="h-4 w-4" />
            {promo.highlight}
          </div>
        </div>

        <p className="text-sm leading-relaxed">{promo.longDesc}</p>

        <SectionTitle>Validity</SectionTitle>
        <Card>
          <div className="flex items-center gap-2.5">
            <div
              className="grid h-9 w-9 place-items-center rounded-[10px]"
              style={{ background: "var(--primary-50)", color: "var(--primary)" }}
            >
              <Calendar className="h-[18px] w-[18px]" />
            </div>
            <div>
              <div className="text-sm font-medium">Valid until</div>
              <div className="text-xs" style={{ color: "var(--text-2)" }}>
                {promo.validUntil}
              </div>
            </div>
          </div>
        </Card>

        <SectionTitle>Terms &amp; conditions</SectionTitle>
        <Card>
          {promo.terms.map((t, i) => (
            <div key={i} className="mb-2.5 flex items-start gap-2.5 last:mb-0">
              <Check
                className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
                style={{ color: "var(--accent)" }}
              />
              <span className="text-sm">{t}</span>
            </div>
          ))}
        </Card>
      </ScreenBody>
      <StickyFooter>
        <Link href={promo.ctaHref} className="btn btn-primary">
          {promo.cta}
        </Link>
      </StickyFooter>
    </Screen>
  );
}
