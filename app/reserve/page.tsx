import { UniverseExplorer } from "@/components/Stars/UniverseExplorer";
import { getActiveSquares } from "@/lib/supabase";

export default async function ReservePage() {
  const squares = await getActiveSquares();

  return (
    <main className="universe-page">
      <UniverseExplorer squares={squares} mode="reserve" />
    </main>
  );
}
