"use client";

// ---------------------------------------------------------------------------
// Real-time rooms
//
// LOCAL MODE (default): messages are saved per room in localStorage and
// synced between open browser tabs with BroadcastChannel. Open the same room
// in two tabs to see real-time chat working. Demo people post now and then so
// rooms never feel empty while you build.
//
// SUPABASE MODE (later): replace the bodies of `loadMessages`, `publish` and
// `subscribe` with Supabase Realtime (see docs/CONNECTING-SERVICES.md).
// The `useRoom` hook's return value stays the same, so screens don't change.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEMO_GIST, DEMO_PEOPLE, REACTIONS } from "./data";
import type { ChatMessage, Member, MessageType, Profile, Room } from "./types";
import { hash, pick, storage, uid } from "./utils";

const MAX_MESSAGES = 80;
const key = (roomId: string) => `gc:room:${roomId}`;

// ----------------------------- transport ----------------------------------

function loadMessages(roomId: string): ChatMessage[] {
  return storage.get<ChatMessage[]>(key(roomId), []);
}

function saveMessages(roomId: string, messages: ChatMessage[]) {
  storage.set(key(roomId), messages.slice(-MAX_MESSAGES));
}

type Envelope =
  | { kind: "message"; message: ChatMessage }
  | { kind: "clear" }
  | { kind: "react"; messageId: string; emoji: string }
  | { kind: "float"; emoji: string };

export interface FloatingReaction {
  id: string;
  emoji: string;
  /** 0–100: horizontal position in % */
  left: number;
}

function channelFor(roomId: string): BroadcastChannel | null {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) return null;
  return new BroadcastChannel(key(roomId));
}

// ----------------------------- members ------------------------------------

function buildMembers(room: Room, me: Profile | null): Member[] {
  const seed = hash(room.id);
  const size = Math.min(room.kind === "ride" ? room.capacity - 1 : 9, DEMO_PEOPLE.length);
  const people = [...DEMO_PEOPLE]
    .sort((a, b) => (hash(a.name + seed) % 100) - (hash(b.name + seed) % 100))
    .slice(0, Math.max(2, size));

  const host: Member = {
    id: "host",
    name: room.host.name,
    colour: "#F5BE1B",
    role: room.host.role,
    onMic: room.mode === "voice",
  };

  const others: Member[] = people.map((p, i) => ({
    id: `demo-${p.name}`,
    name: p.name,
    colour: p.colour,
    onMic: room.mode === "voice" && i < 2,
    muted: i === 1,
  }));

  const list = [host, ...others];
  if (me) {
    list.push({ id: me.id, name: me.nickname, colour: me.colour, avatar: me.avatar, onMic: false, role: "You" });
  }
  return list;
}

// ----------------------------- the hook -----------------------------------

export interface UseRoomOptions {
  /** Pause demo activity (e.g. data saver or quiet rooms). */
  quietDemo?: boolean;
}

