"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, Languages, PhoneCall } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { ConsultStepper } from "@/components/domain/loan/ConsultStepper";

const TOPICS = [
  "I want to apply for a new loan",
  "Help with my repayment",
  "Question about an existing loan",
  "Other",
] as const;

const LANGS = [
  { value: "en", label: "English" },
  { value: "km", label: "ខ្មែរ" },
  { value: "either", label: "Either" },
] as const;

/** Step 1 of 4 — Consult: pick a topic + language, then continue to branch. */
export default function ConsultPage() {
  const router = useRouter();
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [language, setLanguage] = useState<string>("en");
  const [notes, setNotes] = useState("");

  const next = () => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(
        "wl:consult",
        JSON.stringify({ topic, language, notes }),
      );
    }
    router.push("/loan/consultation/branch");
  };

  return (
    <Screen>
      <NavHeader title="Request Consultation" />
      <ScreenBody>
        <ConsultStepper current="consult" />

        <Card className="px-4 py-6 text-center">
          <div
            className="mx-auto mb-3 grid h-[52px] w-[52px] place-items-center rounded-xl"
            style={{ background: "var(--primary-50)", color: "var(--primary)" }}
          >
            <PhoneCall className="h-6 w-6" />
          </div>
          <h3 className="mb-1 text-base font-semibold">
            Talk to a loan advisor
          </h3>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            Schedule a face-to-face meeting at your nearest branch. Free, no
            commitment.
          </p>
        </Card>

        <SectionTitle>What do you want to discuss?</SectionTitle>
        <div className="flex flex-col gap-2">
          {TOPICS.map((t) => {
            const active = t === topic;
            return (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className="flex items-center gap-3 rounded-xl p-3.5 text-left transition"
                style={{
                  background: "var(--surface)",
                  border: active
                    ? "2px solid var(--primary)"
                    : "1.5px solid var(--border)",
                }}
              >
                <span
                  className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full"
                  style={{
                    background: active
                      ? "var(--primary)"
                      : "var(--surface)",
                    border: active ? "none" : "1.5px solid var(--border-strong)",
                  }}
                >
                  {active && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
                <span className="text-sm">{t}</span>
              </button>
            );
          })}
        </div>

        <SectionTitle>
          <span className="inline-flex items-center gap-1.5">
            <Languages className="h-3.5 w-3.5" /> Preferred language
          </span>
        </SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {LANGS.map((l) => {
            const active = l.value === language;
            return (
              <button
                key={l.value}
                onClick={() => setLanguage(l.value)}
                className="rounded-xl py-2.5 text-sm font-medium transition"
                style={{
                  background: active ? "var(--primary)" : "var(--surface)",
                  color: active ? "#fff" : "var(--text)",
                  border: active
                    ? "1.5px solid var(--primary)"
                    : "1.5px solid var(--border)",
                }}
              >
                {l.label}
              </button>
            );
          })}
        </div>

        <SectionTitle>Notes (optional)</SectionTitle>
        <Textarea
          rows={3}
          placeholder="Anything specific you'd like the advisor to prepare?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Card
          className="mt-4"
          style={{
            background: "rgba(31,95,255,.05)",
            border: "1px solid rgba(31,95,255,.15)",
          }}
        >
          <div className="flex items-start gap-2.5">
            <Building2
              className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
              style={{ color: "var(--primary)" }}
            />
            <div className="text-xs leading-relaxed">
              You&apos;ll choose your preferred branch and time slot in the next
              two steps.
            </div>
          </div>
        </Card>
      </ScreenBody>
      <StickyFooter>
        <Button onClick={next}>Continue</Button>
      </StickyFooter>
    </Screen>
  );
}
