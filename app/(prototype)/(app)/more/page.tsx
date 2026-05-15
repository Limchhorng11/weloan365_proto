"use client";

import {
  BadgeCheck,
  BookOpen,
  Calculator,
  FileBarChart,
  FileText,
  Info,
  MapPin,
  Settings,
  Shield,
  Star,
  TrendingUp,
  User,
  Bell,
} from "lucide-react";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { SectionTitle } from "@/components/ui/Card";
import { mockUser } from "@/lib/mock";

export default function MorePage() {
  return (
    <Screen>
      <div
        className="flex flex-shrink-0 items-center gap-3.5 rounded-b-[28px] px-5 pb-4 pt-6 text-white"
        style={{ background: "linear-gradient(180deg, var(--primary) 0%, #4578ff 100%)" }}
      >
        <Avatar size="lg" name={mockUser.name} bg="rgba(255,255,255,.2)" />
        <div>
          <h2 className="mb-1 text-lg font-semibold">{mockUser.name}</h2>
          <p className="text-xs opacity-85">{mockUser.phone}</p>
          <div className="mt-2 flex gap-2">
            <Badge className="!bg-white/20 !text-white">✓ Verified</Badge>
            <Badge className="!bg-white/20 !text-white">Member since 2024</Badge>
          </div>
        </div>
      </div>

      <ScreenBody hasTabBar>
        <SectionTitle>Account</SectionTitle>
        <ListGroup>
          <ListRow icon={User} title="User Profile" sub="Update your personal info" href="/more/profile" />
          <ListRow icon={Shield} title="Account Security" sub="Face ID, Touch ID, PIN" href="/more/security" />
          <ListRow icon={Bell} title="Notifications" sub="Payment reminders, news" href="/more/notifications" />
          <ListRow
            icon={BadgeCheck}
            iconBg="rgba(0,196,140,.12)"
            iconColor="var(--accent)"
            title="Referral history"
            sub="Your advisor & past referral codes"
            href="/more/referrals"
          />
        </ListGroup>

        <SectionTitle>Insights &amp; Tools</SectionTitle>
        <ListGroup>
          <ListRow icon={TrendingUp} title="Credit & Insights" sub="Loan health, eligibility" href="/more/insights" />
          <ListRow
            icon={FileBarChart}
            title="Check CBC Report"
            sub="Credit Bureau Cambodia"
            href="/more/cbc"
            right={<span className="badge">Optional</span>}
          />
          <ListRow icon={Calculator} title="Loan Calculator" sub="Simulate EMI" href="/loan/calculator" />
        </ListGroup>

        <SectionTitle>Help &amp; Support</SectionTitle>
        <ListGroup>
          <ListRow icon={MapPin} title="Branch Locator" sub="Find nearest branch" href="/more/branches" />
          <ListRow icon={BookOpen} title="Blogs & Education" sub="Tips, guides, news" href="/more/blogs" />
          <ListRow icon={Star} title="Feedback & Rate" sub="Share your experience" href="/more/feedback" />
        </ListGroup>

        <SectionTitle>About</SectionTitle>
        <ListGroup>
          <ListRow icon={Settings} title="App Settings" sub="Theme, language, logout" href="/more/settings" />
          <ListRow icon={FileText} title="App Policy" sub="Terms & privacy" href="/more/policy" />
          <ListRow icon={Info} title="About Company" sub="Our vision & mission" href="/more/about" />
        </ListGroup>

        <div className="my-6 text-center text-xs" style={{ color: "var(--text-2)" }}>
          Weloan365 · v1.0.0 (Next.js Prototype)
        </div>
      </ScreenBody>
    </Screen>
  );
}
