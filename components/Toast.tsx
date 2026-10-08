"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { cx } from "@/lib/utils";

type ToastTone = "ink" | "owa" | "naija";
interface ToastItem { id: number; text: string; tone: ToastTone }

const ToastContext = createContext<(text: string, tone?: ToastTone) => void>(() => undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const show = useCallback((text: string, tone: ToastTone = "ink") => {
    const id = Date.now() + Math.random();
    setItems((t) => [...t, { id, text, tone }]);
    setTimeout(() => setItems((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div
            key={t.id}
            className={cx(
              "max-w-sm animate-slide-up rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-lg",
              t.tone === "owa" ? "bg-owa" : t.tone === "naija" ? "bg-naija" : "bg-ink",
            )}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
