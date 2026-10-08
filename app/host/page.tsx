"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { RequireProfile } from "@/components/RequireProfile";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { CITIES } from "@/lib/data";
import type { CityId } from "@/lib/types";
import { useUser } from "@/lib/user-store";
import { cx, timeAgo } from "@/lib/utils";

/** Start your own bus and become the conductor. */
export default function HostPage() {
  return (
    <RequireProfile>
      <Host />
    </RequireProfile>
  );
}

function Host() {
  const router = useRouter();
  const { profile, hosted, hostRide } = useUser();
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [city, setCity] = useState<CityId>(profile?.homeCity ?? "lagos");
  const valid = name.trim().length >= 3 && topic.trim().length >= 5;

  const start = () => {
    if (!valid) return;
    const ride = hostRide({ name: name.trim(), topic: topic.trim(), cityId: city });
    router.push(`/room/hosted-${ride.id}`);
  };

  return (
    <Screen>
      <TopBar title="Start a bus" subtitle="You go be the conductor" backHref="/cities" tone="danfo" />
      <main className="flex flex-1 flex-col gap-4 p-5">
        <p className="rounded-2xl bg-naija-soft p-4 text-sm leading-snug">
          As conductor, you control the mic, move the bus from stop to stop, and fit drop anybody wey dey cause wahala. When fares start, hosts go share from the fare and dashes.
        </p>
        <label className="flex flex-col gap-1.5 text-[13px] font-bold">
          Bus name
          <input value={name} maxLength={32} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lekki Night Express" className="h-12 rounded-2xl border border-line bg-paper px-4 text-base font-normal" />
        </label>
        <label className="flex flex-col gap-1.5 text-[13px] font-bold">
          Wetin una go gist about?
          <textarea value={topic} maxLength={120} onChange={(e) => setTopic(e.target.value)} rows={3} placeholder="e.g. Your worst landlord story" className="rounded-2xl border border-line bg-paper p-4 text-base font-normal" />
        </label>
        <fieldset>
          <legend className="mb-2 text-[13px] font-bold">City</legend>
          <div className="grid grid-cols-2 gap-2">
            {CITIES.map((c) => (
              <button key={c.id} type="button" aria-pressed={city === c.id} onClick={() => setCity(c.id)} className={cx("h-12 rounded-2xl border-2 font-bold", city === c.id ? "border-ink bg-ink text-white" : "border-line bg-paper")}>
                {c.name}
              </button>
            ))}
          </div>
        </fieldset>
        <button type="button" onClick={start} disabled={!valid} className="h-14 rounded-[18px] bg-ink font-display text-lg font-extrabold text-white disabled:bg-line disabled:text-muted">
          Start the bus
        </button>

        {hosted.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="text-[13px] font-bold text-muted">Your buses</h2>
            {hosted.map((h) => (
              <Link key={h.id} href={`/room/hosted-${h.id}`} className="flex flex-col gap-0.5 rounded-2xl border border-line bg-paper p-4">
                <span className="font-bold">{h.name}</span>
                <span className="text-sm text-muted">{h.topic}</span>
                <span className="text-xs text-naija">{CITIES.find((c) => c.id === h.cityId)?.name} · started {timeAgo(h.at)}</span>
              </Link>
            ))}
          </section>
        )}
      </main>
      <BottomNav />
    </Screen>
  );
}
