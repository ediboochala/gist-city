"use client";

import { REACTIONS } from "@/lib/data";
import type { FloatingReaction } from "@/lib/realtime";
import { cx } from "@/lib/utils";

/** Row of quick reactions. Tapping one sends it floating up the room for everybody. */
interface ReactionBarProps {
  onThrow: (emoji: string) => void;
  dark?: boolean;
  /** Optional gift button that opens the dash tray */
  onGift?: () => void;
  giftOpen?: boolean;
}

export function ReactionBar({ onThrow, dark, onGift, giftOpen }: ReactionBarProps) {
  return (
    <div className="flex justify-between gap-1" aria-label="Throw a reaction">
      {REACTIONS.map((e) => (
        <button
          key={e}
          type="button"
          onClick={() => onThrow(e)}
          aria-label={`Throw ${e}`}
          className={cx(
            "flex h-11 flex-1 items-center justify-center rounded-2xl text-xl transition-transform active:scale-75",
            dark ? "bg-parlour-edge" : "bg-cream",
          )}
        >
          {e}
        </button>
      ))}
      {onGift && (
        <button
          type="button"
          onClick={onGift}
          aria-expanded={giftOpen}
          className={cx(
            "flex h-11 shrink-0 items-center rounded-2xl px-3 text-sm font-bold transition-transform active:scale-90",
            giftOpen ? "bg-naija text-white" : dark ? "bg-danfo text-ink" : "bg-ink text-white",
          )}
        >
          Dash
        </button>
      )}
    </div>
  );
}

/** The emojis floating up the screen. Place inside a `relative` container. */
export function FloatingLayer({ floats }: { floats: FloatingReaction[] }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-64 overflow-hidden" aria-hidden="true">
      {floats.map((f) => (
        <span key={f.id} className="absolute bottom-2 animate-float-up text-3xl" style={{ left: `${f.left}%` }}>
          {f.emoji}
        </span>
      ))}
    </div>
  );
}
