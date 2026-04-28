"use client";

import { useRouter } from "next/navigation";
import { FileBarChart, Info } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SuccessSheet } from "@/components/sheets/SuccessSheet";
import { useSheet } from "@/lib/hooks/useSheet";
import { mockUser } from "@/lib/mock";

export default function CbcPage() {
  const router = useRouter();
  const { open, close } = useSheet();

  const request = () => {
    open(
      <SuccessSheet
        title="Report Requested"
        description="Your CBC report will be available within 24 hours. $2.00 will be charged to your default payment method."
        primaryLabel="Done"
        onPrimary={() => {
          close();
          router.back();
        }}
      />,
    );
  };

  return (
    <Screen>
      <NavHeader title="Check CBC Report" />
      <ScreenBody>
        <Card className="px-4 py-6 text-center">
          <div
            className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-xl"
            style={{ background: "var(--primary-50)", color: "var(--primary)" }}
          >
            <FileBarChart className="h-[26px] w-[26px]" />
          </div>
          <h3 className="mb-1.5 text-base font-semibold">Credit Bureau Cambodia</h3>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            Request your official CBC report to see all your credit records across
            Cambodian banks &amp; MFIs.
          </p>
        </Card>

        <SectionTitle>Report details</SectionTitle>
        <Card>
          <div className="kv-row">
            <span>Full name</span>
            <span>{mockUser.name}</span>
          </div>
          <div className="kv-row">
            <span>National ID</span>
            <span>0123 ••• ••• 456</span>
          </div>
          <div className="kv-row">
            <span>Date</span>
            <span>April 23, 2026</span>
          </div>
          <div className="kv-row">
            <span>Fee</span>
            <span>$2.00</span>
          </div>
        </Card>

        <Card
          className="mt-4"
          style={{
            background: "rgba(31,95,255,.05)",
            border: "1px solid rgba(31,95,255,.2)",
          }}
        >
          <div className="flex items-start gap-2.5">
            <Info
              className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
              style={{ color: "var(--primary)" }}
            />
            <div className="text-sm">
              <div className="font-medium">What&apos;s in the report?</div>
              <div className="mt-2" style={{ color: "var(--text-2)" }}>
                Loan history, outstanding balances, payment behavior, and credit
                score from all registered financial institutions.
              </div>
            </div>
          </div>
        </Card>
      </ScreenBody>
      <StickyFooter>
        <Button onClick={request}>Request Report ($2.00)</Button>
      </StickyFooter>
    </Screen>
  );
}
