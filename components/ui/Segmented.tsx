"use client";
import { cn } from "@/lib/utils/cn";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: Props<T>) {
  return (
    <div className={cn("segmented", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={cn(o.value === value && "active")}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
