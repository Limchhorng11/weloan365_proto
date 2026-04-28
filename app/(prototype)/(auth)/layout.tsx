import type { ReactNode } from "react";

/**
 * Auth group layout — no tab bar. Just passes children through.
 * Grouped for route organization and to reinforce that these screens
 * live outside the authenticated tab chrome.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
