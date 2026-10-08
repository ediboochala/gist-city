"use client";

// Sign-up: phone → code → nickname → build your avatar → home city → state → house rules → welcome.
// In local mode the phone code is not really sent; any 4 digits work.
// With Supabase connected, use supabase.auth.signInWithOtp({ phone }) here.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { AvatarBuilder } from "@/components/AvatarBuilder";
import { Icon } from "@/components/Icon";
import { randomAvatar, type AvatarConfig } from "@/lib/avatar";
import { CITIES, HOUSE_RULES, STATES } from "@/lib/data";
import type { CityId } from "@/lib/types";
import { useUser } from "@/lib/user-store";
import { cx } from "@/lib/utils";

const STEPS = ["phone", "code", "nickname", "avatar", "city", "state", "rules", "done"] as const;
type Step = (typeof STEPS)[number];

export default function SignupPage() {
  const router = useRouter();
  const { createProfile } = useUser();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState<AvatarConfig>(() => randomAvatar());
  const [city, setCity] = useState<CityId>("lagos");
  const [stateName, setStateName] = useState("Lagos");
  const [agreed, setAgreed] = useState(false);

  const index = STEPS.indexOf(step);
  const back = () => (index === 0 ? router.push("/") : setStep(STEPS[index - 1]!));

  const phoneDigits = phone.replace(/\D/g, "");
  const shownNick = nickname.trim() || "New Passenger";

  const canContinue: Record<Step, boolean> = {
    phone: phoneDigits.length >= 10,
    code: /^\d{4,6}$/.test(code),
    nickname: nickname.trim().length >= 2,
    city: true,
    state: true,
    avatar: true,
    rules: agreed,
    done: true,
  };

  const next = () => {
    if (!canContinue[step]) return;
    if (step === "rules") {
      createProfile({
        nickname: nickname.trim(),
        colour: avatar.bg,
        avatar,
        phone: `+234${phoneDigits.replace(/^0/, "")}`,
        homeCity: city,
        stateOfOrigin: stateName,
        agreedRules: true,
      });
    }
    setStep(STEPS[index + 1]!);
  };

  const nextLabel: Partial<Record<Step, string>> = {
    phone: "Send me code",
    code: "Confirm code",
    avatar: "Na me be this!",
    rules: "I gree, carry me enter",
  };

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col gap-5 bg-cream px-5 pb-6 pt-5">
      {step !== "done" && (
        <div className="flex items-center gap-3">
          <button type="button" onClick={back} aria-label="Go back" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-paper">
            <Icon name="back" />
          </button>
          <div className="grid flex-1 gap-1.5" style={{ gridTemplateColumns: `repeat(${STEPS.length - 1}, minmax(0, 1fr))` }} aria-label={`Step ${index + 1} of ${STEPS.length - 1}`}>
            {STEPS.slice(0, -1).map((s, i) => (
              <span key={s} className={cx("h-1.5 rounded-full", i <= index ? "bg-ink" : "bg-line")} />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4">
        {step === "phone" && (
          <>
            <Title>Wetin be your phone number?</Title>
            <Lead>We go send you small code. Nobody for the app go see your number.</Lead>
            <label className="flex flex-col gap-1.5 text-[13px] font-bold">
              Phone number
              <div className="flex gap-2">
                <span className="flex h-[52px] items-center rounded-2xl border border-line bg-paper px-4 text-base">+234</span>
                <input type="tel" inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="803 000 0000" className="h-[52px] min-w-0 flex-1 rounded-2xl border border-line bg-paper px-4 text-base font-normal" />
              </div>
            </label>
          </>
        )}

        {step === "code" && (
          <>
            <Title>Enter the code</Title>
            <Lead>We send am to +234 {phoneDigits.replace(/^0/, "")}. (Local mode: type any 4 digits.)</Lead>
            <label className="flex flex-col gap-1.5 text-[13px] font-bold">
              Verification code
              <input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="1234" className="h-[52px] rounded-2xl border border-line bg-paper px-4 text-center font-display text-2xl tracking-[0.5em]" />
            </label>
          </>
        )}

        {step === "nickname" && (
          <>
            <Title>Wetin we go dey call you?</Title>
            <Lead>Pick nickname. Na this one people go see for bus and salon.</Lead>
            <label className="flex flex-col gap-1.5 text-[13px] font-bold">
              Nickname
              <input value={nickname} maxLength={24} onChange={(e) => setNickname(e.target.value)} placeholder="e.g. Ada Lagos" className="h-[52px] rounded-2xl border border-line bg-paper px-4 text-base font-normal" />
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-4">
              <Avatar name={shownNick} avatar={avatar} size={52} />
              <div>
                <p className="font-bold">{shownNick}</p>
                <p className="text-[13px] text-muted">Next, you go design your avatar</p>
              </div>
            </div>
          </>
        )}

        {step === "avatar" && (
          <>
            <Title>Design your avatar</Title>
            <Lead>Pick your face, hair, outfit and vibe. You fit change am anytime for your profile.</Lead>
            <AvatarBuilder value={avatar} onChange={setAvatar} name={shownNick} />
          </>
        )}

        {step === "city" && (
          <>
            <Title>Which city be your base?</Title>
            <Lead>You fit visit the other city anytime.</Lead>
            {CITIES.map((c) => {
              const on = c.id === city;
              return (
                <button key={c.id} type="button" aria-pressed={on} onClick={() => setCity(c.id)} className={cx("flex flex-col gap-1 rounded-[20px] border-[3px] p-5 text-left", on ? "border-ink" : "border-line", on ? (c.theme === "danfo" ? "bg-danfo text-ink" : "bg-naija text-white") : "bg-paper")}>
                  <span className="font-display text-3xl font-extrabold">{c.name}</span>
                  <span className="text-sm">{c.tagline}</span>
                </button>
              );
            })}
          </>
        )}

        {step === "state" && (
          <>
            <Title>Where you come from?</Title>
            <Lead>Pick your state. We go show you your state room — una fit gist about home.</Lead>
            <label className="flex flex-col gap-1.5 text-[13px] font-bold">
              State of origin
              <select value={stateName} onChange={(e) => setStateName(e.target.value)} className="h-[52px] rounded-2xl border border-line bg-paper px-3 text-base font-normal">
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <p className="rounded-2xl bg-naija-soft p-4 text-sm">You fit join other state rooms anytime.</p>
          </>
        )}

        {step === "rules" && (
          <>
            <Title>House rules for Gist City</Title>
            {HOUSE_RULES.map((r) => (
              <div key={r.title} className="rounded-2xl border border-line bg-paper p-4">
                <p className="font-bold">{r.title}</p>
                <p className="text-sm text-muted">{r.body}</p>
              </div>
            ))}
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-danfo-soft p-4 text-sm font-bold leading-snug">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-6 w-6 shrink-0 accent-ink" />
              I be 18 or older, and I agree to the house rules
            </label>
          </>
        )}

        {step === "done" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <span className="animate-pop"><Avatar name={shownNick} avatar={avatar} size={120} ring /></span>
            <Title>Welcome to {CITIES.find((c) => c.id === city)?.name}, {shownNick}!</Title>
            <Lead>Bus dey wait. Salon dey open. {stateName} people dey your state room. You get 250 Gist Coins to start.</Lead>
          </div>
        )}
      </div>

      {step === "done" ? (
        <Link href={`/city/${city}`} className="flex h-14 items-center justify-center rounded-[18px] bg-ink font-display text-lg font-extrabold text-white">
          Enter the city
        </Link>
      ) : (
        <button type="button" onClick={next} disabled={!canContinue[step]} className="h-14 rounded-[18px] bg-ink font-display text-lg font-extrabold text-white disabled:bg-line disabled:text-muted">
          {nextLabel[step] ?? "Continue"}
        </button>
      )}
    </main>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="font-display text-[30px] font-extrabold leading-[1.1]">{children}</h1>;
}
function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-snug text-muted">{children}</p>;
}
