"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { SquareRecord } from "@/lib/types";

const GRID_SIZE = 100;
const TOTAL_STARS = GRID_SIZE * GRID_SIZE;
const BASE_CELL_SIZE = 28;
const MIN_ZOOM = 0.45;
const MAX_ZOOM = 1.85;
const SPOTLIGHT_POSITION = 5050;

const HERO_STAR_POINTS = [
  { x: 50, y: 0 },
  { x: 61, y: 34 },
  { x: 98, y: 35 },
  { x: 69, y: 56 },
  { x: 79, y: 91 },
  { x: 50, y: 70 },
  { x: 21, y: 91 },
  { x: 31, y: 56 },
  { x: 2, y: 35 },
  { x: 39, y: 34 }
] as const;

type Point = {
  x: number;
  y: number;
  alpha: number;
  size: number;
  heat: number;
};

type DragState = {
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

function seededRandom(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let n = Math.imul(t ^ (t >>> 15), 1 | t);
    n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getCameraBounds(width: number, height: number, zoom: number) {
  const worldW = GRID_SIZE * BASE_CELL_SIZE * zoom;
  const worldH = GRID_SIZE * BASE_CELL_SIZE * zoom;
  const centerX = (width - worldW) / 2;
  const centerY = (height - worldH) / 2;

  if (worldW <= width && worldH <= height) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  }

  return {
    minX: worldW > width ? centerX : 0,
    maxX: worldW > width ? -centerX : 0,
    minY: worldH > height ? centerY : 0,
    maxY: worldH > height ? -centerY : 0
  };
}

function clampOffset(offset: { x: number; y: number }, width: number, height: number, zoom: number) {
  const bounds = getCameraBounds(width, height, zoom);
  return {
    x: clamp(offset.x, bounds.minX, bounds.maxX),
    y: clamp(offset.y, bounds.minY, bounds.maxY)
  };
}

function drawHeroStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.beginPath();
  HERO_STAR_POINTS.forEach((point, index) => {
    const px = cx + ((point.x - 50) / 50) * radius;
    const py = cy + ((point.y - 50) / 50) * radius;
    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
}

export function UniverseExplorer({
  squares,
  mode = "reserve"
}: {
  squares: SquareRecord[];
  mode?: "reserve" | "browse";
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const movedRef = useRef(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const hasSpotlight = useMemo(
    () => squares.some((square) => square.grid_position === SPOTLIGHT_POSITION),
    [squares]
  );
  const [selectedPosition, setSelectedPosition] = useState<number | null>(
    hasSpotlight ? SPOTLIGHT_POSITION : null
  );
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const reservedMap = useMemo(() => new Map(squares.map((s) => [s.grid_position, s])), [squares]);

  const points = useMemo<Point[]>(() => {
    const rand = seededRandom(20260408);
    return Array.from({ length: TOTAL_STARS }, (_, i) => {
      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;
      const jitterX = (rand() - 0.5) * 0.78;
      const jitterY = (rand() - 0.5) * 0.78;
      const alpha = 0.38 + rand() * 0.5;
      const size = 0.72 + rand() * 1.08;
      const heat = rand();
      return { x: col + 0.5 + jitterX, y: row + 0.5 + jitterY, alpha, size, heat };
    });
  }, []);

  const selectedSquare = selectedPosition ? reservedMap.get(selectedPosition) ?? null : null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const camera = clampOffset(offset, width, height, zoom);
      const cell = BASE_CELL_SIZE * zoom;
      const worldW = GRID_SIZE * cell;
      const worldH = GRID_SIZE * cell;
      const baseX = (width - worldW) / 2 + camera.x;
      const baseY = (height - worldH) / 2 + camera.y;
      const unit = Math.max(0.56, cell);

      if (camera.x !== offset.x || camera.y !== offset.y) {
        setOffset(camera);
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#01040d";
      ctx.fillRect(0, 0, width, height);

      const startCol = Math.max(0, Math.floor((-baseX) / cell) - 2);
      const endCol = Math.min(GRID_SIZE - 1, Math.ceil((width - baseX) / cell) + 2);
      const startRow = Math.max(0, Math.floor((-baseY) / cell) - 2);
      const endRow = Math.min(GRID_SIZE - 1, Math.ceil((height - baseY) / cell) + 2);

      for (let row = startRow; row <= endRow; row += 1) {
        for (let col = startCol; col <= endCol; col += 1) {
          const i = row * GRID_SIZE + col;
          const p = points[i];
          const px = baseX + p.x * cell;
          const py = baseY + p.y * cell;
          const pos = i + 1;
          const reserved = reservedMap.has(pos);
          const radius = reserved
            ? Math.max(1.05, unit * 0.038 * p.size)
            : Math.max(0.5, unit * 0.013 * p.size);

          if (reserved) {
            const sq = reservedMap.get(pos);
            const ringColor =
              sq?.plan === "vip" ? "rgba(221, 196, 255, 0.56)" :
              sq?.plan === "featured" ? "rgba(255, 190, 230, 0.54)" :
              "rgba(255, 176, 220, 0.48)";
            const fillColor =
              sq?.plan === "vip" ? `rgba(246, 238, 255, ${Math.min(1, p.alpha + 0.18)})` :
              sq?.plan === "featured" ? `rgba(255, 236, 248, ${Math.min(1, p.alpha + 0.14)})` :
              `rgba(255, 230, 244, ${Math.min(1, p.alpha + 0.1)})`;
            const glowColor =
              sq?.plan === "vip" ? "rgba(212, 184, 255, 0.28)" :
              sq?.plan === "featured" ? "rgba(255, 182, 225, 0.26)" :
              "rgba(255, 164, 216, 0.24)";

            const halo = ctx.createRadialGradient(px, py, radius * 0.3, px, py, radius * 5.4);
            halo.addColorStop(0, "rgba(255, 255, 255, 0.24)");
            halo.addColorStop(0.45, glowColor);
            halo.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(px, py, radius * 5.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = ringColor;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(px, py, radius * 2.7, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = fillColor;
            drawHeroStar(ctx, px, py, radius * 1.38);
            ctx.fill();

            if (pos === SPOTLIGHT_POSITION) {
              const highlightHalo = ctx.createRadialGradient(px, py, radius * 0.4, px, py, radius * 8.2);
              highlightHalo.addColorStop(0, "rgba(255, 247, 211, 0.34)");
              highlightHalo.addColorStop(0.42, "rgba(255, 194, 224, 0.24)");
              highlightHalo.addColorStop(1, "rgba(255, 255, 255, 0)");
              ctx.fillStyle = highlightHalo;
              ctx.beginPath();
              ctx.arc(px, py, radius * 8.2, 0, Math.PI * 2);
              ctx.fill();

              ctx.strokeStyle = "rgba(248, 216, 118, 0.9)";
              ctx.lineWidth = 2.2;
              ctx.beginPath();
              ctx.arc(px, py, Math.max(5, radius * 3.2), 0, Math.PI * 2);
              ctx.stroke();
            }

          } else {
            const fillColor =
              p.heat < 0.33
                ? `rgba(202, 229, 255, ${p.alpha})`
                : p.heat < 0.66
                  ? `rgba(235, 245, 255, ${p.alpha})`
                  : `rgba(255, 236, 205, ${p.alpha})`;

            ctx.fillStyle = fillColor;
            drawHeroStar(ctx, px, py, radius);
            ctx.fill();
          }
        }
      }

      if (selectedPosition) {
        const row = Math.floor((selectedPosition - 1) / GRID_SIZE);
        const col = (selectedPosition - 1) % GRID_SIZE;
        const cx = baseX + (col + 0.5) * cell;
        const cy = baseY + (row + 0.5) * cell;

        ctx.strokeStyle = "rgba(247, 214, 106, 0.34)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(6, unit * 0.18), 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(247, 214, 106, 0.95)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(4, unit * 0.12), 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [offset, points, reservedMap, selectedPosition, zoom]);

  const positionFromPointer = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const camera = clampOffset(offset, width, height, zoom);
    const cell = BASE_CELL_SIZE * zoom;
    const worldW = GRID_SIZE * cell;
    const worldH = GRID_SIZE * cell;
    const baseX = (width - worldW) / 2 + camera.x;
    const baseY = (height - worldH) / 2 + camera.y;
    const x = event.clientX - rect.left - baseX;
    const y = event.clientY - rect.top - baseY;
    const col = Math.floor(x / cell);
    const row = Math.floor(y / cell);
    if (col < 0 || col >= GRID_SIZE || row < 0 || row >= GRID_SIZE) return null;
    return row * GRID_SIZE + col + 1;
  };

  const focusOnPosition = (position: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setSelectedPosition(position);
      return;
    }

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const cell = BASE_CELL_SIZE * zoom;
    const worldW = GRID_SIZE * cell;
    const worldH = GRID_SIZE * cell;
    const baseX = (width - worldW) / 2;
    const baseY = (height - worldH) / 2;

    const row = Math.floor((position - 1) / GRID_SIZE);
    const col = (position - 1) % GRID_SIZE;
    const targetX = width / 2 - (baseX + (col + 0.5) * cell);
    const targetY = height / 2 - (baseY + (row + 0.5) * cell);

    const nextOffset = clampOffset({ x: targetX, y: targetY }, width, height, zoom);
    setOffset(nextOffset);
    setSelectedPosition(position);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = Number(searchValue.trim());
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > TOTAL_STARS) {
      setSearchError(`Enter a valid ID between 1 and ${TOTAL_STARS.toLocaleString()}.`);
      return;
    }
    setSearchError(null);
    focusOnPosition(parsed);
  };

  return (
    <div className="universe-shell">
      <div className="universe-atmosphere" aria-hidden>
        <span className="universe-nebula nebula-a" />
        <span className="universe-nebula nebula-b" />
        <span className="universe-nebula nebula-c" />
        <span className="universe-dust" />
      </div>

      <canvas
        ref={canvasRef}
        className={`universe-canvas ${isDragging ? "cursor-grabbing" : "cursor-crosshair"}`}
        onMouseDown={(event) => {
          movedRef.current = false;
          setIsDragging(true);
          setDragState({
            startX: event.clientX,
            startY: event.clientY,
            originX: offset.x,
            originY: offset.y
          });
        }}
        onMouseUp={() => {
          setIsDragging(false);
          setDragState(null);
        }}
        onMouseLeave={() => {
          setIsDragging(false);
          setDragState(null);
        }}
        onMouseMove={(event) => {
          if (!isDragging || !dragState) return;
          const dx = event.clientX - dragState.startX;
          const dy = event.clientY - dragState.startY;
          if (Math.abs(dx) + Math.abs(dy) > 5) movedRef.current = true;

          const canvas = canvasRef.current;
          if (!canvas) return;

          const nextOffset = clampOffset(
            { x: dragState.originX + dx, y: dragState.originY + dy },
            canvas.clientWidth,
            canvas.clientHeight,
            zoom
          );
          setOffset(nextOffset);
        }}
        onClick={(event) => {
          if (movedRef.current) {
            movedRef.current = false;
            return;
          }
          const pos = positionFromPointer(event);
          if (!pos) return;
          setSelectedPosition(pos);
        }}
        onWheel={(event) => {
          event.preventDefault();
        }}
      />

      <div className="universe-topbar">
        <div className="universe-topbar-left">
          <p className="universe-topbar-title">Interactive Star Map</p>
          <p className="universe-topbar-hint">Drag to explore, then tap a star to view or reserve it.</p>
        </div>

        <div className="universe-topbar-stats">
          <span>{TOTAL_STARS.toLocaleString()} total</span>
          <span>{squares.length.toLocaleString()} reserved</span>
          <span>{(TOTAL_STARS - squares.length).toLocaleString()} available</span>
        </div>

        <div className="universe-topbar-actions">
          <form className="universe-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="number"
              min={1}
              max={TOTAL_STARS}
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value);
                if (searchError) setSearchError(null);
              }}
              placeholder="Star ID (1-10000)"
              className="universe-search-input"
            />
            <button type="submit" className="universe-search-btn">
              Find
            </button>
          </form>

          <div className="universe-controls modern">
            <button type="button" onClick={() => setZoom((z) => Math.max(MIN_ZOOM, Number((z - 0.1).toFixed(2))))}>-</button>
            <span>{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoom((z) => Math.min(MAX_ZOOM, Number((z + 0.1).toFixed(2))))}>+</button>
          </div>

          <Link href="/" className="btn-secondary">Home</Link>
          {mode === "browse" ? (
            <Link href="/reserve" className="cta-primary">Reserve</Link>
          ) : (
            <Link href="/stars" className="btn-secondary">Browse</Link>
          )}
        </div>
      </div>

      <div className="universe-selection-panel">
        {searchError ? <p className="universe-search-error">{searchError}</p> : null}
        {selectedPosition ? (
          selectedSquare ? (
            <div className="universe-selected">
              <p>Star #{selectedPosition.toLocaleString()} is reserved by {selectedSquare.name1} &amp; {selectedSquare.name2}</p>
              <Link href={`/square/${selectedSquare.id}`} className="btn-secondary">View Story</Link>
            </div>
          ) : (
            <div className="universe-selected">
              {mode === "browse" ? (
                <>
                  <p>Star #{selectedPosition.toLocaleString()} is available.</p>
                  <Link href={`/reserve?position=${selectedPosition}`} className="cta-primary">Go to Reservation</Link>
                </>
              ) : (
                <>
                  <p>Star #{selectedPosition.toLocaleString()} is available for you.</p>
                  <Link href={`/book?position=${selectedPosition}`} className="cta-primary">Reserve This Star</Link>
                </>
              )}
            </div>
          )
        ) : (
          <p className="text-text-secondary">Select any star to show details here.</p>
        )}
      </div>
    </div>
  );
}
