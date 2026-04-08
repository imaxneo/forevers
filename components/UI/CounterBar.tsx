import { WallStats } from "@/lib/types";

export function CounterBar({ stats }: { stats: WallStats }) {
  const almostFull = stats.total_remaining < 100;

  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary backdrop-blur">
      <span className={almostFull ? "text-rose-light" : "text-gold-light"}>
        {stats.total_remaining.toLocaleString()} squares remaining
      </span>
      <span className="mx-2 text-text-muted">/</span>
      <span>10,000 total</span>
      {almostFull ? <span className="ml-2 text-rose-light">Almost full!</span> : null}
    </div>
  );
}
