"use client";
import { useToastStore } from "@/stores/toast";

/** Convenience hook for toast notifications. */
export function useToast() {
  return useToastStore((s) => s.show);
}
