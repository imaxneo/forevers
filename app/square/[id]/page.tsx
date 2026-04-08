import type { Metadata } from "next";

import { StoryTelegramReveal } from "@/components/Square/StoryTelegramReveal";
import { getSquareById } from "@/lib/supabase";
import { formatCouple } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const square = await getSquareById(params.id);
  return {
    title: square ? `${formatCouple(square)} - The Love Wall` : "Love Story - The Love Wall",
    description: square?.message ?? "A public love story on The Love Wall."
  };
}

export default async function SquarePage({ params }: { params: { id: string } }) {
  const square = await getSquareById(params.id);

  if (!square) {
    return (
      <main className="monument-page section-shell py-20">
        <h1 className="font-display text-5xl italic text-white">This square could not be found.</h1>
      </main>
    );
  }

  return (
    <main className="love-page py-10 md:py-14">
      <div className="section-shell">
        <StoryTelegramReveal square={square} />
      </div>
    </main>
  );
}
