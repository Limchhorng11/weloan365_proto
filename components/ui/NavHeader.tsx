"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface Props {
  title?: string;
  back?: boolean | (() => void);
  right?: ReactNode;
  transparent?: boolean;
}

/** Sticky nav header shared by nearly every screen. */
export function NavHeader({ title = "", back = true, right, transparent }: Props) {
  const router = useRouter();
  const handleBack = () => {
    if (typeof back === "function") back();
    else router.back();
  };

  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex flex-shrink-0 items-center px-4",
        !transparent && "border-b",
      )}
      style={{
        height: "var(--h-header)",
        background: transparent ? "transparent" : "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {back ? (
        <button
          onClick={handleBack}
          className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px] hover:bg-surface-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : (
        <div className="w-9" />
      )}
      <h2 className="mx-2 flex-1 text-center text-base font-semibold">{title}</h2>
      <div className="flex min-w-[36px] justify-end">{right}</div>
    </div>
  );
}
