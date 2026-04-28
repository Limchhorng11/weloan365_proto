"use client";

import { Button } from "@/components/ui/Button";
import { useSheet } from "@/lib/hooks/useSheet";

interface Props {
  title: string;
  description: string;
  dangerLabel?: string;
  onConfirm: () => void;
}

export function ConfirmSheet({
  title,
  description,
  dangerLabel = "Confirm",
  onConfirm,
}: Props) {
  const { close } = useSheet();
  return (
    <div>
      <h3 className="mb-1 text-[17px] font-semibold">{title}</h3>
      <p className="mb-5 text-[13px]" style={{ color: "var(--text-2)" }}>
        {description}
      </p>
      <Button variant="danger" className="mb-2" onClick={onConfirm}>
        {dangerLabel}
      </Button>
      <Button variant="outline" onClick={close}>
        Keep
      </Button>
    </div>
  );
}
