"use client";

import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

function resolve(name: string): LucideIcon {
  const lookup = Icons as unknown as Record<string, LucideIcon>;
  const pascal = name
    .split("-")
    .map((p) => p[0]?.toUpperCase() + p.slice(1))
    .join("");
  return lookup[pascal] ?? Icons.Circle;
}

/**
 * Renders a Lucide icon by its kebab-case name (e.g. "credit-card"). Used in
 * places where the icon is part of mock data rather than hard-coded.
 */
export function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = resolve(name);
  return <Icon className={className} />;
}
