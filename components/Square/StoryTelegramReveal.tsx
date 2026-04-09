"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CopySquareLinkButton } from "@/components/Share/CopySquareLinkButton";
import { SquareRecord } from "@/lib/types";
import { buildImageFallback, formatCouple, formatStartDate, getDurationLabel } from "@/lib/utils";

const SPOTLIGHT_ID = "f0f14d7b-27b2-4e1f-ac88-8a57d457c93d";

const HEARTS = [
  { x: 6, y: 12, d: 0, s: 15 },
  { x: 16, y: 82, d: 0.25, s: 13 },
  { x: 28, y: 22, d: 0.5, s: 14 },
  { x: 38, y: 90, d: 0.75, s: 12 },
  { x: 52, y: 10, d: 1, s: 16 },
  { x: 64, y: 86, d: 1.15, s: 13 },
  { x: 76, y: 18, d: 1.35, s: 14 },
  { x: 88, y: 80, d: 1.55, s: 12 },
  { x: 94, y: 34, d: 1.75, s: 14 },
  { x: 10, y: 52, d: 1.95, s: 12 }
] as const;

export function StoryTelegramReveal({ square }: { square: SquareRecord }) {
  const [opened, setOpened] = useState(false);
  const [showSideHearts, setShowSideHearts] = useState(true);

  const preferredMessage = `فيكِ شيء جعلني أطمئن بطريقة لم أعرفها من قبل… وكأن قلبي اختارك دون تردد.
أريدك أنتِ، ليس لوقتٍ مؤقت… بل لعمرٍ كامل.
وأدعو الله بكل صدق أن تكوني نصيبي`;

  const looksBrokenText = !square.message || /^[?\s]+$/.test(square.message) || /[ÙØ]{2,}/.test(square.message);
  const displayMessage =
    square.id === SPOTLIGHT_ID ? preferredMessage : looksBrokenText ? preferredMessage : square.message;

  const photoSrc = square.photo_url ?? buildImageFallback(formatCouple(square));

  const sideHearts = useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => {
        const fromLeft = index % 2 === 0;
        return {
          id: `side-heart-${index}`,
          side: fromLeft ? "left" : "right",
          glyph: index % 4 === 0 ? "✦" : "♥",
          tone: index % 3 === 0 ? "rose" : index % 3 === 1 ? "peach" : "gold",
          top: 6 + ((index * 9) % 84),
          size: 18 + ((index * 6) % 15),
          delay: (index % 10) * 0.09,
          duration: 2.2 + (index % 4) * 0.3,
          startX: fromLeft ? -13 - (index % 3) * 2 : 113 + (index % 3) * 2,
          endX: 50 + ((index % 7) - 3) * 0.8,
          endY: 50 + ((index % 9) - 4) * 1.05,
          rotate: fromLeft ? -18 - (index % 4) * 3 : 18 + (index % 4) * 3
        };
      }),
    []
  );

  useEffect(() => {
    const t = window.setTimeout(() => setOpened(true), 950);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setShowSideHearts(false), 4700);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section className="love-card-shell">
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
            ♥
          </span>
        </div>
      ) : null}

      <div className={`love-curtain ${opened ? "is-open" : ""}`} aria-hidden={opened}>
        <span className="love-curtain-panel love-curtain-left" />
        <span className="love-curtain-panel love-curtain-right" />
        <span className="love-curtain-badge">For Two Hearts</span>
      </div>

      <div className="love-card-hearts" aria-hidden>
        {HEARTS.map((heart, index) => (
          <span
            key={`${heart.x}-${heart.y}-${index}`}
            className="love-card-heart"
            style={
              {
                left: `${heart.x}%`,
                top: `${heart.y}%`,
                animationDelay: `${heart.d}s`,
                fontSize: `${heart.s}px`
              } as CSSProperties
            }
          >
            {index % 3 === 0 ? "✦" : "♥"}
          </span>
        ))}
        <span className="love-card-heart-burst">♥</span>
      </div>

      <article className={`love-card love-card-reveal ${opened ? "is-visible" : ""}`}>
        <header className="love-card-head">
          <p className="love-card-badge">بطاقة حب</p>
          <h1 className="love-card-title">{formatCouple(square)}</h1>
          <p className="love-card-sub">
            منذ {formatStartDate(square.start_date)} · {getDurationLabel(square.start_date)}
          </p>
        </header>

        <div className="love-card-photo-wrap">
          <Image src={photoSrc} alt={formatCouple(square)} width={1100} height={1100} className="love-card-photo" priority />
        </div>

        <p className="love-card-message" dir="rtl" lang="ar">
          {displayMessage}
        </p>

        <p className="love-card-meta">⭐ #{square.grid_position.toLocaleString()}</p>

        <footer className="love-card-actions">
          <CopySquareLinkButton squareId={square.id} />
          <Link href="/stars" className="btn-secondary px-4 py-2 text-sm">
            عرض النجوم
          </Link>
        </footer>
      </article>
    </section>
  );
}
