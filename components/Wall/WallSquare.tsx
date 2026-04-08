import { SquareRecord } from "@/lib/types";

export function WallSquareLegend({ squares }: { squares: SquareRecord[] }) {
  const total = squares.length;
  const featured = squares.filter((square) => square.plan === "featured").length;
  const vip = squares.filter((square) => square.plan === "vip").length;

  return (
    <div className="grid gap-3 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 text-sm text-text-secondary md:grid-cols-3">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-text-muted">Reserved</p>
        <p className="mt-2 text-2xl text-white">{total.toLocaleString()}</p>
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-text-muted">Featured</p>
        <p className="mt-2 text-2xl text-gold-light">{featured.toLocaleString()}</p>
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-text-muted">Legacy VIP</p>
        <p className="mt-2 text-2xl text-rose-light">{vip.toLocaleString()}</p>
      </div>
    </div>
  );
}
