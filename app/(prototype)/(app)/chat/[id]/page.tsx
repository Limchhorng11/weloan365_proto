"use client";

import { ChevronLeft, Mic, Paperclip, Phone, Send, Video } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { MessageBubble } from "@/components/domain/chat/MessageBubble";
import { useChatStore } from "@/stores/chat";
import { useToast } from "@/lib/hooks/useToast";

export default function ChatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const bodyRef = useRef<HTMLDivElement>(null);

  const chat = useChatStore((s) => s.chats.find((c) => c.id === id));
  const sendMessage = useChatStore((s) => s.sendMessage);

  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [chat?.messages.length]);

  if (!chat) notFound();

  const send = () => {
    if (!draft.trim()) return;
    sendMessage(chat.id, draft);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col">
      <div
        className="flex flex-shrink-0 items-center px-4"
        style={{
          height: "var(--h-header)",
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button
          onClick={() => router.back()}
          className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <Avatar size="sm" initials={chat.avatar} bg={chat.color} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{chat.name}</div>
            <div
              className="text-xs"
              style={{ color: chat.online ? "var(--accent)" : "var(--text-3)" }}
            >
              {chat.online ? "● Online" : "Offline"}
            </div>
          </div>
        </div>
        <button
          className="grid h-9 w-9 place-items-center rounded-[10px]"
          onClick={() => toast("Starting voice call…", "info")}
        >
          <Phone className="h-5 w-5" />
        </button>
        <button
          className="grid h-9 w-9 place-items-center rounded-[10px]"
          onClick={() => toast("Starting video call…", "info")}
        >
          <Video className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={bodyRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto p-4"
        style={{ background: "var(--bg)" }}
      >
        {chat.messages.map((m, i) => (
          <MessageBubble key={i} msg={m} />
        ))}
      </div>

      <div
        className="flex flex-shrink-0 items-end gap-2 border-t px-3 py-2.5"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <button
          className="grid h-10 w-10 place-items-center rounded-full"
          style={{ color: "var(--text-3)" }}
          onClick={() => toast("Attachment menu", "info")}
        >
          <Paperclip className="h-[18px] w-[18px]" />
        </button>
        <div
          className="flex flex-1 items-center gap-2 rounded-full px-3.5 py-2.5"
          style={{ background: "var(--surface-2)" }}
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message…"
            className="flex-1 border-none bg-transparent text-sm outline-none"
          />
          <button
            style={{ color: "var(--text-3)" }}
            onClick={() => toast("Recording…", "info")}
          >
            <Mic className="h-[18px] w-[18px]" />
          </button>
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-full text-white"
          style={{ background: "var(--primary)" }}
          onClick={send}
        >
          <Send className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}
