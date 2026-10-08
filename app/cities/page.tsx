"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { BottomNav } from "@/components/BottomNav";
import { RequireProfile } from "@/components/RequireProfile";
import { Screen } from "@/components/Screen";
import { CITIES, COMING_SOON_CITIES, getSpots } from "@/lib/data";
import { buzzLevel, cityMood, lagosClock, spotCount } from "@/lib/schedule";
import { useUser } from "@/lib/user-store";
import { cx } from "@/lib/utils";

const PERIOD = { early: "Early morning", morning: "Morning", afternoon: "Afternoon", evening: "Evening", night: "Night" } as const;

/** "Which city you dey go?" — the home screen after sign-up. */
export default function CitiesPage() {
  return (
    <RequireProfile>
      <Cities />
    </RequireProfile>
  );
}

function Cities() {
  const { profile, canCheckIn, dailyCheckIn } = useUser();
  const [clock, setClock] = useState(() => lagosClock());
  useEffect(() => {
    const t = setInterval(() => setClock(lagosClock()), 60_000);
    return () => clearInterval(t);
  }, []);

  const cities = useMemo(
    () =>
      CITIES.map((c) => {
        const total = getSpots(c.id).reduce((sum, s) => sum + spotCount(s, clock), 0) * 9;
        return { ...c, total, buzz: buzzLevel(total) };
      }).sort((a, b) => (a.id === profile?.homeCity ? -1 : b.id === profile?.homeCity ? 1 : b.total - a.total)),
    [clock, profile?.homeCity],
  );
  const hottest = [...cities].sort((a, b) => b.total - a.total)[0]?.id;

  return (
    <Screen>
      <main className="flex flex-1 flex-col gap-5 px-5 pb-6 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted">{PERIOD[clock.period]} for Naija · {clock.label}</p>
            <h1 className="font-display text-[32px] font-extrabold leading-[1.1] tracking-tight">Which city you dey go, {profile?.nickname.split(" ")[0]}?</h1>
          </div>
          {profile && (
            <Link href="/profile" aria-label="My profile" className="shrink-0 transition-transform active:scale-95">
              <Avatar name={profile.nickname} avatar={profile.avatar} size={56} ring />
            </Link>
          )}
        </div>

        <p className="rounded-2xl bg-ink px-4 py-3 text-sm leading-snug text-white">{cityMood("naija", clock)}</p>

        {canCheckIn && (
          <button type="button" onClick={dailyCheckIn} className="flex h-12 items-center justify-between rounded-2xl border-2 border-dashed border-naija bg-naija-soft px-4 text-sm font-bold text-naija">
            <span>Daily check-in</span>
            <span>Collect +20 coins</span>
          </button>
        )}

        {cities.map((c) => {
          const dark = c.theme === "naija";
          return (
            <Link key={c.id} href={`/city/${c.id}`} className={cx("flex flex-col gap-3 rounded-3xl p-5 transition-transform active:scale-[0.98]", dark ? "bg-naija text-white" : "bg-danfo text-ink")}>
              <div className="flex items-center justify-between text-[13px] font-bold">
                <span className={dark ? "text-danfo" : ""}>
                  {c.id === profile?.homeCity ? "Your base" : c.id === hottest ? "Hottest right now" : "Visit"}
                </span>
                <span>{c.total.toLocaleString()} people out</span>
              </div>
              <span className="font-display text-[44px] font-extrabold leading-none">{c.name}</span>
              <span className={cx("text-sm leading-snug", dark && "text-[#E3F2E8]")}>{cityMood(c.id, clock)}</span>
              <span className="flex items-end gap-1" aria-label={`Buzz: ${c.buzz.label}`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className={cx("w-3.5 rounded-[3px]", n <= c.buzz.bars ? (dark ? "bg-white" : "bg-ink") : dark ? "bg-[#3F8C60]" : "bg-ink/20")} style={{ height: 6 + n * 4 }} />
                ))}
                <span className="ml-2 text-xs font-bold">Buzz: {c.buzz.label}</span>
              </span>
            </Link>
          );
        })}

        <section className="flex flex-col gap-2.5">
          <h2 className="text-[13px] font-bold text-muted">Coming soon</h2>
          <div className="flex flex-wrap gap-2">
            {COMING_SOON_CITIES.map((n) => (
              <span key={n} className="flex h-9 items-center rounded-full border border-dashed border-[#CFC3A2] px-3.5 text-[13px] font-bold text-muted">{n}</span>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </Screen>
  );
}
