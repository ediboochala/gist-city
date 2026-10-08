// ---------------------------------------------------------------------------
// The city clock. This is what makes Gist City feel alive: rooms open and
// close with the time of day and the day of the week, and headcounts rise and
// fall like a real city. Times use West Africa Time (Africa/Lagos).
// ---------------------------------------------------------------------------

import type { CityId, Room, Spot } from "./types";
import { hash } from "./utils";

export interface CityClock {
  hour: number;
  day: number; // 0 = Sunday
  label: string; // "6:40 PM"
  period: "early" | "morning" | "afternoon" | "evening" | "night";
}

export function lagosClock(now = new Date()): CityClock {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    hour: "numeric",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? now.getHours()) % 24;
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const label = `${h12}:${minute} ${hour < 12 ? "AM" : "PM"}`;
  const period =
    hour < 6 ? "early" : hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";
  return { hour, day, label, period };
}

/** One line that tells people what the city feels like right now. */
export function cityMood(cityId: CityId | "naija", clock: CityClock): string {
  const { period, day } = clock;
  if (day === 0 && period === "morning") return "Sunday service dey go on. Choir dey sing, ushers dey for gate.";
  if (day === 5 && (period === "afternoon" || period === "morning")) return "Na Friday. Jumu'ah gist go open after prayer.";
  if (day === 6 && period !== "early") return "Saturday — Owambe day. Everybody don dress up.";
  if (cityId === "abuja") {
    if (period === "morning") return "Taxis full from Kubwa to town. Office gist don start.";
    if (period === "afternoon") return "Break room dey busy. Wuse Market dey price matter.";
    if (period === "evening") return "Jabi Lake hangout dey live. Suya smoke dey rise.";
    if (period === "night") return "Late night taxi gist. Lakeside still get people.";
    return "Abuja still dey sleep small. Early birds dey gist.";
  }
  if (period === "morning") return "Rush hour! Danfo dey full, go-slow don start for Third Mainland.";
  if (period === "afternoon") return "Balogun Market dey hot. Island vs Mainland debate don warm.";
  if (period === "evening") return "Go-slow don start. Buses full, beer parlours dey open.";
  if (period === "night") return "Night gist. Beer parlour tables dey full, late buses still dey move.";
  return "Lagos no dey sleep. Early buses dey warm up.";
}

export function isRoomOpen(room: Room, clock: CityClock): boolean {
  if (room.comingSoon) return false;
  if (room.openDays && !room.openDays.includes(clock.day)) return false;
  if (room.openHours) {
    const [from, to] = room.openHours;
    if (clock.hour < from || clock.hour >= to) return false;
  }
  return true;
}

export function closedReason(room: Room, clock: CityClock): string | null {
  if (room.comingSoon) return "Opens in season";
  if (room.openDays && !room.openDays.includes(clock.day)) {
    const names = room.openDays.map((d) => ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"][d]);
    return `Opens on ${names.join(", ")}`;
  }
  if (room.openHours && !isRoomOpen(room, clock)) {
    const fmt = (h: number) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? "am" : "pm"}`;
    return `Open ${fmt(room.openHours[0])}–${fmt(room.openHours[1])}`;
  }
  return null;
}

/** How busy each period is, 0–1. */
const PERIOD_WEIGHT: Record<CityClock["period"], number> = {
  early: 0.15,
  morning: 0.7,
  afternoon: 0.55,
  evening: 1,
  night: 0.75,
};

/**
 * Believable live headcount for a room in local mode.
 * With Supabase connected, replace this with real presence counts.
 */
export function liveCount(room: Room, clock: CityClock, joined = false): number {
  if (!isRoomOpen(room, clock)) return 0;
  const base = Math.min(room.capacity, 6 + (hash(room.id) % Math.max(8, room.capacity)));
  const wobble = (hash(room.id + clock.hour) % 5) - 2;
  const n = Math.round(base * PERIOD_WEIGHT[clock.period]) + wobble;
  const capped = Math.max(1, Math.min(room.capacity - (joined ? 1 : 0), n));
  return capped + (joined ? 1 : 0);
}

export function spotCount(spot: Spot, clock: CityClock): number {
  return spot.rooms.reduce((sum, r) => sum + liveCount(r, clock), 0);
}

export function buzzLevel(total: number): { bars: number; label: string } {
  if (total > 900) return { bars: 5, label: "Very high" };
  if (total > 600) return { bars: 4, label: "High" };
  if (total > 300) return { bars: 3, label: "Warming up" };
  if (total > 100) return { bars: 2, label: "Quiet" };
  return { bars: 1, label: "Sleeping" };
}
