"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { SquareModal } from "@/components/Wall/SquareModal";
import { SquareRecord } from "@/lib/types";
import { formatCouple } from "@/lib/utils";

interface WallGridProps {
  squares: SquareRecord[];
}

const GRID_SIZE = 100;

export function WallGrid({ squares }: WallGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const wasFullscreen = useRef(false);
  const [hovered, setHovered] = useState<SquareRecord | null>(null);
  const [selected, setSelected] = useState<SquareRecord | null>(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [spotlightPosition, setSpotlightPosition] = useState<number | null>(null);
  const router = useRouter();

  const squareMap = useMemo(() => new Map(squares.map((square) => [square.grid_position, square])), [squares]);
  const reservedCount = squares.length;
  const featuredCount = squares.filter((square) => square.plan === "featured").length;
  const vipCount = squares.filter((square) => square.plan === "vip").length;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const draw = () => {
      const size = canvas.clientWidth;
      const cell = (size / GRID_SIZE) * zoom;
      const offset = (size - GRID_SIZE * cell) / 2;
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = "#050c21";
      ctx.fillRect(0, 0, size, size);

      for (let index = 1; index <= 10000; index += 1) {
        const row = Math.floor((index - 1) / GRID_SIZE);
        const col = (index - 1) % GRID_SIZE;
        const x = offset + col * cell;
        const y = offset + row * cell;
        const centerX = x + cell / 2;
        const centerY = y + cell / 2;
        const coreRadius = Math.max(0.38, Math.min(cell * 0.2, 2));
        const baseOpacity = 0.2 + ((index * 19) % 17) * 0.022;
        const square = squareMap.get(index);

        if (!square) {
          ctx.fillStyle = `rgba(200, 218, 245, ${Math.min(0.48, baseOpacity)})`;
          ctx.beginPath();
          ctx.arc(centerX, centerY, Math.max(0.4, coreRadius * 0.62), 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        let coreColor = "rgba(218, 236, 255, 0.9)";
        if (square.plan === "featured") {
          coreColor = "rgba(196, 232, 255, 0.95)";
        } else if (square.plan === "vip") {
          coreColor = "rgba(218, 207, 255, 0.95)";
        }
        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(0.45, coreRadius * 0.66), 0, Math.PI * 2);
        ctx.fill();

        if (square?.plan === "featured") {
          ctx.strokeStyle = "rgba(129, 224, 255, 0.76)";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(centerX, centerY, Math.max(coreRadius + 2.2, cell * 0.35), 0, Math.PI * 2);
          ctx.stroke();
        }

        if (square?.plan === "vip") {
          ctx.strokeStyle = "rgba(186, 160, 255, 0.88)";
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(centerX, centerY, Math.max(coreRadius + 2.8, cell * 0.4), 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      if (spotlightPosition) {
        const row = Math.floor((spotlightPosition - 1) / GRID_SIZE);
        const col = (spotlightPosition - 1) % GRID_SIZE;
        const x = offset + col * cell;
        const y = offset + row * cell;
        const centerX = x + cell / 2;
        const centerY = y + cell / 2;
        ctx.strokeStyle = "rgba(198, 234, 255, 0.95)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(4, cell * 0.85), 0, Math.PI * 2);
        ctx.stroke();
      }

      if (hovered) {
        const row = Math.floor((hovered.grid_position - 1) / GRID_SIZE);
        const col = (hovered.grid_position - 1) % GRID_SIZE;
        const x = offset + col * cell;
        const y = offset + row * cell;
        const centerX = x + cell / 2;
        const centerY = y + cell / 2;
        ctx.strokeStyle = "rgba(190, 231, 255, 0.95)";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(3, cell * 0.7), 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const shell = wrapperRef.current;
      if (!shell) {
        return;
      }
      const size = Math.max(260, Math.floor(Math.min(shell.clientWidth, shell.clientHeight)));
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [hovered, squareMap, zoom, isFullscreen, spotlightPosition]);

  useEffect(() => {
    if (!squares.length) {
      return;
    }
    const positions = squares.map((square) => square.grid_position);
    setSpotlightPosition(positions[0]);
    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % positions.length;
      setSpotlightPosition(positions[index]);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [squares]);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const stage = stageRef.current;
      if (!stage) {
        ticking = false;
        return;
      }

      const rect = stage.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      const rawProgress = totalScrollable > 0 ? -rect.top / totalScrollable : 0;
      const nextProgress = Math.min(1, Math.max(0, rawProgress));

      setScrollProgress((prev) => (Math.abs(prev - nextProgress) > 0.002 ? nextProgress : prev));

      const nextFullscreen = nextProgress >= 0.16;
      setIsFullscreen((prev) => (prev === nextFullscreen ? prev : nextFullscreen));
      if (nextFullscreen && !wasFullscreen.current) {
        window.dispatchEvent(new Event("heartsBurst"));
      }
      wasFullscreen.current = nextFullscreen;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getPosition = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return null;
    }
    const rect = canvas.getBoundingClientRect();
    const size = canvas.clientWidth;
    const cell = (size / GRID_SIZE) * zoom;
    const offset = (size - GRID_SIZE * cell) / 2;
    const col = Math.floor((event.clientX - rect.left - offset) / cell);
    const row = Math.floor((event.clientY - rect.top - offset) / cell);
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
      return null;
    }
    return row * GRID_SIZE + col + 1;
  };

  const visualProgress = Math.min(1, scrollProgress / 0.16);
  const framePadding = 26 - 26 * visualProgress;
  const frameRadius = 34 - 34 * visualProgress;
  const frameTranslateY = 46 - 46 * visualProgress;
  const stageGlowOpacity = visualProgress * 0.28;

  return (
    <div ref={stageRef} className="relative h-[220vh]">
      <div className="sticky top-0 z-20 h-screen">
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: stageGlowOpacity,
            background:
              "radial-gradient(circle at 50% 38%, rgba(115,188,255,0.22), rgba(8,16,42,0.62) 56%)"
          }}
        />

        <div className="relative h-full w-full" style={{ padding: `${framePadding}px` }}>
          <div
              className="relative flex h-full flex-col border border-white/15 bg-[rgba(35,28,48,0.72)] shadow-card backdrop-blur-xl transition-[transform,border-radius,padding] duration-300"
              style={{
                borderRadius: `${frameRadius}px`,
                transform: `translate3d(0, ${frameTranslateY}px, 0) scale(${0.96 + visualProgress * 0.04})`
              }}
            >
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 md:px-6 md:pt-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted">Wall Constellation</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((value) => Math.max(0.7, Number((value - 0.15).toFixed(2))))}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-text-secondary transition hover:border-gold/30 hover:text-white"
                >
                  -
                </button>
                <span className="min-w-16 text-center font-mono text-sm text-white">{Math.round(zoom * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoom((value) => Math.min(3.5, Number((value + 0.15).toFixed(2))))}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-text-secondary transition hover:border-gold/30 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            <div className="px-4 pb-4 pt-3 md:px-6 md:pb-6">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-text-secondary">
                  Reserved {reservedCount.toLocaleString()}
                </span>
                <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-gold-light">
                  Featured {featuredCount.toLocaleString()}
                </span>
                <span className="rounded-full border border-rose/30 bg-rose/10 px-3 py-1 text-rose-light">
                  VIP {vipCount.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (!squares.length) return;
                    const random = squares[Math.floor(Math.random() * squares.length)];
                    setSpotlightPosition(random.grid_position);
                    setSelected(random);
                  }}
                  className="btn-secondary px-3 py-1 text-xs"
                >
                  Spotlight story
                </button>
              </div>

              <div
                ref={wrapperRef}
                className="relative flex h-[calc(100vh-15rem)] min-h-[320px] items-center justify-center overflow-hidden border border-white/10 bg-black/35 p-2"
                style={{ borderRadius: `${Math.max(12, frameRadius - 8)}px` }}
              >
                <canvas
                  ref={canvasRef}
                  onMouseMove={(event) => {
                    const position = getPosition(event);
                    const square = position ? squareMap.get(position) ?? null : null;
                    setHovered(square);
                    setTooltip({ x: event.clientX, y: event.clientY });
                  }}
                  onMouseLeave={() => setHovered(null)}
                  onClick={(event) => {
                    const position = getPosition(event);
                    if (!position) {
                      return;
                    }
                    const square = squareMap.get(position);
                    if (square) {
                      setSelected(square);
                      return;
                    }
                    router.push(`/book?position=${position}`);
                  }}
                  className="mx-auto block cursor-pointer touch-none rounded-[1.25rem]"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-xs text-text-secondary">
                <span className="rounded-full border border-white/10 px-3 py-1">Tap any empty square to reserve</span>
                <span className="rounded-full border border-gold/20 px-3 py-1 text-gold-light">Featured glow</span>
                <span className="rounded-full border border-rose/20 px-3 py-1 text-rose-light">VIP legacy border</span>
                {isFullscreen ? (
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-gold-light">
                    Fullscreen mode
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {hovered ? (
        <div
          className="pointer-events-none fixed z-30 rounded-full border border-gold/30 bg-bg-card/95 px-4 py-2 text-sm text-white shadow-glow"
          style={{ left: tooltip.x + 18, top: tooltip.y - 8 }}
        >
          {formatCouple(hovered)} ❤ Since {new Date(hovered.start_date).getFullYear()}
        </div>
      ) : null}

      {selected ? <SquareModal square={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  );
}

