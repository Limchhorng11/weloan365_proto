"use client";

import { Facebook, Globe, HeartHandshake, Phone, ShieldCheck, Zap } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Card, SectionTitle } from "@/components/ui/Card";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { useToast } from "@/lib/hooks/useToast";

export default function AboutPage() {
  const toast = useToast();

  return (
    <Screen>
      <NavHeader title="About Weloan365" />
      <ScreenBody>
        <div className="px-2 py-5 text-center">
          <div
            className="mx-auto grid h-[72px] w-[72px] place-items-center rounded-[20px] text-[36px] font-extrabold text-white shadow-md"
            style={{
              background: "linear-gradient(135deg, var(--primary), #6aa3ff)",
            }}
          >
            W
          </div>
          <h2 className="mt-4 text-lg font-semibold">Weloan365</h2>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            Your financial partner, always on.
          </p>
          <p className="mt-2 text-xs" style={{ color: "var(--text-2)" }}>
            Version 1.0.0 · Build 1
          </p>
        </div>

        <SectionTitle>Our Vision</SectionTitle>
        <Card>
          <p className="text-sm leading-relaxed">
            To empower every Cambodian with fair, fast, and transparent access to
            financial services — so that your dreams never have to wait.
          </p>
        </Card>

        <SectionTitle>Our Mission</SectionTitle>
        <Card>
          <p className="text-sm leading-relaxed">
            We leverage technology to make lending simple, responsible, and
            customer-first. We partner with borrowers through their whole journey —
            from first loan to financial freedom.
          </p>
        </Card>

        <SectionTitle>Our Values</SectionTitle>
        <ListGroup>
          <ListRow
            icon={ShieldCheck}
            title="Trust & Transparency"
            sub="Clear terms, no hidden fees"
            chevron={false}
          />
          <ListRow
            icon={HeartHandshake}
            iconBg="rgba(0,196,140,.12)"
            iconColor="var(--accent)"
            title="Customer First"
            sub="Your success is our success"
            chevron={false}
          />
          <ListRow
            icon={Zap}
            iconBg="rgba(255,159,28,.15)"
            iconColor="var(--warn)"
            title="Speed & Simplicity"
            sub="Minutes, not days"
            chevron={false}
          />
        </ListGroup>

        <SectionTitle>Get in touch</SectionTitle>
        <ListGroup>
          <ListRow
            icon={Globe}
            title="weloan365.com"
            chevron
            onClick={() => toast("Opening website…", "info")}
          />
          <ListRow
            icon={Facebook}
            title="fb.com/weloan365"
            chevron
            onClick={() => toast("Opening Facebook…", "info")}
          />
          <ListRow
            icon={Phone}
            title="+855 23 987 654"
            onClick={() => toast("Calling support…", "info")}
          />
        </ListGroup>
      </ScreenBody>
    </Screen>
  );
}
