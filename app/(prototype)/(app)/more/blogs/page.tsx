"use client";

import Link from "next/link";
import { useState } from "react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { DynamicIcon } from "@/components/domain/loan/DynamicIcon";
import { blogs } from "@/lib/mock";
import type { Blog } from "@/lib/types";

const coverBg: Record<Blog["cover"], string> = {
  a: "linear-gradient(135deg, #ff6b9d, #c2185b)",
  b: "linear-gradient(135deg, #1f5fff, #0a2f8a)",
  c: "linear-gradient(135deg, #00c48c, #00796b)",
  d: "linear-gradient(135deg, #ff9f1c, #cc7a00)",
};

type Filter = "all" | "tips" | "guides" | "news";

export default function BlogsPage() {
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <Screen>
      <NavHeader title="Blogs & Education" />
      <ScreenBody>
        <Segmented
          value={filter}
          onChange={setFilter}
          className="mb-4"
          options={[
            { value: "all", label: "All" },
            { value: "tips", label: "Tips" },
            { value: "guides", label: "Guides" },
            { value: "news", label: "News" },
          ]}
        />

        {blogs.map((b) => (
          <Link
            key={b.id}
            href={`/more/blogs/${b.id}`}
            className="mb-3 block w-full overflow-hidden rounded-2xl text-left shadow-sm transition active:scale-[.99]"
            style={{ background: "var(--surface)" }}
          >
            <div
              className="grid h-[140px] place-items-center text-white"
              style={{ background: coverBg[b.cover] }}
            >
              <DynamicIcon name={b.icon} className="h-[42px] w-[42px]" />
            </div>
            <div className="px-4 py-3.5">
              <h4 className="mb-1 text-[15px] font-semibold">{b.title}</h4>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
                {b.excerpt}
              </p>
              <div className="mt-2 text-[11px]" style={{ color: "var(--text-3)" }}>
                {b.date} · {b.readTime} read
              </div>
            </div>
          </Link>
        ))}
      </ScreenBody>
    </Screen>
  );
}
