import Link from "next/link";
import { HOUSE_RULES } from "@/lib/data";

export const metadata = { title: "House rules · Gist City" };

export default function RulesPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 bg-cream px-5 py-8">
      <h1 className="font-display text-3xl font-extrabold">House rules for Gist City</h1>
      <p className="text-muted">Gist City na for fun and real talk. These rules keep everybody safe.</p>
      <ol className="flex flex-col gap-3">
        {HOUSE_RULES.map((r, i) => (
          <li key={r.title} className="rounded-2xl border border-line bg-paper p-4">
            <p className="font-bold">{i + 1}. {r.title}</p>
            <p className="text-sm text-muted">{r.body}</p>
          </li>
        ))}
        <li className="rounded-2xl border border-line bg-paper p-4">
          <p className="font-bold">5. 18 and above only</p>
          <p className="text-sm text-muted">Gist City na for adults. Beer parlour tables dey strictly 18+.</p>
        </li>
      </ol>
      <Link href="/" className="mt-2 flex h-12 items-center justify-center rounded-2xl bg-ink font-bold text-white">Back</Link>
    </main>
  );
}
