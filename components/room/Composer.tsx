"use client";

import { useState } from "react";
import { Icon } from "../Icon";
import { cx } from "@/lib/utils";

interface ComposerProps {
  onSend: (text: string) => void;
  placeholder?: string;
  dark?: boolean;
  disabled?: boolean;
  accent?: string; // tailwind bg class for the send button
}

export function Composer({ onSend, placeholder = "Drop your gist...", dark, disabled, accent = "bg-naija" }: ComposerProps) {
  const [text, setText] = useState("");
  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };
  return (
    <div className="flex items-center gap-2">
      <label className="flex-1">
        <span className="sr-only">Message</span>
        <input
          value={text}
          disabled={disabled}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          maxLength={500}
          placeholder={disabled ? "Chat dey closed for this room" : placeholder}
          className={cx(
            "h-12 w-full rounded-full border px-4 text-[15px] outline-none focus:ring-2 focus:ring-danfo",
            dark ? "border-parlour-edge bg-parlour-card text-white placeholder:text-[#9B927E]" : "border-line bg-cream text-ink placeholder:text-muted",
          )}
        />
      </label>
      <button
        type="button"
        onClick={submit}
        disabled={disabled || !text.trim()}
        aria-label="Send message"
        className={cx("flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40", accent)}
      >
        <Icon name="send" />
      </button>
    </div>
  );
}
