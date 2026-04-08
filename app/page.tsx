import Link from "next/link";

import { FloatingHearts } from "@/components/UI/FloatingHearts";
import { StarNameConstellation } from "@/components/UI/StarNameConstellation";
import { StickyNav } from "@/components/UI/StickyNav";
import { getWallStats } from "@/lib/supabase";

const features = [
  {
    badge: "01",
    title: "Your Star, Your Story",
    text: "Your coordinate becomes a named star in your shared sky, reserved under your names and story."
  },
  {
    badge: "02",
    title: "Only 10,000 Coordinates",
    text: "With a finite wall, every position gains rarity and emotional value over time."
  },
  {
    badge: "03",
    title: "Forever Visible",
    text: "Your memory stays discoverable, shareable, and revisit-ready for every anniversary."
  }
];

const steps = [
  {
    id: "01",
    title: "Choose your coordinate",
    text: "Select the exact place in the galaxy map that represents your relationship."
  },
  {
    id: "02",
    title: "Craft your star profile",
    text: "Add your names, date, photo, and message so your star feels truly personal."
  },
  {
    id: "03",
    title: "Activate your star",
    text: "Complete checkout and publish instantly, so your story starts shining right away."
  }
];

export default async function HomePage() {
  const stats = await getWallStats();

  return (
    <main className="monument-page luxury-shell relative overflow-hidden pb-24">
      <div className="support-strip">
        <div className="section-shell support-strip-inner">
          <p className="support-strip-copy">Enjoying the project? Help keep this constellation alive.</p>
          <a
            href="https://buymeacoffee.com/"
            target="_blank"
            rel="noreferrer"
            className="support-strip-cta"
          >
            Buy Me a Coffee
          </a>
        </div>
      </div>
      <FloatingHearts />
      <StickyNav remaining={stats.total_remaining} />

      <section className="hero-cosmos relative min-h-[78vh] overflow-hidden pb-16 pt-44 md:pb-20 md:pt-48">
        <div className="hero-cosmos-grid" aria-hidden>
          <div className="hero-nebula-cloud hero-nebula-a" />
          <div className="hero-nebula-cloud hero-nebula-b" />
          <div className="hero-nebula-cloud hero-nebula-c" />
          {Array.from({ length: 2 }, (_, copyIndex) =>
            Array.from({ length: 120 }, (_, index) => {
              const left = ((index * 37) % 100) + (copyIndex * 100);
              const top = (index * 29) % 100;
              const size = 2.4 + (index % 4);
              const delay = (index % 12) * 0.45;
              const duration = 3.2 + (index % 5) * 0.9;
              const opacity = 0.34 + (index % 4) * 0.14;
              const starTone = index % 3 === 0 ? "hero-star-near" : index % 3 === 1 ? "hero-star-mid" : "hero-star-far";
              return (
                <span
                  key={`star-${copyIndex}-${index}`}
                  className={`hero-star ${starTone}`}
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    opacity,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                    transform: `rotate(${(index * 23) % 360}deg)`
                  }}
                />
              );
            })
          )}
          <StarNameConstellation />
        </div>

        <div className="section-shell relative z-10 space-y-12">
          <div className="px-1 md:px-4">
            <p className="hero-kicker">Love Constellation</p>
            <h1 className="hero-title hero-title-cosmic hero-title-rose mt-6 max-w-5xl">
              Claim a real place in your private universe of love.
            </h1>
            <p className="hero-copy hero-copy-secondary mt-5 max-w-3xl">
              Reserve one star for your story. Add your names and memory, and keep it shining forever.
            </p>
            <div className="hero-pill-row mt-6 flex flex-wrap gap-2.5 text-xs md:text-sm">
              <span className="cosmos-pill">Finite supply: 10,000 stars only</span>
              <span className="cosmos-pill">Public profile for your memory</span>
              <span className="cosmos-pill">Perfect for gifts and anniversaries</span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/reserve" className="claim-cta px-10 py-4 text-base md:text-lg">
                <span className="claim-cta-label">Claim My Star</span>
                <span className="claim-cta-star" aria-hidden>✦</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="below-hero-sections">
        <section className="section-shell simple-feature-section py-10">
          <div className="mb-6 max-w-3xl">
            <p className="hero-kicker">Why It Converts</p>
            <h2 className="simple-feature-title mt-3">Built to feel premium, rare, and unforgettable.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
          {features.map((item, index) => (
            <article key={item.title} className={`simple-feature-card ${index === 1 ? "simple-feature-card-focus" : ""}`}>
              <p className="simple-feature-badge">{item.badge}</p>
              <h2 className="simple-feature-card-title mt-3">{item.title}</h2>
              <p className="simple-feature-card-copy mt-3">{item.text}</p>
            </article>
          ))}
          </div>
        </section>

        <section className="section-shell py-8">
          <div className="mb-6 max-w-3xl">
            <p className="hero-kicker">3-Step Flow</p>
            <h2 className="mt-3 font-display text-4xl italic text-white md:text-5xl">From idea to a live star in minutes.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
          {steps.map((item) => (
            <article key={item.id} className="step-card">
              <p className="step-index">Step {item.id}</p>
              <h3 className="mt-3 text-2xl text-white">{item.title}</h3>
              <p className="mt-3 text-text-secondary">{item.text}</p>
            </article>
          ))}
          </div>
        </section>

        <section className="section-shell pt-6">
          <div className="glass-panel rounded-3xl px-6 py-8 text-center md:px-10">
            <h3 className="font-display text-5xl italic text-white">Choose your place in the constellation.</h3>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-text-secondary">
              One coordinate. One memory. One star that belongs to your story.
            </p>
            <Link href="/reserve" className="cta-primary mt-7 inline-flex px-8 py-4 text-base">
              Reserve My Coordinate
            </Link>
          </div>
        </section>
      </div>

    </main>
  );
}
