import type { AvatarConfig } from "./avatar";

// ---------------------------------------------------------------------------
// Gist City — shared types
// The world is organised as: Country → City → Spot → Room
// ---------------------------------------------------------------------------

export type CityId = "lagos" | "abuja";

export interface City {
  id: CityId;
  name: string;
  tagline: string;
  /** Background / accent used on the city screen */
  theme: "danfo" | "naija";
  /** How people move around in this city (used for bus-type rooms) */
  rideWord: string;
  live: boolean;
}

export type SpotCategory = "rides" | "hangouts" | "style" | "faith";

export type SpotKind =
  | "bus"
  | "taxi"
  | "keke"
  | "salon"
  | "barber"
  | "parlour"
  | "church"
  | "mosque"
  | "lounge"
  | "market"
  | "office";

export type RoomKind =
  | "ride" // danfo / taxi / keke: has stops and the Owa button
  | "salon" // salon & barbershop: chairs on the mic, listeners waiting
  | "table" // beer parlour tables
  | "department" // church departments & mosque circles
  | "lounge" // general hangouts, markets, debates
  | "state"; // state notice boards

export type RoomMode = "voice" | "text" | "quiet";

export interface Host {
  name: string;
  role: string; // "Conductor", "Salon owner", "Barman", "Choir master" ...
}

export interface Room {
  id: string;
  spotId: string;
  name: string;
  kind: RoomKind;
  topic: string;
  mode: RoomMode;
  capacity: number;
  host: Host;
  /** For rides: the bus stops in order. The last stop ends the ride. */
  stops?: string[];
  adultsOnly?: boolean;
  /** Seasonal or not yet open */
  comingSoon?: boolean;
  /** Optional schedule window: which hours (0–23) the room is open */
  openHours?: [number, number];
  /** Optional days of week the room is open (0 = Sunday) */
  openDays?: number[];
}

export interface Spot {
  id: string;
  cityId: CityId;
  name: string;
  area: string;
  category: SpotCategory;
  kind: SpotKind;
  blurb: string;
  rooms: Room[];
}

export interface DashItem {
  id: string;
  name: string;
  cost: number;
}

export interface BadgeDef {
  id: string;
  tag: string;
  name: string;
  how: string;
  /** Returns true when the user's stats unlock the badge */
  test: (s: UserStats) => boolean;
}

export interface UserStats {
  rides: number;
  owaDrops: number;
  roomsJoined: number;
  messagesSent: number;
  dashesSent: number;
  salonVisits: number;
  abujaSpots: number;
  lagosSpots: number;
  hosted: number;
}

export interface Profile {
  id: string;
  nickname: string;
  /** Kept in sync with avatar.bg — used for name colours and small accents. */
  colour: string;
  avatar: AvatarConfig;
  phone: string;
  homeCity: CityId;
  stateOfOrigin: string;
  agreedRules: boolean;
  createdAt: number;
}

export interface WalletEntry {
  id: string;
  what: string;
  where: string;
  amount: number;
  at: number;
}

export interface Settings {
  dataSaver: boolean;
  sounds: boolean;
  vibrate: boolean;
}

export type MessageType = "chat" | "system" | "owa" | "dash" | "voice-note";

export interface ChatMessage {
  id: string;
  roomId: string;
  authorId: string;
  authorName: string;
  authorColour: string;
  authorAvatar?: AvatarConfig;
  text: string;
  type: MessageType;
  at: number;
  /** emoji → count */
  reactions?: Record<string, number>;
}

export interface Member {
  id: string;
  name: string;
  colour: string;
  avatar?: AvatarConfig;
  role?: string;
  onMic: boolean;
  speaking?: boolean;
  muted?: boolean;
  handRaised?: boolean;
}
