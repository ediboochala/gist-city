"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useMemo } from "react";
import { BottomNav } from "@/components/BottomNav";
import { RequireProfile } from "@/components/RequireProfile";
import { Screen } from "@/components/Screen";
import { TopBar, type Tone } from "@/components/TopBar";
import { getSpot } from "@/lib/data";
import { closedReason, lagosClock, liveCount } from "@/lib/schedule";
import type { Spot } from "@/lib/types";
import { useUser } from "@/lib/user-store";
import { cx } from "@/lib/utils";

/** A spot with several rooms: church departments, mosque circles, parlour tables, bus lines. */
export default function SpotPage({ params }: { params: { spotId: string } }) {
  const spot = getSpot(params.spotId);
  if (!spot) notFound();
  return (
    <RequireProfile>
      <SpotScreen spot={spot} />
    </RequireProfile>
  );
}

function toneFor(spot: Spot): Tone {
  if (spot.kind === "church") return "church";
  if (spot.kind === "mosque") return "mosque";
  if (spot.kind === "parlour" || spot.category === "rides") return "dark";
  if (spot.kind === "salon") return "salon";
  if (spot.kind === "barber") return "barber";
  return spot.cityId === "abuja" ? "naija" : "danfo";
}

const HEADINGS: Partial<Record<Spot["kind"], string>> = {
  church: "Departments",
  mosque: "Circles",
  parlour: "Pick a table, pull up a stool",
  bus: "Buses on this route",
};

function SpotScreen({ spot }: { spot: Spot }) {
  const { visitSpot } = useUser();
  const clock = useMemo(() => lagosClock(), []);
  useEffect(() => visitSpot(spot.id, spot.cityId), [spot.id, spot.cityId, visitSpot]);
  const tone = toneFor(spot);
  const btn =
    tone === "church" ? "bg-church" : tone === "mosque" ? "bg-mosque" : tone === "salon" ? "bg-salon" : tone === "barber" ? "bg-barber" : "bg-ink";

  return (
    <Screen>
      <TopBar title={spot.name} subtitle={`${spot.area}, ${spot.cityId === "lagos" ? "Lagos" : "Abuja"}`} backHref={`/city/${spot.cityId}`} tone={tone}>
        <p className="text-sm leading-snug opacity-90">{spot.blurb}</p>
      </TopBar>
      <main className="flex flex-1 flex-col gap-3 p-4">
        <h2 className="text-[13px] font-bold text-muted">{HEADINGS[spot.kind] ?? "Rooms"}</h2>
        {spot.rooms.map((room) => {
          const reason = closedReason(room, clock);
          const count = liveCount(room, clock);
          return (
            <article key={room.id} className="flex flex-col gap-3 rounded-[20px] border border-line bg-paper p-4">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-naija">
                  {room.mode === "voice" ? "Live voice" : room.mode === "quiet" ? "Quiet room" : "Text + voice notes"}
                  {room.adultsOnly && " · 18+"}
                </span>
                <span className="text-muted">{reason ?? `${count}/${room.capacity} inside`}</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-extrabold">{room.name}</h3>
                <p className="text-[14px] leading-snug text-[#2E2A22]">{room.topic}</p>
                <p className="mt-1 text-xs text-muted">{room.host.role}: {room.host.name}</p>
              </div>
              {reason ? (
                <span className="flex h-11 items-center justify-center rounded-xl border border-line text-sm font-bold text-muted">{reason}</span>
              ) : (
                <Link href={`/room/${room.id}`} className={cx("flex h-11 items-center justify-center rounded-xl text-sm font-bold text-white", btn)}>
                  {room.kind === "ride" ? "Board this bus" : room.kind === "table" ? "Sit down" : `Enter ${room.name}`}
                </Link>
              )}
            </article>
          );
        })}
      </main>
      <BottomNav />
    </Screen>
  );
}
