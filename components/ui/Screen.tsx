import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface ScreenProps {
  children: ReactNode;
  className?: string;
}

/**
 * Full-height flex container for a single screen. Pair with <ScreenBody>
 * for the scrolling content area and <StickyFooter> for bottom CTAs.
 */
export function Screen({ children, className }: ScreenProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>{children}</div>
  );
}

interface BodyProps {
  children: ReactNode;
  className?: string;
  /** Add bottom padding so content clears the tab bar. */
  hasTabBar?: boolean;
  /** Remove default padding for edge-to-edge content. */
  noPad?: boolean;
}

export function ScreenBody({ children, className, hasTabBar, noPad }: BodyProps) {
  // Resolve bottom padding explicitly to avoid tailwind-merge collisions:
  // - padded + tabbar => pb-24 (clears tab bar)
  // - padded, no tabbar => pb-6
  // - edge-to-edge + tabbar => pb-20
  // - edge-to-edge, no tabbar => pb-0
  const pad = noPad
    ? hasTabBar ? "pb-20" : ""
    : hasTabBar ? "px-4 pt-4 pb-24" : "p-4 pb-6";

  return (
    <div
      className={cn("flex-1 overflow-y-auto", pad, className)}
      style={{ WebkitOverflowScrolling: "touch" as const }}
    >
      {children}
    </div>
  );
}

export function StickyFooter({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex-shrink-0 border-t p-3"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {children}
    </div>
  );
}
