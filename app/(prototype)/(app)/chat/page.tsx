"use client";

import { Edit, Search } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { ChatRow } from "@/components/domain/chat/ChatRow";
import { useChatStore } from "@/stores/chat";
import { useToast } from "@/lib/hooks/useToast";

export default function ChatPage() {
  const chats = useChatStore((s) => s.chats);
  const toast = useToast();

  return (
    <Screen>
      <NavHeader
        title="Messages"
        back={false}
        right={
          <button
            className="grid h-9 w-9 place-items-center rounded-[10px]"
            onClick={() => toast("New chat coming soon.", "info")}
          >
            <Edit className="h-5 w-5" />
          </button>
        }
      />
      <ScreenBody noPad hasTabBar>
        <div
          className="input-wrap with-prefix mx-4 my-3"
          style={{ padding: "10px 14px" }}
        >
          <Search className="h-[18px] w-[18px]" style={{ color: "var(--text-3)" }} />
          <input
            type="text"
            placeholder="Search conversations…"
            className="flex-1 border-none bg-transparent text-sm outline-none"
          />
        </div>

        {chats.map((c) => (
          <ChatRow key={c.id} chat={c} />
        ))}
      </ScreenBody>
    </Screen>
  );
}
