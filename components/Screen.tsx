import { cx } from "@/lib/utils";

/** Mobile-first column. On wide screens the app sits in a phone-width column. */
export function Screen({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("mx-auto flex min-h-screen w-full max-w-md flex-col bg-cream shadow-[0_0_0_1px_#E9DFC4]", className)}>{children}</div>;
}
