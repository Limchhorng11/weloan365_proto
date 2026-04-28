"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  title: string;
  description: string;
  primaryLabel: string;
  onPrimary: () => void;
}

export function SuccessSheet({
  title,
  description,
  primaryLabel,
  onPrimary,
}: Props) {
  return (
    <div className="py-5 text-center">
      <div
        className="mx-auto mb-4 grid h-[72px] w-[72px] place-items-center rounded-xl"
        style={{ background: "rgba(0,196,140,.12)", color: "var(--accent)" }}
      >
        <CheckCircle className="h-9 w-9" />
      </div>
      <h3 className="mb-1 text-[17px] font-semibold">{title}</h3>
      <p className="mb-5 text-[13px]" style={{ color: "var(--text-2)" }}>
        {description}
      </p>
      <Button onClick={onPrimary}>{primaryLabel}</Button>
    </div>
  );
}
