import type { Chat } from "@/lib/types";

export const mockChats: Chat[] = [
  {
    id: "c1",
    name: "Customer Support",
    subtitle: "Support Team",
    avatar: "CS",
    color: "#1f5fff",
    lastMessage:
      "Your documents have been received. We'll get back to you shortly.",
    lastTime: "10:24 AM",
    unread: 2,
    online: true,
    messages: [
      { type: "date", text: "Today" },
      { type: "text", dir: "in", text: "Hi Sokha, how can we help you today?", time: "10:12 AM" },
      { type: "text", dir: "out", text: "Hi, I want to check the status of my loan application.", time: "10:14 AM" },
      { type: "text", dir: "in", text: "Sure, may I have your application ID please?", time: "10:15 AM" },
      { type: "text", dir: "out", text: "APP-2026-04-8812", time: "10:16 AM" },
      { type: "voice", dir: "in", duration: "0:14", time: "10:18 AM" },
      { type: "file", dir: "in", filename: "Required_Documents_Checklist.pdf", size: "248 KB", time: "10:20 AM" },
      { type: "text", dir: "in", text: "Your documents have been received. We'll get back to you shortly.", time: "10:24 AM" },
    ],
  },
  {
    id: "c2",
    name: "Loan Officer — Lina",
    subtitle: "Your assigned advisor",
    avatar: "LN",
    color: "#00c48c",
    lastMessage: "📷 Photo",
    lastTime: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      { type: "date", text: "Yesterday" },
      { type: "text", dir: "in", text: "Good morning! Here are the final terms for your business loan.", time: "9:10 AM" },
      { type: "file", dir: "in", filename: "Loan_Terms_FY2026.pdf", size: "412 KB", time: "9:11 AM" },
      { type: "text", dir: "out", text: "Thanks, reading now.", time: "9:45 AM" },
      { type: "video", dir: "in", duration: "0:32", time: "11:20 AM" },
    ],
  },
  {
    id: "c3",
    name: "Promotions",
    subtitle: "Weloan365",
    avatar: "WL",
    color: "#ff9f1c",
    lastMessage: "🎉 Special rate this month — 0.75%/mo on education loans!",
    lastTime: "Apr 21",
    unread: 0,
    online: false,
    messages: [
      { type: "date", text: "Apr 21" },
      { type: "text", dir: "in", text: "🎉 Special rate this month — 0.75%/mo on education loans!", time: "2:00 PM" },
    ],
  },
];

export const getChatById = (id: string) => mockChats.find((c) => c.id === id);
