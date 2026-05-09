"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar,
  CalendarPlus,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody, StickyFooter } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConsultStepper } from "@/components/domain/loan/ConsultStepper";
import { ConfirmSheet } from "@/components/sheets/ConfirmSheet";
import { useSheet } from "@/lib/hooks/useSheet";
import { useToast } from "@/lib/hooks/useToast";
import { branches, mockUser } from "@/lib/mock";

interface ConsultState {
  topic?: string;
  language?: string;
  notes?: string;
  branchId?: string;
  date?: string; // ISO yyyy-mm-dd
  time?: string; // HH:mm
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(iso?: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** Step 4 of 4 — Booking Confirmed. */
export default function ConfirmedPage() {
  const router = useRouter();
  const toast = useToast();
  const { open, close } = useSheet();
  const [state, setState] = useState<ConsultState | null>(null);

  useEffect(() => {
    if (typeof sessionStorage === "undefined") return;
    const raw = sessionStorage.getItem("wl:consult");
    if (raw) {
      try {
        setState(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    } else {
      // No state — user landed here cold. Redirect them to start.
      router.replace("/loan/consultation");
    }
  }, [router]);

  if (!state) {
    return (
      <Screen>
        <NavHeader title="Booking Confirmed" back={false} />
        <ScreenBody>
          <ConsultStepper current="confirmed" />
        </ScreenBody>
      </Screen>
    );
  }

  const branch =
    branches.find((b) => b.id === state.branchId) ?? branches[0];

  const refNo = `CON-${(state.date || "").replace(/-/g, "")}-${(state.time || "").replace(":", "")}`;

  const cancelBooking = () => {
    open(
      <ConfirmSheet
        title="Cancel this booking?"
        description="You can book another consultation any time. We'll let the branch know."
        dangerLabel="Cancel booking"
        onConfirm={() => {
          close();
          if (typeof sessionStorage !== "undefined") {
            sessionStorage.removeItem("wl:consult");
          }
          toast("Booking cancelled", "info");
          router.replace("/home");
        }}
      />,
    );
  };

  return (
    <Screen>
      <NavHeader title="Booking Confirmed" back={false} />
      <ScreenBody>
        <ConsultStepper current="confirmed" />

        <div className="mt-2 text-center">
          <div
            className="mx-auto mb-4 grid h-[80px] w-[80px] place-items-center rounded-2xl"
            style={{
              background: "rgba(0,196,140,.12)",
              color: "var(--accent)",
            }}
          >
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight">
            You&apos;re all set, {mockUser.name.split(" ")[0]}!
          </h1>
          <p
            className="mx-2 mt-1.5 text-sm leading-relaxed"
            style={{ color: "var(--text-2)" }}
          >
            Your consultation is booked. We&apos;ve sent a confirmation to{" "}
            <b>{mockUser.phone}</b>.
          </p>
        </div>

        <Card className="mt-6">
          <div className="text-[10px] font-semibold uppercase tracking-wider"
               style={{ color: "var(--text-3)" }}>
            Booking reference
          </div>
          <div
            className="mt-1 font-mono text-[13px] font-semibold"
            style={{ color: "var(--primary)" }}
          >
            {refNo}
          </div>

          <div
            className="my-3 h-px"
            style={{ background: "var(--border)" }}
          />

          <div className="flex items-start gap-3">
            <Calendar
              className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
              style={{ color: "var(--primary)" }}
            />
            <div>
              <div className="text-sm font-semibold">
                {formatDate(state.date)}
              </div>
              <div className="text-xs" style={{ color: "var(--text-2)" }}>
                <Clock className="mr-1 inline h-3 w-3" /> {state.time}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-3">
            <MapPin
              className="mt-0.5 h-[18px] w-[18px] flex-shrink-0"
              style={{ color: "var(--primary)" }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold leading-tight">
                {branch.name}
              </div>
              <div
                className="mt-0.5 text-xs leading-snug"
                style={{ color: "var(--text-2)" }}
              >
                {branch.address}
              </div>
            </div>
          </div>

          {state.topic && (
            <>
              <div
                className="my-3 h-px"
                style={{ background: "var(--border)" }}
              />
              <div className="text-[10px] font-semibold uppercase tracking-wider"
                   style={{ color: "var(--text-3)" }}>
                Topic
              </div>
              <div className="mt-1 text-sm">{state.topic}</div>
              {state.notes && (
                <div
                  className="mt-1 text-xs italic"
                  style={{ color: "var(--text-2)" }}
                >
                  &ldquo;{state.notes}&rdquo;
                </div>
              )}
            </>
          )}
        </Card>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <button
            onClick={() => toast("Added to your calendar", "success")}
            className="flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center shadow-sm"
            style={{ background: "var(--surface)" }}
          >
            <CalendarPlus
              className="h-[20px] w-[20px]"
              style={{ color: "var(--primary)" }}
            />
            <span className="text-[11px] font-medium">Add to calendar</span>
          </button>
          <button
            onClick={() => toast("Calling branch…", "info")}
            className="flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center shadow-sm"
            style={{ background: "var(--surface)" }}
          >
            <Phone
              className="h-[20px] w-[20px]"
              style={{ color: "var(--primary)" }}
            />
            <span className="text-[11px] font-medium">Call branch</span>
          </button>
          <button
            onClick={() => toast("Share menu opened", "info")}
            className="flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center shadow-sm"
            style={{ background: "var(--surface)" }}
          >
            <Share2
              className="h-[20px] w-[20px]"
              style={{ color: "var(--primary)" }}
            />
            <span className="text-[11px] font-medium">Share</span>
          </button>
        </div>

        <Card
          className="mt-4"
          style={{
            background: "rgba(31,95,255,.05)",
            border: "1px solid rgba(31,95,255,.15)",
          }}
        >
          <div className="text-sm">
            <div className="font-medium">What to bring</div>
            <ul
              className="mt-2 list-disc space-y-1 pl-5 text-[13px] leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              <li>Your National ID</li>
              <li>Recent payslip or income proof</li>
              <li>Any documents related to your topic</li>
            </ul>
          </div>
        </Card>

        <p
          className="mt-3 text-center text-[11px] leading-relaxed"
          style={{ color: "var(--text-3)" }}
        >
          You can reschedule or cancel up to 2 hours before your appointment.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <Link href="/chat" className="btn btn-secondary">
            <MessageCircle className="h-[18px] w-[18px]" />
            Message the branch
          </Link>
          <button
            onClick={cancelBooking}
            className="text-center text-sm font-medium"
            style={{ color: "var(--danger)" }}
          >
            Cancel booking
          </button>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Link href="/home" className="btn btn-primary">
          Done
        </Link>
      </StickyFooter>
    </Screen>
  );
}
