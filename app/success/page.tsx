import Link from "next/link";

import { SuccessConfetti } from "@/components/Share/SuccessConfetti";
import { ShareCardGenerator } from "@/components/Share/ShareCardGenerator";

import { getSquareById, getSquareByStripeSessionId } from "@/lib/supabase";
import { formatStartDate } from "@/lib/utils";

export default async function SuccessPage({
  searchParams
}: {
  searchParams: {
    session_id?: string;
    order_identifier?: string;
    order_id?: string;
    square_id?: string;
    demo?: string;
    name1?: string;
    name2?: string;
    position?: string;
    message?: string;
    photo_url?: string;
  };
}) {
  const sessionId = searchParams.session_id;
  const orderIdentifier = searchParams.order_identifier;
  const orderId = searchParams.order_id;
  const squareId = searchParams.square_id;
  const isDemo = searchParams.demo === "1";

  let square = null;
  let name1 = searchParams.name1 ?? "Ahmed";
  let name2 = searchParams.name2 ?? "Sara";
  let position = Number(searchParams.position ?? "1547");
  let message = searchParams.message ?? "Your love is now immortalized on The Love Wall.";
  let photoUrl = searchParams.photo_url ?? null;
  let startDate = "";

  const paymentReference = orderIdentifier || orderId || sessionId;

  if (squareId && !isDemo) {
    square = await getSquareById(squareId);
    if (square) {
      name1 = square.name1;
      name2 = square.name2;
      position = square.grid_position;
      message = square.message;
      photoUrl = square.photo_url;
      startDate = formatStartDate(square.start_date);
    }
  } else if (paymentReference && !isDemo) {
    square = await getSquareByStripeSessionId(paymentReference);
    if (square) {
      name1 = square.name1;
      name2 = square.name2;
      position = square.grid_position;
      message = square.message;
      photoUrl = square.photo_url;
      startDate = formatStartDate(square.start_date);
    }
  }

  return (
    <main className="monument-page section-shell space-y-8 py-12">
      <SuccessConfetti />

      <div className="glass-panel rounded-[2rem] p-8 shadow-card">
        <p className="hero-chip">Reservation Confirmed</p>
        <h1 className="mt-5 font-display text-5xl italic text-white md:text-6xl">Your love is now immortalized ❤</h1>
        <p className="mt-4 text-lg text-text-secondary">
          Welcome to The Love Wall, {name1} &amp; {name2}.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.9fr,1.1fr]">
        <div className="space-y-6">
          <div className="glass-panel rounded-[2rem] p-6 shadow-card">
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-text-muted">Your Square</p>
            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] border border-gold/35 bg-gold/15 text-2xl text-gold-light animate-pulseGlow">
                #{position.toLocaleString()}
              </div>
              <div>
                <p className="text-2xl text-white">
                  {name1} &amp; {name2}
                </p>
                {startDate ? <p className="mt-1 text-sm text-gold-light">Together since {startDate}</p> : null}
                <p className="mt-2 text-text-secondary">Published on the wall and ready to share.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6 shadow-card">
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-gold-light">What&apos;s Next</p>
            <div className="mt-5 space-y-3 text-text-secondary">
              <p>Send your reveal card to your partner.</p>
              <p>Share your square link on social media.</p>
              <p>Return on your anniversary and relive the memory.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/square/${square?.id ?? "seed-1"}`} className="btn-secondary">
                View Your Square
              </Link>
              <Link href="/" className="cta-primary">
                Back to the Wall
              </Link>
            </div>
          </div>
        </div>

        <ShareCardGenerator
          data={{
            id: square?.id ?? "success-card",
            names: `${name1} & ${name2}`,
            startDate:
              startDate ||
              new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date()),
            message,
            photoUrl,
            gridPosition: position
          }}
        />
      </div>
    </main>
  );
}
