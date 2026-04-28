import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "default" | "success" | "warn" | "danger" | "info";

export function Badge({
  tone = "default",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("badge", tone !== "default" && tone, className)}>
      {children}
    </span>
  );
}
