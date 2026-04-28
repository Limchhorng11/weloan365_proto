"use client";

import { Home, Wallet, MessageCircle, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useChatStore } from "@/stores/chat";

const tabs = [
  { href: "/home", label: "Home", icon: Home, match: /^\/home/ },
  { href: "/my-loan", label: "My Loan", icon: Wallet, match: /^\/my-loan/ },
  { href: "/chat", label: "Chat", icon: MessageCircle, match: /^\/chat/ },
  { href: "/more", label: "More", icon: LayoutGrid, match: /^\/more/ },
];

/** Paths that show the bottom tab bar. Nested routes hide it (native feel). */
const ROOT_TAB_PATHS = new Set(["/home", "/my-loan", "/chat", "/more"]);

export function TabBar() {
  const pathname = usePathname();
  const chatUnread = useChatStore((s) =>
    s.chats.reduce((sum, c) => sum + c.unread, 0),
  );

  if (!ROOT_TAB_PATHS.has(pathname)) return null;

  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-30 flex justify-around border-t pt-2"
      style={{
        height: "var(--h-tabbar)",
        background: "rgba(255,255,255,.95)",
        backdropFilter: "blur(20px)",
        borderColor: "var(--border)",
      }}
    >
      {tabs.map((t) => {
        const active = t.match.test(pathname);
        const Icon = t.icon;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "relative flex flex-1 flex-col items-center gap-1 py-1.5 text-[10px] font-medium",
              active ? "text-brand" : "",
            )}
            style={{ color: active ? "var(--primary)" : "var(--text-3)" }}
          >
            <Icon className="h-[22px] w-[22px]" />
            <span>{t.label}</span>
            {t.href === "/chat" && chatUnread > 0 && (
              <span
                className="absolute top-0.5 rounded-full px-[5px] py-px text-[9px] font-bold text-white"
                style={{
                  background: "var(--danger)",
                  right: "calc(50% - 22px)",
                  minWidth: 16,
                  textAlign: "center",
                }}
              >
                {chatUnread}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
