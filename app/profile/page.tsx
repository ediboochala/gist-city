"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { AvatarBuilder } from "@/components/AvatarBuilder";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";
import type { AvatarConfig } from "@/lib/avatar";
import { BottomNav } from "@/components/BottomNav";
import { RequireProfile } from "@/components/RequireProfile";
import { Screen } from "@/components/Screen";
import { BADGES, CITIES, STATES } from "@/lib/data";
import type { CityId } from "@/lib/types";
import { DAILY_CHECKIN, useUser } from "@/lib/user-store";
import { cx, timeAgo } from "@/lib/utils";

type Tab = "wallet" | "badges" | "settings";

export default function ProfilePage() {
  return (
    <RequireProfile>
      <Profile />
    </RequireProfile>
  );
}

function Profile() {
  const user = useUser();
  const p = user.profile!;
  const [tab, setTab] = useState<Tab>("wallet");
  const [editing, setEditing] = useState(false);
  const topBadge = BADGES.filter((b) => user.earnedBadges.includes(b.id)).at(-1);

  return (
    <Screen>
      <header className="flex flex-col gap-4 px-5 pb-4 pt-6">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setEditing(true)} aria-label="Edit my avatar" className="relative rounded-full transition-transform active:scale-95">
            <Avatar name={p.nickname} avatar={p.avatar} size={84} ring />
            <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white ring-2 ring-cream">
              <Icon name="edit" size={16} />
            </span>
          </button>
          <div className="min-w-0">
            <h1 className="truncate font-display text-[26px] font-extrabold leading-none">{p.nickname}</h1>
            <p className="mt-1 text-sm text-muted">Base: {CITIES.find((c) => c.id === p.homeCity)?.name} · From: {p.stateOfOrigin}</p>
            <p className="text-[13px] font-bold text-naija">{topBadge ? `${topBadge.name} · ${user.stats.rides} rides` : `${user.stats.rides} rides so far`}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2" role="tablist">
          {(["wallet", "badges", "settings"] as Tab[]).map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cx("h-11 rounded-2xl border-2 border-ink text-sm font-bold capitalize", tab === t ? "bg-ink text-white" : "bg-paper")}>
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-3 px-5 pb-6">
        {tab === "wallet" && <Wallet />}
        {tab === "badges" && <Badges />}
        {tab === "settings" && <Settings />}
      </main>
      <BottomNav />
      {editing && <EditAvatar initial={p.avatar} name={p.nickname} onClose={() => setEditing(false)} />}
    </Screen>
  );
}

function EditAvatar({ initial, name, onClose }: { initial: AvatarConfig; name: string; onClose: () => void }) {
  const { updateProfile } = useUser();
  const toast = useToast();
  const [draft, setDraft] = useState(initial);
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50" role="dialog" aria-modal="true" aria-labelledby="edit-avatar">
      <div className="flex max-h-[92dvh] w-full max-w-md animate-slide-up flex-col rounded-t-3xl bg-cream">
        <div className="flex items-center justify-between p-5 pb-3">
          <h2 id="edit-avatar" className="font-display text-xl font-extrabold">Edit my avatar</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper">
            <Icon name="close" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          <AvatarBuilder value={draft} onChange={setDraft} name={name} />
        </div>
        <div className="border-t border-line p-4">
          <button
            type="button"
            onClick={() => {
              updateProfile({ avatar: draft });
              toast("Your new look don set!", "naija");
              onClose();
            }}
            className="h-14 w-full rounded-[18px] bg-ink font-display text-lg font-extrabold text-white"
          >
            Save my look
          </button>
        </div>
      </div>
    </div>
  );
}

