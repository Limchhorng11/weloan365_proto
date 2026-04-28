import type { ReactNode } from "react";
import { SidePanel } from "@/components/phone/SidePanel";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { ToastHost } from "@/components/feedback/ToastHost";
import { SheetHost } from "@/components/sheets/SheetHost";

/**
 * Prototype layout — wraps every prototype route in the phone frame, with
 * the dev side panel on desktop. Toasts and sheets are mounted inside the
 * phone so they look like native iOS / Android UI.
 */
export default function PrototypeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[320px_1fr]">
      <SidePanel />
      <main className="relative flex min-h-dvh items-center justify-center md:p-6">
        <PhoneFrame>
          {children}
          <ToastHost />
          <SheetHost />
        </PhoneFrame>
      </main>
    </div>
  );
}
