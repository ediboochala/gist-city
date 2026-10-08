"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";
import { cx } from "@/lib/utils";

const ITEMS: { href: string; label: string; icon: IconName; match: (p: string) => boolean }[] = [
  { href: "/cities", label: "City", icon: "home", match: (p) => p === "/cities" || p.startsWith("/city") || p.startsWith("/spot") },
  { href: "/naija", label: "Naija", icon: "map", match: (p) => p.startsWith("/naija") },
  { href: "/host", label: "Start bus", icon: "plus", match: (p) => p.startsWith("/host") },
  { href: "/profile", label: "Me", icon: "user", match: (p) => p.startsWith("/profile") },
];

export function BottomNav() {
  const path = usePathname() ?? "";
  return (
    <nav aria-label="Main" className="sticky bottom-0 z-20 grid grid-cols-4 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)]">
      {ITEMS.map((item) => {
        const active = item.match(path);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cx(
              "flex min-h-[64px] flex-col items-center justify-center gap-1 text-xs",
              active ? "font-bold text-ink" : "text-muted",
            )}
          >
            <Icon name={item.icon} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
