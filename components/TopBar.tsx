import Link from "next/link";
import { Icon } from "./Icon";
import { cx } from "@/lib/utils";

type Tone = "light" | "dark" | "danfo" | "naija" | "salon" | "barber" | "church" | "mosque";

const TONES: Record<Tone, { bar: string; sub: string; back: string }> = {
  light: { bar: "bg-cream text-ink", sub: "text-muted", back: "bg-paper text-ink border border-line" },
  dark: { bar: "bg-ink text-white", sub: "text-[#D9D2C0]", back: "bg-parlour-edge text-white" },
  danfo: { bar: "bg-danfo text-ink", sub: "text-ink/80", back: "bg-ink text-danfo" },
  naija: { bar: "bg-naija text-white", sub: "text-[#CDE7D6]", back: "bg-paper text-naija" },
  salon: { bar: "bg-salon-soft text-ink", sub: "text-salon", back: "bg-paper text-ink" },
  barber: { bar: "bg-barber-soft text-ink", sub: "text-barber", back: "bg-paper text-ink" },
  church: { bar: "bg-church text-white", sub: "text-[#D6D0F0]", back: "bg-church-dark text-white" },
  mosque: { bar: "bg-mosque text-white", sub: "text-[#CDE8E6]", back: "bg-mosque-dark text-white" },
};

interface TopBarProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  tone?: Tone;
  right?: React.ReactNode;
  children?: React.ReactNode;
}

/** Screen header with a back button, title and optional extra content below. */
export function TopBar({ title, subtitle, backHref, backLabel = "Go back", tone = "light", right, children }: TopBarProps) {
  const t = TONES[tone];
  return (
    <header className={cx("sticky top-0 z-20 flex flex-col gap-3 px-4 pb-4 pt-5", t.bar)}>
      <div className="flex items-center gap-3">
        {backHref && (
          <Link href={backHref} aria-label={backLabel} className={cx("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", t.back)}>
            <Icon name="back" />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-xl font-extrabold leading-tight">{title}</h1>
          {subtitle && <p className={cx("truncate text-[13px]", t.sub)}>{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </header>
  );
}

export type { Tone };
