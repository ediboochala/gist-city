"use client";

import { Avatar } from "../Avatar";
import type { Member } from "@/lib/types";
import { cx } from "@/lib/utils";

interface SpeakerGridProps {
  members: Member[];
  title: string;
  listenersLabel: string;
  listeners: number;
  emptySeatLabel?: string;
  dark?: boolean;
  onMemberTap?: (m: Member) => void;
}

/** The "front seats" / "in the chair" row of people on the mic. */
export function SpeakerGrid({ members, title, listenersLabel, listeners, emptySeatLabel = "Empty seat", dark, onMemberTap }: SpeakerGridProps) {
  const onMic = members.filter((m) => m.onMic);
  const seats = onMic.slice(0, 7);
  return (
    <section className={cx("flex flex-col gap-3 border-b px-4 py-4", dark ? "border-parlour-edge" : "border-line")}>
      <div className="flex items-center justify-between">
        <h2 className={cx("text-[13px] font-bold", dark ? "text-[#CFC6B0]" : "text-muted")}>{title}</h2>
        <span className={cx("text-[13px]", dark ? "text-[#CFC6B0]" : "text-muted")}>
          {listeners} {listenersLabel}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {seats.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onMemberTap?.(m)}
            className="flex flex-col items-center gap-1.5 rounded-xl py-1 transition-transform active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-danfo"
          >
            <Avatar name={m.name} avatar={m.avatar} size={56} speaking={m.speaking} muted={m.muted} handRaised={m.handRaised} ring={m.role === "You"} />
            <span className="max-w-full truncate text-xs font-bold">{m.role === "You" ? "You" : m.name}</span>
            {m.role && m.role !== "You" && <span className="text-[10px] font-bold text-naija">{m.role}</span>}
          </button>
        ))}
        {seats.length < 4 &&
          Array.from({ length: 4 - seats.length }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 py-1">
              <span className={cx("flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed", dark ? "border-parlour-edge" : "border-[#CFC3A2]")} />
              <span className="text-xs font-bold">{emptySeatLabel}</span>
            </div>
          ))}
      </div>
      {members.some((m) => !m.onMic && m.handRaised) && (
        <p className={cx("text-xs", dark ? "text-[#CFC6B0]" : "text-muted")}>
          Hands up: {members.filter((m) => !m.onMic && m.handRaised).map((m) => (m.role === "You" ? "You" : m.name)).join(", ")}
        </p>
      )}
    </section>
  );
}
