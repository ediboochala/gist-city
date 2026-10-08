"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "../Avatar";
import { REACTIONS } from "@/lib/data";
import type { ChatMessage } from "@/lib/types";
import { cx } from "@/lib/utils";

interface ChatListProps {
  messages: ChatMessage[];
  myId?: string;
  dark?: boolean;
  nameColour?: string;
  typing?: string | null;
  onReact?: (messageId: string, emoji: string) => void;
}

/**
 * Scrolling chat with avatars. Tap any message to react to it.
 * System, Owa and dash messages show as centred pills.
 */
export function ChatList({ messages, myId, dark, nameColour = "text-naija", typing, onReact }: ChatListProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const [picker, setPicker] = useState<string | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, typing]);

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3" role="log" aria-live="polite" aria-label="Room chat">
      {messages.length === 0 && (
        <p className={cx("m-auto text-center text-sm", dark ? "text-[#CFC6B0]" : "text-muted")}>Nobody don talk yet. Start the gist.</p>
      )}

      {messages.map((m, i) => {
        if (m.type === "system" || m.type === "owa" || m.type === "dash") {
          return (
            <div
              key={m.id}
              className={cx(
                "animate-slide-up self-center rounded-full px-3 py-1 text-center text-xs font-medium",
                m.type === "owa" && "bg-owa text-white",
                m.type === "dash" && "bg-naija text-white",
                m.type === "system" && (dark ? "bg-parlour-edge text-[#CFC6B0]" : "bg-[#F3EAD3] text-muted"),
              )}
            >
              {m.text}
            </div>
          );
        }

        const mine = m.authorId === myId;
        const prev = messages[i - 1];
        const grouped = prev && prev.authorId === m.authorId && prev.type === "chat";
        const reactions = Object.entries(m.reactions ?? {});

        return (
          <div key={m.id} className={cx("flex animate-slide-up items-end gap-2", mine && "flex-row-reverse")}>
            {!mine && <div className="w-8 shrink-0">{!grouped && <Avatar name={m.authorName} avatar={m.authorAvatar} size={32} />}</div>}
            <div className={cx("flex max-w-[78%] flex-col gap-0.5", mine && "items-end")}>
              {!grouped && <span className={cx("text-xs font-bold", mine ? (dark ? "text-danfo" : "text-ink") : nameColour)}>{mine ? "You" : m.authorName}</span>}
              <button
                type="button"
                onClick={() => setPicker(picker === m.id ? null : m.id)}
                aria-label={`React to message from ${mine ? "you" : m.authorName}`}
                className={cx(
                  "whitespace-pre-wrap break-words px-3 py-2 text-left text-sm leading-snug transition-transform active:scale-[0.98]",
                  mine
                    ? "rounded-[16px_4px_16px_16px] bg-ink text-white"
                    : dark
                      ? "rounded-[4px_16px_16px_16px] bg-parlour-card text-white"
                      : "rounded-[4px_16px_16px_16px] border border-line bg-paper",
                )}
              >
                {m.type === "voice-note" ? "Voice note (local mode)" : m.text}
              </button>

              {picker === m.id && (
                <div className={cx("flex animate-pop gap-1 rounded-full p-1 shadow-lg", dark ? "bg-parlour-edge" : "bg-paper ring-1 ring-line")}>
                  {REACTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      aria-label={`React ${e}`}
                      onClick={() => {
                        onReact?.(m.id, e);
                        setPicker(null);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-lg transition-transform hover:scale-125 active:scale-90"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}

              {reactions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {reactions.map(([e, n]) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => onReact?.(m.id, e)}
                      className={cx("flex h-7 animate-pop items-center gap-1 rounded-full px-2 text-xs font-bold", dark ? "bg-parlour-edge text-white" : "bg-[#F3EAD3] text-ink")}
                    >
                      <span>{e}</span>
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {typing && (
        <div className={cx("flex items-center gap-2 text-xs", dark ? "text-[#CFC6B0]" : "text-muted")}>
          <Avatar name={typing} size={24} />
          <span>{typing} dey type</span>
          <span className="flex gap-0.5" aria-hidden="true">
            {[0, 150, 300].map((d) => (
              <span key={d} className="h-1.5 w-1.5 animate-typing rounded-full bg-current" style={{ animationDelay: `${d}ms` }} />
            ))}
          </span>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
