"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSheetStore } from "@/stores/sheet";

/** Renders the currently-open bottom sheet (if any) over the phone frame. */
export function SheetHost() {
  const content = useSheetStore((s) => s.content);
  const close = useSheetStore((s) => s.close);

  return (
    <AnimatePresence>
      {content && (
        <motion.div
          key="sheet-root"
          className="absolute inset-0 z-[200]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,.5)" }}
            onClick={close}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 max-h-[85%] overflow-y-auto rounded-t-3xl p-4 pb-8"
            style={{ background: "var(--surface)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <div
              className="mx-auto mb-3 h-1 w-9 rounded-full"
              style={{ background: "var(--border-strong)" }}
            />
            {content}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
