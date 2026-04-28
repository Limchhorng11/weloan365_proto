"use client";

import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useToastStore } from "@/stores/toast";
import type { ToastKind } from "@/lib/types";

const iconMap: Record<ToastKind, typeof Info> = {
  info: Info,
  success: CheckCircle,
  error: AlertCircle,
};

const tint: Record<ToastKind, string> = {
  info: "var(--primary)",
  success: "var(--accent)",
  error: "var(--danger)",
};

/** Renders all active toasts stacked at the top of the phone frame. */
export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="pointer-events-none absolute left-4 right-4 top-[60px] z-[300] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = iconMap[t.kind];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[13px] shadow-lg"
              style={{
                background: "var(--surface)",
                borderLeft: `4px solid ${tint[t.kind]}`,
              }}
            >
              <Icon
                className="h-[18px] w-[18px] flex-shrink-0"
                style={{ color: tint[t.kind] }}
              />
              <span>{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
