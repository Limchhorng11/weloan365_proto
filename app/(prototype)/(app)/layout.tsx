import type { ReactNode } from "react";
import { TabBar } from "@/components/phone/TabBar";

/**
 * Authenticated app layout — renders the bottom tab bar over every screen
 * inside this group (home, my-loan, chat, more, loan/*).
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <TabBar />
    </>
  );
}
