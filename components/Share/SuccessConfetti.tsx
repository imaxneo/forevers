"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function SuccessConfetti() {
  useEffect(() => {
    void confetti({
      particleCount: 180,
      spread: 120,
      origin: { y: 0.55 }
    });
  }, []);

  return null;
}
