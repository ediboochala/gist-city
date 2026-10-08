"use client";

import { Icon } from "../Icon";
import type { VoiceStatus } from "@/lib/voice";
import { cx } from "@/lib/utils";

interface VoiceBarProps {
  status: VoiceStatus;
  level: number;
  handRaised: boolean;
  onToggleMic: () => void;
  onToggleHand: () => void;
  dark?: boolean;
}

const LABEL: Record<VoiceStatus, string> = {
  off: "Voice off",
  listening: "You dey listen",
  requesting: "Asking for your mic…",
  speaking: "You dey on the mic",
  blocked: "Mic blocked — allow it in your browser settings",
};

/** Mic + raise-hand controls with a live level meter. */
export function VoiceBar({ status, level, handRaised, onToggleMic, onToggleHand, dark }: VoiceBarProps) {
  const speaking = status === "speaking";
  return (
    <div className={cx("flex items-center gap-2 rounded-2xl px-3 py-2", dark ? "bg-parlour-card" : "bg-cream")}>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex h-6 items-end gap-0.5" aria-hidden="true">
          {[0.2, 0.45, 0.7, 1].map((t) => (
            <span key={t} className={cx("w-1 rounded-sm", speaking && level >= t * 0.8 ? "bg-naija" : dark ? "bg-parlour-edge" : "bg-line")} style={{ height: `${t * 24}px` }} />
          ))}
        </div>
        <span className={cx("truncate text-[13px] font-medium", dark ? "text-[#CFC6B0]" : "text-muted")}>{LABEL[status]}</span>
      </div>
      <button
        type="button"
        onClick={onToggleHand}
        aria-pressed={handRaised}
        aria-label={handRaised ? "Lower hand" : "Raise hand to speak"}
        className={cx("flex h-11 w-11 items-center justify-center rounded-full border", handRaised ? "border-danfo bg-danfo text-ink" : dark ? "border-parlour-edge text-white" : "border-line bg-paper text-ink")}
      >
        <Icon name="hand" />
      </button>
      <button
        type="button"
        onClick={onToggleMic}
        aria-pressed={speaking}
        aria-label={speaking ? "Turn mic off" : "Turn mic on"}
        className={cx("flex h-11 w-11 items-center justify-center rounded-full text-white", speaking ? "bg-naija" : "bg-ink")}
      >
        <Icon name={speaking ? "mic" : "micOff"} />
      </button>
    </div>
  );
}