function Wallet() {
  const { balance, wallet, canCheckIn, dailyCheckIn } = useUser();
  return (
    <>
      <section className="flex flex-col gap-3 rounded-3xl bg-ink p-5 text-white">
        <h2 className="text-[13px] font-bold text-danfo">Dash Wallet</h2>
        <p className="flex items-baseline gap-2">
          <span className="font-display text-[44px] font-extrabold leading-none">{balance}</span>
          <span className="text-[#D9D2C0]">Gist Coins</span>
        </p>
        <p className="rounded-2xl bg-parlour-edge px-3 py-2.5 text-[13px] leading-snug text-[#EDE6D3]">
          Fares dey free during launch. When bus fare start, you go see am here first.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={dailyCheckIn} disabled={!canCheckIn} className="h-12 rounded-2xl bg-danfo font-bold text-ink disabled:opacity-50">
            {canCheckIn ? `Check in +${DAILY_CHECKIN}` : "Checked in today"}
          </button>
          <button type="button" disabled className="h-12 rounded-2xl border border-muted font-bold text-[#D9D2C0]">Top up · soon</button>
        </div>
      </section>
      <h2 className="mt-2 text-[13px] font-bold text-muted">Recent</h2>
      {wallet.length === 0 && <p className="text-sm text-muted">No activity yet. Dash somebody for a room to start.</p>}
      {wallet.slice(0, 20).map((e) => (
        <div key={e.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
          <div>
            <p className="text-sm font-bold">{e.what}</p>
            <p className="text-xs text-muted">{e.where} · {timeAgo(e.at)}</p>
          </div>
          <span className={cx("font-extrabold", e.amount >= 0 ? "text-naija" : "text-owa")}>{e.amount >= 0 ? `+${e.amount}` : e.amount}</span>
        </div>
      ))}
    </>
  );
}

function Badges() {
  const { earnedBadges } = useUser();
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {BADGES.map((b) => {
        const earned = earnedBadges.includes(b.id);
        return (
          <div key={b.id} className={cx("flex flex-col gap-1.5 rounded-[18px] border p-3.5", earned ? "border-line bg-paper" : "border-line bg-[#F7F1E1]")}>
            <span className={cx("flex h-10 w-10 items-center justify-center rounded-full font-display text-[13px] font-extrabold", earned ? "bg-danfo" : "bg-line text-muted")}>{b.tag}</span>
            <span className="font-bold">{b.name}</span>
            <span className="text-xs leading-snug text-muted">{b.how}{earned ? "" : " · locked"}</span>
          </div>
        );
      })}
    </div>
  );
}

function Settings() {
  const router = useRouter();
  const { profile, updateProfile, settings, setSettings, signOut } = useUser();
  const p = profile!;
  return (
    <div className="flex flex-col gap-4">
      <Toggle label="Data saver" hint="Voice off, text only. Saves your data." on={settings.dataSaver} onChange={(v) => setSettings({ dataSaver: v })} />
      <Toggle label="Sounds" hint="Bus horn, pops and coin sounds" on={settings.sounds} onChange={(v) => setSettings({ sounds: v })} />
      <Toggle label="Vibration" hint="Buzz when you shout Owa or get to your stop" on={settings.vibrate} onChange={(v) => setSettings({ vibrate: v })} />
      <label className="flex flex-col gap-1.5 text-[13px] font-bold">
        Nickname
        <input value={p.nickname} maxLength={24} onChange={(e) => updateProfile({ nickname: e.target.value })} className="h-12 rounded-2xl border border-line bg-paper px-4 text-base font-normal" />
      </label>
      <label className="flex flex-col gap-1.5 text-[13px] font-bold">
        Home city
        <select value={p.homeCity} onChange={(e) => updateProfile({ homeCity: e.target.value as CityId })} className="h-12 rounded-2xl border border-line bg-paper px-3 text-base font-normal">
          {CITIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-[13px] font-bold">
        State of origin
        <select value={p.stateOfOrigin} onChange={(e) => updateProfile({ stateOfOrigin: e.target.value })} className="h-12 rounded-2xl border border-line bg-paper px-3 text-base font-normal">
          {STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <button
        type="button"
        onClick={() => {
          if (window.confirm("Sign out and clear this device? Your coins and badges for local mode go clear.")) {
            signOut();
            router.replace("/");
          }
        }}
        className="h-12 rounded-2xl border-2 border-owa font-bold text-owa"
      >
        Sign out
      </button>
    </div>
  );
}

function Toggle({ label, hint, on, onChange }: { label: string; hint: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-line bg-paper p-4">
      <span>
        <span className="block font-bold">{label}</span>
        <span className="block text-sm text-muted">{hint}</span>
      </span>
      <input type="checkbox" role="switch" checked={on} onChange={(e) => onChange(e.target.checked)} className="h-6 w-6 accent-naija" />
    </label>
  );
}
