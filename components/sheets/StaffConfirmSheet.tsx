"use client";

import { BadgeCheck, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { Staff } from "@/lib/mock/staff";

interface Props {
  staff: Staff;
  onConfirm: () => void;
  onReject: () => void;
}

/**
 * Popup shown after the customer enters a 5-digit referral code during
 * sign-up. Displays the matching staff member's profile so the customer
 * can confirm "yes, this is my advisor" before the link is committed.
 */
export function StaffConfirmSheet({ staff, onConfirm, onReject }: Props) {
  return (
    <div>
      <div className="text-center">
        <span className="badge success">
          <BadgeCheck className="mr-0.5 inline h-3 w-3" />
          Verified Weloan365 staff
        </span>

        <div className="my-4 flex justify-center">
          <Avatar
            size="lg"
            initials={staff.initials}
            bg={staff.color}
            className="!h-[88px] !w-[88px] !text-[32px]"
          />
        </div>

        <h3 className="text-[20px] font-bold tracking-tight">{staff.name}</h3>
        <p
          className="mt-1 text-[13px] font-medium"
          style={{ color: "var(--primary)" }}
        >
          {staff.role} <span style={{ color: "var(--text-3)" }}>·</span>{" "}
          {staff.roleShort}
        </p>

        <div
          className="mt-2 inline-flex items-center gap-1 text-[12px]"
          style={{ color: "var(--text-2)" }}
        >
          <MapPin className="h-3 w-3" />
          {staff.branchName}
        </div>
      </div>

      <div
        className="mt-5 rounded-xl p-3"
        style={{ background: "var(--surface-2)" }}
      >
        <div className="kv-row">
          <span>Staff code</span>
          <span className="font-mono font-semibold">{staff.code}</span>
        </div>
        <div className="kv-row">
          <span>With Weloan365</span>
          <span>{staff.yearsOfService} years</span>
        </div>
      </div>

      <p
        className="my-4 text-center text-[11px] leading-relaxed"
        style={{ color: "var(--text-3)" }}
      >
        Confirming will link <b>{staff.name.split(" ")[0]}</b> as your personal
        advisor. You can change this later in More → Profile.
      </p>

      <Button onClick={onConfirm} className="mb-2">
        Yes, this is my advisor
      </Button>
      <Button variant="ghost" onClick={onReject}>
        Try a different code
      </Button>
    </div>
  );
}
