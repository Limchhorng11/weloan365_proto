"use client";

import { FileText, Play } from "lucide-react";
import { useToast } from "@/lib/hooks/useToast";
import type { ChatMessage } from "@/lib/types";

/** Renders a single chat message — text / voice / file / video / date divider. */
export function MessageBubble({ msg }: { msg: ChatMessage }) {
  const toast = useToast();

  if (msg.type === "date") {
    return (
      <div
        className="mx-auto my-2 self-center rounded-[10px] px-2.5 py-1 text-[11px]"
        style={{ color: "var(--text-3)", background: "var(--surface)" }}
      >
        {msg.text}
      </div>
    );
  }

  if (msg.type === "text") {
    return (
      <div className={`msg ${msg.dir}`}>
        {msg.text}
        <span className="msg-time">{msg.time}</span>
      </div>
    );
  }

  if (msg.type === "voice") {
    return (
      <div className={`msg ${msg.dir}`}>
        <div className="flex min-w-[180px] items-center gap-2.5">
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-full"
            style={{
              background: msg.dir === "out" ? "rgba(255,255,255,.3)" : "var(--primary-50)",
              color: msg.dir === "out" ? "#fff" : "var(--primary)",
            }}
            onClick={() => toast("Playing voice message…", "info")}
          >
            <Play className="h-3.5 w-3.5" />
          </button>
          <div className="flex h-5 flex-1 items-center gap-0.5">
            {Array.from({ length: 24 }, (_, i) => (
              <span
                key={i}
                className="flex-1 rounded-[1px]"
                style={{
                  height: `${30 + (i * 13) % 70}%`,
                  background:
                    msg.dir === "out" ? "rgba(255,255,255,.6)" : "rgba(31,95,255,.4)",
                }}
              />
            ))}
          </div>
          <span className="text-[11px] opacity-90">{msg.duration}</span>
        </div>
        <span className="msg-time">{msg.time}</span>
      </div>
    );
  }

  if (msg.type === "file") {
    return (
      <div className={`msg ${msg.dir}`}>
        <button
          type="button"
          className="flex min-w-[200px] items-center gap-2.5 text-left"
          onClick={() => toast(`Opening ${msg.filename}…`, "info")}
        >
          <div
            className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px]"
            style={{
              background:
                msg.dir === "out" ? "rgba(255,255,255,.25)" : "var(--primary-50)",
              color: msg.dir === "out" ? "#fff" : "var(--primary)",
            }}
          >
            <FileText className="h-[18px] w-[18px]" />
          </div>
          <div>
            <h5 className="text-[13px] font-semibold">{msg.filename}</h5>
            <small className="text-[11px] opacity-80">{msg.size}</small>
          </div>
        </button>
        <span className="msg-time">{msg.time}</span>
      </div>
    );
  }

  if (msg.type === "video") {
    return (
      <div className={`msg ${msg.dir}`} style={{ padding: 4 }}>
        <button
          type="button"
          className="relative grid h-[140px] w-[220px] place-items-center overflow-hidden rounded-xl text-white"
          style={{ background: "linear-gradient(135deg, #243b55, #141e30)" }}
          onClick={() => toast("Playing video…", "info")}
        >
          <span
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,.1), transparent)",
            }}
          />
          <div
            className="grid h-12 w-12 place-items-center rounded-full"
            style={{ background: "rgba(255,255,255,.3)", backdropFilter: "blur(6px)" }}
          >
            <Play className="h-5 w-5" />
          </div>
          <span
            className="absolute bottom-1.5 right-2 rounded-md px-1.5 py-0.5 text-[10px]"
            style={{ background: "rgba(0,0,0,.5)" }}
          >
            {msg.duration}
          </span>
        </button>
        <span className="msg-time mx-2">{msg.time}</span>
      </div>
    );
  }

  return null;
}
