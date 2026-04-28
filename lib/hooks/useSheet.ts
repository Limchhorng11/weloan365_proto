"use client";
import { useSheetStore } from "@/stores/sheet";

/** Access open/close handlers for the global bottom sheet. */
export function useSheet() {
  const open = useSheetStore((s) => s.open);
  const close = useSheetStore((s) => s.close);
  return { open, close };
}
