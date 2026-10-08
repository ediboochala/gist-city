"use client";

// ---------------------------------------------------------------------------
// One screen for every kind of room. The room's `kind` decides the extras:
//   ride       → route bar, stops, the "Owa o!" drop button, end of ride
//   salon      → salon & barbershop: "in the chair" / waiting, dash tray
//   table      → beer parlour look (dark), dash tray
//   department → church / mosque colours, quiet rooms have no dashes
//   lounge     → hangouts, markets and debates
//   state      → text-only notice board
// ---------------------------------------------------------------------------

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Screen } from "../Screen";
import { TopBar, type Tone } from "../TopBar";
import { Icon } from "../Icon";
import { useToast } from "../Toast";
import { ChatList } from "./ChatList";
import { Composer } from "./Composer";
import { DashTray } from "./DashTray";
import { MemberSheet } from "./MemberSheet";
import { ReportSheet } from "./ReportSheet";
import { RouteBar } from "./RouteBar";
import { SpeakerGrid } from "./SpeakerGrid";
import { VoiceBar } from "./VoiceBar";
import { CoachTip } from "./CoachTip";
import { FloatingLayer, ReactionBar } from "./ReactionBar";
import { buzz, playCoin, playHorn, playPop } from "@/lib/sound";
import { DASHES } from "@/lib/data";
import { useRide, useRoom } from "@/lib/realtime";
import { closedReason, lagosClock, liveCount } from "@/lib/schedule";
import type { Member, Room, Spot } from "@/lib/types";
import { useUser } from "@/lib/user-store";
import { useVoice } from "@/lib/voice";
import { cx, storage } from "@/lib/utils";

interface RoomScreenProps {
  room: Room;
  spot?: Spot;
  backHref: string;
}

function toneFor(room: Room, spot?: Spot): Tone {
  if (room.kind === "ride" || room.kind === "table") return "dark";
  if (room.kind === "salon") return spot?.kind === "barber" ? "barber" : "salon";
  if (room.kind === "state") return "naija";
  if (spot?.kind === "church") return "church";
  if (spot?.kind === "mosque") return "mosque";
  return spot?.cityId === "abuja" ? "naija" : "danfo";
}

