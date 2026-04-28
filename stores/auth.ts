"use client";

import { create } from "zustand";

interface AuthStore {
  /** Whether the current user has completed sign-in. */
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  signIn: () => set({ isAuthenticated: true }),
  signOut: () => set({ isAuthenticated: false }),
}));
