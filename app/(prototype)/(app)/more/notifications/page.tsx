"use client";

import Link from "next/link";
import { useState } from "react";
import { Settings } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { EmptyState } from "@/components/ui/EmptyState";
import { DynamicIcon } from "@/components/domain/loan/DynamicIcon";
import { useToast } from "@/lib/hooks/useToast";
import { notifications } from "@/lib/mock";
import { Bell } from "lucide-react";
import type { NotificationItem } from "@/lib/types";

type Filter = "all" | "payment" | "loan" | "promo" | "news";

const filterFor: Record<Filter, (n: NotificationItem) => boolean> = {
  all: () => true,
  payment: (n) => n.category === "payment",
  loan: (n) => n.category === "loan",
  promo: (n) => n.category === "reward",
  news: (n) => n.category === "news" || n.category === "security",
};

/** Notifications list (Workshop ref: Session 3.F6, screen 2 + 3). */
export default function NotificationsPage() {
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = notifications.filter(filterFor[filter]);

  return (
    <Screen>
      <NavHeader
        title="Notifications"
        right={
          <Link
            href="/more/notifications/settings"
            className="grid h-9 w-9 place-items-center rounded-[10px]"
          >
            <Settings className="h-5 w-5" />
          </Link>
        }
      />
      <ScreenBody noPad>
        <div className="px-4 pt-3">
          <div className="mb-3 flex items-center justify-between">
            <Segmented
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All" },
                { value: "payment", label: "Payment" },
                { value: "loan", label: "Loan" },
                { value: "promo", label: "Rewards" },
                { value: "news", label: "News" },
              ]}
            />
          </div>
          <button
            onClick={() => toast("All notifications marked as read", "success")}
            className="mb-2 text-xs font-medium"
            style={{ color: "var(--primary)" }}
          >
            Mark all as read
          </button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="Nothing in this category right now."
          />
        ) : (
          filtered.map((n) => (
            <button
              key={n.id}
              className="relative flex w-full gap-3 border-b px-4 py-3 text-left"
              style={{
                background: n.unread ? "rgba(31,95,255,.03)" : "var(--surface)",
                borderColor: "var(--border)",
              }}
              onClick={() => toast(`Opening ${n.title}`, "info")}
            >
              {n.unread && (
                <span
                  className="absolute left-1.5 top-5 h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--primary)" }}
                />
              )}
              <div
                className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-[10px]"
                style={{
                  background: "var(--primary-50)",
                  color: "var(--primary)",
                }}
              >
                <DynamicIcon name={n.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="text-sm font-semibold">{n.title}</h5>
                <p
                  className="mt-0.5 text-xs leading-snug"
                  style={{ color: "var(--text-2)" }}
                >
                  {n.body}
                </p>
                <small
                  className="mt-1 block text-[11px]"
                  style={{ color: "var(--text-3)" }}
                >
                  {n.time}
                </small>
              </div>
            </button>
          ))
        )}
      </ScreenBody>
    </Screen>
  );
}
