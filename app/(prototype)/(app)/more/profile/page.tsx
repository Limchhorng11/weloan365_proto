"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Camera,
  CheckCircle2,
  ScanLine,
  ShieldCheck,
  Upload,
  User,
} from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Avatar } from "@/components/ui/Avatar";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { useSheet } from "@/lib/hooks/useSheet";
import { useToast } from "@/lib/hooks/useToast";
import { mockUser } from "@/lib/mock";

type DocKey = "front" | "back" | "selfie";

const DOC_META: Record<
  DocKey,
  { label: string; icon: typeof Camera; gradient: string }
> = {
  front: {
    label: "ID Front",
    icon: ScanLine,
    gradient: "linear-gradient(135deg, #1f5fff, #4578ff)",
  },
  back: {
    label: "ID Back",
    icon: ScanLine,
    gradient: "linear-gradient(135deg, #ff9f1c, #cc7a00)",
  },
  selfie: {
    label: "Selfie",
    icon: User,
    gradient: "linear-gradient(135deg, #00c48c, #00796b)",
  },
};

export default function ProfilePage() {
  const toast = useToast();
  const { open, close } = useSheet();

  // Captured document status — defaults to all done (Sokha's account is
  // fully verified). Re-scanning is what the customer typically does here.
  const [docs, setDocs] = useState<Record<DocKey, boolean>>({
    front: true,
    back: true,
    selfie: true,
  });
  const allDone = docs.front && docs.back && docs.selfie;

  const openScanner = (key: DocKey) =>
    open(<ScannerSheet docKey={key} onCapture={() => {
      setDocs((d) => ({ ...d, [key]: true }));
      toast(`${DOC_META[key].label} captured`, "success");
      close();
    }} />);

  return (
    <Screen>
      <NavHeader
        title="User Profile"
        right={
          <button
            className="text-sm font-medium"
            style={{ color: "var(--primary)" }}
            onClick={() => toast("Profile saved", "success")}
          >
            Save
          </button>
        }
      />
      <ScreenBody>
        <div className="mb-4 text-center">
          <Avatar name={mockUser.name} size="lg" className="mx-auto" />
          <button
            className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium"
            style={{ color: "var(--primary)" }}
            onClick={() => toast("Photo picker opened", "info")}
          >
            <Camera className="h-3.5 w-3.5" />
            Change photo
          </button>
        </div>

        {/* ───────── eKYC verification — REQUIRED ───────── */}
        <SectionTitle>Identity verification (eKYC)</SectionTitle>
        <Card>
          {/* Status pill */}
          <div className="flex items-start gap-3">
            <div
              className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl"
              style={{
                background: allDone
                  ? "rgba(0,196,140,.12)"
                  : "rgba(255,159,28,.15)",
                color: allDone ? "var(--accent)" : "var(--warn)",
              }}
            >
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-semibold">
                  {allDone ? "Verified" : "Verification required"}
                </span>
                {allDone && (
                  <BadgeCheck
                    className="h-4 w-4"
                    style={{ color: "var(--accent)" }}
                  />
                )}
              </div>
              <div
                className="mt-0.5 text-[11px]"
                style={{ color: "var(--text-2)" }}
              >
                {allDone
                  ? "Last verified Jan 15, 2024 · Required for all loan applications."
                  : "Scan your National ID front, back, and a selfie to unlock loan applications."}
              </div>
            </div>
            <span
              className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: allDone
                  ? "rgba(0,196,140,.12)"
                  : "rgba(255,159,28,.15)",
                color: allDone ? "var(--accent)" : "#cc7a00",
              }}
            >
              {allDone ? "Active" : "Required"}
            </span>
          </div>

          {/* Captured NID + DOB summary */}
          {allDone && (
            <div
              className="mt-3 rounded-xl p-3"
              style={{ background: "var(--surface-2)" }}
            >
              <div className="kv-row">
                <span>National ID</span>
                <span className="font-mono">1234 5678 ••• 6789</span>
              </div>
              <div className="kv-row">
                <span>Issued / Expires</span>
                <span>2020-03-15 · 2030-12-31</span>
              </div>
              <div className="kv-row">
                <span>Name on ID</span>
                <span>{mockUser.name}</span>
              </div>
            </div>
          )}

          {/* Document tiles */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["front", "back", "selfie"] as const).map((k) => {
              const meta = DOC_META[k];
              const captured = docs[k];
              const I = meta.icon;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => openScanner(k)}
                  className="relative flex flex-col items-center gap-1 rounded-xl p-2 transition active:scale-[.98]"
                  style={{
                    background: "var(--surface)",
                    border: captured
                      ? "1.5px solid var(--accent)"
                      : "1.5px dashed var(--border-strong)",
                  }}
                >
                  <div
                    className="grid h-16 w-full place-items-center rounded-lg text-white"
                    style={{
                      background: captured
                        ? meta.gradient
                        : "var(--surface-2)",
                      color: captured ? "#fff" : "var(--text-3)",
                    }}
                  >
                    <I className="h-7 w-7" />
                  </div>
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {meta.label}
                  </span>
                  <span
                    className="text-[10px]"
                    style={{
                      color: captured ? "var(--accent)" : "var(--text-3)",
                    }}
                  >
                    {captured ? "✓ Captured" : "Tap to scan"}
                  </span>
                  {captured && (
                    <span
                      className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full"
                      style={{
                        background: "var(--accent)",
                        color: "#fff",
                      }}
                    >
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action button */}
          <Button
            variant="secondary"
            className="mt-3"
            leading={<ScanLine className="h-[18px] w-[18px]" />}
            onClick={() => openScanner("front")}
          >
            {allDone ? "Re-scan ID card" : "Start eKYC verification"}
          </Button>
        </Card>

        <p
          className="mt-2 px-1 text-[11px] leading-relaxed"
          style={{ color: "var(--text-3)" }}
        >
          Your eKYC documents are stored encrypted and only used for loan
          decisions and regulatory compliance.
        </p>

        {/* ───────── Personal info form ───────── */}
        <SectionTitle>Personal information</SectionTitle>
        <div className="flex flex-col gap-2.5">
          <Input label="Full name" defaultValue={mockUser.name} />
          <Input label="Phone" defaultValue={mockUser.phone} readOnly />
          <Input label="Email" type="email" defaultValue={mockUser.email} />
          <Input label="Date of birth" type="date" defaultValue="1992-06-15" />
          <Textarea
            label="Address"
            rows={2}
            defaultValue="#12, St. 271, Sangkat Toul Tumpung, Phnom Penh"
          />
          <Input label="Occupation" defaultValue="Software Engineer" />
          <Input label="Monthly income" type="number" defaultValue={850} />
        </div>
      </ScreenBody>
    </Screen>
  );
}

