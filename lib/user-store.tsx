"use client";

// ---------------------------------------------------------------------------
// The signed-in person: profile, Dash Wallet, stats, badges and settings.
//
// LOCAL MODE: everything is saved in the browser (localStorage).
// LATER: swap these functions for Supabase calls (see supabase/schema.sql and
// docs/CONNECTING-SERVICES.md). The rest of the app only talks to this hook,
// so the screens won't need to change.
// ---------------------------------------------------------------------------

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { avatarFromSeed } from "./avatar";
import { BADGES } from "./data";
import type { CityId, Profile, Settings, UserStats, WalletEntry } from "./types";
import { storage, uid } from "./utils";

const KEYS = {
  profile: "gc:profile",
  wallet: "gc:wallet",
  stats: "gc:stats",
  visited: "gc:visited",
  settings: "gc:settings",
  checkin: "gc:checkin",
  hosted: "gc:hosted",
};

export const STARTING_COINS = 250;
export const DAILY_CHECKIN = 20;

const EMPTY_STATS: UserStats = {
  rides: 0,
  owaDrops: 0,
  roomsJoined: 0,
  messagesSent: 0,
  dashesSent: 0,
  salonVisits: 0,
  abujaSpots: 0,
  lagosSpots: 0,
  hosted: 0,
};

export interface HostedRide {
  id: string;
  name: string;
  topic: string;
  cityId: CityId;
  at: number;
}

interface UserState {
  ready: boolean;
  profile: Profile | null;
  wallet: WalletEntry[];
  balance: number;
  stats: UserStats;
  settings: Settings;
  hosted: HostedRide[];
  earnedBadges: string[];
  canCheckIn: boolean;
  createProfile: (p: Omit<Profile, "id" | "createdAt">) => void;
  updateProfile: (p: Partial<Profile>) => void;
  signOut: () => void;
  spend: (amount: number, what: string, where: string) => boolean;
  earn: (amount: number, what: string, where: string) => void;
  bump: (key: keyof UserStats, by?: number) => void;
  visitSpot: (spotId: string, cityId: CityId) => void;
  setSettings: (s: Partial<Settings>) => void;
  dailyCheckIn: () => void;
  hostRide: (r: Omit<HostedRide, "id" | "at">) => HostedRide;
}

