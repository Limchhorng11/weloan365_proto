import type { ComponentType, ReactNode } from "react";

interface Props {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-2.5 px-5 py-10 text-center">
      <div
        className="grid h-20 w-20 place-items-center rounded-full"
        style={{ background: "var(--surface-2)", color: "var(--text-3)" }}
      >
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="mt-2 text-base font-semibold">{title}</h3>
      {description && (
        <p className="text-[13px]" style={{ color: "var(--text-2)" }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
