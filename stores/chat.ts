"use client";

import { create } from "zustand";
import type { Chat, ChatMessage } from "@/lib/types";
import { mockChats } from "@/lib/mock";

interface ChatStore {
  chats: Chat[];
  getChat: (id: string) => Chat | undefined;
  sendMessage: (chatId: string, text: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: mockChats,
  getChat: (id) => get().chats.find((c) => c.id === id),
  sendMessage: (chatId, text) => {
    if (!text.trim()) return;
    const now = new Date();
    const time = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"}`;
    set((s) => ({
      chats: s.chats.map((c) => {
        if (c.id !== chatId) return c;
        const outMsg: ChatMessage = { type: "text", dir: "out", text, time };
        return { ...c, messages: [...c.messages, outMsg], lastMessage: text, lastTime: time };
      }),
    }));

    // Simulated auto-reply
    setTimeout(() => {
      set((s) => ({
        chats: s.chats.map((c) => {
          if (c.id !== chatId) return c;
          const replyText = "Thanks for your message — an agent will reply shortly.";
          const reply: ChatMessage = {
            type: "text",
            dir: "in",
            text: replyText,
            time,
          };
          return { ...c, messages: [...c.messages, reply], lastMessage: replyText };
        }),
      }));
    }, 1200);
  },
}));
