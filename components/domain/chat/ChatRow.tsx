"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import type { Chat } from "@/lib/types";

export function ChatRow({ chat }: { chat: Chat }) {
  return (
    <Link
      href={`/chat/${chat.id}`}
      className="flex gap-3 border-b px-4 py-3.5"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <Avatar initials={chat.avatar} bg={chat.color} />
      <div className="min-w-0 flex-1">
        <h4 className="flex items-center justify-between text-[15px] font-semibold">
          <span className="truncate">{chat.name}</span>
          <small className="ml-2 flex-shrink-0 text-[11px] font-normal" style={{ color: "var(--text-3)" }}>
            {chat.lastTime}
          </small>
        </h4>
        <div className="mt-0.5 flex items-center justify-between text-[13px]">
          <span
            className="truncate"
            style={{ color: "var(--text-2)", maxWidth: 220 }}
          >
            {chat.lastMessage}
          </span>
          {chat.unread > 0 && (
            <span
              className="ml-2 flex-shrink-0 rounded-[10px] px-1.5 py-px text-[10px] font-semibold text-white"
              style={{ background: "var(--primary)" }}
            >
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
