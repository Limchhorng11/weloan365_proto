"use client";

import { CreditCard, Globe, LogOut, Megaphone, MessageCircle, Moon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { SectionTitle } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { ConfirmSheet } from "@/components/sheets/ConfirmSheet";
import { useSheet } from "@/lib/hooks/useSheet";
import { useToast } from "@/lib/hooks/useToast";
import { useThemeStore } from "@/stores/theme";
import { useAuthStore } from "@/stores/auth";

export default function SettingsPage() {
  const toggleTheme = useThemeStore((s) => s.toggle);
  const signOut = useAuthStore((s) => s.signOut);
  const { open, close } = useSheet();
  const toast = useToast();
  const router = useRouter();

  const onLogout = () => {
    open(
      <ConfirmSheet
        title="Log out?"
        description="You'll need to sign in again to access your account."
        dangerLabel="Log out"
        onConfirm={() => {
          close();
          signOut();
          router.replace("/sign-in");
        }}
      />,
    );
  };

  return (
    <Screen>
      <NavHeader title="App Settings" />
      <ScreenBody>
        <SectionTitle>Appearance</SectionTitle>
        <ListGroup>
          <ListRow
            icon={Moon}
            title="Theme"
            sub="Light / Dark / System"
            right={<span>System</span>}
            onClick={() => {
              toggleTheme();
              toast("Theme switched", "info");
            }}
          />
          <ListRow
            icon={Globe}
            title="Language"
            sub="English · ខ្មែរ coming soon"
            right={<span>English</span>}
            onClick={() => toast("Language picker", "info")}
          />
        </ListGroup>

        <SectionTitle>Notifications</SectionTitle>
        <ListGroup>
          <ListRow
            icon={CreditCard}
            title="Payment reminders"
            sub="3 days before due date"
            chevron={false}
            right={<Switch defaultChecked />}
          />
          <ListRow
            icon={Megaphone}
            title="Promotions & news"
            sub="Offers, tips, updates"
            chevron={false}
            right={<Switch defaultChecked />}
          />
          <ListRow
            icon={MessageCircle}
            title="Chat notifications"
            sub="New messages from support"
            chevron={false}
            right={<Switch defaultChecked />}
          />
        </ListGroup>

        <SectionTitle>Data</SectionTitle>
        <ListGroup>
          <ListRow
            icon={Trash2}
            title="Clear cache"
            sub="2.3 MB"
            onClick={() => toast("Cache cleared (2.3 MB freed)", "success")}
          />
        </ListGroup>

        <Button variant="danger" className="mt-6" leading={<LogOut className="h-[18px] w-[18px]" />} onClick={onLogout}>
          Log out
        </Button>
      </ScreenBody>
    </Screen>
  );
}
