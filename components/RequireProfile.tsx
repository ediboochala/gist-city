"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-store";

/** Sends people without a profile to the welcome screen. */
export function RequireProfile({ children }: { children: React.ReactNode }) {
  const { ready, profile } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (ready && !profile) router.replace("/");
  }, [ready, profile, router]);
  if (!ready || !profile) {
    return <div className="flex min-h-screen items-center justify-center text-muted">Loading the city…</div>;
  }
  return <>{children}</>;
}
