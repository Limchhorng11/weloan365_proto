"use client";

import { Eye, Fingerprint, Key, ScanFace, Smartphone, Tablet } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { SectionTitle } from "@/components/ui/Card";
import { useToast } from "@/lib/hooks/useToast";

export default function SecurityPage() {
  const toast = useToast();
  return (
    <Screen>
      <NavHeader title="Account Security" />
      <ScreenBody>
        <SectionTitle>Biometric login</SectionTitle>
        <ListGroup>
          <ListRow
            icon={ScanFace}
            title="Face ID"
            sub="Use Face ID to sign in"
            chevron={false}
            right={<Switch defaultChecked />}
          />
          <ListRow
            icon={Fingerprint}
            title="Touch ID"
            sub="Use fingerprint to sign in"
            chevron={false}
            right={<Switch />}
          />
        </ListGroup>

        <SectionTitle>PIN</SectionTitle>
        <ListGroup>
          <ListRow
            icon={Key}
            title="Change PIN"
            sub="Last changed 3 months ago"
            onClick={() => toast("Change PIN flow", "info")}
          />
        </ListGroup>

        <SectionTitle>Sessions</SectionTitle>
        <ListGroup>
          <ListRow
            icon={Smartphone}
            iconBg="rgba(0,196,140,.12)"
            iconColor="var(--accent)"
            title={
              <span>
                iPhone 15 Pro{" "}
                <Badge tone="success" className="ml-1">
                  Active
                </Badge>
              </span>
            }
            sub="Phnom Penh · Just now"
            chevron={false}
          />
          <ListRow
            icon={Tablet}
            title="iPad (2nd)"
            sub="Siem Reap · 3 days ago"
            chevron={false}
            right={
              <button
                className="text-xs font-medium"
                style={{ color: "var(--danger)" }}
                onClick={() => toast("Session removed", "success")}
              >
                Revoke
              </button>
            }
          />
        </ListGroup>

        <SectionTitle>Privacy</SectionTitle>
        <ListGroup>
          <ListRow
            icon={Eye}
            title="Hide balance on home"
            sub="Show •••• instead of amount"
            chevron={false}
            right={<Switch />}
          />
        </ListGroup>
      </ScreenBody>
    </Screen>
  );
}
