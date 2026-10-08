// Inline stroke icons. Add new ones to PATHS — each is the inside of a 24×24 SVG.

const PATHS = {
  back: <path d="M15 5l-7 7 7 7" />,
  bus: (
    <>
      <rect x="4" y="3" width="16" height="14" rx="3" />
      <path d="M4 10h16" />
      <circle cx="8" cy="20" r="1.5" />
      <circle cx="16" cy="20" r="1.5" />
    </>
  ),
  car: (
    <>
      <path d="M4 16h16v-4l-2.5-5h-11L4 12z" />
      <circle cx="8" cy="17" r="2" />
      <circle cx="16" cy="17" r="2" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M8.2 8.2L20 20M8.2 15.8L20 4" />
    </>
  ),
  mug: (
    <>
      <path d="M5 8h10v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
      <path d="M15 11h2a2 2 0 0 1 0 4h-2" />
      <path d="M6 4.5c1.3 1 2.7 1 4 0s2.7-1 4 0" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  church: (
    <>
      <path d="M12 2v5M10 4h4" />
      <path d="M6 21V11l6-4 6 4v10" />
      <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  home: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  map: (
    <>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="3" />
      <path d="M16 13h2M3 10h18" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  micOff: (
    <>
      <path d="M9 9v2a3 3 0 0 0 5.1 2.1M15 10V6a3 3 0 0 0-5.7-1.3" />
      <path d="M5 11a7 7 0 0 0 11.5 5.4M19 11a7 7 0 0 1-.4 2.3M12 18v3M3 3l18 18" />
    </>
  ),
  hand: (
    <path d="M8 13V5a1.5 1.5 0 0 1 3 0v6M11 10V3.5a1.5 1.5 0 0 1 3 0V11M14 6a1.5 1.5 0 0 1 3 0v6M17 9a1.5 1.5 0 0 1 3 0v4a8 8 0 0 1-8 8h-1a7 7 0 0 1-6-3.5L3 14a1.6 1.6 0 0 1 2.6-1.8L8 15" />
  ),
  send: <path d="M4 12l16-8-6 16-3-7z" />,
  flag: <path d="M5 21V4h11l-2 4 2 4H5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="M5 12l5 5 9-10" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  star: <path d="M12 3l2.6 5.6 6 .7-4.5 4 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.5-4 6-.7z" />,
  gift: (
    <>
      <rect x="3" y="8" width="18" height="5" rx="1" />
      <path d="M5 13v8h14v-8M12 8v13" />
      <path d="M12 8c-2-4-6-4-6-1.5S10 8 12 8zM12 8c2-4 6-4 6-1.5S14 8 12 8z" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  signal: <path d="M4 20v-4M9 20v-8M14 20V8M19 20V4" />,
  shuffle: <path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3" />,
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14a4 4 0 0 0 7 0M9 9.5h.01M15 9.5h.01" />
    </>
  ),
  edit: <path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" />,
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 22, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
