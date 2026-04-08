"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const GRID_SIZE = 100;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function StarCanvasPicker({
  takenPositions,
  selected,
  onPick
}: {
  takenPositions: number[];
  selected: number;
  onPick: (position: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);
  const takenSet = useMemo(() => new Set(takenPositions), [takenPositions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const cellW = width / GRID_SIZE;
      const cellH = height / GRID_SIZE;

      ctx.clearRect(0, 0, width, height);

      for (let i = 1; i <= GRID_SIZE * GRID_SIZE; i += 1) {
        const row = Math.floor((i - 1) / GRID_SIZE);
        const col = (i - 1) % GRID_SIZE;
        const x = col * cellW + cellW * 0.5;
        const y = row * cellH + cellH * 0.5;
        const reserved = takenSet.has(i);

        if (reserved) {
          ctx.fillStyle = "rgba(255, 140, 186, 0.78)";
          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.8, Math.min(cellW, cellH) * 0.24), 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = "rgba(214, 232, 255, 0.52)";
          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.7, Math.min(cellW, cellH) * 0.18), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const drawRing = (position: number, color: string, radiusScale: number, lineWidth: number) => {
        const row = Math.floor((position - 1) / GRID_SIZE);
        const col = (position - 1) % GRID_SIZE;
        const x = col * cellW + cellW * 0.5;
        const y = row * cellH + cellH * 0.5;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(2, Math.min(cellW, cellH) * radiusScale), 0, Math.PI * 2);
        ctx.stroke();
      };

      if (hoveredPosition && !takenSet.has(hoveredPosition)) {
        drawRing(hoveredPosition, "rgba(190, 229, 255, 0.9)", 0.48, 1.2);
      }

      if (selected > 0) {
        drawRing(selected, "rgba(242, 204, 100, 0.95)", 0.62, 1.8);
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement;
      if (!parent) return;
      // Keep the board visible without forcing page scroll on laptop screens.
      const maxByViewport = Math.floor(window.innerHeight - 280);
      const size = Math.max(240, Math.min(Math.floor(parent.clientWidth), 760, maxByViewport));
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
  }, [hoveredPosition, selected, takenSet]);

  const eventToPosition = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = clamp(Math.floor((x / rect.width) * GRID_SIZE), 0, GRID_SIZE - 1);
    const row = clamp(Math.floor((y / rect.height) * GRID_SIZE), 0, GRID_SIZE - 1);
    return row * GRID_SIZE + col + 1;
  };

  return (
    <canvas
      ref={canvasRef}
      className="mx-auto block w-full cursor-pointer"
      onMouseMove={(event) => {
        const pos = eventToPosition(event);
        setHoveredPosition(pos);
      }}
      onMouseLeave={() => setHoveredPosition(null)}
      onClick={(event) => {
        const pos = eventToPosition(event);
        if (!pos || takenSet.has(pos)) return;
        onPick(pos);
      }}
    />
  );
}
