// ---------------------------------------------------------------------------
// Avatars — everybody gets a cartoon avatar they can customise.
// Add a new hairstyle or outfit: add it to the options below, then draw it in
// components/AvatarArt.tsx.
// ---------------------------------------------------------------------------

import { hash } from "./utils";

export const SKIN_TONES = ["#F1C9A5", "#E0AC80", "#C68A5E", "#A0673F", "#7B4A2A", "#5A3420"] as const;
export const HAIR_COLOURS = ["#1A1712", "#3B2416", "#6B3E1E", "#A0522D", "#D9A066", "#8C8C8C", "#7A2E8C", "#C0392B"] as const;
export const OUTFIT_COLOURS = ["#0E6B3A", "#F5BE1B", "#B93C0C", "#3B2F7A", "#1F6FB2", "#1A1712", "#E26D9A", "#F7F3EA"] as const;
export const BG_COLOURS = ["#F5BE1B", "#7BD389", "#F6A88A", "#A99BF0", "#6EC6E8", "#FDE9A8", "#D7EBDD", "#F3EAD3"] as const;

export const GENDERS = ["male", "female"] as const;
export const FACES = ["round", "oval", "square"] as const;
export const HAIRS = ["lowcut", "afro", "braids", "bun", "cornrows", "gele", "fila", "bald", "long", "twists", "dreads", "beanie"] as const;
export const EYES = ["normal", "happy", "wink", "sleepy"] as const;
export const MOUTHS = ["smile", "grin", "laugh", "calm", "wow"] as const;
export const FACIAL_HAIR = ["none", "beard", "goatee", "moustache"] as const;
export const GLASSES = ["none", "round", "shades"] as const;
export const OUTFITS = ["shirt", "ankara", "agbada", "hoodie", "jersey", "kaftan"] as const;

export type Gender = (typeof GENDERS)[number];
type Hair = (typeof HAIRS)[number];

/** Hairstyles offered for each gender in the builder (and used by shuffle). */
export const HAIRS_FOR: Record<Gender, readonly Hair[]> = {
  male: ["lowcut", "afro", "cornrows", "fila", "bald", "twists", "dreads", "beanie"],
  female: ["braids", "bun", "gele", "long", "afro", "cornrows", "twists", "dreads"],
};

/** Switch gender, swapping out anything that doesn't fit the new one. */
export function withGender(a: AvatarConfig, gender: Gender): AvatarConfig {
  const hair = HAIRS_FOR[gender].includes(a.hair) ? a.hair : HAIRS_FOR[gender][0]!;
  return gender === "female"
    ? { ...a, gender, hair, facialHair: "none", earrings: true }
    : { ...a, gender, hair, earrings: false };
}

export interface AvatarConfig {
  /** Avatars saved before this existed have no gender; they draw as male. */
  gender: Gender;
  skin: string;
  face: (typeof FACES)[number];
  hair: Hair;
  hairColour: string;
  eyes: (typeof EYES)[number];
  mouth: (typeof MOUTHS)[number];
  facialHair: (typeof FACIAL_HAIR)[number];
  glasses: (typeof GLASSES)[number];
  earrings: boolean;
  outfit: (typeof OUTFITS)[number];
  outfitColour: string;
  bg: string;
}

/** Friendly names shown in the avatar builder. */
export const LABELS: Record<string, string> = {
  round: "Round", oval: "Oval", square: "Square",
  lowcut: "Low cut", afro: "Afro", braids: "Braids", bun: "Bun", cornrows: "Cornrows", gele: "Gele",
  fila: "Fila", bald: "Clean", long: "Long", twists: "Twists", dreads: "Dreads", beanie: "Beanie",
  normal: "Normal", happy: "Happy", wink: "Wink", sleepy: "Sleepy",
  smile: "Smile", grin: "Grin", laugh: "Laugh", calm: "Calm", wow: "Wow",
  none: "None", beard: "Beard", goatee: "Goatee", moustache: "Moustache",
  shades: "Shades",
  male: "Male", female: "Female",
  shirt: "Shirt", ankara: "Ankara", agbada: "Agbada", hoodie: "Hoodie", jersey: "Jersey", kaftan: "Kaftan",
};

export const DEFAULT_AVATAR: AvatarConfig = {
  gender: "male",
  skin: SKIN_TONES[3],
  face: "round",
  hair: "lowcut",
  hairColour: HAIR_COLOURS[0],
  eyes: "happy",
  mouth: "smile",
  facialHair: "none",
  glasses: "none",
  earrings: false,
  outfit: "ankara",
  outfitColour: OUTFIT_COLOURS[0],
  bg: BG_COLOURS[0],
};

function pickFrom<T>(list: readonly T[], n: number): T {
  return list[Math.abs(n) % list.length]!;
}

function build(r: (salt: string) => number): AvatarConfig {
  const gender = pickFrom(GENDERS, r("gender"));
  const female = gender === "female";
  return {
    gender,
    skin: pickFrom(SKIN_TONES, r("skin") % 4 + 2), // mostly deeper tones
    face: pickFrom(FACES, r("face")),
    hair: pickFrom(HAIRS_FOR[gender], r("hair")),
    hairColour: pickFrom(HAIR_COLOURS, r("hc") % 10 < 7 ? 0 : r("hc2")),
    eyes: pickFrom(EYES, r("eyes")),
    mouth: pickFrom(MOUTHS, r("mouth")),
    facialHair: female ? "none" : pickFrom(FACIAL_HAIR, r("fh") % 6 < 3 ? 0 : r("fh2")),
    glasses: pickFrom(GLASSES, r("gl") % 5 < 3 ? 0 : r("gl2")),
    earrings: female ? r("ear") % 3 !== 0 : false,
    outfit: pickFrom(female ? OUTFITS.filter((o) => o !== "agbada") : OUTFITS, r("out")),
    outfitColour: pickFrom(OUTFIT_COLOURS, r("oc")),
    bg: pickFrom(BG_COLOURS, r("bg")),
  };
}

/** Same name → same avatar. Used for demo people and anyone without a saved avatar. */
export function avatarFromSeed(seed: string): AvatarConfig {
  return build((salt) => hash(seed + ":" + salt));
}

export function randomAvatar(): AvatarConfig {
  return build(() => Math.floor(Math.random() * 1000));
}
