"use client";

import { create } from "zustand";

type Mode = "light" | "dark";

interface ThemeStore {
  mode: Mode;
  toggle: () => void;
  set: (mode: Mode) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: "light",
  toggle: () =>
    set((s) => {
      const next: Mode = s.mode === "light" ? "dark" : "light";
      if (typeof document !== "undefined") {
        document.documentElement.dataset.theme = next;
      }
      return { mode: next };
    }),
  set: (mode) => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = mode;
    }
    set({ mode });
  },
}));
