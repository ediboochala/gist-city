"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Icon } from "@/components/Icon";
import { useUser } from "@/lib/user-store";

/** Welcome screen. People who already have a profile go straight to the city. */
export default function WelcomePage() {
  const { ready, profile } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (ready && profile) router.replace("/cities");
  }, [ready, profile, router]);

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col bg-danfo px-6 pb-8 pt-10 text-ink">
      <div className="flex flex-1 flex-col justify-center gap-5">
        <span className="flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-ink text-danfo">
          <Icon name="bus" size={40} />
        </span>
        <h1 className="font-display text-[56px] font-extrabold leading-[0.95] tracking-tight">Gist City</h1>
        <p className="max-w-[20rem] text-lg font-medium leading-snug">
          Enter bus. Sit for salon. Pull stool for beer parlour. Gist with the whole Naija.
        </p>
        <ul className="mt-2 flex flex-col gap-2 text-[15px]">
          <li className="flex items-center gap-2"><Icon name="user" size={18} /> For everybody — design your own avatar</li>
          <li className="flex items-center gap-2"><Icon name="mic" size={18} /> Live voice and text in every room</li>
          <li className="flex items-center gap-2"><Icon name="pin" size={18} /> Lagos and Abuja — more cities soon</li>
          <li className="flex items-center gap-2"><Icon name="gift" size={18} /> Free during launch</li>
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <Link href="/signup" className="flex h-14 items-center justify-center rounded-[18px] bg-ink font-display text-lg font-extrabold text-white">
          Make we start
        </Link>
        <Link href="/rules" className="flex h-12 items-center justify-center text-[15px] font-bold underline-offset-4 hover:underline">
          Read the house rules
        </Link>
      </div>
    </main>
  );
}
