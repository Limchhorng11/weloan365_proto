"use client";

import { ScanFace } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

/** Simulated Face ID modal; auto-succeeds after 1.5s. */
export function BiometricModal({ open, onCancel, onSuccess }: Props) {
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(onSuccess, 1500);
    return () => window.clearTimeout(id);
  }, [open, onSuccess]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-[250] grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div
            className="w-[280px] rounded-2xl p-6 text-center"
            style={{ background: "var(--surface)" }}
          >
            <div
              className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-2xl animate-scanning"
              style={{
                background: "var(--primary-50)",
                color: "var(--primary)",
              }}
            >
              <ScanFace className="h-10 w-10" />
            </div>
            <h3 className="mb-1 text-lg font-semibold">Face ID</h3>
            <p className="text-[13px]" style={{ color: "var(--text-2)" }}>
              Look at your device to sign in
            </p>
            <button
              onClick={onCancel}
              className="mt-6 font-medium"
              style={{ color: "var(--primary)" }}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
