"use client";

import Image from "next/image";

import { SquareRecord } from "@/lib/types";
import { buildImageFallback, formatStartDate, positionToRowCol } from "@/lib/utils";

interface SquareModalProps {
  square: SquareRecord | null;
  onClose: () => void;
}

export function SquareModal({ square, onClose }: SquareModalProps) {
  if (!square) {
    return null;
  }

  const { row, col } = positionToRowCol(square.grid_position);

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-black/60 p-4 backdrop-blur md:items-center md:justify-center">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold-light">
              Position #{square.grid_position}
            </p>
            <h3 className="mt-2 font-display text-4xl italic text-white">
              {square.name1} &amp; {square.name2}
            </h3>
            <p className="mt-2 text-text-secondary">
              Together since {formatStartDate(square.start_date)} · Row {row}, Column {col}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-sm text-text-secondary transition hover:border-gold/40 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[220px,1fr]">
          <div className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-white/10">
            <Image
              src={square.photo_url ?? buildImageFallback(`${square.name1} ${square.name2}`)}
              alt={`${square.name1} and ${square.name2}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 text-text-secondary">
              {square.message}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted">Plan</p>
                <p className="mt-2 text-lg capitalize text-white">{square.plan}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted">
                  Views
                </p>
                <p className="mt-2 text-lg text-white">{square.view_count.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
