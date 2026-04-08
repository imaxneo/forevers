"use client";

import { useEffect, useRef, useState } from "react";

type HeartParticle = {
  left: string;
  size: number;
  duration: string;
  delay: string;
};

const STATIC_HEARTS: HeartParticle[] = [
  { left: "8%", size: 18, duration: "14s", delay: "0s" },
  { left: "18%", size: 12, duration: "12s", delay: "2s" },
  { left: "31%", size: 20, duration: "16s", delay: "1s" },
  { left: "49%", size: 14, duration: "11s", delay: "4s" },
  { left: "63%", size: 24, duration: "18s", delay: "3s" },
  { left: "78%", size: 16, duration: "13s", delay: "2.5s" },
  { left: "90%", size: 12, duration: "10s", delay: "5s" }
];

function generateBurstHearts(count = 40): HeartParticle[] {
  return Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`,
    size: 12 + Math.random() * 16,
    duration: `${8 + Math.random() * 8}s`,
    delay: `${Math.random() * 0.5}s`
  }));
}

export function FloatingHearts() {
  const [burstHearts, setBurstHearts] = useState<HeartParticle[]>([]);
  const burstKey = useRef(0);
  const clearBurstTimer = useRef<number | null>(null);

  useEffect(() => {
    const handleBurst = () => {
      setBurstHearts(generateBurstHearts(50));
      burstKey.current += 1;
      if (clearBurstTimer.current) {
        window.clearTimeout(clearBurstTimer.current);
      }
      clearBurstTimer.current = window.setTimeout(() => setBurstHearts([]), 10000);
    };

    window.addEventListener("heartsBurst", handleBurst);
    return () => {
      window.removeEventListener("heartsBurst", handleBurst);
      if (clearBurstTimer.current) {
        window.clearTimeout(clearBurstTimer.current);
      }
    };
  }, []);

  const allHearts = [...STATIC_HEARTS, ...burstHearts];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {allHearts.map((heart, index) => (
        <span
          key={`${heart.left}-${index}-${burstKey.current}`}
          className="absolute bottom-[-10%] text-rose/40 blur-[0.3px] hearts-burst"
          style={{
            left: heart.left,
            fontSize: `${heart.size}px`,
            animation: `heart-rise ${heart.duration} linear infinite`,
            animationDelay: heart.delay
          }}
        >
          ❤
        </span>
      ))}
    </div>
  );
}
