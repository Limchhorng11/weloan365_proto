import Link from "next/link";
import { promos } from "@/lib/mock";

/** Horizontal carousel of promotional cards. Each card deeplinks to /promo/[id]. */
export function PromoCarousel() {
  return (
    <div
      className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 py-1"
      style={{ scrollbarWidth: "none" }}
    >
      {promos.map((p) => (
        <Link
          key={p.id}
          href={`/promo/${p.id}`}
          className="flex h-[120px] w-[260px] flex-shrink-0 snap-start flex-col justify-between rounded-2xl p-4 text-white transition active:scale-[.98]"
          style={{ background: p.gradient }}
        >
          <div>
            <h3 className="text-base">{p.title}</h3>
            <p className="mt-1 text-xs opacity-90">{p.shortDesc}</p>
          </div>
          <div
            className="self-start rounded-lg px-2.5 py-1.5 text-xs font-semibold"
            style={{ background: "rgba(255,255,255,.2)" }}
          >
            {p.cta} →
          </div>
        </Link>
      ))}
    </div>
  );
}
