"use client";

import { useEffect, useState } from "react";
import { Icon } from "../Icon";
import type { RoomKind } from "@/lib/types";
import { storage } from "@/lib/utils";

const TIPS: Partial<Record<RoomKind, string>> = {
  ride: "Welcome aboard! The bus moves from stop to stop. When you wan comot, press the red Owa button.",
  salon: "Tap anybody in the chair to see their profile. Raise your hand to join the talk.",
  table: "Pull up a stool. Tap a message to react, or buy the table something with a dash.",
  department: "Be gentle here. Tap a message to show love, or share your own.",
  lounge: "Throw reactions with the emoji row — everybody go see am fly.",
  state: "This na your state notice board. Share news and events from home.",
};

/** One-time tip the first time someone enters each type of room. */
export function CoachTip({ kind, dark }: { kind: RoomKind; dark?: boolean }) {
  const key = `gc:tip:${kind}`;
  const [show, setShow] = useState(false);
  useEffect(() => setShow(!storage.get<boolean>(key, false)), [key]);
  if (!show || !TIPS[kind]) return null;
  const close = () => {
    storage.set(key, true);
    setShow(false);
  };
  return (
    <div className={`mx-4 mt-3 flex animate-slide-up items-start gap-3 rounded-2xl p-3 text-sm ${dark ? "bg-danfo text-ink" : "bg-danfo-soft text-ink"}`}>
      <Icon name="smile" className="mt-0.5 shrink-0" />
      <p className="flex-1 leading-snug">{TIPS[kind]}</p>
      <button type="button" onClick={close} className="h-9 shrink-0 rounded-xl bg-ink px-3 text-xs font-bold text-white">
        I don hear
      </button>
    </div>
  );
}
