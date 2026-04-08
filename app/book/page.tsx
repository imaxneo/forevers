import { BookingFlow } from "@/components/Booking/BookingFlow";
import { getActiveSquares } from "@/lib/supabase";

export default async function BookingPage({ searchParams }: { searchParams: { position?: string } }) {
  const activeSquares = await getActiveSquares();
  const takenPositions = activeSquares.map((square) => square.grid_position);
  const position = Number(searchParams.position ?? "1547");

  return (
    <main className="booking-page section-shell py-3">
      <BookingFlow initialPosition={position} takenPositions={takenPositions} />
    </main>
  );
}
