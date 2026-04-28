"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface Props {
  icon?: ComponentType<{ className?: string }>;
  iconBg?: string;
  iconColor?: string;
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  chevron?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function ListRow({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  sub,
  right,
  chevron = true,
  href,
  onClick,
  className,
}: Props) {
  const body = (
    <>
      {Icon && (
        <div
          className="list-icon"
          style={
            iconBg || iconColor
              ? {
                  background: iconBg ?? undefined,
                  color: iconColor ?? undefined,
                }
              : undefined
          }
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>
      )}
      <div className="list-main">
        <div className="list-title">{title}</div>
        {sub && <div className="list-sub">{sub}</div>}
      </div>
      {right && <div className="list-right">{right}</div>}
      {chevron && (
        <div className="list-chev">
          <ChevronRight className="h-[18px] w-[18px]" />
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn("list-row", className)}>
        {body}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("list-row w-full text-left", className)}
    >
      {body}
    </button>
  );
}

export function ListGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("list-group", className)}>{children}</div>;
}
