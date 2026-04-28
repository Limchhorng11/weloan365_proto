"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Bookmark, Clock, Share2 } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { DynamicIcon } from "@/components/domain/loan/DynamicIcon";
import { useToast } from "@/lib/hooks/useToast";
import { blogs } from "@/lib/mock";
import type { Blog } from "@/lib/types";

const coverBg: Record<Blog["cover"], string> = {
  a: "linear-gradient(135deg, #ff6b9d, #c2185b)",
  b: "linear-gradient(135deg, #1f5fff, #0a2f8a)",
  c: "linear-gradient(135deg, #00c48c, #00796b)",
  d: "linear-gradient(135deg, #ff9f1c, #cc7a00)",
};

// Mock article body - same shape for all articles
const ARTICLE_BODY = [
  "Understanding the basics is the first step toward making smart financial decisions. Whether you're applying for your first loan or your fifth, knowing how the numbers work behind the scenes can save you a lot of money over time.",
  "**Why this matters.** Even a small change in your monthly EMI can mean hundreds of dollars saved across the life of a loan. The earlier you understand it, the better you can plan.",
  "**The three ingredients.** Every EMI is determined by three things: principal, rate, and term. Get these right and your loan stays manageable.",
  "1. **Principal** — the amount you borrow. Don't borrow more than you need; interest applies to every dollar.",
  "2. **Rate** — the cost of borrowing, usually quoted per month. Lower is better, but compare flat vs declining methods carefully.",
  "3. **Term** — how long to repay. Longer term = lower monthly payment but more total interest.",
  "**Try the calculator.** Use the in-app EMI calculator to play with different combinations before you apply. It's the easiest way to find your sweet spot.",
];

/** Blog detail (Workshop ref: Session 3.F7 — Blogs / Education). */
export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const blog = blogs.find((b) => b.id === id);
  if (!blog) notFound();

  const related = blogs.filter((b) => b.id !== blog.id).slice(0, 3);

  return (
    <Screen>
      <NavHeader
        title=""
        right={
          <div className="flex gap-1">
            <button
              className="grid h-9 w-9 place-items-center rounded-[10px]"
              onClick={() => toast("Saved to your reading list", "success")}
            >
              <Bookmark className="h-5 w-5" />
            </button>
            <button
              className="grid h-9 w-9 place-items-center rounded-[10px]"
              onClick={() => toast("Share menu opened", "info")}
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        }
      />
      <ScreenBody noPad>
        <div
          className="grid h-[200px] place-items-center text-white"
          style={{ background: coverBg[blog.cover] }}
        >
          <DynamicIcon name={blog.icon} className="h-[60px] w-[60px]" />
        </div>

        <div className="px-4 pt-5">
          <div className="text-xs uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
            Education
          </div>
          <h1 className="mt-1 text-[22px] font-bold leading-tight tracking-tight">
            {blog.title}
          </h1>

          <div
            className="mt-3 flex items-center gap-3 text-xs"
            style={{ color: "var(--text-2)" }}
          >
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {blog.readTime} read
            </span>
            <span>·</span>
            <span>{blog.date}</span>
          </div>

          <div className="mt-5 space-y-3 text-[15px] leading-relaxed">
            <p
              className="text-base font-medium leading-snug"
              style={{ color: "var(--text)" }}
            >
              {blog.excerpt}
            </p>
            {ARTICLE_BODY.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: renderInline(p) }} />
            ))}
          </div>

          <Card
            className="mt-6"
            style={{
              background: "rgba(31,95,255,.05)",
              border: "1px solid rgba(31,95,255,.15)",
            }}
          >
            <div className="text-sm">
              <div className="font-medium">Try it now</div>
              <div className="mt-1.5" style={{ color: "var(--text-2)" }}>
                Use the EMI calculator to apply what you just learned.
              </div>
            </div>
            <Link href="/loan/calculator" className="btn btn-primary mt-3">
              Open Calculator
            </Link>
          </Card>

          <h3 className="section-title">More articles</h3>
          {related.map((b) => (
            <Link
              key={b.id}
              href={`/more/blogs/${b.id}`}
              className="mb-3 flex items-center gap-3 rounded-2xl p-3 shadow-sm"
              style={{ background: "var(--surface)" }}
            >
              <div
                className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl text-white"
                style={{ background: coverBg[b.cover] }}
              >
                <DynamicIcon name={b.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{b.title}</div>
                <div className="mt-0.5 text-[11px]" style={{ color: "var(--text-3)" }}>
                  {b.date} · {b.readTime} read
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="h-6" />
      </ScreenBody>
    </Screen>
  );
}

/** Tiny markdown-ish: bold (**text**) only. Keeps the prototype dependency-free. */
function renderInline(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
}