// ────────────────────── Scanner sheet ──────────────────────

function ScannerSheet({
  docKey,
  onCapture,
}: {
  docKey: DocKey;
  onCapture: () => void;
}) {
  const [status, setStatus] = useState<"aim" | "scanning" | "done">("aim");
  const meta = DOC_META[docKey];

  const startScan = () => {
    if (status !== "aim") return;
    setStatus("scanning");
    window.setTimeout(() => {
      setStatus("done");
      window.setTimeout(onCapture, 600);
    }, 1400);
  };

  return (
    <div>
      <h3 className="mb-1 text-[17px] font-semibold">
        Scan your {meta.label.toLowerCase()}
      </h3>
      <p className="mb-3 text-[12px]" style={{ color: "var(--text-2)" }}>
        {docKey === "selfie"
          ? "Look at the camera and stay still. We'll match your face to the ID photo."
          : "Place the card flat on a dark surface. We'll auto-capture when it's in focus."}
      </p>

      {/* Viewfinder */}
      <div
        className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, #1b1f2b 0%, #2d3241 50%, #1b1f2b 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Card outline target */}
        <div className="absolute inset-6 rounded-xl"
             style={{
               border: status === "done"
                 ? "2px solid #00c48c"
                 : "2px dashed rgba(255,255,255,.6)",
               transition: "border-color .3s",
             }}>
          {status === "scanning" && (
            <span
              className="absolute left-3 right-3 h-[2px] rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--primary), transparent)",
                boxShadow: "0 0 12px var(--primary)",
                animation: "qr-sweep 1.4s ease-in-out infinite",
              }}
            />
          )}
        </div>

        <div className="absolute bottom-3 left-0 right-0 text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
            style={{
              background:
                status === "done"
                  ? "rgba(0,196,140,.4)"
                  : status === "scanning"
                    ? "rgba(31,95,255,.4)"
                    : "rgba(255,255,255,.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            {status === "done" ? (
              <>
                <CheckCircle2 className="h-3 w-3" /> Captured
              </>
            ) : status === "scanning" ? (
              <>
                <ScanLine className="h-3 w-3" /> Scanning…
              </>
            ) : (
              <>
                <Upload className="h-3 w-3" /> Align inside the frame
              </>
            )}
          </span>
        </div>
      </div>

      <Button
        className="mt-4"
        onClick={startScan}
        disabled={status !== "aim"}
        leading={<ScanLine className="h-[18px] w-[18px]" />}
      >
        {status === "aim"
          ? "Capture now"
          : status === "scanning"
            ? "Scanning…"
            : "Done"}
      </Button>

      <style jsx>{`
        @keyframes qr-sweep {
          0%,
          100% {
            top: 10%;
            opacity: 0.4;
          }
          50% {
            top: 85%;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
