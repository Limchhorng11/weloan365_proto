import { Suspense } from "react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { MyLoanClient } from "./MyLoanClient";

/**
 * My Loans page — server wrapper.
 *
 * The actual UI is a client component that uses `useSearchParams` to drive
 * its tab state. Next.js 14 requires that consumer to live inside a
 * <Suspense> boundary so the page can be statically pre-rendered without
 * deopting the whole route to dynamic. Without this, `next build` fails
 * during static analysis on Vercel.
 */
export default function MyLoanPage() {
  return (
    <Suspense fallback={<MyLoanFallback />}>
      <MyLoanClient />
    </Suspense>
  );
}

function MyLoanFallback() {
  return (
    <Screen>
      <NavHeader title="My Loans" back={false} />
      <ScreenBody hasTabBar>
        <div
          className="h-10 rounded-[10px]"
          style={{ background: "var(--surface-2)" }}
        />
        <div
          className="mt-4 h-28 rounded-2xl"
          style={{ background: "var(--surface-2)" }}
        />
        <div
          className="mt-2.5 h-24 rounded-2xl"
          style={{ background: "var(--surface-2)" }}
        />
      </ScreenBody>
    </Screen>
  );
}
