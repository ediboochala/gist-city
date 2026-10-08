"use client";

// Build-your-own avatar. Every option shows a live preview of YOUR avatar with
// that change, so people can see exactly what they're picking.

import { useState } from "react";
import { AvatarArt } from "./AvatarArt";
import { Icon } from "./Icon";
import {
  BG_COLOURS, EYES, FACES, FACIAL_HAIR, GENDERS, GLASSES, HAIRS_FOR, HAIR_COLOURS, LABELS, MOUTHS, OUTFITS, OUTFIT_COLOURS,
  SKIN_TONES, randomAvatar, withGender, type AvatarConfig,
} from "@/lib/avatar";
import { cx } from "@/lib/utils";

type Section = "face" | "hair" | "extras" | "outfit" | "background";
const SECTIONS: { id: Section; label: string }[] = [
  { id: "face", label: "Face" },
  { id: "hair", label: "Hair" },
  { id: "extras", label: "Extras" },
  { id: "outfit", label: "Outfit" },
  { id: "background", label: "Background" },
];

interface AvatarBuilderProps {
  value: AvatarConfig;
  onChange: (a: AvatarConfig) => void;
  name?: string;
}

export function AvatarBuilder({ value, onChange, name = "You" }: AvatarBuilderProps) {
  const [section, setSection] = useState<Section>("face");
  const [spin, setSpin] = useState(0);
  const set = <K extends keyof AvatarConfig>(k: K, v: AvatarConfig[K]) => onChange({ ...value, [k]: v });
  const gender = value.gender ?? "male";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-4">
        <div key={spin} className="animate-pop rounded-full ring-4 ring-paper">
          <AvatarArt a={value} size={132} title={`${name}'s avatar`} />
        </div>
        <button
          type="button"
          onClick={() => {
            onChange(withGender(randomAvatar(), gender));
            setSpin((s) => s + 1);
          }}
          className="flex h-12 items-center gap-2 rounded-2xl border-2 border-ink bg-paper px-4 font-bold active:scale-95"
        >
          <Icon name="shuffle" size={20} /> Shuffle
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-2xl border-2 border-ink bg-paper p-1" role="radiogroup" aria-label="I am">
        {GENDERS.map((g) => (
          <button
            key={g}
            type="button"
            role="radio"
            aria-checked={gender === g}
            onClick={() => gender !== g && onChange(withGender(value, g))}
            className={cx("h-11 rounded-xl font-bold transition-colors active:scale-95", gender === g ? "bg-ink text-white" : "")}
          >
            {LABELS[g]}
          </button>
        ))}
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Avatar parts">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={section === s.id}
            onClick={() => setSection(s.id)}
            className={cx("h-10 shrink-0 rounded-full px-4 text-sm font-bold", section === s.id ? "bg-ink text-white" : "border border-line bg-paper")}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {section === "face" && (
          <>
            <Swatches label="Skin tone" options={SKIN_TONES} value={value.skin} onPick={(v) => set("skin", v)} />
            <Tiles label="Face shape" options={FACES} value={value.face} preview={(o) => ({ ...value, face: o })} onPick={(o) => set("face", o)} />
            <Tiles label="Eyes" options={EYES} value={value.eyes} preview={(o) => ({ ...value, eyes: o })} onPick={(o) => set("eyes", o)} />
            <Tiles label="Mouth" options={MOUTHS} value={value.mouth} preview={(o) => ({ ...value, mouth: o })} onPick={(o) => set("mouth", o)} />
          </>
        )}
        {section === "hair" && (
          <>
            <Tiles label="Hairstyle / headwear" options={HAIRS_FOR[gender]} value={value.hair} preview={(o) => ({ ...value, hair: o })} onPick={(o) => set("hair", o)} />
            <Swatches label="Hair colour" options={HAIR_COLOURS} value={value.hairColour} onPick={(v) => set("hairColour", v)} />
          </>
        )}
        {section === "extras" && (
          <>
            {gender === "male" && (
              <Tiles label="Beard" options={FACIAL_HAIR} value={value.facialHair} preview={(o) => ({ ...value, facialHair: o })} onPick={(o) => set("facialHair", o)} />
            )}
            <Tiles label="Glasses" options={GLASSES} value={value.glasses} preview={(o) => ({ ...value, glasses: o })} onPick={(o) => set("glasses", o)} />
            <Tiles
              label="Earrings"
              options={["none", "gold"] as const}
              value={value.earrings ? "gold" : "none"}
              preview={(o) => ({ ...value, earrings: o === "gold" })}
              onPick={(o) => set("earrings", o === "gold")}
            />
          </>
        )}
        {section === "outfit" && (
          <>
            <Tiles label="Outfit" options={OUTFITS} value={value.outfit} preview={(o) => ({ ...value, outfit: o })} onPick={(o) => set("outfit", o)} />
            <Swatches label="Outfit colour (also for gele, fila and beanie)" options={OUTFIT_COLOURS} value={value.outfitColour} onPick={(v) => set("outfitColour", v)} />
          </>
        )}
        {section === "background" && <Swatches label="Background" options={BG_COLOURS} value={value.bg} onPick={(v) => set("bg", v)} />}
      </div>
    </div>
  );
}

function Tiles<T extends string>({
  label, options, value, preview, onPick,
}: { label: string; options: readonly T[]; value: T; preview: (o: T) => AvatarConfig; onPick: (o: T) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-[13px] font-bold">{label}</legend>
      <div className="grid grid-cols-4 gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onPick(o)}
            className={cx(
              "flex flex-col items-center gap-1 rounded-2xl border-2 bg-paper p-1.5 text-[11px] font-bold transition-transform active:scale-95",
              value === o ? "border-ink" : "border-line",
            )}
          >
            <AvatarArt a={preview(o)} size={52} title={LABELS[o] ?? o} />
            {LABELS[o] ?? (o === "gold" ? "Gold" : o)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Swatches({ label, options, value, onPick }: { label: string; options: readonly string[]; value: string; onPick: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-[13px] font-bold">{label}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={c}
            aria-pressed={value === c}
            onClick={() => onPick(c)}
            className={cx("h-11 w-11 rounded-full border-[3px] transition-transform active:scale-90", value === c ? "border-ink" : "border-paper ring-1 ring-line")}
            style={{ background: c }}
          />
        ))}
      </div>
    </fieldset>
  );
}
