"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";
import { RequireProfile } from "@/components/RequireProfile";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { STATES, stateSlug } from "@/lib/data";
import { useUser } from "@/lib/user-store";
import { cx } from "@/lib/utils";

/** All 36 states + FCT. Each state is a text notice board. */
export default function NaijaPage() {
  return (
    <RequireProfile>
      <Naija />
    </RequireProfile>
  );
}

function Naija() {
  const { profile } = useUser();
  const [query, setQuery] = useState("");
  const list = useMemo(() => STATES.filter((s) => s.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const mine = profile?.stateOfOrigin;

  return (
    <Screen>
      <TopBar title="Naija Rooms" subtitle="36 states + FCT · gist about home" backHref="/cities" tone="naija">
        <label className="relative block">
          <span className="sr-only">Find your state</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"><Icon name="search" size={18} /></span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find your state..." className="h-12 w-full rounded-2xl bg-paper pl-11 pr-4 text-[15px] text-ink" />
        </label>
      </TopBar>
      <main className="flex flex-1 flex-col gap-4 p-4">
        {mine && !query && (
          <Link href={`/room/state-${stateSlug(mine)}`} className="flex flex-col gap-1 rounded-[20px] bg-ink p-4 text-white">
            <span className="text-xs font-bold text-danfo">Your state</span>
            <span className="font-display text-2xl font-extrabold">{mine} Room</span>
            <span className="text-sm text-[#D9D2C0]">News, events and gist from home</span>
          </Link>
        )}
        <div className="grid grid-cols-3 gap-2">
          {list.map((s) => (
            <Link
              key={s}
              href={`/room/state-${stateSlug(s)}`}
              className={cx("flex h-12 items-center justify-center rounded-xl border px-1 text-center text-[13px] font-bold", s === mine ? "border-naija bg-naija text-white" : "border-line bg-paper")}
            >
              {s}
            </Link>
          ))}
        </div>
        {list.length === 0 && <p className="text-center text-muted">No state match &ldquo;{query}&rdquo;. Check the spelling.</p>}
      </main>
      <BottomNav />
    </Screen>
  );
}
