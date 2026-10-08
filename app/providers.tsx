"use client";

import { ToastProvider } from "@/components/Toast";
import { UserProvider } from "@/lib/user-store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <ToastProvider>{children}</ToastProvider>
    </UserProvider>
  );
}
