"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useMemo, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { RequireProfile } from "@/components/RequireProfile";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { Avatar } from "@/components/Avatar";
import { DEMO_PEOPLE, getCity, getSpots } from "@/lib/data";
import { cityMood, isRoomOpen, lagosClock, spotCount } from "@/lib/schedule";
import type { Spot, SpotCategory, SpotKind } from "@/lib/types";
import { cx, hash } from "@/lib/utils";

const FILTERS: { id: "all" | SpotCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "rides", label: "Rides" },
  { id: "hangouts", label: "Hangouts" },
  { id: "style", label: "Salon & Barbing" },
  { id: "faith", label: "Faith" },
];

const TAG: Record<SpotKind, { tag: string; tint: string }> = {
  bus: { tag: "BUS", tint: "bg-danfo-soft" },
  taxi: { tag: "TAXI", tint: "bg-danfo-soft" },
  keke: { tag: "KEKE", tint: "bg-danfo-soft" },
  salon: { tag: "SLN", tint: "bg-salon-soft" },
  barber: { tag: "CUT", tint: "bg-barber-soft" },
  parlour: { tag: "BAR", tint: "bg-[#F3EAD3]" },
  church: { tag: "CH", tint: "bg-church-soft" },
  mosque: { tag: "MSQ", tint: "bg-mosque-soft" },
  lounge: { tag: "VIBE", tint: "bg-naija-soft" },
  market: { tag: "MKT", tint: "bg-naija-soft" },
  office: { tag: "OFC", tint: "bg-naija-soft" },
};

export default function CityPage({ params }: { params: { cityId: string } }) {
  const city = getCity(params.cityId);
  if (!city) notFound();
  return (
    <RequireProfile>
      <CityScreen cityId={city.id} />
    </RequireProfile>
  );
}

function CityScreen({ cityId }: { cityId: "lagos" | "abuja" }) {
  const city = getCity(cityId)!;
  const clock = useMemo(() => lagosClock(), []);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const spots = getSpots(cityId).filter((s) => filter === "all" || s.category === filter);
  const total = getSpots(cityId).reduce((sum, s) => sum + spotCount(s, clock), 0) * 9;
  const lagos = city.theme === "danfo";

  return (
    <Screen>
      <TopBar
        title={city.name}
        subtitle={`${clock.label} · ${total.toLocaleString()} out`}
        backHref="/cities"
        backLabel="Back to cities"
        tone={lagos ? "danfo" : "naija"}
      >
        <p className="text-sm leading-snug">{cityMood(cityId, clock)}</p>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filter spots">
          {FILTERS.map((f) => {
            const on = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(f.id)}
                className={cx(
                  "h-10 shrink-0 rounded-full border-2 px-4 text-[13px] font-bold",
                  lagos ? "border-ink" : "border-white",
                  on ? (lagos ? "bg-ink text-white" : "bg-white text-naija") : lagos ? "bg-danfo text-ink" : "bg-naija text-white",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </TopBar>

      <main className="flex flex-1 flex-col gap-2.5 p-4">
        {spots.map((spot) => (
          <SpotRow key={spot.id} spot={spot} clock={clock} />
        ))}
        {spots.length === 0 && <p className="py-10 text-center text-muted">No spot for this filter yet. Try another one.</p>}
      </main>
      <BottomNav />
    </Screen>
  );
}

function SpotRow({ spot, clock }: { spot: Spot; clock: ReturnType<typeof lagosClock> }) {
  const count = spotCount(spot, clock);
  const open = spot.rooms.some((r) => isRoomOpen(r, clock));
  const single = spot.rooms.length === 1;
  const href = single ? `/room/${spot.rooms[0]!.id}` : `/spot/${spot.id}`;
  const tag = TAG[spot.kind];
  const action = spot.category === "rides" ? "Board" : "Enter";
  return (
    <Link href={href} className="flex items-center gap-3 rounded-[18px] border border-line bg-paper p-3.5 transition-transform active:scale-[0.98]">
      <span className={cx("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-[12px] font-extrabold", tag.tint)}>{tag.tag}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[15px] font-bold">{spot.name}</span>
        <span className="text-[13px] leading-snug text-muted">{spot.area} · {spot.blurb}</span>
        <span className="flex items-center gap-2">
          {open && (
            <span className="flex" aria-hidden="true">
              {[0, 1, 2].map((i) => {
                const person = DEMO_PEOPLE[(hash(spot.id) + i * 5) % DEMO_PEOPLE.length]!;
                return <Avatar key={i} name={person.name} size={22} className={i ? "-ml-1.5 ring-2 ring-paper" : "ring-2 ring-paper"} />;
              })}
            </span>
          )}
          <span className={cx("text-xs font-bold", open ? "text-naija" : "text-muted")}>
            {open ? `${count} inside${single ? "" : ` · ${spot.rooms.length} rooms`}` : "Closed right now"}
          </span>
        </span>
      </span>
      <span className={cx("flex h-11 shrink-0 items-center rounded-xl px-3.5 text-[13px] font-bold", open ? "bg-ink text-white" : "border border-line text-muted")}>
        {open ? action : "Peep"}
      </span>
    </Link>
  );
}
