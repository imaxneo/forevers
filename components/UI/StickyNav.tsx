"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface StickyNavProps {
  remaining: number;
}

export function StickyNav({ remaining }: StickyNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`top-nav ${scrolled ? "top-nav-scrolled" : "top-nav-top"}`}>
      <div className="top-nav-content">
        <div className="top-nav-brand">
          <p className="top-nav-title">forevrs</p>
          <p className="top-nav-subtitle">Reserve a coordinate that shines like your own star.</p>
        </div>
        <p className="top-nav-counter">{remaining.toLocaleString()} squares remaining/10,000 total</p>
        <Link href="/reserve" className="top-nav-cta">
          Reserve Now
        </Link>
      </div>
    </header>
  );
}
