import { UniverseExplorer } from "@/components/Stars/UniverseExplorer";
import { getActiveSquares } from "@/lib/supabase";

export default async function StarsPage() {
  const squares = await getActiveSquares();

  return (
    <main className="universe-page">
      <UniverseExplorer squares={squares} mode="browse" />
    </main>
  );
}
