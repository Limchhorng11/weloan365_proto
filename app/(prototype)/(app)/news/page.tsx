"use client";

import Link from "next/link";
import { useState } from "react";
import { Newspaper, Pin } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { EmptyState } from "@/components/ui/EmptyState";
import { DynamicIcon } from "@/components/domain/loan/DynamicIcon";
import { newsItems } from "@/lib/mock";
import type { NewsCategory } from "@/lib/types";

type Filter = "all" | NewsCategory;

const tone: Record<NewsCategory, { label: string; bg: string; color: string }> = {
  announcement: { label: "Announcement", bg: "rgba(31,95,255,.12)", color: "var(--primary)" },
  news:         { label: "News",         bg: "rgba(0,196,140,.12)", color: "#00a677" },
  alert:        { label: "Alert",        bg: "rgba(255,77,94,.12)", color: "var(--danger)" },
  system:       { label: "System",       bg: "rgba(255,159,28,.15)", color: "#cc7a00" },
};

/** News & Announcements list — accessible from Home "See all" or via deeplink. */
export default function NewsListPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const sorted = [...newsItems]
    .filter((n) => filter === "all" || n.category === filter)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  return (
    <Screen>
      <NavHeader title="News & Announcements" />
      <ScreenBody>
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "announcement", label: "Announcements" },
            { value: "news", label: "News" },
            { value: "alert", label: "Alerts" },
          ]}
        />

        <div className="mt-4 flex flex-col gap-2.5">
          {sorted.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="Nothing here yet"
              description="No items in this category right now."
            />
          ) : (
            sorted.map((n) => {
              const t = tone[n.category];
              return (
                <Link
                  key={n.id}
                  href={`/news/${n.id}`}
                  className="flex gap-3 rounded-2xl p-3.5 shadow-sm transition active:scale-[.99]"
                  style={{ background: "var(--surface)" }}
                >
                  <div
                    className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl"
                    style={{ background: t.bg, color: t.color }}
                  >
                    <DynamicIcon name={n.icon} className="h-[18px] w-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="rounded-md px-1.5 py-px text-[10px] font-semibold"
                        style={{ background: t.bg, color: t.color }}
                      >
                        {t.label}
                      </span>
                      {n.pinned && (
                        <Pin
                          className="h-3 w-3"
                          style={{ color: "var(--text-3)" }}
                        />
                      )}
                      <span
                        className="ml-auto flex-shrink-0 text-[11px]"
                        style={{ color: "var(--text-3)" }}
                      >
                        {n.relativeTime}
                      </span>
                    </div>
                    <h4 className="mt-1 text-[14px] font-semibold leading-tight">
                      {n.title}
                    </h4>
                    <p
                      className="mt-1 line-clamp-2 text-[12px] leading-snug"
                      style={{ color: "var(--text-2)" }}
                    >
                      {n.excerpt}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </ScreenBody>
    </Screen>
  );
}
