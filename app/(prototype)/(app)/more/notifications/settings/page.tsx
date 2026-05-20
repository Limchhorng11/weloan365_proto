"use client";

import { useState } from "react";
import {
  AlertCircle,
  Bell,
  Megaphone,
  Moon,
  Wallet,
} from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { Switch } from "@/components/ui/Switch";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/lib/hooks/useToast";

interface CategorySetting {
  key: string;
  icon: typeof Bell;
  title: string;
  sub: string;
  push: boolean;
  sms: boolean;
  email: boolean;
}

/** Notification settings (Workshop ref: Session 3.F6, screen 4). */
export default function NotificationSettingsPage() {
  const toast = useToast();

  const [cats, setCats] = useState<CategorySetting[]>([
    { key: "reminder",     icon: AlertCircle, title: "Reminders",     sub: "Payment due, document uploads, consultations", push: true,  sms: true,  email: false },
    { key: "transaction",  icon: Wallet,      title: "Transactions",  sub: "Payment posted, approval, disbursement",       push: true,  sms: true,  email: true  },
    { key: "announcement", icon: Megaphone,   title: "Announcements", sub: "News, features, branch closures, security",    push: true,  sms: false, email: true  },
  ]);

  const [quietEnabled, setQuietEnabled] = useState(true);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("07:00");

  const update = (key: string, channel: "push" | "sms" | "email", val: boolean) => {
    setCats((prev) => prev.map((c) => (c.key === key ? { ...c, [channel]: val } : c)));
  };

  const save = () => toast("Notification settings saved", "success");

  return (
    <Screen>
      <NavHeader
        title="Notification Settings"
        right={
          <button
            onClick={save}
            className="text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            Save
          </button>
        }
      />
      <ScreenBody>
        <Card style={{ background: "rgba(31,95,255,.05)", border: "1px solid rgba(31,95,255,.15)" }}>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
            Choose which categories you want to hear about and through which
            channel. Critical security alerts under Announcements always come
            through.
          </p>
        </Card>

        <SectionTitle>Categories</SectionTitle>
        <div className="flex flex-col gap-2.5">
          {cats.map((c) => {
            const Icon = c.icon;
            return (
              <Card key={c.key} style={{ padding: 14 }}>
                <div className="flex items-start gap-3">
                  <div
                    className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px]"
                    style={{ background: "var(--primary-50)", color: "var(--primary)" }}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-medium">{c.title}</div>
                    <div
                      className="mt-0.5 text-xs"
                      style={{ color: "var(--text-2)" }}
                    >
                      {c.sub}
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
                  {(["push", "sms", "email"] as const).map((channel) => (
                    <label
                      key={channel}
                      className="flex items-center justify-between gap-2 rounded-lg p-2"
                      style={{ background: "var(--surface-2)" }}
                    >
                      <span className="capitalize">{channel}</span>
                      <Switch
                        checked={c[channel]}
                        onChange={(e) =>
                          update(c.key, channel, e.target.checked)
                        }
                      />
                    </label>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        <SectionTitle>Quiet hours</SectionTitle>
        <ListGroup>
          <ListRow
            icon={Moon}
            title="Mute non-critical notifications"
            sub="Security alerts always come through"
            chevron={false}
            right={
              <Switch
                checked={quietEnabled}
                onChange={(e) => setQuietEnabled(e.target.checked)}
              />
            }
          />
        </ListGroup>

        {quietEnabled && (
          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <Input
              label="Start"
              type="time"
              value={quietStart}
              onChange={(e) => setQuietStart(e.target.value)}
            />
            <Input
              label="End"
              type="time"
              value={quietEnd}
              onChange={(e) => setQuietEnd(e.target.value)}
            />
          </div>
        )}

        <p className="mt-3 text-xs" style={{ color: "var(--text-3)" }}>
          Notifications are kept for 30 days. Older items are removed
          automatically.
        </p>
      </ScreenBody>
    </Screen>
  );
}
