"use client";

import { DASHES } from "@/lib/data";
import { cx } from "@/lib/utils";

interface DashTrayProps {
  onDash: (id: string) => void;
  balance: number;
  dark?: boolean;
}

/** Row of virtual gifts. Each dash costs Gist Coins. */
export function DashTray({ onDash, balance, dark }: DashTrayProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Send a dash">
      {DASHES.map((d) => (
        <button
          key={d.id}
          type="button"
          disabled={balance < d.cost}
          onClick={() => onDash(d.id)}
          className={cx(
            "h-10 shrink-0 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-bold disabled:opacity-40",
            dark ? "border-parlour-edge bg-parlour-card text-white" : "border-line bg-cream text-ink",
          )}
        >
          Dash {d.name} · {d.cost}
        </button>
      ))}
    </div>
  );
}