export function RoomScreen({ room, spot, backHref }: RoomScreenProps) {
  const router = useRouter();
  const toast = useToast();
  const user = useUser();
  const me = user.profile;
  const clock = useMemo(() => lagosClock(), []);
  const dark = room.kind === "table";
  const tone = toneFor(room, spot);

  // ---- Gate: rooms that are closed right now ----
  const closed = closedReason(room, clock);
  const canEnter = !closed;
  const fx = {
    horn: () => { if (user.settings.sounds) playHorn(); if (user.settings.vibrate) buzz(120); },
    pop: () => { if (user.settings.sounds) playPop(); },
    coin: () => { if (user.settings.sounds) playCoin(); if (user.settings.vibrate) buzz(40); },
  };

  const quiet = room.mode === "quiet";
  const voiceOn = room.mode === "voice" && !user.settings.dataSaver && canEnter;
  const { messages, members, typing, floats, send, announce, clear, setMine, moderate, react, throwReaction } = useRoom(canEnter ? room : undefined, me, {
    quietDemo: quiet,
  });
  const voice = useVoice(canEnter ? room.id : undefined, voiceOn);

  const isHost = !!me && room.host.name === me.nickname;
  const [dashOpen, setDashOpen] = useState(false);
  const [sheet, setSheet] = useState<null | { type: "report"; target?: string } | { type: "member"; member: Member }>(null);

  // ---- Arrival: stats + "X boarded" message, once per visit ----
  const arrived = useRef(false);
  useEffect(() => {
    if (!canEnter || !me || arrived.current) return;
    arrived.current = true;
    user.bump("roomsJoined");
    if (room.kind === "ride") user.bump("rides");
    if (room.kind === "salon") user.bump("salonVisits");
    if (spot) user.visitSpot(spot.id, spot.cityId);
    announce(room.kind === "ride" ? `${me.nickname} boarded at ${room.stops?.[0] ?? "the park"}` : `${me.nickname} don enter`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canEnter, me?.id]);

  // Keep "my" seat in sync with voice + hand state.
  useEffect(() => {
    setMine({ onMic: voice.status === "speaking", handRaised: voice.handRaised, speaking: voice.status === "speaking" && voice.level > 0.15 });
  }, [voice.status, voice.handRaised, voice.level, setMine]);

  // ---- Ride: stops, Owa drop and end of ride ----
  const [dropAt, setDropAt] = useState<number | null>(null);
  const [rideEnded, setRideEnded] = useState(false);
  const ride = useRide(room.stops, canEnter && room.kind === "ride" && !rideEnded);
  const lastAnnounced = useRef(0);

  useEffect(() => {
    if (room.kind !== "ride" || !canEnter || !me) return;
    if (ride.stopIndex === lastAnnounced.current) return;
    lastAnnounced.current = ride.stopIndex;

    if (dropAt !== null && ride.stopIndex >= dropAt) {
      user.bump("owaDrops");
      announce(`${me.nickname} don drop at ${ride.currentStop}`, "owa");
      fx.horn();
      toast(`You don drop at ${ride.currentStop}. Safe journey!`, "owa");
      router.push(backHref);
      return;
    }
    if (ride.isLastStop) {
      announce(`Last bus stop! ${ride.currentStop}. Everybody come down.`);
      setRideEnded(true);
      return;
    }
    announce(`Bus don reach ${ride.currentStop}`);
    fx.horn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ride.stopIndex]);

  const shoutOwa = () => {
    if (!me) return;
    if (dropAt !== null) {
      setDropAt(null);
      announce(`${me.nickname} say e never reach. E dey stay for bus.`);
      return;
    }
    const next = Math.min(ride.stopIndex + 1, (room.stops?.length ?? 1) - 1);
    setDropAt(next);
    fx.horn();
    announce(`${me.nickname} don shout Owa! Dropping at ${room.stops?.[next]}`, "owa");
  };

  const boardAgain = () => {
    clear();
    ride.restart();
    lastAnnounced.current = 0;
    setRideEnded(false);
    setDropAt(null);
    if (me) announce(`${room.host.name} don turn the bus. ${me.nickname} boarded again.`);
    user.bump("rides");
  };

  // ---- Dashes ----
  const dash = (id: string) => {
    const item = DASHES.find((d) => d.id === id);
    if (!item || !me) return;
    if (!user.spend(item.cost, `Dashed ${item.name}`, room.name)) {
      toast("Your coins no reach for this dash.");
      return;
    }
    user.bump("dashesSent");
    fx.coin();
    throwReaction("🎁");
    announce(`${me.nickname} dashed ${room.host.name} ${item.name}`, "dash");
  };

  const onSend = (text: string) => {
    send(text);
    fx.pop();
    user.bump("messagesSent");
  };

  const submitReport = (reason: string, details: string) => {
    const report = { roomId: room.id, target: sheet && sheet.type === "report" ? sheet.target : undefined, reason, details, at: Date.now() };
    storage.set("gc:reports", [...storage.get<unknown[]>("gc:reports", []), report]);
    fetch("/api/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(report) }).catch(() => undefined);
    setSheet(null);
    toast("Report sent. Moderators go check am.", "naija");
  };

  // ---- Gate screen ----
  if (!canEnter) {
    return (
      <Screen>
        <TopBar title={room.name} subtitle={spot ? `${spot.name}, ${spot.area}` : undefined} backHref={backHref} tone={tone} />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper text-ink ring-1 ring-line">
            <Icon name="lock" size={28} />
          </span>
          <h2 className="font-display text-2xl font-extrabold">This room never open</h2>
          <p className="text-muted">{closed}. Check back later — the city dey change with time.</p>
          <Link href={backHref} className="flex h-12 items-center rounded-2xl bg-ink px-6 font-bold text-white">
            Find another room
          </Link>
        </div>
      </Screen>
    );
  }

  const listeners = liveCount(room, clock, true);
  const subtitle =
    room.kind === "ride"
      ? `${room.host.role} ${room.host.name} · ${Math.min(listeners, room.capacity)}/${room.capacity} seats`
      : `${spot ? `${spot.area} · ` : ""}${listeners} inside${room.mode === "quiet" ? " · quiet room" : ""}`;

  const showDashes = !quiet && room.kind !== "state";
  const accent =
    tone === "salon" ? "bg-salon" : tone === "barber" ? "bg-barber" : tone === "church" ? "bg-church" : tone === "mosque" ? "bg-mosque" : "bg-naija";

  return (
    <Screen className={cx("h-[100dvh] min-h-0 overflow-hidden", dark && "bg-parlour text-white")}>
      <TopBar
        title={room.name}
        subtitle={subtitle}
        backHref={backHref}
        backLabel="Leave room"
        tone={tone}
        right={
          <button
            type="button"
            onClick={() => setSheet({ type: "report" })}
            aria-label="Report this room"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-current opacity-70"
          >
            <Icon name="flag" size={20} />
          </button>
        }
      >
        {room.kind === "ride" && room.stops ? (
          <RouteBar stops={room.stops} current={ride.stopIndex} secondsLeft={ride.secondsLeft} dropAt={dropAt} />
        ) : (
          <div className={cx("rounded-2xl px-4 py-3", dark || tone === "church" || tone === "mosque" || tone === "naija" ? "bg-black/20" : "bg-paper")}>
            <p className="text-[12px] font-bold opacity-80">{room.kind === "salon" ? (spot?.kind === "barber" ? "Today for the shop" : "Today for the salon") : "Topic"}</p>
            <p className="text-[15px] font-bold leading-snug">{room.topic}</p>
          </div>
        )}
      </TopBar>

      {room.kind === "ride" && (
        <div className="bg-ink px-4 pb-3 text-[13px] text-[#D9D2C0]">
          <span className="font-bold text-white">Topic:</span> {room.topic}
        </div>
      )}

      {room.mode === "voice" && (
        <SpeakerGrid
          members={members}
          title={room.kind === "ride" ? "Front seats · on the mic" : room.kind === "salon" ? "In the chair · on the mic" : "On the mic"}
          listeners={Math.max(0, listeners - members.filter((m) => m.onMic).length)}
          listenersLabel={room.kind === "salon" ? (spot?.kind === "barber" ? "on the waiting bench" : "under the dryer") : "listening"}
          emptySeatLabel={room.kind === "salon" ? "Free chair" : room.kind === "table" ? "Free stool" : "Empty seat"}
          dark={dark}
          onMemberTap={(m) => m.role !== "You" && setSheet({ type: "member", member: m })}
        />
      )}

      {dropAt !== null && (
        <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-owa px-4 py-3 text-sm text-white">
          <Icon name="bus" />
          <p>
            <strong>You don shout Owa!</strong> {room.host.role} go drop you at {room.stops?.[dropAt]}.
          </p>
        </div>
      )}

      <CoachTip kind={room.kind} dark={dark} />

      <div className="relative flex min-h-0 flex-1 flex-col">
        <ChatList
          messages={messages}
          myId={me?.id}
          dark={dark}
          typing={typing}
          onReact={(id, e) => {
            react(id, e);
            fx.pop();
          }}
          nameColour={tone === "salon" ? "text-salon" : tone === "barber" ? "text-barber" : tone === "church" ? "text-church" : tone === "mosque" ? "text-mosque" : dark ? "text-danfo" : "text-naija"}
        />
        <FloatingLayer floats={floats} />
      </div>

      <footer className={cx("flex flex-col gap-2.5 border-t px-4 pb-4 pt-3", dark ? "border-parlour-edge bg-parlour-card" : "border-line bg-paper")}>
        {room.kind === "ride" && !rideEnded && (
          <button
            type="button"
            onClick={shoutOwa}
            className={cx(
              "h-[52px] rounded-2xl border-2 border-owa font-display text-lg font-extrabold transition-transform active:scale-95",
              dropAt !== null ? "bg-paper text-owa" : "bg-owa text-white",
            )}
          >
            {dropAt !== null ? "Cancel — I never reach" : "Owa o! I wan drop"}
          </button>
        )}

        {rideEnded && (
          <div className="flex flex-col gap-2 rounded-2xl bg-danfo p-4 text-ink">
            <p className="font-display text-lg font-extrabold">Last bus stop! The ride don end.</p>
            <p className="text-sm">Chat for this ride go clear when the bus turn. Wetin you wan do?</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={boardAgain} className="h-12 rounded-xl bg-ink font-bold text-white">Board again</button>
              <Link href={backHref} className="flex h-12 items-center justify-center rounded-xl border-2 border-ink font-bold">Come down</Link>
            </div>
          </div>
        )}

        {isHost && room.kind === "ride" && !rideEnded && (
          <button type="button" onClick={ride.advance} className="h-11 rounded-xl border border-line text-sm font-bold">
            Conductor: move to next stop
          </button>
        )}

        <ReactionBar
          dark={dark}
          onThrow={(e) => {
            throwReaction(e);
            fx.pop();
          }}
          onGift={showDashes ? () => setDashOpen((o) => !o) : undefined}
          giftOpen={dashOpen}
        />
        {showDashes && dashOpen && (
          <div className="animate-slide-up">
            <p className={cx("mb-1.5 text-xs", dark ? "text-[#CFC6B0]" : "text-muted")}>
              Dash {room.host.name} something · you get {user.balance} coins
            </p>
            <DashTray onDash={dash} balance={user.balance} dark={dark} />
          </div>
        )}
        {voiceOn && (
          <VoiceBar status={voice.status} level={voice.level} handRaised={voice.handRaised} onToggleMic={voice.toggleMic} onToggleHand={voice.toggleHand} dark={dark} />
        )}
        {room.mode === "voice" && user.settings.dataSaver && (
          <p className={cx("text-xs", dark ? "text-[#CFC6B0]" : "text-muted")}>Data saver dey on — voice off, text only. Change am for your profile.</p>
        )}
        <Composer onSend={onSend} dark={dark} accent={accent} placeholder={quiet ? "Share gently..." : room.kind === "salon" ? "Talk your own..." : "Drop your gist..."} disabled={rideEnded} />
      </footer>

      {sheet?.type === "report" && <ReportSheet roomName={sheet.target ?? room.name} onClose={() => setSheet(null)} onSubmit={submitReport} />}
      {sheet?.type === "member" && (
        <MemberSheet
          member={sheet.member}
          isHost={isHost}
          onClose={() => setSheet(null)}
          onAction={(action) => {
            const m = sheet.member;
            if (action === "report") {
              setSheet({ type: "report", target: m.name });
              return;
            }
            moderate(m.id, action);
            announce(action === "remove" ? `${m.name} don drop from the room` : action === "mute" ? `${m.name} don mute` : `${m.name} don enter front seat`);
            setSheet(null);
          }}
        />
      )}
    </Screen>
  );
}
