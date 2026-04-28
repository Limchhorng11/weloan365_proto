"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Star } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Segmented } from "@/components/ui/Segmented";
import { useToast } from "@/lib/hooks/useToast";

type Category = "general" | "bug" | "feature" | "complaint";

export default function FeedbackPage() {
  const router = useRouter();
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState<Category>("general");

  const submit = () => {
    toast("Thanks for your feedback!", "success");
    setTimeout(() => router.back(), 400);
  };

  return (
    <Screen>
      <NavHeader title="Feedback & Rate" />
      <ScreenBody>
        <Card className="px-4 py-6 text-center">
          <div
            className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-xl"
            style={{
              background: "rgba(255,159,28,.15)",
              color: "var(--warn)",
            }}
          >
            <Star className="h-[26px] w-[26px]" />
          </div>
          <h3 className="mb-1 text-base font-semibold">How is your experience?</h3>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            Tap a star to rate Weloan365
          </p>

          <div className="my-5 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} onClick={() => setRating(i)}>
                <Star
                  className="h-9 w-9 transition-colors"
                  style={{
                    color: i <= rating ? "var(--warn)" : "var(--border-strong)",
                    fill: i <= rating ? "var(--warn)" : "transparent",
                  }}
                />
              </button>
            ))}
          </div>
        </Card>

        <SectionTitle>Your feedback</SectionTitle>
        <Textarea rows={5} placeholder="Tell us what you love — or what we can improve." />

        <SectionTitle>Category</SectionTitle>
        <Segmented
          value={category}
          onChange={setCategory}
          options={[
            { value: "general", label: "General" },
            { value: "bug", label: "Bug" },
            { value: "feature", label: "Feature" },
            { value: "complaint", label: "Complaint" },
          ]}
        />
      </ScreenBody>
      <StickyFooter>
        <Button onClick={submit}>Submit Feedback</Button>
      </StickyFooter>
    </Screen>
  );
}
