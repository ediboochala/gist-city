import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 bg-cream px-8 text-center">
      <h1 className="font-display text-3xl font-extrabold">This bus stop no dey</h1>
      <p className="text-muted">The page you dey find don move or e never exist.</p>
      <Link href="/cities" className="flex h-12 items-center rounded-2xl bg-ink px-6 font-bold text-white">
        Go back to the city
      </Link>
    </main>
  );
}
