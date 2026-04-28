"use client";

import type { ReactNode } from "react";
import { create } from "zustand";

interface SheetStore {
  /** Current sheet content; null = closed. */
  content: ReactNode | null;
  /** Open a sheet with arbitrary React content. */
  open: (content: ReactNode) => void;
  /** Close the current sheet. */
  close: () => void;
}

export const useSheetStore = create<SheetStore>((set) => ({
  content: null,
  open: (content) => set({ content }),
  close: () => set({ content: null }),
}));
