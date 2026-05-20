"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Settings } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { EmptyState } from "@/components/ui/EmptyState";
import { DynamicIcon } from "@/components/domain/loan/DynamicIcon";
import { useToast } from "@/lib/hooks/useToast";
import { notifications } from "@/lib/mock";
import type { NotificationCategory } from "@/lib/types";

/**
 * Notifications list (Workshop ref: Session 3.F6, screen 2 + 3).
 *
 * Three tabs only — matches the customer-facing taxonomy:
 *   • Reminder      — due dates, document requests
 *   • Transactions  — payment posted, approval, disbursement
 *   • Announcement  — news, features, security
 */
const TABS: { value: NotificationCategory; label: string }[] = [
  { value: "reminder",     label: "Reminder" },
  { value: "transaction",  label: "Transactions" },
  { value: "announcement", label: "Announcement" },
];

export default function NotificationsPage() {
  const toast = useToast();
  const [tab, setTab] = useState<NotificationCategory>("reminder");

  const filtered = notifications.filter((n) => n.category === tab);
  const unreadCount = (cat: NotificationCategory) =>
    notifications.filter((n) => n.category === cat && n.unread).length;

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
          <Segmented
            value={tab}
            onChange={setTab}
            options={TABS.map((t) => {
              const c = unreadCount(t.value);
              return {
                value: t.value,
                label: c > 0 ? `${t.label} · ${c}` : t.label,
              };
            })}
          />

          <button
            onClick={() => toast("All notifications marked as read", "success")}
            className="mb-2 mt-3 text-xs font-medium"
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
