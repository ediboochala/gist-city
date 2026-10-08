import { useId } from "react";
import type { AvatarConfig } from "@/lib/avatar";

/** Darken (amt < 0) or lighten (amt > 0) a hex colour. */
function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp((n >> 16) + amt);
  const g = clamp(((n >> 8) & 0xff) + amt);
  const b = clamp((n & 0xff) + amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const INK = "#1A1712";
const GOLD = "#E8B84A";

/** Draws a full avatar from its config. Pure SVG, scales to any size. */
export function AvatarArt({ a, size = 48, title }: { a: AvatarConfig; size?: number; title?: string }) {
  const id = useId().replace(/:/g, "");
  const skinShade = shade(a.skin, -28);
  const hairHi = shade(a.hairColour, 40);
  const cloth = a.outfitColour;
  const clothDark = shade(cloth, -40);

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title ?? "Avatar"}>
      <defs>
        <clipPath id={`c${id}`}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
        <pattern id={`p${id}`} width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="2.2" fill="rgba(255,255,255,0.55)" />
          <path d="M0 0 L3 0 L0 3Z M10 10 L7 10 L10 7Z" fill="rgba(0,0,0,0.25)" />
        </pattern>
      </defs>
      <g clipPath={`url(#c${id})`}>
        <rect width="100" height="100" fill={a.bg} />

        {/* ---------- hair behind the head ---------- */}
        {a.hair === "afro" && <circle cx="50" cy="36" r="29" fill={a.hairColour} />}
        {a.hair === "long" && (
          <path d="M26 40 Q24 18 50 15 Q76 18 74 40 L78 80 Q64 86 50 86 Q36 86 22 80 Z" fill={a.hairColour} />
        )}
        {(a.hair === "braids" || a.hair === "dreads") && (
          <g fill={a.hairColour}>
            {[24, 28, 32, 68, 72, 76].map((x) => (
              <rect key={x} x={x - (a.hair === "dreads" ? 2 : 1.4)} y="30" width={a.hair === "dreads" ? 4 : 2.8} height="52" rx="1.5" />
            ))}
          </g>
        )}

        {/* ---------- body / outfit ---------- */}
        <path d="M12 104 C14 82 30 74 50 74 C70 74 86 82 88 104 Z" fill={cloth} />
        {a.outfit === "ankara" && <path d="M12 104 C14 82 30 74 50 74 C70 74 86 82 88 104 Z" fill={`url(#p${id})`} />}
        {a.outfit === "shirt" && (
          <g fill="#FFFFFF" opacity="0.92">
            <path d="M41 75 L50 85 L46 74 Z" />
            <path d="M59 75 L50 85 L54 74 Z" />
          </g>
        )}
        {a.outfit === "agbada" && (
          <g fill="none" stroke={GOLD} strokeWidth="2">
            <path d="M38 77 Q50 98 62 77" />
            <path d="M42 80 Q50 92 58 80" />
            <circle cx="50" cy="93" r="2" fill={GOLD} />
          </g>
        )}
        {a.outfit === "hoodie" && (
          <g>
            <path d="M31 79 Q50 69 69 79 Q60 90 50 90 Q40 90 31 79Z" fill={clothDark} />
            <path d="M45 88 L44 98 M55 88 L56 98" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}
        {a.outfit === "jersey" && (
          <g>
            <rect x="32" y="80" width="3" height="24" fill="#FFFFFF" opacity="0.8" />
            <rect x="65" y="80" width="3" height="24" fill="#FFFFFF" opacity="0.8" />
            <text x="50" y="98" textAnchor="middle" fontSize="12" fontWeight="800" fill="#FFFFFF" fontFamily="sans-serif">10</text>
          </g>
        )}
        {a.outfit === "kaftan" && (
          <g stroke={GOLD} strokeWidth="1.6" strokeLinecap="round">
            <path d="M50 76 L50 102" />
            {[82, 87, 92, 97].map((y) => (
              <path key={y} d={`M46.5 ${y} L53.5 ${y}`} />
            ))}
          </g>
        )}

        {/* ---------- neck, ears, head ---------- */}
        <rect x="44" y="58" width="12" height="19" rx="4" fill={skinShade} />
        <circle cx="29" cy="46" r="4.5" fill={skinShade} />
        <circle cx="71" cy="46" r="4.5" fill={skinShade} />
        {a.face === "round" && <ellipse cx="50" cy="44" rx="21" ry="22" fill={a.skin} />}
        {a.face === "oval" && <ellipse cx="50" cy="44" rx="19" ry="24" fill={a.skin} />}
        {a.face === "square" && <rect x="29.5" y="22" width="41" height="44" rx="13" fill={a.skin} />}

        {/* ---------- facial hair ---------- */}
        {a.facialHair === "beard" && (
          <path d="M30 46 Q31 69 50 71 Q69 69 70 46 Q67 60 50 62 Q33 60 30 46Z" fill={a.hairColour} />
        )}
        {a.facialHair === "goatee" && <path d="M45 60 Q50 69 55 60 Q50 63 45 60Z" fill={a.hairColour} />}
        {(a.facialHair === "moustache" || a.facialHair === "beard") && (
          <path d="M42 55.5 Q50 51 58 55.5 Q50 54 42 55.5Z" fill={a.hairColour} stroke={a.hairColour} strokeWidth="1.5" strokeLinejoin="round" />
        )}

        {/* ---------- eyes and brows ---------- */}
        <g stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none">
          <path d="M38 37 Q42 35 46 37" />
          <path d="M54 37 Q58 35 62 37" />
        </g>
        {a.eyes === "normal" && (
          <g fill={INK}>
            <circle cx="42" cy="44" r="2.4" />
            <circle cx="58" cy="44" r="2.4" />
          </g>
        )}
        {a.eyes === "happy" && (
          <g stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none">
            <path d="M39 45 Q42 41 45 45" />
            <path d="M55 45 Q58 41 61 45" />
          </g>
        )}
        {a.eyes === "wink" && (
          <g>
            <circle cx="42" cy="44" r="2.4" fill={INK} />
            <path d="M55 44 Q58 46 61 44" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}
        {a.eyes === "sleepy" && (
          <g stroke={INK} strokeWidth="2" strokeLinecap="round">
            <path d="M39 44.5 L45 44.5" />
            <path d="M55 44.5 L61 44.5" />
          </g>
        )}

        {a.gender === "female" && (
          <g>
            <g stroke={INK} strokeWidth="1.4" strokeLinecap="round">
              <path d="M37.5 43 L35 41 M38.5 41.5 L36.5 39" />
              <path d="M62.5 43 L65 41 M61.5 41.5 L63.5 39" />
            </g>
            <g fill="#E86A6A" opacity="0.35">
              <ellipse cx="36" cy="51" rx="4" ry="2.5" />
              <ellipse cx="64" cy="51" rx="4" ry="2.5" />
            </g>
          </g>
        )}

        {/* nose */}
        <path d="M49 47 Q48 51 51.5 51" stroke={skinShade} strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* ---------- mouth ---------- */}
        {a.mouth === "smile" && <path d="M43 57 Q50 63 57 57" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />}
        {a.mouth === "grin" && <path d="M42 56 Q50 65 58 56 Z" fill="#FFFFFF" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />}
        {a.mouth === "laugh" && (
          <g>
            <path d="M41.5 55 Q50 69 58.5 55 Z" fill="#6B1F12" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M46 62 Q50 59 54 62 Q50 65 46 62Z" fill="#E86A6A" />
          </g>
        )}
        {a.mouth === "calm" && <path d="M45 58 L55 58" stroke={INK} strokeWidth="2" strokeLinecap="round" />}
        {a.mouth === "wow" && <ellipse cx="50" cy="58" rx="3" ry="4" fill="#6B1F12" />}

        {/* ---------- hair in front / headwear ---------- */}
        {(a.hair === "lowcut" || a.hair === "braids" || a.hair === "cornrows" || a.hair === "twists" || a.hair === "dreads" || a.hair === "bun") && (
          <path d="M29.5 40 Q28.5 18.5 50 17.5 Q71.5 18.5 70.5 40 Q68 28.5 50 27 Q32 28.5 29.5 40Z" fill={a.hairColour} />
        )}
        {a.hair === "afro" && <path d="M28 38 Q30 21 50 20 Q70 21 72 38 Q64 29 50 29 Q36 29 28 38Z" fill={a.hairColour} />}
        {a.hair === "long" && <path d="M29 42 Q28 17 50 16 Q72 17 71 42 Q67 26 55 25 Q44 30 29 42Z" fill={a.hairColour} />}
        {a.hair === "braids" && (
          <path d="M50 18 L50 27 M40 20 L42 28 M60 20 L58 28" stroke={hairHi} strokeWidth="1.2" strokeLinecap="round" />
        )}
        {a.hair === "cornrows" && (
          <g stroke={hairHi} strokeWidth="1.3" fill="none" strokeLinecap="round">
            <path d="M40 19.5 Q38 28 33 37" />
            <path d="M46 18 Q45 24 44 28" />
            <path d="M54 18 Q55 24 56 28" />
            <path d="M60 19.5 Q62 28 67 37" />
          </g>
        )}
        {a.hair === "bun" && <circle cx="50" cy="12" r="9" fill={a.hairColour} />}
        {a.hair === "twists" && (
          <g fill={a.hairColour}>
            {[34, 40, 46, 52, 58, 64].map((x, i) => (
              <circle key={x} cx={x + 1} cy={i % 2 ? 17 : 15} r="4.2" />
            ))}
          </g>
        )}
        {a.hair === "gele" && (
          <g>
            <path d="M22 35 Q19 10 50 6 Q81 10 78 35 Q64 25 50 27 Q36 25 22 35Z" fill={cloth} />
            <path d="M58 8 Q80 -2 88 16 Q76 13 66 18Z" fill={shade(cloth, 25)} />
            <path d="M30 26 Q50 14 70 26 M34 18 Q50 10 66 18" stroke={clothDark} strokeWidth="1.4" fill="none" />
          </g>
        )}
        {a.hair === "fila" && (
          <g>
            <path d="M28 34 Q29 13 52 12 Q73 13 72 31 Q50 26 28 34Z" fill={cloth} />
            <path d="M30 29 Q50 22 71 27" stroke={GOLD} strokeWidth="2" fill="none" />
            <path d="M62 14 Q78 12 76 26 Q70 18 62 14Z" fill={clothDark} />
          </g>
        )}
        {a.hair === "beanie" && (
          <g>
            <path d="M28 37 Q27 12 50 11 Q73 12 72 37Z" fill={cloth} />
            <rect x="27" y="31" width="46" height="7" rx="3" fill={clothDark} />
            <circle cx="50" cy="9" r="5" fill={shade(cloth, 30)} />
          </g>
        )}
        {a.hair === "bald" && <ellipse cx="42" cy="27" rx="5" ry="2.5" fill="#FFFFFF" opacity="0.22" />}

        {/* ---------- extras ---------- */}
        {a.glasses === "round" && (
          <g stroke={INK} strokeWidth="1.8" fill="rgba(255,255,255,0.18)">
            <circle cx="42" cy="44" r="6" />
            <circle cx="58" cy="44" r="6" />
            <path d="M48 44 L52 44" />
          </g>
        )}
        {a.glasses === "shades" && (
          <g fill={INK}>
            <rect x="34.5" y="39.5" width="14" height="9" rx="3.5" />
            <rect x="51.5" y="39.5" width="14" height="9" rx="3.5" />
            <rect x="47" y="42" width="6" height="2" />
          </g>
        )}
        {a.earrings && (
          <g fill={GOLD}>
            <circle cx="29" cy="52" r="2.6" />
            <circle cx="71" cy="52" r="2.6" />
          </g>
        )}
      </g>
    </svg>
  );
}
