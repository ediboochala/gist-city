import { cx } from "@/lib/utils";

interface RouteBarProps {
  stops: string[];
  current: number;
  secondsLeft: number;
  dropAt?: number | null;
}

/** Progress along the bus route. The stop you'll drop at is marked. */
export function RouteBar({ stops, current, secondsLeft, dropAt }: RouteBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${stops.length}, minmax(0, 1fr))` }}>
        {stops.map((s, i) => (
          <div key={s} className="flex min-w-0 flex-col gap-1.5">
            <div className={cx("h-1 rounded-full", i < current ? "bg-danfo" : i === current ? "bg-white" : "bg-[#3D382E]")} />
            <span className={cx("truncate text-[11px]", i === current ? "font-bold text-white" : "text-[#A69E8B]", dropAt === i && "text-[#FFB59A]")}>
              {dropAt === i ? `Drop · ${s}` : s}
            </span>
          </div>
        ))}
      </div>
      {current < stops.length - 1 && (
        <p className="text-[12px] text-[#D9D2C0]">
          Next stop in {secondsLeft}s: <span className="font-bold text-white">{stops[current + 1]}</span>
        </p>
      )}
    </div>
  );
}
