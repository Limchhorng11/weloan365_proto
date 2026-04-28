"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Pin, Share2 } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { DynamicIcon } from "@/components/domain/loan/DynamicIcon";
import { useToast } from "@/lib/hooks/useToast";
import { getNewsById, newsItems } from "@/lib/mock";
import type { NewsCategory } from "@/lib/types";

const tone: Record<NewsCategory, { label: string; bg: string; color: string }> = {
  announcement: { label: "Announcement", bg: "rgba(31,95,255,.12)", color: "var(--primary)" },
  news:         { label: "News",         bg: "rgba(0,196,140,.12)", color: "#00a677" },
  alert:        { label: "Alert",        bg: "rgba(255,77,94,.12)", color: "var(--danger)" },
  system:       { label: "System",       bg: "rgba(255,159,28,.15)", color: "#cc7a00" },
};

/** News / announcement detail (linked from Home and /news). */
export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const item = getNewsById(id);
  if (!item) notFound();

  const t = tone[item.category];
  const others = newsItems.filter((n) => n.id !== item.id).slice(0, 3);

  return (
    <Screen>
      <NavHeader
        title=""
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
        <div className="flex items-center gap-2">
          <span
            className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
            style={{ background: t.bg, color: t.color }}
          >
            {t.label}
          </span>
          {item.pinned && (
            <span
              className="inline-flex items-center gap-1 text-[11px]"
              style={{ color: "var(--text-3)" }}
            >
              <Pin className="h-3 w-3" /> Pinned
            </span>
          )}
          <span
            className="ml-auto text-[11px]"
            style={{ color: "var(--text-3)" }}
          >
            {item.date}
          </span>
        </div>

        <div className="mt-4 flex items-start gap-3">
          <div
            className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl"
            style={{ background: t.bg, color: t.color }}
          >
            <DynamicIcon name={item.icon} className="h-6 w-6" />
          </div>
          <h1 className="text-[22px] font-bold leading-tight tracking-tight">
            {item.title}
          </h1>
        </div>

        <div
          className="mt-5 whitespace-pre-line text-[15px] leading-relaxed"
          style={{ color: "var(--text)" }}
        >
          {item.body}
        </div>

        <h3 className="section-title mt-8">More from Weloan365</h3>
        {others.map((n) => {
          const ot = tone[n.category];
          return (
            <Link
              key={n.id}
              href={`/news/${n.id}`}
              className="mb-2.5 flex gap-3 rounded-2xl p-3 shadow-sm"
              style={{ background: "var(--surface)" }}
            >
              <div
                className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-[10px]"
                style={{ background: ot.bg, color: ot.color }}
              >
                <DynamicIcon name={n.icon} className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider"
                     style={{ color: ot.color }}>
                  {ot.label}
                </div>
                <div className="mt-0.5 text-[13px] font-medium leading-snug">
                  {n.title}
                </div>
                <div
                  className="mt-0.5 text-[11px]"
                  style={{ color: "var(--text-3)" }}
                >
                  {n.relativeTime}
                </div>
              </div>
            </Link>
          );
        })}
      </ScreenBody>
    </Screen>
  );
}