const UserContext = createContext<UserState | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallet, setWallet] = useState<WalletEntry[]>([]);
  const [stats, setStats] = useState<UserStats>(EMPTY_STATS);
  const [visited, setVisited] = useState<Record<string, CityId>>({});
  const [settings, setSettingsState] = useState<Settings>({ dataSaver: false, sounds: true, vibrate: true });
  const [lastCheckIn, setLastCheckIn] = useState<string>("");
  const [hosted, setHosted] = useState<HostedRide[]>([]);

  // Load from the browser once on mount.
  useEffect(() => {
    const saved = storage.get<Profile | null>(KEYS.profile, null);
    // Older local profiles had no avatar — give them one so nothing breaks.
    setProfile(saved && !saved.avatar ? { ...saved, avatar: avatarFromSeed(saved.nickname) } : saved);
    setWallet(storage.get<WalletEntry[]>(KEYS.wallet, []));
    setStats({ ...EMPTY_STATS, ...storage.get<UserStats>(KEYS.stats, EMPTY_STATS) });
    setVisited(storage.get<Record<string, CityId>>(KEYS.visited, {}));
    setSettingsState({ dataSaver: false, sounds: true, vibrate: true, ...storage.get<Partial<Settings>>(KEYS.settings, {}) });
    setLastCheckIn(storage.get<string>(KEYS.checkin, ""));
    setHosted(storage.get<HostedRide[]>(KEYS.hosted, []));
    setReady(true);
  }, []);

  // Persist whenever something changes (after the first load).
  useEffect(() => { if (ready) storage.set(KEYS.profile, profile); }, [ready, profile]);
  useEffect(() => { if (ready) storage.set(KEYS.wallet, wallet); }, [ready, wallet]);
  useEffect(() => { if (ready) storage.set(KEYS.stats, stats); }, [ready, stats]);
  useEffect(() => { if (ready) storage.set(KEYS.visited, visited); }, [ready, visited]);
  useEffect(() => { if (ready) storage.set(KEYS.settings, settings); }, [ready, settings]);
  useEffect(() => { if (ready) storage.set(KEYS.checkin, lastCheckIn); }, [ready, lastCheckIn]);
  useEffect(() => { if (ready) storage.set(KEYS.hosted, hosted); }, [ready, hosted]);

  const balance = useMemo(
    () => STARTING_COINS + wallet.reduce((sum, e) => sum + e.amount, 0),
    [wallet],
  );

  const derivedStats = useMemo<UserStats>(() => {
    const cities = Object.values(visited);
    return {
      ...stats,
      lagosSpots: cities.filter((c) => c === "lagos").length,
      abujaSpots: cities.filter((c) => c === "abuja").length,
      hosted: hosted.length,
    };
  }, [stats, visited, hosted]);

  const earnedBadges = useMemo(
    () => BADGES.filter((b) => b.test(derivedStats)).map((b) => b.id),
    [derivedStats],
  );

  const today = new Date().toDateString();
  const canCheckIn = ready && !!profile && lastCheckIn !== today;

  const createProfile = useCallback((p: Omit<Profile, "id" | "createdAt">) => {
    setProfile({ ...p, id: uid("user"), createdAt: Date.now() });
  }, []);

  const updateProfile = useCallback((p: Partial<Profile>) => {
    setProfile((cur) => {
      if (!cur) return cur;
      const next = { ...cur, ...p };
      if (p.avatar) next.colour = p.avatar.bg; // keep accent colour in step with the avatar
      return next;
    });
  }, []);

  const signOut = useCallback(() => {
    Object.values(KEYS).forEach((k) => storage.remove(k));
    setProfile(null);
    setWallet([]);
    setStats(EMPTY_STATS);
    setVisited({});
    setHosted([]);
    setLastCheckIn("");
  }, []);

  const addEntry = useCallback((amount: number, what: string, where: string) => {
    setWallet((w) => [{ id: uid("tx"), what, where, amount, at: Date.now() }, ...w].slice(0, 100));
  }, []);

  const spend = useCallback(
    (amount: number, what: string, where: string) => {
      if (balance < amount) return false;
      addEntry(-amount, what, where);
      return true;
    },
    [balance, addEntry],
  );

  const earn = useCallback((amount: number, what: string, where: string) => addEntry(amount, what, where), [addEntry]);

  const bump = useCallback((key: keyof UserStats, by = 1) => {
    setStats((s) => ({ ...s, [key]: (s[key] ?? 0) + by }));
  }, []);

  const visitSpot = useCallback((spotId: string, cityId: CityId) => {
    setVisited((v) => (v[spotId] ? v : { ...v, [spotId]: cityId }));
  }, []);

  const setSettings = useCallback((s: Partial<Settings>) => setSettingsState((cur) => ({ ...cur, ...s })), []);

  const dailyCheckIn = useCallback(() => {
    if (lastCheckIn === today) return;
    setLastCheckIn(today);
    addEntry(DAILY_CHECKIN, "Daily check-in", "Gist City");
  }, [lastCheckIn, today, addEntry]);

  const hostRide = useCallback((r: Omit<HostedRide, "id" | "at">) => {
    const ride: HostedRide = { ...r, id: uid("ride"), at: Date.now() };
    setHosted((h) => [ride, ...h]);
    return ride;
  }, []);

  const value: UserState = {
    ready,
    profile,
    wallet,
    balance,
    stats: derivedStats,
    settings,
    hosted,
    earnedBadges,
    canCheckIn,
    createProfile,
    updateProfile,
    signOut,
    spend,
    earn,
    bump,
    visitSpot,
    setSettings,
    dailyCheckIn,
    hostRide,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
