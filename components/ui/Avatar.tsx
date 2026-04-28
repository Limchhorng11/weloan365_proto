import { cn } from "@/lib/utils/cn";

interface Props {
  name?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
  bg?: string;
  className?: string;
}

export function Avatar({ name, initials, size = "md", bg, className }: Props) {
  const text =
    initials ||
    (name
      ? name
          .split(/\s+/)
          .map((x) => x[0])
          .filter(Boolean)
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "?");
  return (
    <div
      className={cn("avatar", size === "sm" && "sm", size === "lg" && "lg", className)}
      style={bg ? { background: bg } : undefined}
    >
      {text}
    </div>
  );
}
