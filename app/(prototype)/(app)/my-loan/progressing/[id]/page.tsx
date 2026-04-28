"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { Button } from "@/components/ui/Button";
import { LoanSummary } from "@/components/domain/loan/LoanSummary";
import { Timeline } from "@/components/domain/loan/Timeline";
import { ConfirmSheet } from "@/components/sheets/ConfirmSheet";
import { useSheet } from "@/lib/hooks/useSheet";
import { useToast } from "@/lib/hooks/useToast";
import { getProgressingLoan } from "@/lib/mock";
import { formatMoney } from "@/lib/utils/format";

export default function ProgressingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { open, close } = useSheet();
  const toast = useToast();
  const loan = getProgressingLoan(id);
  if (!loan) notFound();

  const cancel = () => {
    open(
      <ConfirmSheet
        title="Cancel this application?"
        description="Your application will be withdrawn. You can re-apply anytime."
        dangerLabel="Cancel Application"
        onConfirm={() => {
          close();
          toast("Application cancelled", "info");
          router.back();
        }}
      />,
    );
  };

  return (
    <Screen>
      <NavHeader title="Application Status" />
      <ScreenBody>
        <LoanSummary
          background={loan.color}
          label="Amount requested"
          amount={formatMoney(loan.amount)}
          stats={[
            { label: "Product", value: loan.productName },
            { label: "Status", value: loan.status },
            { label: "Applied", value: loan.requestedAt },
          ]}
        />

        <SectionTitle>Timeline</SectionTitle>
        <Card>
          <Timeline steps={loan.steps} />
        </Card>

        <SectionTitle>Need help?</SectionTitle>
        <ListGroup>
          <Link href="/chat" className="list-row">
            <div className="list-icon">
              <MessageCircle className="h-[18px] w-[18px]" />
            </div>
            <div className="list-main">
              <div className="list-title">Chat with support</div>
              <div className="list-sub">Typical reply in 5 minutes</div>
            </div>
          </Link>
          <ListRow
            icon={Phone}
            title="Call +855 23 987 654"
            sub="Mon–Sat · 8:00 AM to 5:30 PM"
            onClick={() => toast("Calling customer support…", "info")}
          />
        </ListGroup>
      </ScreenBody>
      <StickyFooter>
        <Button variant="outline" onClick={cancel}>
          Cancel Application
        </Button>
      </StickyFooter>
    </Screen>
  );
}
