"use client";

import { Cookie, FileText, Info, Scale, Shield } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { useToast } from "@/lib/hooks/useToast";

export default function PolicyPage() {
  const toast = useToast();
  return (
    <Screen>
      <NavHeader title="App Policy" />
      <ScreenBody>
        <ListGroup>
          <ListRow
            icon={FileText}
            title="Terms of Service"
            sub="Last updated: Apr 1, 2026"
            onClick={() => toast("Opening Terms…", "info")}
          />
          <ListRow
            icon={Shield}
            title="Privacy Policy"
            sub="How we handle your data"
            onClick={() => toast("Opening Privacy Policy…", "info")}
          />
          <ListRow
            icon={Cookie}
            title="Cookie Policy"
            sub="Cookies we use"
            onClick={() => toast("Opening Cookie Policy…", "info")}
          />
          <ListRow
            icon={Scale}
            title="Licenses"
            sub="Open source licenses"
            onClick={() => toast("Opening Licenses…", "info")}
          />
        </ListGroup>

        <Card className="mt-4" style={{ background: "rgba(31,95,255,.05)" }}>
          <div className="flex items-start gap-2.5">
            <Info
              className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
              style={{ color: "var(--primary)" }}
            />
            <div className="text-sm">
              <div className="font-medium">Registered &amp; regulated</div>
              <div className="mt-2" style={{ color: "var(--text-2)" }}>
                Weloan365 is licensed by the National Bank of Cambodia and
                complies with local consumer protection laws.
              </div>
            </div>
          </div>
        </Card>
      </ScreenBody>
    </Screen>
  );
}
