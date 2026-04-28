"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PhoneCall } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Segmented } from "@/components/ui/Segmented";
import { SuccessSheet } from "@/components/sheets/SuccessSheet";
import { useSheet } from "@/lib/hooks/useSheet";
import { mockUser } from "@/lib/mock";

type Channel = "branch" | "phone" | "video";

export default function ConsultationPage() {
  const router = useRouter();
  const { open, close } = useSheet();
  const [channel, setChannel] = useState<Channel>("branch");

  const submit = () => {
    open(
      <SuccessSheet
        title="Consultation Requested"
        description="Our advisor will contact you at the preferred time."
        primaryLabel="Back to Home"
        onPrimary={() => {
          close();
          router.push("/home");
        }}
      />,
    );
  };

  return (
    <Screen>
      <NavHeader title="Request Consultation" />
      <ScreenBody>
        <Card className="px-4 py-6 text-center">
          <div
            className="mx-auto mb-3 grid h-[52px] w-[52px] place-items-center rounded-xl"
            style={{ background: "var(--primary-50)", color: "var(--primary)" }}
          >
            <PhoneCall className="h-6 w-6" />
          </div>
          <h3 className="mb-1 text-base font-semibold">Talk to our advisor</h3>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            Schedule a face-to-face or phone consultation with our loan specialist.
          </p>
        </Card>

        <SectionTitle>Preferred channel</SectionTitle>
        <Segmented
          value={channel}
          onChange={setChannel}
          options={[
            { value: "branch", label: "In-person" },
            { value: "phone", label: "Phone call" },
            { value: "video", label: "Video call" },
          ]}
        />

        <SectionTitle>Contact details</SectionTitle>
        <div className="flex flex-col gap-2.5">
          <Input label="Full name" defaultValue={mockUser.name} />
          <Input label="Phone" defaultValue={mockUser.phone} />
          <Input label="Preferred branch" defaultValue="Phnom Penh HQ" />
        </div>

        <SectionTitle>Preferred time</SectionTitle>
        <div className="flex flex-col gap-2.5">
          <Input label="Date" type="date" defaultValue="2026-04-28" />
          <Input label="Time" type="time" defaultValue="10:30" />
        </div>

        <SectionTitle>Message (optional)</SectionTitle>
        <Textarea
          rows={3}
          placeholder="Tell us about what you'd like to discuss..."
        />
      </ScreenBody>
      <StickyFooter>
        <Button onClick={submit}>Request Consultation</Button>
      </StickyFooter>
    </Screen>
  );
}
