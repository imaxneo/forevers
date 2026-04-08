"use client";

import { useEffect, useRef } from "react";

import { ShareCardData } from "@/lib/types";

export function ShareCardGenerator({ data }: { data: ShareCardData }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, "#221537");
    gradient.addColorStop(1, "#160f24");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.strokeStyle = "#f4be4f";
    ctx.lineWidth = 6;
    ctx.strokeRect(58, 58, 964, 964);

    ctx.fillStyle = "rgba(244,190,79,0.08)";
    for (let i = 0; i < 12; i += 1) {
      ctx.beginPath();
      ctx.arc(120 + i * 80, 180 + (i % 2) * 18, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "italic 76px serif";
    ctx.textAlign = "center";
    ctx.fillText(data.names, 540, 625);
    ctx.font = "36px sans-serif";
    ctx.fillStyle = "#e6d8bd";
    ctx.fillText(`Together since ${data.startDate}`, 540, 690);
    ctx.font = "34px sans-serif";
    ctx.fillStyle = "#f7f0e2";
    wrapText(ctx, data.message, 540, 780, 680, 48);
    ctx.font = "28px sans-serif";
    ctx.fillStyle = "#f4be4f";
    ctx.fillText("❤ The Love Wall · lovewall.com", 540, 965);
  }, [data]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${data.names.replace(/\s+/g, "-").toLowerCase()}-love-wall-card.png`;
    link.click();
  };

  return (
    <div className="glass-panel space-y-4 rounded-[2rem] p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.26em] text-gold-light">Share Card</p>
          <h3 className="mt-2 font-display text-3xl italic text-white">Instagram-ready reveal</h3>
        </div>
        <button type="button" onClick={download} className="cta-primary px-5 py-3 text-sm">
          Download Card
        </button>
      </div>
      <canvas ref={canvasRef} width={1080} height={1080} className="w-full rounded-[1.5rem] border border-white/10" />
    </div>
  );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let lineY = y;
  for (const word of words) {
    const testLine = `${line}${word} `;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, lineY);
      line = `${word} `;
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, lineY);
}
