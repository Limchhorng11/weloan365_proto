"use client";

import { Clock, MapPin, Phone, Search } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { useToast } from "@/lib/hooks/useToast";
import { branches } from "@/lib/mock";

export default function BranchesPage() {
  const toast = useToast();

  return (
    <Screen>
      <NavHeader title="Branch Locator" />
      <ScreenBody>
        <div
          className="relative mb-4 grid h-60 place-items-center overflow-hidden rounded-2xl"
          style={{ background: "linear-gradient(135deg, #d6e4ff, #eef3ff)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(31,95,255,.1) 1px, transparent 1px), linear-gradient(rgba(31,95,255,.1) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          {[
            { top: "40%", left: "30%" },
            { top: "55%", left: "65%" },
            { top: "25%", left: "55%" },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{ ...pos, color: "var(--primary)", animationDelay: `${i * 0.2}s` }}
            >
              <MapPin className="h-7 w-7 drop-shadow" />
            </div>
          ))}
        </div>

        <div className="input-wrap with-prefix mb-4" style={{ padding: "10px 14px" }}>
          <Search className="h-[18px] w-[18px]" style={{ color: "var(--text-3)" }} />
          <input
            type="text"
            placeholder="Search by city or address…"
            className="flex-1 border-none bg-transparent text-sm outline-none"
          />
        </div>

        <ListGroup>
          {branches.map((b) => (
            <ListRow
              key={b.id}
              icon={MapPin}
              title={b.name}
              sub={
                <>
                  <div>{b.address}</div>
                  <div className="mt-2 flex gap-3 text-[11px]" style={{ color: "var(--text-3)" }}>
                    <span className="inline-flex items-center gap-0.5">
                      <Clock className="h-3 w-3" /> {b.hours}
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <Phone className="h-3 w-3" /> {b.phone}
                    </span>
                  </div>
                </>
              }
              right={
                <div>
                  <div>{b.distance}</div>
                  <div className="mt-1 text-[11px] font-semibold" style={{ color: "var(--primary)" }}>
                    Directions ↗
                  </div>
                </div>
              }
              chevron={false}
              onClick={() => toast(`Opening ${b.name}`, "info")}
            />
          ))}
        </ListGroup>
      </ScreenBody>
    </Screen>
  );
}
