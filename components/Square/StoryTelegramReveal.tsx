"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

import { CopySquareLinkButton } from "@/components/Share/CopySquareLinkButton";
import { SquareRecord } from "@/lib/types";
import { buildImageFallback, formatCouple, formatStartDate, getDurationLabel } from "@/lib/utils";

export function StoryTelegramReveal({ square }: { square: SquareRecord }) {
  const [opened, setOpened] = useState(false);
  const [showSideHearts, setShowSideHearts] = useState(true);

  const sideHearts = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => {
        const fromLeft = index % 2 === 0;
        const tone = index % 3 === 0 ? "rose" : index % 3 === 1 ? "peach" : "gold";
        const glyph = index % 4 === 0 ? "\u2736" : "\u2665";
        return {
          id: `heart-${index}`,
          side: fromLeft ? "left" : "right",
          tone,
          glyph,
          top: 7 + ((index * 8) % 82),
          size: 19 + ((index * 7) % 16),
          delay: (index % 12) * 0.08,
          duration: 2.4 + (index % 5) * 0.28,
          startX: fromLeft ? -12 - (index % 3) * 2 : 112 + (index % 3) * 2,
          endX: 50 + ((index % 7) - 3) * 0.9,
          endY: 50 + ((index % 9) - 4) * 1.1,
          rotate: fromLeft ? -18 - (index % 4) * 3 : 18 + (index % 4) * 3
        };
      }),
    []
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setOpened(true), 950);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSideHearts(false), 4600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="love-stage">
      {showSideHearts ? (
        <div className="love-side-hearts" aria-hidden>
          {sideHearts.map((heart) => (
            <span
              key={heart.id}
              className={`love-side-heart tone-${heart.tone} ${heart.side === "left" ? "from-left" : "from-right"}`}
              style={
                {
                  left: `${heart.startX}%`,
                  top: `${heart.top}%`,
                  fontSize: `${Math.round(heart.size * 0.9)}px`,
                  animationDelay: `${heart.delay}s`,
                  animationDuration: `${heart.duration}s`,
                  ["--heart-end-x"]: `${heart.endX}%`,
                  ["--heart-end-y"]: `${heart.endY}%`,
                  ["--heart-rot-start"]: `${heart.rotate}deg`
                } as CSSProperties
              }
            >
              {heart.glyph}
            </span>
          ))}
          <span className="love-merge-heart" aria-hidden>
            {"\u2665"}
          </span>
        </div>
      ) : null}

      <div className={`love-curtain ${opened ? "is-open" : ""}`} aria-hidden={opened}>
        <span className="love-curtain-panel love-curtain-left" />
        <span className="love-curtain-panel love-curtain-right" />
        <span className="love-curtain-badge">For Two Hearts</span>
      </div>

      <div className={`love-story-shell ${opened ? "is-visible" : ""}`}>
        <header className="love-story-head">
          <p className="love-story-kicker">Love Archive</p>
          <h1 className="love-story-title">{formatCouple(square)}</h1>
          <p className="love-story-sub">
            Together since {formatStartDate(square.start_date)} | {getDurationLabel(square.start_date)}
          </p>
        </header>

        <div className="love-story-body">
          <div className="love-portrait-frame">
            <Image
              src={square.photo_url ?? buildImageFallback(formatCouple(square))}
              alt={formatCouple(square)}
              width={1100}
              height={1100}
              className="love-portrait"
              priority
            />
          </div>

          <article className="love-letter-card">
            <p className="love-letter-label">Their Message</p>
            <p className="love-letter-copy">{square.message}</p>
          </article>
        </div>

        <section className="love-meta-ribbon">
          <div className="love-meta-item">
            <span>Coordinate</span>
            <strong>#{square.grid_position.toLocaleString()}</strong>
          </div>
          <div className="love-meta-item">
            <span>Published</span>
            <strong>{formatStartDate(square.start_date)}</strong>
          </div>
        </section>

        <footer className="love-actions">
          <CopySquareLinkButton squareId={square.id} />
          <Link href="/reserve" className="cta-primary px-5 py-3 text-sm">
            Reserve Your Star
          </Link>
          <Link href="/stars" className="btn-secondary px-4 py-2 text-sm">
            Browse Stars
          </Link>
        </footer>
      </div>
    </section>
  );
}