export function useRoom(room: Room | undefined, me: Profile | null, opts: UseRoomOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const [floats, setFloats] = useState<FloatingReaction[]>([]);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const roomId = room?.id;

  const spawnFloat = useCallback((emoji: string) => {
    const f: FloatingReaction = { id: uid("f"), emoji, left: 10 + Math.random() * 75 };
    setFloats((list) => [...list.slice(-12), f]);
    setTimeout(() => setFloats((list) => list.filter((x) => x.id !== f.id)), 1900);
  }, []);

  // Load history + subscribe to other tabs.
  useEffect(() => {
    if (!room || !roomId) return;
    const history = loadMessages(roomId);
    if (history.length === 0) {
      history.push(systemMessage(roomId, welcomeText(room)));
      saveMessages(roomId, history);
    }
    setMessages(history);
    setMembers(buildMembers(room, me));

    const ch = channelFor(roomId);
    channelRef.current = ch;
    if (ch) {
      ch.onmessage = (ev: MessageEvent<Envelope>) => {
        const data = ev.data;
        if (data.kind === "message") setMessages((m) => [...m, data.message].slice(-MAX_MESSAGES));
        if (data.kind === "clear") setMessages([]);
        if (data.kind === "react") setMessages((m) => addReaction(m, data.messageId, data.emoji));
        if (data.kind === "float") spawnFloat(data.emoji);
      };
    }
    return () => {
      ch?.close();
      channelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, me?.id]);

  // Persist on every change.
  useEffect(() => {
    if (roomId && messages.length) saveMessages(roomId, messages);
  }, [roomId, messages]);

  const push = useCallback(
    (message: ChatMessage, broadcast = true) => {
      setMessages((m) => [...m, message].slice(-MAX_MESSAGES));
      if (broadcast) channelRef.current?.postMessage({ kind: "message", message } satisfies Envelope);
    },
    [],
  );

  const send = useCallback(
    (text: string, type: MessageType = "chat") => {
      if (!roomId || !me || !text.trim()) return;
      push({
        id: uid("msg"),
        roomId,
        authorId: me.id,
        authorName: me.nickname,
        authorColour: me.colour,
        authorAvatar: me.avatar,
        text: text.trim(),
        type,
        at: Date.now(),
      });
    },
    [roomId, me, push],
  );

  const announce = useCallback(
    (text: string, type: MessageType = "system") => {
      if (!roomId) return;
      push({ ...systemMessage(roomId, text), type });
    },
    [roomId, push],
  );

  /** Add an emoji reaction to one message. */
  const react = useCallback((messageId: string, emoji: string) => {
    setMessages((m) => addReaction(m, messageId, emoji));
    channelRef.current?.postMessage({ kind: "react", messageId, emoji } satisfies Envelope);
  }, []);

  /** Throw a reaction into the room — it floats up the screen for everyone. */
  const throwReaction = useCallback(
    (emoji: string) => {
      spawnFloat(emoji);
      channelRef.current?.postMessage({ kind: "float", emoji } satisfies Envelope);
    },
    [spawnFloat],
  );

  const clear = useCallback(() => {
    if (!roomId) return;
    setMessages([]);
    storage.remove(key(roomId));
    channelRef.current?.postMessage({ kind: "clear" } satisfies Envelope);
  }, [roomId]);

  // Demo activity — a random member says something every 8–16 seconds.
  useEffect(() => {
    if (!room || !roomId || opts.quietDemo) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const person = pick(DEMO_PEOPLE);
      setTyping(person.name);
      timer = setTimeout(() => {
        setTyping(null);
        const id = uid("msg");
        push(
          {
            id,
            roomId,
            authorId: `demo-${person.name}`,
            authorName: person.name,
            authorColour: person.colour,
            text: pick(DEMO_GIST[room.kind]),
            type: "chat",
            at: Date.now(),
          },
          false,
        );
        // Sometimes the room reacts — to the new message or with a floating emoji.
        if (Math.random() < 0.35) setTimeout(() => setMessages((m) => addReaction(m, id, pick(REACTIONS))), 1500);
        if (Math.random() < 0.3) setTimeout(() => spawnFloat(pick(REACTIONS)), 800);
        timer = setTimeout(tick, 7000 + Math.random() * 8000);
      }, 1600);
    };
    timer = setTimeout(tick, 5000);
    return () => clearTimeout(timer);
  }, [room, roomId, opts.quietDemo, push, spawnFloat]);

  // Demo "who is speaking" animation for voice rooms.
  useEffect(() => {
    if (!room || room.mode !== "voice" || opts.quietDemo) return;
    const t = setInterval(() => {
      setMembers((list) => {
        const speakers = list.filter((m) => m.onMic && !m.muted && m.role !== "You");
        const speakingId = speakers.length ? pick(speakers).id : null;
        return list.map((m) => ({ ...m, speaking: m.id === speakingId }));
      });
    }, 2600);
    return () => clearInterval(t);
  }, [room, opts.quietDemo]);

  const setMine = useCallback(
    (patch: Partial<Member>) => {
      if (!me) return;
      setMembers((list) => list.map((m) => (m.id === me.id ? { ...m, ...patch } : m)));
    },
    [me],
  );

  /** Host action (local mode: anyone can try it on demo members). */
  const moderate = useCallback((memberId: string, action: "mute" | "remove" | "make-speaker") => {
    setMembers((list) => {
      if (action === "remove") return list.filter((m) => m.id !== memberId);
      return list.map((m) =>
        m.id !== memberId ? m : action === "mute" ? { ...m, muted: true, speaking: false } : { ...m, onMic: true, handRaised: false },
      );
    });
  }, []);

  return { messages, members, typing, floats, send, announce, clear, setMine, moderate, react, throwReaction };
}

// ----------------------------- ride progress -------------------------------

/** How long the bus spends between stops in local mode. */
export const STOP_SECONDS = 45;

/**
 * Moves a ride from stop to stop. In production the conductor (or a server
 * schedule) would move the bus; here a timer does it so you can test the flow.
 */
export function useRide(stops: string[] | undefined, active: boolean) {
  // One state object so each tick is a single pure update (safe in Strict Mode).
  const [pos, setPos] = useState({ i: 0, s: STOP_SECONDS });
  const total = stops?.length ?? 0;

  useEffect(() => {
    if (!stops || !active) return;
    const t = setInterval(() => {
      setPos((p) => {
        if (p.i >= total - 1) return p; // parked at the last stop
        return p.s > 1 ? { i: p.i, s: p.s - 1 } : { i: p.i + 1, s: STOP_SECONDS };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [stops, active, total]);

  return useMemo(
    () => ({
      stopIndex: pos.i,
      currentStop: stops?.[pos.i] ?? "",
      nextStop: stops?.[pos.i + 1] ?? null,
      isLastStop: total > 0 && pos.i >= total - 1,
      secondsLeft: pos.s,
      /** Conductor control: skip straight to the next stop. */
      advance: () => setPos((p) => ({ i: Math.min(p.i + 1, total - 1), s: STOP_SECONDS })),
      restart: () => setPos({ i: 0, s: STOP_SECONDS }),
    }),
    [pos, stops, total],
  );
}

// ----------------------------- helpers ------------------------------------

function addReaction(list: ChatMessage[], messageId: string, emoji: string): ChatMessage[] {
  return list.map((m) =>
    m.id === messageId ? { ...m, reactions: { ...(m.reactions ?? {}), [emoji]: (m.reactions?.[emoji] ?? 0) + 1 } } : m,
  );
}

function systemMessage(roomId: string, text: string): ChatMessage {
  return {
    id: uid("sys"),
    roomId,
    authorId: "system",
    authorName: "Gist City",
    authorColour: "#E9DFC4",
    text,
    type: "system",
    at: Date.now(),
  };
}

function welcomeText(room: Room): string {
  switch (room.kind) {
    case "ride":
      return `${room.host.name} don start the bus. First stop: ${room.stops?.[0] ?? "the park"}.`;
    case "salon":
      return `${room.host.name} don open shop. Today's topic dey pinned on top.`;
    case "table":
      return `${room.host.name} don clean the table. Pull up a stool.`;
    case "department":
      return room.mode === "quiet" ? "This na quiet room. Share gently, no argument." : `Welcome to ${room.name}.`;
    case "state":
      return `Welcome home. Keep am respectful.`;
    default:
      return `Welcome to ${room.name}.`;
  }
}
