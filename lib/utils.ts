// Small helpers used across the app.

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

/** Stable number from a string — used to give each room a believable headcount. */
export function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function timeAgo(at: number): string {
  const s = Math.floor((Date.now() - at) / 1000);
  if (s < 45) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

// ---------------------------------------------------------------------------
// Safe localStorage (works during server rendering and in private mode)
// ---------------------------------------------------------------------------

export const storage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked — ignore in local mode */
    }
  },
  remove(key: string) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};
