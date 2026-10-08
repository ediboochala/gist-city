import { AvatarArt } from "./AvatarArt";
import { avatarFromSeed, type AvatarConfig } from "@/lib/avatar";
import { cx } from "@/lib/utils";

interface AvatarProps {
  name: string;
  /** The person's saved avatar. Without one, a stable avatar is made from their name. */
  avatar?: AvatarConfig;
  size?: number;
  speaking?: boolean;
  muted?: boolean;
  handRaised?: boolean;
  ring?: boolean;
  className?: string;
}

/** Round avatar. Pulses green while speaking; shows mute and raised-hand badges. */
export function Avatar({ name, avatar, size = 48, speaking, muted, handRaised, ring, className }: AvatarProps) {
  const config = avatar ?? avatarFromSeed(name);
  return (
    <span
      className={cx("relative inline-flex shrink-0 rounded-full", speaking && "animate-speak", ring && "ring-2 ring-ink ring-offset-2", className)}
      style={{ width: size, height: size }}
    >
      <AvatarArt a={config} size={size} title={name} />
      {muted && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-label="Muted">
            <path d="M3 3l18 18M9 9v2a3 3 0 0 0 5 2.2M15 10V6a3 3 0 0 0-5.7-1.3" />
          </svg>
        </span>
      )}
      {handRaised && (
        <span className="absolute -right-1 -top-1 flex h-6 w-6 animate-bounce items-center justify-center rounded-full bg-danfo text-[13px] ring-2 ring-paper" aria-label="Hand raised">
          ✋
        </span>
      )}
    </span>
  );
}
